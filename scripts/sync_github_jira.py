#!/usr/bin/env python3
"""
MediTrack — Automatisation GitHub <-> Jira (sans avoir besoin d'ouvrir Antigravity IDE)
======================================================================================
Synchronise automatiquement les statuts Jira (A faire -> En cours -> In Review -> Termine)
en fonction de votre activite reelle sur GitHub (branches, Pull Requests, merges),
pour maintenir un Burndown Chart Jira propre et coherent jour apres jour.

Regles automatiques :
  1. Branche GitHub `feature/MT-XX-...` (ou commit MT-XX) -> Jira passe a "En cours" (In Progress)
  2. Pull Request ouverte mentionnant `MT-XX`             -> Jira passe a "In Review" (si colonne presente) ou ajoute le label `in-review` + "En cours"
  3. Pull Request mergee (ou Issue fermee) pour `MT-XX`   -> Jira passe a "Termine(e)" (Done) + retire `in-review`

Execute automatiquement toutes les 30 minutes via Windows Task Scheduler (tache `MediTrack-GitHub-Jira-Sync`).
"""
import json
import os
import re
import subprocess
import sys
from datetime import datetime

TWG = r"C:\Users\DELL\AppData\Local\Programs\twg\bin\twg.exe"
SITE = "lhassanoubihi.atlassian.net"
REPO = "lhassanoubihi/meditrack"
KEY_RE = re.compile(r"\bMT-(\d+)\b", re.IGNORECASE)
LOG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sync.log")


def log(msg):
    line = msg.rstrip()
    print(line)
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as fp:
            fp.write(line + "\n")
    except Exception:
        pass


def run_json(cmd):
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        return None
    try:
        return json.loads(res.stdout)
    except Exception:
        return None


def get_jira_transitions(key):
    data = run_json([TWG, "jira", "workitem", "transition", "--id", key, "--site", SITE, "-o", "json"])
    if not data or "data" not in data:
        return []
    return data["data"].get("transitions", [])


def transition_jira(key, target_names):
    transitions = get_jira_transitions(key)
    for t in transitions:
        name = (t.get("toName") or t.get("name") or "").lower()
        for target in target_names:
            if target in name:
                subprocess.run([
                    TWG, "jira", "workitem", "transition",
                    "--id", key, "--transition-id", str(t["id"]),
                    "--site", SITE, "-o", "json"
                ], capture_output=True, text=True, encoding="utf-8")
                return t.get("toName") or t.get("name")
    return None


def main():
    log(f"[{datetime.now().isoformat(timespec='seconds')}] Starting MediTrack GitHub -> Jira sync...")

    branches = run_json(["gh", "api", f"repos/{REPO}/branches", "--paginate"]) or []
    prs = run_json([
        "gh", "pr", "list", "--repo", REPO, "--state", "all", "--limit", "100",
        "--json", "number,title,headRefName,state,url,mergedAt"
    ]) or []

    jira_data = run_json([
        TWG, "jira", "workitem", "query",
        "--jql", "project = MT AND issuetype = Story",
        "--limit", "50", "--site", SITE, "-o", "json"
    ])
    if not jira_data:
        log("ERROR: Could not query Jira MT issues.")
        sys.exit(1)

    jira_status = {}
    for issue in jira_data.get("data", {}).get("issues", []):
        jira_status[issue["key"]] = (issue.get("status", {}).get("name") or "").lower()

    desired = {}
    for b in branches:
        bname = b.get("name", "")
        for m in KEY_RE.finditer(bname):
            key = f"MT-{m.group(1)}"
            if key in jira_status and key not in desired:
                desired[key] = ("in_progress", f"Branch `{bname}`")

    for pr in prs:
        text = f"{pr.get('title', '')} {pr.get('headRefName', '')}"
        state = (pr.get("state") or "").upper()
        url = pr.get("url", "")
        for m in KEY_RE.finditer(text):
            key = f"MT-{m.group(1)}"
            if key not in jira_status:
                continue
            if state == "MERGED":
                desired[key] = ("done", url)
            elif state == "OPEN" and desired.get(key, ("",))[0] != "done":
                desired[key] = ("in_review", url)

    changes = 0
    for key, (target, ref) in desired.items():
        cur = jira_status.get(key, "")
        if target == "done" and "termin" not in cur and "done" not in cur:
            moved = transition_jira(key, ["termin", "done"])
            subprocess.run([
                TWG, "jira", "workitem", "update", "--id", key,
                "--remove-labels", "in-review", "--site", SITE, "-o", "json"
            ], capture_output=True)
            log(f"  {key}: {cur} -> {moved} (PR merged: {ref})")
            changes += 1
        elif target == "in_review" and "termin" not in cur and "done" not in cur:
            moved = transition_jira(key, ["review", "revue"])
            if not moved and "cours" not in cur and "progress" not in cur:
                moved = transition_jira(key, ["cours", "progress"])
            subprocess.run([
                TWG, "jira", "workitem", "update", "--id", key,
                "--add-labels", "in-review", "--site", SITE, "-o", "json"
            ], capture_output=True)
            log(f"  {key}: marked In Review (PR open: {ref})")
            changes += 1
        elif target == "in_progress" and ("faire" in cur or "to do" in cur or "idée" in cur):
            moved = transition_jira(key, ["cours", "progress"])
            log(f"  {key}: {cur} -> {moved} ({ref})")
            changes += 1

    log(f"Sync finished. {changes} ticket(s) updated.")


if __name__ == "__main__":
    main()

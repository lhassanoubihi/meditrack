# Guide SCRUM sous Jira — MediTrack (Backlog Officiel 5 Sprints)

> **Filière :** ILSI-4A — ENSAM Meknès (2026 / 2027) · **Encadrant :** Pr. S. Amri  
> **Équipe Full-Stack :** **Rida Dandane** & **Lhassan Oubihi**  
> **Board Jira (`MED`) :** https://lhassanoubihi.atlassian.net/jira/software/projects/MED/boards/68  
> **Dépôt GitHub :** https://github.com/lhassanoubihi/meditrack  
> **Backlog officiel :** [`meditrack_backlog_officiel.csv`](./meditrack_backlog_officiel.csv) *(7 Epics · 34 Stories · 103 Sous-tâches · 140 Story Points)*

---

## 1. Mode de Travail (100 % Interactif via Antigravity — Zéro Script Arrière-plan)

1. Aucun script automatique ne tourne sur le PC : chaque jour, **Lhassan** et **Rida** ouvrent Antigravity et exécutent les tâches de leur journée selon :
   - [PLANNING_GLOBAL_21_JOURS.md](../planning/PLANNING_GLOBAL_21_JOURS.md)
   - [PLANNING_LHASSAN.md](../planning/PLANNING_LHASSAN.md)
   - [PLANNING_RIDA.md](../planning/PLANNING_RIDA.md)
2. Chaque agent vérifie la date réelle avant de démarrer, crée la branche `feature/MED-XX-...` depuis `develop`, passe le ticket à **`En cours`**, ouvre la Pull Request (**`In Review`**), puis le binôme relit, merge sur `develop` et passe le ticket à **`Terminé(e)`** (`Done`).

---

## 2. Les 5 Sprints (22 nov. → 13 déc. 2026 · 3 semaines)

| Sprint | Dates | Epics | Stories Jira (`MED`) | GitHub Issues | Points |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Sprint 1** *(Actif)* | 22–25 nov. | `E1` (`MED-1`) | `MED-8` → `MED-14` (`US-01` → `US-07`) | `#1` → `#7` | 30 |
| **Sprint 2** | 26–29 nov. | `E2` (`MED-2`) | `MED-15` → `MED-21` (`US-08` → `US-14`) | `#8` → `#14` | 28 |
| **Sprint 3** | 30 nov.–03 déc. | `E3` (`MED-3`) | `MED-22` → `MED-28` (`US-15` → `US-21`) | `#15` → `#21` | 25 |
| **Sprint 4** | 04–07 déc. | `E4` (`MED-4`), `E5` (`MED-5`) | `MED-29` → `MED-35` (`US-22` → `US-28`) | `#22` → `#28` | 29 |
| **Sprint 5** | 08–13 déc. | `E6` (`MED-6`), `E7` (`MED-7`) | `MED-36` → `MED-41` (`US-29` → `US-34`) | `#29` → `#34` | 28 |
| **TOTAL** | **21 jours** | **7 Epics** | **34 Stories + 103 Sous-tâches** | **34 Issues** | **140 pts** |

---

## 3. Checklist Finale Pr. S. Amri (Soutenance)
1. [ ] `docker-compose up --build` démarre sans erreur sur machine propre (`US-33`).
2. [ ] Interface Angular accessible sur `http://localhost:4200`.
3. [ ] Connexion multi-rôles + 2FA fonctionnelle (`US-03` → `US-06`).
4. [ ] Scénario métier complet : Dossier Patient RGPD → RDV FullCalendar → Consultation + Ordonnance PDF → Pharmacie/Stock → Dashboard Chart.js.
5. [ ] Persistance MongoDB vérifiée + journal d'audit `AuditLog`.
6. [ ] Board Jira présenté avec les **5 Sprints** et **Burndown Charts** documentés.
7. [ ] Couverture Jest `>= 60%` (`US-32`) + Cypress E2E (`US-31`) + CI GitHub Actions verte (`US-02`).

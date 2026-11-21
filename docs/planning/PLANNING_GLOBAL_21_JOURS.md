# Planning Global Synchronisé sur 21 Jours — MediTrack (Full-Stack 50/50)

> **Période totale :** **Dimanche 22 nov. 2026 → Dimanche 13 déc. 2026** (3 Sprints × 7 jours)  
> **Binôme Full-Stack :** **Lhassan Oubihi** (12 User Stories) & **Rida Dandane** (12 User Stories)  
> **Board Jira (`MT`) :** https://lhassanoubihi.atlassian.net/jira/software/projects/MT/boards/67  
> **Dépôt GitHub :** https://github.com/lhassanoubihi/meditrack  
> **Plans individuels prêts pour Antigravity :**
> - Plan & Prompt Agent de **Lhassan Oubihi** : [`PLANNING_LHASSAN.md`](./PLANNING_LHASSAN.md)
> - Plan & Prompt Agent de **Rida Dandane** : [`PLANNING_RIDA.md`](./PLANNING_RIDA.md)

---

## 1. Règle d'Or pour un Burndown Chart Jira Cohérent

Pour éviter un Burndown Chart « en falaise » (tout fermé le dernier jour) :
1. **Un seul lot de tâches par jour** selon le calendrier ci-dessous — l'agent Antigravity doit **vérifier la date du jour** avant de coder et **ne pas anticiper les jours suivants**.
2. **Cycle exact de chaque ticket `MT-XX` :**
   - Matin (branche `feature/MT-XX-...` créée depuis `develop`) → **`En cours`**
   - Fin de tâche (Pull Request ouverte vers `develop`) → **`In Review`** *(ou label `in-review`)*
   - Soir (Revue croisée par le binôme + Merge PR + Issue GitHub fermée) → **`Terminé(e)`** (`Done`)
3. **Zéro conflit Git :** Lhassan et Rida ne travaillent jamais sur le même module au même moment (fichiers séparés Backend/Frontend chaque jour).

---

## 2. Calendrier Jour par Jour (22 nov. → 13 déc. 2026)

### Sprint 1 — Semaine 1 (22 nov. → 29 nov. 2026) · 10 Stories (51 pts)
> **Objectif :** Stack MEAN + Docker, Auth JWT + 2FA, RBAC, UML/BPMN et Module Dossier Patient complet (RGPD AES-256 + UI Angular).

| Jour | Date | Lhassan Oubihi (Ticket + Branche) | Rida Dandane (Ticket + Branche) | Revues Croisées (PR → `develop`) | Reste idéal (Burndown) |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **J1** | **Dim 22 nov.** | **MT-8** (`#1`) Architecture MEAN + Docker<br>`feature/MT-8-docker-mean-base` | **MT-9** (`#2`) Init Angular 17 + Material<br>`feature/MT-9-angular17-setup` | Lhassan merge `MT-9` · Rida merge `MT-8` | **10 → 8** *(41 pts)* |
| **J2** | **Lun 23 nov.** | **MT-10** (`#3`) Backend Auth JWT + 2FA<br>`feature/MT-10-auth-jwt-2fa` | **MT-11** (`#4`) Backend Users & RBAC<br>`feature/MT-11-users-rbac` | Lhassan merge `MT-11` · Rida merge `MT-10` | **8 → 6** *(31 pts)* |
| **J3** | **Mar 24 nov.** | **MT-12** (`#5`) UI Angular Login/2FA/Profil<br>`feature/MT-12-ui-auth-2fa` | **MT-13** (`#6`) Diagrammes UML & BPMN<br>`feature/MT-13-uml-bpmn-docs` | Lhassan merge `MT-13` · Rida merge `MT-12` | **6 → 4** *(23 pts)* |
| **J4** | **Mer 25 nov.** | **MT-15** (`#8`) *(préparation + tests)* / Revue<br>`feature/MT-15-api-patients-crud` *(démarré)* | **MT-14** (`#7`) Modèle Patient + AES-256<br>`feature/MT-14-patient-model-rgpd` | Lhassan merge `MT-14` *(débloque `MT-15`)* | **4 → 3** *(18 pts)* |
| **J5** | **Jeu 26 nov.** | **MT-15** (`#8`) API CRUD Patient + Jest *(fin)*<br>`feature/MT-15-api-patients-crud` | **MT-17** (`#10`) UI Formulaires Patient *(démarré)*<br>`feature/MT-17-ui-patient-forms` | Rida merge `MT-15` *(débloque `MT-16`/`MT-17`)* | **3 → 2** *(13 pts)* |
| **J6** | **Ven 27 nov.** | **MT-16** (`#9`) UI Liste, Recherche & Fiche<br>`feature/MT-16-ui-patient-list` | **MT-17** (`#10`) UI Formulaires Patient *(fin)*<br>`feature/MT-17-ui-patient-forms` | Lhassan merge `MT-17` · Rida merge `MT-16` | **2 → 0** *(0 pt)* |
| **J7** | **Sam 28 / Dim 29 nov.** | **Cérémonie Fin Sprint 1** : Démo Docker, tag `v0.1-sprint1`, capture Burndown Chart, **Complete Sprint 1 → Start Sprint 2** | **Cérémonie Fin Sprint 1** : Animation Sprint Review + Rétrospective (SM), vérification Jira | Merge `develop` → `main` | **0** *(Clôture Sprint 1)* |

---

### Sprint 2 — Semaine 2 (29 nov. → 06 déc. 2026) · 9 Stories (48 pts)
> **Objectif :** Rendez-vous anti-conflit, Calendrier interactif, Notifications Email/SMS, Consultations, Ordonnances PDF + QR et Module Pharmacie.

| Jour | Date | Lhassan Oubihi (Ticket + Branche) | Rida Dandane (Ticket + Branche) | Revues Croisées (PR → `develop`) | Reste idéal (Burndown) |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **J8** | **Lun 30 nov.** | **MT-18** (`#11`) API RDV & Conflits (409)<br>`feature/MT-18-api-appointments` | **MT-19** (`#12`) Notifs Nodemailer + Twilio<br>`feature/MT-19-notifications-email-sms` | Lhassan merge `MT-19` · Rida merge `MT-18` | **9 → 7** *(38 pts)* |
| **J9** | **Mar 01 déc.** | **MT-20** (`#13`) UI Calendrier Interactif RDV<br>`feature/MT-20-ui-calendar-rdv` | **MT-21** (`#14`) UI Gestion Statuts RDV<br>`feature/MT-21-ui-rdv-status` | Lhassan merge `MT-21` · Rida merge `MT-20` | **7 → 5** *(25 pts)* |
| **J10** | **Mer 02 déc.** | **MT-23** (`#16`) *(démarré après MT-22)* / Revue<br>`feature/MT-23-prescription-pdf-qr` | **MT-22** (`#15`) API Consultations<br>`feature/MT-22-api-consultations` | Lhassan merge `MT-22` *(débloque `MT-23`)* | **5 → 4** *(20 pts)* |
| **J11** | **Jeu 03 déc.** | **MT-23** (`#16`) Ordonnance PDF + QR *(fin)*<br>`feature/MT-23-prescription-pdf-qr` | **MT-24** (`#17`) API Pharmacie & Stock<br>`feature/MT-24-api-pharmacy-stock` | Lhassan merge `MT-24` · Rida merge `MT-23` | **4 → 2** *(10 pts)* |
| **J12** | **Ven 04 déc.** | **MT-25** (`#18`) UI Médecin Consultation/PDF<br>`feature/MT-25-ui-consultation-pdf` | **MT-26** (`#19`) UI Pharmacien Ordonnances/Stock<br>`feature/MT-26-ui-pharmacy` | Lhassan merge `MT-26` · Rida merge `MT-25` | **2 → 0** *(0 pt)* |
| **J13–J14** | **Sam 05 / Dim 06 déc.** | **Cérémonie Fin Sprint 2** : Démo flux clinique complet, tag `v0.2-sprint2`, capture Burndown, **Complete Sprint 2 → Start Sprint 3** | **Cérémonie Fin Sprint 2** : Animation Review + Rétrospective (SM), validation Burndown | Merge `develop` → `main` | **0** *(Clôture Sprint 2)* |

---

### Sprint 3 — Semaine 3 (06 déc. → 13 déc. 2026) · 5 Stories (23 pts)
> **Objectif :** Statistiques MongoDB & Dashboard Chart.js, Tests Jest ≥ 60%, Tests E2E Cypress, Docker final, Rapport 15–20 pages et Soutenance.

| Jour | Date | Lhassan Oubihi (Ticket + Branche) | Rida Dandane (Ticket + Branche) | Revues Croisées (PR → `develop`) | Reste idéal (Burndown) |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **J15** | **Lun 07 déc.** | **MT-27** (`#20`) API Stats Agrégations MongoDB<br>`feature/MT-27-api-stats-dashboard` | **MT-29** (`#22`) *(préparation tests Jest)*<br>`feature/MT-29-tests-coverage-docker` | Rida merge `MT-27` *(débloque `MT-28`)* | **5 → 4** *(18 pts)* |
| **J16** | **Mar 08 déc.** | **MT-28** (`#21`) UI Dashboard Chart.js<br>`feature/MT-28-ui-dashboard-charts` | **MT-29** (`#22`) Tests Jest ≥ 60% & Docker *(fin)*<br>`feature/MT-29-tests-coverage-docker` | Lhassan merge `MT-29` · Rida merge `MT-28` | **4 → 2** *(8 pts)* |
| **J17** | **Mer 09 déc.** | **MT-31** (`#24`) Rapport (Architecture, Code, Docker)<br>`feature/MT-31-rapport-demo` *(partie Lhassan)* | **MT-30** (`#23`) Tests E2E Cypress complets<br>`feature/MT-30-cypress-e2e` | Lhassan merge `MT-30` | **2 → 1** *(3 pts)* |
| **J18–J19** | **Jeu 10 / Ven 11 déc.** | **MT-31** (`#24`) Finalisation Rapport 15–20p + Annexe `docker-compose.yml`<br>`feature/MT-31-rapport-demo` | **MT-31** (`#24`) Captures Jira (Burndown, Vélocité) + Relecture UML/BPMN | Rida merge `MT-31` | **1 → 0** *(0 pt)* |
| **J20–J21** | **Sam 12 / Dim 13 déc.** | **Clôture Projet & Soutenance** : Merge `develop` → `main`, tag `v1.0-final`, `docker-compose up --build`, checklist 7/7 Pr. S. Amri | **Clôture Sprint 3** : **Complete Sprint 3**, export rapport Jira final, répétition démo machine | Merge final `develop` → `main` | **0** *(Projet livré)* |

---

## 3. Protocole Fin de Sprint (À exécuter les J7, J13–14, J20–21)

```bash
# 1. Tester toute la stack Docker depuis zéro
docker-compose down -v && docker-compose up --build

# 2. Vérifier la couverture de tests backend (>= 60% exigé en Sprint 3)
cd backend && npm test

# 3. Publier la release stable sur main avec un tag officiel
git checkout main && git pull origin main
git merge develop --no-ff -m "chore(release): close Sprint X"
git tag -a v0.X-sprintX -m "MediTrack Sprint X"
git push origin main --tags
```
4. Prendre une capture d'écran du **Burndown Chart** et du **Velocity Chart** dans Jira (`docs/rapport/`).
5. Cliquer sur **Terminer le sprint** dans Jira, puis **Démarrer le sprint suivant**.

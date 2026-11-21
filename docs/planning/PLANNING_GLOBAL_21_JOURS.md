# Planning Global Synchronisé sur 21 Jours — MediTrack (Modules Complets en Parallèle)

> **Période totale :** **Dimanche 22 nov. 2026 → Dimanche 13 déc. 2026** (3 Sprints × 7 jours)  
> **Organisation logique :** Chaque développeur possède des **modules complets de bout en bout (Backend + Frontend)** et travaille **100 % en parallèle** avec son binôme — **zéro travail en série, zéro blocage mutuel**.  
> **Board Jira (`MT`) :** https://lhassanoubihi.atlassian.net/jira/software/projects/MT/boards/67  
> **Dépôt GitHub :** https://github.com/lhassanoubihi/meditrack  
> **Plans individuels prêts pour Antigravity :**
> - Plan & Prompt Agent de **Lhassan Oubihi** : [`PLANNING_LHASSAN.md`](./PLANNING_LHASSAN.md)
> - Plan & Prompt Agent de **Rida Dandane** : [`PLANNING_RIDA.md`](./PLANNING_RIDA.md)

---

## 1. Répartition Logique par Modules Verticaux (Back + Front tous les deux)

| Sprint | Pôle de **Lhassan Oubihi** *(Back + Front · 12 Stories)* | Pôle de **Rida Dandane** *(Back + Front · 12 Stories)* |
| :---: | :--- | :--- |
| **Sprint 1** *(Sem. 1)* | **Socle Docker + Module Auth 2FA / Users / RBAC complet + UML/BPMN**<br>`MT-8` (Docker/MEAN), `MT-10` (Back Auth 2FA), `MT-11` (Back RBAC), `MT-12` (Front Auth/2FA), `MT-13` (UML/BPMN) | **Socle Angular 17 + Module Dossier Patient RGPD complet**<br>`MT-9` (Init Angular 17), `MT-14` (Back Modèle AES-256), `MT-15` (Back API CRUD Patient), `MT-16` (Front Liste/Fiche), `MT-17` (Front Formulaires) |
| **Sprint 2** *(Sem. 2)* | **Module Complet Rendez-vous, Notifications & Calendrier**<br>`MT-18` (Back API RDV anti-conflit), `MT-19` (Back Email/SMS), `MT-20` (Front Calendrier), `MT-21` (Front Statuts RDV) | **Module Complet Consultations, Ordonnances PDF & Pharmacie**<br>`MT-22` (Back Consultations), `MT-23` (Back Ordonnance PDF + QR), `MT-24` (Back Pharmacie/Stock), `MT-25` (Front Consultation), `MT-26` (Front Pharmacie) |
| **Sprint 3** *(Sem. 3)* | **Module Complet Statistiques & Tableaux de Bord + Rapport**<br>`MT-27` (Back Agrégations MongoDB), `MT-28` (Front Dashboard Chart.js), `MT-31` (Rapport 15–20p & Démo, partagé) | **Pôle Complet Qualité, Tests (Back + Front) & Docker Final**<br>`MT-29` (Back Tests Jest ≥ 60%, HTTPS, Docker), `MT-30` (Front Tests E2E Cypress) + contribution `MT-31` |

---

## 2. Calendrier Jour par Jour (22 nov. → 13 déc. 2026)

### Sprint 1 — Semaine 1 (22 nov. → 29 nov. 2026) · 10 Stories (51 pts)

| Jour | Date | Lhassan Oubihi *(Auth / RBAC / Docker / UML)* | Rida Dandane *(Angular / Dossier Patient RGPD)* | Revues Croisées (PR → `develop`) | Reste idéal (Burndown) |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **J1** | **Dim 22 nov.** | **MT-8** (`#1`) Architecture MEAN + Docker<br>`feature/MT-8-docker-mean-base` | **MT-9** (`#2`) Init Angular 17 + Material<br>`feature/MT-9-angular17-setup` | Lhassan merge `MT-9` · Rida merge `MT-8` | **10 → 8** *(41 pts)* |
| **J2** | **Lun 23 nov.** | **MT-10** (`#3`) Backend Auth JWT + 2FA<br>`feature/MT-10-auth-jwt-2fa` | **MT-14** (`#7`) Modèle Patient + AES-256 RGPD<br>`feature/MT-14-patient-model-rgpd` | Lhassan merge `MT-14` · Rida merge `MT-10` | **8 → 6** *(31 pts)* |
| **J3** | **Mar 24 nov.** | **MT-11** (`#4`) Backend Users & RBAC<br>`feature/MT-11-users-rbac` | **MT-15** (`#8`) API CRUD Patient + Jest<br>`feature/MT-15-api-patients-crud` | Lhassan merge `MT-15` · Rida merge `MT-11` | **6 → 4** *(21 pts)* |
| **J4** | **Mer 25 nov.** | **MT-12** (`#5`) Front UI Login / 2FA / Profil<br>`feature/MT-12-ui-auth-2fa` | **MT-16** (`#9`) Front Liste & Fiche Patient *(partie 1/2)*<br>`feature/MT-16-ui-patient-list` | Rida merge `MT-12` | **4 → 3** *(16 pts)* |
| **J5** | **Jeu 26 nov.** | **MT-13** (`#6`) Diagrammes UML & BPMN<br>`feature/MT-13-uml-bpmn-docs` | **MT-16** (`#9`) Front Liste & Fiche Patient *(partie 2/2)*<br>`feature/MT-16-ui-patient-list` | Lhassan merge `MT-16` · Rida merge `MT-13` | **3 → 1** *(5 pts)* |
| **J6** | **Ven 27 nov.** | **Tests d'intégration Auth ↔ Patients** & Revue `MT-17` | **MT-17** (`#10`) Front Formulaires Patient (`FormArray`)<br>`feature/MT-17-ui-patient-forms` | Lhassan merge `MT-17` | **1 → 0** *(0 pt)* |
| **J7** | **Sam 28 / Dim 29 nov.** | **Fin Sprint 1** : `docker-compose up --build`, tag `v0.1-sprint1`, merge `develop` → `main` | **Fin Sprint 1 (SM)** : Review, Rétro, capture Burndown Chart, **Complete Sprint 1 → Start Sprint 2** | Merge `develop` → `main` | **0** *(Clôture)* |

---

### Sprint 2 — Semaine 2 (29 nov. → 06 déc. 2026) · 9 Stories (48 pts)

| Jour | Date | Lhassan Oubihi *(Module Complet Rendez-vous)* | Rida Dandane *(Modules Consultations + PDF + Pharmacie)* | Revues Croisées (PR → `develop`) | Reste idéal (Burndown) |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **J8** | **Lun 30 nov.** | **MT-18** (`#11`) API RDV & Conflits (409)<br>`feature/MT-18-api-appointments` | **MT-22** (`#15`) API Consultations & Diagnostic<br>`feature/MT-22-api-consultations` | Lhassan merge `MT-22` · Rida merge `MT-18` | **9 → 7** *(38 pts)* |
| **J9** | **Mar 01 déc.** | **MT-19** (`#12`) Notifications Nodemailer + Twilio<br>`feature/MT-19-notifications-email-sms` | **MT-23** (`#16`) Génération Ordonnance PDF + QR<br>`feature/MT-23-prescription-pdf-qr` | Lhassan merge `MT-23` · Rida merge `MT-19` | **7 → 5** *(28 pts)* |
| **J10** | **Mer 02 déc.** | **MT-20** (`#13`) Front Calendrier Interactif *(partie 1/2)*<br>`feature/MT-20-ui-calendar-rdv` | **MT-24** (`#17`) API Pharmacie & Stock Médicaments<br>`feature/MT-24-api-pharmacy-stock` | Lhassan merge `MT-24` | **5 → 4** *(23 pts)* |
| **J11** | **Jeu 03 déc.** | **MT-20** (`#13`) Front Calendrier Interactif *(partie 2/2)*<br>`feature/MT-20-ui-calendar-rdv` | **MT-25** (`#18`) Front Médecin Consultation & PDF<br>`feature/MT-25-ui-consultation-pdf` | Lhassan merge `MT-25` · Rida merge `MT-20` | **4 → 2** *(10 pts)* |
| **J12** | **Ven 04 déc.** | **MT-21** (`#14`) Front Gestion Statuts RDV<br>`feature/MT-21-ui-rdv-status` | **MT-26** (`#19`) Front Pharmacien Ordonnances & Stock<br>`feature/MT-26-ui-pharmacy` | Lhassan merge `MT-26` · Rida merge `MT-21` | **2 → 0** *(0 pt)* |
| **J13–J14** | **Sam 05 / Dim 06 déc.** | **Fin Sprint 2** : Test flux complet sous Docker, tag `v0.2-sprint2`, merge `develop` → `main` | **Fin Sprint 2 (SM)** : Review, Rétro, capture Burndown, **Complete Sprint 2 → Start Sprint 3** | Merge `develop` → `main` | **0** *(Clôture)* |

---

### Sprint 3 — Semaine 3 (06 déc. → 13 déc. 2026) · 5 Stories (23 pts)

| Jour | Date | Lhassan Oubihi *(Stats & Dashboard + Rapport)* | Rida Dandane *(Qualité Tests Back/Front + Docker)* | Revues Croisées (PR → `develop`) | Reste idéal (Burndown) |
| :---: | :---: | :--- | :--- | :--- | :---: |
| **J15** | **Lun 07 déc.** | **MT-27** (`#20`) API Stats Agrégations MongoDB<br>`feature/MT-27-api-stats-dashboard` | **MT-29** (`#22`) Tests Jest ≥ 60% & Docker *(partie 1/2)*<br>`feature/MT-29-tests-coverage-docker` | Rida merge `MT-27` | **5 → 4** *(18 pts)* |
| **J16** | **Mar 08 déc.** | **MT-28** (`#21`) Front Dashboard Chart.js<br>`feature/MT-28-ui-dashboard-charts` | **MT-29** (`#22`) Tests Jest ≥ 60% & HTTPS/Docker *(fin)*<br>`feature/MT-29-tests-coverage-docker` | Lhassan merge `MT-29` · Rida merge `MT-28` | **4 → 2** *(8 pts)* |
| **J17** | **Mer 09 déc.** | **MT-31** (`#24`) Rapport (Architecture, Code, Docker) *(1/3)*<br>`feature/MT-31-rapport-demo` | **MT-30** (`#23`) Tests E2E Cypress *(partie 1/2)*<br>`feature/MT-30-cypress-e2e` | — | **2** *(8 pts)* |
| **J18** | **Jeu 10 déc.** | **MT-31** (`#24`) Rapport (Extraits commentés + Annexe Docker) *(2/3)* | **MT-30** (`#23`) Tests E2E Cypress complets *(fin)*<br>`feature/MT-30-cypress-e2e` | Lhassan merge `MT-30` | **2 → 1** *(3 pts)* |
| **J19** | **Ven 11 déc.** | **MT-31** (`#24`) Assemblage Rapport PDF 15–20p | **MT-31** (`#24`) Captures Jira (Burndown, Vélocité) + Relecture | Rida merge `MT-31` | **1 → 0** *(0 pt)* |
| **J20–J21** | **Sam 12 / Dim 13 déc.** | **Soutenance & Livraison** : Merge `develop` → `main`, tag `v1.0-final`, `docker-compose up --build`, checklist 7/7 | **Clôture Sprint 3 (SM)** : **Complete Sprint 3**, répétition démo machine | Merge final `develop` → `main` | **0** *(Livré)* |

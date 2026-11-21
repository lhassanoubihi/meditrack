# Planning Global Synchronisé sur 21 Jours — MediTrack (5 Sprints · 34 Stories · 103 Sous-tâches)

> **Source officielle :** [`docs/jira/meditrack_backlog_officiel.csv`](../jira/meditrack_backlog_officiel.csv) *(7 Epics · 34 User Stories · 103 Sous-tâches · 140 Story Points)*  
> **Période totale :** **Dimanche 22 nov. 2026 → Dimanche 13 déc. 2026** *(3 semaines · 5 Sprints de 4 jours)*  
> **Binôme Full-Stack :** **Rida Dandane (`DevA`)** & **Lhassan Oubihi (`DevB`)** *(chacun code Backend + Frontend)*  
> **Mode de travail :** **100 % piloté à la demande dans Antigravity** (aucun script automatique en arrière-plan sur PC). Chaque jour, chacun ouvre Antigravity et lance sa tâche du jour.  
> **Board Jira (`MT`) :** https://lhassanoubihi.atlassian.net/jira/software/projects/MT/boards/67  
> **Dépôt GitHub :** https://github.com/lhassanoubihi/meditrack  
> **Plans individuels prêts pour Antigravity :**
> - Plan & Protocole Agent de **Lhassan Oubihi (`DevB`)** : [`PLANNING_LHASSAN.md`](./PLANNING_LHASSAN.md)
> - Plan & Protocole Agent de **Rida Dandane (`DevA`)** : [`PLANNING_RIDA.md`](./PLANNING_RIDA.md)

---

## 1. Calendrier Jour par Jour (22 nov. → 13 déc. 2026)

### Sprint 1 (J1–J4 : Dim 22 nov. → Mer 25 nov.) — Infrastructure MEAN, CI/CD & Auth/2FA *(7 Stories · 30 pts)*

| Jour | Date | Rida Dandane (`DevA`) | Lhassan Oubihi (`DevB`) | Reste idéal (Burndown) |
| :---: | :---: | :--- | :--- | :---: |
| **J1** | **Dim 22 nov.** | **US-01** (`MT-39`, `#1`) : `T1` Backend structure + `T3` Dockerfiles & `docker-compose.yml` | **US-01** (`MT-39`, `#1`) : `T2` Angular 17/Material + `T4` `.env.example`/README<br>**US-02** (`MT-40`, `#2`) : `T1,T2,T3` Pipeline CI GitHub Actions + badge | **7 → 5** *(22 pts)* |
| **J2** | **Lun 23 nov.** | **US-03** (`MT-41`, `#3`) : `T1,T2,T4` User bcrypt + `POST /auth/register` + tests<br>**US-04** (`MT-42`, `#4`) : `T1,T2` `POST /auth/login` JWT + `authenticate` | **US-03** (`MT-41`, `#3`) : `T3` Formulaire inscription Angular<br>**US-04** (`MT-42`, `#4`) : `T3,T4` Page login Angular + `AuthService` + tests | **5 → 3** *(16 pts)* |
| **J3** | **Mar 24 nov.** | **US-05** (`MT-43`, `#5`) : `T1,T4` Middleware `authorize(...roles)` + tests 403<br>**US-06** (`MT-44`, `#6`) : `T1,T2` Backend génération/vérif 2FA *(début)* | **US-05** (`MT-43`, `#5`) : `T2,T3` Guards Angular + menu par rôle<br>**US-07** (`MT-45`, `#7`) : `T1,T2,T3` CRUD comptes personnel Admin (Back+Front) | **3 → 1** *(8 pts)* |
| **J4** | **Mer 25 nov.** | **US-06** (`MT-44`, `#6`) : `T3,T4,T5` Écran 2FA Angular + erreurs + tests 2FA *(fin)* | Revue & merge `US-06` + **Clôture Sprint 1** (`v0.1-sprint1`, capture Burndown, **Start Sprint 2**) | **1 → 0** *(Clôture S1)* |

---

### Sprint 2 (J5–J8 : Jeu 26 nov. → Dim 29 nov.) — Dossier Patient & Chiffrement RGPD *(7 Stories · 28 pts)*

| Jour | Date | Rida Dandane (`DevA`) | Lhassan Oubihi (`DevB`) | Reste idéal (Burndown) |
| :---: | :---: | :--- | :--- | :---: |
| **J5** | **Jeu 26 nov.** | **US-08** (`MT-46`, `#8`) : `T1–T4` Modèle Patient + `POST /patients` + Formulaire Angular + tests | **US-13** (`MT-51`, `#13`) : `T1–T3` Layout Material (header/sidenav) + gestion erreurs + lazy loading | **7 → 5** *(18 pts)* |
| **J6** | **Ven 27 nov.** | **US-10** (`MT-48`, `#10`) : `T1–T3` `PUT /patients/:id` + historique modif + Formulaire Angular + tests | **US-09** (`MT-47`, `#9`) : `T1–T3` `GET /patients` recherche/pagination + Table + Page détail | **5 → 3** *(10 pts)* |
| **J7** | **Sam 28 nov.** | **US-14** (`MT-52`, `#14`) : `T1–T5` AES-256-GCM + `cinHash` + `AuditLog` + `GET /audit-logs` + tests | **US-11** (`MT-49`, `#11`) : `T1–T2` Archivage soft-delete (`isArchived`)<br>**US-12** (`MT-50`, `#12`) : `T1–T2` `GET /patients/me` + Page « Mon dossier » | **3 → 0** *(0 pt)* |
| **J8** | **Dim 29 nov.** | **Clôture Sprint 2** : Démo Docker, tag `v0.2-sprint2`, capture Burndown | **Clôture Sprint 2** : Review/Rétro, **Complete Sprint 2 → Start Sprint 3** | **0** *(Clôture S2)* |

---

### Sprint 3 (J9–J12 : Lun 30 nov. → Jeu 03 déc.) — Rendez-vous, Calendrier & Notifications *(7 Stories · 25 pts)*

| Jour | Date | Rida Dandane (`DevA`) | Lhassan Oubihi (`DevB`) | Reste idéal (Burndown) |
| :---: | :---: | :--- | :--- | :---: |
| **J9** | **Lun 30 nov.** | **US-16** (`MT-54`, `#16`) : `T1–T4` Modèle RDV + créneaux libres + `POST /rendezvous` + UI + tests | **US-15** (`MT-53`, `#15`) : `T1–T3` Modèle Disponibilité + CRUD API + Écran config Angular | **7 → 5** *(17 pts)* |
| **J10** | **Mar 01 déc.** | **US-21** (`MT-59`, `#21`) : `T1–T3` Contrainte unicité + retour `409` + test concurrence | **US-17** (`MT-55`, `#17`) : `T1–T2` `PATCH /rendezvous/:id/statut` + UI médecin<br>**US-20** (`MT-58`, `#20`) : `T1–T2` Service SMS Twilio (mode test + résilience) | **5 → 2** *(8 pts)* |
| **J11** | **Mer 02 déc.** | **US-19** (`MT-57`, `#19`) : `T1–T3` Service Email Nodemailer + envoi confirmation + rappel J-1 `node-cron` | **US-18** (`MT-56`, `#18`) : `T1–T3` Intégrer FullCalendar Angular + API + détail au clic | **2 → 0** *(0 pt)* |
| **J12** | **Jeu 03 déc.** | **Clôture Sprint 3** : Test intégration RDV/Email/SMS, tag `v0.3-sprint3` | **Clôture Sprint 3** : Capture Burndown Sprint 3, **Complete Sprint 3 → Start Sprint 4** | **0** *(Clôture S3)* |

---

### Sprint 4 (J13–J16 : Ven 04 déc. → Lun 07 déc.) — Consultations, Ordonnances PDF & Pharmacie *(7 Stories · 29 pts)*

| Jour | Date | Rida Dandane (`DevA`) | Lhassan Oubihi (`DevB`) | Reste idéal (Burndown) |
| :---: | :---: | :--- | :--- | :---: |
| **J13** | **Ven 04 déc.** | **US-22** (`MT-60`, `#22`) : `T1–T3` Modèle Consultation + `POST /consultations` + Formulaire Angular | **US-27** (`MT-65`, `#27`) : `T1–T2` Modèle Médicament + CRUD API + Écrans gestion stock | **7 → 5** *(19 pts)* |
| **J14** | **Sam 05 déc.** | **US-23** (`MT-61`, `#23`) : `T1–T3` Modèle Ordonnance + `POST /ordonnances` + lignes dynamiques Angular | **US-25** (`MT-63`, `#25`) : `T1–T2` `GET /patients/:id/consultations` + Timeline Angular | **5 → 3** *(11 pts)* |
| **J15** | **Dim 06 déc.** | **US-24** (`MT-62`, `#24`) : `T1–T3` Génération PDF (`pdfkit`) + `GET /ordonnances/:id/pdf` + bouton Angular | **US-26** (`MT-64`, `#26`) : `T1–T2` Validation/délivrance ordonnance pharmacien<br>**US-28** (`MT-66`, `#28`) : `T1–T2` Décrémentation transactionnelle + badge alerte seuil | **3 → 0** *(0 pt)* |
| **J16** | **Lun 07 déc.** | **Clôture Sprint 4** : Test parcours Consultation → PDF → Pharmacie, tag `v0.4-sprint4` | **Clôture Sprint 4** : Capture Burndown Sprint 4, **Complete Sprint 4 → Start Sprint 5** | **0** *(Clôture S4)* |

---

### Sprint 5 (J17–J21 : Mar 08 déc. → Dim 13 déc.) — Statistiques, Tests E2E/Jest ≥ 60% & Rapport *(6 Stories · 28 pts)*

| Jour | Date | Rida Dandane (`DevA`) | Lhassan Oubihi (`DevB`) | Reste idéal (Burndown) |
| :---: | :---: | :--- | :--- | :---: |
| **J17** | **Mar 08 déc.** | **US-29** (`MT-67`, `#29`) : `T1–T2` Agrégation KPI + Tableau de bord médecin Angular | **US-32** (`MT-70`, `#32`) : `T1–T3` Tests unitaires services/controllers + Angular + couverture ≥ 60% Jest | **6 → 4** *(18 pts)* |
| **J18** | **Mer 09 déc.** | **US-30** (`MT-68`, `#30`) : `T1–T2` Pipeline MongoDB par spécialité + Graphiques Chart.js Angular | **US-31** (`MT-69`, `#31`) : `T1–T3` Cypress E2E (`login 2FA > RDV > consultation > ordonnance`) + seed test | **4 → 2** *(8 pts)* |
| **J19** | **Jeu 10 déc.** | **US-34** (`MT-72`, `#34`) : `T2` Rédiger architecture, SCRUM/Jira, code commenté *(début)* | **US-33** (`MT-71`, `#33`) : `T1–T3` README complet + script seed démo + vérif `docker-compose up --build` | **2 → 1** *(5 pts)* |
| **J20** | **Ven 11 / Sam 12 déc.** | **US-34** (`MT-72`, `#34`) : `T4` Relecture croisée + mise en page PDF finale (15–20p) | **US-34** (`MT-72`, `#34`) : `T1` Intro/besoins/UML/BPMN + `T3` Captures Jira + annexe `docker-compose.yml` | **1 → 0** *(0 pt)* |
| **J21** | **Dim 13 déc.** | **Soutenance & Livraison** : Répétition démo 7/7, vérification Jira final | **Clôture Sprint 5** : Merge `develop` → `main`, tag `v1.0-final`, **Complete Sprint 5** | **0** *(Livré)* |

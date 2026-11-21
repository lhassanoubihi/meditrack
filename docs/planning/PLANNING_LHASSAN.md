# Planning Quotidien Antigravity — Lhassan Oubihi (Full-Stack)

> **Rôle :** Product Owner (PO) + Développeur Full-Stack (Backend Node.js/MongoDB + Frontend Angular 17)  
> **Identité Git :** `Lhassan Oubihi <lhassan.oubihi1@gmail.com>`  
> **Dépôt GitHub :** `https://github.com/lhassanoubihi/meditrack`  
> **Board Jira (`MT`) :** `https://lhassanoubihi.atlassian.net/jira/software/projects/MT/boards/67`  
> **Mes 12 User Stories :** `MT-8`, `MT-10`, `MT-12`, `MT-15`, `MT-16`, `MT-18`, `MT-20`, `MT-23`, `MT-25`, `MT-27`, `MT-28`, `MT-31`

---

## Protocole Obligatoire pour l'Agent Antigravity de Lhassan

Chaque jour, lorsque Lhassan te demande d'exécuter sa tâche du jour, suis **strictement** ces 6 étapes dans l'ordre :

1. **Vérifier le temps / la date système en premier :**
   ```powershell
   Get-Date -Format "yyyy-MM-dd HH:mm"
   ```
   - Compare la date réelle avec le planning ci-dessous.
   - Si la date ne correspond pas au jour demandé par Lhassan, **avertis-le avant de coder** pour préserver la courbe du **Burndown Chart Jira**. Ne code **jamais** les tâches des jours futurs à l'avance sans accord explicite.
2. **Préparer Git & la branche du jour :**
   ```bash
   git config user.name "Lhassan Oubihi"
   git config user.email "lhassan.oubihi1@gmail.com"
   git checkout develop && git pull origin develop
   git checkout -b feature/MT-XX-description
   ```
3. **Passer le ticket Jira à `En cours` :**
   - Pousse la branche (`git push -u origin feature/MT-XX-description`) ou exécute `twg jira workitem transition` (vers *En cours*) + `python scripts/sync_github_jira.py`.
4. **Coder uniquement le périmètre de la tâche du jour** (sans modifier les fichiers assignés à **Rida Dandane** ce jour-là) et **vérifier localement** (tests Jest / build Angular / Docker).
5. **Committer avec la clé Jira, pousser et ouvrir la Pull Request vers `develop` :**
   ```bash
   git add .
   git commit -m "MT-XX feat(module): description claire"
   git push -u origin feature/MT-XX-description
   gh pr create --base develop --head feature/MT-XX-description --title "MT-XX : Titre Story" --body "Closes #<issue_gh>"
   ```
   - Exécute `python scripts/sync_github_jira.py` pour marquer le ticket **`In Review`** (`in-review`).
6. **Revue croisée de la PR de Rida Dandane (en fin de journée) :**
   - Vérifie `gh pr list --state open`, relis le diff, lance les tests, puis merge la PR de Rida (`gh pr merge <num> --merge --delete-branch`).
   - Relance `python scripts/sync_github_jira.py` (et ferme l'issue GitHub si besoin) pour passer le ticket mergé à **`Terminé(e)`** (`Done`).

---

## SPRINT 1 — Semaine 1 (22 nov. → 29 nov. 2026)

### Jour 1 — Dimanche 22 novembre 2026
- **Tâche :** `MT-8` (`#1`) — **Architecture MEAN Stack, Docker Compose & MongoDB** *(Backend / DevOps · 5 pts)*
- **Branche :** `feature/MT-8-docker-mean-base`
- **À faire :**
  - Finaliser `docker-compose.yml` (MongoDB 7 avec volume persistant + healthcheck, Backend Express, Frontend Nginx/Angular), `backend/src/config/db.js`, gestion centralisée des erreurs Express et route `/api/health` connectée à l'état MongoDB.
  - Vérifier `docker-compose up --build -d` et `cd backend && npm test`.
- **Commit :** `MT-8 feat(infra): configure MongoDB connection, healthcheck and error middleware`
- **PR & Fin de journée :** Ouvrir PR `MT-8` vers `develop` → Relire et merger la PR `MT-9` de **Rida Dandane** (Init Angular 17).

### Jour 2 — Lundi 23 novembre 2026
- **Tâche :** `MT-10` (`#3`) — **Authentification JWT, bcrypt & Double Authentification 2FA** *(Backend · 5 pts)*
- **Branche :** `feature/MT-10-auth-jwt-2fa`
- **À faire :**
  - Créer `backend/src/models/User.js`, `backend/src/controllers/auth.controller.js`, `backend/src/routes/auth.routes.js`, `backend/src/services/otp.service.js`.
  - Endpoints : `POST /api/auth/register`, `POST /api/auth/login` (retourne challenge 2FA / envoie OTP par email avec expiration 5 min), `POST /api/auth/verify-2fa` (retourne JWT).
  - Écrire tests Jest + Supertest dans `backend/tests/auth.test.js`.
- **Commit :** `MT-10 feat(auth): implement JWT, bcrypt hashing and 2FA OTP verification`
- **PR & Fin de journée :** Ouvrir PR `MT-10` vers `develop` → Relire et merger la PR `MT-11` de **Rida Dandane** (Users & RBAC).

### Jour 3 — Mardi 24 novembre 2026
- **Tâche :** `MT-12` (`#5`) — **Interfaces Angular Login, Inscription, 2FA & Profil** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-12-ui-auth-2fa`
- **Prérequis :** `MT-9`, `MT-10` et `MT-11` mergés dans `develop`.
- **À faire :**
  - Créer dans `frontend/src/app/` : `services/auth.service.ts`, `guards/auth.guard.ts`, `guards/role.guard.ts`, `interceptors/jwt.interceptor.ts`, et composants `login`, `register`, `verify-2fa`, `profile` avec Angular Material.
  - Vérifier `ng build`.
- **Commit :** `MT-12 feat(ui-auth): build login, register, 2FA OTP and profile screens with guards`
- **PR & Fin de journée :** Ouvrir PR `MT-12` vers `develop` → Relire et merger la PR `MT-13` de **Rida Dandane** (UML & BPMN).

### Jour 4 — Mercredi 25 novembre 2026
- **Tâche :** `MT-15` (`#8`) — **Préparation API CRUD Dossier Patient** *(Backend · 5 pts — partie 1/2)* + Revue `MT-14`
- **Branche :** `feature/MT-15-api-patients-crud`
- **À faire :**
  - Préparer la validation des requêtes et la structure des routes/contrôleurs `/api/patients` en attendant le modèle `Patient` chiffré (`MT-14`) de Rida.
  - **En fin de journée (prioritaire) :** Relire et merger la PR `MT-14` de **Rida Dandane** (Modèle Patient + RGPD AES-256) pour débloquer J5.

### Jour 5 — Jeudi 26 novembre 2026
- **Tâche :** `MT-15` (`#8`) — **API REST CRUD Dossier Patient + Recherche & Tests Jest** *(Backend · 5 pts — partie 2/2)*
- **Branche :** `feature/MT-15-api-patients-crud` *(rebase/merge `develop` pour récupérer `MT-14`)*
- **À faire :**
  - Implémenter `POST /GET /PUT /DELETE /api/patients`, recherche par nom/CIN, pagination, protection RBAC (`medecin`, `infirmier`, `admin`), et tests unitaires `backend/tests/patient.test.js`.
- **Commit :** `MT-15 feat(patients): add CRUD endpoints, search, pagination and Jest tests`
- **PR & Fin de journée :** Ouvrir PR `MT-15` vers `develop` (Rida doit la merger le soir pour débloquer J6).

### Jour 6 — Vendredi 27 novembre 2026
- **Tâche :** `MT-16` (`#9`) — **Interface Angular Liste, Recherche & Fiche Dossier Patient** *(Frontend · 8 pts)*
- **Branche :** `feature/MT-16-ui-patient-list`
- **Prérequis :** `MT-15` mergé dans `develop`.
- **À faire :**
  - Créer `services/patient.service.ts`, `components/patients/patient-list` (`MatTable` + recherche instantanée + pagination), `components/patients/patient-detail` (onglets Identité, Antécédents, Allergies, Traitements).
  - Vérifier `ng build`.
- **Commit :** `MT-16 feat(ui-patients): implement patient table with search and detailed medical view`
- **PR & Fin de journée :** Ouvrir PR `MT-16` → Relire et merger `MT-17` de **Rida Dandane** (Formulaires Patient).

### Jour 7 — Samedi 28 / Dimanche 29 novembre 2026 *(Clôture Sprint 1)*
- **Actions :**
  - Tester `docker-compose down -v && docker-compose up --build`.
  - Merger `develop` → `main` avec tag `v0.1-sprint1`.
  - Capturer le **Burndown Chart Sprint 1** (`docs/rapport/burndown_sprint1.png`).
  - Clôturer Sprint 1 et démarrer Sprint 2 avec Rida (SM).

---

## SPRINT 2 — Semaine 2 (29 nov. → 06 déc. 2026)

### Jour 8 — Lundi 30 novembre 2026
- **Tâche :** `MT-18` (`#11`) — **API REST Rendez-vous & Détection des Conflits Horaires** *(Backend · 5 pts)*
- **Branche :** `feature/MT-18-api-appointments`
- **À faire :**
  - Modèle `Appointment.js`, contrôleur/routes `/api/appointments`, vérification chevauchement horaire pour un même médecin (retourne `HTTP 409 Conflict`), filtres médecin/date/statut, transitions de statut, tests `appointment.test.js`.
- **Commit :** `MT-18 feat(rdv): add appointments CRUD and 409 slot conflict detection`
- **PR & Fin de journée :** Ouvrir PR `MT-18` → Relire et merger `MT-19` de **Rida Dandane** (Notifications Nodemailer + Twilio).

### Jour 9 — Mardi 1er décembre 2026
- **Tâche :** `MT-20` (`#13`) — **Calendrier Interactif Angular & Prise de RDV en Ligne** *(Frontend · 8 pts)*
- **Branche :** `feature/MT-20-ui-calendar-rdv`
- **À faire :**
  - Créer `services/appointment.service.ts` et `components/appointments/booking-calendar` (filtre spécialité → médecin → créneaux libres uniquement, vue jour/semaine/mois).
- **Commit :** `MT-20 feat(ui-rdv): build interactive angular appointment booking calendar`
- **PR & Fin de journée :** Ouvrir PR `MT-20` → Relire et merger `MT-21` de **Rida Dandane** (UI Statuts RDV).

### Jour 10 — Mercredi 2 décembre 2026
- **Tâche :** `MT-23` (`#16`) — **Préparation Génération Ordonnance PDF** *(Backend · 5 pts — partie 1/2)* + Revue `MT-22`
- **Branche :** `feature/MT-23-prescription-pdf-qr`
- **À faire :**
  - Préparer le service `backend/src/services/pdf.service.js` avec `pdfkit` (template ordonnance MediTrack + QR code de vérification).
  - **En fin de journée (prioritaire) :** Relire et merger `MT-22` de **Rida Dandane** (API Consultations).

### Jour 11 — Jeudi 3 décembre 2026
- **Tâche :** `MT-23` (`#16`) — **Génération Ordonnance Numérique PDF & QR Code** *(Backend · 5 pts — partie 2/2)*
- **Branche :** `feature/MT-23-prescription-pdf-qr` *(après merge de `MT-22`)*
- **À faire :**
  - Connecter `GET /api/prescriptions/:id/pdf` au modèle `Consultation`/`Prescription` + tests Jest vérifiant que le buffer retourné commence par `%PDF-`.
- **Commit :** `MT-23 feat(pdf): generate signed digital prescription PDF with QR verification`
- **PR & Fin de journée :** Ouvrir PR `MT-23` → Relire et merger `MT-24` de **Rida Dandane** (API Pharmacie & Stock).

### Jour 12 — Vendredi 4 décembre 2026
- **Tâche :** `MT-25` (`#18`) — **Interface Médecin Saisie Consultation & Ordonnance PDF** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-25-ui-consultation-pdf`
- **À faire :**
  - Créer `components/consultations/consultation-form` (signes vitaux, diagnostic, `FormArray` médicaments/posologie, bouton **Télécharger Ordonnance PDF**).
- **Commit :** `MT-25 feat(ui-consultation): add doctor consultation form and PDF download`
- **PR & Fin de journée :** Ouvrir PR `MT-25` → Relire et merger `MT-26` de **Rida Dandane** (UI Pharmacien).

### Jours 13–14 — Samedi 5 / Dimanche 6 décembre 2026 *(Clôture Sprint 2)*
- Tester bout en bout Patient → RDV → Consultation PDF → Pharmacie sous Docker.
- Merger `develop` → `main` avec tag `v0.2-sprint2`.
- Capturer le **Burndown Chart Sprint 2** et démarrer Sprint 3.

---

## SPRINT 3 — Semaine 3 (06 déc. → 13 déc. 2026)

### Jour 15 — Lundi 7 décembre 2026
- **Tâche :** `MT-27` (`#20`) — **API Statistiques & Agrégations MongoDB par Spécialité** *(Backend · 5 pts)*
- **Branche :** `feature/MT-27-api-stats-dashboard`
- **À faire :**
  - Contrôleur & route `GET /api/stats/dashboard` utilisant MongoDB Aggregation Pipeline (total patients, RDV par statut/mois, consultations par spécialité, alertes stock médicaments) + tests Jest.
- **Commit :** `MT-27 feat(stats): add MongoDB aggregation pipeline for specialty KPIs`
- **PR & Fin de journée :** Ouvrir PR `MT-27` vers `develop`.

### Jour 16 — Mardi 8 décembre 2026
- **Tâche :** `MT-28` (`#21`) — **Tableaux de Bord Analytiques Angular par Spécialité** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-28-ui-dashboard-charts`
- **À faire :**
  - Créer `components/dashboard/stats-dashboard` avec KPI cards + graphiques dynamiques (Chart.js / `ng2-charts`) filtrables par spécialité et période.
- **Commit :** `MT-28 feat(ui-stats): add interactive analytics dashboard with Chart.js`
- **PR & Fin de journée :** Ouvrir PR `MT-28` → Relire et merger `MT-29` de **Rida Dandane** (Tests Jest ≥ 60% & Docker).

### Jour 17 — Mercredi 9 décembre 2026
- **Tâche :** `MT-31` (`#24`) — **Rapport Final (Partie Architecture, Code commenté & Déploiement)** *(3 pts — partie 1/2)*
- **Branche :** `feature/MT-31-rapport-demo`
- **À faire :**
  - Rédiger dans `docs/rapport/` les sections : Contexte, Architecture technique MEAN, Extraits de code commentés (contrôleurs, services RGPD, PDFKit), Annexe `docker-compose.yml` complète.
  - **En fin de journée :** Relire et merger `MT-30` de **Rida Dandane** (Tests E2E Cypress).

### Jours 18–19 — Jeudi 10 / Vendredi 11 décembre 2026
- **Tâche :** `MT-31` (`#24`) — **Finalisation Rapport 15–20 Pages** *(partie 2/2 — avec Rida)*
- **À faire :**
  - Intégrer les captures Jira de Rida (Board, Burndown Charts des 3 Sprints, Vélocité) + diagrammes UML/BPMN, exporter le rapport final PDF (15–20 pages) dans `docs/rapport/` et ouvrir/merger la PR `MT-31`.

### Jours 20–21 — Samedi 12 / Dimanche 13 décembre 2026 *(Clôture & Soutenance)*
- **Checklist finale obligatoire (Pr. S. Amri) :**
  1. `docker-compose down -v && docker-compose up --build` sans erreur
  2. Interface Angular sur `http://localhost:4200`
  3. Connexion multi-rôles + 2FA vérifiée
  4. Scénario complet sans bug bloquant
  5. Persistance MongoDB vérifiée après redémarrage
  6. Board Jira + Burndown Charts des 3 Sprints prêts
  7. `npm test` affiche couverture `>= 60%` + Cypress E2E verts
  8. Merge final `develop` → `main` avec tag `v1.0-final` et clôture Sprint 3.

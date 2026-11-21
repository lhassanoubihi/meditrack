# Planning Quotidien Antigravity — Lhassan Oubihi (Modules Complets en Parallèle)

> **Rôle :** Product Owner (PO) + Développeur Full-Stack (Backend Node.js/MongoDB + Frontend Angular 17)  
> **Mes Modules Complets (Back + Front) :**  
> 1. **Sprint 1 :** Socle Docker/MEAN + **Module Auth 2FA / Users / RBAC complet (Back + Front)** + UML/BPMN (`MT-8`, `MT-10`, `MT-11`, `MT-12`, `MT-13`)  
> 2. **Sprint 2 :** **Module Rendez-vous, Notifications Email/SMS & Calendrier complet (Back + Front)** (`MT-18`, `MT-19`, `MT-20`, `MT-21`)  
> 3. **Sprint 3 :** **Module Statistiques & Tableaux de Bord complet (Back + Front)** + Rapport (`MT-27`, `MT-28`, `MT-31`)  
> **Identité Git :** `Lhassan Oubihi <lhassan.oubihi1@gmail.com>`  
> **Dépôt GitHub :** `https://github.com/lhassanoubihi/meditrack`  
> **Board Jira (`MT`) :** `https://lhassanoubihi.atlassian.net/jira/software/projects/MT/boards/67`

---

## Protocole Obligatoire pour l'Agent Antigravity de Lhassan

Chaque jour, lorsque Lhassan te demande d'exécuter sa tâche du jour, suis **strictement** ces 6 étapes dans l'ordre :

1. **Vérifier le temps / la date système en premier :**
   ```powershell
   Get-Date -Format "yyyy-MM-dd HH:mm"
   ```
   - Compare la date réelle avec le planning ci-dessous (du **22 nov. 2026** au **13 déc. 2026**).
   - Si la date ne correspond pas au jour demandé, **avertis Lhassan avant de coder** pour préserver la courbe du **Burndown Chart Jira**. Ne code **jamais** les tâches des jours futurs à l'avance.
2. **Synchroniser `develop` & créer la branche du jour :**
   ```bash
   git config user.name "Lhassan Oubihi"
   git config user.email "lhassan.oubihi1@gmail.com"
   git checkout develop && git pull origin develop
   git checkout -b feature/MT-XX-description
   ```
3. **Passer le ticket Jira à `En cours` :**
   - Pousse la branche (`git push -u origin feature/MT-XX-description`) + `python scripts/sync_github_jira.py` (ou transitionne `MT-XX` vers **`En cours`** via `twg`).
4. **Coder uniquement les fichiers de son module** (zéro chevauchement avec le module de **Rida Dandane**) et **vérifier localement** (`npm test` / `ng build` / `docker-compose`).
5. **Committer avec la clé Jira, pousser et ouvrir la Pull Request vers `develop` :**
   ```bash
   git add .
   git commit -m "MT-XX feat(module): description claire"
   git push -u origin feature/MT-XX-description
   gh pr create --base develop --head feature/MT-XX-description --title "MT-XX : Titre Story" --body "Closes #<issue_gh>"
   ```
   - Exécute `python scripts/sync_github_jira.py` pour marquer `MT-XX` en **`In Review`** (`in-review`).
6. **Revue croisée de la PR de Rida Dandane (fin de journée) :**
   - Vérifie `gh pr list --state open`, relis et merge la PR du jour de Rida (`gh pr merge <num> --merge --delete-branch`), puis relance `python scripts/sync_github_jira.py` pour passer le ticket mergé à **`Terminé(e)`** (`Done`).

---

## SPRINT 1 — Semaine 1 : Socle Docker + Module Auth/RBAC Complet + UML/BPMN

### Jour 1 — Dimanche 22 novembre 2026
- **Tâche :** `MT-8` (`#1`) — **Architecture MEAN Stack, Docker Compose & MongoDB** *(Backend / DevOps · 5 pts)*
- **Branche :** `feature/MT-8-docker-mean-base`
- **À faire :**
  - Finaliser `docker-compose.yml` (MongoDB 7 avec volume persistant + healthcheck, Backend Express, Frontend Nginx/Angular), `backend/src/config/db.js`, middleware d'erreur centralisé et `/api/health` connecté à MongoDB.
  - Vérifier `docker-compose up --build -d` et `cd backend && npm test`.
- **Commit :** `MT-8 feat(infra): configure MongoDB connection, healthcheck and error middleware`
- **Fin de journée :** Ouvrir PR `MT-8` → Relire et merger la PR `MT-9` de **Rida Dandane** (Init Angular 17).

### Jour 2 — Lundi 23 novembre 2026
- **Tâche :** `MT-10` (`#3`) — **Authentification JWT, bcrypt & Double Authentification 2FA** *(Backend · 5 pts)*
- **Branche :** `feature/MT-10-auth-jwt-2fa`
- **À faire :**
  - Créer `backend/src/models/User.js`, `backend/src/services/otp.service.js`, `backend/src/controllers/auth.controller.js`, `backend/src/routes/auth.routes.js`.
  - Endpoints : `POST /api/auth/register`, `POST /api/auth/login` (challenge 2FA + code OTP valide 5 min), `POST /api/auth/verify-2fa` (retourne JWT).
  - Écrire `backend/tests/auth.test.js` et vérifier `npm test`.
- **Commit :** `MT-10 feat(auth): implement JWT, bcrypt hashing and 2FA OTP verification`
- **Fin de journée :** Ouvrir PR `MT-10` → Relire et merger la PR `MT-14` de **Rida Dandane** (Modèle Patient RGPD).

### Jour 3 — Mardi 24 novembre 2026
- **Tâche :** `MT-11` (`#4`) — **Gestion des Utilisateurs & RBAC Multi-Rôles** *(Backend · 5 pts)*
- **Branche :** `feature/MT-11-users-rbac`
- **Prérequis :** `MT-10` mergé dans `develop`.
- **À faire :**
  - Créer `backend/src/middlewares/auth.middleware.js` (`authenticate`, `authorize(...roles)` pour `admin`, `medecin`, `infirmier`, `pharmacien`, `patient`).
  - Créer `backend/src/controllers/user.controller.js` et `backend/src/routes/user.routes.js` (CRUD Admin + profil utilisateur).
  - Écrire `backend/tests/rbac.test.js` (vérifier HTTP 403 sur accès non autorisé).
- **Commit :** `MT-11 feat(rbac): implement role-based access control middlewares and user management API`
- **Fin de journée :** Ouvrir PR `MT-11` → Relire et merger la PR `MT-15` de **Rida Dandane** (API CRUD Patient).

### Jour 4 — Mercredi 25 novembre 2026
- **Tâche :** `MT-12` (`#5`) — **Interfaces Angular Login, Inscription, 2FA & Profil** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-12-ui-auth-2fa`
- **Prérequis :** `MT-9` (Angular 17) et `MT-10`/`MT-11` mergés dans `develop`.
- **À faire :**
  - Créer dans `frontend/src/app/` : `services/auth.service.ts`, `guards/auth.guard.ts`, `guards/role.guard.ts`, `interceptors/jwt.interceptor.ts`, et composants `login`, `register`, `verify-2fa`, `profile` avec Angular Material.
  - Vérifier `cd frontend && npm run build`.
- **Commit :** `MT-12 feat(ui-auth): build login, register, 2FA OTP and profile screens with guards`
- **Fin de journée :** Ouvrir PR `MT-12` vers `develop`.

### Jour 5 — Jeudi 26 novembre 2026
- **Tâche :** `MT-13` (`#6`) — **Modélisation UML (Use Case, Classes, Séquence) & BPMN Initiale** *(Conception · 3 pts)*
- **Branche :** `feature/MT-13-uml-bpmn-docs`
- **À faire :**
  - Créer dans `docs/uml/` les diagrammes : Cas d'Utilisation (5 acteurs), Classes (User, Patient, Appointment, Consultation, Prescription, Medication), Séquence (Auth 2FA + Prise de RDV).
  - Créer dans `docs/bpmn/` le diagramme BPMN du parcours médical complet.
- **Commit :** `MT-13 docs(conception): add UML use-case, class, sequence and BPMN diagrams`
- **Fin de journée :** Ouvrir PR `MT-13` → Relire et merger la PR `MT-16` de **Rida Dandane** (Liste & Fiche Patient).

### Jour 6 — Vendredi 27 novembre 2026
- **Actions :**
  - Vérifier l'intégration complète **Auth/RBAC + Module Dossier Patient** sur `develop`.
  - Relire et merger la PR `MT-17` de **Rida Dandane** (Formulaires Patient).

### Jour 7 — Samedi 28 / Dimanche 29 novembre 2026 *(Clôture Sprint 1)*
- Tester `docker-compose down -v && docker-compose up --build`.
- Merger `develop` → `main` avec tag `v0.1-sprint1` et vérifier la clôture de Sprint 1 + démarrage Sprint 2 avec Rida.

---

## SPRINT 2 — Semaine 2 : Module Complet Rendez-vous, Notifications & Calendrier

### Jour 8 — Lundi 30 novembre 2026
- **Tâche :** `MT-18` (`#11`) — **API REST Rendez-vous & Détection des Conflits Horaires** *(Backend · 5 pts)*
- **Branche :** `feature/MT-18-api-appointments`
- **À faire :**
  - Créer `backend/src/models/Appointment.js`, `appointment.controller.js`, `appointment.routes.js` (`POST/GET/PATCH/DELETE /api/appointments`).
  - Bloquer tout chevauchement horaire pour un même médecin (`HTTP 409 Conflict`), filtrer par médecin/date/statut + tests `backend/tests/appointment.test.js`.
- **Commit :** `MT-18 feat(rdv): add appointments CRUD and 409 slot conflict detection`
- **Fin de journée :** Ouvrir PR `MT-18` → Relire et merger la PR `MT-22` de **Rida Dandane** (API Consultations).

### Jour 9 — Mardi 1er décembre 2026
- **Tâche :** `MT-19` (`#12`) — **Service Notifications Email (Nodemailer) & SMS (Twilio)** *(Backend · 5 pts)*
- **Branche :** `feature/MT-19-notifications-email-sms`
- **À faire :**
  - Créer `backend/src/services/notification.service.js` (Nodemailer SMTP/Mailtrap + Twilio SMS avec mode sandbox configurable par `TWILIO_ENABLED` dans `.env`).
  - Déclencher automatiquement l'envoi à la création/confirmation/annulation d'un RDV + tests Jest avec mocks.
- **Commit :** `MT-19 feat(notif): implement Nodemailer email and Twilio SMS reminder service`
- **Fin de journée :** Ouvrir PR `MT-19` → Relire et merger la PR `MT-23` de **Rida Dandane** (Ordonnance PDF).

### Jour 10 — Mercredi 2 décembre 2026
- **Tâche :** `MT-20` (`#13`) — **Calendrier Interactif Angular & Prise de RDV en Ligne** *(Frontend · 8 pts — partie 1/2)*
- **Branche :** `feature/MT-20-ui-calendar-rdv`
- **À faire :**
  - Créer `services/appointment.service.ts` et l'architecture du calendrier interactif (sélection spécialité → médecin → affichage des créneaux libres).
  - **Fin de journée :** Relire et merger la PR `MT-24` de **Rida Dandane** (API Pharmacie & Stock).

### Jour 11 — Jeudi 3 décembre 2026
- **Tâche :** `MT-20` (`#13`) — **Calendrier Interactif Angular & Prise de RDV en Ligne** *(Frontend · 8 pts — partie 2/2)*
- **Branche :** `feature/MT-20-ui-calendar-rdv`
- **À faire :**
  - Finaliser vues jour/semaine/mois, réservation en ligne, gestion des erreurs `409 Conflict` et `ng build`.
- **Commit :** `MT-20 feat(ui-rdv): build interactive angular appointment booking calendar`
- **Fin de journée :** Ouvrir PR `MT-20` → Relire et merger la PR `MT-25` de **Rida Dandane** (UI Médecin Consultation).

### Jour 12 — Vendredi 4 décembre 2026
- **Tâche :** `MT-21` (`#14`) — **Gestion Statuts RDV : Confirmation, Report & Annulation** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-21-ui-rdv-status`
- **Prérequis :** `MT-20` mergé dans `develop`.
- **À faire :**
  - Créer `components/appointments/appointment-list` (espaces Médecin & Patient : transitions `PENDING` → `CONFIRMED` / `CANCELLED` / `COMPLETED`, report de créneau, snackbar confirmation).
- **Commit :** `MT-21 feat(ui-rdv): add doctor and patient appointment status management views`
- **Fin de journée :** Ouvrir PR `MT-21` → Relire et merger la PR `MT-26` de **Rida Dandane** (UI Pharmacien).

### Jours 13–14 — Samedi 5 / Dimanche 6 décembre 2026 *(Clôture Sprint 2)*
- Tester tout le parcours Patient → RDV → Consultation → Ordonnance PDF → Pharmacie sous Docker.
- Merger `develop` → `main` avec tag `v0.2-sprint2`.

---

## SPRINT 3 — Semaine 3 : Module Statistiques & Dashboard + Rapport Final

### Jour 15 — Lundi 7 décembre 2026
- **Tâche :** `MT-27` (`#20`) — **API Statistiques & Agrégations MongoDB par Spécialité** *(Backend · 5 pts)*
- **Branche :** `feature/MT-27-api-stats-dashboard`
- **À faire :**
  - Créer `stats.controller.js` et `stats.routes.js` (`GET /api/stats/dashboard`) via MongoDB Aggregation Pipeline (patients, RDV par statut/mois, consultations par spécialité, alertes stock) + tests Jest.
- **Commit :** `MT-27 feat(stats): add MongoDB aggregation pipeline for specialty KPIs`
- **Fin de journée :** Ouvrir PR `MT-27` vers `develop`.

### Jour 16 — Mardi 8 décembre 2026
- **Tâche :** `MT-28` (`#21`) — **Tableaux de Bord Analytiques Angular par Spécialité** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-28-ui-dashboard-charts`
- **Prérequis :** `MT-27` mergé dans `develop`.
- **À faire :**
  - Créer `components/dashboard/stats-dashboard` avec KPI cards + graphiques interactifs Chart.js / `ng2-charts` (barres, courbes, doughnut par spécialité) + `ng build`.
- **Commit :** `MT-28 feat(ui-stats): add interactive analytics dashboard with Chart.js`
- **Fin de journée :** Ouvrir PR `MT-28` → Relire et merger la PR `MT-29` de **Rida Dandane** (Tests Jest ≥ 60% & Docker).

### Jour 17–19 — Mercredi 9 → Vendredi 11 décembre 2026
- **Tâche :** `MT-31` (`#24`) — **Rapport Final 15–20 Pages & Préparation Démo** *(3 pts — partagé avec Rida)*
- **Branche :** `feature/MT-31-rapport-demo`
- **À faire :**
  - **J17 :** Rédiger Contexte, Analyse des besoins, Architecture technique MEAN + relire & merger `MT-30` (Cypress E2E) le J18.
  - **J18 :** Extraits de code commentés (Auth 2FA, AES-256, Conflits RDV, PDFKit, Stats) + Annexe `docker-compose.yml`.
  - **J19 :** Assembler avec les captures Jira de Rida (Burndown Charts Sprints 1–3, Vélocité) + UML/BPMN en rapport PDF final (15–20 pages) et ouvrir PR `MT-31`.

### Jours 20–21 — Samedi 12 / Dimanche 13 décembre 2026 *(Soutenance)*
- Répéter la démonstration complète devant la checklist 7/7 de Pr. S. Amri, merger `develop` → `main` avec tag `v1.0-final` et clôturer Sprint 3.

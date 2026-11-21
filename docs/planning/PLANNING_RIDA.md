# Planning Quotidien Antigravity — Rida Dandane (Full-Stack)

> **Rôle :** Scrum Master (SM) + Développeur Full-Stack (Frontend Angular 17 + Backend Node.js/MongoDB)  
> **Identité Git :** `Rida Dandane`  
> **Dépôt GitHub :** `https://github.com/lhassanoubihi/meditrack`  
> **Board Jira (`MT`) :** `https://lhassanoubihi.atlassian.net/jira/software/projects/MT/boards/67`  
> **Mes 12 User Stories :** `MT-9`, `MT-11`, `MT-13`, `MT-14`, `MT-17`, `MT-19`, `MT-21`, `MT-22`, `MT-24`, `MT-26`, `MT-29`, `MT-30` *(+ contribution Sprint 3 sur `MT-31`)*

---

## Protocole Obligatoire pour l'Agent Antigravity de Rida Dandane

**À LIRE IMPÉRATIVEMENT PAR L'AGENT ANTIGRAVITY DE RIDA AVANT CHAQUE TÂCHE :**

1. **VÉRIFICATION OBLIGATOIRE DU TEMPS / DE LA DATE :**
   Exécute d'abord une commande pour lire la date et l'heure réelles de la machine :
   ```powershell
   Get-Date -Format "yyyy-MM-dd HH:mm"
   ```
   *(ou sous Linux/macOS : `date +"%Y-%m-%d %H:%M"`)*
   - Compare la date système avec le tableau jour par jour ci-dessous (du **22 nov. 2026** au **13 déc. 2026**).
   - **Si la date système ne correspond pas au jour demandé par Rida** (ex. Rida demande la tâche du Jour 3 alors qu'on est encore le Jour 2), **arrête-toi et préviens Rida** avant de modifier du code ou de fermer le ticket, afin que le **Burndown Chart Jira** reste réaliste et cohérent jour après jour.
   - Ne réalise **que la tâche du jour en cours**.

2. **Synchroniser Git & créer la branche du jour :**
   ```bash
   git config user.name "Rida Dandane"
   git checkout develop && git pull origin develop
   git checkout -b feature/MT-XX-description
   ```
   *(Vérifie d'abord les **Prérequis** indiqués pour ce jour : si une PR de Lhassan doit être mergée avant, vérifie `gh pr list`.)*

3. **Passer le ticket Jira à `En cours` :**
   - Pousse la branche (`git push -u origin feature/MT-XX-description`) pour déclencher la synchro automatique GitHub → Jira (ou transitionne le ticket `MT-XX` vers **`En cours`** sur le Board `MT`).

4. **Développer uniquement les fichiers de la tâche du jour + Tests :**
   - Ne modifie pas les fichiers sur lesquels **Lhassan Oubihi** travaille le même jour (zéro conflit).
   - Lance les vérifications (`npm test` côté backend, `ng build` côté frontend).

5. **Committer avec la clé Jira, pousser et ouvrir la Pull Request vers `develop` :**
   ```bash
   git add .
   git commit -m "MT-XX feat(module): description claire"
   git push -u origin feature/MT-XX-description
   gh pr create --base develop --head feature/MT-XX-description --title "MT-XX : Titre Story" --body "Closes #<issue_gh>"
   ```
   - Passe le ticket Jira `MT-XX` à **`In Review`** (ou ajoute le label `in-review`).

6. **Revue croisée & Merge de la PR de Lhassan Oubihi (fin de journée) :**
   - Liste les PR ouvertes (`gh pr list --state open`), vérifie le code de Lhassan et les tests CI, puis merge sa PR (`gh pr merge <num> --merge --delete-branch`).
   - Passe le ticket mergé à **`Terminé(e)`** (`Done`) et vérifie le Burndown Chart sur Jira (rôle Scrum Master).

---

## SPRINT 1 — Semaine 1 (22 nov. → 29 nov. 2026)

### Jour 1 — Dimanche 22 novembre 2026
- **Tâche :** `MT-9` (`#2`) — **Initialisation Frontend Angular 17, Angular Material & Layout** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-9-angular17-setup`
- **À faire :**
  - Initialiser Angular 17 dans `frontend/` (`--standalone --routing --style=scss`), installer `@angular/material`, configurer un thème médical (bleu/blanc/vert), créer le layout responsive (Navbar + Sidebar dynamique selon le rôle), `environment.ts`, et un intercepteur HTTP JWT prêt.
  - Adapter `frontend/Dockerfile` en multi-stage build (Node 20 → Nginx).
  - Vérifier `cd frontend && npm run build`.
- **Commit :** `MT-9 feat(ui): initialize Angular 17 app with Material medical theme and layout`
- **PR & Fin de journée :** Ouvrir PR `MT-9` vers `develop` → Relire et merger la PR `MT-8` de **Lhassan Oubihi** (Docker/MEAN).

### Jour 2 — Lundi 23 novembre 2026
- **Tâche :** `MT-11` (`#4`) — **Gestion des Utilisateurs & RBAC Multi-Rôles** *(Backend · 5 pts)*
- **Branche :** `feature/MT-11-users-rbac`
- **Prérequis :** `MT-8` mergé dans `develop`.
- **À faire :**
  - Créer `backend/src/middlewares/auth.middleware.js` (`authenticate`, `authorize(...roles)` pour `admin`, `medecin`, `infirmier`, `pharmacien`, `patient`).
  - Créer `backend/src/controllers/user.controller.js` et `backend/src/routes/user.routes.js` (CRUD utilisateurs côté Admin, consultation/édition profil).
  - Écrire tests unitaires `backend/tests/rbac.test.js` vérifiant qu'un accès interdit renvoie `HTTP 403`.
- **Commit :** `MT-11 feat(rbac): implement role-based access control middlewares and user management API`
- **PR & Fin de journée :** Ouvrir PR `MT-11` vers `develop` → Relire et merger la PR `MT-10` de **Lhassan Oubihi** (Auth JWT + 2FA).

### Jour 3 — Mardi 24 novembre 2026
- **Tâche :** `MT-13` (`#6`) — **Modélisation UML (Use Case, Classes) & BPMN Initiale** *(Conception · 3 pts)*
- **Branche :** `feature/MT-13-uml-bpmn-docs`
- **À faire :**
  - Créer dans `docs/uml/` les diagrammes PlantUML / Mermaid / PNG : Cas d'Utilisation (5 acteurs), Diagramme de Classes (User, Patient, Appointment, Consultation, Prescription, Medication), Diagramme de Séquence (Auth 2FA + Prise de RDV).
  - Créer dans `docs/bpmn/` le diagramme BPMN du flux complet : *Prise de RDV → Consultation → Ordonnance → Délivrance Pharmacie*.
- **Commit :** `MT-13 docs(conception): add UML use-case, class, sequence and BPMN diagrams`
- **PR & Fin de journée :** Ouvrir PR `MT-13` vers `develop` → Relire et merger la PR `MT-12` de **Lhassan Oubihi** (UI Auth/2FA).

### Jour 4 — Mercredi 25 novembre 2026
- **Tâche :** `MT-14` (`#7`) — **Modèle Mongoose Patient & Chiffrement RGPD AES-256** *(Backend · 5 pts)*
- **Branche :** `feature/MT-14-patient-model-rgpd`
- **À faire :**
  - Créer `backend/src/utils/encryption.js` (chiffrement/déchiffrement AES-256-GCM ou AES-256-CBC avec `ENCRYPTION_KEY` du `.env`).
  - Créer `backend/src/models/Patient.js` (identité, CIN, groupe sanguin, antécédents, allergies, traitements — champs médicaux sensibles chiffrés en base).
  - Écrire tests unitaires `backend/tests/encryption.test.js`.
- **Commit :** `MT-14 feat(rgpd): add Patient Mongoose model with AES-256 sensitive data encryption`
- **PR & Fin de journée :** Ouvrir PR `MT-14` vers `develop` *(Lhassan la merge le soir pour débloquer `MT-15`)*.

### Jour 5 — Jeudi 26 novembre 2026
- **Tâche :** `MT-17` (`#10`) — **Formulaires Angular Création & Édition Dossier Patient** *(Frontend · 5 pts — partie 1/2)*
- **Branche :** `feature/MT-17-ui-patient-forms`
- **À faire :**
  - Créer le composant `components/patients/patient-form` avec Reactive Forms et `FormArray` dynamiques (ajout/suppression d'antécédents, allergies, traitements) + `MatSnackBar`.
  - **En fin de journée (prioritaire) :** Relire et merger la PR `MT-15` de **Lhassan Oubihi** (API CRUD Patient).

### Jour 6 — Vendredi 27 novembre 2026
- **Tâche :** `MT-17` (`#10`) — **Connexion Formulaires Patient à l'API & Finition** *(Frontend · 5 pts — partie 2/2)*
- **Branche :** `feature/MT-17-ui-patient-forms` *(après merge de `MT-15`)*
- **À faire :**
  - Brancher les appels `POST /api/patients` et `PUT /api/patients/:id`, gérer les validations et erreurs, vérifier `ng build`.
- **Commit :** `MT-17 feat(ui-patients): complete dynamic reactive forms for patient creation and editing`
- **PR & Fin de journée :** Ouvrir PR `MT-17` → Relire et merger `MT-16` de **Lhassan Oubihi** (Liste & Fiche Patient).

### Jour 7 — Samedi 28 / Dimanche 29 novembre 2026 *(Clôture Sprint 1 — Rôle Scrum Master)*
- **Actions :**
  - Vérifier que les 10 tickets du Sprint 1 (`MT-8` → `MT-17`) sont à **`Terminé(e)`**.
  - Animer la Sprint Review & Rétrospective (noter 3 points positifs / 2 améliorations dans `docs/rapport/`).
  - Dans Jira : **Terminer Sprint 1** → **Démarrer Sprint 2** (`29 nov. → 06 déc.`).

---

## SPRINT 2 — Semaine 2 (29 nov. → 06 déc. 2026)

### Jour 8 — Lundi 30 novembre 2026
- **Tâche :** `MT-19` (`#12`) — **Service Notifications Email (Nodemailer) & SMS (Twilio)** *(Backend · 5 pts)*
- **Branche :** `feature/MT-19-notifications-email-sms`
- **À faire :**
  - Créer `backend/src/services/notification.service.js` (Nodemailer SMTP/Mailtrap + Twilio SMS avec mode sandbox/mock contrôlé par `TWILIO_ENABLED` dans `.env`) + tests Jest avec mocks.
- **Commit :** `MT-19 feat(notif): implement Nodemailer email and Twilio SMS reminder service`
- **PR & Fin de journée :** Ouvrir PR `MT-19` → Relire et merger `MT-18` de **Lhassan Oubihi** (API RDV anti-conflit).

### Jour 9 — Mardi 1er décembre 2026
- **Tâche :** `MT-21` (`#14`) — **Gestion Statuts RDV : Confirmation, Report & Annulation** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-21-ui-rdv-status`
- **Prérequis :** `MT-18` mergé dans `develop`.
- **À faire :**
  - Créer `components/appointments/appointment-list` pour Médecin & Patient : affichage par statut (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`), boutons Confirmer / Reporter / Annuler avec dialog de confirmation.
- **Commit :** `MT-21 feat(ui-rdv): add doctor and patient appointment status management views`
- **PR & Fin de journée :** Ouvrir PR `MT-21` → Relire et merger `MT-20` de **Lhassan Oubihi** (Calendrier interactif).

### Jour 10 — Mercredi 2 décembre 2026
- **Tâche :** `MT-22` (`#15`) — **API REST Consultations : Compte-rendu & Diagnostic** *(Backend · 5 pts)*
- **Branche :** `feature/MT-22-api-consultations`
- **À faire :**
  - Créer modèles `Consultation.js` & `Prescription.js`, contrôleurs/routes `/api/consultations` (liés au Patient et au RDV, signes vitaux, diagnostic, liste médicaments/posologies) + tests Jest.
- **Commit :** `MT-22 feat(consultations): implement consultations and prescriptions REST API`
- **PR & Fin de journée :** Ouvrir PR `MT-22` vers `develop` *(Lhassan la merge le soir pour débloquer `MT-23`)*.

### Jour 11 — Jeudi 3 décembre 2026
- **Tâche :** `MT-24` (`#17`) — **API REST Pharmacie : Validation Ordonnance & Stock Médicaments** *(Backend · 5 pts)*
- **Branche :** `feature/MT-24-api-pharmacy-stock`
- **Prérequis :** `MT-22` mergé dans `develop`.
- **À faire :**
  - Créer modèle `Medication.js` (nom, code, quantité, seuilMin, expiration), CRUD `/api/medications`, et `PATCH /api/prescriptions/:id/dispense` (décrémente le stock, bloque double délivrance et stock insuffisant) + tests Jest.
- **Commit :** `MT-24 feat(pharmacy): add medication inventory CRUD and prescription dispensing`
- **PR & Fin de journée :** Ouvrir PR `MT-24` → Relire et merger `MT-23` de **Lhassan Oubihi** (PDFKit + QR Code).

### Jour 12 — Vendredi 4 décembre 2026
- **Tâche :** `MT-26` (`#19`) — **Interface Pharmacien Validation Ordonnances & Stocks** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-26-ui-pharmacy`
- **Prérequis :** `MT-24` mergé dans `develop`.
- **À faire :**
  - Créer `services/pharmacy.service.ts` et composants `pharmacy-orders` (file des ordonnances à valider) & `medication-stock` (CRUD stock avec badge rouge alerte si `stock <= seuilMin`).
- **Commit :** `MT-26 feat(ui-pharmacy): implement pharmacist prescription validation and stock alerts`
- **PR & Fin de journée :** Ouvrir PR `MT-26` → Relire et merger `MT-25` de **Lhassan Oubihi** (UI Consultation & PDF).

### Jours 13–14 — Samedi 5 / Dimanche 6 décembre 2026 *(Clôture Sprint 2 — Rôle Scrum Master)*
- Vérifier les 9 tickets du Sprint 2 (`MT-18` → `MT-26`) en **`Terminé(e)`**.
- Capturer le **Burndown Chart Sprint 2** (`docs/rapport/burndown_sprint2.png`).
- **Terminer Sprint 2** → **Démarrer Sprint 3** (`06 déc. → 13 déc.`).

---

## SPRINT 3 — Semaine 3 (06 déc. → 13 déc. 2026)

### Jour 15 — Lundi 7 décembre 2026
- **Tâche :** `MT-29` (`#22`) — **Préparation Couverture Tests Unitaires ≥ 60% & Sécurité** *(Backend / DevOps · 5 pts — partie 1/2)*
- **Branche :** `feature/MT-29-tests-coverage-docker`
- **À faire :**
  - Analyser `cd backend && npm test` (rapport Jest coverage) et ajouter des tests unitaires manquants (middlewares, validation, erreurs, notifications) pour viser `>= 65%`.
  - **En fin de journée :** Relire et merger `MT-27` de **Lhassan Oubihi** (API Stats).

### Jour 16 — Mardi 8 décembre 2026
- **Tâche :** `MT-29` (`#22`) — **Finalisation Couverture ≥ 60%, Durcissement HTTPS/CORS & Docker** *(Backend / DevOps · 5 pts — partie 2/2)*
- **Branche :** `feature/MT-29-tests-coverage-docker`
- **À faire :**
  - Vérifier `npm test` `>= 60%` global, configurer headers sécurité (`helmet`, rate-limit léger, SSL/nginx proxy prêt) et valider `docker-compose up --build`.
- **Commit :** `MT-29 test(backend): reach >=60% Jest coverage and harden Docker config`
- **PR & Fin de journée :** Ouvrir PR `MT-29` → Relire et merger `MT-28` de **Lhassan Oubihi** (Dashboard Chart.js).

### Jour 17 — Mercredi 9 décembre 2026
- **Tâche :** `MT-30` (`#23`) — **Tests E2E Cypress : Scénario Complet de Démonstration** *(Frontend / QA · 5 pts)*
- **Branche :** `feature/MT-30-cypress-e2e`
- **À faire :**
  - Configurer Cypress dans `frontend/` et écrire la suite E2E couvrant : Login → Création Patient → Prise de RDV → Consultation + Téléchargement PDF → Validation Pharmacie → Dashboard Statistiques.
  - Exécuter Cypress headless et vérifier 100 % des specs vertes.
- **Commit :** `MT-30 test(e2e): add Cypress end-to-end suite for full medical workflow`
- **PR & Fin de journée :** Ouvrir PR `MT-30` vers `develop`.

### Jours 18–19 — Jeudi 10 / Vendredi 11 décembre 2026
- **Tâche :** Contribution sur `MT-31` (`#24`) — **Captures Jira, Gestion SCRUM & UML/BPMN pour le Rapport** *(3 pts — partagé avec Lhassan)*
- **À faire :**
  - Exporter les captures propres du Board Jira `MT`, du Backlog, des **Burndown Charts (Sprints 1–3)** et du **Velocity Chart** dans `docs/rapport/`.
  - Relire la partie SCRUM/UML/BPMN du rapport 15–20 pages et merger la PR `MT-31` de Lhassan.

### Jours 20–21 — Samedi 12 / Dimanche 13 décembre 2026 *(Clôture Sprint 3 & Répétition Démo)*
- **Clôturer Sprint 3** dans Jira.
- Répéter la démonstration machine complète avec Lhassan devant la checklist 7/7 de Pr. S. Amri.

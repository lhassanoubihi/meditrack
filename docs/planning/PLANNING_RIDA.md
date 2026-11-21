# Planning Quotidien Antigravity — Rida Dandane

> **Profil :** `DevA` — Full-Stack (Backend Node.js/Express/MongoDB + Frontend Angular 17 + Sécurité RGPD & Analytics)  
> **Identité Git :** `Rida Dandane`  
> **Dépôt GitHub :** `https://github.com/lhassanoubihi/meditrack`  
> **Board Jira (`MT`) :** `https://lhassanoubihi.atlassian.net/jira/software/projects/MT/boards/67`  
> **Source officielle :** `docs/jira/meditrack_backlog_officiel.csv` *(5 Sprints · 34 Stories · 103 Sous-tâches)*

---

## Protocole Obligatoire pour l'Agent Antigravity de Rida Dandane

**À LIRE IMPÉRATIVEMENT PAR L'AGENT ANTIGRAVITY DE RIDA AVANT CHAQUE TÂCHE :**
*(Aucun script automatique ne tourne sur PC : tu exécutes tout proprement quand Rida t'ouvre chaque jour.)*

1. **VÉRIFICATION OBLIGATOIRE DU TEMPS / DE LA DATE :**
   ```powershell
   Get-Date -Format "yyyy-MM-dd HH:mm"
   ```
   *(ou sous Linux/macOS : `date +"%Y-%m-%d %H:%M"`)*
   - Compare la date système réelle avec le planning ci-dessous (du **22 nov. 2026** au **13 déc. 2026**).
   - **Si la date système ne correspond pas au jour demandé par Rida**, **avertis-le avant de coder ou de fermer le ticket** pour garder un **Burndown Chart Jira** cohérent jour par jour.
   - Ne réalise **que les sous-tâches de Rida Dandane du jour en cours**.

2. **Synchroniser Git & créer la branche du jour :**
   ```bash
   git config user.name "Rida Dandane"
   git checkout develop && git pull origin develop
   git checkout -b feature/MT-XX-usYY-description
   ```

3. **Passer le ticket Jira (et ses sous-tâches de Rida Dandane) à `En cours` (`In Progress`) :**
   - Dans Jira (`MT`) avant de commencer le code.

4. **Implémenter exactement les sous-tâches de Rida Dandane du jour + Tests / Build** (`npm test`, `ng build`, lint).

5. **Committer avec la clé Jira, pousser et ouvrir la Pull Request vers `develop` :**
   ```bash
   git add .
   git commit -m "MT-XX feat(module): US-YY description"
   git push -u origin feature/MT-XX-usYY-description
   gh pr create --base develop --head feature/MT-XX-usYY-description --title "MT-XX : US-YY Titre" --body "Closes #<issue_gh>"
   ```
   - Marquer le ticket Jira **`In Review`** (ou label `in-review`).

6. **Revue croisée de la PR de Lhassan Oubihi en fin de journée :**
   - Vérifier `gh pr list --state open`, contrôler la CI GitHub Actions et le diff, puis merger (`gh pr merge <num> --merge --delete-branch`).
   - Passer le ticket Jira mergé (et les sous-tâches complétées) à **`Terminé(e)`** (`Done`).

---

## SPRINT 1 — Semaine 1 (Dim 22 nov. → Mer 25 nov. 2026)

### Jour 1 — Dimanche 22 novembre 2026
- **US-01 (`MT-39`, `#1` · Binôme · 5 pts)** — Branche `feature/MT-39-us01-backend-docker` :
  - `US-01-T1` : Structure complète backend (`routes/`, `controllers/`, `services/`, `models/`, `middlewares/`, `config/`).
  - `US-01-T3` : `Dockerfiles` (API + Front) et `docker-compose.yml` avec MongoDB persistant.
- **Fin J1 :** Ouvrir PR `MT-39` → Relire & merger les PRs `US-01` (`T2,T4`) & **US-02 (`MT-40`)** (CI GitHub Actions) de Lhassan.

### Jour 2 — Lundi 23 novembre 2026
- **US-03 (`MT-41`, `#3` · Binôme · 3 pts)** — Branche `feature/MT-41-us03-register-api` :
  - `US-03-T1` : Modèle `User` Mongoose (hash `bcrypt` avant sauvegarde).
  - `US-03-T2` : Endpoint `POST /auth/register` + validation (email unique, mot de passe fort).
  - `US-03-T4` : Tests unitaires inscription (Jest).
- **US-04 (`MT-42`, `#4` · Binôme · 3 pts)** — Branche `feature/MT-42-us04-login-jwt` :
  - `US-04-T1` : Endpoint `POST /auth/login` + génération JWT.
  - `US-04-T2` : Middleware `authenticate` (vérification token, retour `401` si expiré/invalide).
- **Fin J2 :** Ouvrir PRs `MT-41` & `MT-42` → Relire & merger les PRs Angular `US-03` (`T3`) & `US-04` (`T3,T4`) de Lhassan.

### Jour 3 — Mardi 24 novembre 2026
- **US-05 (`MT-43`, `#5` · Binôme · 5 pts)** — Branche `feature/MT-43-us05-authorize-rbac` :
  - `US-05-T1` : Middleware `authorize(...roles)` renvoyant `403`.
  - `US-05-T4` : Tests unitaires des accès autorisés / interdits.
- **US-06 (`MT-44`, `#6` · Rida Dandane · 8 pts — partie 1/2)** — Branche `feature/MT-44-us06-2fa` :
  - `US-06-T1` : Endpoint génération du secret / code 2FA (`speakeasy` TOTP ou OTP email).
  - `US-06-T2` : Endpoint vérification du code 2FA + émission du JWT final.
- **Fin J3 :** Ouvrir PR `MT-43` → Relire & merger `US-05` (`T2,T3`) & **US-07 (`MT-45`)** de Lhassan.

### Jour 4 — Mercredi 25 novembre 2026 *(Fin Sprint 1)*
- **US-06 (`MT-44`, `#6` · Rida Dandane · 8 pts — partie 2/2)** — Branche `feature/MT-44-us06-2fa` :
  - `US-06-T3` : Écran Angular de saisie du code 2FA (QR code si TOTP).
  - `US-06-T4` : Gestion des erreurs (code invalide ou expiré).
  - `US-06-T5` : Tests unitaires 2FA.
- **Fin J4 :** Ouvrir PR `MT-44` → Clôture Sprint 1 avec Lhassan (**Complete Sprint 1 → Start Sprint 2**).

---

## SPRINT 2 — (Jeu 26 nov. → Dim 29 nov. 2026)

### Jour 5 — Jeudi 26 novembre 2026
- **US-08 (`MT-46`, `#8` · Rida Dandane · 5 pts)** — Branche `feature/MT-46-us08-create-patient` :
  - `US-08-T1` : Modèle `Patient` Mongoose + validation (identité, contact, antécédents, allergies, traitements).
  - `US-08-T2` : Endpoint `POST /patients` (retourne `201`).
  - `US-08-T3` : Formulaire Angular de création de dossier patient.
  - `US-08-T4` : Tests unitaires création patient.
- **Fin J5 :** Ouvrir PR `MT-46` → Relire & merger **US-13 (`MT-51`)** de Lhassan.

### Jour 6 — Vendredi 27 novembre 2026
- **US-10 (`MT-48`, `#10` · Rida Dandane · 5 pts)** — Branche `feature/MT-48-us10-update-patient` :
  - `US-10-T1` : Endpoint `PUT /patients/:id` + historique de modification tracé (date, auteur).
  - `US-10-T2` : Formulaire Angular de mise à jour du dossier.
  - `US-10-T3` : Tests unitaires modification.
- **Fin J6 :** Ouvrir PR `MT-48` → Relire & merger **US-09 (`MT-47`)** de Lhassan.

### Jour 7 — Samedi 28 novembre 2026
- **US-14 (`MT-52`, `#14` · Rida Dandane · 5 pts)** — Branche `feature/MT-52-us14-rgpd-audit` :
  - `US-14-T1` : Utilitaire crypto **AES-256-GCM** (`encrypt` / `decrypt`) + tests.
  - `US-14-T2` : Chiffrement des champs sensibles dans le modèle `Patient` + `cinHash` pour la recherche.
  - `US-14-T3` : Modèle `AuditLog` + middleware d'audit.
  - `US-14-T4` : Brancher l'audit sur les routes Patient + endpoint `GET /audit-logs` (Admin).
  - `US-14-T5` : Tests (déchiffrement vérifié, log d'audit créé).
- **Fin J7 :** Ouvrir PR `MT-52` → Relire & merger **US-11 (`MT-49`)** & **US-12 (`MT-50`)** de Lhassan.

### Jour 8 — Dimanche 29 novembre 2026 *(Clôture Sprint 2)*
- Vérifier les 7 Stories Sprint 2 en **Terminé(e)**, capturer Burndown Chart Sprint 2, **Complete Sprint 2 → Start Sprint 3**.

---

## SPRINT 3 — (Lun 30 nov. → Jeu 03 déc. 2026)

### Jour 9 — Lundi 30 novembre 2026
- **US-16 (`MT-54`, `#16` · Rida Dandane · 5 pts)** — Branche `feature/MT-54-us16-booking-rdv` :
  - `US-16-T1` : Modèle `RendezVous` + calcul des créneaux libres.
  - `US-16-T2` : Endpoint `POST /rendezvous` (statut initial « en attente »).
  - `US-16-T3` : Écran de réservation Angular (médecin, date, créneau).
  - `US-16-T4` : Tests unitaires réservation.
- **Fin J9 :** Ouvrir PR `MT-54` → Relire & merger **US-15 (`MT-53`)** de Lhassan.

### Jour 10 — Mardi 1er décembre 2026
- **US-21 (`MT-59`, `#21` · Rida Dandane · 3 pts)** — Branche `feature/MT-59-us21-anti-double-booking` :
  - `US-21-T1` : Contrainte d'unicité sur `(médecin, date, créneau)`.
  - `US-21-T2` : Retour HTTP `409 Conflict` + message d'erreur clair côté Angular.
  - `US-21-T3` : Test de concurrence / double réservation.
- **Fin J10 :** Ouvrir PR `MT-59` → Relire & merger **US-17 (`MT-55`)** & **US-20 (`MT-58`)** de Lhassan.

### Jour 11 — Mercredi 2 décembre 2026
- **US-19 (`MT-57`, `#19` · Rida Dandane · 3 pts)** — Branche `feature/MT-57-us19-email-cron` :
  - `US-19-T1` : Service email **Nodemailer** + templates HTML.
  - `US-19-T2` : Envoi automatique à la confirmation du RDV.
  - `US-19-T3` : Tâche planifiée backend (`node-cron`) de rappel 24h avant (J-1).
- **Fin J11 :** Ouvrir PR `MT-57` → Relire & merger **US-18 (`MT-56`)** (FullCalendar) de Lhassan.

### Jour 12 — Jeudi 3 décembre 2026 *(Clôture Sprint 3)*
- Valider Sprint 3, capture Burndown Chart Sprint 3, **Complete Sprint 3 → Start Sprint 4**.

---

## SPRINT 4 — (Ven 04 déc. → Lun 07 déc. 2026)

### Jour 13 — Vendredi 4 décembre 2026
- **US-22 (`MT-60`, `#22` · Rida Dandane · 5 pts)** — Branche `feature/MT-60-us22-consultations` :
  - `US-22-T1` : Modèle `Consultation` (lié RDV + patient).
  - `US-22-T2` : Endpoint `POST /consultations` + validation des champs obligatoires.
  - `US-22-T3` : Formulaire compte-rendu / diagnostic Angular.
- **Fin J13 :** Ouvrir PR `MT-60` → Relire & merger **US-27 (`MT-65`)** de Lhassan.

### Jour 14 — Samedi 5 décembre 2026
- **US-23 (`MT-61`, `#23` · Rida Dandane · 5 pts)** — Branche `feature/MT-61-us23-ordonnances` :
  - `US-23-T1` : Modèle `Ordonnance` (lignes : médicament, posologie, durée, liée à la consultation).
  - `US-23-T2` : Endpoint `POST /ordonnances`.
  - `US-23-T3` : Formulaire d'ordonnance Angular (lignes dynamiques `FormArray`).
- **Fin J14 :** Ouvrir PR `MT-61` → Relire & merger **US-25 (`MT-63`)** de Lhassan.

### Jour 15 — Dimanche 6 décembre 2026
- **US-24 (`MT-62`, `#24` · Rida Dandane · 5 pts)** — Branche `feature/MT-62-us24-ordonnance-pdf` :
  - `US-24-T1` : Génération PDF côté API (`pdfkit` : en-tête médecin, patient, date, médicaments).
  - `US-24-T2` : Endpoint `GET /ordonnances/:id/pdf`.
  - `US-24-T3` : Bouton de téléchargement PDF côté Angular.
- **Fin J15 :** Ouvrir PR `MT-62` → Relire & merger **US-26 (`MT-64`)** & **US-28 (`MT-66`)** de Lhassan.

### Jour 16 — Lundi 7 décembre 2026 *(Clôture Sprint 4)*
- Valider Sprint 4, capture Burndown Chart Sprint 4, **Complete Sprint 4 → Start Sprint 5**.

---

## SPRINT 5 — (Mar 08 déc. → Dim 13 déc. 2026)

### Jour 17 — Mardi 8 décembre 2026
- **US-29 (`MT-67`, `#29` · Rida Dandane · 5 pts)** — Branche `feature/MT-67-us29-dashboard-medecin` :
  - `US-29-T1` : Endpoints d'agrégation (RDV du jour, nombre de patients, consultations du mois).
  - `US-29-T2` : Tableau de bord médecin Angular (cartes KPI).
- **Fin J17 :** Ouvrir PR `MT-67` → Relire & merger **US-32 (`MT-70`)** de Lhassan.

### Jour 18 — Mercredi 9 décembre 2026
- **US-30 (`MT-68`, `#30` · Rida Dandane · 5 pts)** — Branche `feature/MT-68-us30-stats-specialite` :
  - `US-30-T1` : Pipeline d'agrégation MongoDB par spécialité et par période.
  - `US-30-T2` : Graphiques **Chart.js** dans Angular.
- **Fin J18 :** Ouvrir PR `MT-68` → Relire & merger **US-31 (`MT-69`)** (Cypress E2E) de Lhassan.

### Jour 19 — Jeudi 10 décembre 2026
- **US-34 (`MT-72`, `#34` · Binôme · 5 pts — partie 1/2)** — Branche `feature/MT-72-us34-rapport-devA` :
  - `US-34-T2` : Rédiger les sections Architecture technique, SCRUM/Jira et extraits de code commentés.
- **Fin J19 :** Relire & merger **US-33 (`MT-71`)** (README, Seed, Docker) de Lhassan.

### Jour 20 — Vendredi 11 / Samedi 12 décembre 2026
- **US-34 (`MT-72`, `#34` · Binôme — partie 2/2)** :
  - `US-34-T4` : Relecture croisée du rapport complet (avec `T1` et `T3` de Lhassan) + mise en page PDF finale (15–20 pages) + merge final de `MT-72`.

### Jour 21 — Dimanche 13 décembre 2026 *(Livraison & Soutenance)*
- **Complete Sprint 5** dans Jira, vérification finale de la checklist 7/7 de Pr. S. Amri et répétition de la soutenance avec Lhassan.

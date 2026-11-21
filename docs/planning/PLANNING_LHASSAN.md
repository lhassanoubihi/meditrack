# Planning Quotidien Antigravity — Lhassan Oubihi

> **Profil :** `DevB` — Full-Stack (Backend Node.js/Express/MongoDB + Frontend Angular 17 + CI/CD & QA)  
> **Identité Git :** `Lhassan Oubihi <lhassan.oubihi1@gmail.com>`  
> **Dépôt GitHub :** `https://github.com/lhassanoubihi/meditrack`  
> **Board Jira (`MED`) :** `https://lhassanoubihi.atlassian.net/jira/software/projects/MED/boards/68`  
> **Source officielle :** `docs/jira/meditrack_backlog_officiel.csv` *(5 Sprints · 34 Stories · 103 Sous-tâches)*

---

## Protocole Obligatoire pour l'Agent Antigravity de Lhassan

*(Aucun script automatique ne tourne sur le PC : tout est exécuté à la demande quand Lhassan ouvre Antigravity.)*

1. **VÉRIFIER LA DATE DU JOUR EN PREMIER :**
   ```powershell
   Get-Date -Format "yyyy-MM-dd HH:mm"
   ```
   - Compare avec le calendrier (du **22 nov. 2026** au **13 déc. 2026**).
   - N'exécute **que les tâches prévues pour le jour courant** afin que le **Burndown Chart Jira** reste réaliste et cohérent. Préviens Lhassan si la date ne correspond pas.
2. **Synchroniser Git & créer la branche :**
   ```bash
   git config user.name "Lhassan Oubihi"
   git config user.email "lhassan.oubihi1@gmail.com"
   git checkout develop && git pull origin develop
   git checkout -b feature/MED-XX-usYY-description
   ```
3. **Passer le ticket Jira (et ses sous-tâches de Lhassan Oubihi) à `En cours` (`In Progress`) :**
   - Via Jira UI ou `twg jira workitem transition --id MED-XX --transition-id 21 --site lhassanoubihi.atlassian.net`.
4. **Implémenter exactement les sous-tâches de Lhassan Oubihi du jour + Tests / Build** (`npm test`, `ng build`, lint).
5. **Committer avec la clé Jira, pousser et ouvrir la Pull Request vers `develop` :**
   ```bash
   git add .
   git commit -m "MED-XX feat(module): US-YY description"
   git push -u origin feature/MED-XX-usYY-description
   gh pr create --base develop --head feature/MED-XX-usYY-description --title "MED-XX : US-YY Titre" --body "Closes #<issue_gh>"
   ```
   - Marquer le ticket Jira **`In Review`** (ou label `in-review`).
6. **Revue croisée de la PR de Rida Dandane :**
   - Vérifier `gh pr list --state open`, relire, vérifier la CI GitHub Actions, puis merger (`gh pr merge <num> --merge --delete-branch`).
   - Passer le ticket Jira mergé (et les sous-tâches complétées) à **`Terminé(e)`** (`Done`, transition `31`).

---

## SPRINT 1 — Semaine 1 (Dim 22 nov. → Mer 25 nov. 2026)

### Jour 1 — Dimanche 22 novembre 2026
- **US-01 (`MED-8`, `#1` · Binôme)** — Branche `feature/MED-8-us01-angular-readme` :
  - `US-01-T2` : Init projet Angular 17 + Angular Material (`frontend/`).
  - `US-01-T4` : Compléter `.env.example` + README de démarrage clair.
- **US-02 (`MED-9`, `#2` · Lhassan Oubihi · 3 pts)** — Branche `feature/MED-9-us02-ci-github-actions` :
  - `US-02-T1` : Workflow `.github/workflows/ci.yml` : install + lint (ESLint backend & frontend).
  - `US-02-T2` : Étape tests Jest dans le workflow CI sur chaque PR.
  - `US-02-T3` : Ajouter le badge CI GitHub Actions dans `README.md`.
- **Fin J1 :** Ouvrir PRs `MED-8` (front/env) & `MED-9` → Relire & merger la PR `US-01` (`T1,T3`) de Rida.

### Jour 2 — Lundi 23 novembre 2026
- **US-03 (`MED-10`, `#3` · Binôme)** — Branche `feature/MED-10-us03-register-ui` :
  - `US-03-T3` : Formulaire d'inscription patient Angular (validation email + mot de passe fort).
- **US-04 (`MED-11`, `#4` · Binôme)** — Branche `feature/MED-11-us04-login-ui-tests` :
  - `US-04-T3` : Page de login Angular + `AuthService` + intercepteur HTTP JWT.
  - `US-04-T4` : Tests unitaires login.
- **Fin J2 :** Ouvrir PRs `MED-10` & `MED-11` → Relire & merger les PRs backend `US-03` & `US-04` de Rida.

### Jour 3 — Mardi 24 novembre 2026
- **US-05 (`MED-12`, `#5` · Binôme)** — Branche `feature/MED-12-us05-role-guards-ui` :
  - `US-05-T2` : Guards Angular par rôle (`Admin`, `Médecin`, `Infirmier`, `Patient`, `Pharmacien`).
  - `US-05-T3` : Menu dynamique et redirection selon le rôle.
- **US-07 (`MED-14`, `#7` · Lhassan Oubihi · 3 pts)** — Branche `feature/MED-14-us07-staff-crud` :
  - `US-07-T1` : CRUD utilisateurs côté API (Admin only).
  - `US-07-T2` : Écrans Angular de gestion des comptes du personnel.
  - `US-07-T3` : Activation / désactivation de compte.
- **Fin J3 :** Ouvrir PRs `MED-12` & `MED-14` → Relire & merger la PR `US-05` (`T1,T4`) de Rida.

### Jour 4 — Mercredi 25 novembre 2026 *(Clôture Sprint 1)*
- Relire et merger la PR **US-06 (`MED-13`)** (2FA complète) de Rida.
- Vérifier `docker-compose up --build` + CI verte, merger `develop` → `main` (`v0.1-sprint1`), capturer le **Burndown Chart Sprint 1**, **Complete Sprint 1 → Start Sprint 2**.

---

## SPRINT 2 — (Jeu 26 nov. → Dim 29 nov. 2026)

### Jour 5 — Jeudi 26 novembre 2026
- **US-13 (`MED-20`, `#13` · Lhassan Oubihi · 5 pts)** — Branche `feature/MED-20-us13-angular-layout` :
  - `US-13-T1` : Layout Angular Material (`header`, `sidenav` par rôle).
  - `US-13-T2` : Gestion centralisée des erreurs (intercepteur HTTP + `MatSnackBar`).
  - `US-13-T3` : Routing + lazy loading des modules Angular.
- **Fin J5 :** Ouvrir PR `MED-20` → Relire & merger **US-08 (`MED-15`)** de Rida.

### Jour 6 — Vendredi 27 novembre 2026
- **US-09 (`MED-16`, `#9` · Lhassan Oubihi · 3 pts)** — Branche `feature/MED-16-us09-patient-search` :
  - `US-09-T1` : Endpoint `GET /patients` avec recherche (nom / CIN) + pagination.
  - `US-09-T2` : Liste/recherche Angular (table paginée `MatTable`).
  - `US-09-T3` : Page de détail complet du dossier patient.
- **Fin J6 :** Ouvrir PR `MED-16` → Relire & merger **US-10 (`MED-17`)** de Rida.

### Jour 7 — Samedi 28 novembre 2026
- **US-11 (`MED-18`, `#11` · Lhassan Oubihi · 2 pts)** — Branche `feature/MED-18-us11-patient-archive` :
  - `US-11-T1` : Champ `isArchived` + endpoint d'archivage (soft delete).
  - `US-11-T2` : Filtre des archivés dans les listes + bouton Angular.
- **US-12 (`MED-19`, `#12` · Lhassan Oubihi · 3 pts)** — Branche `feature/MED-19-us12-patient-me` :
  - `US-12-T1` : Endpoint `GET /patients/me` (lecture seule pour le patient connecté).
  - `US-12-T2` : Page « Mon dossier » Angular.
- **Fin J7 :** Ouvrir PRs `MED-18` & `MED-19` → Relire & merger **US-14 (`MED-21`)** (RGPD AES-256-GCM + AuditLog) de Rida.

### Jour 8 — Dimanche 29 novembre 2026 *(Clôture Sprint 2)*
- Vérifier toutes les Stories Sprint 2 en **Terminé(e)**, merger `develop` → `main` (`v0.2-sprint2`), capturer **Burndown Chart Sprint 2**, **Complete Sprint 2 → Start Sprint 3**.

---

## SPRINT 3 — (Lun 30 nov. → Jeu 03 déc. 2026)

### Jour 9 — Lundi 30 novembre 2026
- **US-15 (`MED-22`, `#15` · Lhassan Oubihi · 3 pts)** — Branche `feature/MED-22-us15-disponibilites` :
  - `US-15-T1` : Modèle `Disponibilite` (jours, horaires, durée de créneau).
  - `US-15-T2` : Endpoints CRUD disponibilités médecin.
  - `US-15-T3` : Écran Angular de configuration des disponibilités.
- **Fin J9 :** Ouvrir PR `MED-22` → Relire & merger **US-16 (`MED-23`)** de Rida.

### Jour 10 — Mardi 1er décembre 2026
- **US-17 (`MED-24`, `#17` · Lhassan Oubihi · 3 pts)** — Branche `feature/MED-24-us17-rdv-statut` :
  - `US-17-T1` : Endpoint `PATCH /rendezvous/:id/statut` (confirmer / refuser / annuler, tracé).
  - `US-17-T2` : Boutons d'action et liste des RDV côté médecin.
- **US-20 (`MED-27`, `#20` · Lhassan Oubihi · 3 pts)** — Branche `feature/MED-27-us20-sms-twilio` :
  - `US-20-T1` : Service SMS Twilio (mode test).
  - `US-20-T2` : Gestion d'échec sans jamais bloquer l'application.
- **Fin J10 :** Ouvrir PRs `MED-24` & `MED-27` → Relire & merger **US-21 (`MED-28`)** de Rida.

### Jour 11 — Mercredi 2 décembre 2026
- **US-18 (`MED-25`, `#18` · Lhassan Oubihi · 5 pts)** — Branche `feature/MED-25-us18-fullcalendar` :
  - `US-18-T1` : Intégrer **FullCalendar** dans Angular (vues jour / semaine / mois).
  - `US-18-T2` : Alimenter le calendrier depuis l'API `/rendezvous`.
  - `US-18-T3` : Modale/panneau détail du RDV au clic.
- **Fin J11 :** Ouvrir PR `MED-25` → Relire & merger **US-19 (`MED-26`)** de Rida.

### Jour 12 — Jeudi 3 décembre 2026 *(Clôture Sprint 3)*
- Tester le flux RDV + FullCalendar + Nodemailer + Twilio, merger `develop` → `main` (`v0.3-sprint3`), capturer **Burndown Chart Sprint 3**, **Complete Sprint 3 → Start Sprint 4**.

---

## SPRINT 4 — (Ven 04 déc. → Lun 07 déc. 2026)

### Jour 13 — Vendredi 4 décembre 2026
- **US-27 (`MED-34`, `#27` · Lhassan Oubihi · 5 pts)** — Branche `feature/MED-34-us27-stock-medicaments` :
  - `US-27-T1` : Modèle `Medicament` + CRUD API (quantité, seuil minimum).
  - `US-27-T2` : Écrans Angular de gestion du stock de médicaments.
- **Fin J13 :** Ouvrir PR `MED-34` → Relire & merger **US-22 (`MED-29`)** de Rida.

### Jour 14 — Samedi 5 décembre 2026
- **US-25 (`MED-32`, `#25` · Lhassan Oubihi · 3 pts)** — Branche `feature/MED-32-us25-historique-consultations` :
  - `US-25-T1` : Endpoint `GET /patients/:id/consultations` (liste chronologique).
  - `US-25-T2` : Timeline des consultations Angular avec accès au détail et à l'ordonnance.
- **Fin J14 :** Ouvrir PR `MED-32` → Relire & merger **US-23 (`MED-30`)** de Rida.

### Jour 15 — Dimanche 6 décembre 2026
- **US-26 (`MED-33`, `#26` · Lhassan Oubihi · 3 pts)** — Branche `feature/MED-33-us26-validation-ordonnance` :
  - `US-26-T1` : Statuts d'ordonnance (`émise > validée > délivrée`) + refus si déjà délivrée.
  - `US-26-T2` : Écran pharmacien : liste et validation des ordonnances.
- **US-28 (`MED-35`, `#28` · Lhassan Oubihi · 3 pts)** — Branche `feature/MED-35-us28-decrementation-stock` :
  - `US-28-T1` : Décrémentation automatique du stock à la délivrance (transaction).
  - `US-28-T2` : Badge d'alerte visuel sous le seuil minimum.
- **Fin J15 :** Ouvrir PRs `MED-33` & `MED-35` → Relire & merger **US-24 (`MED-31`)** (PDFKit) de Rida.

### Jour 16 — Lundi 7 décembre 2026 *(Clôture Sprint 4)*
- Tester bout-en-bout Consultation → Ordonnance PDF → Validation Pharmacie → Décrémentation Stock, merger `develop` → `main` (`v0.4-sprint4`), capturer **Burndown Chart Sprint 4**, **Complete Sprint 4 → Start Sprint 5**.

---

## SPRINT 5 — (Mar 08 déc. → Dim 13 déc. 2026)

### Jour 17 — Mardi 8 décembre 2026
- **US-32 (`MED-39`, `#32` · Lhassan Oubihi · 5 pts)** — Branche `feature/MED-39-us32-coverage-60` :
  - `US-32-T1` : Compléter les tests unitaires backend (services / controllers).
  - `US-32-T2` : Tests des composants Angular clés.
  - `US-32-T3` : Vérifier et générer le rapport de couverture Jest `>= 60%`.
- **Fin J17 :** Ouvrir PR `MED-39` → Relire & merger **US-29 (`MED-36`)** de Rida.

### Jour 18 — Mercredi 9 décembre 2026
- **US-31 (`MED-38`, `#31` · Lhassan Oubihi · 5 pts)** — Branche `feature/MED-38-us31-cypress-e2e` :
  - `US-31-T1` : Installer et configurer **Cypress**.
  - `US-31-T2` : Scénario E2E complet : `login 2FA > RDV > consultation > ordonnance`.
  - `US-31-T3` : Seed de données de test E2E.
- **Fin J18 :** Ouvrir PR `MED-38` → Relire & merger **US-30 (`MED-37`)** de Rida.

### Jour 19 — Jeudi 10 décembre 2026
- **US-33 (`MED-40`, `#33` · Lhassan Oubihi · 3 pts)** — Branche `feature/MED-40-us33-readme-seed-docker` :
  - `US-33-T1` : `README.md` détaillé (installation, variables `.env`, comptes de démo).
  - `US-33-T2` : Script de `seed` (users par rôle, patients, RDV, médicaments).
  - `US-33-T3` : Vérifier `docker-compose up --build` sur machine propre.
- **Fin J19 :** Ouvrir PR `MED-40`.

### Jour 20 — Vendredi 11 / Samedi 12 décembre 2026
- **US-34 (`MED-41`, `#34` · Binôme · 5 pts)** — Branche `feature/MED-41-us34-rapport-final` :
  - `US-34-T1` : Rédiger introduction, analyse des besoins, conception UML/BPMN (`docs/uml/`, `docs/bpmn/`).
  - `US-34-T3` : Captures Jira (backlog, Burndown Charts Sprints 1–5, rétros) + annexe `docker-compose.yml`.
- **Fin J20 :** Ouvrir PR `MED-41` (complétée et relue par Rida `T2` & `T4`).

### Jour 21 — Dimanche 13 décembre 2026 *(Livraison & Soutenance)*
- Merge final `develop` → `main`, tag `v1.0-final`, **Complete Sprint 5**, validation checklist 7/7 Pr. S. Amri.

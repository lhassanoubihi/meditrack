# Planning Quotidien Antigravity — Rida Dandane (Modules Complets en Parallèle)

> **Rôle :** Scrum Master (SM) + Développeur Full-Stack (Frontend Angular 17 + Backend Node.js/MongoDB)  
> **Mes Modules Complets (Back + Front) :**  
> 1. **Sprint 1 :** Socle Angular 17 + **Module Dossier Patient RGPD complet (Back + Front)** (`MT-9`, `MT-14`, `MT-15`, `MT-16`, `MT-17`)  
> 2. **Sprint 2 :** **Modules Consultations, Ordonnances PDF & Pharmacie complets (Back + Front)** (`MT-22`, `MT-23`, `MT-24`, `MT-25`, `MT-26`)  
> 3. **Sprint 3 :** **Pôle Qualité, Tests (Back Jest ≥ 60% + Front Cypress E2E) & Docker Final** (`MT-29`, `MT-30`) + contribution `MT-31`  
> **Identité Git :** `Rida Dandane`  
> **Dépôt GitHub :** `https://github.com/lhassanoubihi/meditrack`  
> **Board Jira (`MT`) :** `https://lhassanoubihi.atlassian.net/jira/software/projects/MT/boards/67`

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
   - **Si la date système ne correspond pas au jour demandé par Rida**, **arrête-toi et préviens Rida** avant de modifier du code ou de fermer le ticket, afin que le **Burndown Chart Jira** reste réaliste et cohérent jour après jour.
   - Ne réalise **que la tâche du jour en cours**.

2. **Synchroniser `develop` & créer la branche du jour :**
   ```bash
   git config user.name "Rida Dandane"
   git checkout develop && git pull origin develop
   git checkout -b feature/MT-XX-description
   ```

3. **Passer le ticket Jira à `En cours` :**
   - Pousse la branche (`git push -u origin feature/MT-XX-description`) ou transitionne `MT-XX` vers **`En cours`** sur le Board Jira `MT`.

4. **Développer uniquement les fichiers de son module + Tests :**
   - Comme chaque module est complet et indépendant, tu n'as **aucune attente bloquante** sur le code de Lhassan du même jour.
   - Lance toujours `npm test` (Backend) ou `npm run build` (Frontend) avant de commiter.

5. **Committer avec la clé Jira, pousser et ouvrir la Pull Request vers `develop` :**
   ```bash
   git add .
   git commit -m "MT-XX feat(module): description claire"
   git push -u origin feature/MT-XX-description
   gh pr create --base develop --head feature/MT-XX-description --title "MT-XX : Titre Story" --body "Closes #<issue_gh>"
   ```
   - Passe le ticket Jira `MT-XX` à **`In Review`** (ou ajoute le label `in-review`).

6. **Revue croisée & Merge de la PR de Lhassan Oubihi (fin de journée) :**
   - Liste les PR ouvertes (`gh pr list --state open`), vérifie le code et la CI de Lhassan, puis merge sa PR (`gh pr merge <num> --merge --delete-branch`).
   - Passe le ticket mergé à **`Terminé(e)`** (`Done`) et vérifie la descente du Burndown Chart (rôle Scrum Master).

---

## SPRINT 1 — Semaine 1 : Socle Angular 17 + Module Dossier Patient RGPD Complet

### Jour 1 — Dimanche 22 novembre 2026
- **Tâche :** `MT-9` (`#2`) — **Initialisation Frontend Angular 17, Angular Material & Layout** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-9-angular17-setup`
- **À faire :**
  - Initialiser Angular 17 dans `frontend/` (`--standalone --routing --style=scss`), installer `@angular/material`, configurer le thème médical, Navbar/Sidebar responsive par rôle, `environment.ts` et intercepteur HTTP JWT de base.
  - Configurer `frontend/Dockerfile` en build multi-étapes (Node 20 → Nginx) et vérifier `npm run build`.
- **Commit :** `MT-9 feat(ui): initialize Angular 17 app with Material medical theme and layout`
- **Fin de journée :** Ouvrir PR `MT-9` → Relire et merger la PR `MT-8` de **Lhassan Oubihi** (Docker/MEAN).

### Jour 2 — Lundi 23 novembre 2026
- **Tâche :** `MT-14` (`#7`) — **Modèle Mongoose Patient & Chiffrement RGPD AES-256** *(Backend · 5 pts)*
- **Branche :** `feature/MT-14-patient-model-rgpd`
- **À faire :**
  - Créer `backend/src/utils/encryption.js` (chiffrement/déchiffrement AES-256 avec `ENCRYPTION_KEY` du `.env`).
  - Créer `backend/src/models/Patient.js` (identité, CIN, groupe sanguin, antécédents, allergies, traitements chiffrés en base).
  - Écrire `backend/tests/encryption.test.js` et vérifier `npm test`.
- **Commit :** `MT-14 feat(rgpd): add Patient Mongoose model with AES-256 sensitive data encryption`
- **Fin de journée :** Ouvrir PR `MT-14` → Relire et merger la PR `MT-10` de **Lhassan Oubihi** (Auth JWT + 2FA).

### Jour 3 — Mardi 24 novembre 2026
- **Tâche :** `MT-15` (`#8`) — **API REST CRUD Dossier Patient + Recherche & Tests Jest** *(Backend · 5 pts)*
- **Branche :** `feature/MT-15-api-patients-crud`
- **Prérequis :** `MT-14` mergé dans `develop` (plus `MT-10`/`MT-11` si déjà mergés pour les middlewares RBAC, sinon appliquer après merge).
- **À faire :**
  - Créer `backend/src/controllers/patient.controller.js` et `backend/src/routes/patient.routes.js` (`POST /GET /PUT /DELETE /api/patients`, recherche nom/CIN, pagination, déchiffrement sécurisé selon rôle).
  - Écrire `backend/tests/patient.test.js` et vérifier `npm test`.
- **Commit :** `MT-15 feat(patients): add CRUD endpoints, search, pagination and Jest tests`
- **Fin de journée :** Ouvrir PR `MT-15` → Relire et merger la PR `MT-11` de **Lhassan Oubihi** (Users & RBAC).

### Jour 4 — Mercredi 25 novembre 2026
- **Tâche :** `MT-16` (`#9`) — **Interface Angular Liste, Recherche & Fiche Dossier Patient** *(Frontend · 8 pts — partie 1/2)*
- **Branche :** `feature/MT-16-ui-patient-list`
- **Prérequis :** `MT-9` et `MT-15` mergés dans `develop`.
- **À faire :**
  - Créer `services/patient.service.ts` et `components/patients/patient-list` (`MatTable` avec recherche par nom/CIN, tri, pagination).
- **Fin de journée :** Relire et merger la PR `MT-12` de **Lhassan Oubihi** (UI Login/2FA/Profil).

### Jour 5 — Jeudi 26 novembre 2026
- **Tâche :** `MT-16` (`#9`) — **Fiche Médicale Détaillée Patient (Onglets)** *(Frontend · 8 pts — partie 2/2)*
- **Branche :** `feature/MT-16-ui-patient-list`
- **À faire :**
  - Créer `components/patients/patient-detail` (onglets Identité, Antécédents, Allergies, Traitements en cours), relier les routes et vérifier `npm run build`.
- **Commit :** `MT-16 feat(ui-patients): implement patient table with search and detailed medical view`
- **Fin de journée :** Ouvrir PR `MT-16` → Relire et merger la PR `MT-13` de **Lhassan Oubihi** (UML & BPMN).

### Jour 6 — Vendredi 27 novembre 2026
- **Tâche :** `MT-17` (`#10`) — **Formulaires Angular Création & Édition Dossier Patient** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-17-ui-patient-forms`
- **Prérequis :** `MT-16` mergé dans `develop`.
- **À faire :**
  - Créer `components/patients/patient-form` avec Reactive Forms + `FormArray` dynamiques (ajout/suppression d'antécédents, allergies, traitements) + `MatSnackBar` + vérification `npm run build`.
- **Commit :** `MT-17 feat(ui-patients): complete dynamic reactive forms for patient creation and editing`
- **Fin de journée :** Ouvrir PR `MT-17` vers `develop` (Lhassan la merge après validation).

### Jour 7 — Samedi 28 / Dimanche 29 novembre 2026 *(Clôture Sprint 1 — Scrum Master)*
- Vérifier les 10 tickets Sprint 1 en **`Terminé(e)`**, animer Review + Rétro, capturer le **Burndown Chart Sprint 1**, **Terminer Sprint 1 → Démarrer Sprint 2**.

---

## SPRINT 2 — Semaine 2 : Modules Complets Consultations, Ordonnances PDF & Pharmacie

### Jour 8 — Lundi 30 novembre 2026
- **Tâche :** `MT-22` (`#15`) — **API REST Consultations : Compte-rendu & Diagnostic** *(Backend · 5 pts)*
- **Branche :** `feature/MT-22-api-consultations`
- **À faire :**
  - Créer `backend/src/models/Consultation.js`, `Prescription.js`, `consultation.controller.js` et `consultation.routes.js` (signes vitaux, diagnostic, médicaments prescrits, historique par patient) + `backend/tests/consultation.test.js`.
- **Commit :** `MT-22 feat(consultations): implement consultations and prescriptions REST API`
- **Fin de journée :** Ouvrir PR `MT-22` → Relire et merger la PR `MT-18` de **Lhassan Oubihi** (API RDV anti-conflit).

### Jour 9 — Mardi 1er décembre 2026
- **Tâche :** `MT-23` (`#16`) — **Génération Ordonnance Numérique PDF & QR Code** *(Backend · 5 pts)*
- **Branche :** `feature/MT-23-prescription-pdf-qr`
- **Prérequis :** `MT-22` mergé dans `develop`.
- **À faire :**
  - Créer `backend/src/services/pdf.service.js` avec `pdfkit` + QR Code de vérification + endpoint `GET /api/prescriptions/:id/pdf` + test Jest vérifiant l'en-tête `%PDF-`.
- **Commit :** `MT-23 feat(pdf): generate signed digital prescription PDF with QR verification`
- **Fin de journée :** Ouvrir PR `MT-23` → Relire et merger la PR `MT-19` de **Lhassan Oubihi** (Notifications Email/SMS).

### Jour 10 — Mercredi 2 décembre 2026
- **Tâche :** `MT-24` (`#17`) — **API REST Pharmacie : Validation Ordonnance & Stock Médicaments** *(Backend · 5 pts)*
- **Branche :** `feature/MT-24-api-pharmacy-stock`
- **Prérequis :** `MT-22` mergé dans `develop`.
- **À faire :**
  - Créer `backend/src/models/Medication.js`, CRUD `/api/medications`, et `PATCH /api/prescriptions/:id/dispense` (décrémente le stock, bloque double délivrance et alerte seuil critique) + `backend/tests/pharmacy.test.js`.
- **Commit :** `MT-24 feat(pharmacy): add medication inventory CRUD and prescription dispensing`
- **Fin de journée :** Ouvrir PR `MT-24` vers `develop`.

### Jour 11 — Jeudi 3 décembre 2026
- **Tâche :** `MT-25` (`#18`) — **Interface Médecin Saisie Consultation & Ordonnance PDF** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-25-ui-consultation-pdf`
- **Prérequis :** `MT-22` et `MT-23` mergés dans `develop`.
- **À faire :**
  - Créer `services/consultation.service.ts` et `components/consultations/consultation-form` (signes vitaux, diagnostic, `FormArray` médicaments/posologies, bouton **Télécharger Ordonnance PDF**) + `ng build`.
- **Commit :** `MT-25 feat(ui-consultation): add doctor consultation form and PDF download`
- **Fin de journée :** Ouvrir PR `MT-25` → Relire et merger la PR `MT-20` de **Lhassan Oubihi** (Calendrier interactif).

### Jour 12 — Vendredi 4 décembre 2026
- **Tâche :** `MT-26` (`#19`) — **Interface Pharmacien Validation Ordonnances & Stocks** *(Frontend · 5 pts)*
- **Branche :** `feature/MT-26-ui-pharmacy`
- **Prérequis :** `MT-24` mergé dans `develop`.
- **À faire :**
  - Créer `services/pharmacy.service.ts` et composants `pharmacy-orders` (file des ordonnances à délivrer + bouton Valider) & `medication-stock` (CRUD stock avec badge rouge alerte si `stock <= seuilMin`) + `ng build`.
- **Commit :** `MT-26 feat(ui-pharmacy): implement pharmacist prescription validation and stock alerts`
- **Fin de journée :** Ouvrir PR `MT-26` → Relire et merger la PR `MT-21` de **Lhassan Oubihi** (Statuts RDV).

### Jours 13–14 — Samedi 5 / Dimanche 6 décembre 2026 *(Clôture Sprint 2 — Scrum Master)*
- Vérifier les 9 tickets Sprint 2 en **`Terminé(e)`**, capturer le **Burndown Chart Sprint 2**, **Terminer Sprint 2 → Démarrer Sprint 3**.

---

## SPRINT 3 — Semaine 3 : Pôle Complet Qualité, Tests (Jest + Cypress) & Docker Final

### Jour 15 — Lundi 7 décembre 2026
- **Tâche :** `MT-29` (`#22`) — **Couverture Tests Unitaires ≥ 60% & Durcissement Sécurité** *(Backend / DevOps · 5 pts — partie 1/2)*
- **Branche :** `feature/MT-29-tests-coverage-docker`
- **À faire :**
  - Exécuter `cd backend && npm test` (Jest coverage), combler les tests manquants sur contrôleurs/services/middlewares pour dépasser `60%`.
- **Fin de journée :** Relire et merger la PR `MT-27` de **Lhassan Oubihi** (API Stats).

### Jour 16 — Mardi 8 décembre 2026
- **Tâche :** `MT-29` (`#22`) — **Finalisation Couverture ≥ 60%, HTTPS & Docker Final** *(Backend / DevOps · 5 pts — partie 2/2)*
- **Branche :** `feature/MT-29-tests-coverage-docker`
- **À faire :**
  - Vérifier `npm test >= 60%` global, durcir headers/CORS/SSL Nginx et valider `docker-compose up --build`.
- **Commit :** `MT-29 test(backend): reach >=60% Jest coverage and harden Docker config`
- **Fin de journée :** Ouvrir PR `MT-29` → Relire et merger la PR `MT-28` de **Lhassan Oubihi** (Dashboard Chart.js).

### Jour 17–18 — Mercredi 9 & Jeudi 10 décembre 2026
- **Tâche :** `MT-30` (`#23`) — **Tests E2E Cypress : Scénario Complet de Démonstration** *(Frontend / QA · 5 pts)*
- **Branche :** `feature/MT-30-cypress-e2e`
- **À faire :**
  - **J17 :** Installer & configurer Cypress dans `frontend/` + écrire tests Login/2FA/Patient/RDV.
  - **J18 :** Compléter scénario Consultation + PDF + Pharmacie + Dashboard Statistiques, exécuter la suite complète 100 % verte.
- **Commit :** `MT-30 test(e2e): add Cypress end-to-end suite for full medical workflow`
- **Fin de journée J18 :** Ouvrir PR `MT-30` vers `develop`.

### Jour 19 — Vendredi 11 décembre 2026
- **Tâche :** Contribution `MT-31` (`#24`) — **Captures Jira (Burndown Charts & Vélocité) + Relecture Rapport** *(partagé avec Lhassan)*
- **À faire :** Exporter les captures du Board Jira, des **Burndown Charts (Sprints 1–3)** et du **Velocity Chart** dans `docs/rapport/`, relire les diagrammes UML/BPMN et merger la PR `MT-31` de Lhassan.

### Jours 20–21 — Samedi 12 / Dimanche 13 décembre 2026 *(Clôture Sprint 3 & Soutenance)*
- **Terminer Sprint 3** dans Jira, vérifier la checklist 7/7 de Pr. S. Amri et répéter la démo machine complète avec Lhassan.

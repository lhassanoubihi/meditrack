# MediTrack — Plateforme de Gestion Médicale en Ligne

> **Projet 2 — Systèmes d'Information (Méthode Agile SCRUM sous Jira)**  
> **Établissement :** École Nationale Supérieure d'Arts et Métiers (ENSAM Meknès)  
> **Filière :** Ingénierie des Logiciels et des Systèmes d'Information — ILSI-4A  
> **Année Universitaire :** 2026 / 2027  
> **Encadrant :** Pr. S. Amri  
> **Équipe :** Lhassan Oubihi (Product Owner & Dev Full-Stack) · Rida Dandane (Scrum Master & Dev Full-Stack)

---

## 1. Contexte & Objectifs

Les établissements de santé font face à une gestion complexe des dossiers patients, des rendez-vous et des ordonnances. **MediTrack** est une plateforme web de gestion médicale permettant aux **médecins, infirmiers, pharmaciens, administrateurs et patients** d'interagir dans un environnement sécurisé et centralisé.

### Objectifs principaux
- Digitaliser la gestion des dossiers médicaux patients (antécédents, allergies, traitements)
- Permettre la prise de rendez-vous en ligne avec calendrier interactif et rappels Email/SMS
- Gérer les consultations, ordonnances numériques (PDF) et la validation/stock pharmacie
- Assurer la confidentialité et la conformité RGPD (JWT, bcrypt, authentification 2FA, chiffrement AES-256, HTTPS)

---

## 2. Architecture Technique (MEAN Stack + Docker)

| Couche | Technologies |
| :--- | :--- |
| **Frontend** | Angular 17 (TypeScript, RxJS, Angular Material) |
| **Backend** | Node.js + Express.js (REST API) |
| **Base de données** | MongoDB (Mongoose ODM) |
| **Sécurité** | JWT, bcrypt, Authentification 2FA, Chiffrement AES-256, HTTPS |
| **Notifications** | Nodemailer (Email) + Twilio (SMS) |
| **Génération PDF** | PDFKit (Ordonnances numériques + QR Code) |
| **Tests** | Jest + Supertest (Backend ≥ 60% couverture), Cypress (E2E) |
| **Conteneurisation** | Docker + Docker Compose |
| **Gestion de projet** | Jira Software — Board Scrum : https://lhassanoubihi.atlassian.net/jira/software/projects/MT/boards/67 (Clé `MT`, 3 Sprints × 1 semaine, Burndown Charts) |

---

## 3. Structure du Dépôt

```text
meditrack/
├── backend/                  # API REST Node.js + Express + Mongoose
│   ├── src/
│   │   ├── config/           # Configuration DB, env, chiffrement
│   │   ├── controllers/      # Contrôleurs métier
│   │   ├── middlewares/      # Auth JWT, RBAC, validation, gestion erreurs
│   │   ├── models/           # Schémas Mongoose (User, Patient, Appointment, Consultation, Medication)
│   │   ├── routes/           # Routes Express REST
│   │   ├── services/         # Notifications (Nodemailer/Twilio), PDF, 2FA, Stats
│   │   └── server.js         # Point d'entrée Express
│   ├── tests/                # Tests unitaires & intégration (Jest + Supertest)
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # Application Angular 17 + Angular Material
│   ├── Dockerfile
│   ├── nginx.conf
│   └── README.md
├── docs/
│   ├── jira/                 # Export CSV prêt pour import Jira (meditrack_jira_backlog.csv)
│   ├── uml/                  # Diagrammes Use Case, Classes, Séquence
│   ├── bpmn/                 # Diagrammes BPMN (processus RDV / Consultation / Pharmacie)
│   └── rapport/              # Rapport final (15–20 pages) & captures Burndown Charts
├── .github/
│   ├── workflows/ci.yml      # Pipeline CI GitHub Actions
│   └── PULL_REQUEST_TEMPLATE.md
├── docker-compose.yml        # Orchestration MongoDB + Backend + Frontend
├── .env.example              # Variables d'environnement modèles
└── README.md
```

---

## 4. Démarrage Rapide avec Docker

### Prérequis
- Docker & Docker Compose
- Node.js 20+ (pour développement local hors Docker)

### Lancement de la stack complète
```bash
# 1. Cloner le dépôt
git clone https://github.com/lhassanoubihi/meditrack.git
cd meditrack

# 2. Copier les variables d'environnement
cp .env.example .env

# 3. Construire et démarrer les services
docker-compose up --build
```

### Accès aux services
- **Frontend Angular :** `http://localhost:4200`
- **API Backend Express :** `http://localhost:5000/api/health`
- **MongoDB :** `mongodb://localhost:27017/meditrack`

---

## 5. Organisation Agile SCRUM & Git Workflow

### Planification des 3 Sprints (1 semaine chacun — 3 semaines au total)
| Sprint | Période | Contenu (Full-Stack Lhassan & Rida Dandane) |
| :--- | :--- | :--- |
| **Sprint 1** | Semaine 1 (22–29 nov.) | Architecture MEAN & Docker, Auth 2FA/RBAC, UML/BPMN, Module Dossier Patient (RGPD + UI Angular) |
| **Sprint 2** | Semaine 2 (29 nov.–06 déc.) | Rendez-vous (anti-conflit + Calendrier + Email/SMS), Consultations, Ordonnances PDF & Pharmacie |
| **Sprint 3** | Semaine 3 (06–13 déc.) | Statistiques & Tableaux de bord Chart.js, Tests Jest ≥ 60%, Cypress E2E, Docker final & Rapport 15–20p |

### Synchronisation Automatique GitHub → Jira (Burndown Chart)
Le script [`scripts/sync_github_jira.py`](scripts/sync_github_jira.py) est exécuté automatiquement en arrière-plan via le Planificateur de tâches Windows (`MediTrack-GitHub-Jira-Sync`) toutes les 30 minutes :
- Branche `feature/MT-XX-*` poussée → Ticket Jira passe à **En cours**
- Pull Request ouverte mentionnant `MT-XX` → Ticket marqué **`in-review`** (ou **In Review**)
- Pull Request mergée → Ticket passe à **Terminé(e)** (`Done`) pour un Burndown Chart cohérent jour après jour.

### Planning Quotidien Antigravity (22 nov. → 13 déc. 2026)
- **Calendrier global (21 jours) :** [`docs/planning/PLANNING_GLOBAL_21_JOURS.md`](docs/planning/PLANNING_GLOBAL_21_JOURS.md)
- **Planning & Prompt Agent (Lhassan Oubihi) :** [`docs/planning/PLANNING_LHASSAN.md`](docs/planning/PLANNING_LHASSAN.md)
- **Planning & Prompt Agent (Rida Dandane) :** [`docs/planning/PLANNING_RIDA.md`](docs/planning/PLANNING_RIDA.md)

### Convention des Branches & Smart Commits Jira
- `main` : Branche stable (prête pour démonstration machine)
- `develop` : Branche d'intégration des sprints
- `feature/MT-<id>-<description>` : Une branche par User Story Jira (ex: `feature/MT-3-auth-2fa`)
- `fix/MT-<id>-<description>` : Correctif lié à un ticket Jira

**Format des commits (lié à Jira) :**
```text
MT-12 feat(rdv): add conflict detection on appointment creation
MT-13 feat(ui): implement interactive angular calendar view
```

### Import du Backlog dans Jira
Le fichier [`docs/jira/meditrack_jira_backlog.csv`](docs/jira/meditrack_jira_backlog.csv) contient l'ensemble des **Epics** et **User Stories** prêts à être importés directement dans Jira Software.

---

## 6. Tests & Qualité
```bash
# Lancer les tests unitaires backend avec couverture (objectif >= 60%)
cd backend
npm install
npm test
```

---

*Projet réalisé dans le cadre du module Génie Logiciel — ENSAM Meknès (ILSI-4A) — 2026/2027.*

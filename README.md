# MediTrack — Plateforme de Gestion Médicale en Ligne

> **Projet 2 — Systèmes d'Information (Méthode Agile SCRUM sous Jira)**  
> **Établissement :** École Nationale Supérieure d'Arts et Métiers (ENSAM Meknès)  
> **Filière :** Ingénierie des Logiciels et des Systèmes d'Information — ILSI-4A  
> **Année Universitaire :** 2026 / 2027  
> **Encadrant :** Pr. S. Amri  
> **Équipe :** Lhassan Oubihi (Product Owner & Lead Backend/DevOps) · Reda (Scrum Master & Lead Frontend/QA)

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
| **Gestion de projet** | Jira Software (SCRUM, 5 Sprints de 2 semaines, Burndown Charts) |

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

### Planification des 5 Sprints (2 semaines chacun)
| Sprint | Contenu | Priorité |
| :--- | :--- | :--- |
| **Sprint 1** | Architecture MEAN Stack, authentification 2FA, gestion des rôles (RBAC), UML/BPMN | Haute |
| **Sprint 2** | Module dossier patient (CRUD, chiffrement RGPD), interface Angular | Haute |
| **Sprint 3** | Module rendez-vous, calendrier interactif, notifications Email/SMS | Haute |
| **Sprint 4** | Module consultation, ordonnances numériques PDF, module Pharmacie | Moyenne |
| **Sprint 5** | Statistiques & tableaux de bord, tests E2E Cypress, déploiement Docker, rapport | Basse |

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

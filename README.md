# MediTrack — Plateforme de Gestion Médicale en Ligne

> **Projet 2 — Systèmes d'Information (Méthode Agile SCRUM sous Jira)**  
> **Établissement :** École Nationale Supérieure d'Arts et Métiers (ENSAM Meknès)  
> **Filière :** Ingénierie des Logiciels et des Systèmes d'Information — ILSI-4A  
> **Année Universitaire :** 2026 / 2027  
> **Encadrant :** Pr. S. Amri  
> **Équipe :** Rida Dandane (`DevA` · Full-Stack) · Lhassan Oubihi (`DevB` · Full-Stack)

---

## 1. Contexte & Objectifs

Les établissements de santé font face à une gestion complexe des dossiers patients, des rendez-vous et des ordonnances. **MediTrack** est une plateforme web de gestion médicale permettant aux **médecins, infirmiers, pharmaciens, administrateurs et patients** d'interagir dans un environnement sécurisé et centralisé.

### Objectifs principaux
- Digitaliser la gestion des dossiers médicaux patients (antécédents, allergies, traitements, archivage, audit)
- Permettre la prise de rendez-vous en ligne avec FullCalendar, anti double réservation (`409`) et rappels Email (`node-cron`) / SMS (Twilio)
- Gérer les consultations, ordonnances numériques (PDF `pdfkit`) et la validation/stock pharmacie avec décrémentation transactionnelle
- Assurer la confidentialité et la conformité RGPD (JWT, bcrypt, authentification 2FA, chiffrement AES-256-GCM, journal d'audit)

---

## 2. Architecture Technique (MEAN Stack + Docker + CI/CD)

| Couche | Technologies |
| :--- | :--- |
| **Frontend** | Angular 17 (TypeScript, RxJS, Angular Material, FullCalendar, Chart.js) |
| **Backend** | Node.js + Express.js (REST API) |
| **Base de données** | MongoDB (Mongoose ODM) |
| **Sécurité** | JWT, bcrypt, Authentification 2FA (TOTP/Email), Chiffrement AES-256-GCM, AuditLog |
| **Notifications** | Nodemailer + `node-cron` (rappels J-1) + Twilio SMS (mode test) |
| **Génération PDF** | PDFKit (Ordonnances numériques) |
| **Tests & CI/CD** | Jest + Supertest (couverture ≥ 60%), Cypress (E2E), GitHub Actions (lint + tests) |
| **Conteneurisation** | Docker + Docker Compose |
| **Gestion de projet** | Jira Software — Board Scrum : https://lhassanoubihi.atlassian.net/jira/software/projects/MT/boards/67 (Clé `MT`, 5 Sprints, 34 Stories, 103 Sous-tâches) |

---

## 3. Démarrage Rapide avec Docker

```bash
git clone https://github.com/lhassanoubihi/meditrack.git
cd meditrack
cp .env.example .env
docker-compose up --build
```

- **Frontend Angular :** `http://localhost:4200`
- **API Backend Express :** `http://localhost:5000/api/health`
- **MongoDB :** `mongodb://localhost:27017/meditrack`

---

## 4. Organisation Agile SCRUM (5 Sprints · 22 nov. → 13 déc. 2026)

| Sprint | Période | Epics | Stories |
| :--- | :---: | :---: | :--- |
| **Sprint 1** | 22–25 nov. | `E1` | `US-01` → `US-07` : MEAN Docker, CI GitHub Actions, Auth JWT + 2FA, Rôles, Comptes personnel |
| **Sprint 2** | 26–29 nov. | `E2` | `US-08` → `US-14` : CRUD Dossier Patient, recherche/pagination, archivage, UI rôle, RGPD AES-256-GCM + Audit |
| **Sprint 3** | 30 nov.–03 déc. | `E3` | `US-15` → `US-21` : Disponibilités, RDV, Statuts, FullCalendar, Nodemailer/cron, Twilio, Anti-conflit 409 |
| **Sprint 4** | 04–07 déc. | `E4`, `E5` | `US-22` → `US-28` : Consultations, Ordonnances PDF, Historique, Pharmacie & Stock + alerte seuil |
| **Sprint 5** | 08–13 déc. | `E6`, `E7` | `US-29` → `US-34` : Dashboard médecin, Chart.js par spécialité, Cypress E2E, Jest ≥ 60%, Seed & Rapport 15–20p |

### Plannings Quotidiens Antigravity & Backlog Officiel
- **Backlog CSV officiel (144 lignes) :** [`docs/jira/meditrack_backlog_officiel.csv`](docs/jira/meditrack_backlog_officiel.csv)
- **Calendrier global (21 jours) :** [`docs/planning/PLANNING_GLOBAL_21_JOURS.md`](docs/planning/PLANNING_GLOBAL_21_JOURS.md)
- **Planning Agent — Lhassan Oubihi (`DevB`) :** [`docs/planning/PLANNING_LHASSAN.md`](docs/planning/PLANNING_LHASSAN.md)
- **Planning Agent — Rida Dandane (`DevA`) :** [`docs/planning/PLANNING_RIDA.md`](docs/planning/PLANNING_RIDA.md)
- **Guide SCRUM Jira :** [`docs/jira/GUIDE_SCRUM_JIRA.md`](docs/jira/GUIDE_SCRUM_JIRA.md)

### Convention Git & Smart Commits Jira
- `main` : Releases stables par sprint (`v0.1-sprint1` → `v1.0-final`)
- `develop` : Intégration des Pull Requests
- `feature/MT-<id>-us<num>-<description>` : Une branche par User Story Jira

---

*Projet réalisé dans le cadre du module Génie Logiciel — ENSAM Meknès (ILSI-4A) — 2026/2027.*

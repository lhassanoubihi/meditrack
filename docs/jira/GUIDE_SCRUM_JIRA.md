# Guide Complet SCRUM sous Jira — Projet 2 : MediTrack

> **Filière :** ILSI-4A — ENSAM Meknès (2026 / 2027)  
> **Encadrant :** Pr. S. Amri  
> **Équipe :** **Lhassan Oubihi** & **Rida Dandane** *(tous deux Full-Stack : Backend + Frontend)*  
> **Board Jira Scrum Live (Clé `MT`) :** https://lhassanoubihi.atlassian.net/jira/software/projects/MT/boards/67  
> **Dépôt GitHub :** https://github.com/lhassanoubihi/meditrack  
> **Durée totale :** **3 Semaines (3 Sprints × 7 jours)** — du **22 nov. au 13 déc. 2026**

---

## 1. Répartition Full-Stack 50/50 (Lhassan Oubihi & Rida Dandane)

Les deux membres codent **à la fois en Backend (Node.js/Express/MongoDB) et en Frontend (Angular 17/Material)** sur chaque sprint (12 User Stories chacun) :

| Membre | Rôle SCRUM | Répartition Technique Full-Stack (50 / 50) |
| :--- | :--- | :--- |
| **Lhassan Oubihi** | **Product Owner (PO)** + Dev Full-Stack | **12 User Stories (Back + Front)** : Architecture Docker, Auth 2FA, CRUD Patients + UI Liste/Fiche Patient, API RDV + Calendrier Angular, Ordonnances PDF + UI Consultation, API Stats + Dashboard Chart.js, Rapport & Démo |
| **Rida Dandane** | **Scrum Master (SM)** + Dev Full-Stack | **12 User Stories (Back + Front)** : Init Angular 17, Users & RBAC Backend, UML/BPMN, Chiffrement RGPD AES-256 + UI Formulaires Patient, Notifications Email/SMS + Statuts RDV UI, API Consultations, Pharmacie Back + Front, Tests Jest ≥ 60% & Cypress E2E |

> [!TIP]
> **Automatisation active sans ouvrir Antigravity IDE :** La tâche planifiée Windows **`MediTrack-GitHub-Jira-Sync`** exécute [`scripts/sync_github_jira.py`](../../scripts/sync_github_jira.py) toutes les 30 minutes. Dès que vous poussez une branche `feature/MT-XX-*`, ouvrez une PR ou mergez une PR sur GitHub, les statuts Jira avancent automatiquement (`À faire` → `En cours` → `In Review` → `Terminé(e)`) pour garder un **Burndown Chart** lisse et cohérent.

---

## 2. Ordre Jira & Automatisation (Étape par Étape)

```mermaid
flowchart TD
    E0["Projet Scrum MT (Board 67) & 3 Sprints (1 sem. chacun)"] --> E1["Sprint 1 démarré (22 nov -> 29 nov)"]
    E1 --> E2["Branche GitHub : git checkout -b feature/MT-XX-desc"]
    E2 --> E3["Sync Auto (ou PR) : MT-XX passe en 'En cours'"]
    E3 --> E4["Pull Request ouverte vers develop -> label 'in-review' / In Review"]
    E4 --> E5["Revue croisée (Lhassan <-> Rida) & Merge PR -> MT-XX passe en 'Terminé(e)'"]
    E5 --> E6["Fin de semaine : Sprint Review + Capture Burndown Chart + Clôture Sprint"]
    E6 --> E7{"Sprint 3 terminé ?"}
    E7 -- "Non" --> E2
    E7 -- "Oui" --> E8["Rapport 15-20p + Checklist Démo Docker 7/7 + Soutenance Pr. S. Amri"]
```

### Règles de nommage GitHub pour déclencher la synchro automatique
1. **Créer la branche** depuis `develop` avec le numéro exact du ticket Jira `MT-XX` :
   ```bash
   git checkout develop && git pull origin develop
   git checkout -b feature/MT-10-auth-2fa
   git push -u origin feature/MT-10-auth-2fa
   ```
   → Au prochain passage automatique (ou en lançant `python scripts/sync_github_jira.py`), `MT-10` passe à **`En cours`**.
2. **Ouvrir une Pull Request** sur GitHub vers `develop` avec `MT-10` dans le titre (`MT-10 feat(auth): add 2FA OTP`) :
   → `MT-10` reçoit le statut **`In Review`** (ou le label `in-review` en attente d'ajout de la colonne *In Review* dans Jira Board Settings).
3. **Merger la Pull Request** après revue croisée (Lhassan ↔ Rida Dandane) :
   → `MT-10` passe automatiquement à **`Terminé(e)`** (`Done`) et alimente le **Burndown Chart**.

> [!NOTE]
> **Colonne `In Review` dans Jira :** Par défaut, le template Scrum classique de `MT` a 3 colonnes (`À faire`, `En cours`, `Terminé(e)`). Dans Jira (*Paramètres du tableau → Colonnes*), cliquez sur **Ajouter une colonne** nommée **`In Review`** si vous voulez l'afficher visuellement entre *En cours* et *Terminé(e)*. Le script la détecte et l'utilise automatiquement dès qu'elle existe.

---

## 3. Planification Complète sur 3 Semaines (3 Sprints · 24 Stories · 122 pts)

### Sprint 1 — Semaine 1 (22 nov. → 29 nov. 2026) — Architecture, 2FA, RBAC & Dossier Patient
> **Statut :** **ACTIF** | **10 User Stories (5 Lhassan Back+Front · 5 Rida Dandane Back+Front)** — 51 pts

| Jira | GitHub | User Story | Couche | Pts | Assigné |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **MT-8** | `#1` | US-01 : Architecture MEAN Stack, Docker Compose & MongoDB | Backend / DevOps | 5 | **Lhassan Oubihi** |
| **MT-9** | `#2` | US-02 : Initialisation Frontend Angular 17, Material & Layout | Frontend | 5 | **Rida Dandane** |
| **MT-10** | `#3` | US-03 : Authentification JWT, bcrypt & Double Auth 2FA | Backend | 5 | **Lhassan Oubihi** |
| **MT-11** | `#4` | US-04 : Gestion Utilisateurs & RBAC Multi-Rôles | Backend | 5 | **Rida Dandane** |
| **MT-12** | `#5` | US-05 : Interfaces Angular Login, Inscription, 2FA & Profil | Frontend | 5 | **Lhassan Oubihi** |
| **MT-13** | `#6` | US-06 : Modélisation UML (Use Case, Classes) & BPMN Initiale | Conception | 3 | **Rida Dandane** |
| **MT-14** | `#7` | US-07 : Modèle Mongoose Patient & Chiffrement RGPD AES-256 | Backend | 5 | **Rida Dandane** |
| **MT-15** | `#8` | US-08 : API REST CRUD Dossier Patient + Recherche & Tests Jest | Backend | 5 | **Lhassan Oubihi** |
| **MT-16** | `#9` | US-09 : Interface Angular Liste, Recherche & Fiche Patient | Frontend | 8 | **Lhassan Oubihi** |
| **MT-17** | `#10` | US-10 : Formulaires Angular Création & Édition Dossier Patient | Frontend | 5 | **Rida Dandane** |

---

### Sprint 2 — Semaine 2 (29 nov. → 06 déc. 2026) — Rendez-vous, Consultations, PDF & Pharmacie
> **Statut :** Planifié | **9 User Stories (4 Lhassan Back+Front · 5 Rida Dandane Back+Front)** — 48 pts

| Jira | GitHub | User Story | Couche | Pts | Assigné |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **MT-18** | `#11` | US-11 : API REST Rendez-vous & Détection Conflits Horaires | Backend | 5 | **Lhassan Oubihi** |
| **MT-19** | `#12` | US-12 : Service Notifications Email (Nodemailer) & SMS (Twilio) | Backend | 5 | **Rida Dandane** |
| **MT-20** | `#13` | US-13 : Calendrier Interactif Angular & Prise de RDV en Ligne | Frontend | 8 | **Lhassan Oubihi** |
| **MT-21** | `#14` | US-14 : Gestion Statuts RDV (Confirmation, Report, Annulation) | Frontend | 5 | **Rida Dandane** |
| **MT-22** | `#15` | US-15 : API REST Consultations (Compte-rendu & Diagnostic) | Backend | 5 | **Rida Dandane** |
| **MT-23** | `#16` | US-16 : Génération Ordonnance Numérique PDF & QR Code | Backend | 5 | **Lhassan Oubihi** |
| **MT-24** | `#17` | US-17 : API REST Pharmacie (Validation Ordonnance & Stocks) | Backend | 5 | **Rida Dandane** |
| **MT-25** | `#18` | US-18 : Interface Médecin Consultation & Ordonnance PDF | Frontend | 5 | **Lhassan Oubihi** |
| **MT-26** | `#19` | US-19 : Interface Pharmacien Validation Ordonnances & Stocks | Frontend | 5 | **Rida Dandane** |

---

### Sprint 3 — Semaine 3 (06 déc. → 13 déc. 2026) — Statistiques, Tests ≥ 60%, Cypress & Rapport
> **Statut :** Planifié | **5 User Stories (3 Lhassan · 2 Rida Dandane)** — 23 pts

| Jira | GitHub | User Story | Couche | Pts | Assigné |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **MT-27** | `#20` | US-20 : API Statistiques & Agrégations MongoDB par Spécialité | Backend | 5 | **Lhassan Oubihi** |
| **MT-28** | `#21` | US-21 : Tableaux de Bord Analytiques Angular par Spécialité | Frontend | 5 | **Lhassan Oubihi** |
| **MT-29** | `#22` | US-22 : Couverture Tests Unitaires >= 60%, HTTPS & Docker Final | Backend / DevOps | 5 | **Rida Dandane** |
| **MT-30** | `#23` | US-23 : Tests E2E Cypress (Scénario Complet de Démonstration) | Frontend / QA | 5 | **Rida Dandane** |
| **MT-31** | `#24` | US-24 : Rapport Final 15–20 Pages, Burndown Charts Jira & Démo | Documentation | 3 | **Lhassan & Rida** |

---

## 4. Checklist Finale Obligatoire (Soutenance & Rapport — Pr. S. Amri)

- **Qualité du rapport (15–20 pages, UML/BPMN)** : **25 %**
- **Qualité du code (architecture, bonnes pratiques, tests ≥ 60 %)** : **25 %**
- **Gestion SCRUM sur Jira (Backlog, Sprints, Burndown, Vélocité)** : **20 %**
- **Démonstration machine (complétude, stabilité Docker)** : **20 %**
- **Présentation orale & réponses aux questions** : **10 %**

1. [ ] `docker-compose up --build` démarre sans erreur.
2. [ ] Interface Angular accessible sur `http://localhost:4200`.
3. [ ] Connexion multi-rôles + 2FA fonctionnelle.
4. [ ] Scénario complet : Patient → RDV → Consultation + PDF → Pharmacie → Dashboard Stats.
5. [ ] Persistance MongoDB vérifiée.
6. [ ] Board Jira présenté avec les **Burndown Charts** des 3 Sprints.
7. [ ] Couverture tests Jest `>= 60%` + Cypress E2E verts.

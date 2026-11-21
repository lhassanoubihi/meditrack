# MediTrack Frontend — Angular 17

Ce dossier accueillera l'application **Angular 17 + TypeScript + RxJS + Angular Material** lors de la User Story **US-02 (Sprint 1)**.

## Initialisation (Sprint 1 — Rida Dandane)
```bash
npx -p @angular/cli@17 ng new meditrack-ui --directory . --routing --style=scss --standalone
ng add @angular/material
```

Une fois l'application Angular générée, mettez à jour le `Dockerfile` en build multi-étapes (Node 20 build -> Nginx).

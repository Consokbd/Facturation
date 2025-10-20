# Invoice App (React + Vite)

Ceci est une version minimale front-end d'une application de facturation avec:
- Une page **Terminal** pour saisir des factures et imprimer (PDF).
- Une page **Dashboard** affichant les factures stockées localement (localStorage).

## Installation

1. Extraire le zip.
2. Dans le dossier `invoice-app-react` exécuter:
   ```
   npm install
   npm run dev
   ```
3. Ouvrir l'URL affichée par Vite (par défaut http://localhost:5173).

## Notes
- Les factures sont enregistrées dans `localStorage` (simulation backend).
- Pour intégrer un backend, remplacez `services_storage.js` par des appels axios vers votre API.
- Dépendances utiles à ajouter sur le backend: Node.js, Express, MongoDB, JWT.

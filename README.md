# StudyPortal — BOAZ-STUDY

Portail multi-espace de gestion étudiante · Test Technique Frontend ReactJS / TypeScript

---

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Copier les variables d'environnement
cp .env.example .env.local

# 3. Lancer le serveur de développement
npm run dev
```

L'application est disponible sur **http://localhost:5173**

> **Note** : Par défaut, `VITE_USE_MOCK_AUTH=true` dans `.env.local`.
> Aucun serveur Keycloak n'est nécessaire pour tester l'application.

---

## Profils mock disponibles

| Profil | Email | Mot de passe | Rôle |
|--------|-------|--------------|------|
| **Admin** | `admin@boaz-study.com` | n'importe quelle valeur | Toutes les permissions |
| **Utilisateur basique** | `john.doe@boaz-study.com` | n'importe quelle valeur | Permissions limitées |

Des boutons de connexion rapide sont affichés directement sur la page de login en mode mock.

---

## Permissions testables

| Permission (scope) | Admin | Utilisateur basique | Élément UI concerné |
|-------------------|-------|---------------------|---------------------|
| `ticket:create` | ✅ | ❌ | Bouton "Créer un ticket" |
| `ticket:read` | ✅ | ✅ | Liste des tickets |
| `ticket:update` | ✅ | ❌ | Bouton "Modifier le statut" |
| `ticket:comment` | ✅ | ✅ | Zone de commentaire |
| `document:upload` | ✅ | ❌ | Bouton "Joindre un fichier" |
| `document:read` | ✅ | ✅ | Liste des documents |
| `document:download` | ✅ | ❌ | Bouton de téléchargement |
| `notification:read` | ✅ | ✅ | Centre de notifications |
| `admin:access` | ✅ | ❌ | Section Administration |
| `user:manage` | ✅ | ❌ | Gestion des utilisateurs |

---

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement Vite |
| `npm run build` | Build de production (TypeScript + Vite) |
| `npm run lint` | ESLint — vérification du code |
| `npm run lint:fix` | ESLint — correction automatique |
| `npm test` | Tests unitaires (Vitest, mode watch) |
| `npm run test:ui` | Interface Vitest UI |
| `npm run test:coverage` | Rapport de couverture de code |

---

## Architecture

```
src/
├── contracts/              # Interfaces TypeScript — source de vérité unique
│   └── api-contracts.ts    # AuthUser, Ticket, Document, ApiResponse<T>…
├── services/
│   ├── mock/               # Données mock par entité
│   │   ├── admin-user.mock.ts    # Profil ADMIN (toutes permissions)
│   │   ├── basic-user.mock.ts   # Profil USER (permissions limitées)
│   │   ├── auth.mock.ts         # mockAuthenticate()
│   │   ├── tickets.mock.ts
│   │   ├── documents.mock.ts
│   │   └── notifications.mock.ts
│   ├── api.service.ts      # Axios + intercepteurs (JWT injection + fallback mock)
│   └── keycloak.service.ts # Configuration keycloak-js
├── hooks/
│   ├── usePermissions.ts   # ⚠ CRITIQUE — basé sur authorities[], jamais sur roles
│   └── useAuth.ts          # Login, logout, initAuth
├── components/
│   ├── ProtectedComponent.tsx  # Rendu conditionnel par permission
│   └── shared/
│       └── PageLoader.tsx
├── portals/
│   ├── auth-portal/        # Login / Register
│   │   ├── pages/LoginPage.tsx
│   │   └── routes.tsx
│   └── main-portal/        # Dashboard + features
│       ├── pages/DashboardPage.tsx
│       └── features/
│           ├── tickets/
│           ├── documents/
│           └── notifications/
├── store/
│   └── auth.store.ts       # Zustand — user + authorities disponibles globalement
├── router/
│   └── index.tsx           # Routes protégées + lazy loading
├── App.tsx
└── main.tsx
```

---

## Choix techniques

| Technologie | Usage |
|-------------|-------|
| **React 19 + TypeScript strict** | `strict: true`, zéro `any` |
| **keycloak-js** | Intégration SSO + gestion JWT |
| **React Router v7** | Navigation multi-portail, lazy loading, routes protégées |
| **Axios + intercepteurs** | Injection JWT automatique, fallback mock |
| **Zustand** | State management global (auth + authorities) |
| **TailwindCSS** | Responsive mobile-first, design system |
| **Vitest + Testing Library** | Tests unitaires `usePermissions` + `ProtectedComponent` |
| **ESLint + typescript-eslint** | `no-explicit-any: error`, règles strictes |

---

## Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `VITE_USE_MOCK_AUTH` | `true` pour bypasser Keycloak | `true` |
| `VITE_KEYCLOAK_URL` | URL du serveur Keycloak | `http://localhost:8080` |
| `VITE_KEYCLOAK_REALM` | Nom du realm Keycloak | `boaz-study` |
| `VITE_KEYCLOAK_CLIENT_ID` | Client ID Keycloak | `studyportal-app` |
| `VITE_API_BASE_URL` | URL de l'API backend | `http://localhost:8081/api` |

---

## Principe de protection des composants

> ⚠ **CRITIQUE** : La protection est basée **exclusivement** sur `authorities[]` du JWT.
> Jamais sur `realm_access.roles`.

```tsx
// ✅ Correct — basé sur authorities[]
<ProtectedComponent requires="ticket:create">
  <button>Créer un ticket</button>
</ProtectedComponent>

// ✅ Mode OR — au moins une permission
<ProtectedComponent requires={['document:read', 'document:download']} mode="any">
  <DocumentList />
</ProtectedComponent>

// Dans un hook
const { hasPermission } = usePermissions()
if (hasPermission('admin:access')) { /* ... */ }
```

---

Contact : recrutement@boaz-study.com
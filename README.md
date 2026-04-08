# StudyPortal — BOAZ-STUDY

> Portail multi-espace de gestion étudiante
>
> **Frontend:** React 19 + TypeScript + Vite
>
> **Authentication:** Keycloak (OpenID Connect) + JWT
>
> **Permission System:** Role-based access control (RBAC) via `authorities[]`

---

## 🚀 Quick Start (5 minutes)

### Mock Mode (No Keycloak server required)

```bash
# 1. Install dependencies
npm install

# 2. Use default config (mock auth)
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

Open **http://localhost:5173** in your browser. Quick login buttons appear on the login page.

### Production Mode (Real Keycloak)

1. **Start Keycloak server**
   ```bash
   docker run -p 8080:8080 \
     -e KEYCLOAK_ADMIN=admin \
     -e KEYCLOAK_ADMIN_PASSWORD=admin \
     quay.io/keycloak/keycloak:26.0.0 \
     start-dev
   ```

2. **Update `.env.local`**
   ```env
   VITE_KEYCLOAK_URL=http://localhost:8080
   VITE_KEYCLOAK_REALM=boaz-study
   VITE_KEYCLOAK_CLIENT_ID=studyportal-app
   VITE_USE_MOCK_AUTH=false
   ```

3. **Follow detailed guide**
   
   See [KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md) for complete Keycloak admin setup.

---

## 🔐 Test Accounts

### Mock Mode

| Profile | Email | Password | Permissions |
|---------|-------|----------|-------------|
| **Admin** | `admin@boaz-study.com` | any | **All** ✅ |
| **Basic User** | `john.doe@boaz-study.com` | any | **Read-only** |

### Keycloak Mode

Users managed in Keycloak admin console. Each user needs:
- A password (Credentials tab)
- Role assignments (Role mapping tab)

---

## 📋 Available Permissions

| Permission | Admin | User | UI Element |
|-----------|-------|------|-----------|
| `ticket:create` | ✅ | ❌ | Create ticket button |
| `ticket:read` | ✅ | ✅ | View tickets |
| `ticket:update` | ✅ | ❌ | Edit ticket |
| `ticket:comment` | ✅ | ✅ | Comment on ticket |
| `document:upload` | ✅ | ❌ | Upload file |
| `document:read` | ✅ | ✅ | View documents |
| `document:download` | ✅ | ❌ | Download file |
| `notification:read` | ✅ | ✅ | View notifications |
| `admin:access` | ✅ | ❌ | Admin panel |

---

## 🛠️ Available Commands

```bash
npm run dev           # Dev server with hot reload
npm run build         # Production build
npm run preview       # Preview production build
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix linting issues
npm run test          # Run tests (watch mode)
npm run test:ui       # View tests in UI
npm run test:coverage # Coverage report
```

---

## 🏗️ Project Structure

```
src/
├── contracts/
│   └── api-contracts.ts           # ⚠️ Single source of truth — types & interfaces
├── services/
│   ├── keycloak.service.ts        # Keycloak init + JWT management
│   ├── api.service.ts             # Axios + interceptors (JWT + mock fallback)
│   └── mock/                      # Mock data per entity
│       ├── auth.mock.ts           # Mock authentication
│       ├── admin-user.mock.ts     # Admin profile
│       ├── basic-user.mock.ts     # Basic user profile
│       ├── tickets.mock.ts
│       ├── documents.mock.ts
│       └── notifications.mock.ts
├── hooks/
│   ├── useAuth.ts                 # Login, logout, init
│   └── usePermissions.ts           # ⚠️ Check permissions from authorities[]
├── components/
│   ├── ProtectedComponent.tsx      # Permission-gated wrapper
│   └── shared/PageLoader.tsx
├── store/
│   └── auth.store.ts              # Zustand — global auth state
├── router/
│   └── index.tsx                  # Protected routes + guards
├── portals/
│   ├── auth-portal/               # Login page
│   │   └── pages/LoginPage.tsx
│   └── main-portal/               # App features
│       └── pages/DashboardPage.tsx
├── App.tsx                        # Auth initialization
└── main.tsx
```

---

## 🔑 Key Concepts

### ⚠️ Permissions Based on `authorities[]`

**CRITICAL**: Protection is based **exclusively** on the `authorities[]` array in the JWT, **never** on Keycloak roles.

```tsx
// ✅ Correct
<ProtectedComponent requires="ticket:create">
  <CreateButton />
</ProtectedComponent>

// ✅ Within a hook
const { hasPermission } = usePermissions()
if (hasPermission('admin:access')) {
  return <AdminPanel />
}

// ❌ WRONG — realm_access.roles has no effect
// Only authorities[] controls access
```

### Authentication Flow

1. **User clicks "Login"**
2. **Mock mode** → Show quick login buttons
3. **Keycloak mode** → Redirect to Keycloak login page
4. **Keycloak authenticates** and redirects back with callback
5. **App parses callback** URL fragment for token
6. **Zustand stores** decoded JWT + `authorities[]`
7. **Router redirects** to `/dashboard`
8. **Protected components** read permissions from Zustand

### Token Management

- **Auto-injection** : Every API request includes `Authorization: Bearer <token>`
- **Auto-refresh** : Tokens refreshed 30s before expiry
- **Mock fallback** : If API is down, mock responses are used instead

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md) | Detailed Keycloak server setup |

---

## 🧪 Testing

Tests provided for critical components:

```bash
npm run test          # Run tests (watch mode)
npm run test:ui       # Visual test runner
npm run test:coverage # Coverage report
```

**Included tests:**
- `usePermissions.test.ts` — Permission checking
- `ProtectedComponent.test.tsx` — Conditional rendering

---

## 🐛 Troubleshooting

### App stuck on loader

**Cause**: Keycloak init timing out or config incorrect.

**Solution**:
1. Verify `.env.local` exists
2. If `VITE_USE_MOCK_AUTH=false`, check Keycloak is running
3. Open DevTools (F12) → Console for `[useAuth]` messages

### "Maximum update depth exceeded" error

**Cause**: Zustand selector returning new reference each time.

**Solution**: This is fixed by using a stable empty array in selectors. Restart dev server.

### User has no authorities after login

**Cause**: User account has no roles assigned in Keycloak.

**Solution**:
1. In Keycloak admin → Users → Your user
2. Go to **Role mapping** tab
3. Click **Assign role** and select at least one role
4. Refresh browser

### "Token not injected into API requests"

**Cause**: JWT not in Zustand store or not being passed to axios.

**Solution**:
1. Verify login succeeded (should redirect to `/dashboard`)
2. Check console log: `[useAuth] Token decoded successfully`
3. In DevTools Network tab, verify `Authorization: Bearer` header on API requests

---

## 💡 Design Principles

### Separation of Concerns

- **Contracts** : Types & interfaces (single source of truth)
- **Services** : Business logic (auth, API, data)
- **Hooks** : Reusable custom logic
- **Components** : Presentation only
- **Store** : Global state (Zustand)

### Strict TypeScript

```tsx
// ✅ Always type props
interface Props {
  label: string
  onClick: () => void
}

// ❌ Never use any
const MyComponent = (props: any) => {}
```

### No Prop Drilling

```tsx
// ✅ Read directly from global store
const { user } = useAuthStore()

// ❌ Don't pass through many components
<Parent user={user}>
  <Child user={user}>
    <GrandChild user={user} />
  </Child>
</Parent>
```

---

## 📦 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.0.0 | UI framework |
| TypeScript | 5.7.2 | Type safety |
| Keycloak-js | 26.0.7 | SSO + JWT |
| React Router | 7.1.1 | Routing + guards |
| Axios | 1.7.9 | HTTP client |
| Zustand | 5.0.3 | State management |
| TailwindCSS | 3.4.17 | Styling |
| Vite | 6.0.5 | Fast bundler |
| Vitest | 2.1.8 | Unit testing |
| Testing Library | 16.1.0 | Component testing |
| ESLint | 9.17.0 | Code linting |

---

## 📋 Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_USE_MOCK_AUTH` | Use mock auth (no server) | `true` |
| `VITE_KEYCLOAK_URL` | Keycloak server URL | `http://localhost:8080` |
| `VITE_KEYCLOAK_REALM` | Keycloak realm name | `boaz-study` |
| `VITE_KEYCLOAK_CLIENT_ID` | Keycloak client ID | `studyportal-app` |
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8081/api` |

---

## 🎯 What's Implemented

✅ Keycloak OpenID Connect integration  
✅ JWT token management + auto-refresh  
✅ Permission-based component gating  
✅ Mock auth for offline development  
✅ Global auth state (Zustand)  
✅ Route protection (RequireAuth guard)  
✅ Auto API token injection (Axios)  
✅ Mock API fallback  
✅ Responsive login UI  
✅ Unit tests  
✅ Strict TypeScript  
✅ ESLint configuration  

---

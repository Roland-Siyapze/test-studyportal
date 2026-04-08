# Keycloak Integration Guide

This document explains how to set up Keycloak authentication for the Study Portal application.

## Overview

The application uses **Keycloak** (v26.0.7+) for OpenID Connect / OAuth 2.0 authentication. The integration is handled by:

- **`keycloak.service.ts`** — Keycloak initialization and JWT token management
- **`useAuth.ts`** — React hook for auth state and login/logout actions
- **`auth.store.ts`** — Zustand store for centralized auth state
- **`api.service.ts`** — Axios interceptor that injects the JWT token into all API requests

## Setup Steps

### 1. Configure Environment Variables

Create a `.env.local` file in the project root with your Keycloak credentials:

```env
# Keycloak server URL
VITE_KEYCLOAK_URL=http://localhost:8080

# Keycloak realm (created in Keycloak admin console)
VITE_KEYCLOAK_REALM=boaz-study

# Keycloak client ID (created in Keycloak realm)
VITE_KEYCLOAK_CLIENT_ID=studyportal-app

# Backend API URL
VITE_API_BASE_URL=http://localhost:8081/api

# Use mock auth (true for dev without Keycloak, false for production)
VITE_USE_MOCK_AUTH=false
```

### 2. Keycloak Admin Setup

#### a. Create a Realm

1. Log in to your Keycloak admin console (`http://localhost:8080/admin`)
2. Click **Create Realm** and name it `boaz-study`

#### b. Create a Client

1. In the realm, go to **Clients** > **Create client**
2. Set **Client ID** to `studyportal-app`
3. In **Capability config**, ensure:
   - ✓ Client authentication is **OFF** (toggle OFF — this is a public SPA client)
   - ✓ PKCE Code Challenge is **ON** (toggle ON — required for public clients)
4. In the **Access** tab, set exactly these URIs:
   - **Valid redirect URIs**:
     ```
     http://localhost:5173/
     http://localhost:5173/silent-check-sso.html
     ```
   - **Valid post logout redirect URIs**:
     ```
     http://localhost:5173/
     http://localhost:5173/login
     ```
   - **Web origins**:
     ```
     http://localhost:5173
     ```
5. In **Logout settings**, ensure:
   - **Front channel logout**: ON

#### c. Configure Client Roles & Permissions

1. Go to **Clients** > **studyportal-app** > **Roles**
2. Create the following roles:
   - `ticket:create`
   - `ticket:read`
   - `ticket:update`
   - `ticket:comment`
   - `document:upload`
   - `document:read`
   - `document:download`
   - `notification:read`
   - `admin:access`

#### d. Create Test Users

1. Go to **Users** > **Create user**
2. Set username (e.g., `basic-user`) and email
3. In the **Credentials** tab, set a temporary password
4. In the **Role mapping** tab, assign client roles

### 3. Verify Silent Check SSO

The app uses `silent-check-sso.html` (in `/public`) for the Keycloak `check-sso` flow. This file is **required** for silent authentication to work without page redirects.

If you see errors in the browser console about `silent-check-sso.html`, ensure:
- The file exists in `public/silent-check-sso.html`
- Your Keycloak server has CORS enabled for your app's origin

### 4. Start the App

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`:
- If you have an active Keycloak session, you'll be redirected to the dashboard
- Otherwise, you'll see the login page

## Development Mode (Mock Auth)

To develop without a Keycloak server, set in `.env.local`:

```env
VITE_USE_MOCK_AUTH=true
```

This will:
- Skip Keycloak initialization
- Display a login form with quick-test buttons (evaluator profiles)
- Use mock user data for API responses

Evaluator test profiles are defined in `src/services/mock/auth.mock.ts`.

## Token Refresh

Tokens are automatically refreshed 30 seconds before expiry via the `refreshTokenIfNeeded()` function in `api.service.ts`.

The Axios request interceptor calls this function on every API request, so you don't need to manage token expiry manually.

## Logout

Call `useAuth().logout()` to:
1. Clear the user from the Zustand store
2. Revoke the Keycloak session (production only)
3. Redirect to `/login`

## Troubleshooting

### Issue: "Silent-check-sso.html not found"

**Solution:** Ensure the file exists in `public/silent-check-sso.html`. Vite will serve it automatically.

### Issue: "Failed to construct 'URL': Invalid URL" during login

**Root cause:** The Keycloak callback parsing is failing. This usually happens when redirect URIs don't match between Keycloak config and the app.

**Solution:**
1. In Keycloak console, go to **Clients** > **studyportal-app** > **Access tab**
2. Verify **Valid redirect URIs** includes:
   - `http://localhost:5173/` (with trailing slash)
   - `http://localhost:5173/silent-check-sso.html`
3. **Remove** any URIs with wildcards or specific paths like `/dashboard`
4. Save changes
5. In your browser DevTools > Network tab, check:
   - After clicking login, you get redirected to `http://localhost:8080/...` (Keycloak)
   - Keycloak redirects back to `http://localhost:5173/` with a URL fragment like `#code=xxxx&state=yyyy`
6. Clear browser cookies and try again: `Ctrl+Shift+Delete` → Clear all cookies → Retry login

**If still failing:**
1. Open browser DevTools > Console
2. Look for any errors starting with `keycloak.js:`
3. Ensure the app is running on `http://localhost:5173` (not `http://127.0.0.1:5173` or with a port suffix)

### Issue: "Token not injected into API requests"

**Solution:** Check that:
1. `api.service.ts` request interceptor is running
2. The JWT is present in the Zustand store: `useAuthStore().user`
3. Check the browser DevTools > Network tab for the `Authorization: Bearer` header

### Issue: "Redirect loop on login"

**Solution:** Verify:
1. **Valid redirect URIs** in Keycloak client settings include `/dashboard`
2. The `redirectUri` in `useAuth.ts` login function matches a configured redirect URI
3. Your backend is not requesting authentication again

## Documentation References

- [Keycloak Official Docs](https://www.keycloak.org/documentation)
- [keycloak-js Library](https://www.npmjs.com/package/keycloak-js)
- [OAuth 2.0 Authorization Code Flow with PKCE](https://tools.ietf.org/html/rfc7636)

## Permissions (Authorities)

All permissions are defined as TypeScript types in `src/contracts/api-contracts.ts`:

```typescript
export type Permission =
  | 'ticket:create'
  | 'ticket:read'
  | 'ticket:update'
  | 'ticket:comment'
  | 'document:upload'
  | 'document:read'
  | 'document:download'
  | 'notification:read'
  | 'admin:access'
```

Components can check permissions using the `usePermissions()` hook:

```typescript
const { hasPermission } = usePermissions()

if (hasPermission('admin:access')) {
  // Render admin panel
}
```

## Files Involved

- `src/services/keycloak.service.ts` — Keycloak configuration and token management
- `src/hooks/useAuth.ts` — Auth initialization and login/logout actions
- `src/store/auth.store.ts` — Centralized auth state (Zustand)
- `src/services/api.service.ts` — Axios instance with auth interceptors
- `src/contracts/api-contracts.ts` — TypeScript types for auth payload
- `public/silent-check-sso.html` — Keycloak silent SSO check document
- `.env.local` — Environment configuration (Keycloak URL, realm, etc.)

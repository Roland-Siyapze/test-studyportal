# BOAZ-STUDY Keycloak Theme

Custom branded theme for Keycloak login, registration, and account management pages aligned with the BOAZ-STUDY visual identity.

## Features

- **Custom branding** with BOAZ-STUDY logo, colors, and typography
- **Responsive design** optimized for mobile, tablet, and desktop
- **Accessibility** with proper ARIA labels and semantic HTML
- **Dark mode** by default with sophisticated color palette
- **Internationalization** with support for English and French
- **Production-ready** FTL templates for Keycloak compatibility

## Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Navy (Background) | Navy | #0A1628 |
| Primary Blue | Blue Mid | #2563EB |
| Accent Blue | Blue Light | #3B82F6 |
| Accent Gold | Gold | #F59E0B |
| Surface | Surface Primary | #0F2040 |
| Surface Alt | Surface Secondary | #162A50 |
| Text Primary | Text | #E2E8F0 |
| Text Secondary | Muted | #94A3B8 |
| Border | Border Default | #1E3A5F |

## Typography

- **Display**: Playfair Display (headings)
- **Body**: DM Sans (body text)
- **Mono**: JetBrains Mono (code)

## Installation

### 1. Deploy Theme to Keycloak

Copy the `theme/` directory to your Keycloak server:

```bash
# Production Keycloak installation
cp -r theme/boaz-study /opt/keycloak/themes/

# Docker
docker cp theme/boaz-study <keycloak-container>:/opt/keycloak/themes/
```

### 2. Configure Theme in Keycloak Admin Console

1. Go to **Realm Settings** → **Themes**
2. Set **Login Theme** to `boaz-study`
3. (Optional) Set **Account Theme** to `boaz-study`
4. (Optional) Set **Email Theme** to `boaz-study`
5. Click **Save**

### 3. Test

Navigate to your Keycloak login URL (e.g., `http://localhost:8080/auth/realms/boaz-study/account`).
You should see the BOAZ-STUDY branded login page.

## Directory Structure

```
theme/boaz-study/
├── theme.properties            # Theme configuration
├── login/
│   ├── template.ftl           # Base template (Freemarker)
│   ├── login.ftl              # Login page template
│   ├── register.ftl           # Registration page (optional)
│   ├── messages/
│   │   ├── messages_en.properties
│   │   └── messages_fr.properties
│   └── resources/
│       ├── css/
│       │   └── style.css      # Custom styles
│       └── img/
│           ├── favicon.ico
│           ├── boaz-logo.svg
│           └── background-pattern.svg
├── email/
│   ├── email-verification.ftl # Email verification template
│   └── messages/
│       └── messages_en.properties
└── account/ (optional)
    ├── template.ftl
    └── resources/css/style.css
```

## Customization

### Logo

Replace `theme/boaz-study/login/resources/img/boaz-logo.svg` with your logo.

### Colors

Edit `login/resources/css/style.css` and update the color variables:

```css
.boaz-logo-mark {
  background: linear-gradient(135deg, #2563EB, #3B82F6);
  /* ↑ Change these colors */
}
```

### Fonts

To use different fonts:

1. Edit `theme.properties`:
   ```properties
   font-display=Your Display Font, serif
   font-body=Your Body Font, sans-serif
   ```

2. Update `login/resources/css/style.css`:
   ```css
   @import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;600&display=swap');
   ```

### Messages

Edit `login/messages/messages_en.properties` and `messages_fr.properties` to customize text.

## Keycloak Configuration Requirements

For the theme to work fully, ensure your Keycloak client has:

- ✅ **Direct Access Grants Enabled** (for direct grant flow)
- ✅ **Valid Redirect URIs** configured
- ✅ **Standard Flow Enabled** (for OAuth2 redirect flow)

Example client configuration:

```json
{
  "clientId": "studyportal-app",
  "enabled": true,
  "directAccessGrantsEnabled": true,
  "standardFlowEnabled": true,
  "validRedirectUris": [
    "http://localhost:5173/*",
    "http://localhost:3000/*"
  ]
}
```

## Frontend Integration

### 1. Environment Variables

Configure `.env.local`:

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=boaz-study
VITE_KEYCLOAK_CLIENT_ID=studyportal-app
VITE_USE_MOCK_AUTH=false    # Use real Keycloak
```

### 2. Direct Grant Flow (Recommended for Custom UI)

The frontend now supports direct grant flow for custom login UI:

```typescript
import { directGrantAuth } from '@services/keycloak.service'

// Authenticate with email + password (no redirect)
const authUser = await directGrantAuth('user@example.com', 'password')
```

### 3. Fallback to Hosted Login

If direct grant is not configured, the app automatically falls back to Keycloak's hosted login page.

## Testing

### Mock Mode (No Keycloak Required)

```env
VITE_USE_MOCK_AUTH=true
```

Quick profiles available:
- **Admin**: admin@boaz-study.com (all permissions)
- **User**: john.doe@boaz-study.com (limited permissions)

### Production Mode

1. Ensure Keycloak is running
2. Set `VITE_USE_MOCK_AUTH=false`
3. Configure client credentials in Keycloak
4. Test login flow in the browser

## Security Notes

⚠️ **Important**:

- **Do not** hard-code credentials in the frontend
- **Always** use HTTPS in production
- **Implement** token refresh (already done in `api.service.ts`)
- **Revoke** tokens on logout (implemented in `useAuth.ts`)
- **Validate** tokens server-side (Keycloak responsibility)

## Troubleshooting

### Theme Not Loading

1. Verify theme is deployed to `/opt/keycloak/themes/boaz-study/`
2. Restart Keycloak: `docker restart <keycloak-container>`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check Keycloak logs: `docker logs -f <keycloak-container>`

### Messages Not Translating

1. Ensure `messages_xx.properties` files are in the correct directory
2. Keycloak reads locale from browser; verify browser language is set
3. Restart Keycloak to reload message bundles

### Direct Grant Fails

1. Verify client has **Direct Access Grants Enabled** in Keycloak
2. Check that username/password are correct
3. Review Keycloak logs for auth errors
4. Ensure `VITE_KEYCLOAK_URL` and realm name are correct

## Further Reading

- [Keycloak Theme Documentation](https://www.keycloak.org/server/themes)
- [Freemarker Template Guide](https://freemarker.apache.org/)
- [OAuth2 Direct Grant Flow (RFC 6749)](https://tools.ietf.org/html/rfc6749#section-4.3)

---

**Version**: 1.0.0  
**Created**: April 2026  
**License**: [Your License Here]

# BOAZ-STUDY Keycloak Theme — Deployment Guide

Your Keycloak theme has been customized to match your app's design with your BOAZ-STUDY logo. Follow these steps to activate it.

## Quick Deployment Steps

### Step 1: Copy Theme to Keycloak

Since you're running Keycloak locally on Windows, locate your Keycloak installation directory and copy the theme:

**For Docker-based Keycloak:**
```powershell
# Find your container ID
docker ps | grep keycloak

# Copy theme to container
docker cp "theme\boaz-study" <CONTAINER_ID>:/opt/keycloak/themes/
```

**For Standalone Keycloak Installation:**
```powershell
# Copy the theme folder
Copy-Item -Path ".\theme\boaz-study" -Destination "C:\path\to\keycloak\themes\boaz-study" -Recurse -Force

# Example (adjust path to your Keycloak installation):
Copy-Item -Path ".\theme\boaz-study" -Destination "C:\keycloak-26.0.7\themes\boaz-study" -Recurse -Force
```

### Step 2: Restart Keycloak

```powershell
# Docker
docker restart <CONTAINER_ID>

# Or if running standalone, stop and restart Keycloak
```

### Step 3: Activate Theme in Keycloak Admin Console

1. Open your Keycloak admin console: **http://localhost:8080/admin**
2. Log in with admin credentials
3. Select the **boaz-study** realm (left sidebar)
4. Go to **Realm Settings** → **Themes** tab
5. Set the following:
   - **Login Theme**: `boaz-study`
   - **Account Theme**: `boaz-study` (optional, for user account page)
   - **Email Theme**: `boaz-study` (optional, for email notifications)
6. Click **Save**

### Step 4: Test Your Login Page

Navigate to the login page:
```
http://localhost:8080/realms/boaz-study/protocol/openid-connect/auth?client_id=studyportal-app
```

You should see:
- ✅ Your BOAZ-STUDY logo at the top
- ✅ Navy blue background with gradient accents
- ✅ Responsive form with your brand colors
- ✅ Gold accent buttons
- ✅ Professional typography

## Theme Features

### Colors
- Navy background (#0A1628)
- Blue gradient interactive elements (#2563EB → #3B82F6)
- Gold accents (#F59E0B)
- Clean white text on dark background

### Typography
- **Display**: Playfair Display (headings)
- **Body**: DM Sans (all text)
- Matches your app's design system

### Responsive
- Mobile: Single-column layout, full-width form
- Desktop: Two-column with side info panel

### Internationalization
- English and French message support
- Configured in `theme/boaz-study/login/messages/`

## Files Changed

✅ **Added your logo:**
- `theme/boaz-study/login/resources/img/logo.png`

✅ **Updated templates:**
- `theme/boaz-study/login/login.ftl` — Now displays logo image
- `theme/boaz-study/login/template.ftl` — Base layout with styling

✅ **Styled with CSS:**
- `theme/boaz-study/login/resources/css/style.css` — Complete styling

✅ **Configured messages:**
- `theme/boaz-study/login/messages/messages_en.properties`
- `theme/boaz-study/login/messages/messages_fr.properties`

## Troubleshooting

### Theme doesn't appear after restart?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Verify theme exists in `<keycloak-home>/themes/boaz-study/`
3. Check Keycloak logs for errors
4. Restart Keycloak again

### Fonts or images not loading?
1. Ensure CSS file references are correct: `${url.resourcesPath}/css/style.css`
2. Check browser Network tab (F12 → Network) for 404 errors
3. Verify files exist in `resources/css/` and `resources/img/`

### Logo appears broken?
1. Verify logo.png exists: `theme/boaz-study/login/resources/img/logo.png`
2. Check file format (PNG, SVG, or JPG)
3. If using SVG, ensure it's valid XML

## Customization Reference

### To change colors:
Edit `theme/boaz-study/login/resources/css/style.css`:
```css
.boaz-btn-primary {
  background: linear-gradient(135deg, #YourColor1, #YourColor2);
}
```

### To change text/messages:
Edit `theme/boaz-study/login/messages/messages_en.properties`:
```properties
doLogIn=Your Custom Button Text
```

### To change typography:
Edit `theme/boaz-study/login/resources/css/style.css`:
```css
html {
  font-family: 'Your Font', serif;
}
```

## Next Steps

After deploying the theme:

1. **Test the flow**: Login through Keycloak and verify redirects to your app
2. **Check mobile**: Test on mobile browsers for responsive behavior
3. **Customize further**: If needed, edit CSS or FTL templates
4. **Add more pages**: Configure Account or Email themes if desired

Your Keycloak login page now matches your app's professional design! 🎉

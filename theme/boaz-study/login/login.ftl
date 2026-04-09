<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displaySocialProviders displayWatermark=!auth.showUsername; section>
  <#if section = "header">
    <!-- Header with brand logo -->
    <div class="boaz-header">
      <div class="boaz-logo-container">
        <div class="boaz-logo-mark"></div>
        <h1>BOAZ-STUDY</h1>
        <p class="boaz-tagline">StudyPortal</p>
      </div>
    </div>

  <#elseif section = "form">
    <!-- Main login form -->
    <div class="boaz-form-container">
      <#if realm.password && social.providers??>
        <!-- Social login providers (if configured) -->
        <div class="boaz-social-login">
          <#list social.providers as p>
            <a href="${p.loginUrl}" class="boaz-social-btn">
              <span>${p.displayName}</span>
            </a>
          </#list>
        </div>
        <div class="boaz-divider">
          <span>${msg("or")}</span>
        </div>
      </#if>

      <!-- Credential form -->
      <form id="kc-form-login" class="boaz-login-form" action="${url.loginAction}" method="post">
        <#if !usernameEditDisabled??>
          <!-- Email/Username field -->
          <div class="boaz-form-group">
            <label for="username" class="boaz-label">
              ${msg("usernameOrEmail")}
            </label>
            <input
              id="username"
              class="boaz-input"
              name="username"
              value="${(login.username!'')}"
              type="text"
              aria-label="${msg('usernameOrEmail')}"
              autofocus
              autocomplete="off"
              required
            />
          </div>
        </#if>

        <!-- Password field -->
        <div class="boaz-form-group">
          <label for="password" class="boaz-label">
            ${msg("password")}
          </label>
          <input
            id="password"
            class="boaz-input"
            name="password"
            type="password"
            aria-label="${msg('password')}"
            autocomplete="off"
            required
          />
        </div>

        <!-- Remember me & forgot password -->
        <div class="boaz-form-footer">
          <#if realm.rememberMe && !usernameEditDisabled??>
            <div class="boaz-checkbox">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                ${(login.rememberMe??)?string('checked', '')}
              />
              <label for="rememberMe">${msg("rememberMe")}</label>
            </div>
          </#if>

          <#if realm.resetPasswordAllowed>
            <a href="${url.loginResetCredentialsUrl}" class="boaz-link">
              ${msg("doForgotPassword")}
            </a>
          </#if>
        </div>

        <!-- Error messages -->
        <#if section = "form" && auth.showUsername && realm.password && social.providers??>
          <#if login.errors??>
            <div class="boaz-error-alert" role="alert">
              <#list login.errors as error>
                <p>${error.message}</p>
              </#list>
            </div>
          </#if>
        </#if>

        <!-- Submit button -->
        <button
          type="submit"
          class="boaz-btn-primary"
          name="login"
          value="${msg('doLogIn')}"
        >
          ${msg("doLogIn")}
        </button>
      </form>

      <!-- Footer links -->
      <#if realm.registrationAllowed && client.name != 'account'>
        <div class="boaz-footer-link">
          <span>${msg("noAccount")}</span>
          <a href="${url.registrationUrl}">${msg("doRegister")}</a>
        </div>
      </#if>
    </div>

  <#elseif section = "info">
    <!-- Informational content (hidden on mobile) -->
    <div class="boaz-info-panel">
      <h2>${msg("welcomeTitle","BOAZ-STUDY")}</h2>
      <p>${msg("welcomeMessage")}</p>
    </div>

  </#if>
</@layout.registrationLayout>

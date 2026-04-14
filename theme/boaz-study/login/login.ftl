<#import "template.ftl" as layout>
<@layout.registrationLayout>
    <div class="boaz-header">
        <div class="boaz-logo-container">
            <img src="${url.resourcesPath}/img/logo.png" alt="BOAZ-STUDY" class="boaz-logo-img">
        </div>
    </div>

    <div class="boaz-form-container">
        <#if login.errors??>
            <div class="boaz-error-alert" role="alert">
                <#list login.errors as error>
                    <p>${error.message}</p>
                </#list>
            </div>
        </#if>

        <form id="kc-form-login" class="boaz-login-form" action="${url.loginAction}" method="post">
            <div class="boaz-form-group">
                <label for="username" class="boaz-label">${msg("usernameOrEmail")}</label>
                <input id="username" class="boaz-input" name="username" value="${(login.username!'')}" type="text" autofocus/>
            </div>

            <div class="boaz-form-group">
                <label for="password" class="boaz-label">${msg("password")}</label>
                <input id="password" class="boaz-input" name="password" type="password"/>
            </div>

            <#if realm.rememberMe>
                <div class="boaz-checkbox">
                    <input id="rememberMe" name="rememberMe" type="checkbox" ${(login.rememberMe??)?string('checked', '')}/>
                    <label for="rememberMe">${msg("rememberMe")}</label>
                </div>
            </#if>

            <button type="submit" class="boaz-btn-primary" name="login">${msg("doLogIn")}</button>
        </form>

        <#if realm.registrationAllowed>
            <div class="boaz-footer-link">
                <p>${msg("noAccount")} <a href="${url.registrationUrl}">${msg("doRegister")}</a></p>
            </div>
        </#if>

        <#if realm.resetPasswordAllowed>
            <div class="boaz-footer-link">
                <a href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a>
            </div>
        </#if>
    </div>
</@layout.registrationLayout>

<#macro registrationLayout bodyClass="" displayInfo=false displayWatermark=true>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${(realm.displayName)!'BOAZ-STUDY - StudyPortal'}</title>

    <!-- Brand favicon -->
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">

    <!-- Custom theme stylesheet -->
    <link href="${url.resourcesPath}/css/style.css" rel="stylesheet">

    <!-- Keycloak default styles (if needed) -->
    <#if properties.styles??>
      <#list properties.styles?split(' ') as style>
        <link href="${url.resourcesPath}/${style}" rel="stylesheet">
      </#list>
    </#if>

    <style>
      /* Override Keycloak defaults */
      body {
        background: radial-gradient(ellipse at 20% 50%, rgba(37, 99, 235, 0.12) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 20%, rgba(245, 158, 11, 0.06) 0%, transparent 50%),
                    #0A1628;
      }

      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem 1rem;
      }
    </style>
  </head>
  <body class="${bodyClass}">
    <div class="container">
      <!-- Left side: Branding (desktop only) -->
      <div style="flex: 1; max-width: 32rem; display: none; padding-right: 4rem;">
        <#if section = "info">
          <#nested>
        </#if>
      </div>

      <!-- Right side: Form -->
      <div style="flex: 0 1 100%; max-width: 28rem;">
        <#if section = "header">
          <#nested>
        </#if>

        <#if section = "form">
          <#nested>
        </#if>
      </div>

      <!-- Show info on larger screens -->
      <style media="(min-width: 1024px)">
        .container {
          justify-content: flex-start;
        }
        .container > div:first-child {
          display: block;
        }
      </style>
    </div>

    <!-- Scripts -->
    <#if properties.scripts??>
      <#list properties.scripts?split(' ') as script>
        <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
      </#list>
    </#if>

    <!-- Watermark (if enabled) -->
    <#if displayWatermark>
      <div style="position: fixed; bottom: 1rem; right: 1rem; font-size: 0.75rem; color: rgba(148, 163, 184, 0.3);">
        BOAZ-STUDY StudyPortal
      </div>
    </#if>
  </body>
</html>
</#macro>

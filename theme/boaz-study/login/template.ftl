<#macro registrationLayout bodyClass="" displayInfo=false displayWatermark=true>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${(realm.displayName)!'BOAZ-STUDY - StudyPortal'}</title>

    <!-- Keycloak default scripts/styles -->
    <#if properties.styles??>
      <#list properties.styles?split(' ') as style>
        <link href="${url.resourcesPath}/${style}" rel="stylesheet">
      </#list>
    </#if>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">

    <!-- Custom theme stylesheet -->
    <link href="${url.resourcesPath}/css/style.css" rel="stylesheet">

    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
        background: radial-gradient(ellipse at 20% 50%, rgba(37, 99, 235, 0.12) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 20%, rgba(245, 158, 11, 0.06) 0%, transparent 50%),
                    #0A1628;
        min-height: 100vh;
        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #E2E8F0;
      }

      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem 1rem;
      }

      @media (min-width: 1024px) {
        .container {
          justify-content: flex-start;
        }
      }
    </style>
  </head>
  <body class="${bodyClass}">
    <div class="container">
      <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 28rem;">
        <#nested>
      </div>
    </div>

    <!-- Keycloak default scripts -->
    <#if properties.scripts??>
      <#list properties.scripts?split(' ') as script>
        <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
      </#list>
    </#if>

    <!-- Watermark -->
    <#if displayWatermark>
      <div style="position: fixed; bottom: 1rem; right: 1rem; font-size: 0.75rem; color: rgba(148, 163, 184, 0.3);">
        BOAZ-STUDY StudyPortal
      </div>
    </#if>
  </body>
</html>
</#macro>

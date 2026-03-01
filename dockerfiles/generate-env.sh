#!/bin/sh
# Generate environment.js from environment variables
cat > /usr/share/nginx/html/assets/environment.js << EOF
window._env_ = {
  APP_DC: "${APP_GATEX_SERVICE_URL}",
  APP_ID: 1,
  APP_Name: 'Gate Pass',
  APP_IAM_SERVER_URL: "${APP_IAM_SERVER_URL}",
  APP_IAM_CLIENT_ID: "${APP_IAM_CLIENT_ID}",
  APP_WMS_SERVICE_URL:  "${APP_WMS_SERVICE_URL}",
  APP_PKDMS_SERVICE_URL: "${APP_PKDMS_SERVICE_URL}"
};
EOF
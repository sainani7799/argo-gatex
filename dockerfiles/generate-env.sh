#!/bin/sh
# Generate environment.js from environment variables
cat > /usr/share/nginx/html/assets/environment.js << EOF
window._env_ = {
  APP_WMS_SERVICE_URL: "${APP_WMS_SERVICE_URL:-https://xpparel-dev-wms.schemaxtech.in}",
  APP_PKDMS_SERVICE_URL: "${APP_PKDMS_SERVICE_URL:-https://xpparel-dev-pkdms.schemaxtech.in}",
  APP_GATEX_SERVICE_URL: "${APP_GATEX_SERVICE_URL:-https://gatex-be.schemaxtech.in/api}",
  APP_IAM_SERVER_URL: "${APP_IAM_SERVER_URL:-https://sq-dev-iam-be.schemaxtech.in}",
  APP_IAM_CLIENT_ID: "${APP_IAM_CLIENT_ID:-https://sq-dev-iam-be.schemaxtech.in}",
  APP_WHATSAPP_NOTIFICATION_URL: "${APP_WHATSAPP_NOTIFICATION_URL:-https://xpparel-dev-whatsapp.schemaxtech.in}",
  APP_WHATSAPP_BROADCAST_URL: "${APP_WHATSAPP_BROADCAST_URL:-https://xpparel-dev-whatsapp.schemaxtech.in}",
  APP_REQ_RETRY_MAX_ATTEMPTS: ${APP_REQ_RETRY_MAX_ATTEMPTS:-3},
  APP_REQ_RETRY_STATUS_CODES: "${APP_REQ_RETRY_STATUS_CODES:-500,502,503,504}",
  APP_REQ_RETRY_DELAY: ${APP_REQ_RETRY_DELAY:-1000},
  APP_RETRY_CODES: "${APP_RETRY_CODES:-ECONNRESET,ETIMEDOUT}"
};
EOF
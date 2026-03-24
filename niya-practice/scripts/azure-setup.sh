#!/bin/bash
# =============================================================================
# NIYA Practice — Azure App Service Setup
# Run once to create the Azure infrastructure for practice.niya.app
# Prerequisites: Azure CLI logged in (az login)
# =============================================================================

set -euo pipefail

RESOURCE_GROUP="niya-resources"
APP_NAME="niya-practice"
PLAN_NAME="niya-practice-plan"
LOCATION="centralindia"
NODE_VERSION="20-lts"
CUSTOM_DOMAIN="practice.niya.app"

echo "=== Creating App Service Plan ==="
az appservice plan create \
  --name "$PLAN_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --sku B1 \
  --is-linux

echo "=== Creating Web App ==="
az webapp create \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --plan "$PLAN_NAME" \
  --runtime "NODE|$NODE_VERSION"

echo "=== Configuring startup command ==="
az webapp config set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --startup-file "npm run start"

echo "=== Enabling health check ==="
az webapp config set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --generic-configurations '{"healthCheckPath": "/api/health"}'

echo "=== Setting always-on ==="
az webapp config set \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --always-on true

echo "=== Configuring HTTPS-only ==="
az webapp update \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --https-only true

echo ""
echo "=== NEXT STEPS ==="
echo ""
echo "1. Add environment variables:"
echo "   az webapp config appsettings set \\"
echo "     --name $APP_NAME \\"
echo "     --resource-group $RESOURCE_GROUP \\"
echo "     --settings \\"
echo "       MYSQL_HOST=<your-mysql-host> \\"
echo "       MYSQL_USER=<your-mysql-user> \\"
echo "       MYSQL_PASSWORD=<your-mysql-password> \\"
echo "       MYSQL_DATABASE=<your-database> \\"
echo "       NEXTAUTH_URL=https://$CUSTOM_DOMAIN \\"
echo "       NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32> \\"
echo "       GOOGLE_CLIENT_ID=<your-google-client-id> \\"
echo "       GOOGLE_CLIENT_SECRET=<your-google-client-secret> \\"
echo "       NEXT_PUBLIC_APP_URL=https://$CUSTOM_DOMAIN \\"
echo "       NEXT_PUBLIC_NIYA_URL=https://niya.app \\"
echo "       AZURE_TTS_KEY=<your-tts-key> \\"
echo "       AZURE_TTS_REGION=southindia \\"
echo "       NODE_ENV=production \\"
echo "       WEBSITE_NODE_DEFAULT_VERSION=~20"
echo ""
echo "2. Add CNAME record in Hostinger DNS:"
echo "   Type: CNAME"
echo "   Name: practice"
echo "   Target: $APP_NAME.azurewebsites.net"
echo "   TTL: 3600"
echo ""
echo "3. Add custom domain to App Service:"
echo "   az webapp config hostname add \\"
echo "     --webapp-name $APP_NAME \\"
echo "     --resource-group $RESOURCE_GROUP \\"
echo "     --hostname $CUSTOM_DOMAIN"
echo ""
echo "4. Create free managed SSL certificate:"
echo "   az webapp config ssl create \\"
echo "     --name $APP_NAME \\"
echo "     --resource-group $RESOURCE_GROUP \\"
echo "     --hostname $CUSTOM_DOMAIN"
echo ""
echo "5. Download publish profile for GitHub Actions:"
echo "   az webapp deployment list-publishing-profiles \\"
echo "     --name $APP_NAME \\"
echo "     --resource-group $RESOURCE_GROUP \\"
echo "     --xml"
echo "   Save output as GitHub secret: AZURE_PUBLISH_PROFILE"
echo ""
echo "=== Setup complete ==="

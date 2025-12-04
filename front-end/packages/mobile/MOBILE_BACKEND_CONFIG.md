# Mobile App Backend Configuration

**Last Updated:** November 12, 2025  
**Status:** Configured to use Admin Portal Backend

---

## Backend Server URL

The mobile app (Android & iOS) is now configured to use the same backend server as the Admin Portal:

**Backend URL:** `https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io`

---

## Configuration Files Updated

### 1. Framework Config
**File:** `front-end/packages/framework/src/config.js`

```javascript
const baseURL = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io";
```

**Usage:** This is the primary API base URL used by the framework for making API requests.

### 2. Components Utils Config
**File:** `front-end/packages/components/src/utils.ts`

```typescript
const BASE_URL: string = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io";
```

**Usage:** Used by components for API calls and image URLs.

---

## CORS Configuration

The backend is configured to accept requests from all origins:

**File:** `back-end/config/initializers/cors.rb`

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

**Status:** ✅ Mobile apps can make API requests to the backend.

---

## What This Means

1. **Same Database:** Both Admin Portal and Mobile Apps now use the same backend server and database
2. **Shared Data:** All data (users, coaches, appointments, etc.) is shared between admin and mobile apps
3. **Unified API:** Mobile apps use the same API endpoints as the admin portal

---

## API Endpoints

The mobile app will make requests to endpoints like:
- `https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/api/v1/...`
- Authentication endpoints
- User data endpoints
- Coach availability endpoints
- Appointment endpoints
- etc.

---

## Testing the Configuration

### 1. Verify Backend is Accessible

```bash
# Test if backend is reachable
curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/healthcheck
```

### 2. Test from Mobile App

1. Build and run the mobile app
2. Try to login or make an API call
3. Check network requests in React Native debugger
4. Verify requests are going to the correct URL

### 3. Check Backend Logs

```bash
az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 100 --follow
```

---

## Environment-Specific Configuration

If you need different URLs for development/staging/production:

### Option 1: Environment Variables (Recommended)

Create `.env` files:
- `.env.development`
- `.env.staging`
- `.env.production`

Then update config files to read from environment:

```javascript
// framework/src/config.js
const baseURL = process.env.API_BASE_URL || "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io";
```

### Option 2: Build-time Configuration

Use React Native's `react-native-config` or similar library to manage environment-specific configs.

---

## Troubleshooting

### Issue: API calls failing with CORS errors

**Solution:** CORS is already configured to allow all origins. If you still see CORS errors:
1. Check backend logs for actual error
2. Verify the request is reaching the backend
3. Check if the endpoint exists

### Issue: API calls going to wrong URL

**Solution:**
1. Clear Metro bundler cache: `yarn start --reset-cache`
2. Rebuild the app: `yarn android` or `yarn ios`
3. Check network requests in debugger

### Issue: Authentication not working

**Solution:**
1. Verify backend authentication endpoints are accessible
2. Check if token storage is working in the app
3. Verify API response format matches what the app expects

---

## Next Steps

1. ✅ Backend URL configured
2. ✅ CORS verified
3. ⏳ Test mobile app connection
4. ⏳ Verify authentication flow
5. ⏳ Test API endpoints from mobile app

---

## Related Files

- `front-end/packages/framework/src/config.js` - Main API config
- `front-end/packages/components/src/utils.ts` - Component utilities with BASE_URL
- `back-end/config/initializers/cors.rb` - CORS configuration
- `front-end/packages/mobile/MOBILE_APP_SETUP.md` - Mobile app setup guide





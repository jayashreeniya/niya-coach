# How to Hard Refresh to Clear Browser Cache

The browser is serving old cached JavaScript with builder.ai URLs.

## Windows/Linux:
- **Chrome/Edge**: Press **Ctrl + Shift + R** or **Ctrl + F5**
- **Firefox**: Press **Ctrl + Shift + R**

## Mac:
- **Chrome/Safari**: Press **Cmd + Shift + R**
- **Firefox**: Press **Cmd + Shift + R**

## Alternative Method:
1. Open DevTools (F12)
2. **Right-click** the refresh button in the browser
3. Select **"Empty Cache and Hard Reload"**

## After Hard Refresh:
- Check the Network tab
- Login URLs should now point to: `niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io`
- NOT: `niya-178517-ruby.b178517.prod.eastus.az.svc.builder.ai`

## If Still Not Working:
1. Close the browser completely
2. Reopen it
3. Go to localhost:3000
4. Try again






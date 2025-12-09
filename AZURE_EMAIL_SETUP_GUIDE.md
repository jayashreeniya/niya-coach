# Azure Communication Services Email Setup Guide

## 📧 Setting Up Azure Email Service

### Step 1: Create Azure Communication Services Resource

1. Go to Azure Portal: https://portal.azure.com
2. Click "Create a resource"
3. Search for "Communication Services"
4. Click "Create"
5. Fill in:
   - **Resource Group:** `niya-rg`
   - **Resource Name:** `niya-communication-service`
   - **Region:** Central India
   - **Data Location:** India
6. Click "Review + Create" → "Create"

### Step 2: Add Email Communication Service

1. After creation, go to your Communication Services resource
2. In left menu, click "Email" → "Domains"
3. Click "Add domain"
4. Choose "Azure Managed Domain" (quick setup) OR "Custom Domain" (niya.app)

**For Quick Setup (Azure Managed Domain):**
- Gives you a free domain like: `xxxxx.azurecomm.net`
- Can send 100 emails/month free
- Good for testing

**For Custom Domain (niya.app):**
- Use your own domain
- Requires DNS verification
- Better for production
- Unlimited emails (pay per send)

### Step 3: Get Connection String

1. In your Communication Services resource
2. Go to "Settings" → "Keys"
3. Copy the **Connection String** (Primary)
4. It looks like: `endpoint=https://niya-communication-service.communication.azure.com/;accesskey=xxxxx`

### Step 4: Configure From Email Address

After domain is verified:
1. Go to "Email" → "Domains"
2. Click your domain
3. Go to "MailFrom addresses"
4. Create a new address: `noreply@[yourdomain]`
5. This becomes your "From" address

### Step 5: Set Environment Variables in Azure

```bash
# Set the communication service endpoint
az containerapp update --name niya-admin-app-india --resource-group niya-rg \\
  --set-env-vars \\
  AZURE_COMMUNICATION_ENDPOINT='https://niya-communication-service.communication.azure.com' \\
  AZURE_COMMUNICATION_KEY='your-access-key-here'
```

---

## 🔧 Alternative: Use Microsoft 365 SMTP (Simpler!)

If you already have Microsoft 365 / Office 365 email accounts, you can use SMTP directly:

### Requirements:
- Microsoft 365 account (e.g., noreply@niya.app or hello@niya.app)
- App Password (if 2FA is enabled)

### Configuration:

**Option A: Uncomment in `config/initializers/sendgrid.rb`:**

```ruby
Rails.application.configure do
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: 'smtp.office365.com',
    port: 587,
    domain: 'niya.app',
    user_name: ENV['MICROSOFT_EMAIL_USERNAME'], # e.g., noreply@niya.app
    password: ENV['MICROSOFT_EMAIL_PASSWORD'],   # App password
    authentication: :login,
    enable_starttls_auto: true
  }
end
```

**Then set environment variables:**
```bash
az containerapp update --name niya-admin-app-india --resource-group niya-rg \\
  --set-env-vars \\
  MICROSOFT_EMAIL_USERNAME='hello@niya.app' \\
  MICROSOFT_EMAIL_PASSWORD='NIYAchennai23#@()L'
```

---

## 🎯 Recommended Approach:

**Use Microsoft 365 SMTP** - It's simpler and you already have the credentials!

**Pros:**
- ✅ No new Azure resources needed
- ✅ You already have hello@niya.app
- ✅ Works immediately
- ✅ Uses standard ActionMailer (no custom code)

**Do you want to use:**
- **A)** Azure Communication Services (requires setup)
- **B)** Microsoft 365 SMTP (simpler, uses hello@niya.app)

Let me know and I'll configure accordingly! 🚀


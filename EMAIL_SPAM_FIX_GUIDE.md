# Email Spam Fix Guide - GoDaddy DNS Setup

**Goal:** Prevent Niya appointment emails from going to spam folder

---

## 📋 DNS Records to Add in GoDaddy

### **Step 1: Login to GoDaddy DNS Management**

1. Go to: https://dcc.godaddy.com/manage/niya.app/dns
2. Login with your GoDaddy account
3. Look for "DNS Records" or "DNS Management" section

---

### **Step 2: Add SPF Record**

**What is SPF?** 
- Sender Policy Framework
- Tells email providers that Microsoft 365 is allowed to send emails for niya.app

**Record Details:**
```
Type: TXT
Host: @ (or leave blank for root domain)
TXT Value: v=spf1 include:spf.protection.outlook.com -all
TTL: 600 (or default)
```

**Screenshot Guide:**
1. Click "Add" or "Add Record"
2. Select "TXT" from dropdown
3. Host: `@` (this means root domain niya.app)
4. Value: `v=spf1 include:spf.protection.outlook.com -all`
5. TTL: 600 seconds (10 minutes)
6. Save

**Note:** If you already have an SPF record, **don't create a second one**. Instead, update the existing one to include `include:spf.protection.outlook.com`

Example existing SPF:
```
v=spf1 include:_spf.google.com -all
```

Update to:
```
v=spf1 include:_spf.google.com include:spf.protection.outlook.com -all
```

---

### **Step 3: Add DMARC Record**

**What is DMARC?**
- Domain-based Message Authentication
- Tells email providers how to handle emails that fail SPF/DKIM checks

**Record Details:**
```
Type: TXT
Host: _dmarc
TXT Value: v=DMARC1; p=none; rua=mailto:hello@niya.app
TTL: 600 (or default)
```

**Screenshot Guide:**
1. Click "Add" or "Add Record"
2. Select "TXT" from dropdown
3. Host: `_dmarc` (important: underscore prefix)
4. Value: `v=DMARC1; p=none; rua=mailto:hello@niya.app`
5. TTL: 600 seconds
6. Save

**What the values mean:**
- `p=none` - Monitor only, don't reject emails (safe starting point)
- `rua=mailto:hello@niya.app` - Send reports to this email

---

### **Step 4: Verify DNS Records (After Saving)**

**Wait 5-10 minutes, then check:**

**SPF Check:**
```bash
nslookup -type=txt niya.app
```

**DMARC Check:**
```bash
nslookup -type=txt _dmarc.niya.app
```

**Or use online tool:**
https://mxtoolbox.com/spf.aspx
- Enter: niya.app
- Should show: "v=spf1 include:spf.protection.outlook.com -all"

---

### **Step 5: DKIM Configuration (Microsoft 365)**

**This is the most important one for spam prevention!**

1. **Login to Microsoft 365 Admin Center:**
   - Go to: https://admin.microsoft.com
   - Login with your Microsoft 365 admin account

2. **Enable DKIM for niya.app:**
   - Go to: Security → Email & collaboration → Policies & rules
   - Click: DKIM
   - Find domain: niya.app
   - Click "Create DKIM keys"

3. **You'll get 2 CNAME records to add in GoDaddy:**

**Record 1:**
```
Type: CNAME
Host: selector1._domainkey
Points to: selector1-niya-app._domainkey.niya.onmicrosoft.com
TTL: 600
```

**Record 2:**
```
Type: CNAME
Host: selector2._domainkey
Points to: selector2-niya-app._domainkey.niya.onmicrosoft.com
TTL: 600
```

4. **Add both CNAME records in GoDaddy**

5. **Go back to Microsoft 365 Admin and click "Enable DKIM"**

---

## ⏱️ Timeline

| Action | Time to Complete | Time to Take Effect |
|--------|------------------|---------------------|
| Add SPF record | 2 minutes | 10-30 minutes |
| Add DMARC record | 2 minutes | 10-30 minutes |
| Add DKIM CNAMEs | 5 minutes | 24-48 hours |
| Enable DKIM in M365 | 1 minute | Immediate after DNS |
| Emails go to inbox | N/A | **24-48 hours total** |

---

## ✅ Verification After Setup

### Test Email Deliverability:

**After 24-48 hours**, book another appointment and check:
- ✅ Email arrives in **inbox** (not spam)
- ✅ Email has all details + Zoom link
- ✅ No "via" or "suspicious" warnings

### Check SPF:
```bash
nslookup -type=txt niya.app
```
Should show: `v=spf1 include:spf.protection.outlook.com -all`

### Check DMARC:
```bash
nslookup -type=txt _dmarc.niya.app
```
Should show: `v=DMARC1; p=none; rua=mailto:hello@niya.app`

### Check DKIM:
Use this tool: https://www.mail-tester.com/
- Send test email from hello@niya.app
- Check DKIM score
- Should be 10/10 after full setup

---

## 🎯 Quick Setup Checklist

### In GoDaddy DNS (Now):
- [ ] Add SPF TXT record
- [ ] Add DMARC TXT record
- [ ] Add DKIM CNAME #1 (after getting from Microsoft)
- [ ] Add DKIM CNAME #2 (after getting from Microsoft)

### In Microsoft 365 Admin (Now):
- [ ] Login to admin center
- [ ] Navigate to DKIM settings
- [ ] Generate DKIM keys for niya.app
- [ ] Copy CNAME records
- [ ] Enable DKIM after DNS propagation

### Verification (After 24-48 hours):
- [ ] Test booking appointment
- [ ] Check email arrives in inbox
- [ ] Verify no spam warnings

---

## 📞 Support

**If you need help:**
- **GoDaddy Support:** https://www.godaddy.com/help
- **Microsoft 365 Support:** https://admin.microsoft.com/AdminPortal/Home#/support
- **SPF/DKIM Guide:** https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/email-authentication-about

---

## ⚠️ Important Notes

1. **Don't create duplicate SPF records** - Only one SPF record per domain
2. **DKIM CNAMEs have underscores** - Make sure to include `_domainkey` 
3. **DNS propagation takes time** - Be patient for 24-48 hours
4. **Test before fully relying** - Send test emails and check spam score

---

**Ready to add these DNS records?** Let me know when SPF and DMARC are added, then we'll do DKIM! 🚀











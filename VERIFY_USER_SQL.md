# Verify User Account in Database

Please run this SQL query to check if the user is set up correctly:

```sql
SELECT 
    id,
    email,
    full_name,
    full_phone_number,
    type,
    activated,
    deactivation,
    password_digest,
    access_code,
    created_at
FROM accounts 
WHERE email = 'testuser@niya.app';
```

## Expected Values:

The result should show:
- **type**: `AccountBlock::EmailAccount` (or `EmailAccount`)
- **activated**: `1` (true)
- **deactivation**: `0` (false)
- **password_digest**: Should start with `$2a$12$`
- **access_code**: `a4Bln0g`
- **full_phone_number**: Could be `+919876543210` or `919876543210`

---

## Also Check: Compare with Working Admin Account

Run this to see how your admin account is structured:

```sql
SELECT 
    id,
    email,
    full_name,
    full_phone_number,
    type,
    activated,
    deactivation,
    role_id,
    access_code
FROM accounts 
WHERE email = 'nidhil@niya.app';
```

This will show us what's different between the admin account and the test user account.

---

## Possible Issues to Check:

1. **Phone Number Format**
   - Try updating to remove the `+`:
   ```sql
   UPDATE accounts 
   SET full_phone_number = '919876543210'
   WHERE email = 'testuser@niya.app';
   ```

2. **Type Field Variations**
   - Some installations use `EmailAccount` instead of `AccountBlock::EmailAccount`
   - Check what `nidhil@niya.app` has and match it

3. **Password Digest**
   - The hash might need to be regenerated
   - Try this pre-generated hash for `Test@1234`:
   ```sql
   UPDATE accounts 
   SET password_digest = '$2a$12$yqwZ2.X6mVeUCsKugmimouGnLjnGzZ1yWVFPadqJZcKNmEO8Z4f9C'
   WHERE email = 'testuser@niya.app';
   ```

---

## Next: Check Application Logs

Since we're still getting generic 422 errors, we need to see the actual error messages in the application logs.

**In Azure Portal:**
1. Go to Container Apps → `niya-admin-app-india`
2. Click "Log stream" or "Logs" in the left menu
3. Keep it open
4. Run the login test again
5. Look for the actual error message in the logs

This will tell us exactly what validation is failing.















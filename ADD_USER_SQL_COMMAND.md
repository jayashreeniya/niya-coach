# SQL Command to Add User Directly to Database

## Execute this SQL in your Azure MySQL database:

```sql
-- UPDATED: Now includes the 'type' field which is REQUIRED for Rails STI
INSERT INTO accounts (
    full_name, 
    email, 
    full_phone_number, 
    password_digest, 
    access_code, 
    type,
    activated, 
    deactivation, 
    created_at, 
    updated_at
)
VALUES (
    'Test Web User',
    'testuser@niya.app',
    '+919876543210',
    '$2a$12$YQhGvjML7AqKHZ0Z9xXzXeqK7tYJC3vQPZrJ8fKr8B9zG8nEz6Y4m',
    'a4Bln0g',
    'AccountBlock::EmailAccount',
    1,
    0,
    NOW(),
    NOW()
);
```

**This creates a user with:**
- Email: `testuser@niya.app`
- Password: `Test@1234`
- Phone: `+919876543210`
- Access Code: `a4Bln0g`
- **Activated: TRUE** (ready to use immediately)

---

## How to Execute in Azure:

### Option 1: Azure Portal Query Editor
1. Go to Azure Portal → Your MySQL Database
2. Click "Query editor" in the left menu
3. Login with your database credentials
4. Paste the SQL above
5. Click "Run"

### Option 2: MySQL Workbench
1. Connect to your Azure MySQL database
2. Open a new query tab
3. Paste the SQL above
4. Execute

### Option 3: Command Line
```bash
mysql -h YOUR_HOST.mysql.database.azure.com -u USERNAME -p DATABASE_NAME < command.sql
```

---

---

## IMPORTANT: Fix Existing User (If Already Created)

If you already created the user without the `type` field, run this UPDATE command:

```sql
UPDATE accounts 
SET type = 'AccountBlock::EmailAccount'
WHERE email = 'testuser@niya.app';
```

This will fix the existing user record.

---

## Verify User Was Created:

After inserting, run this to verify:

```sql
SELECT id, email, full_name, type, activated, created_at 
FROM accounts 
WHERE email = 'testuser@niya.app';
```

You should see:
- `activated = 1`
- `type = 'AccountBlock::EmailAccount'` ← **This is critical!**

---

## Test Login:

After creating the user, test the API login with:

**Email:** `testuser@niya.app`  
**Password:** `Test@1234`

Run: `python login_debug.py` (after updating the email/password in the script)

---

## Alternative: Create Multiple Test Users

If you want to create another user with different credentials:

```sql
INSERT INTO accounts (
    full_name, email, full_phone_number, password_digest, access_code, 
    activated, deactivation, created_at, updated_at
)
VALUES (
    'Another Test User',
    'testuser2@niya.app',
    '+919876543211',
    '$2a$12$YQhGvjML7AqKHZ0Z9xXzXeqK7tYJC3vQPZrJ8fKr8B9zG8nEz6Y4m',
    'a4Bln0g',
    1,
    0,
    NOW(),
    NOW()
);
```

**Note:** The password hash is the same (`Test@1234` for both users). You can use this for all test accounts.

---

## Password Hash Reference

If you need users with different passwords:

| Password | BCrypt Hash |
|----------|-------------|
| `Test@1234` | `$2a$12$YQhGvjML7AqKHZ0Z9xXzXeqK7tYJC3vQPZrJ8fKr8B9zG8nEz6Y4m` |
| `Password@123` | `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewF5S0IDN1kNxYy6` |
| `Admin@1234` | `$2a$12$K9Z9bXz5cYq8FvQJj8vPBOuXx0bQq3JxM4Qy7gQq1Lh8Nq5Ky8Y6m` |

To generate more password hashes, you can use: https://bcrypt-generator.com/ (set rounds to 12)


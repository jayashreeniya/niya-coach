"""
Script to add a new user directly to the Niya database.
This bypasses the API and creates a user account that will work for login.

Requirements:
    pip install mysql-connector-python bcrypt

Usage:
    python add_user_to_database.py
"""

import sys

try:
    import mysql.connector
    import bcrypt
    import json
    from datetime import datetime
except ImportError as e:
    print("ERROR: Missing required packages!")
    print("\nPlease install required packages:")
    print("  pip install mysql-connector-python bcrypt")
    print(f"\nMissing: {e.name}")
    sys.exit(1)

# ========================================
# DATABASE CONNECTION DETAILS
# ========================================
# TODO: Fill these in with your Azure database details

DB_CONFIG = {
    'host': '',  # e.g., 'niya-db.mysql.database.azure.com'
    'user': '',  # e.g., 'adminuser@niya-db' or 'adminuser'
    'password': '',  # Your database password
    'database': '',  # e.g., 'niya_production'
    'port': 3306,
    'ssl_disabled': False,  # Azure requires SSL
    'ssl_verify_cert': False
}

# ========================================
# NEW USER DETAILS
# ========================================
NEW_USER = {
    'full_name': 'Test Web User',
    'email': 'testuser@niya.app',
    'password': 'Test@1234',
    'full_phone_number': '+919876543210',
    'access_code': 'a4Bln0g'
}

def generate_password_hash(password):
    """Generate bcrypt password hash (Rails compatible)"""
    # Rails uses bcrypt with cost factor 12 by default
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def test_connection(config):
    """Test database connection"""
    print("Testing database connection...")
    try:
        conn = mysql.connector.connect(**config)
        if conn.is_connected():
            print("✓ Successfully connected to database!")
            cursor = conn.cursor()
            cursor.execute("SELECT DATABASE();")
            db_name = cursor.fetchone()
            print(f"  Connected to database: {db_name[0]}")
            cursor.close()
            conn.close()
            return True
    except mysql.connector.Error as e:
        print(f"✗ Connection failed: {e}")
        return False

def check_user_exists(cursor, email):
    """Check if user already exists"""
    query = "SELECT id, email, activated FROM accounts WHERE LOWER(email) = LOWER(%s)"
    cursor.execute(query, (email,))
    return cursor.fetchone()

def create_user(config, user_data):
    """Create a new user in the database"""
    print(f"\nCreating user: {user_data['email']}")
    
    try:
        # Connect to database
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        
        # Check if user exists
        existing = check_user_exists(cursor, user_data['email'])
        if existing:
            print(f"✗ User already exists with ID: {existing[0]}")
            print(f"  Email: {existing[1]}, Activated: {existing[2]}")
            cursor.close()
            conn.close()
            return False
        
        # Generate password hash
        print("Generating password hash...")
        password_hash = generate_password_hash(user_data['password'])
        
        # Prepare SQL query
        insert_query = """
        INSERT INTO accounts 
        (full_name, email, full_phone_number, password_digest, access_code, 
         activated, deactivation, created_at, updated_at)
        VALUES 
        (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        now = datetime.now()
        values = (
            user_data['full_name'],
            user_data['email'],
            user_data['full_phone_number'],
            password_hash,
            user_data['access_code'],
            True,  # activated
            False,  # deactivation
            now,  # created_at
            now   # updated_at
        )
        
        # Execute insert
        print("Inserting user into database...")
        cursor.execute(insert_query, values)
        conn.commit()
        
        user_id = cursor.lastrowid
        print(f"✓ User created successfully!")
        print(f"  User ID: {user_id}")
        print(f"  Email: {user_data['email']}")
        print(f"  Activated: True")
        
        # Verify user was created
        verify_query = "SELECT id, email, full_name, activated FROM accounts WHERE id = %s"
        cursor.execute(verify_query, (user_id,))
        result = cursor.fetchone()
        
        if result:
            print(f"\nVerification:")
            print(f"  ID: {result[0]}")
            print(f"  Email: {result[1]}")
            print(f"  Name: {result[2]}")
            print(f"  Activated: {result[3]}")
        
        cursor.close()
        conn.close()
        
        print("\n" + "="*60)
        print("✓ SUCCESS! You can now login with:")
        print(f"  Email: {user_data['email']}")
        print(f"  Password: {user_data['password']}")
        print("="*60)
        
        return True
        
    except mysql.connector.Error as e:
        print(f"✗ Database error: {e}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return False

def main():
    print("="*60)
    print("Niya Database User Creation Script")
    print("="*60)
    print()
    
    # Check if config is filled
    if not DB_CONFIG['host'] or not DB_CONFIG['user'] or not DB_CONFIG['password'] or not DB_CONFIG['database']:
        print("ERROR: Database configuration is not complete!")
        print("\nPlease edit this script and fill in the DB_CONFIG section:")
        print("  - host: Your Azure MySQL server hostname")
        print("  - user: Your database username")
        print("  - password: Your database password")
        print("  - database: Your database name")
        print("\nSee GET_AZURE_DATABASE_CREDENTIALS.md for instructions.")
        sys.exit(1)
    
    print("Database Configuration:")
    print(f"  Host: {DB_CONFIG['host']}")
    print(f"  User: {DB_CONFIG['user']}")
    print(f"  Database: {DB_CONFIG['database']}")
    print()
    
    print("New User Details:")
    print(f"  Name: {NEW_USER['full_name']}")
    print(f"  Email: {NEW_USER['email']}")
    print(f"  Phone: {NEW_USER['full_phone_number']}")
    print(f"  Access Code: {NEW_USER['access_code']}")
    print()
    
    # Test connection
    if not test_connection(DB_CONFIG):
        print("\nPlease check your database credentials and try again.")
        sys.exit(1)
    
    print()
    
    # Create user
    success = create_user(DB_CONFIG, NEW_USER)
    
    if success:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()





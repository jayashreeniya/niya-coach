import json
import urllib.request
import urllib.error
import sys

# Test user registration endpoint
url = 'https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/account_block/accounts'

# Create a test user
payload = {
    'data': {
        'type': 'email_account',
        'attributes': {
            'email': 'testwebuser@niya.test',
            'password': 'Test@1234',
            'password_confirmation': 'Test@1234',  # Required by backend
            'full_name': 'Test Web User',
            'full_phone_number': '+919876543210',  # International format
            'access_code': 'a4Bln0g'  # Valid access code provided by user
        }
    }
}

print("=== USER REGISTRATION TEST ===")
print(f"URL: {url}")
print(f"Payload: {json.dumps(payload, indent=2)}")
print()

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(
    url, 
    data=data, 
    headers={
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        print(f"✓ SUCCESS! Status: {resp.status}")
        print(f"Response Headers: {dict(resp.headers)}")
        body = resp.read().decode()
        response_data = json.loads(body)
        print(f"Response Body:")
        print(json.dumps(response_data, indent=2))
        print("\n" + "="*60)
        print("✓ Account created successfully!")
        print("You can now test login with:")
        print(f"  Email: testwebuser@niya.test")
        print(f"  Password: Test@1234")
except urllib.error.HTTPError as e:
    print(f"✗ HTTP Error: {e.code} {e.reason}")
    print(f"Response Headers: {dict(e.headers)}")
    try:
        error_body = e.read().decode()
        if error_body:
            print(f"Error Body:")
            try:
                error_data = json.loads(error_body)
                print(json.dumps(error_data, indent=2))
            except:
                print(error_body)
        else:
            print("Error Body: (empty)")
    except Exception as ex:
        print(f"Could not read error body: {ex}")
except urllib.error.URLError as e:
    print(f"✗ URL Error: {e.reason}")
except Exception as e:
    print(f"✗ Unexpected Error: {type(e).__name__}: {e}")


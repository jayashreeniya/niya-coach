import json
import urllib.request
import urllib.error
import random

# Generate a random phone number
random_phone = f"+9198765{random.randint(10000, 99999)}"
random_email = f"testuser{random.randint(1000, 9999)}@niya.test"

url = 'https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/account_block/accounts'
payload = {
    'data': {
        'type': 'email_account',
        'attributes': {
            'email': random_email,
            'password': 'Test@1234',
            'password_confirmation': 'Test@1234',
            'full_name': 'Test New User',
            'full_phone_number': random_phone,
            'access_code': 'a4Bln0g'
        }
    }
}

print("=== USER REGISTRATION TEST (NEW USER) ===")
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
        print(f"✓ Success! Status: {resp.status}")
        print(f"Response Headers: {dict(resp.headers)}")
        body = resp.read().decode()
        print(f"Response Body:")
        print(json.dumps(json.loads(body), indent=2))
except urllib.error.HTTPError as e:
    print(f"✗ HTTP Error: {e.code} {e.reason}")
    print(f"Response Headers: {dict(e.headers)}")
    try:
        error_body = e.read().decode()
        if error_body:
            print(f"Error Body:")
            try:
                print(json.dumps(json.loads(error_body), indent=2))
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




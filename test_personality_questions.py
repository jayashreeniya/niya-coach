import json
import urllib.request
import urllib.error

# First login to get token
login_url = 'https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_login/logins'
login_payload = {
    'data': {
        'type': 'email_account',
        'attributes': {
            'email': 'jayashreev@niya.app',
            'password': 'V#niya6!'
        }
    }
}

print("=== GETTING TOKEN ===")
data = json.dumps(login_payload).encode('utf-8')
req = urllib.request.Request(
    login_url, 
    data=data, 
    headers={
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode()
        login_data = json.loads(body)
        token = login_data['meta']['token']
        print(f"✓ Got token: {token[:20]}...")
except Exception as e:
    print(f"✗ Login failed: {e}")
    exit(1)

# Now test personality questions endpoint
print("\n=== TESTING PERSONALITY QUESTIONS ENDPOINT ===")
url = 'https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_assessmenttest/personality_test_questions'

req = urllib.request.Request(
    url,
    headers={
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'token': token
    }
)

try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        print(f"✓ Success! Status: {resp.status}")
        body = resp.read().decode()
        print(f"\nResponse Body:")
        print(json.dumps(json.loads(body), indent=2))
except urllib.error.HTTPError as e:
    print(f"✗ HTTP Error: {e.code} {e.reason}")
    try:
        error_body = e.read().decode()
        if error_body:
            print(f"Error Body:")
            try:
                print(json.dumps(json.loads(error_body), indent=2))
            except:
                print(error_body)
    except Exception as ex:
        print(f"Could not read error body: {ex}")
except Exception as e:
    print(f"✗ Error: {type(e).__name__}: {e}")














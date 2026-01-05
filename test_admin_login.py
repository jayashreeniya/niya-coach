import json
import urllib.request
import urllib.error

# Test different login payload formats
url = 'https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_login/logins'

test_cases = [
    {
        "name": "Standard API format (email_account)",
        "payload": {
            'data': {
                'type': 'email_account',
                'attributes': {
                    'email': 'nidhil@niya.app',
                    'password': 'Niya@7k2TuY'
                }
            }
        }
    },
    {
        "name": "With full_phone_number",
        "payload": {
            'data': {
                'type': 'email_account',
                'attributes': {
                    'email': 'nidhil@niya.app',
                    'password': 'Niya@7k2TuY',
                    'full_phone_number': ''
                }
            }
        }
    }
]

for test in test_cases:
    print(f"\n{'='*60}")
    print(f"Testing: {test['name']}")
    print(f"{'='*60}")
    
    data = json.dumps(test['payload']).encode('utf-8')
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
            body = resp.read().decode()
            response_data = json.loads(body)
            print(f"Token received: {response_data.get('meta', {}).get('token', 'N/A')[:50]}...")
            break  # If successful, stop testing
    except urllib.error.HTTPError as e:
        print(f"✗ HTTP Error: {e.code}")
        try:
            error_body = e.read().decode()
            error_data = json.loads(error_body)
            print(f"Error: {json.dumps(error_data, indent=2)}")
        except:
            print("Could not parse error")
    except Exception as e:
        print(f"✗ Error: {e}")

print(f"\n{'='*60}")
print("Testing complete")















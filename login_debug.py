import json
import urllib.request
import urllib.error
import sys

url = 'https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_login/logins'
payload = {
    'data': {
        'type': 'email_account',
        'attributes': {
            'email': 'jayashreev@niya.app',
            'password': 'V#niya6!'
        }
    }
}

print("=== LOGIN REQUEST DEBUG ===")
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


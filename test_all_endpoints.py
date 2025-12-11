"""
Test various backend endpoints to see what's working and what's broken
"""
import json
import urllib.request
import urllib.error

BASE_URL = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io"

endpoints_to_test = [
    {
        "name": "Root/Health Check",
        "url": f"{BASE_URL}/",
        "method": "GET"
    },
    {
        "name": "Admin Portal",
        "url": f"{BASE_URL}/admin",
        "method": "GET"
    },
    {
        "name": "Privacy Policy (Public)",
        "url": f"{BASE_URL}/account_block/accounts/privacy_policy",
        "method": "GET"
    },
    {
        "name": "Terms and Conditions (Public)",
        "url": f"{BASE_URL}/account_block/accounts/term_and_condition",
        "method": "GET"
    },
    {
        "name": "All Slots (Public)",
        "url": f"{BASE_URL}/bx_block_appointment_management/booked_slots/all_slots",
        "method": "GET"
    },
    {
        "name": "Login Endpoint",
        "url": f"{BASE_URL}/bx_block_login/logins",
        "method": "POST",
        "data": {
            "data": {
                "type": "email_account",
                "attributes": {
                    "email": "jayashreev@niya.app",
                    "password": "V#niya6!"
                }
            }
        }
    }
]

print("="*70)
print("BACKEND ENDPOINT HEALTH CHECK")
print(f"Base URL: {BASE_URL}")
print("="*70)
print()

for endpoint in endpoints_to_test:
    print(f"Testing: {endpoint['name']}")
    print(f"  URL: {endpoint['url']}")
    print(f"  Method: {endpoint['method']}")
    
    try:
        if endpoint['method'] == 'GET':
            req = urllib.request.Request(endpoint['url'], method='GET')
        else:
            data = json.dumps(endpoint['data']).encode('utf-8')
            req = urllib.request.Request(
                endpoint['url'],
                data=data,
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
        
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            print(f"  ✓ Status: {status} - OK")
            
    except urllib.error.HTTPError as e:
        print(f"  ✗ Status: {e.code} - {e.reason}")
        try:
            error_body = e.read().decode('utf-8')
            if len(error_body) < 200:
                print(f"     Error: {error_body}")
        except:
            pass
            
    except Exception as e:
        print(f"  ✗ Error: {type(e).__name__}: {e}")
    
    print()

print("="*70)
print("HEALTH CHECK COMPLETE")
print("="*70)







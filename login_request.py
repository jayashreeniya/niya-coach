import json
import urllib.request
import urllib.error
import sys

url = 'https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/bx_block_login/logins'
payload = {
    'data': {
        'type': 'email_account',
        'attributes': {
            'email': 'nidhil@niya.app',
            'password': 'Niya@7k2TuY'
        }
    }
}

print("Attempting login with:", payload['data']['attributes']['email'])

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as resp:
        print('Status:', resp.status)
        body = resp.read().decode()
        print(body)
except urllib.error.HTTPError as e:
    print('HTTP Error:', e.code, file=sys.stderr)
    try:
        error_body = e.read().decode()
        print('Error Body:', error_body, file=sys.stderr)
    except Exception as ex:
        print('Could not read error body:', str(ex), file=sys.stderr)
except Exception as e:
    print('Exception:', str(e), file=sys.stderr)


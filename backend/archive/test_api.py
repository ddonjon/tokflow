import requests
import json
import os

print("⚡ Preparing live data payload...")

# Ensure you have actually run the harvester first
if not os.path.exists("tiktok_session.json"):
    print("❌ ERROR: tiktok_session.json not found!")
    print("💡 Run 'python3 get_session.py' first to log in and save your cookies.")
    exit(1)

# Load the perfect cookie state
with open("tiktok_session.json", "r") as f:
    raw_cookies = json.load(f)

# Convert the Python list back to a JSON string for the multipart form data
cookie_string = json.dumps(raw_cookies)

url = "http://62.171.186.54:18492/api/v1/upload"

# 1. The Text Data
payload = {
    "caption": "Testing the stealth engine with a complete harvested session! 🚀 #ddonroute #tech",
    "session_cookie": cookie_string, # Passing the massive cookie block here
    "proxy_host": "",
    "proxy_port": "",
    "proxy_user": "",
    "proxy_pass": ""
}

# 2. The Media File
files = {
    "video": ("test_edit.mp4", open("test_edit.mp4", "rb"), "video/mp4")
}

print(f"🚀 Firing request to FastAPI server with {len(raw_cookies)} cookies...")

# 3. Send the POST request
response = requests.post(url, data=payload, files=files)

# 4. Print the result
print("\n" + "="*30)
print(f"Status Code: {response.status_code}")
try:
    print(f"Server Response: {response.json()}")
except Exception:
    print(f"Server Response: {response.text}")
print("="*30 + "\n")
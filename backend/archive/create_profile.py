import requests

# The port we found earlier for your Local API
ADSPOWER_API_URL = "http://127.0.0.1:50325/api/v1/user/create"

def create_user_profile(user_email, target_country, proxy_details):
    print(f"⚙️ Creating {target_country} profile for {user_email}...")

    # This payload mimics exactly what you filled out in the AdsPower GUI
    payload = {
        "name": f"ddonroute_{user_email}",
        "domain_name": "tiktok.com",
        "user_proxy_config": {
            "proxy_soft": "other",
            "proxy_type": "http", # Or socks5
            "proxy_host": proxy_details['host'],
            "proxy_port": proxy_details['port'],
            "proxy_user": proxy_details['username'],
            "proxy_password": proxy_details['password']
        }
    }

    try:
        response = requests.post(ADSPOWER_API_URL, json=payload).json()
        
        if response.get("code") == 0:
            # THIS IS THE GOLDEN KEY! 
            # AdsPower hands you back the unique ID (like 'k1brd6sn')
            profile_id = response["data"]["id"]
            print(f"✅ Success! Profile created with ID: {profile_id}")
            return profile_id
        else:
            print(f"❌ Failed: {response.get('msg')}")
            return None
            
    except Exception as e:
        print(f"❌ API Connection Error: {e}")
        return None

if __name__ == "__main__":
    # Example: A new user signs up and wants to target the UK.
    # You pull a fresh UK proxy from your proxy provider (like Decodo, IPRoyal, etc.)
    new_uk_proxy = {
        "host": "84.10.22.45",
        "port": "10001",
        "username": "user-uk-region",
        "password": "supersecretpassword"
    }
    
    # Run the creation
    new_profile_id = create_user_profile("client@startup.com", "UK", new_uk_proxy)
    
    if new_profile_id:
        print(f"💾 Next step: Save {new_profile_id} to the Postgres database for client@startup.com")

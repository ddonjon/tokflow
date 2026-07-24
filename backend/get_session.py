import json
import os
from camoufox.sync_api import Camoufox

def harvest_cookies_locally():
    print("🚀 Launching Camoufox Stealth Engine for manual login...")
    
    # We use headed mode so you can see the window and log in manually
    with Camoufox(
        headless=False,
        humanize=True,
        os="windows" # Hard-spoofing Windows even though you are on Linux
    ) as browser:
        
        page = browser.new_page()

        print("🎬 Navigating to TikTok...")
        page.goto("https://www.tiktok.com/login", wait_until="domcontentloaded")
        
        print("\n" + "="*50)
        print("🛑 ACTION REQUIRED:")
        print("1. Look at the Firefox window that just opened.")
        print("2. Log into TikTok manually (solve any captchas).")
        print("3. Once you are fully logged in and see the For You feed, come back here.")
        input("👉 PRESS [ENTER] WHEN YOU ARE FULLY LOGGED IN... ")
        print("="*50 + "\n")

        print("🍪 Extracting full session state...")
        # Extract cookies directly from the browser context
        cookies = page.context.cookies()
        
        with open("tiktok_session.json", "w") as f:
            json.dump(cookies, f, indent=4)
            
        print(f"✅ Success! Exported {len(cookies)} cookies to tiktok_session.json")

if __name__ == "__main__":
    harvest_cookies_locally()
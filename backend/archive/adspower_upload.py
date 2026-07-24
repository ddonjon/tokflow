import requests
import time
import sys
from playwright.sync_api import sync_playwright

# --- CONFIG ---
PROFILE_ID = "k1brd6sn" 
VIDEO_FILE = "test_edit.mp4"
CAPTION = "Testing the New York stealth engine! #ddonroute #tech"

def run_upload():
    print(f"🔍 Asking AdsPower to START Profile: {PROFILE_ID}...")
    local_api_url = f"http://127.0.0.1:50325/api/v1/browser/start?user_id={PROFILE_ID}"
    
    try:
        resp = requests.get(local_api_url).json()
    except Exception as e:
        print("❌ Could not connect to AdsPower API. Is the app running?")
        return

    if resp.get("code") != 0:
        print(f"❌ AdsPower Error: {resp.get('msg')}")
        return

    try:
        ws_url = resp["data"]["ws"]["puppeteer"]
    except KeyError:
        print(f"🤖 API Response: {resp}")
        print("❌ CRITICAL: AdsPower didn't provide the WebSocket URL.")
        print("💡 FIX: Ensure the browser is CLOSED in AdsPower before running.")
        return

    with sync_playwright() as p:
        print("📡 Connecting to the New York browser...")
        browser = p.chromium.connect_over_cdp(ws_url)
        
        context = browser.contexts[0]
        page = context.pages[0]

        print("🎬 Navigating directly to TikTok Studio...")
        page.goto("https://www.tiktok.com/tiktokstudio/upload", wait_until="domcontentloaded")
        time.sleep(3) 

        # --- INCORPORATING YOUR ROBUST TIKTOK LOGIC ---
        
        # AGGRESSIVE CSS INJECTION: Hides all common tutorial/portal/overlay elements
        print("Injecting Global CSS overrides...")
        page.add_style_tag(content="""
            [id*='joyride'], [class*='joyride'], [id*='portal'], [class*='overlay'], [class*='modal-mask'] { 
                display: none !important; 
                pointer-events: none !important; 
                visibility: hidden !important;
                opacity: 0 !important;
            }
        """)

        print("📁 Waiting for hidden upload element...")
        # THE FIX: state='attached' tells Playwright it's okay if it's invisible
        page.wait_for_selector('input[type="file"]', state='attached', timeout=30000)
        
        print("📁 Injecting MP4 file into the browser...")
        page.set_input_files('input[type="file"]', VIDEO_FILE)
        
        print("⏳ Video uploading. Waiting for TikTok to process the file...")
        
        try:
            print("Checking for 'Automatic content checks' popup...")
            popup_button = page.locator('button:has-text("Turn on")')
            popup_button.wait_for(state="visible", timeout=10000)
            popup_button.click(force=True)
            print("Popup dismissed successfully!")
        except Exception:
            print("No initial popup appeared, continuing...")

        print("✍️ Waiting for the caption box to load...")
        editor_selector = '.public-DraftEditor-content'
        page.wait_for_selector(editor_selector, timeout=45000)
        
        print("✍️ Typing the caption...")
        # FORCE=TRUE is key here to click through invisible glass
        page.click(editor_selector, click_count=3, force=True)
        page.keyboard.press("Backspace")
        time.sleep(1)

        page.keyboard.type(CAPTION, delay=70)
        
        # Press Space twice to ensure React "sees" the change
        page.keyboard.press("Space")
        page.keyboard.press("Space")
        time.sleep(2)

        print("🎯 Hitting Post...")
        post_button = page.locator('[data-e2e="post_video_button"]')
        post_button.click(force=True)

        try:
            print("Checking for secondary 'Continue to post' popup...")
            post_now_button = page.locator('button:has-text("Post now")')
            post_now_button.wait_for(state="visible", timeout=10000)
            post_now_button.click(force=True)
            print("Clicked 'Post now'!")
        except Exception:
            print("No secondary popup, proceeding...")

       # 10. Success Validation (Strictly Enforced)
        print("📡 Upload triggered! Waiting for strict success confirmation...")
        try:
            # Check 1: Full URL redirect to the content dashboard
            page.wait_for_url("**/tiktokstudio/content**", timeout=15000)
            print("\n🔥 SUCCESS! Redirect detected. Video posted!")
        except Exception:
            try:
                # Check 2: The final success modal appears with the "Manage your posts" button
                page.wait_for_selector('button:has-text("Manage your posts")', timeout=15000)
                print("\n🔥 SUCCESS! Final post-upload modal detected. Video posted!")
            except Exception:
                print("\n⚠️ WARNING: The script finished, but couldn't strictly verify the final state.")

        time.sleep(3) 
        
        # The Python fix: sever the CDP connection cleanly
        browser.close()

if __name__ == "__main__":
    run_upload()
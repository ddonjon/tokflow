import json
import time
from camoufox.sync_api import Camoufox

VIDEO_FILE = "test_edit.mp4"
CAPTION = "Testing Camoufox engine locally! #ddonroute #tech"

def run_local_test():
    print("🚀 Booting Camoufox using injected session...")
    
    with open("tiktok_session.json", "r") as f:
        cookies = json.load(f)

    # Note: We run headed (headless=False) so you can watch it bypass TikTok's bot checks.
    with Camoufox(
        headless=False, 
        humanize=True,
        os="windows"
    ) as browser:
        
        page = browser.new_page()
        
        print("🍪 Injecting harvested cookies...")
        page.context.add_cookies(cookies)

        print("🛡️ Blocking app redirects...")
        page.route("**/*.onelink.me/**", lambda route: route.abort())

        print("🎬 Navigating directly to TikTok Studio...")
        page.goto("https://www.tiktok.com/tiktokstudio/upload", wait_until="domcontentloaded")
        time.sleep(3)

        print("📁 Uploading media...")
        page.wait_for_selector('input[type="file"]', state='attached', timeout=30000)
        page.set_input_files('input[type="file"]', VIDEO_FILE)

        print("✍️ Typing Caption...")
        editor_selector = '.public-DraftEditor-content'
        page.wait_for_selector(editor_selector, timeout=45000)
        page.click(editor_selector, click_count=3, force=True)
        page.keyboard.press("Backspace")
        time.sleep(1)
        
        # Camoufox's humanize=True handles realistic typing delays automatically
        page.keyboard.type(CAPTION)
        time.sleep(2)

        print("⏳ Waiting for video upload to finish...")
        post_btn_selector = '[data-e2e="post_video_button"][data-disabled="false"]'
        page.wait_for_selector(post_btn_selector, state='attached', timeout=90000)

        print("🔍 Waiting for TikTok background checks (Copyright, etc.)...")
        try:
            check_success = page.get_by_text("No issues found.", exact=True).first
            check_success.wait_for(state='visible', timeout=45000)
            print("✅ Copyright checks cleared!")
            time.sleep(2) 
        except Exception:
            print("⚠️ Check confirmation not found. Waiting 10s buffer...")
            time.sleep(10)

        print("🎯 Hitting Post...")
        post_btn = page.locator(post_btn_selector).first
        post_btn.scroll_into_view_if_needed()
        time.sleep(1)
        post_btn.click()
        
        print("⏳ Waiting for success confirmation...")
        try:
            page.wait_for_selector('button:has-text("Manage your posts")', timeout=120000)
            print("🔥 SUCCESS! Post modal detected.")
        except Exception:
            try:
                page.wait_for_url("**/tiktokstudio/content**", timeout=10000)
                print("🔥 SUCCESS! Redirect detected.")
            except Exception:
                print("⚠️ WARNING: Could not verify UI success banner, please check manually.")
        
        time.sleep(5) # Leave it open for 5 seconds so you can see the success state

if __name__ == "__main__":
    run_local_test()
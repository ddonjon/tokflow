import os
import json
import requests

API_BASE_URL = "http://localhost:8000" # Change to http://62.171.186.54:18492 if testing remote VPS
VIDEO_FILE = "test_edit.mp4"
SESSION_FILE = "tiktok_session.json"

def run_pipeline_test():
    print("🚀 STARTING CLOUD PIPELINE TEST...")

    # Verification checks
    if not os.path.exists(VIDEO_FILE):
        print(f"❌ Missing local file: {VIDEO_FILE}")
        return
    if not os.path.exists(SESSION_FILE):
        print(f"❌ Missing session file: {SESSION_FILE}")
        return

    # -------------------------------------------------------------
    # STEP 1: Upload Video to Cloudflare R2 via FastAPI
    # -------------------------------------------------------------
    print("\n[1/2] ☁️ Uploading media to Cloudflare R2...")
    
    with open(VIDEO_FILE, "rb") as f:
        files = {"video": (VIDEO_FILE, f, "video/mp4")}
        r2_response = requests.post(f"{API_BASE_URL}/api/v1/upload-media", files=files)

    if r2_response.status_code != 200:
        print(f"❌ R2 Upload Failed ({r2_response.status_code}): {r2_response.text}")
        return

    r2_data = r2_response.json()
    cloud_video_url = r2_data.get("video_url")
    print(f"✅ Success! Media stored in cloud.")
    print(f"🔗 Presigned R2 URL: {cloud_video_url[:60]}...")

    # -------------------------------------------------------------
    # STEP 2: Trigger TikTok Upload using the R2 Cloud URL
    # -------------------------------------------------------------
    print("\n[2/2] 🤖 Triggering Camoufox Stealth Upload from R2 URL...")

    with open(SESSION_FILE, "r") as f:
        cookies_json_str = json.dumps(json.load(f))

    payload = {
        "video_url": cloud_video_url,
        "caption": "Testing full Cloudflare R2 -> Stealth Upload pipeline! 🚀 #ddonroute #tech",
        "session_cookie": cookies_json_str,
        "proxy_host": "",
        "proxy_port": "",
        "proxy_user": "",
        "proxy_pass": ""
    }

    upload_response = requests.post(f"{API_BASE_URL}/api/v1/upload", data=payload)

    print("\n" + "="*40)
    print(f"Pipeline Result Status: {upload_response.status_code}")
    print(f"Response: {upload_response.json()}")
    print("="*40 + "\n")

if __name__ == "__main__":
    run_pipeline_test()

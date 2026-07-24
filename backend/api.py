import os
import time
import json
import uuid
import requests
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, Form, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from camoufox.sync_api import Camoufox
import boto3
from botocore.exceptions import ClientError
from supabase import create_client, Client
import uvicorn

# Load Environment Variables
load_dotenv()

R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

app = FastAPI(title="Tokflow Core API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://tokkflow.netlify.app/"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase Client
supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("🔐 Supabase Client Initialized")

# Initialize Cloudflare R2 Client
s3_client = None
if R2_ACCOUNT_ID and R2_ACCESS_KEY and R2_SECRET_KEY:
    s3_client = boto3.client(
        service_name="s3",
        endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=R2_ACCESS_KEY,
        aws_secret_access_key=R2_SECRET_KEY,
        region_name="auto"
    )
    print("☁️ Cloudflare R2 Client Initialized")

def run_tiktok_upload(video_path: str, caption: str, cookie_string: str, proxy_url: Optional[str] = None): 
    max_retries = 2
    
    for attempt in range(1, max_retries + 1):
        print(f"\n🚀 [Attempt {attempt}/{max_retries}] Launching Camoufox Stealth Engine...")
        
        camoufox_kwargs = {
            "headless": False,  # Keep this False for now so you can watch it
            "humanize": True,      
            "geoip": True,         
            "os": "windows",       
        }
        
        if proxy_url:
            camoufox_kwargs["proxy"] = {"server": proxy_url}

        try:
            with Camoufox(**camoufox_kwargs) as browser:
                page = None
                try:
                    page = browser.new_page()

                    print("🍪 Injecting auth cookies...")
                    raw_cookies = json.loads(cookie_string)
                    formatted_cookies = []

                    for cookie in raw_cookies:
                        new_cookie = {
                            "name": cookie["name"],
                            "value": cookie["value"],
                            "domain": cookie["domain"],
                            "path": cookie["path"],
                            "secure": cookie.get("secure", False),
                            "httpOnly": cookie.get("httpOnly", False)
                        }
                        if "expirationDate" in cookie:
                            new_cookie["expires"] = cookie["expirationDate"]
                        elif "expires" in cookie:
                            new_cookie["expires"] = cookie["expires"]

                        same_site = cookie.get("sameSite", "").lower()
                        if same_site in ["no_restriction", "none", "unspecified"]:
                            new_cookie["sameSite"] = "None"
                        elif same_site == "lax":
                            new_cookie["sameSite"] = "Lax"
                        elif same_site == "strict":
                            new_cookie["sameSite"] = "Strict"

                        formatted_cookies.append(new_cookie)

                    page.context.add_cookies(formatted_cookies)

                    print("🛡️ Blocking app redirects...")
                    page.route("**/*.onelink.me/**", lambda route: route.abort())

                    print("🎬 Navigating to TikTok Studio...")
                    page.goto("https://www.tiktok.com/tiktokstudio/upload", wait_until="domcontentloaded", timeout=60000)
                    
                    page.add_style_tag(content="""
                        tiktok-cookie-banner, .tiktok-cookie-banner, [id*="cookie-banner"],
                        [role="dialog"], div[class*="modal"], div[class*="dialog"], div[class*="overlay"] { 
                            display: none !important; opacity: 0 !important; pointer-events: none !important; z-index: -9999 !important; 
                        }
                    """)
                    time.sleep(4)

                    for text in ["Cancel", "Got it", "Not now", "Skip"]:
                        try:
                            btn = page.locator(f'button:has-text("{text}")').first
                            if btn.is_visible(timeout=1000):
                                btn.click(force=True)
                                time.sleep(1)
                        except Exception:
                            pass

                    print("📁 Uploading media...")
                    page.wait_for_selector('input[type="file"]', state='attached', timeout=30000)
                    page.set_input_files('input[type="file"]', video_path)

                    print("✍️ Typing Caption...")
                    editor_selector = '.public-DraftEditor-content, [contenteditable="true"]'
                    page.wait_for_selector(editor_selector, timeout=45000)
                    page.click(editor_selector, click_count=3, force=True)
                    page.keyboard.press("Backspace")
                    time.sleep(1)
                    page.keyboard.type(caption)
                    time.sleep(2)

                    print("⏳ Waiting for video upload to complete...")
                    post_btn_selector = '[data-e2e="post_video_button"][data-disabled="false"]'
                    page.wait_for_selector(post_btn_selector, state='attached', timeout=90000)

                    print("🎯 Hitting Post...")
                    post_btn = page.locator(post_btn_selector).first
                    post_btn.click(force=True)
                    
                    time.sleep(5)
                    print("🔥 SUCCESS! Post executed.")
                    
                    return # Exit the function completely on success

                except Exception as inner_e:
                    print(f"\n⚠️ CRASH DETECTED in Attempt {attempt}!")
                    if page:
                        # Create a logs/screenshots directory if it doesn't exist
                        os.makedirs("crash_logs", exist_ok=True)
                        screenshot_path = f"crash_logs/crash_{uuid.uuid4().hex[:8]}.png"
                        print(f"📸 Snapping screenshot of the failure: {screenshot_path}")
                        try:
                            page.screenshot(path=screenshot_path, full_page=True)
                        except Exception as ss_err:
                            print(f"⚠️ Failed to take screenshot: {ss_err}")
                    
                    raise inner_e # Re-raise to trigger the outer retry logic
                    
        except Exception as e:
            print(f"⚠️ AUTOMATION ERROR (Attempt {attempt}): {str(e)}")
            if attempt == max_retries:
                print("❌ Max retries reached. Failing the post permanently.")
                raise e
            else:
                print("🔄 Retrying in 5 seconds with a fresh browser instance...\n")
                time.sleep(5)

# --- ENDPOINT 1: VAULT MEDIA UPLOAD (Cloudflare R2) ---
@app.post("/api/v1/vault/upload")
async def upload_vault_video(video: UploadFile = File(...)):
    if not s3_client or not R2_BUCKET_NAME:
        raise HTTPException(status_code=500, detail="Cloudflare R2 credentials are missing.")

    file_extension = video.filename.split(".")[-1] if "." in video.filename else "mp4"
    unique_key = f"vault/{uuid.uuid4().hex}.{file_extension}"

    try:
        s3_client.upload_fileobj(
            video.file,
            R2_BUCKET_NAME,
            unique_key,
            ExtraArgs={"ContentType": video.content_type or "video/mp4"}
        )
        presigned_url = s3_client.generate_presigned_url(
            'get_object', Params={'Bucket': R2_BUCKET_NAME, 'Key': unique_key}, ExpiresIn=86400
        )
        return {"status": "success", "r2_key": unique_key, "url": presigned_url}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"R2 Vault Upload Failed: {str(e)}")

# --- ENDPOINT 2: GET ACCOUNTS ---
@app.get("/api/v1/accounts")
async def get_accounts():
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured.")
    try:
        response = supabase.table("tiktok_accounts").select("*").execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- ENDPOINT 3: ADD ACCOUNT ---
@app.post("/api/v1/accounts/add")
async def add_account(username: str = Form(...), session_cookie: str = Form(...), platform: str = Form(...), country: str = Form(...)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not configured.")
    try:
        cookie_data = json.loads(session_cookie) if isinstance(session_cookie, str) else session_cookie
        response = supabase.table("tiktok_accounts").insert({
            "account_username": username,
            "session_cookies": cookie_data
        }).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- ENDPOINT 4: DELETE ACCOUNT ---
@app.delete("/api/v1/accounts/{account_id}")
async def delete_account(account_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured.")
    try:
        supabase.table("tiktok_accounts").delete().eq("id", account_id).execute()
        return {"status": "success", "message": "Account deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- ENDPOINT 5: GET POSTS ---
@app.get("/api/v1/posts")
async def get_posts():
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured.")
    try:
        response = supabase.table("posts").select("*").execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- ENDPOINT 6: DELETE POST ---
@app.delete("/api/v1/posts/{post_id}")
async def delete_post(post_id: str):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured.")
    try:
        supabase.table("posts").delete().eq("id", post_id).execute()
        return {"status": "success", "message": "Post cancelled."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- ENDPOINT 7: EDIT POST ---
@app.put("/api/v1/posts/{post_id}")
async def update_post(post_id: str, caption: str = Form(...), scheduled_for: str = Form(...)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured.")
    try:
        supabase.table("posts").update({
            "caption": caption,
            "scheduled_for": scheduled_for
        }).eq("id", post_id).execute()
        return {"status": "success", "message": "Post updated."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- ENDPOINT 8: UPLOAD & SCHEDULE MAIN ---
@app.post("/api/v1/upload")
def handle_dashboard_upload(
    video: Optional[UploadFile] = File(None),
    video_url: Optional[str] = Form(None),
    caption: str = Form(...),
    session_cookie: str = Form(...),
    account_id: str = Form(...),
    video_name: str = Form(...),
    scheduled_for: Optional[str] = Form(None)
):
    if not video and not video_url:
        raise HTTPException(status_code=400, detail="Either video file or video_url must be provided.")

    temp_video_path = f"temp_{uuid.uuid4().hex}.mp4"
    post_id = str(uuid.uuid4())
    status = "scheduled" if scheduled_for else "posted"
    api_status = "success"
    message = "Post executed successfully."

    try:
        if video:
            with open(temp_video_path, "wb+") as f:
                f.write(video.file.read())
        elif video_url:
            res = requests.get(video_url, stream=True, timeout=60)
            res.raise_for_status()
            with open(temp_video_path, "wb+") as f:
                for chunk in res.iter_content(chunk_size=8192):
                    f.write(chunk)

        # Execute upload automation
        run_tiktok_upload(temp_video_path, caption, session_cookie) 

    except Exception as e:
        print(f"❌ Upload crashed: {str(e)}")
        status = "failed"
        api_status = "failed"
        message = str(e)

    finally:
        if os.path.exists(temp_video_path):
            os.remove(temp_video_path)

    # Save post to database regardless of success or failure
    if supabase:
        try:
            supabase.table("posts").insert({
                "id": post_id,
                "account_id": account_id,
                "video_name": video_name,
                "caption": caption,
                "scheduled_for": scheduled_for if scheduled_for else None,
                "status": status
            }).execute()
        except Exception as db_err:
            print(f"⚠️ Database insert skipped/failed: {db_err}")

    # Return 200 OK so the frontend can read the payload and log the history
    return {"status": api_status, "post_id": post_id, "message": message}

   
if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
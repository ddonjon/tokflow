import os
import boto3
from dotenv import load_dotenv

load_dotenv()

bucket_name = os.getenv("R2_BUCKET_NAME")

s3 = boto3.client(
    service_name="s3",
    endpoint_url=f"https://{os.getenv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com",
    aws_access_key_id=os.getenv("R2_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("R2_SECRET_KEY"),
    region_name="auto"
)

try:
    # Test bucket-specific access rather than account-wide listing
    s3.head_bucket(Bucket=bucket_name)
    print(f"✅ Successfully authenticated and connected to R2 bucket '{bucket_name}'!")
except Exception as e:
    print(f"❌ Connection failed: {e}")
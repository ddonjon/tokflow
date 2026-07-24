# Use a lightweight Python base
FROM python:3.11-slim-bullseye

WORKDIR /app

# Install Xvfb (Virtual Framebuffer) and Firefox dependencies
RUN apt-get update && apt-get install -y \
    xvfb \
    libgtk-3-0 \
    libasound2 \
    libx11-xcb1 \
    libdbus-glib-1-2 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download the custom Camoufox binary into the container
RUN camoufox fetch

COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run the API server directly (Camoufox will spawn Xvfb internally when needed)
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
document.getElementById('grabBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  statusDiv.innerText = "Grabbing session...";

  // Query Chrome for all TikTok cookies
  chrome.cookies.getAll({ domain: "tiktok.com" }, function(cookies) {
    if (cookies.length === 0) {
      statusDiv.innerText = "❌ Please log into TikTok in your browser first!";
      return;
    }

    // Convert to JSON
    const jsonString = JSON.stringify(cookies, null, 2);
    
    // Create a Blob and trigger a silent download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    chrome.downloads.download({
      url: url,
      filename: "tiktok_session.json",
      saveAs: false
    });

    statusDiv.style.color = "green";
    statusDiv.innerText = "✅ Session Harvested!";
  });
});

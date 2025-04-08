import subprocess
import re
import os
import platform

def start_cloudflare_tunnel():
    # Skip if running on Render
    if os.environ.get("RENDER", "False") == "True":
        print("🔒 Skipping tunnel start — running on Render.")
        return

    try:
        print("🚀 Starting cloudflared tunnel...")

        # Determine command based on OS
        if platform.system() == "Windows":
            cloudflared_path = r"C:\Program Files (x86)\cloudflared\cloudflared.exe"
        else:
            cloudflared_path = "cloudflared"  # Assumes it's in PATH

        # Start the cloudflared tunnel
        process = subprocess.Popen(
            [cloudflared_path, "tunnel", "--url", "http://localhost:11434"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True
        )

        # Read output line-by-line to find the tunnel URL
        for line in process.stdout:
            print(line.strip())  # Optional: for logging/debugging

            match = re.search(r"https://[a-zA-Z0-9\-]+\.trycloudflare\.com", line)
            if match:
                tunnel_url = match.group(0)

                with open("tunnel_url.txt", "w") as f:
                    f.write(tunnel_url)

                print(f"\n✅ Tunnel started at: {tunnel_url}")
                break

    except Exception as e:
        print(f"❌ Error starting tunnel: {e}")

if __name__ == "__main__":
    start_cloudflare_tunnel()

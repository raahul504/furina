import subprocess
import re
import os

def start_cloudflare_tunnel():
    # Skip tunnel if running on Render
    if os.environ.get("RENDER", "False") == "True":
        print("🔒 Skipping tunnel start — running on Render.")
        return

    try:
        print("🚀 Starting cloudflared tunnel...")

        # Use system-installed cloudflared
        process = subprocess.Popen(
            ["cloudflared", "tunnel", "--url", "http://localhost:11434"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True
        )

        # Read and extract the tunnel URL
        for line in process.stdout:
            print(line.strip())

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

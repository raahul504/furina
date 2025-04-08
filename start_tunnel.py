import subprocess
import re

def start_cloudflare_tunnel():
    try:
        # Start the cloudflared tunnel
        process = subprocess.Popen(
            ["C:\Program Files (x86)\cloudflared\cloudflared.exe", "tunnel", "--url", "http://localhost:11434"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True
        )

        print("Starting tunnel...")

        # Read output line-by-line to find the tunnel URL
        for line in process.stdout:
            print(line.strip())  # Optional: for logging/debugging

            # Look for the URL
            match = re.search(r"https://[a-zA-Z0-9\-]+\.trycloudflare\.com", line)
            if match:
                tunnel_url = match.group(0)

                # Save to file
                with open("tunnel_url.txt", "w") as f:
                    f.write(tunnel_url)

                print(f"\n✅ Tunnel started at: {tunnel_url}")
                break

    except Exception as e:
        print(f"❌ Error starting tunnel: {e}")

if __name__ == "__main__":
    start_cloudflare_tunnel()

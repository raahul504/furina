from flask import Flask, render_template, request, jsonify
import requests
import json
import firebase_admin
from firebase_admin import credentials, firestore, storage
import uuid
import datetime
import os
import subprocess
from collections import defaultdict
import redis

# Load Firebase credentials
firebase_credentials = json.loads(os.environ["FIREBASE_CREDENTIALS"])
cred = credentials.Certificate(firebase_credentials)
firebase_admin.initialize_app(cred, {'storageBucket': os.environ["FIREBASE_STORAGE_BUCKET"]})

# Initialize Firestore database and Firebase Storage
db = firestore.client()
bucket = storage.bucket()

# Redis configuration - adjust URL based on your Redis provider
upstash_redis_url = os.environ.get("UPSTASH_REDIS_REST_URL")
# Check if it's an Upstash REST URL and use appropriate client
if upstash_redis_url and upstash_redis_url.startswith('https://'):
    # Import the required library for Upstash
    from upstash_redis import Redis
    upstash_redis_token = os.environ.get("UPSTASH_REDIS_REST_TOKEN")
    redis_client = Redis(url=upstash_redis_url, token=upstash_redis_token)
else:
    # Standard Redis client for direct connections
    redis_client = redis.from_url(upstash_redis_url or "redis://localhost:6379")

redis_ttl = 7200  # 2 hours in seconds

app = Flask(__name__)

# Configuration for your locally running LLM
LLM_API_URL = "https://ra.furina-tunnel.space/api/chat" # Ollama API endpoint through cloudlfare tunnel
LLM_API_KEY = None  # Add your API key if required

CLERK_API_KEY = os.environ.get("CLERK_API_KEY")
CLERK_FRONTEND_API = os.environ.get("CLERK_FRONTEND_API")
VITE_CLERK_PUBLISHABLE_KEY = os.environ.get("VITE_CLERK_PUBLISHABLE_KEY")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/counselling")
def counselling():
    return render_template("counselling.html")

@app.route("/breathe")
def breathe():
    return render_template("breathing_exercise.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route('/register', methods=['GET'])
def register_page():
    return render_template('register.html')

@app.route('/get-music-files')
def get_music_files():
    blobs = bucket.list_blobs(prefix='music files/')  # get files from audio/ folder
    files = []
    for blob in blobs:
        if not blob.name.endswith('/'):  # skip folder reference
            files.append({
                'title': blob.name.split('/')[-1].rsplit('.', 1)[0].replace('-', ' ').title(),
                'file': blob.generate_signed_url(version="v4", expiration=3600)  # 1 hour expiry
            })
    return jsonify(files)

@app.route('/register', methods=['POST'])
def register():
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    specialization = request.form.get('specialization')
    experience = request.form.get('experience')
    languages = request.form.get('languages')
    availability = request.form.get('availability')
    
    # Handle Photo Upload
    photo = request.files.get('photo')
    if not photo:
        return jsonify({"error": "Photo is required"}), 400

    # Generate unique filename
    photo_filename = f"therapist_images/{uuid.uuid4()}_{photo.filename}"
    blob = bucket.blob(photo_filename)
    blob.upload_from_file(photo, content_type=photo.content_type)

    # Store therapist data in Firestore
    therapist_data = {
        "name": name,
        "email": email,
        "phone": phone,
        "specialization": specialization,
        "experience": experience,
        "languages": languages,
        "availability": availability,
        "photo_path": photo_filename  # Store path instead of direct URL
    }
    db.collection("therapists").add(therapist_data)

    return jsonify({"message": "Therapist registered successfully!"}), 201

@app.route('/unregister', methods=['POST'])
def unregister():
    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    therapists_ref = db.collection("therapists")
    docs = therapists_ref.where("email", "==", email).stream()

    found = False
    for doc in docs:
        therapist = doc.to_dict()
        photo_path = therapist.get("photo_path")  # Get stored image path

        # Delete the therapist's image from Firebase Storage
        if photo_path:
            blob = bucket.blob(photo_path)
            blob.delete()
            print(f"Deleted image: {photo_path}")

        # Delete therapist document from Firestore
        doc.reference.delete()
        found = True

    if found:
        return jsonify({"message": "Unregistered successfully!"}), 200
    else:
        return jsonify({"error": "Therapist not found"}), 404

@app.route('/get_therapists', methods=['GET'])
def get_therapists():
    therapists_ref = db.collection("therapists").stream()
    therapists = []

    for doc in therapists_ref:
        therapist = doc.to_dict()
        photo_path = therapist.get("photo_path")
        
        # Generate a signed URL for the therapist's image
        if photo_path:
            blob = bucket.blob(photo_path)
            signed_url = blob.generate_signed_url(
                expiration=datetime.timedelta(hours=1),  # URL expires in 1 hour
                method='GET'
            )
            therapist["photo_url"] = signed_url

        therapists.append(therapist)
    
    return jsonify(therapists)

# Add this function to log Redis operations - TESTING
def log_redis_operation(operation, key, result=None):
    print(f"REDIS {operation}: {key} => {result}")

# Add these helper functions for Redis conversation management
def get_conversation(session_id):
    """Get conversation from Redis"""
    key = f"conversation:{session_id}"
    data = redis_client.get(key)
    log_redis_operation("GET", key, "Found" if data else "Not found") # TESTING
    if data:
        # Extend TTL on access
        redis_client.expire(key, redis_ttl)
        return json.loads(data)
    return []

def save_conversation(session_id, conversation):
    """Save conversation to Redis with TTL"""
    redis_client.setex(
        f"conversation:{session_id}", 
        redis_ttl,  # 2 hours TTL
        json.dumps(conversation)
    )

def session_exists(session_id):
    """Check if session exists in Redis"""
    return bool(redis_client.exists(f"conversation:{session_id}"))

def safe_redis_operation(operation_func, *args, **kwargs):
    """Execute Redis operation with error handling"""
    try:
        return operation_func(*args, **kwargs)
    except Exception as e:
        print(f"Redis error: {str(e)}")
        # Return appropriate fallback value
        return None

@app.route('/api/system_check', methods=['GET'])
def system_check():
    """Check if Redis connection is working"""
    try:
        # Set a test value
        test_key = "system:check"
        test_value = f"System check at {datetime.datetime.now()}"
        redis_client.setex(test_key, 60, test_value)
        
        # Retrieve the value
        retrieved = redis_client.get(test_key)
        
        if retrieved == test_value:
            return jsonify({
                "status": "ok", 
                "redis": "connected",
                "message": "System is operational"
            })
        else:
            return jsonify({
                "status": "error",
                "redis": "value mismatch",
                "message": "Redis connection exists but values don't match"
            }), 500
            
    except Exception as e:
        return jsonify({
            "status": "error",
            "redis": "disconnected",
            "message": str(e)
        }), 500

# ===== Modified LLM Endpoint with Context =====
@app.route('/api/generate', methods=['POST'])
def generate():
    """Send request to your existing LLM and return the response."""
    data = request.json
    prompt = data.get('prompt', '')
    session_id = data.get('session_id')
    
    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
    
    # Session handling - more robust validation 
    if not session_id:
        session_id = str(uuid.uuid4())
        print(f"\n🔥 New session created: {session_id}") # Testing
    else:
        print(f"\n🔄 Continuing session: {session_id}") # Testing
    
    # Get conversation history from Redis
    conversation = get_conversation(session_id)

    # Add user message to context
    user_message = {"role": "user", "content": prompt}
    conversation.append(user_message)
    
    # Debug print before API call - Testing
    print("\n=== FULL CONVERSATION HISTORY ===")
    for i, msg in enumerate(conversation):
        print(f"{i}. {msg['role'].upper()}: {msg['content']}")
    
    try:
        # Prepare the request for Ollama API
        payload = {
            "model": "furina1.4",
            "messages": conversation,
            "stream": False
        }
        
        print("\n📤 Sending to LLM API:", json.dumps(payload, indent=2)) # Testing

        headers = {
            "Content-Type": "application/json"
        }
        if LLM_API_KEY:
            headers["Authorization"] = f"Bearer {LLM_API_KEY}"
        
        # Send request to your locally running LLM
        response = requests.post(LLM_API_URL, json=payload, headers=headers)
        response_data = response.json()
        
        print("\n📥 Received from LLM:", json.dumps(response_data, indent=2)) # Testing

        if response.status_code == 200:
            assistant_reply = response_data.get('message', {}).get('content', '').strip()
            
            # Store assistant's response
            assistant_message = {"role": "assistant", "content": assistant_reply}
            conversation.append(assistant_message)

            save_conversation(session_id, conversation)
            
            print("\n💾 Updated conversation context:") # Testing
            for i, msg in enumerate(conversation):
                print(f"{i}. {msg['role'].upper()}: {msg['content']}")
            
            return jsonify({
                'response': assistant_reply,
                'session_id': session_id  # Critical for frontend to send back
            })
        else:
            error_msg = f"LLM API Error {response.status_code}"
            if 'error' in response_data:
                error_msg += f": {response_data['error']}"
            print(f"❌ {error_msg}")
            return jsonify({'error': error_msg}), 500
            
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Session Verification Endpoint for TESTING
@app.route('/api/verify_session', methods=['POST'])
def verify_session():
    data = request.json
    session_id = data.get('session_id')
    
    if not session_id:
        return jsonify({'valid': False}), 400
    
    # Check if session exists in Redis
    conversation_json = redis_client.get(f"conversation:{session_id}")
    
    if conversation_json:
        # Session exists, reset TTL
        redis_client.expire(f"conversation:{session_id}", redis_ttl)
        return jsonify({'valid': True})
    else:
        # Session not found
        return jsonify({'valid': False})
    
# In app.py:
@app.route('/api/heartbeat', methods=['POST'])
def heartbeat():
    """Keep session alive"""
    data = request.json
    session_id = data.get('session_id')
    
    if session_id:
        key = f"conversation:{session_id}"
        if redis_client.exists(key):
            # Extend TTL
            redis_client.expire(key, redis_ttl)
            return jsonify({"status": "ok"})
    
    return jsonify({"status": "expired"}), 404

if __name__ == '__main__':
    #print("Starting web server on http://localhost:5000")
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT",5000)),debug=True)
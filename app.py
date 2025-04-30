from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
import json
import firebase_admin
from firebase_admin import credentials, firestore, storage
import uuid
import datetime
import os
import subprocess
from collections import defaultdict

# Load Firebase credentials
firebase_credentials = json.loads(os.environ["FIREBASE_CREDENTIALS"])
cred = credentials.Certificate(firebase_credentials)
firebase_admin.initialize_app(cred, {'storageBucket': os.environ["FIREBASE_STORAGE_BUCKET"]})

# Initialize Firestore database and Firebase Storage
db = firestore.client()
bucket = storage.bucket()

app = Flask(__name__)

app.config.update(
    SESSION_COOKIE_SECURE=True,    # Send cookies only over HTTPS
    SESSION_COOKIE_SAMESITE='Lax', # Basic CSRF protection
    PERMANENT_SESSION_LIFETIME=datetime.timedelta(hours=5)  # Auto-expire
)

CORS(app, supports_credentials=True, origins=[
    "https://your-render-url.onrender.com",
    "http://localhost:5000"  # For local testing
])

# Configuration for your locally running LLM
LLM_API_URL = "https://ra.furina-tunnel.space/api/chat" # Ollama API endpoint through cloudlfare tunnel
LLM_API_KEY = None  # Add your API key if required

# In-memory conversation storage
conversation_contexts = defaultdict(list)  # {session_id: [messages]}

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

@app.route('/register', methods=['POST'])
def register():
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    specialization = request.form.get('specialization')
    experience = request.form.get('experience')
    license_number = request.form.get('license_number', '')
    languages = request.form.get('languages')
    
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
        "license_number": license_number,
        "languages": languages,
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

# ===== Modified LLM Endpoint with Context =====
@app.route('/api/generate', methods=['POST'])
def generate():
    """Send request to your existing LLM and return the response."""
    data = request.json
    prompt = data.get('prompt', '')
    session_id = data.get('session_id')
    
    if not session_id or not prompt:
        return jsonify({'error': 'Missing session_id or prompt'}), 400

    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
    
    # Session handling - more robust validation
    if not session_id or session_id not in conversation_contexts:
        session_id = str(uuid.uuid4())
        conversation_contexts[session_id] = []
        print(f"\n🔥 New session created: {session_id}")
    else:
        print(f"\n🔄 Continuing session: {session_id}")
    
    # Add user message to context
    user_message = {"role": "user", "content": prompt}
    conversation_contexts[session_id].append(user_message)
    
    # Debug print before API call
    print("\n=== FULL CONVERSATION HISTORY ===")
    for i, msg in enumerate(conversation_contexts[session_id]):
        print(f"{i}. {msg['role'].upper()}: {msg['content']}")
    
    try:
        # Prepare the request for Ollama API
        payload = {
            "model": "furina1.4",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "stream": False
        }
        
        print("\n📤 Sending to LLM API:", json.dumps(payload, indent=2))

        headers = {
            "Content-Type": "application/json"
        }
        if LLM_API_KEY:
            headers["Authorization"] = f"Bearer {LLM_API_KEY}"
        
        # Send request to your locally running LLM
        response = requests.post(LLM_API_URL, json=payload, headers=headers)
        response_data = response.json()
        
        print("\n📥 Received from LLM:", json.dumps(response_data, indent=2))

        if response.status_code == 200:
            assistant_reply = response_data.get('message', {}).get('content', '').strip()
            
            # Store assistant's response
            assistant_message = {"role": "assistant", "content": assistant_reply}
            conversation_contexts[session_id].append(assistant_message)
            
            print("\n💾 Updated conversation context:")
            for i, msg in enumerate(conversation_contexts[session_id]):
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

if __name__ == '__main__':
    #print("Starting web server on http://localhost:5000")
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT",5000)),debug=True)
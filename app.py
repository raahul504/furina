from flask import Flask, render_template, request, jsonify
import requests
import json
import firebase_admin
from firebase_admin import credentials, firestore, storage
import uuid
import datetime
import os
import subprocess

# Run the tunnel starter script before anything else
subprocess.run(["python", "start_tunnel.py"])

# Load Firebase credentials
firebase_credentials = json.loads(os.environ["FIREBASE_CREDENTIALS"])
cred = credentials.Certificate(firebase_credentials)
firebase_admin.initialize_app(cred, {'storageBucket': os.environ["FIREBASE_STORAGE_BUCKET"]})

# Initialize Firestore database and Firebase Storage
db = firestore.client()
bucket = storage.bucket()

app = Flask(__name__)

# Load LLM API URL from file (written by tunnel starter script)
def load_llm_api_url():
    try:
        with open("tunnel_url.txt", "r") as f:
            return f.read().strip() + "/api/chat"
    except FileNotFoundError:
        return None

# Configuration for your locally running LLM
LLM_API_URL = load_llm_api_url()  # Ollama API endpoint through cloudlfare tunnel
LLM_API_KEY = None  # Add your API key if required

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

@app.route('/api/generate', methods=['POST'])
def generate():
    """Send request to your existing LLM and return the response."""
    data = request.json
    prompt = data.get('prompt', '')
    
    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400
    
    try:
        # Prepare the request for Ollama API
        payload = {
            "model": "llama3.2",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "stream": False
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        if LLM_API_KEY:
            headers["Authorization"] = f"Bearer {LLM_API_KEY}"
        
        # Send request to your locally running LLM
        response = requests.post(LLM_API_URL, json=payload, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            generated_text = result.get('message', {}).get('content', '')
            return jsonify({'response': generated_text.strip()})
        else:
            error_message = f"LLM API error: {response.status_code}"
            try:
                error_message += f" - {response.json().get('error', '')}"
            except:
                pass
            return jsonify({'error': error_message}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting web server on http://localhost:5000")
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT",5000),debug=True))
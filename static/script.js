// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const micButton = document.getElementById('mic-button');
const statusDiv = document.getElementById('status');
const autoTtsCheckbox = document.getElementById('auto-tts');

// Variables
let recognition;
let isRecording = false;
let speechSynthesis = window.speechSynthesis;
let isSpeaking = false;
let currentUtterance = null;
let voices = [];
let selectedVoice = null;

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        userInput.value = event.results[0][0].transcript;
        statusDiv.textContent = '';
    };

    recognition.onerror = function(event) {
        stopRecording();
        statusDiv.textContent = 'Voice recognition error: ' + event.error;
    };

    recognition.onend = function() {
        stopRecording();
    };
} else {
    micButton.disabled = true;
    micButton.title = "Speech recognition not supported in your browser";
}

// Initialize voice list
function initVoices() {
    voices = speechSynthesis.getVoices();
    
    // Create voice selector if it doesn't exist yet
    if (!document.getElementById('voice-selector') && voices.length > 0) {
        createVoiceSelector();
    }
    
    // Set a default voice (preferably not Microsoft)
    if (voices.length > 0) {
        // Try to find a Google voice first
        let microsoftAvaVoice = voices.find(voice => voice.name.includes("Microsoft Ava Online (Natural) - English (United States)"));
        
        // Otherwise try to find any non-Microsoft voice
        if (!microsoftAvaVoice) {
            microsoftAvaVoice = voices.find(voice => voice.name.includes('Google')) || 
                                voices.find(voice => !voice.name.includes('Microsoft')) || 
                                voices[0];
        }
        
        // If nothing else, use the first voice
        selectedVoice = microsoftAvaVoice || voices[0];
        
        // Update selector if it exists
        const selector = document.getElementById('voice-selector');
        if (selector) {
            selector.value = selectedVoice.name;
        }
    }
}

/* Create voice selector (old one, does not work with new UI)
function createVoiceSelector() {
    const ttsContainer = document.getElementById('tts-toggle');
    
    // Create selector container
    const selectorContainer = document.createElement('div');
    selectorContainer.style.marginLeft = '20px';
    selectorContainer.style.display = 'flex';
    selectorContainer.style.alignItems = 'center';
    selectorContainer.style.color = '';
    
    // Create label
    const label = document.createElement('label');
    label.textContent = 'Voice: ';
    label.style.marginRight = '5px';
    
    // Create select element
    const selector = document.createElement('select');
    selector.id = 'voice-selector';
    selector.style.padding = '5px';
    selector.style.borderRadius = '4px';
    
    // Add voices to selector
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        selector.appendChild(option);
    });
    
    // Set initial value if selected voice exists
    if (selectedVoice) {
        selector.value = selectedVoice.name;
    }
    
    // Add change event listener
    selector.addEventListener('change', function() {
        selectedVoice = voices.find(voice => voice.name === this.value);
    });
    
    // Add elements to container
    selectorContainer.appendChild(label);
    selectorContainer.appendChild(selector);
    
    // Add container to TTS container
    ttsContainer.appendChild(selectorContainer);
}*/

// Create voice selector for new UI
function createVoiceSelector() {
    const ttsContainer = document.getElementById('voice-settings');
    
    // Create label
    const label = document.createElement('label');
    label.textContent = 'Voice: ';
    label.style.marginRight = '5px';
    
    // Create select element
    const selector = document.createElement('select');
    selector.id = 'voice-selector';
    
    // Add voices to selector
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        selector.appendChild(option);
    });
    
    // Set initial value if selected voice exists
    if (selectedVoice) {
        selector.value = selectedVoice.name;
    }
    
    // Add change event listener
    selector.addEventListener('change', function() {
        selectedVoice = voices.find(voice => voice.name === this.value);
    });
    
    // Add elements to container
    ttsContainer.appendChild(label);
    ttsContainer.appendChild(selector);
}

// Toggle Recording
function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    if (recognition) {
        try {
            recognition.start();
            isRecording = true;
            micButton.classList.add('recording');
            statusDiv.textContent = 'Listening...';
        } catch (e) {
            statusDiv.textContent = 'Error starting voice recognition.';
        }
    }
}

function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        micButton.classList.remove('recording');
    }
}

// Stop speaking function
function stopSpeaking() {
    if (isSpeaking) {
        speechSynthesis.cancel();
        isSpeaking = false;
        
        // Update all buttons to normal state
        const speechButtons = document.querySelectorAll('.speech-button');
        speechButtons.forEach(button => {
            button.textContent = '🔊';
            button.style.backgroundColor = 'transparent';
        });
    }
}

// Speak Text
function speakText(text) {
    // If already speaking, stop it first
    if (isSpeaking) {
        stopSpeaking();
        return; // Exit if we were already speaking (this makes the button toggle)
    }

    text = text.replace(/[🔊⏹️*_`~]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set the selected voice if available
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    // Customize voice parameters
    utterance.rate = 1.0;  // Speed: 0.1 to 10
    utterance.pitch = 1.0; // Pitch: 0 to 2
    utterance.volume = 1.0; // Volume: 0 to 1
    
    utterance.onend = () => {
        isSpeaking = false;
        // Reset button appearance
        const speechButtons = document.querySelectorAll('.speech-button');
        speechButtons.forEach(button => {
            button.textContent = '🔊';
            button.style.backgroundColor = 'transparent';
        });
    };

    isSpeaking = true;
    speechSynthesis.speak(utterance);

    // Update the clicked button to show it's active
    event.target.textContent = '⏹️';
    event.target.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    
    // Add keyboard listener for Escape key
    document.addEventListener('keydown', function escapeKeyHandler(e) {
        if (e.key === 'Escape') {
            stopSpeaking();
            document.removeEventListener('keydown', escapeKeyHandler);
        }
    });
}

// Add document click handler to stop speech when clicking elsewhere
document.addEventListener('click', function(event) {
    const chatContainer = document.querySelector('.chat-container');
    // Only stop speaking if the click is outside the chat container
    // and not on a speech button
    if (!chatContainer.contains(event.target) && 
        !event.target.classList.contains('speech-button')) {
        stopSpeaking();
    }
});

// Make sure speech stops when sending a new message
document.getElementById('send-button').addEventListener('click', function() {
    stopSpeaking();
});

// Stop speaking when the mic button is clicked
document.getElementById('mic-button').addEventListener('click', function () {
    stopSpeaking();
});

function splitIntoLines(text) {
    const lines = text.split('\n');
    const lineElements = [];

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed.length === 0) {
            // Empty line = paragraph break
            const br = document.createElement('br');
            // Add two <br> if you want even more space
            lineElements.push(br);
            lineElements.push(document.createElement('br')); // Uncomment for double space
        }

        // If it starts with a number like "1. " or a bullet "* ", add a line break
        if (/^\d+\.\s/.test(trimmed) || /^\*\s/.test(trimmed) || /^\•\s/.test(trimmed)) {
            const div = document.createElement('div');
            div.textContent = trimmed;
            lineElements.push(div);
        } else if (trimmed) {
            const span = document.createElement('span');
            span.textContent = trimmed;
            lineElements.push(span);
        }
    }

    return lineElements;
}

// Trigger phrases
const SAFETY_TRIGGER_PHRASES = [
    'kill myself', 'end my life', 'suicide', 'want to die', 'self harm', 'hurt myself', 'no reason to live', 'jump off', 'overdose', 'dont want to live', 'done with life'
];

// Function to check messages
function checkForSafetyConcerns(message) {
    const lowerMsg = message.toLowerCase();
    return SAFETY_TRIGGER_PHRASES.some(phrase => lowerMsg.includes(phrase));
}

// Emergency response message template
const SAFETY_RESPONSE = `⚠️ I'm really concerned about what you're sharing. 
You're not alone, and there are people who want to help:

🌎 International Help: 
- Befrienders Worldwide: befrienders.org
- International Suicide Hotlines: suicide.org

💙 Please reach out to someone who can help right now. 
Your life matters deeply.`

// Helper functions
function showEmergencyResources() {
    const panel = document.getElementById('emergency-resources');
    if (panel) panel.style.display = 'block';
    
    // Auto-scroll to make visible
    panel?.scrollIntoView({ behavior: 'smooth' });
}

function hideEmergencyResources() {
    safetyWarningCount = 0;
    // Optional: Hide or tone down the alerts
    const panel = document.getElementById('emergency-resources');
    if (panel) panel.style.display = 'none';
}

// Add session ID tracking
let currentSessionId = null;

// Add Message to Chat
function addMessage(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');

    // Add red border to concerning user messages
    if (isUser && checkForSafetyConcerns(content)) {
        messageDiv.classList.add('user-safety-concern');
    }

    if (isUser) {
        messageDiv.textContent = content;
    } else {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'flex-start';
        wrapper.style.gap = '8px';

        // Line-formatted text container
        const textContainer = document.createElement('div');
        const lineElements = splitIntoLines(content);
        lineElements.forEach(el => textContainer.appendChild(el));
        wrapper.appendChild(textContainer);

        // Speech button
        const speechButton = document.createElement('button');
        speechButton.classList.add('speech-button');
        speechButton.textContent = '🔊';
        speechButton.onclick = function () {
            speakText(content);
        };
        wrapper.appendChild(speechButton);

        messageDiv.appendChild(wrapper);

        // Auto TTS
        if (autoTtsCheckbox.checked) {
            setTimeout(() => {
                speakText(content);
                speechButton.textContent = '⏹️';
                speechButton.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            }, 100);
        }
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add session verification function
async function verifySession(sessionId) {
    try {
        const response = await fetch('/api/verify_session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId })
        });
        
        const data = await response.json();
        return data.valid;
    } catch (error) {
        console.error('Session verification error:', error);
        return false;
    }
}

// Optional: Load session from sessionStorage on page load
document.addEventListener('DOMContentLoaded', async () => {
    const savedSessionId = sessionStorage.getItem('llm_session_id');
    if (savedSessionId) {
        // Verify session exists on server
        const isValid = await verifySession(savedSessionId);
        if (isValid) {
            currentSessionId = savedSessionId;
            console.log('Resumed session:', currentSessionId);
        } else {
            // Session not found on server (expired or server restarted)
            sessionStorage.removeItem('llm_session_id');
            currentSessionId = null;
            console.log('Previous session not found on server');
        }
    }
});

// Send Message to Backend
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    userInput.value = '';

    // Safety check - intercept before sending to LLM
    if (checkForSafetyConcerns(message)) {
        addMessage(SAFETY_RESPONSE, false);
        
        // Optional: Auto-show resources panel
        showEmergencyResources();
        return; // Skip normal LLM processing
    }

    try {
        // Prepare request payload with session ID if available
        const payload = {
            prompt: message,
            session_id: currentSessionId  // Include current session ID if exists
        };

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // Store the session ID for subsequent requests
        if (data.session_id) {
            currentSessionId = data.session_id;
            
            // Optional: Store in sessionStorage to persist across page refreshes
            sessionStorage.setItem('llm_session_id', data.session_id);
        }

        addMessage(data.response, false);
    } catch (error) {
        addMessage(`Error: ${error.message}`, false);
        console.error('API Error:', error);
    }
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        stopSpeaking();
        sendMessage();
    }
});
micButton.addEventListener('click', toggleRecording);

// Initialize voices
// The voices are loaded asynchronously, so we need to handle that
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = initVoices;
}

// Initialize voices immediately in case they're already loaded
initVoices();

// In your frontend script.js:
function sendHeartbeat() {
    if (currentSessionId) {
        fetch('/api/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: currentSessionId })
        });
    }
}

// Send heartbeat every 5 minutes
setInterval(sendHeartbeat, 300000);
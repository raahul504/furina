// User Onboarding Guide for Furina Companion

document.addEventListener('DOMContentLoaded', function() {
    // Create the night mode toggle button
    createHelpButton();
});
// Create night mode toggle button
function createHelpButton() {
    // Create the button element
    const helpBtn = document.createElement('button');
    helpBtn.id = 'helpBtn';
    helpBtn.title = 'Tutorial';
    helpBtn.innerHTML = '❔';
    
    // Set the styles directly as specified
    helpBtn.style.position = 'fixed';
    helpBtn.style.bottom = '20px';
    helpBtn.style.left = '20px';
    helpBtn.style.zIndex = '9999';
    //helpBtn.style.background = 'rgba(0,0,0,0.5)';
    helpBtn.style.color = 'white';
    helpBtn.style.border = 'none';
    helpBtn.style.borderRadius = '8px';
    helpBtn.style.padding = '10px 10px';
    helpBtn.style.cursor = 'pointer';
    helpBtn.style.fontSize = '14px';
    
    // Add it to the body
    document.body.appendChild(helpBtn);

    // Add click event
    helpBtn.addEventListener('click', onboardingTour.start);
}

const onboardingTour = (function() {
    // Tour steps configuration - each step highlights a specific feature
    const tourSteps = [
        {
            title: 'Welcome to Furina Companion',
            content: 'Your mental health support chatbot. Let me show you around so you can get the most out of our services.',
            position: 'bottom',
            highlightType: 'pointer'
        },
        {
            element: '.chat-container',
            title: 'Chat with Furina',
            content: 'This is where you can chat with Furina, your AI companion. Share your thoughts, feelings, or ask for support here.',
            position: 'left',
            highlightType: 'standard'
        },
        {
            element: '.voice-container',
            title: 'Voice Settings',
            content: 'You can enable auto-speak to have Furina read responses aloud and select your preferred voice.',
            position: 'top',
            highlightType: 'standard'
        },
        {
            element: '.navbar a[href*="counselling"]',
            title: 'Professional Support',
            content: 'Connect with professional therapists specialized in different areas of mental health.',
            position: 'bottom',
            highlightType: 'pointer'
        },
        {
            element: '.navbar a[href*="breathe"]',
            title: 'Breathing Exercises',
            content: 'Practice guided breathing exercises to reduce stress and anxiety.',
            position: 'bottom',
            highlightType: 'pointer'
        },
        {
            element: '.nav-music-btn',
            title: 'Music Player',
            content: 'Access calming music tracks to help with relaxation and focus.',
            position: 'bottom',
            highlightType: 'pointer'
        },
        {
            element: '.quiz-floating-btn',
            title: 'Mental Health Assessment',
            content: 'Take our mental health assessment to receive personalized support recommendations.',
            position: 'left',
            highlightType: 'standard'
        },
    ];

    // HTML structure for the tour overlay
    const tourOverlayHTML = `
        <div id="tour-overlay" class="tour-overlay">
            <div class="tour-popup">
                <div class="tour-header">
                    <h3 id="tour-title">Welcome</h3>
                    <button id="tour-close" style="padding: 1px 6px;">×</button>
                </div>
                <div id="tour-content" class="tour-content">Content here</div>
                <div class="tour-footer">
                    <span id="tour-progress">1/${tourSteps.length}</span>
                    <div class="tour-buttons">
                        <button id="tour-prev" disabled>Previous</button>
                        <button id="tour-next">Next</button>
                        <button id="tour-skip">Skip Tour</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // CSS for the tour - improved with both light and dark mode compatibility
    const tourStylesHTML = `
        <style>
            .tour-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: background-color 1s ease-in-out;
            }
            
            /* Light Mode Tour Popup (Default) */
            .tour-popup {
                background: rgb(243, 212, 252); /* Light background color */
                border-radius: 8px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                max-width: 400px;
                width: 90%;
                color: #333;
                transition: background-color 1s ease-in-out, color 1s ease-in-out;
                border: 1px solid rgba(0, 0, 0, 0.1);
            }

            .tour-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
                transition: border-color 1s ease-in-out;
            }

            .tour-header h3 {
                margin: 0;
                color: #333;
                font-size: 18px;
                transition: color 1s ease-in-out;
                font-weight: 600;
            }

            #tour-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #777;
                transition: color 1s ease-in-out;
            }

            #tour-close:hover {
                color: rgb(171, 161, 231); /* Matches your hover color */
            }

            .tour-content {
                padding: 20px;
                line-height: 1.5;
                color: #333; /* Darker text color to match your palette */
                transition: color 1s ease-in-out;
            }
            
            .tour-footer {
                padding: 15px 20px;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: border-color 1s ease-in-out;
            }
            
            #tour-progress {
                color: #777;
                font-size: 14px;
                transition: color 1s ease-in-out;
            }
            
            .tour-buttons {
                display: flex;
                gap: 10px;
            }
            
            .tour-buttons button {
                padding: 8px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
            }

            #tour-prev, #tour-skip {
                background-color: rgba(0, 0, 0, 0.1);
                color: #333; /* Darker text for better contrast */
            }

            #tour-next {
                background-color: #8c7bf0; /* Matches your accent color */
                color: white;
            }

            #tour-next:hover {
                background-color: #8c7bf0;
                box-shadow: 0 2px 8px rgba(228, 156, 75, 0.4);
            }
            
            #tour-prev:hover, #tour-skip:hover {
                background-color: rgba(0, 0, 0, 0.2);
            }
            
            #tour-prev:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            /* Fixed highlight element styling - with two different types */
            .highlight-element {
                position: relative;
                transition: all 0.3s ease-in-out;
            }
            
            /* Standard highlight that preserves layout */
            .highlight-standard {
                z-index: 1000;
                outline: 4px solid #8c7bf0; !important; /* Matches your accent color */
                outline-offset: 2px;
                border-radius: 4px;
            }
            
            /* Pointer highlight for navbar elements that doesn't affect layout */
            .highlight-pointer {
                /* No z-index change to prevent layout disruption */
                position: relative;
            }
            
            /* Arrow pointer for navbar elements */
            .highlight-pointer:after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid #8c7bf0;; /* Matches your accent color */
            }
            
            /* Create a separate overlay instead of using box-shadow */
            .highlight-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 999; /* Below highlighted elements but above regular content */
                pointer-events: none; /* Let clicks pass through */
            }
            
            /* Night mode compatibility - matches the night-mode.css approach */
            body.night-mode .tour-popup,
            .preload-night-mode body .tour-popup {
                background: rgba(22, 28, 36, 0.95);
                color: #e0e0e0;
                border: 1px solid rgba(160, 216, 255, 0.3);
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
            }
            
            body.night-mode .tour-header,
            .preload-night-mode body .tour-header {
                border-bottom: 1px solid rgba(160, 216, 255, 0.2);
            }
            
            body.night-mode .tour-header h3,
            .preload-night-mode body .tour-header h3 {
                color: #a0d8ff;
            }
            
            body.night-mode #tour-close,
            .preload-night-mode body #tour-close {
                color: #a0d8ff;
            }
            
            body.night-mode #tour-close:hover,
            .preload-night-mode body #tour-close:hover {
                color: #e49c4b;
            }
            
            body.night-mode .tour-content,
            .preload-night-mode body .tour-content {
                color: #e0e0e0;
            }
            
            body.night-mode .tour-footer,
            .preload-night-mode body .tour-footer {
                border-top: 1px solid rgba(160, 216, 255, 0.2);
            }
            
            body.night-mode #tour-progress,
            .preload-night-mode body #tour-progress {
                color: #a0d8ff;
            }
            
            body.night-mode #tour-prev,
            body.night-mode #tour-skip,
            .preload-night-mode body #tour-prev,
            .preload-night-mode body #tour-skip {
                background: rgba(38, 50, 72, 0.7);
                color: #e0e0e0;
                border: 1px solid rgba(160, 216, 255, 0.2);
            }
            
            body.night-mode #tour-prev:hover,
            body.night-mode #tour-skip:hover,
            .preload-night-mode body #tour-prev:hover,
            .preload-night-mode body #tour-skip:hover {
                background: rgba(38, 50, 72, 0.9);
            }
            
            body.night-mode #tour-next,
            .preload-night-mode body #tour-next {
                background: #e49c4b;
                color: #1a1a1a;
                border: 1px solid rgba(228, 156, 75, 0.7);
            }
            
            body.night-mode #tour-next:hover,
            .preload-night-mode body #tour-next:hover {
                background: #f5ad5d;
                box-shadow: 0 2px 8px rgba(228, 156, 75, 0.6);
            }
            
            /* Night mode highlighted elements */
            body.night-mode .highlight-standard,
            .preload-night-mode body .highlight-standard {
                outline: 4px solid #a0d8ff !important;
            }
            
            body.night-mode .highlight-pointer:after,
            .preload-night-mode body .highlight-pointer:after {
                border-top: 8px solid #a0d8ff;
            }
            
            #reset-tour-btn {
                position: fixed;
                bottom: 70px;
                right: 20px;
                padding: 10px 15px;
                font-size: 14px;
                cursor: pointer;
                border-radius: 8px;
                transition: all 0.3s ease-in-out;
                z-index: 9998;
                background-color: #fffcf4; /* Match your container bg */
                color: #333;
                border: 1px solid rgba(0, 0, 0, 0.1);
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            #reset-tour-btn:hover {
                background-color: #fff;
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                transform: translateY(-2px);
            }
            
            /* Restart Tour Button - Night Mode */
            body.night-mode #reset-tour-btn,
            .preload-night-mode body #reset-tour-btn {
                background-color: rgba(38, 50, 72, 0.8);
                color: #e0e0e0;
                border: 1px solid rgba(160, 216, 255, 0.3);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
            
            body.night-mode #reset-tour-btn:hover,
            .preload-night-mode body #reset-tour-btn:hover {
                background-color: rgba(38, 50, 72, 0.95);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            }
        </style>
    `;

    let currentStep = 0;
    let currentHighlightedElement = null;
    let highlightOverlay = null;

    // Function to check if this is the user's first visit
    function isFirstVisit() {
        return sessionStorage.getItem('furinaTourCompleted') !== 'true';
    }

    // Initialize the tour
    function init() {
        // Always add styles and reset button, even if tour doesn't run automatically
        document.head.insertAdjacentHTML('beforeend', tourStylesHTML);
        
        // Check if user should see the tour (first visit)
        if (isFirstVisit()) {
            startTour();
        }
    }
    
    // Start the tour
    function startTour() {
        // Add tour overlay to the document
        document.body.insertAdjacentHTML('beforeend', tourOverlayHTML);
        
        // Create the highlight overlay
        highlightOverlay = document.createElement('div');
        highlightOverlay.className = 'highlight-overlay';
        document.body.appendChild(highlightOverlay);
        
        // Set up event listeners
        document.getElementById('tour-close').addEventListener('click', endTour);
        document.getElementById('tour-prev').addEventListener('click', prevStep);
        document.getElementById('tour-next').addEventListener('click', nextStep);
        document.getElementById('tour-skip').addEventListener('click', endTour);
        
        // Listen for night mode changes
        document.addEventListener('nightModeChanged', function() {
            // Force update the tour popup styles when night mode changes
            const tourPopup = document.querySelector('.tour-popup');
            if (tourPopup) {
                // This forces a repaint which helps transitions to apply correctly
                void tourPopup.offsetWidth;
            }
        });
        
        // Start with the first step
        showStep(0);
    }

    // Display a specific step
    function showStep(stepIndex) {
        // Remove highlight from previous element
        if (currentHighlightedElement) {
            currentHighlightedElement.classList.remove('highlight-element');
            currentHighlightedElement.classList.remove('highlight-standard');
            currentHighlightedElement.classList.remove('highlight-pointer');
        }
        
        // Get the current step data
        const step = tourSteps[stepIndex];
        
        // Update the title and content
        document.getElementById('tour-title').textContent = step.title;
        document.getElementById('tour-content').textContent = step.content;
        document.getElementById('tour-progress').textContent = `${stepIndex + 1}/${tourSteps.length}`;
        
        // Update buttons
        document.getElementById('tour-prev').disabled = stepIndex === 0;
        
        // Change "Next" to "Finish" on last step
        const nextButton = document.getElementById('tour-next');
        if (stepIndex === tourSteps.length - 1) {
            nextButton.textContent = 'Finish';
        } else {
            nextButton.textContent = 'Next';
        }
        
        // Highlight the target element
        const targetElement = document.querySelector(step.element);
        if (targetElement) {
            // Make sure the overlay is showing
            if (highlightOverlay) {
                highlightOverlay.style.display = 'block';
            }
            
            // Add appropriate highlight to the target element
            targetElement.classList.add('highlight-element');
            
            // Apply the specific highlight type
            const highlightType = step.highlightType || 'standard';
            targetElement.classList.add(`highlight-${highlightType}`);
            
            currentHighlightedElement = targetElement;
            
            // Position the tour popup relative to the highlighted element
            positionPopup(targetElement, step.position);
            
            // Special handling for navbar elements to prevent displacement
            if (step.element.includes('.navbar') || targetElement.closest('.navbar')) {
                // Don't scroll for navbar elements, just position the popup
                positionPopupForNavbar(targetElement, step.position);
            } else {
                // For non-navbar elements, scroll into view if needed
                const rect = targetElement.getBoundingClientRect();
                const isInView = (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
                
                if (!isInView) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        }
        
        // Update current step
        currentStep = stepIndex;
    }
    
    // Position the popup relative to the highlighted element (standard elements)
    function positionPopup(element, position) {
        const popup = document.querySelector('.tour-popup');
        const elementRect = element.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        
        // Reset the position to center (default)
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        
        // Adjust based on requested position
        switch(position) {
            case 'top':
                popup.style.top = (elementRect.top - popupRect.height - 20) + 'px';
                popup.style.left = (elementRect.left + elementRect.width/2) + 'px';
                popup.style.transform = 'translateX(-50%)';
                break;
                
            case 'bottom':
                popup.style.top = (elementRect.bottom + 20) + 'px';
                popup.style.left = (elementRect.left + elementRect.width/2) + 'px';
                popup.style.transform = 'translateX(-50%)';
                break;
                
            case 'left':
                popup.style.top = (elementRect.top + elementRect.height/2) + 'px';
                popup.style.left = (elementRect.left - popupRect.width - 20) + 'px';
                popup.style.transform = 'translateY(-50%)';
                break;
                
            case 'right':
                popup.style.top = (elementRect.top + elementRect.height/2) + 'px';
                popup.style.left = (elementRect.right + 20) + 'px';
                popup.style.transform = 'translateY(-50%)';
                break;
        }
        
        // Ensure the popup stays within viewport boundaries
        const popupNewRect = popup.getBoundingClientRect();
        
        // Check if popup goes outside the viewport
        if (popupNewRect.top < 20) {
            popup.style.top = '20px';
            popup.style.transform = popup.style.transform.replace('translateY(-50%)', '');
        }
        
        if (popupNewRect.bottom > window.innerHeight - 20) {
            popup.style.top = (window.innerHeight - popupNewRect.height - 20) + 'px';
            popup.style.transform = popup.style.transform.replace('translateY(-50%)', '');
        }
        
        if (popupNewRect.left < 20) {
            popup.style.left = '20px';
            popup.style.transform = popup.style.transform.replace('translateX(-50%)', '');
        }
        
        if (popupNewRect.right > window.innerWidth - 20) {
            popup.style.left = (window.innerWidth - popupNewRect.width - 20) + 'px';
            popup.style.transform = popup.style.transform.replace('translateX(-50%)', '');
        }
    }
    
    // Special positioning for navbar elements to prevent displacement
    function positionPopupForNavbar(element, position) {
        const popup = document.querySelector('.tour-popup');
        const elementRect = element.getBoundingClientRect();
        const navbarRect = document.querySelector('.navbar').getBoundingClientRect();
        
        // For navbar elements, always position below the navbar
        popup.style.position = 'fixed';
        popup.style.top = (navbarRect.bottom + 20) + 'px';
        popup.style.left = (elementRect.left + elementRect.width/2) + 'px';
        popup.style.transform = 'translateX(-50%)';
        
        // Ensure the popup stays within viewport boundaries for x-axis
        const popupRect = popup.getBoundingClientRect();
        
        if (popupRect.left < 20) {
            popup.style.left = '20px';
            popup.style.transform = '';
        }
        
        if (popupRect.right > window.innerWidth - 20) {
            popup.style.left = (window.innerWidth - popupRect.width - 20) + 'px';
            popup.style.transform = '';
        }
    }

    // Go to the next step
    function nextStep() {
        if (currentStep < tourSteps.length - 1) {
            showStep(currentStep + 1);
        } else {
            endTour(); // End tour on last step
        }
    }

    // Go to the previous step
    function prevStep() {
        if (currentStep > 0) {
            showStep(currentStep - 1);
        }
    }

    // End the tour
    function endTour() {
        // Remove highlight from any element
        if (currentHighlightedElement) {
            currentHighlightedElement.classList.remove('highlight-element');
            currentHighlightedElement.classList.remove('highlight-standard');
            currentHighlightedElement.classList.remove('highlight-pointer');
        }
        
        // Remove the tour overlay
        const tourOverlay = document.getElementById('tour-overlay');
        if (tourOverlay) {
            tourOverlay.remove();
        }
        
        // Remove the highlight overlay
        if (highlightOverlay) {
            highlightOverlay.remove();
        }
        
        // Mark the tour as completed
        sessionStorage.setItem('furinaTourCompleted', 'true');
    }

    // Reset the tour (for testing or if user wants to see it again)
    function resetTour() {
        sessionStorage.removeItem('furinaTourCompleted');
    }

    // Public API
    return {
        init: init,
        reset: resetTour,
        start: startTour
    };
})();

// Initialize the tour when the page is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a moment to allow the page to render fully
    setTimeout(function() {
        onboardingTour.init();
    }, 1500);
});
function startOnboarding() {
    onboardingTour.start(); // Use your custom tour
}

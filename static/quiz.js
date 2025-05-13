// Enhanced Quiz Module
const quizModule = (function() {
    // Quiz Variables
    let currentQuestion = 0;
    let answers = [];
    
    const quizQuestions = [
        {
            question: "During the past two weeks, how often have you felt little interest or pleasure in doing things that you usually enjoy?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you felt down, depressed, or hopeless?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you had trouble falling or staying asleep, or sleeping too much?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you felt tired or had little energy?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you had a poor appetite or been overeating?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you felt bad about yourself—or that you are a failure or have let yourself or your family down?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you had trouble concentrating on things, such as reading or watching TV?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you been moving or speaking so slowly that other people could have noticed? Or the opposite—being so fidgety or restless that you have been moving around a lot more than usual?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you felt nervous, anxious, or on edge?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you been unable to stop or control worrying?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you worried too much about different things?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you had trouble relaxing?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you been so restless that it's hard to sit still?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you become easily annoyed or irritable?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "During the past two weeks, how often have you felt afraid, as if something awful might happen?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ]
        },
        {
            question: "How would you rate your ability to cope with stress in your daily life?",
            options: [
                "Very good - I handle stress well most of the time",
                "Good - I manage stress adequately",
                "Fair - I struggle with stress sometimes",
                "Poor - I often feel overwhelmed by stress"
            ]
        },
        {
            question: "How would you describe your social support network (friends, family, community)?",
            options: [
                "Very strong - Many people I can rely on",
                "Good - Several people I can count on",
                "Limited - Few people I can turn to",
                "Very limited - I feel isolated most of the time"
            ]
        },
        {
            question: "How often do you engage in activities that you find meaningful or enjoyable?",
            options: [
                "Daily or almost daily",
                "Several times a week",
                "Once a week or less",
                "Rarely or never"
            ]
        },
        {
            question: "How would you rate your overall physical health at present?",
            options: [
                "Excellent",
                "Good",
                "Fair",
                "Poor"
            ]
        },
        {
            question: "In the past 2 weeks, have you had thoughts that you would be better off dead or of hurting yourself in some way?",
            options: [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ],
            critical: true
        }
    ];

    // Recommendations based on assessment level - enhanced with more specific and professional recommendations
    const recommendations = {
    "Good": [
        "Continue practicing self-care routines that support your mental wellbeing",
        "Consider incorporating mindfulness or meditation practices into your daily routine",
        "Maintain your social connections and supportive relationships",
        "Engage in regular physical activity (aim for 150 minutes per week)",
        "Stay consistent with healthy sleep patterns (7-9 hours nightly)",
        "Make time for activities that bring you joy and fulfillment",
        "Practice gratitude regularly by noting positive experiences",
        "Consider an annual mental health check-in as preventative care"
    ],
    "Mild Concern": [
        "Consider speaking with a trusted friend or family member about how you're feeling",
        "Establish a consistent sleep schedule to improve your rest quality",
        "Incorporate regular physical activity into your routine (even short walks can help)",
        "Try structured relaxation techniques like deep breathing or progressive muscle relaxation",
        "Limit alcohol, caffeine and processed foods which can affect mood",
        "Explore guided meditation apps like Headspace, Calm, or Insight Timer",
        "Set small, achievable goals to build confidence and momentum",
        "Consider scheduling a check-in with your primary care physician",
        "Try journaling to track your moods and identify patterns or triggers"
    ],
    "Moderate Concern": [
        "Consider reaching out to a mental health professional for an evaluation",
        "Establish a consistent daily routine with regular sleep, meal, and activity times",
        "Practice evidence-based relaxation techniques such as deep breathing or progressive muscle relaxation",
        "Be mindful of news and social media consumption that may increase anxiety",
        "Set boundaries in work and personal relationships to manage stress",
        "Explore support groups related to your specific concerns",
        "Try cognitive behavioral techniques to identify and challenge negative thought patterns",
        "Consider whether workplace accommodations might be helpful",
        "Prioritize physical exercise, even if it's just a short daily walk",
        "Develop a self-care plan with specific steps to take when symptoms intensify"
    ],
    "Significant Concern": [
        "Please consider speaking with a mental health professional as soon as possible",
        "Contact your primary care physician to discuss your symptoms and treatment options",
        "If you're experiencing thoughts of self-harm, contact a crisis helpline immediately (988 in the US)",
        "Focus on basic self-care: regular meals, hydration, sleep, and gentle movement",
        "Use grounding techniques when feeling overwhelmed (like the 5-4-3-2-1 senses exercise)",
        "Ask a trusted person to help you arrange and attend healthcare appointments",
        "Consider whether medication might be helpful (in consultation with a healthcare provider)",
        "Remember that mental health conditions are treatable and recovery is possible",
        "Create a safety plan that includes emergency contacts and steps to take during a crisis",
        "Try to maintain a simple daily routine that includes small self-care activities"
    ]
};

    // Open the quiz modal
    function openQuiz() {
        document.getElementById('quizModal').style.display = 'flex';
        resetQuiz();
        showQuestion(currentQuestion);
    }

    // Close the quiz modal
    function closeQuiz() {
        document.getElementById('quizModal').style.display = 'none';
        resetQuiz();
    }

    // Reset quiz state
    function resetQuiz() {
        currentQuestion = 0;
        answers = [];
        updateProgress(0);
           // Re-create progress bar container when resetting
    const quizContent = document.getElementById('quizContent');
    const progressContainer = document.createElement('div');
    progressContainer.className = 'quiz-progress';
    progressContainer.innerHTML = `
        <div id="progressBar" class="progress-bar"></div>
    `;
    quizContent.insertBefore(progressContainer, quizContent.firstChild);
        // Hide email and results sections
        const emailSection = document.getElementById('emailSection');
        if (emailSection) emailSection.style.display = 'none';
        
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) resultsSection.style.display = 'none';
        
        document.getElementById('quizContent').style.display = 'block';
    }

    // Show current question
    function showQuestion(index) {
        const quizContent = document.getElementById('quizContent');
        if (!quizContent) return;
        
        const question = quizQuestions[index];
        
        let html = `
            <div class="question-container">
                <h3>${question.question}</h3>
                <div class="options-container">
                    ${question.options.map((option, i) => `
                        <button class="option-btn ${answers[index] === i ? 'selected' : ''}" 
                                onclick="quizModule.selectOption(${i})">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="question-counter" style="color: #e0e0e0">Question ${index + 1} of ${quizQuestions.length}</div>
            <div class="navigation-buttons">
                <button class="nav-btn prev-btn" ${index === 0 ? 'disabled' : ''} 
                        onclick="quizModule.previousQuestion()">Previous</button>
                <button class="nav-btn next-btn" 
                        onclick="quizModule.nextQuestion()">
                        ${index === quizQuestions.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        `;
        
        quizContent.innerHTML = html;
        updateProgress(((index + 1) / quizQuestions.length) * 100);
    }

    // Handle option selection
    function selectOption(optionIndex) {
        answers[currentQuestion] = optionIndex;
        // Refresh UI to show selected option
        const options = document.querySelectorAll('.option-btn');
        options.forEach((option, index) => {
            if (index === optionIndex) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        
        // If this is the self-harm question and user selected a concerning answer
        const currentQ = quizQuestions[currentQuestion];
        if (currentQ.critical && optionIndex > 0) {
            // Show crisis resources immediately
            showCrisisResources();
        }
    }

    // Go to previous question
    function previousQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    }

   // Modified nextQuestion function
function nextQuestion() {
    if (currentQuestion < quizQuestions.length - 1) {
        if (answers[currentQuestion] !== undefined) {
            currentQuestion++;
            showQuestion(currentQuestion);
        } else {
            showNotification("Please select an option to continue");
        }
    } else {
        if (answers[currentQuestion] !== undefined) {
            showEmailSection();
            // Trigger confetti HERE specifically
            playQuizCompletionConfetti();
        } else {
            showNotification("Please select an option to continue");
        }
    }
}

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'quiz-notification';
        notification.textContent = message;
        document.querySelector('.quiz-container').appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    // Update progress bar
    function updateProgress(percentage) {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
    }

   // Updated showEmailSection function
function showEmailSection() {
    document.getElementById('quizContent').style.display = 'none';

    const progressContainer = document.querySelector('.quiz-progress');
    if (progressContainer) {
        progressContainer.remove(); // Completely remove the element
    }

    let emailSection = document.getElementById('emailSection');
    if (!emailSection) {
        emailSection = document.createElement('div');
        emailSection.id = 'emailSection';
        document.querySelector('.quiz-content').appendChild(emailSection);
    }

    // Calculate score and determine assessment level
    const score = calculateScore();
    const assessmentLevel = determineAssessmentLevel(score);

    // Styling based on assessment level
    let bgColor = '#8c7bf0'; // Default
    let icon = '✓';
    let messageText = 'Your assessment results are ready.';

    switch(assessmentLevel) {
        case 'Good':
            bgColor = '#4CAF50';
            icon = '😊';
            messageText = 'Great news! Your assessment results look positive.';
            break;
        case 'Mild Concern':
            bgColor = '#FFEB3B';
            icon = '🙂';
            messageText = 'We\'ve identified some mild concerns.';
            break;
        case 'Moderate Concern':
            bgColor = '#FF9800';
            icon = '😐';
            messageText = 'We\'ve identified moderate concerns.';
            break;
        case 'Significant Concern':
            bgColor = '#F44336';
            icon = '❤️';
            messageText = 'We care about your wellbeing.';
            break;
    }

    emailSection.style.display = 'block';
    emailSection.innerHTML = `
    <div class="thank-you-message">
        <h3>Thank you for taking the assessment!</h3>
        <div class="success-icon" style="background: ${bgColor}30; color: ${bgColor}; border-color: ${bgColor};">
            ${icon}
        </div>
        <p>${messageText}</p>
        <button id="viewResultsBtn" class="view-results-btn" onclick="quizModule.viewResults()">
            View My Results Now!
        </button>
    </div>
`;
}

  // Update the viewResults function to include visual charts
  function viewResults() {
    const score = calculateScore();
    const assessmentLevel = determineAssessmentLevel(score);

    document.getElementById('emailSection').style.display = 'none';

    let resultsSection = document.getElementById('resultsSection');
    if (!resultsSection) {
        resultsSection = document.createElement('div');
        resultsSection.id = 'resultsSection';
        document.querySelector('.quiz-container').appendChild(resultsSection);
    }

    let textColor;
    switch(assessmentLevel) {
        case 'Good':
            textColor = '#4CAF50';
            break;
        case 'Mild Concern':
            textColor = '#d6c120';
            break;
        case 'Moderate Concern':
            textColor = '#FF9800';
            break;
        case 'Significant Concern':
            textColor = '#F44336';
            break;
        default:
            textColor = '#8c7bf0';
    }

    const recommendationsList = recommendations[assessmentLevel].map(rec =>
        `<li>${rec}</li>`
    ).join('');

    // Generate chart data dynamically
    const symptomData = analyzeSymptomDistribution(answers);
    const severityData = analyzeSeverityByCategory(answers);

    resultsSection.style.display = 'block';
    resultsSection.innerHTML = `
         <div class="results-container" style="max-width: 700px; margin: auto; font-family: 'Poppins', sans-serif; padding: 20px;">
        <h3 class="assessment-title" style="text-align: left; font-weight: 600; font-size: 28px; color: #3f3d56;">Mental Health Assessment Report</h3>
        
            <div class="assessment-score" style="text-align: center; margin: 20px 0; font-size: 20px;">
                <p>Based on your responses, we've identified a <strong style="color: ${textColor}">${assessmentLevel}</strong> level.</p>
            </div>

            <div class="charts-container" style="display: flex; flex-wrap: wrap; justify-content: space-around; gap: 20px;">
                <div class="chart-wrapper" style="flex: 1 1 300px; min-width: 280px;">
                    <h4 style="text-align: center; margin-bottom: 10px; color: #4a4a4a;">Symptom Distribution</h4>
                    <div id="pieChartContainer" style="height: 360px;"></div>
                </div>
                <div class="chart-wrapper" style="flex: 1 1 300px; min-width: 280px;">
                    <h4 style="text-align: center; margin-bottom: 10px; color: #4a4a4a;">Symptom Severity by Category</h4>
                    <div id="barChartContainer" style="height: 300px;"></div>
                </div>
            </div>

            <div class="recommendations-container" style="margin-top: 30px; padding-left: 20px; padding-right: 20px;">
                <h4 style="color: #3f3d56; font-weight: 600; font-size: 22px; margin-bottom: 10px;">Recommendations for You</h4>
                <ul class="recommendations-list" style="list-style-type: disc; margin-left: 20px; color: #555;">
                    ${recommendationsList}
                </ul>
            </div>

            <div class="disclaimer" style="margin-top: 25px; font-size: 14px; color: #888; text-align: center;">
                <p>This assessment is not a clinical diagnosis. If you're experiencing persistent difficulties, please consider speaking with a mental health professional.</p>
            </div>

            <div class="result-actions" style="display: flex; justify-content: center; gap: 20px; margin-top: 30px;">
                <button class="close-results-btn" onclick="quizModule.closeQuiz()" 
                style="background-color: #8c7bf0; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 600;">Close</button>
                <button class="print-results-btn" onclick="window.print()" 
                style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: 600;">Print / Download Results</button>
            </div>
        </div>
    `;

    // Render the charts after HTML insertion
    setTimeout(() => {
        renderPieChart(symptomData);
        renderBarChart(severityData);
    }, 100);
}
    // Calculate score based on answers, weighting critical questions more heavily
    function calculateScore() {
        let totalScore = 0;
        let answeredQuestions = 0;
        
        // Calculate from answered questions
        answers.forEach((answer, index) => {
            if (answer !== undefined) {
                // Questions about self-harm are weighted more heavily
                const weight = quizQuestions[index].critical ? 2 : 1;
                totalScore += (answer * weight);
                answeredQuestions++;
            }
        });
        
        // If there are unanswered questions, estimate their score based on average
        if (answeredQuestions < quizQuestions.length) {
            const averageScore = answeredQuestions > 0 ? totalScore / answeredQuestions : 0;
            const unansweredCount = quizQuestions.length - answeredQuestions;
            
            // Add estimated score for unanswered questions
            totalScore += (averageScore * unansweredCount);
        }
        
        return totalScore;
    }

    // Determine assessment level based on score
    function determineAssessmentLevel(score) {
        // Calculate maximum possible score
        let maxScore = 0;
        quizQuestions.forEach(q => {
            maxScore += (q.critical ? 2 : 1) * 3; // 3 is the max option value
        });
        
        // Normalize to 0-100 scale
        const normalizedScore = (score / maxScore) * 100;
        
        if (normalizedScore <= 25) {
            return "Good";
        } else if (normalizedScore <= 50) {
            return "Mild Concern";
        } else if (normalizedScore <= 75) {
            return "Moderate Concern";
        } else {
            return "Significant Concern";
        }
    }

function initQuiz() {
    console.log("Quiz module initialized");
    
    // Make sure the floating button is visible and properly positioned
    const floatingBtn = document.querySelector('.quiz-floating-btn');
    if (floatingBtn) {
        console.log("Found floating button");
        floatingBtn.addEventListener('click', openQuiz);
    } else {
        console.error("Floating quiz button not found in the DOM");
    }
    
    // Attach click handler to close button
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeQuiz);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('quizModal');
        if (event.target === modal) {
            closeQuiz();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeQuiz();
        }
    });
    
    // Apply print styles
    applyPrintStyles();
    
    // NEW: Ensure quiz has dark appearance regardless of theme
    if (typeof applyDarkQuizStyles === 'function') {
        applyDarkQuizStyles();
    } else {
        // Fallback if the function isn't available yet
        setTimeout(() => {
            if (typeof applyDarkQuizStyles === 'function') {
                applyDarkQuizStyles();
            }
        }, 500);
    }
    
    // Listen for night mode changes to re-apply quiz styles
    document.addEventListener('nightModeChanged', function() {
        if (typeof applyDarkQuizStyles === 'function') {
            applyDarkQuizStyles();
        }
    });
}

    // Initialize quiz when DOM is loaded
    document.addEventListener('DOMContentLoaded', initQuiz);

    // Return public methods
    return {
        openQuiz,
        closeQuiz,
        selectOption,
        previousQuestion,
        nextQuestion,
        viewResults
    };
})();

// Export for global access
window.quizModule = quizModule;

// Update the print styling
function applyPrintStyles() {
    // Check if we already have a print style sheet
    let printStyleSheet = document.getElementById('quiz-print-styles');
    
    if (!printStyleSheet) {
        printStyleSheet = document.createElement('style');
        printStyleSheet.id = 'quiz-print-styles';
        printStyleSheet.media = 'print';
        
        // Add print-specific CSS
        printStyleSheet.innerHTML = `
            @media print {
                body * {
                    visibility: hidden;
                }
                
                .quiz-container, .quiz-container * {
                    visibility: visible;
                }
                
                .quiz-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    background: white !important;
                    color: black !important;
                    box-shadow: none !important;
                    border: none !important;
                }
                
                .close-btn, .result-actions, .quiz-progress {
                    display: none !important;
                }
                
                .assessment-title {
                    color: #8c7bf0 !important;
                    font-size: 24px !important;
                    text-align: center !important;
                    margin-bottom: 20px !important;
                    border-bottom: 2px solid #8c7bf0 !important;
                    padding-bottom: 10px !important;
                }
                
                .recommendations-list li {
                    margin-bottom: 10px !important;
                    color: black !important;
                }
                
                .disclaimer {
                    border-top: 1px solid #ccc !important;
                    margin-top: 20px !important;
                    padding-top: 15px !important;
                    font-style: italic !important;
                    color: #666 !important;
                }
            }
        `;
        
        document.head.appendChild(printStyleSheet);
    }
}

function analyzeSymptomDistribution(answers) {
    // Initialize counters for each category
    const categories = {
        'Depression': 0,
        'Anxiety': 0,
        'Stress': 0,
        'Sleep Issues': 0,
        'Appetite Issues': 0,
        'Self-Esteem': 0,
        'Concentration': 0,
        'Mood': 0,
        'Social Support': 0,
        'Physical Health': 0
    };

    // Map questions to symptom categories
    const categoryMap = [
        'Depression',       // Q1: interest or pleasure
        'Depression',       // Q2: feeling down or depressed
        'Sleep Issues',     // Q3: sleep problems
        'Mood',             // Q4: tired or low energy
        'Appetite Issues',  // Q5: poor appetite or overeating
        'Self-Esteem',      // Q6: feeling bad about yourself
        'Concentration',    // Q7: trouble concentrating
        'Mood',             // Q8: moving slowly or being fidgety
        'Anxiety',          // Q9: feeling nervous or anxious
        'Anxiety',          // Q10: uncontrollable worrying
        'Anxiety',          // Q11: worried about different things
        'Stress',           // Q12: trouble relaxing
        'Stress',           // Q13: restlessness
        'Mood',             // Q14: irritability
        'Anxiety',          // Q15: feeling afraid
        'Stress',           // Q16: ability to cope with stress
        'Social Support',   // Q17: social support network
        'Depression',       // Q18: engagement in enjoyable activities
        'Physical Health',  // Q19: physical health
        'Depression'        // Q20: self-harm thoughts
    ];

    // Count the symptom severity based on answers
    let totalSeverity = 0;
    answers.forEach((answer, index) => {
        if (answer !== undefined) {
            const category = categoryMap[index];
            if (category && categories[category] !== undefined) {
                // Add the answer value (0-3) to the category total
                categories[category] += answer;
                totalSeverity += answer;
            }
        }
    });

    // Only include categories with actual responses
    const pieData = Object.entries(categories)
        .filter(([_, value]) => value > 0)
        .map(([category, value]) => {
            // Calculate the true percentage based on the total severity
            const percentage = totalSeverity > 0 ? (value / totalSeverity) * 100 : 0;
            return { 
                category, 
                percentage: Math.round(percentage) // Round to nearest integer
            };
        });

    return pieData;
}

// Function to analyze severity by category for bar chart
function analyzeSeverityByCategory(answers) {
    // Define major categories and map question indices belonging to them
    const categoryIndices = {
        'Depression': [0,1,5,17],
        'Anxiety': [8,9,10,14],
        'Stress': [2,11,12,15], 
        'Restlessness': [6,7,13],
        'Mood': [3,4,16],
        'Physical Health': [18],
        'Self Harm': [19]
    };

    const severityScores = {};
    for (const category in categoryIndices) {
        const indices = categoryIndices[category];
        let sumScores = 0;
        let responsesCount = 0;

        indices.forEach(i => {
            if (answers[i] !== undefined) {
                sumScores += answers[i]; // Using direct answer value (0-3)
                responsesCount++;
            }
        });
        // Average severity on a 0-100 scale or 0 if no responses
        severityScores[category] = responsesCount > 0 ? (sumScores / responsesCount) * (100/3) : 0;
    }

    // Convert to array for bar chart data
    return Object.entries(severityScores).map(([category, avgSeverity]) => ({
        category,
        severity: Math.round(avgSeverity)  // Round to nearest integer
    }));
}

// Function to render pie chart
function renderPieChart(data) {
    const container = document.getElementById('pieChartContainer');
    if (!container) return;
    
    // Filter out categories with very small percentages to reduce clutter
    // but store their total percentage to distribute later
    const significantThreshold = 2; // minimum percentage to show as own slice
    let otherPercentage = 0;
    
    // Sort data by percentage (descending) for better visualization
    const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);
    
    // Identify significant categories and calculate 'Other' percentage
    const significantData = sortedData.filter(item => {
        if (item.percentage > significantThreshold) {
            return true;
        } else {
            otherPercentage += item.percentage;
            return false;
        }
    });
    
    // If we have small categories, add an 'Other' category
    let finalData = [...significantData];
    if (otherPercentage > 0) {
        finalData.push({
            category: 'Other',
            percentage: otherPercentage
        });
    }
    
    // Ensure percentages add up to 100% exactly
    const totalPercentage = finalData.reduce((sum, item) => sum + item.percentage, 0);
    if (totalPercentage !== 100) {
        // Adjust the largest category to make total exactly 100%
        const difference = 100 - totalPercentage;
        finalData[0].percentage += difference;
    }

    // Set up SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 400 400");
    container.innerHTML = ''; // Clear existing content
    container.appendChild(svg);
    
    // Better color palette with more contrast
    const colors = [
        '#4285F4', // blue
        '#EA4335', // red
        '#34A853', // green
        '#FBBC05', // yellow
        '#7B68EE', // medium slate blue
        '#FF6384', // pink
        '#36A2EB', // sky blue
        '#FF9F40', // orange
        '#9966FF', // purple
        '#C9CBCF'  // light gray (for 'Other')
    ];
    
    // Draw pie chart
    let startAngle = 0;
    let endAngle = 0;
    const radius = 130;
    const centerX = 200;
    const centerY = 170;
    
    // Create a legend group
    const legendGroup = document.createElementNS(svgNS, "g");
    legendGroup.setAttribute("transform", "translate(10, 300)");
    svg.appendChild(legendGroup);
    
    finalData.forEach((item, index) => {
        // Calculate angles for pie slice
        const angle = (item.percentage / 100) * 360;
        endAngle = startAngle + angle;
        
        // Convert to radians
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;
        
        // Calculate path
        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);
        
        // Determine large arc flag
        const largeArcFlag = angle > 180 ? 1 : 0;
        
        // Create path
        const path = document.createElementNS(svgNS, "path");
        const d = [
            "M", centerX, centerY,
            "L", x1, y1,
            "A", radius, radius, 0, largeArcFlag, 1, x2, y2,
            "Z"
        ].join(" ");
        
        path.setAttribute("d", d);
        path.setAttribute("fill", colors[index % colors.length]);
        
        // Add hover effect
        path.setAttribute("class", "pie-slice");
        path.style.transition = "transform 0.2s";
        path.addEventListener("mouseover", function() {
            this.style.transform = `translate(${Math.cos((startAngle + angle/2 - 90) * Math.PI / 180) * 10}px, ${Math.sin((startAngle + angle/2 - 90) * Math.PI / 180) * 10}px)`;
        });
        path.addEventListener("mouseout", function() {
            this.style.transform = "translate(0, 0)";
        });
        
        svg.appendChild(path);
        
        // Add Legend item instead of direct labels
        const legendItem = document.createElementNS(svgNS, "g");
        legendItem.setAttribute("transform", `translate(0, ${index * 20})`);
        
        const legendColor = document.createElementNS(svgNS, "rect");
        legendColor.setAttribute("width", "12");
        legendColor.setAttribute("height", "12");
        legendColor.setAttribute("fill", colors[index % colors.length]);
        legendItem.appendChild(legendColor);
        
        const legendText = document.createElementNS(svgNS, "text");
        legendText.setAttribute("x", "20");
        legendText.setAttribute("y", "10");
        legendText.setAttribute("font-size", "12px");
        legendText.setAttribute("fill", "currentColor");
        legendText.textContent = `${item.category} (${item.percentage}%)`;
        legendItem.appendChild(legendText);
        
        legendGroup.appendChild(legendItem);
        
        startAngle = endAngle;
    });
    
    // Add category title in the center
    const centerText = document.createElementNS(svgNS, "text");
    centerText.setAttribute("x", centerX);
    centerText.setAttribute("y", centerY);
    centerText.setAttribute("text-anchor", "middle");
    centerText.setAttribute("font-size", "16px");
    centerText.setAttribute("fill", "currentColor");
    centerText.setAttribute("font-weight", "bold");
    centerText.textContent = "Symptom Areas";
    svg.appendChild(centerText);
}

// Function to render bar chart
function renderBarChart(data) {
    const container = document.getElementById('barChartContainer');
    if (!container) return;
    
    // Set up SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 500 400"); // Increased height for labels
    container.innerHTML = ''; // Clear existing content
    container.appendChild(svg);
    
    // Define dimensions
    const chartWidth = 450;
    const chartHeight = 250; // Increased height
    const barWidth = Math.min(chartWidth / data.length - 8, 50); // Limited max width
    const maxValue = 100; // Fixed scale to 100%
    
    // Draw axes
    const axisGroup = document.createElementNS(svgNS, "g");
    
    // X axis
    const xAxis = document.createElementNS(svgNS, "line");
    xAxis.setAttribute("x1", 50);
    xAxis.setAttribute("y1", 300);
    xAxis.setAttribute("x2", 490);
    xAxis.setAttribute("y2", 300);
    xAxis.setAttribute("stroke", "#aaa");
    xAxis.setAttribute("stroke-width", "1");
    axisGroup.appendChild(xAxis);
    
    // Y axis
    const yAxis = document.createElementNS(svgNS, "line");
    yAxis.setAttribute("x1", 50);
    yAxis.setAttribute("y1", 300);
    yAxis.setAttribute("x2", 50);
    yAxis.setAttribute("y2", 50);
    yAxis.setAttribute("stroke", "#aaa");
    yAxis.setAttribute("stroke-width", "1");
    axisGroup.appendChild(yAxis);
    
    svg.appendChild(axisGroup);
    
    // Add Y axis labels with grid lines
    for (let i = 0; i <= 100; i += 25) {
        const yLabel = document.createElementNS(svgNS, "text");
        const yPos = 300 - (i / maxValue * chartHeight);
        yLabel.setAttribute("x", 45);
        yLabel.setAttribute("y", yPos);
        yLabel.setAttribute("text-anchor", "end");
        yLabel.setAttribute("font-size", "12px");
        yLabel.setAttribute("alignment-baseline", "middle");
        yLabel.textContent = i + "%";
        svg.appendChild(yLabel);
        
        // Add grid line
        const gridLine = document.createElementNS(svgNS, "line");
        gridLine.setAttribute("x1", 50);
        gridLine.setAttribute("y1", yPos);
        gridLine.setAttribute("x2", 490);
        gridLine.setAttribute("y2", yPos);
        gridLine.setAttribute("stroke", "#eee");
        gridLine.setAttribute("stroke-width", "1");
        svg.appendChild(gridLine);
    }
    
    // Add chart title
    const title = document.createElementNS(svgNS, "text");
    title.setAttribute("x", 250);
    title.setAttribute("y", 30);
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("font-size", "16px");
    title.setAttribute("font-weight", "bold");
    svg.appendChild(title);
    
    // Gradient colors for bars based on severity
    const gradientColors = [
        {stop1: "#4CAF50", stop2: "#8BC34A"}, // Green - Low
        {stop1: "#FFEB3B", stop2: "#FFC107"}, // Yellow - Medium Low
        {stop1: "#FF9800", stop2: "#FF5722"}, // Orange - Medium
        {stop1: "#F44336", stop2: "#D32F2F"}  // Red - High
    ];
    
    // Create defs for gradients
    const defs = document.createElementNS(svgNS, "defs");
    svg.appendChild(defs);
    
    // Draw bars
    data.forEach((item, index) => {
        const barGroup = document.createElementNS(svgNS, "g");
        
        // Calculate positions
        const barHeight = (item.severity / maxValue) * chartHeight;
        const x = 50 + (index * ((chartWidth / data.length)));
        const barX = x + ((chartWidth / data.length) - barWidth) / 2;
        const y = 300 - barHeight;
        
        // Create gradient
        const colorIndex = Math.min(Math.floor(item.severity / 25), 3);
        const gradientId = `gradient-${index}`;
        const gradient = document.createElementNS(svgNS, "linearGradient");
        gradient.setAttribute("id", gradientId);
        gradient.setAttribute("x1", "0%");
        gradient.setAttribute("y1", "0%");
        gradient.setAttribute("x2", "0%");
        gradient.setAttribute("y2", "100%");
        
        const stop1 = document.createElementNS(svgNS, "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", gradientColors[colorIndex].stop1);
        gradient.appendChild(stop1);
        
        const stop2 = document.createElementNS(svgNS, "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", gradientColors[colorIndex].stop2);
        gradient.appendChild(stop2);
        
        defs.appendChild(gradient);
        
        // Create bar with rounded corners
        const bar = document.createElementNS(svgNS, "rect");
        bar.setAttribute("x", barX);
        bar.setAttribute("y", y);
        bar.setAttribute("width", barWidth);
        bar.setAttribute("height", barHeight);
        bar.setAttribute("rx", "3");
        bar.setAttribute("ry", "3");
        bar.setAttribute("fill", `url(#${gradientId})`);
        
        // Add shadow
        bar.setAttribute("filter", "drop-shadow(0px 3px 3px rgba(0,0,0,0.2))");
        
        barGroup.appendChild(bar);
        
        // Add value label
        if (item.severity > 10) { // Only add labels for values above 10%
            const valueLabel = document.createElementNS(svgNS, "text");
            valueLabel.setAttribute("x", barX + barWidth / 2);
            valueLabel.setAttribute("y", y - 5);
            valueLabel.setAttribute("text-anchor", "middle");
            valueLabel.setAttribute("font-size", "12px");
            valueLabel.setAttribute("fill", "currentColor");
            valueLabel.textContent = item.severity + "%";
            barGroup.appendChild(valueLabel);
        }
        
        // Add x-axis label with better rotation for long category names
        const xLabel = document.createElementNS(svgNS, "text");
        xLabel.setAttribute("x", barX + barWidth / 2);
        xLabel.setAttribute("y", 320);
        xLabel.setAttribute("text-anchor", "end");
        xLabel.setAttribute("fill", "currentColor");
        xLabel.setAttribute("font-size", "11px");
        xLabel.setAttribute("transform", `rotate(-45, ${barX + barWidth / 2}, 320)`);
        
        // Shorten long category names
        const categoryName = item.category.length > 15 ? 
            item.category.substring(0, 15) + "..." : 
            item.category;
            
        xLabel.textContent = categoryName;
        barGroup.appendChild(xLabel);
        
        svg.appendChild(barGroup);
    });
}
// Add CSS styles for charts
function addChartStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .charts-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin: 20px 0;
        }
        
        .chart-wrapper {
            flex: 1;
            min-width: 300px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .chart-wrapper h4 {
            color: #f9e6fc;
            margin-top: 0;
            margin-bottom: 15px;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .charts-container {
                flex-direction: column;
            }
        }
        
        @media print {
            .charts-container {
                display: flex;
                flex-direction: column;
            }
            
            .chart-wrapper {
                background: white !important;
                page-break-inside: avoid;
                margin-bottom: 20px;
            }
        }
    `;
    document.head.appendChild(styleElement);
}

// Call this function when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add chart styles
    addChartStyles();
});
// Confetti animation for quiz completion
class ConfettiEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.colors = ['#9370DB', '#8A2BE2', '#7B68EE', '#a587e4', '#f9e6fc', '#ffffff'];
        this.running = false;
        
        // Style the canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none'; // Let clicks pass through
        this.canvas.style.zIndex = '9999';
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        // Create confetti particles
        for (let i = 0; i < 200; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * -1, // Start above the viewport
                size: Math.random() * 8 + 3,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                shape: Math.random() > 0.5 ? 'circle' : 'rect',
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                spin: Math.random() * 0.2 - 0.1,
                rotation: Math.random() * Math.PI * 2
            });
        }
    }

    drawParticle(particle) {
        this.ctx.fillStyle = particle.color;
        
        if (particle.shape === 'circle') {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            this.ctx.restore();
        }
    }

    updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update position
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.spin;
            
            // Remove particles that are out of bounds
            if (p.y > this.canvas.height + p.size) {
                this.particles.splice(i, 1);
                i--;
            }
        }
        
        // Stop animation if no particles left
        if (this.particles.length === 0) {
            this.stop();
        }
    }

    animate() {
        if (!this.running) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        
        // Draw all particles
        for (const particle of this.particles) {
            this.drawParticle(particle);
        }
        
        requestAnimationFrame(() => this.animate());
    }

    start() {
        if (this.running) return;
        
        this.running = true;
        document.body.appendChild(this.canvas);
        this.createParticles();
        this.animate();
        
        // Auto-stop after 8 seconds
        setTimeout(() => {
            this.stop();
        }, 8000);
    }

    stop() {
        if (!this.running) return;
        
        this.running = false;
        this.particles = [];
        if (this.canvas.parentNode) {
            document.body.removeChild(this.canvas);
        }
    }
}

// Initialize the confetti effect
const quizConfetti = new ConfettiEffect();

// Function to trigger confetti
function playQuizCompletionConfetti() {
    quizConfetti.start();
}

// Add event listeners to the appropriate elements
document.addEventListener('DOMContentLoaded', function() {
    // Add chart styles (keep this)
    addChartStyles();
    
    initQuiz();
});

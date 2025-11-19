// Text-to-Speech Function
function speak(text) {
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        utterance.volume = 1;
        
        window.speechSynthesis.speak(utterance);
    }
}

// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    });
});

// Lesson Section - Action Cards with Sound
document.querySelectorAll('.action-card').forEach(card => {
    card.addEventListener('click', () => {
        const soundText = card.dataset.sound;
        speak(soundText);
        
        // Visual feedback
        card.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
            card.style.transform = '';
        }, 300);
    });
});

// QUIZ SECTION
const quizQuestions = [
    {
        icon: '🐟',
        text: 'A fish ___ swim.',
        answer: 'can',
        explanation: 'Correct! Fish can swim in water.'
    },
    {
        icon: '🐕',
        text: 'A dog ___ fly.',
        answer: "can't",
        explanation: 'Correct! Dogs cannot fly.'
    },
    {
        icon: '🏃',
        text: 'I ___ run fast.',
        answer: 'can',
        explanation: 'Great! You can run fast!'
    },
    {
        icon: '🚗',
        text: 'A 7-year-old ___ drive a car.',
        answer: "can't",
        explanation: 'Correct! Children cannot drive cars.'
    },
    {
        icon: '🐦',
        text: 'Birds ___ fly in the sky.',
        answer: 'can',
        explanation: 'Perfect! Birds can fly!'
    }
];

let currentQuestionIndex = 0;
let score = 0;

function loadQuizQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const questionContainer = document.getElementById('quiz-question');
    
    document.getElementById('current-q').textContent = currentQuestionIndex + 1;
    document.getElementById('total-q').textContent = quizQuestions.length;
    
    questionContainer.innerHTML = `
        <div class="question-icon">${question.icon}</div>
        <p class="question-text">${question.text}</p>
        <div class="quiz-options">
            <button class="quiz-option" data-answer="can">can</button>
            <button class="quiz-option" data-answer="can't">can't</button>
        </div>
    `;
    
    // Speak the question
    speak(question.text);
    
    // Add click handlers to options
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', () => checkAnswer(option));
    });
}

function checkAnswer(selectedOption) {
    const question = quizQuestions[currentQuestionIndex];
    const userAnswer = selectedOption.dataset.answer;
    const feedback = document.getElementById('quiz-feedback');
    const allOptions = document.querySelectorAll('.quiz-option');
    
    // Disable all options
    allOptions.forEach(opt => opt.disabled = true);
    
    if (userAnswer === question.answer) {
        selectedOption.classList.add('correct');
        feedback.textContent = '🎉 ' + question.explanation;
        feedback.className = 'quiz-feedback correct';
        speak('Correct! ' + question.explanation);
        score++;
    } else {
        selectedOption.classList.add('incorrect');
        feedback.textContent = '😔 Oops! The correct answer is "' + question.answer + '".';
        feedback.className = 'quiz-feedback incorrect';
        speak('Oops! The correct answer is ' + question.answer);
        
        // Highlight correct answer
        allOptions.forEach(opt => {
            if (opt.dataset.answer === question.answer) {
                opt.classList.add('correct');
            }
        });
    }
    
    feedback.classList.remove('hidden');
    document.getElementById('next-question').classList.remove('hidden');
}

document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizQuestions.length) {
        document.getElementById('quiz-feedback').classList.add('hidden');
        document.getElementById('next-question').classList.add('hidden');
        loadQuizQuestion();
    } else {
        showQuizResults();
    }
});

function showQuizResults() {
    document.getElementById('quiz-question').classList.add('hidden');
    document.getElementById('quiz-feedback').classList.add('hidden');
    document.getElementById('next-question').classList.add('hidden');
    document.getElementById('quiz-progress').classList.add('hidden');
    
    const results = document.getElementById('quiz-results');
    results.classList.remove('hidden');
    document.getElementById('final-score').textContent = score;
    
    const message = score === quizQuestions.length ? 
        'Perfect score! You are amazing!' : 
        score >= 3 ? 'Great job! Keep practicing!' : 'Good try! Practice more!';
    
    speak(message + ' Your score is ' + score + ' out of ' + quizQuestions.length);
}

document.getElementById('restart-quiz').addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    
    document.getElementById('quiz-question').classList.remove('hidden');
    document.getElementById('quiz-progress').classList.remove('hidden');
    document.getElementById('quiz-results').classList.add('hidden');
    
    loadQuizQuestion();
});

// Initialize quiz
loadQuizQuestion();

// GAME SECTION - Drag and Drop
const gameCards = [
    { icon: '🏊', text: 'I can swim', answer: 'can' },
    { icon: '🚫✈️', text: "I can't fly", answer: 'cant' },
    { icon: '🏃', text: 'I can run', answer: 'can' },
    { icon: '🚫🚗', text: "I can't drive", answer: 'cant' },
    { icon: '💃', text: 'I can dance', answer: 'can' },
    { icon: '🐕🚫', text: "Dogs can't talk", answer: 'cant' },
    { icon: '🐦', text: 'Birds can fly', answer: 'can' },
    { icon: '🐟🚫', text: "Fish can't walk", answer: 'cant' }
];

let gameScore = 0;

function initializeGame() {
    gameScore = 0;
    document.getElementById('score').textContent = gameScore;
    
    const dragCardsContainer = document.getElementById('drag-cards');
    dragCardsContainer.innerHTML = '';
    
    // Shuffle cards
    const shuffled = [...gameCards].sort(() => Math.random() - 0.5);
    
    shuffled.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'drag-card';
        cardElement.draggable = true;
        cardElement.dataset.answer = card.answer;
        cardElement.innerHTML = `
            <div class="icon">${card.icon}</div>
            <p>${card.text}</p>
        `;
        
        // Add click to speak
        cardElement.addEventListener('click', () => {
            speak(card.text);
        });
        
        // Drag events
        cardElement.addEventListener('dragstart', handleDragStart);
        cardElement.addEventListener('dragend', handleDragEnd);
        
        dragCardsContainer.appendChild(cardElement);
    });
    
    // Setup drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
        
        // Clear any cards in drop zones
        const existingCards = zone.querySelectorAll('.drag-card');
        existingCards.forEach(card => card.remove());
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
    return false;
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    this.classList.remove('drag-over');
    
    if (draggedElement) {
        const dropZoneAnswer = this.dataset.answer;
        const cardAnswer = draggedElement.dataset.answer;
        
        if (dropZoneAnswer === cardAnswer) {
            // Correct!
            this.appendChild(draggedElement);
            gameScore += 10;
            document.getElementById('score').textContent = gameScore;
            speak('Correct!');
            
            // Visual feedback
            draggedElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (draggedElement) {
                    draggedElement.style.transform = '';
                }
            }, 500);
            
            // Check if game is complete
            if (document.getElementById('drag-cards').children.length === 0) {
                setTimeout(() => {
                    speak('Congratulations! You completed the game! Your score is ' + gameScore);
                    if (confirm('🎉 Great job! You got them all correct! Play again?')) {
                        initializeGame();
                    }
                }, 500);
            }
        } else {
            // Incorrect
            speak('Try again!');
            draggedElement.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                if (draggedElement) {
                    draggedElement.style.animation = '';
                }
            }, 500);
        }
    }
    
    return false;
}

document.getElementById('reset-game').addEventListener('click', () => {
    initializeGame();
    speak('New game started!');
});

// Initialize game on load
initializeGame();
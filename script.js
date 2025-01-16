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

// Function to handle button hover effect
function handleButtonHover(button) {
    if (button.classList.contains('no-button')) {
        button.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
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
    switch (question.type) {
        case 'yesno':
            const isYes = answer.toLowerCase() === 'yes';
            showResponse(question.responses[answer.toLowerCase()], true, isYes);
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
            }
            break;
        case 'text':
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

// Update animation functions to use container
function createHeartAnimation() {
    const emojis = ['❤️', '💖', '💝', '💕', '💗', '💓'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = '100vh';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.animation = `floatUp ${Math.random() * 2 + 3}s ease-out forwards`;
        heart.style.opacity = '0';
        heart.style.transform = `rotate(${Math.random() * 360}deg)`;
        animationContainer.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }
}

function createSparkleAnimation() {
    const emojis = ['✨', '⭐', '🌟', '💫', '✴️', '🎇'];
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        sparkle.style.position = 'absolute';
        sparkle.style.left = Math.random() * 100 + 'vw';
        sparkle.style.top = Math.random() * 100 + 'vh';
        sparkle.style.fontSize = (Math.random() * 15 + 15) + 'px';
        sparkle.style.animation = `sparkle ${Math.random() * 1 + 1}s ease-out forwards`;
        animationContainer.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 2000);
    }
}

function createButterflyAnimation() {
    const butterflies = ['🦋', '🌸', '🌺', '🌹'];
    for (let i = 0; i < 12; i++) {
        const butterfly = document.createElement('div');
        butterfly.innerHTML = butterflies[Math.floor(Math.random() * butterflies.length)];
        butterfly.style.position = 'absolute';
        butterfly.style.left = '-50px';
        butterfly.style.top = Math.random() * 100 + 'vh';
        butterfly.style.fontSize = (Math.random() * 20 + 15) + 'px';
        butterfly.style.animation = `flyAcross ${Math.random() * 3 + 4}s ease-in-out forwards`;
        animationContainer.appendChild(butterfly);
        setTimeout(() => butterfly.remove(), 7000);
    }
}

function createLoveAnimation() {
    const loveEmojis = ['😍', '🥰', '😘', '💝', '💖', '💗'];
    for (let i = 0; i < 10; i++) {
        const love = document.createElement('div');
        love.innerHTML = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
        love.style.position = 'absolute';
        love.style.left = Math.random() * 100 + 'vw';
        love.style.top = Math.random() * 100 + 'vh';
        love.style.fontSize = (Math.random() * 25 + 20) + 'px';
        love.style.animation = `popAndSpin ${Math.random() * 1.5 + 1}s ease-out forwards`;
        animationContainer.appendChild(love);
        setTimeout(() => love.remove(), 2500);
    }
}

function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        animationContainer.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
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
            yesButton.className = 'option-button';
            yesButton.onclick = () => handleQuestionSubmit('yes', question);
            optionsContainer.appendChild(yesButton);

            const noButton = document.createElement('button');
            noButton.textContent = 'No';
            noButton.className = 'option-button';
            noButton.onclick = () => handleQuestionSubmit('no', question);
            optionsContainer.appendChild(noButton);
            break;

        case 'sliding-no':
        case 'force-yes':
            const slidingYesButton = document.createElement('button');
            slidingYesButton.textContent = 'Yes';
            slidingYesButton.className = 'option-button';
            slidingYesButton.onclick = () => handleQuestionSubmit('yes', question);
            optionsContainer.appendChild(slidingYesButton);

            const slidingNoButton = document.createElement('button');
            slidingNoButton.textContent = 'No';
            slidingNoButton.className = 'option-button no-button';
            slidingNoButton.onmouseover = () => handleButtonHover(slidingNoButton);
            slidingNoButton.onclick = (e) => {
                e.preventDefault();
                handleButtonHover(slidingNoButton);
            };
            optionsContainer.appendChild(slidingNoButton);
            break;

        case 'both-no':
            for (let i = 0; i < 2; i++) {
                const noButton = document.createElement('button');
                noButton.textContent = 'No';
                noButton.className = 'option-button';
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

// Function to show final message
function showFinalMessage() {
    questionText.textContent = "Happy Birthday to the love of my life! 🎉";
    optionsContainer.innerHTML = '';
    responseText.textContent = "You make my world brighter, my heart fuller, and my life so much better. I love you more than words can ever express! ❤️";
    responseText.classList.add('show');
    nextButton.style.display = 'none';
    createConfetti();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    
    startButton.addEventListener('click', () => {
        welcomeContainer.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            welcomeContainer.style.display = 'none';
            questionContainer.style.display = 'block';
            displayQuestion(currentQuestionIndex);
        }, 1000);
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
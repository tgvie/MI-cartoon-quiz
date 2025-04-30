import './style.scss';
import questions from './modules/questions';
import { startTimer, stopTimer, timeTaken } from './modules/timer';

// -----------------------------------------------------------------------------
// --------------------------------- VARIABLES ---------------------------------
// -----------------------------------------------------------------------------
const playGameBtn  = document.querySelector('#playGameBtn');
const logoInHeader = document.querySelector('#logoInHeader');
const HOME_PAGE = 'https://tgvie.github.io/MI-cartoon-quiz/';

let currentScore = 0;

// -----------------------------------------------------------------------------
// --------------------------------- FIRST PAGE --------------------------------
// -----------------------------------------------------------------------------
playGameBtn!.addEventListener('click', playGame);

logoInHeader!.addEventListener('click', goBackToStartPage);

function goBackToStartPage() {
    window.location.href = HOME_PAGE;
}

// -----------------------------------------------------------------------------
// --------------------------------- PLAY GAME ---------------------------------
// -----------------------------------------------------------------------------
const playGameBtnContainer = document.querySelector('#playGameBtnContainer');
const questionContainer = document.querySelector('section');
const firstRoundQuestions = questions.slice(0, 10);
const secondRoundQuestions = questions.slice(10, 20);
let currentRound = 1;
let isFirstRound = true; 
let currentQuestions = firstRoundQuestions;

function playGame() {
    currentScore = 0;
    totalAnswers = 0;
    currentQuestionIndex = 0;

    currentRound = currentRound === 1 ? 0 : 1;
    currentQuestions = isFirstRound ? firstRoundQuestions : secondRoundQuestions;

    playGameBtnContainer!.classList.add('hidden');
    questionContainer!.classList.remove('hidden');

    displayQuestion();
    startTimer();

    isFirstRound = !isFirstRound;
}

// -----------------------------------------------------------------------------
// ----------------------------- DISPLAY QUESTION ------------------------------
// -----------------------------------------------------------------------------
const questionBox = document.querySelector('#questionBox');
const answerBox = document.querySelector('#answerBox');
let currentQuestionIndex = 0;

function displayQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    const answers = [...question.incorrectAnswers];

    answers.push(question.correctAnswer);
    answers.sort(() => Math.random() - 0.5);

    // Update the question number
    const questionIndexElement = document.querySelector('#questionIndex')!;
    questionIndexElement.textContent = `Question ${currentQuestionIndex + 1}`;

    questionBox!.innerHTML = `
        <div class="img-container">
         <img src=${question.image?.src} alt=${question.image?.alt} width=${question.image?.width} height=${question.image?.height}>
        </div>
        <h3 class="question">${question.question}</h3>
    `;

    answerBox!.innerHTML = answers.map(answer => `
        <li class="answers">
            <label>
                <span>${answer}</span>
                <input type="radio" name="answers" value="${answer}">
            </label>
        </li>
    `).join('');

    const answerInputs = document.querySelectorAll('input[name="answers"]');
    answerInputs.forEach(input => {
        input.addEventListener('change', handleAnswer);
    });
}

// -----------------------------------------------------------------------------
// ----------------------------- HANDLE ANSWER ---------------------------------
// -----------------------------------------------------------------------------
let totalAnswers = 0;

function handleAnswer(event: Event) {
    const selectedAnswer = (event.target as HTMLInputElement).value;
    const selectedAnswerElement = (event.target as HTMLInputElement);
    const parentLi = selectedAnswerElement.closest<HTMLLIElement>('li'); 
    const correctAnswer = currentQuestions[currentQuestionIndex].correctAnswer;

    if (selectedAnswer === correctAnswer) {
        currentScore += 5;
        totalAnswers++;
        parentLi!.classList.add('correct-color');
    } else {
        currentScore -= 3;
        parentLi!.classList.add('incorrect-color');
    }

    setTimeout(() => {
        currentQuestionIndex++;

        if (currentQuestionIndex < currentQuestions.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    }, 700);
}

// -----------------------------------------------------------------------------
// ----------------------------- END GAME --------------------------------------
// -----------------------------------------------------------------------------
function endQuiz() {
    stopTimer();

    const resultBox = document.querySelector('#resultBox');

    questionContainer!.classList.add('hidden');
    resultBox!.classList.remove('hidden');

    resultBox!.innerHTML = `
    <div class="result-box">
        <p class="score-of-ten">${totalAnswers}/10</p>
        <p>Your Score: ${currentScore}</p>
        <p>Time: ${timeTaken} seconds</p>
    </div>
    <button class="restart-btn" id="restartBtn">Restart</button>
    `;

    const restartBtn = document.querySelector('#restartBtn');
    restartBtn!.addEventListener('click', () => {
        resultBox!.classList.add('hidden');
        playGame();
    });
}
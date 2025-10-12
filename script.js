const questions = [
  {question:"Capital of France?",options:["Berlin","Madrid","Paris","Rome"],answer:2},
  {question:"2+2=?",options:["3","4","5","22"],answer:1},
  {question:"Largest planet?",options:["Mars","Earth","Jupiter","Venus"],answer:2},
  {question:"HTML stands for?",options:["HyperText Markup Language","HighText Machine Language","Hyperlink Markup","None"],answer:0},
  {question:"JS is ___?",options:["Language","Framework","OS","Database"],answer:0},
  {question:"CSS stands for?",options:["Cascade Style Sheets","Colorful Style System","Computer Style Syntax","None"],answer:0},
  {question:"5*6=?",options:["30","35","25","40"],answer:0},
  {question:"Square root of 81?",options:["9","8","7","6"],answer:0},
  {question:"Which is backend lang?",options:["Python","HTML","CSS","XML"],answer:0},
  {question:"Sun rises from?",options:["West","East","North","South"],answer:1}
];

// DOM Elements
const loginSection = document.getElementById('Signin');
const loginForm = document.getElementById('loginForm');
const quizSection = document.getElementById('main');
const resultSection = document.getElementById('resultSection');
const navbarUser = document.getElementById('navuser');
const questionText = document.getElementById('questionText');
const optionsDiv = document.getElementById('options');
const markReviewBtn = document.getElementById('markReviewBtn');
const progressBar = document.getElementById('progressBar');
const attemptedCount = document.getElementById('attemptedCount');
const unattemptedCount = document.getElementById('unattemptedCount');
const reviewCount = document.getElementById('ReviewCount');
const endBtn = document.getElementById('endBtn');
const timerEl = document.getElementById('timer');
const toggleMode = document.getElementById('toggleMode');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Variables
let username = "";
let currentQ = 0;
let userAnswers = Array(questions.length).fill(null);
let markedReview = new Set();
let timer, timeLeft = 300;
const FIXED_PASSWORD = "quiz123";  

// LOGIN FUNCTION
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const usernameVal = document.getElementById('username').value.trim();
  const Password = document.getElementById('Password').value.trim();

  if (!usernameVal || !Password) {
    alert("⚠️ Please enter both Username and Password");
    return;
  }

  if (Password !== FIXED_PASSWORD) {
    alert("❌ Incorrect Password! Hint: try quiz123");
    return;
  }

  username = usernameVal;
  navbarUser.textContent = username;
  loginSection.style.display = "none";
  quizSection.style.display = "block";

  renderProgress();
  loadQuestion(0);
  startTimer();
});

// LOAD QUESTION
function loadQuestion(index) {
  currentQ = index;
  const q = questions[index];
  questionText.textContent = `${index + 1}. ${q.question}`;
  optionsDiv.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.setAttribute("aria-label", "Option " + opt);
    btn.tabIndex = 0;

    if (userAnswers[index] !== null && i === userAnswers[index]) {
      btn.classList.add(i === q.answer ? "correct" : "incorrect");
    }

    btn.addEventListener('click', () => selectAnswer(index, i, btn));
    optionsDiv.appendChild(btn);
  });

  updateCounts();
  updateNavButtons();
}

// SELECT ANSWER
function selectAnswer(qIndex, ans, btn) {
  userAnswers[qIndex] = ans;
  Array.from(optionsDiv.children).forEach(b => b.classList.remove('correct', 'incorrect'));
  btn.classList.add(ans === questions[qIndex].answer ? 'correct' : 'incorrect');
  renderProgress();
  updateCounts();
}

// PROGRESS BAR
function renderProgress() {
  progressBar.innerHTML = "";
  questions.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.textContent = i + 1;
    dot.className = "dot";
    if (userAnswers[i] !== null) dot.classList.add('attempted');
    if (markedReview.has(i)) dot.classList.add('review');
    dot.addEventListener('click', () => loadQuestion(i));
    progressBar.appendChild(dot);
  });
}

// COUNTS
function updateCounts() {
  const attempted = userAnswers.filter(a => a !== null).length;
  const unattempted = questions.length - attempted;
  attemptedCount.textContent = `Attempted: ${attempted}`;
  unattemptedCount.textContent = `Unattempted: ${unattempted}`;
  reviewCount.textContent = `Review: ${markedReview.size}`;
}

// NAVIGATION
nextBtn.addEventListener('click', () => {
  if (currentQ < questions.length - 1) loadQuestion(currentQ + 1);
});
prevBtn.addEventListener('click', () => {
  if (currentQ > 0) loadQuestion(currentQ - 1);
});

function updateNavButtons() {
  prevBtn.disabled = currentQ === 0;
  nextBtn.disabled = currentQ === questions.length - 1;
}

// MARK REVIEW
markReviewBtn.addEventListener('click', () => {
  if (markedReview.has(currentQ)) markedReview.delete(currentQ);
  else markedReview.add(currentQ);
  renderProgress();
  updateCounts();
});

// TIMER
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    timerEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

// END QUIZ
endBtn.addEventListener('click', endQuiz);

 function endQuiz(){
    clearInterval(timer);
    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    let score=0;
    userAnswers.forEach((a,i)=>{
      if(a===questions[i].answer) score+=4;
      else if(a===null) score+=0;
      else score-=1;
    });

// THEME TOGGLE
toggleMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggleMode.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
})}

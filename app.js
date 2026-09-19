// English Tenses Challenge - app logic

const STORAGE_KEY = "englishTensesChallenge.lastChallenges";

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const startBtn = document.getElementById("start-btn");
const pickingEl = document.getElementById("picking");

const quizTitleEl = document.getElementById("quiz-title");
const quizProgressEl = document.getElementById("quiz-progress");
const progressFillEl = document.getElementById("progress-fill");
const questionInstructionEl = document.getElementById("question-instruction");
const questionTextEl = document.getElementById("question-text");
const answerAreaEl = document.getElementById("answer-area");
const nextBtn = document.getElementById("next-btn");

const resultsScoreEl = document.getElementById("results-score");
const resultsCommentEl = document.getElementById("results-comment");
const resultsReviewEl = document.getElementById("results-review");
const restartBtn = document.getElementById("restart-btn");

let state = null;

function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ");
}

function pickChallenge() {
  const isQuiz = Math.random() < 0.5;

  let title;
  let count;

  if (isQuiz) {
    title = "Quiz: Mixed Tenses";
    count = 15;
  } else {
    title = "Test: Mixed Tenses";
    count = 18;
  }

  const questions = generateQuestions(null, count);

  return { mode: isQuiz ? "quiz" : "test", title, questions };
}

function startChallenge() {
  pickingEl.classList.remove("hidden");
  startBtn.disabled = true;

  setTimeout(() => {
    const challenge = pickChallenge();
    state = {
      title: challenge.title,
      questions: challenge.questions,
      index: 0,
      answers: [],
      selectedOption: null,
    };
    pickingEl.classList.add("hidden");
    startBtn.disabled = false;
    showScreen(quizScreen);
    renderQuestion();
  }, 700);
}

function showScreen(screen) {
  [startScreen, quizScreen, resultsScreen].forEach((s) => s.classList.add("hidden"));
  screen.classList.remove("hidden");
}

function renderQuestion() {
  const q = state.questions[state.index];
  quizTitleEl.textContent = state.title;
  quizProgressEl.textContent = `Question ${state.index + 1} / ${state.questions.length}`;
  progressFillEl.style.width = `${(state.index / state.questions.length) * 100}%`;

  nextBtn.disabled = true;
  nextBtn.textContent = state.index === state.questions.length - 1 ? "Finish 🏁" : "Next ➡";
  answerAreaEl.innerHTML = "";

  if (q.type === "mcq") {
    questionInstructionEl.textContent = "Choose the correct answer";
    questionTextEl.textContent = q.question;
    renderOptions(q.options, q.answer);
  } else if (q.type === "correction") {
    questionInstructionEl.textContent = "Find the correctly fixed sentence";
    questionTextEl.textContent = `"${q.brokenSentence}"`;
    renderOptions(q.options, q.answer);
  } else if (q.type === "fill") {
    questionInstructionEl.textContent = "Type the correct verb form";
    questionTextEl.textContent = q.question;
    renderFillInput();
  } else if (q.type === "formQuestion") {
    questionInstructionEl.textContent = "Form the question";
    questionTextEl.textContent = q.question;
    renderFillInput("Type the full question here...");
  } else if (q.type === "comprehension") {
    questionInstructionEl.textContent = "Read and choose the correct answer";
    questionTextEl.textContent = q.question;
    renderPassage(q.passage);
    renderOptions(q.options, q.answer);
  }
}

function renderPassage(text) {
  const passage = document.createElement("div");
  passage.className = "passage-card";
  passage.textContent = text;
  answerAreaEl.appendChild(passage);
}

function renderOptions(options, correctAnswer) {
  options.forEach((optionText) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.textContent = optionText;
    btn.addEventListener("click", () => {
      Array.from(answerAreaEl.querySelectorAll(".option-btn")).forEach((b) =>
        b.classList.remove("selected")
      );
      btn.classList.add("selected");
      recordAnswer(optionText, correctAnswer);
    });
    answerAreaEl.appendChild(btn);
  });
}

function renderFillInput(placeholder = "Type your answer here...") {
  const input = document.createElement("input");
  input.type = "text";
  input.className = "fill-input";
  input.placeholder = placeholder;
  input.addEventListener("input", () => {
    if (input.value.trim().length > 0) {
      recordAnswer(input.value, null, true);
    } else {
      nextBtn.disabled = true;
    }
  });
  answerAreaEl.appendChild(input);
  input.focus();
}

function recordAnswer(givenAnswer, correctAnswer, isFill) {
  state.pendingAnswer = { givenAnswer, isFill };
  nextBtn.disabled = false;
}

function evaluateCurrentQuestion() {
  const q = state.questions[state.index];
  const pending = state.pendingAnswer;
  let isCorrect = false;
  let givenAnswer = pending ? pending.givenAnswer : "";

  if (q.type === "fill" || q.type === "formQuestion") {
    const candidates = q.acceptable && q.acceptable.length ? q.acceptable : [q.answer];
    isCorrect = candidates.some((c) => normalize(c) === normalize(givenAnswer));
  } else {
    isCorrect = givenAnswer === q.answer;
  }

  state.answers.push({
    question: q,
    givenAnswer: givenAnswer || "(no answer)",
    isCorrect,
  });

  state.pendingAnswer = null;
}

function nextQuestion() {
  evaluateCurrentQuestion();

  if (state.index < state.questions.length - 1) {
    state.index += 1;
    renderQuestion();
  } else {
    progressFillEl.style.width = "100%";
    showResults();
  }
}

function showResults() {
  const total = state.answers.length;
  const correct = state.answers.filter((a) => a.isCorrect).length;
  const percent = Math.round((correct / total) * 100);

  resultsScoreEl.textContent = `${correct} / ${total} correct (${percent}%)`;

  let comment;
  if (percent >= 90) comment = "🏆 Amazing! You're a tenses superstar!";
  else if (percent >= 70) comment = "🎉 Great job! Keep practicing!";
  else if (percent >= 50) comment = "👍 Good effort! A little more practice will help.";
  else comment = "💪 Keep going! Practice makes perfect.";
  resultsCommentEl.textContent = comment;

  resultsReviewEl.innerHTML = "";
  state.answers.forEach((a, i) => {
    const q = a.question;
    const item = document.createElement("div");
    item.className = `review-item ${a.isCorrect ? "" : "incorrect"}`.trim();

    const questionLabel = q.type === "correction" ? q.brokenSentence : q.question;

    item.innerHTML = `
      <div class="review-question">${i + 1}. ${a.isCorrect ? "✅" : "❌"} ${escapeHtml(
      questionLabel
    )}</div>
      <div class="review-answer">Your answer: <strong>${escapeHtml(a.givenAnswer)}</strong></div>
      ${
        a.isCorrect
          ? ""
          : `<div class="review-answer">Correct answer: <strong>${escapeHtml(
              q.answer
            )}</strong></div>`
      }
      <div class="review-explanation">💡 ${escapeHtml(q.explanation)}</div>
    `;
    resultsReviewEl.appendChild(item);
  });

  showScreen(resultsScreen);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

startBtn.addEventListener("click", startChallenge);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", () => {
  state = null;
  showScreen(startScreen);
});

// English Tenses Challenge - app logic

const LEARNING_STATS_KEY = "englishTensesChallenge.learningStats.v1";
const RECENT_WINDOW = 20;
const MIN_ATTEMPTS_FOR_FOCUS = 4;
const MASTERY_THRESHOLD = 0.9;

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

const TYPE_LABELS = {
  mcq: "choose the correct word",
  fill: "choose the verb form for the gap",
  correction: "sentence correction",
  formQuestion: "choosing the correctly formed question",
  comprehension: "reading comprehension",
};

function normalize(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ");
}

function loadLearningStats() {
  try {
    return JSON.parse(localStorage.getItem(LEARNING_STATS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveLearningStats(stats) {
  localStorage.setItem(LEARNING_STATS_KEY, JSON.stringify(stats));
}

function areaKey(tense, type) {
  return `${tense}|${type}`;
}

function describeArea(area) {
  if (!area) return "";
  return `${TENSES[area.tense]} + ${TYPE_LABELS[area.type] || area.type}`;
}

function getAdaptiveFocus() {
  const stats = loadLearningStats();
  let weakest = null;

  Object.entries(stats).forEach(([key, history]) => {
    if (!Array.isArray(history) || history.length < MIN_ATTEMPTS_FOR_FOCUS) return;
    const [tense, type] = key.split("|");
    const total = history.length;
    const correct = history.filter(Boolean).length;
    const rate = correct / total;
    const mistakes = total - correct;

    if (rate >= MASTERY_THRESHOLD || mistakes === 0) return;
    if (!weakest || mistakes > weakest.mistakes || (mistakes === weakest.mistakes && rate < weakest.rate)) {
      weakest = { tense, type, total, correct, rate, mistakes };
    }
  });

  return weakest;
}

function recordLearningStats(answers) {
  const stats = loadLearningStats();

  answers.forEach(({ question, isCorrect }) => {
    const key = areaKey(question.tense, question.type);
    const history = Array.isArray(stats[key]) ? stats[key] : [];
    history.push(Boolean(isCorrect));
    stats[key] = history.slice(-RECENT_WINDOW);
  });

  saveLearningStats(stats);
}

function pickChallenge() {
  const isQuiz = Math.random() < 0.5;
  const focus = getAdaptiveFocus();

  let title;
  let count;

  if (isQuiz) {
    title = "Quiz: Mixed Tenses";
    count = 15;
  } else {
    title = "Test: Mixed Tenses";
    count = 18;
  }

  const questions = generateQuestions(null, count, { focus });

  return { mode: isQuiz ? "quiz" : "test", title, questions, focus };
}

function startChallenge() {
  pickingEl.classList.remove("hidden");
  startBtn.disabled = true;

  setTimeout(() => {
    const challenge = pickChallenge();
    state = {
      title: challenge.title,
      questions: challenge.questions,
      focus: challenge.focus,
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
    questionInstructionEl.textContent = "Choose the correct verb form";
    questionTextEl.textContent = q.question;
    renderOptions(q.options, q.answer, q.acceptable);
  } else if (q.type === "formQuestion") {
    questionInstructionEl.textContent = "Choose the correctly formed question";
    questionTextEl.textContent = q.question;
    renderOptions(q.options, q.answer, q.acceptable);
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

function renderOptions(options, correctAnswer, acceptable = []) {
  const correctAnswers = new Set([correctAnswer, ...acceptable].map(normalize));
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
      recordAnswer(optionText, null, false, correctAnswers.has(normalize(optionText)));
    });
    answerAreaEl.appendChild(btn);
  });
}

function recordAnswer(givenAnswer, correctAnswer, isFill, isCorrect) {
  state.pendingAnswer = { givenAnswer, isFill, isCorrect };
  nextBtn.disabled = false;
}

function evaluateCurrentQuestion() {
  const q = state.questions[state.index];
  const pending = state.pendingAnswer;
  let isCorrect = false;
  let givenAnswer = pending ? pending.givenAnswer : "";

  if (pending && typeof pending.isCorrect === "boolean") {
    isCorrect = pending.isCorrect;
  } else if (q.type === "fill" || q.type === "formQuestion") {
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
  recordLearningStats(state.answers);
  const nextFocus = getAdaptiveFocus();

  resultsScoreEl.textContent = `${correct} / ${total} correct (${percent}%)`;

  let comment;
  if (percent >= 90) comment = "🏆 Amazing! You're a tenses superstar!";
  else if (percent >= 70) comment = "🎉 Great job! Keep practicing!";
  else if (percent >= 50) comment = "👍 Good effort! A little more practice will help.";
  else comment = "💪 Keep going! Practice makes perfect.";
  if (nextFocus) {
    const focusRate = Math.round(nextFocus.rate * 100);
    comment += ` Next round will practice ${describeArea(nextFocus)} (${focusRate}% recently).`;
  } else {
    comment += " Weak areas are at 90%+ recently, so the next round will be fully mixed.";
  }
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

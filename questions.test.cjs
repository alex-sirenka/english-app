const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

let seed = 105673298;
const seededMath = Object.create(Math);
seededMath.random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
const context = vm.createContext({ Math: seededMath });
const generator = vm.runInContext(`${readFileSync(join(__dirname, "questions.js"), "utf8")}
  ({ TENSES, QUESTION_TYPES, VERBS, LESSON_VERBS, READING_PASSAGES,
    generateQuestions, makePresentPerfect, makeFormQuestion, makeSentenceOrderQuestion });`, context);

function validateChoices(question) {
  assert.ok(question.options.includes(question.answer));
  assert.ok(question.options.length >= 2);
  const normalized = question.options.map((option) => option.toLowerCase().trim());
  assert.equal(new Set(normalized).size, question.options.length);
  assert.ok(question.explanation);
}

test("Present Perfect keeps irregular participles separate from simple past", () => {
  const expected = { swim: "swum", ride: "ridden", eat: "eaten", drink: "drunk",
    go: "gone", fly: "flown", break: "broken", fall: "fallen", write: "written" };
  for (const [base, participle] of Object.entries(expected)) {
    assert.equal(generator.VERBS.find((verb) => verb.base === base).participle, participle);
  }
  assert.equal(generator.LESSON_VERBS.find((verb) => verb.base === "dig").participle, "dug");
});

test("mixed sessions retain all tenses and include both supplied learning themes", () => {
  for (let iteration = 0; iteration < 250; iteration++) {
    for (const count of [15, 18]) {
      const questions = generator.generateQuestions(null, count);
      assert.equal(questions.length, count);
      for (const tense of Object.keys(generator.TENSES)) {
        assert.ok(questions.some((question) => question.tense === tense), tense);
      }
      for (const type of generator.QUESTION_TYPES) {
        assert.ok(questions.some((question) => question.type === type), type);
      }
      assert.ok(questions.some((question) => question.material === "pumpkin"));
      assert.ok(questions.some((question) => question.tense === "presentPerfect" && question.type === "fill"));
      assert.ok(questions.some((question) => question.tense === "presentPerfect" && question.type === "sentenceOrder"));
      questions.forEach(validateChoices);
    }
  }
});

test("Present Perfect drills use correct agreement, participles and time references", () => {
  for (let iteration = 0; iteration < 500; iteration++) {
    for (const type of ["mcq", "fill", "correction"]) {
      const question = generator.makePresentPerfect(type);
      validateChoices(question);
      assert.ok(/\b(?:has|have|hasn't|haven't)\b/.test(question.answer));
      assert.ok(!/\b(?:yesterday|ago|last week|has swam|have swam)\b/.test(`${question.question || ""} ${question.answer}`));
      const sentence = type === "correction" ? question.answer : question.question;
      const singular = !sentence.startsWith("Tom and Anna ") && /^(?:He|She|Winnie|Tom|Anna|Grandma|My (?:brother|sister|dad|mom|teacher|best friend)) /.test(sentence);
      assert.ok(new RegExp(`\\b${singular ? "has" : "have"}(?:n't)? `).test(question.answer));
    }
    const question = generator.makeFormQuestion("presentPerfect");
    assert.ok(/^(?:Has|Have) /.test(question.answer));
    assert.ok(question.question.includes("Present Perfect"));
  }
});

test("word-order choices preserve exactly the same words", () => {
  const tokens = (text) => text.toLowerCase().replace(/\.$/, "").split(/\s+/).sort().join(" ");
  for (const tense of Object.keys(generator.TENSES)) {
    for (let iteration = 0; iteration < 100; iteration++) {
      const question = generator.makeSentenceOrderQuestion(tense);
      validateChoices(question);
      for (const option of question.options) assert.equal(tokens(option), tokens(question.answer));
    }
  }
});

test("Past Perfect expresses an action before a second past event", () => {
  for (const type of generator.QUESTION_TYPES) {
    const questions = generator.generateQuestions("pastPerfect", 18, { focus: { tense: "pastPerfect", type } });
    assert.equal(questions.length, 18);
    assert.ok(questions.every((question) => question.tense === "pastPerfect"));
    for (const question of questions) {
      validateChoices(question);
      if (question.type !== "comprehension") {
        assert.match(question.answer.toLowerCase(), /\bhad(?:n't)? /);
        assert.ok(`${question.question || ""} ${question.answer}`.includes("before the visitors arrived"));
      }
    }
  }
});

test("adaptive Present Perfect practice keeps its tense and valid reading coverage", () => {
  let focusedCount = 0;
  for (let iteration = 0; iteration < 50; iteration++) {
    const questions = generator.generateQuestions(null, 15, { focus: { tense: "presentPerfect", type: "correction" } });
    focusedCount += questions.filter((question) => question.tense === "presentPerfect" && question.type === "correction").length;
    assert.ok(questions.some((question) => question.tense === "presentPerfect" && question.type === "correction"));
  }
  assert.ok(focusedCount > 100, "Short mixed quizzes must leave room for adaptive practice");
  for (const type of generator.QUESTION_TYPES) {
    for (let iteration = 0; iteration < 50; iteration++) {
      const questions = generator.generateQuestions("presentPerfect", 18, { focus: { tense: "presentPerfect", type } });
      assert.equal(questions.length, 18);
      assert.ok(questions.every((question) => question.tense === "presentPerfect"));
      questions.forEach(validateChoices);
    }
  }
  assert.ok(generator.READING_PASSAGES.some((passage) => passage.passage.includes("golden sand")));
});
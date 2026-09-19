// English Tenses Challenge - question generator.
// Instead of a fixed list, questions are built on the fly by combining
// verbs x subjects x time phrases x sentence patterns. This gives many
// thousands of possible unique questions per tense, so every session
// (and every quiz/test) can look different.

const TENSES = {
  presentSimple: "Present Simple",
  presentContinuous: "Present Continuous",
  pastSimple: "Past Simple",
  pastContinuous: "Past Continuous",
};

const VERBS = [
  ["play", "plays", "playing", "played"],
  ["watch", "watches", "watching", "watched"],
  ["work", "works", "working", "worked"],
  ["clean", "cleans", "cleaning", "cleaned"],
  ["cook", "cooks", "cooking", "cooked"],
  ["study", "studies", "studying", "studied"],
  ["walk", "walks", "walking", "walked"],
  ["talk", "talks", "talking", "talked"],
  ["listen", "listens", "listening", "listened"],
  ["visit", "visits", "visiting", "visited"],
  ["open", "opens", "opening", "opened"],
  ["close", "closes", "closing", "closed"],
  ["help", "helps", "helping", "helped"],
  ["wash", "washes", "washing", "washed"],
  ["wait", "waits", "waiting", "waited"],
  ["finish", "finishes", "finishing", "finished"],
  ["start", "starts", "starting", "started"],
  ["stop", "stops", "stopping", "stopped"],
  ["plan", "plans", "planning", "planned"],
  ["dance", "dances", "dancing", "danced"],
  ["jump", "jumps", "jumping", "jumped"],
  ["climb", "climbs", "climbing", "climbed"],
  ["paint", "paints", "painting", "painted"],
  ["smile", "smiles", "smiling", "smiled"],
  ["laugh", "laughs", "laughing", "laughed"],
  ["travel", "travels", "traveling", "traveled"],
  ["carry", "carries", "carrying", "carried"],
  ["try", "tries", "trying", "tried"],
  ["cry", "cries", "crying", "cried"],
  ["call", "calls", "calling", "called"],
  ["live", "lives", "living", "lived"],
  ["love", "loves", "loving", "loved"],
  ["use", "uses", "using", "used"],
  ["move", "moves", "moving", "moved"],
  ["arrive", "arrives", "arriving", "arrived"],
  ["learn", "learns", "learning", "learned"],
  ["teach", "teaches", "teaching", "taught"],
  ["speak", "speaks", "speaking", "spoke"],
  ["sing", "sings", "singing", "sang"],
  ["go", "goes", "going", "went"],
  ["do", "does", "doing", "did"],
  ["have", "has", "having", "had"],
  ["eat", "eats", "eating", "ate"],
  ["drink", "drinks", "drinking", "drank"],
  ["run", "runs", "running", "ran"],
  ["swim", "swims", "swimming", "swam"],
  ["ride", "rides", "riding", "rode"],
  ["drive", "drives", "driving", "drove"],
  ["see", "sees", "seeing", "saw"],
  ["buy", "buys", "buying", "bought"],
  ["bring", "brings", "bringing", "brought"],
  ["make", "makes", "making", "made"],
  ["take", "takes", "taking", "took"],
  ["give", "gives", "giving", "gave"],
  ["send", "sends", "sending", "sent"],
  ["build", "builds", "building", "built"],
  ["draw", "draws", "drawing", "drew"],
  ["break", "breaks", "breaking", "broke"],
  ["feel", "feels", "feeling", "felt"],
  ["fall", "falls", "falling", "fell"],
  ["grow", "grows", "growing", "grew"],
  ["keep", "keeps", "keeping", "kept"],
  ["leave", "leaves", "leaving", "left"],
  ["lose", "loses", "losing", "lost"],
  ["meet", "meets", "meeting", "met"],
  ["pay", "pays", "paying", "paid"],
  ["ring", "rings", "ringing", "rang"],
  ["rise", "rises", "rising", "rose"],
  ["sell", "sells", "selling", "sold"],
  ["sit", "sits", "sitting", "sat"],
  ["sleep", "sleeps", "sleeping", "slept"],
  ["stand", "stands", "standing", "stood"],
  ["tell", "tells", "telling", "told"],
  ["think", "thinks", "thinking", "thought"],
  ["throw", "throws", "throwing", "threw"],
  ["understand", "understands", "understanding", "understood"],
  ["wear", "wears", "wearing", "wore"],
  ["win", "wins", "winning", "won"],
  ["write", "writes", "writing", "wrote"],
  ["fly", "flies", "flying", "flew"],
  ["catch", "catches", "catching", "caught"],
].map(([base, s, ing, past]) => ({ base, s, ing, past }));

const CAT_I = { be: "am", wasWere: "was", doAux: "do", doNeg: "don't", verbForm: (v) => v.base };
const CAT_S3 = { be: "is", wasWere: "was", doAux: "does", doNeg: "doesn't", verbForm: (v) => v.s };
const CAT_P2 = { be: "are", wasWere: "were", doAux: "do", doNeg: "don't", verbForm: (v) => v.base };

const SUBJECTS = [
  { text: "I", cat: CAT_I },
  { text: "You", cat: CAT_P2 },
  { text: "We", cat: CAT_P2 },
  { text: "They", cat: CAT_P2 },
  { text: "He", cat: CAT_S3 },
  { text: "She", cat: CAT_S3 },
  { text: "It", cat: CAT_S3 },
  { text: "Tom", cat: CAT_S3, proper: true },
  { text: "Anna", cat: CAT_S3, proper: true },
  { text: "Grandma", cat: CAT_S3, proper: true },
  { text: "My brother", cat: CAT_S3 },
  { text: "My sister", cat: CAT_S3 },
  { text: "My dad", cat: CAT_S3 },
  { text: "My mom", cat: CAT_S3 },
  { text: "My teacher", cat: CAT_S3 },
  { text: "My best friend", cat: CAT_S3 },
  { text: "The cat", cat: CAT_S3 },
  { text: "The dog", cat: CAT_S3 },
  { text: "My parents", cat: CAT_P2 },
  { text: "The children", cat: CAT_P2 },
  { text: "My friends", cat: CAT_P2 },
  { text: "The students", cat: CAT_P2 },
  { text: "Tom and Anna", cat: CAT_P2, proper: true },
  { text: "My grandparents", cat: CAT_P2 },
];

const PS_PHRASES = ["every day", "every morning", "every weekend", "on Saturdays", "on Sundays", "twice a week", "every summer", "every year", "after school", "before breakfast"];
const PC_PHRASES = ["right now", "at the moment", "today", "this week", "these days"];
const PAST_PHRASES = ["yesterday", "last week", "last night", "last weekend", "last year", "a few days ago", "last Friday", "last summer"];
const PAST_CONT_EVENTS = ["the phone rang", "I arrived", "it started to rain", "she called me", "the teacher walked in", "we saw him", "the lights went out", "my mom came home", "the bell rang", "he knocked on the door", "the music stopped", "it began to snow"];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sampleN(arr, n) {
  return shuffleArray(arr).slice(0, n);
}

function uniq(arr) {
  return [...new Set(arr)];
}

function lowerSubject(subject) {
  if (subject.proper || subject.text === "I") return subject.text;
  return subject.text.charAt(0).toLowerCase() + subject.text.slice(1);
}

function isRegularPast(verb) {
  const b = verb.base;
  const candidates = [b + "ed", b.endsWith("e") ? b + "d" : null, b.replace(/y$/, "ied"), b + b.slice(-1) + "ed"].filter(Boolean);
  return candidates.includes(verb.past);
}

// ---------------- PRESENT SIMPLE ----------------

function explainPresentSimple(subject) {
  if (subject.cat === CAT_S3) return "He/she/it (and singular names or nouns) need -s in the Present Simple.";
  if (subject.cat === CAT_I) return "With 'I', use the base verb form (no -s) in the Present Simple.";
  return "With you/we/they (and plural nouns), use the base verb form (no -s) in the Present Simple.";
}

function makePresentSimple(type) {
  const subject = randomChoice(SUBJECTS);
  const verb = randomChoice(VERBS);
  const correct = subject.cat.verbForm(verb);
  const explanation = explainPresentSimple(subject);
  const phrase = randomChoice(PS_PHRASES);

  if (type === "mcq") {
    const wrongPool = uniq([verb.base, verb.s, verb.ing, verb.past]).filter((c) => c !== correct);
    const options = shuffleArray([correct, ...sampleN(wrongPool, 3)]);
    return {
      tense: "presentSimple", type: "mcq",
      question: `${subject.text} ___ ${phrase}.`,
      options, answer: correct, explanation,
      sig: `presentSimple|mcq|${subject.text}|${verb.base}|${phrase}`,
    };
  }

  if (type === "fill") {
    const mode = randomChoice(["affirmative", "negative", "question"]);
    if (mode === "negative") {
      const answer = `${subject.cat.doNeg} ${verb.base}`;
      const alt = subject.cat.doNeg === "doesn't" ? `does not ${verb.base}` : `do not ${verb.base}`;
      return {
        tense: "presentSimple", type: "fill",
        question: `${subject.text} ___ (not / ${verb.base}) ${phrase}.`,
        answer, acceptable: [answer, alt], explanation: "Negative Present Simple: don't/doesn't + base verb.",
        sig: `presentSimple|fill-neg|${subject.text}|${verb.base}|${phrase}`,
      };
    }
    if (mode === "question") {
      const subjLower = lowerSubject(subject);
      const answer = `${subject.cat.doAux} ${subjLower} ${verb.base}`;
      return {
        tense: "presentSimple", type: "fill",
        question: `___ ${subjLower} ___ (${verb.base}) ${phrase}?`,
        answer, acceptable: [answer], explanation: "Questions in Present Simple: Do/Does + subject + base verb.",
        sig: `presentSimple|fill-q|${subject.text}|${verb.base}|${phrase}`,
      };
    }
    return {
      tense: "presentSimple", type: "fill",
      question: `${subject.text} ___ (${verb.base}) ${phrase}.`,
      answer: correct, acceptable: [correct], explanation,
      sig: `presentSimple|fill-aff|${subject.text}|${verb.base}|${phrase}`,
    };
  }

  // correction
  const correctSentence = `${subject.text} ${correct} ${phrase}.`;
  const wrongPool = uniq([verb.base, verb.s, verb.ing, verb.past]).filter((c) => c !== correct);
  const wrongSentences = sampleN(wrongPool, 3).map((f) => `${subject.text} ${f} ${phrase}.`);
  return {
    tense: "presentSimple", type: "correction",
    brokenSentence: wrongSentences[0],
    options: shuffleArray([correctSentence, ...wrongSentences]),
    answer: correctSentence, explanation,
    sig: `presentSimple|corr|${subject.text}|${verb.base}|${phrase}`,
  };
}

// ---------------- PRESENT CONTINUOUS ----------------

function presentContinuousFrame() {
  if (Math.random() < 0.3) {
    return { prefix: `${randomChoice(["Look!", "Listen!"])} `, phraseText: "" };
  }
  return { prefix: "", phraseText: ` ${randomChoice(PC_PHRASES)}` };
}

function makePresentContinuous(type) {
  const subject = randomChoice(SUBJECTS);
  const verb = randomChoice(VERBS);
  const correct = `${subject.cat.be} ${verb.ing}`;
  const explanation = `Use am/is/are + verb-ing (here: ${correct}) for actions happening now.`;
  const others = ["am", "is", "are"].filter((b) => b !== subject.cat.be);
  const wrongPool = uniq([subject.cat.verbForm(verb), verb.past, `${others[0]} ${verb.ing}`, `${others[1]} ${verb.ing}`]).filter((c) => c !== correct);

  if (type === "mcq") {
    const { prefix, phraseText } = presentContinuousFrame();
    const options = shuffleArray([correct, ...sampleN(wrongPool, 3)]);
    return {
      tense: "presentContinuous", type: "mcq",
      question: `${prefix}${subject.text} ___${phraseText}.`,
      options, answer: correct, explanation,
      sig: `presentContinuous|mcq|${subject.text}|${verb.base}|${prefix}|${phraseText}`,
    };
  }

  if (type === "fill") {
    const mode = randomChoice(["affirmative", "negative", "question"]);
    if (mode === "negative") {
      const answer = subject.cat === CAT_I ? `am not ${verb.ing}` : `${subject.cat.be}n't ${verb.ing}`;
      const alt = subject.cat === CAT_I ? `'m not ${verb.ing}` : `${subject.cat.be} not ${verb.ing}`;
      return {
        tense: "presentContinuous", type: "fill",
        question: `${subject.text} ___ (not / ${verb.base}) right now.`,
        answer, acceptable: [answer, alt], explanation: "Negative Present Continuous: am/is/are + not + verb-ing.",
        sig: `presentContinuous|fill-neg|${subject.text}|${verb.base}`,
      };
    }
    if (mode === "question") {
      const subjLower = lowerSubject(subject);
      const phrase = randomChoice(PC_PHRASES);
      const answer = `${subject.cat.be} ${subjLower} ${verb.ing}`;
      return {
        tense: "presentContinuous", type: "fill",
        question: `___ ${subjLower} ___ (${verb.base}) ${phrase}?`,
        answer, acceptable: [answer], explanation: "Questions in Present Continuous: Am/Is/Are + subject + verb-ing.",
        sig: `presentContinuous|fill-q|${subject.text}|${verb.base}|${phrase}`,
      };
    }
    const { prefix, phraseText } = presentContinuousFrame();
    return {
      tense: "presentContinuous", type: "fill",
      question: `${prefix}${subject.text} ___ (${verb.base})${phraseText}.`,
      answer: correct, acceptable: [correct], explanation,
      sig: `presentContinuous|fill-aff|${subject.text}|${verb.base}|${prefix}|${phraseText}`,
    };
  }

  // correction
  const { prefix, phraseText } = presentContinuousFrame();
  const correctSentence = `${prefix}${subject.text} ${correct}${phraseText}.`;
  const wrongSentences = sampleN(wrongPool, 3).map((f) => `${prefix}${subject.text} ${f}${phraseText}.`);
  return {
    tense: "presentContinuous", type: "correction",
    brokenSentence: wrongSentences[0],
    options: shuffleArray([correctSentence, ...wrongSentences]),
    answer: correctSentence, explanation,
    sig: `presentContinuous|corr|${subject.text}|${verb.base}|${prefix}|${phraseText}`,
  };
}

// ---------------- PAST SIMPLE ----------------

function makePastSimple(type) {
  const subject = randomChoice(SUBJECTS);
  const verb = randomChoice(VERBS);
  const correct = verb.past;
  const explanation = isRegularPast(verb)
    ? `Regular verbs add -ed for the Past Simple: ${verb.base} → ${verb.past}.`
    : `'${verb.base}' is irregular; the past form is '${verb.past}'.`;
  const phrase = randomChoice(PAST_PHRASES);
  const wrongPool = uniq([verb.base, verb.s, verb.ing]).filter((c) => c !== correct);

  if (type === "mcq") {
    const options = shuffleArray([correct, ...sampleN(wrongPool, Math.min(3, wrongPool.length))]);
    return {
      tense: "pastSimple", type: "mcq",
      question: `${subject.text} ___ ${phrase}.`,
      options, answer: correct, explanation,
      sig: `pastSimple|mcq|${subject.text}|${verb.base}|${phrase}`,
    };
  }

  if (type === "fill") {
    const mode = randomChoice(["affirmative", "negative", "question"]);
    if (mode === "negative") {
      const answer = `didn't ${verb.base}`;
      return {
        tense: "pastSimple", type: "fill",
        question: `${subject.text} ___ (not / ${verb.base}) ${phrase}.`,
        answer, acceptable: [answer, `did not ${verb.base}`], explanation: "Negative Past Simple: didn't + base verb.",
        sig: `pastSimple|fill-neg|${subject.text}|${verb.base}|${phrase}`,
      };
    }
    if (mode === "question") {
      const subjLower = lowerSubject(subject);
      const answer = `did ${subjLower} ${verb.base}`;
      return {
        tense: "pastSimple", type: "fill",
        question: `___ ${subjLower} ___ (${verb.base}) ${phrase}?`,
        answer, acceptable: [answer], explanation: "Questions in Past Simple: Did + subject + base verb.",
        sig: `pastSimple|fill-q|${subject.text}|${verb.base}|${phrase}`,
      };
    }
    return {
      tense: "pastSimple", type: "fill",
      question: `${subject.text} ___ (${verb.base}) ${phrase}.`,
      answer: correct, acceptable: [correct], explanation,
      sig: `pastSimple|fill-aff|${subject.text}|${verb.base}|${phrase}`,
    };
  }

  // correction
  const correctSentence = `${subject.text} ${correct} ${phrase}.`;
  const wrongSentences = sampleN(wrongPool, Math.min(3, wrongPool.length)).map((f) => `${subject.text} ${f} ${phrase}.`);
  return {
    tense: "pastSimple", type: "correction",
    brokenSentence: wrongSentences[0],
    options: shuffleArray([correctSentence, ...wrongSentences]),
    answer: correctSentence, explanation,
    sig: `pastSimple|corr|${subject.text}|${verb.base}|${phrase}`,
  };
}

// ---------------- PAST CONTINUOUS ----------------

function makePastContinuous(type) {
  const subject = randomChoice(SUBJECTS);
  const verb = randomChoice(VERBS);
  const correct = `${subject.cat.wasWere} ${verb.ing}`;
  const explanation = `Use was/were + verb-ing (here: ${correct}) for an action in progress in the past.`;
  const event = randomChoice(PAST_CONT_EVENTS);
  const otherWasWere = subject.cat.wasWere === "was" ? "were" : "was";
  const wrongPool = uniq([subject.cat.verbForm(verb), verb.past, `${otherWasWere} ${verb.ing}`, `${subject.cat.wasWere} ${verb.base}`]).filter((c) => c !== correct);

  if (type === "mcq") {
    const options = shuffleArray([correct, ...sampleN(wrongPool, 3)]);
    return {
      tense: "pastContinuous", type: "mcq",
      question: `${subject.text} ___ when ${event}.`,
      options, answer: correct, explanation,
      sig: `pastContinuous|mcq|${subject.text}|${verb.base}|${event}`,
    };
  }

  if (type === "fill") {
    const mode = randomChoice(["affirmative", "negative", "question"]);
    if (mode === "negative") {
      const answer = `${subject.cat.wasWere}n't ${verb.ing}`;
      return {
        tense: "pastContinuous", type: "fill",
        question: `${subject.text} ___ (not / ${verb.base}) when ${event}.`,
        answer, acceptable: [answer, `${subject.cat.wasWere} not ${verb.ing}`], explanation: "Negative Past Continuous: wasn't/weren't + verb-ing.",
        sig: `pastContinuous|fill-neg|${subject.text}|${verb.base}|${event}`,
      };
    }
    if (mode === "question") {
      const subjLower = lowerSubject(subject);
      const answer = `${subject.cat.wasWere} ${subjLower} ${verb.ing}`;
      return {
        tense: "pastContinuous", type: "fill",
        question: `___ ${subjLower} ___ (${verb.base}) when ${event}?`,
        answer, acceptable: [answer], explanation: "Questions in Past Continuous: Was/Were + subject + verb-ing.",
        sig: `pastContinuous|fill-q|${subject.text}|${verb.base}|${event}`,
      };
    }
    return {
      tense: "pastContinuous", type: "fill",
      question: `${subject.text} ___ (${verb.base}) when ${event}.`,
      answer: correct, acceptable: [correct], explanation,
      sig: `pastContinuous|fill-aff|${subject.text}|${verb.base}|${event}`,
    };
  }

  // correction
  const correctSentence = `${subject.text} ${correct} when ${event}.`;
  const wrongSentences = sampleN(wrongPool, 3).map((f) => `${subject.text} ${f} when ${event}.`);
  return {
    tense: "pastContinuous", type: "correction",
    brokenSentence: wrongSentences[0],
    options: shuffleArray([correctSentence, ...wrongSentences]),
    answer: correctSentence, explanation,
    sig: `pastContinuous|corr|${subject.text}|${verb.base}|${event}`,
  };
}

const TENSE_BUILDERS = {
  presentSimple: makePresentSimple,
  presentContinuous: makePresentContinuous,
  pastSimple: makePastSimple,
  pastContinuous: makePastContinuous,
};

const QUESTION_TYPES = ["mcq", "fill", "correction"];

// tenseFilter: a tense key to restrict to (quiz mode), or null for any tense (test mode).
function generateQuestions(tenseFilter, count) {
  const tenseKeys = tenseFilter ? [tenseFilter] : Object.keys(TENSES);
  const seen = new Set();
  const result = [];
  const maxAttempts = count * 80;
  let attempts = 0;

  while (result.length < count && attempts < maxAttempts) {
    attempts += 1;
    const tenseKey = randomChoice(tenseKeys);
    const type = randomChoice(QUESTION_TYPES);
    const q = TENSE_BUILDERS[tenseKey](type);
    if (seen.has(q.sig)) continue;
    seen.add(q.sig);
    delete q.sig;
    result.push(q);
  }
  return result;
}

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
  futureSimple: "Future Simple",
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

const VERB_COMPLEMENTS = {
  play: " football",
  watch: " the fish",
  work: " on a little boat",
  clean: " the goggles",
  cook: " fish soup",
  study: " English",
  walk: " along the shore",
  talk: " to a friend on the beach",
  listen: " to the waves",
  visit: " a small island",
  open: " the hut door",
  close: " the yellow box",
  help: " my friend",
  wash: " the flippers",
  wait: " for the boat",
  finish: " the map",
  start: " the adventure",
  stop: " near the rocks",
  plan: " an island trip",
  dance: " on the sand",
  jump: " into the water",
  climb: " a coconut tree",
  paint: " a bright fish",
  smile: " at the camera",
  laugh: " at the funny crab",
  travel: " to a little island",
  carry: " a beach bag",
  try: " the flippers",
  cry: " near the wet towel",
  call: " from the shore",
  live: " near the sea",
  love: " the blue water",
  use: " a map",
  move: " the towel",
  arrive: " at the island",
  learn: " sea words",
  teach: " English",
  speak: " English",
  sing: " a sea song",
  go: " to the beach",
  do: " a treasure hunt",
  have: " a lovely swim",
  eat: " coconut cake",
  drink: " cold juice",
  run: " across the sand",
  swim: " under the waves",
  ride: " in a yellow boat",
  drive: " to the beach",
  see: " a dolphin",
  buy: " a postcard",
  bring: " a towel",
  make: " a sandcastle",
  take: " a photo of the sea",
  give: " a shell to a friend",
  send: " a postcard",
  build: " a sandcastle",
  draw: " a sea turtle",
  break: " a shell",
  feel: " happy",
  fall: " into the warm sand",
  grow: " palm trees",
  keep: " a shell collection",
  leave: " the island",
  lose: " the magic wand",
  meet: " a friendly dolphin",
  pay: " for ice cream",
  ring: " the little bell",
  rise: " above the waves",
  sell: " lemonade on the beach",
  sit: " under a palm tree",
  sleep: " in the beach hut",
  stand: " near the water",
  tell: " a sea story",
  think: " about the island",
  throw: " a shell into the sea",
  understand: " the map",
  wear: " swimming goggles",
  win: " the beach game",
  write: " a postcard",
  fly: " a kite",
  catch: " a little fish",
};

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
  { text: "Tom", cat: CAT_S3, proper: true },
  { text: "Anna", cat: CAT_S3, proper: true },
  { text: "Grandma", cat: CAT_S3, proper: true },
  { text: "My brother", cat: CAT_S3 },
  { text: "My sister", cat: CAT_S3 },
  { text: "My dad", cat: CAT_S3 },
  { text: "My mom", cat: CAT_S3 },
  { text: "My teacher", cat: CAT_S3 },
  { text: "My best friend", cat: CAT_S3 },
  { text: "My parents", cat: CAT_P2 },
  { text: "The children", cat: CAT_P2 },
  { text: "My friends", cat: CAT_P2 },
  { text: "The students", cat: CAT_P2 },
  { text: "Tom and Anna", cat: CAT_P2, proper: true },
  { text: "My grandparents", cat: CAT_P2 },
];

const PS_PHRASES = ["every day", "every morning", "every weekend", "on Saturdays", "on Sundays", "twice a week", "after school", "in the evening"];
const PC_PHRASES = ["right now", "at the moment", "today"];
const PAST_PHRASES = ["yesterday", "last week", "last weekend", "a few days ago", "last Friday", "after school", "in the evening"];
const PAST_CONT_EVENTS = ["the phone rang", "it started to rain", "someone walked in", "the lights went out", "someone came home", "the bell rang", "someone knocked on the door", "the music stopped", "it began to snow", "the lesson started"];
const FUTURE_PHRASES = ["tomorrow", "next week", "next weekend", "soon", "after school", "in the evening"];

const READING_PASSAGES = [
  {
    tense: "pastSimple",
    passage: "Mira found a tiny island with golden sand and tall palm trees. She packed her goggles, took a map, and walked to the beach hut.",
    question: "What did Mira take with her?",
    options: ["A map", "A football", "A red jacket", "A cake"],
    answer: "A map",
    explanation: "The passage says she took a map.",
  },
  {
    tense: "pastContinuous",
    passage: "Sam was swimming under the waves when he saw a green turtle. His sister was taking photos from the little yellow boat.",
    question: "What was Sam doing when he saw the turtle?",
    options: ["He was swimming", "He was sleeping", "He was cooking", "He was writing"],
    answer: "He was swimming",
    explanation: "The action in progress was: Sam was swimming.",
  },
  {
    tense: "presentSimple",
    passage: "Lena loves the sea. Every weekend she watches the fish, listens to the waves, and writes new words in her notebook.",
    question: "What does Lena write in her notebook?",
    options: ["New words", "A shopping list", "A song", "A map"],
    answer: "New words",
    explanation: "The passage says she writes new words in her notebook.",
  },
  {
    tense: "presentContinuous",
    passage: "Look! The children are building a sandcastle. Their parents are sitting under a palm tree and watching the blue sea.",
    question: "What are the children building?",
    options: ["A sandcastle", "A submarine", "A beach hut", "A boat"],
    answer: "A sandcastle",
    explanation: "The passage says the children are building a sandcastle.",
  },
  {
    tense: "pastSimple",
    passage: "The little cat hated the cold water, so it climbed a coconut tree. Later, it slept in the warm sun.",
    question: "Why did the cat climb the tree?",
    options: ["It hated the cold water", "It wanted a postcard", "It lost a shell", "It saw a rainbow"],
    answer: "It hated the cold water",
    explanation: "The cat climbed the tree because it hated the cold water.",
  },
  {
    tense: "pastContinuous",
    passage: "Nina was looking for her silver wand when the bell rang. It was behind a big rock near the shore.",
    question: "Where was the wand?",
    options: ["Behind a big rock", "In a school bag", "On a bus", "Under a bed"],
    answer: "Behind a big rock",
    explanation: "The passage says the wand was behind a big rock.",
  },
  {
    tense: "futureSimple",
    passage: "Tomorrow Ben will visit a small island. He will take his goggles and a map, but he will not take his bike.",
    question: "What will Ben take tomorrow?",
    options: ["His goggles and a map", "His bike", "A football", "A red jacket"],
    answer: "His goggles and a map",
    explanation: "The passage says Ben will take his goggles and a map.",
  },
];

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

function capitalizeFirst(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function complementFor(verb) {
  return VERB_COMPLEMENTS[verb.base] || "";
}

function selectVerbFor(tenseKey) {
  const awkwardEverywhere = new Set(["grow", "rise", "stop"]);
  const awkwardContinuous = new Set(["feel", "love", "see", "understand"]);
  return randomChoice(
    VERBS.filter((verb) => {
      if (awkwardEverywhere.has(verb.base)) return false;
      if ((tenseKey === "presentContinuous" || tenseKey === "pastContinuous") && awkwardContinuous.has(verb.base)) return false;
      return true;
    })
  );
}

function isRegularPast(verb) {
  const b = verb.base;
  const candidates = [b + "ed", b.endsWith("e") ? b + "d" : null, b.replace(/y$/, "ied"), b + b.slice(-1) + "ed"].filter(Boolean);
  return candidates.includes(verb.past);
}

function mutateWord(text, index, replacement) {
  const words = text.split(/\s+/);
  const current = words[index];
  const punctuation = current.match(/[?!.,;:]+$/)?.[0] || "";
  words[index] = `${replacement}${punctuation}`;
  return words.join(" ");
}

function normalizeChoice(value) {
  return value.toLowerCase().trim().replace(/[.!?]+$/g, "").replace(/\s+/g, " ");
}

function makeSelectableOptions(question) {
  const answer = question.answer;
  const accepted = new Set([answer, ...(question.acceptable || [])].map(normalizeChoice));
  const candidates = [...accepted].map((value) => {
    const matching = [answer, ...(question.acceptable || [])].find((item) => normalizeChoice(item) === value);
    return matching || value;
  });
  const answerWords = answer.split(/\s+/);
  const verbVariants = new Map();

  answerWords.forEach((word, index) => {
    const bare = word.toLowerCase().replace(/[?!.,;:]+$/g, "");
    const verb = VERBS.find((item) => [item.base, item.s, item.ing, item.past].includes(bare));
    if (verb) verbVariants.set(index, [verb.base, verb.s, verb.ing, verb.past]);
  });

  verbVariants.forEach((forms, index) => {
    forms.forEach((form) => candidates.push(mutateWord(answer, index, form)));
  });

  const auxiliaryChoices = {
    presentSimple: ["do", "does", "don't", "doesn't", "did", "didn't"],
    presentContinuous: ["am", "is", "are", "was", "were"],
    pastSimple: ["did", "didn't", "do", "does", "was", "were"],
    pastContinuous: ["was", "were", "is", "are", "did"],
    futureSimple: ["will", "won't", "do", "does", "did"],
  }[question.tense] || [];

  if (answerWords.length > 1) {
    auxiliaryChoices.forEach((auxiliary) => candidates.push(mutateWord(answer, 0, auxiliary)));
  }

  if (question.type === "formQuestion" && question.subjectText && answerWords.length > 2) {
    const subjectWordCount = question.subjectText.split(/\s+/).length;
    const auxiliary = answerWords[0];
    const subjectWords = answerWords.slice(1, subjectWordCount + 1).join(" ");
    const remaining = answerWords.slice(subjectWordCount + 1).join(" ");
    candidates.push(`${capitalizeFirst(subjectWords)} ${auxiliary.toLowerCase()} ${remaining}`);
    verbVariants.forEach((forms, index) => {
      if (index === subjectWordCount + 1) {
        forms.forEach((form) => candidates.push(mutateWord(answer, index, form)));
      }
    });
  }

  const options = [];
  const seen = new Set();
  candidates.forEach((candidate) => {
    const key = normalizeChoice(candidate);
    if (!key || seen.has(key)) return;
    seen.add(key);
    options.push(candidate);
  });

  if (options.length < 4) {
    const fallbackForms = ["do", "does", "did", "will", "am", "is", "are", "was", "were"];
    fallbackForms.forEach((form) => {
      if (options.length >= 4 || answerWords.length === 0) return;
      const candidate = mutateWord(answer, 0, form);
      const key = normalizeChoice(candidate);
      if (!seen.has(key) && !accepted.has(key)) {
        seen.add(key);
        options.push(candidate);
      }
    });
  }

  const correctOptions = options.filter((option) => accepted.has(normalizeChoice(option)));
  const distractors = options.filter((option) => !accepted.has(normalizeChoice(option)));
  return shuffleArray([...correctOptions, ...distractors].slice(0, 4));
}

function makeFormQuestion(tenseKey) {
  const subject = randomChoice(SUBJECTS);
  const verb = selectVerbFor(tenseKey);
  const subjLower = lowerSubject(subject);
  const complement = complementFor(verb);
  let answer;
  let prompt;
  let explanation;

  if (tenseKey === "presentSimple") {
    const phrase = randomChoice(PS_PHRASES);
    answer = `${capitalizeFirst(subject.cat.doAux)} ${subjLower} ${verb.base}${complement} ${phrase}?`;
    prompt = `${subject.text} / ${verb.base}${complement} / ${phrase}`;
    explanation = "Present Simple questions use Do/Does + subject + base verb.";
  } else if (tenseKey === "presentContinuous") {
    const phrase = randomChoice(PC_PHRASES);
    answer = `${capitalizeFirst(subject.cat.be)} ${subjLower} ${verb.ing}${complement} ${phrase}?`;
    prompt = `${subject.text} / ${verb.base}${complement} / ${phrase}`;
    explanation = "Present Continuous questions use Am/Is/Are + subject + verb-ing.";
  } else if (tenseKey === "pastSimple") {
    const phrase = randomChoice(PAST_PHRASES);
    answer = `Did ${subjLower} ${verb.base}${complement} ${phrase}?`;
    prompt = `${subject.text} / ${verb.base}${complement} / ${phrase}`;
    explanation = "Past Simple questions use Did + subject + base verb.";
  } else if (tenseKey === "pastContinuous") {
    const event = randomChoice(PAST_CONT_EVENTS);
    answer = `${capitalizeFirst(subject.cat.wasWere)} ${subjLower} ${verb.ing}${complement} when ${event}?`;
    prompt = `${subject.text} / ${verb.base}${complement} / when ${event}`;
    explanation = "Past Continuous questions use Was/Were + subject + verb-ing.";
  } else {
    const phrase = randomChoice(FUTURE_PHRASES);
    answer = `Will ${subjLower} ${verb.base}${complement} ${phrase}?`;
    prompt = `${subject.text} / ${verb.base}${complement} / ${phrase}`;
    explanation = "Future Simple questions use Will + subject + base verb.";
  }

  return {
    tense: tenseKey,
    type: "formQuestion",
    question: `Make a question: ${prompt}`,
    subjectText: subjLower,
    baseVerb: verb.base,
    answer,
    acceptable: [answer],
    explanation,
    sig: `formQuestion|${tenseKey}|${prompt}`,
  };
}

// ---------------- PRESENT SIMPLE ----------------

function explainPresentSimple(subject) {
  if (subject.cat === CAT_S3) return "He/she/it (and singular names or nouns) need -s in the Present Simple.";
  if (subject.cat === CAT_I) return "With 'I', use the base verb form (no -s) in the Present Simple.";
  return "With you/we/they (and plural nouns), use the base verb form (no -s) in the Present Simple.";
}

function makePresentSimple(type) {
  const subject = randomChoice(SUBJECTS);
  const verb = selectVerbFor("presentSimple");
  const correct = subject.cat.verbForm(verb);
  const explanation = explainPresentSimple(subject);
  const phrase = randomChoice(PS_PHRASES);

  if (type === "mcq") {
    const wrongPool = uniq([verb.base, verb.s, verb.ing, verb.past]).filter((c) => c !== correct);
    const options = shuffleArray([correct, ...sampleN(wrongPool, 3)]);
    return {
      tense: "presentSimple", type: "mcq",
      question: `${subject.text} ___${complementFor(verb)} ${phrase}.`,
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
        question: `${subject.text} ___ (not / ${verb.base})${complementFor(verb)} ${phrase}.`,
        answer, acceptable: [answer, alt], explanation: "Negative Present Simple: don't/doesn't + base verb.",
        sig: `presentSimple|fill-neg|${subject.text}|${verb.base}|${phrase}`,
      };
    }
    if (mode === "question") {
      const subjLower = lowerSubject(subject);
      const answer = `${subject.cat.doAux} ${subjLower} ${verb.base}`;
      return {
        tense: "presentSimple", type: "fill",
        question: `___ ${subjLower} ___ (${verb.base})${complementFor(verb)} ${phrase}?`,
        answer, acceptable: [answer], explanation: "Questions in Present Simple: Do/Does + subject + base verb.",
        sig: `presentSimple|fill-q|${subject.text}|${verb.base}|${phrase}`,
      };
    }
    return {
      tense: "presentSimple", type: "fill",
      question: `${subject.text} ___ (${verb.base})${complementFor(verb)} ${phrase}.`,
      answer: correct, acceptable: [correct], explanation,
      sig: `presentSimple|fill-aff|${subject.text}|${verb.base}|${phrase}`,
    };
  }

  // correction
  const correctSentence = `${subject.text} ${correct}${complementFor(verb)} ${phrase}.`;
  const wrongPool = uniq([verb.base, verb.s, verb.ing, verb.past]).filter((c) => c !== correct);
  const wrongSentences = sampleN(wrongPool, 3).map((f) => `${subject.text} ${f}${complementFor(verb)} ${phrase}.`);
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
  const verb = selectVerbFor("presentContinuous");
  const correct = `${subject.cat.be} ${verb.ing}`;
  const explanation = `Use am/is/are + verb-ing (here: ${correct}) for actions happening now.`;
  const others = ["am", "is", "are"].filter((b) => b !== subject.cat.be);
  const wrongPool = uniq([subject.cat.verbForm(verb), verb.past, `${others[0]} ${verb.ing}`, `${others[1]} ${verb.ing}`]).filter((c) => c !== correct);

  if (type === "mcq") {
    const { prefix, phraseText } = presentContinuousFrame();
    const options = shuffleArray([correct, ...sampleN(wrongPool, 3)]);
    return {
      tense: "presentContinuous", type: "mcq",
      question: `${prefix}${subject.text} ___${complementFor(verb)}${phraseText}.`,
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
        question: `${subject.text} ___ (not / ${verb.base})${complementFor(verb)} right now.`,
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
        question: `___ ${subjLower} ___ (${verb.base})${complementFor(verb)} ${phrase}?`,
        answer, acceptable: [answer], explanation: "Questions in Present Continuous: Am/Is/Are + subject + verb-ing.",
        sig: `presentContinuous|fill-q|${subject.text}|${verb.base}|${phrase}`,
      };
    }
    const { prefix, phraseText } = presentContinuousFrame();
    return {
      tense: "presentContinuous", type: "fill",
      question: `${prefix}${subject.text} ___ (${verb.base})${complementFor(verb)}${phraseText}.`,
      answer: correct, acceptable: [correct], explanation,
      sig: `presentContinuous|fill-aff|${subject.text}|${verb.base}|${prefix}|${phraseText}`,
    };
  }

  // correction
  const { prefix, phraseText } = presentContinuousFrame();
  const correctSentence = `${prefix}${subject.text} ${correct}${complementFor(verb)}${phraseText}.`;
  const wrongSentences = sampleN(wrongPool, 3).map((f) => `${prefix}${subject.text} ${f}${complementFor(verb)}${phraseText}.`);
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
  const verb = selectVerbFor("pastSimple");
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
      question: `${subject.text} ___${complementFor(verb)} ${phrase}.`,
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
        question: `${subject.text} ___ (not / ${verb.base})${complementFor(verb)} ${phrase}.`,
        answer, acceptable: [answer, `did not ${verb.base}`], explanation: "Negative Past Simple: didn't + base verb.",
        sig: `pastSimple|fill-neg|${subject.text}|${verb.base}|${phrase}`,
      };
    }
    if (mode === "question") {
      const subjLower = lowerSubject(subject);
      const answer = `did ${subjLower} ${verb.base}`;
      return {
        tense: "pastSimple", type: "fill",
        question: `___ ${subjLower} ___ (${verb.base})${complementFor(verb)} ${phrase}?`,
        answer, acceptable: [answer], explanation: "Questions in Past Simple: Did + subject + base verb.",
        sig: `pastSimple|fill-q|${subject.text}|${verb.base}|${phrase}`,
      };
    }
    return {
      tense: "pastSimple", type: "fill",
      question: `${subject.text} ___ (${verb.base})${complementFor(verb)} ${phrase}.`,
      answer: correct, acceptable: [correct], explanation,
      sig: `pastSimple|fill-aff|${subject.text}|${verb.base}|${phrase}`,
    };
  }

  // correction
  const correctSentence = `${subject.text} ${correct}${complementFor(verb)} ${phrase}.`;
  const wrongSentences = sampleN(wrongPool, Math.min(3, wrongPool.length)).map((f) => `${subject.text} ${f}${complementFor(verb)} ${phrase}.`);
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
  const verb = selectVerbFor("pastContinuous");
  const correct = `${subject.cat.wasWere} ${verb.ing}`;
  const explanation = `Use was/were + verb-ing (here: ${correct}) for an action in progress in the past.`;
  const event = randomChoice(PAST_CONT_EVENTS);
  const otherWasWere = subject.cat.wasWere === "was" ? "were" : "was";
  const wrongPool = uniq([subject.cat.verbForm(verb), verb.past, `${otherWasWere} ${verb.ing}`, `${subject.cat.wasWere} ${verb.base}`]).filter((c) => c !== correct);

  if (type === "mcq") {
    const options = shuffleArray([correct, ...sampleN(wrongPool, 3)]);
    return {
      tense: "pastContinuous", type: "mcq",
      question: `${subject.text} ___${complementFor(verb)} when ${event}.`,
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
        question: `${subject.text} ___ (not / ${verb.base})${complementFor(verb)} when ${event}.`,
        answer, acceptable: [answer, `${subject.cat.wasWere} not ${verb.ing}`], explanation: "Negative Past Continuous: wasn't/weren't + verb-ing.",
        sig: `pastContinuous|fill-neg|${subject.text}|${verb.base}|${event}`,
      };
    }
    if (mode === "question") {
      const subjLower = lowerSubject(subject);
      const answer = `${subject.cat.wasWere} ${subjLower} ${verb.ing}`;
      return {
        tense: "pastContinuous", type: "fill",
        question: `___ ${subjLower} ___ (${verb.base})${complementFor(verb)} when ${event}?`,
        answer, acceptable: [answer], explanation: "Questions in Past Continuous: Was/Were + subject + verb-ing.",
        sig: `pastContinuous|fill-q|${subject.text}|${verb.base}|${event}`,
      };
    }
    return {
      tense: "pastContinuous", type: "fill",
      question: `${subject.text} ___ (${verb.base})${complementFor(verb)} when ${event}.`,
      answer: correct, acceptable: [correct], explanation,
      sig: `pastContinuous|fill-aff|${subject.text}|${verb.base}|${event}`,
    };
  }

  // correction
  const correctSentence = `${subject.text} ${correct}${complementFor(verb)} when ${event}.`;
  const wrongSentences = sampleN(wrongPool, 3).map((f) => `${subject.text} ${f}${complementFor(verb)} when ${event}.`);
  return {
    tense: "pastContinuous", type: "correction",
    brokenSentence: wrongSentences[0],
    options: shuffleArray([correctSentence, ...wrongSentences]),
    answer: correctSentence, explanation,
    sig: `pastContinuous|corr|${subject.text}|${verb.base}|${event}`,
  };
}

// ---------------- FUTURE SIMPLE ----------------

function makeFutureSimple(type) {
  const subject = randomChoice(SUBJECTS);
  const verb = selectVerbFor("futureSimple");
  const correct = `will ${verb.base}`;
  const explanation = "Future Simple uses will + base verb. Use won't + base verb for negatives.";
  const phrase = randomChoice(FUTURE_PHRASES);
  const wrongPool = uniq([verb.base, verb.s, verb.past, `will ${verb.past}`]).filter((c) => c !== correct);

  if (type === "mcq") {
    const options = shuffleArray([correct, ...sampleN(wrongPool, 3)]);
    return {
      tense: "futureSimple", type: "mcq",
      question: `${subject.text} ___${complementFor(verb)} ${phrase}.`,
      options, answer: correct, explanation,
      sig: `futureSimple|mcq|${subject.text}|${verb.base}|${phrase}`,
    };
  }

  if (type === "fill") {
    const mode = randomChoice(["affirmative", "negative", "question"]);
    if (mode === "negative") {
      const answer = `won't ${verb.base}`;
      return {
        tense: "futureSimple", type: "fill",
        question: `${subject.text} ___ (not / ${verb.base})${complementFor(verb)} ${phrase}.`,
        answer, acceptable: [answer, `will not ${verb.base}`], explanation,
        sig: `futureSimple|fill-neg|${subject.text}|${verb.base}|${phrase}`,
      };
    }
    if (mode === "question") {
      const subjLower = lowerSubject(subject);
      const answer = `will ${subjLower} ${verb.base}`;
      return {
        tense: "futureSimple", type: "fill",
        question: `___ ${subjLower} ___ (${verb.base})${complementFor(verb)} ${phrase}?`,
        answer, acceptable: [answer], explanation: "Future Simple questions use Will + subject + base verb.",
        sig: `futureSimple|fill-q|${subject.text}|${verb.base}|${phrase}`,
      };
    }
    return {
      tense: "futureSimple", type: "fill",
      question: `${subject.text} ___ (${verb.base})${complementFor(verb)} ${phrase}.`,
      answer: correct, acceptable: [correct], explanation,
      sig: `futureSimple|fill-aff|${subject.text}|${verb.base}|${phrase}`,
    };
  }

  const correctSentence = `${subject.text} ${correct}${complementFor(verb)} ${phrase}.`;
  const wrongSentences = sampleN(wrongPool, 3).map((form) => `${subject.text} ${form}${complementFor(verb)} ${phrase}.`);
  return {
    tense: "futureSimple", type: "correction",
    brokenSentence: wrongSentences[0],
    options: shuffleArray([correctSentence, ...wrongSentences]),
    answer: correctSentence, explanation,
    sig: `futureSimple|corr|${subject.text}|${verb.base}|${phrase}`,
  };
}

const TENSE_BUILDERS = {
  presentSimple: makePresentSimple,
  presentContinuous: makePresentContinuous,
  pastSimple: makePastSimple,
  pastContinuous: makePastContinuous,
  futureSimple: makeFutureSimple,
};

function makeComprehensionQuestion(tenseKey) {
  const matching = READING_PASSAGES.filter((passage) => passage.tense === tenseKey);
  const source = randomChoice(matching.length ? matching : READING_PASSAGES);
  return {
    tense: source.tense,
    type: "comprehension",
    passage: source.passage,
    question: source.question,
    options: shuffleArray(source.options),
    answer: source.answer,
    explanation: source.explanation,
    sig: `comprehension|${source.question}`,
  };
}

const DRILL_QUESTION_TYPES = ["mcq", "fill", "correction", "formQuestion"];
const QUESTION_TYPES = ["mcq", "fill", "correction", "formQuestion", "comprehension"];
const RANDOM_QUESTION_TYPES = ["mcq", "fill", "correction", "formQuestion", "mcq", "fill", "correction", "comprehension"];

function buildQuestion(tenseKey, type) {
  if (type === "comprehension") return makeComprehensionQuestion(tenseKey);
  if (type === "formQuestion") return makeFormQuestion(tenseKey);
  return TENSE_BUILDERS[tenseKey](type);
}

// tenseFilter is kept for flexibility; the app passes null so every session is mixed.
function generateQuestions(tenseFilter, count, options = {}) {
  const tenseKeys = tenseFilter ? [tenseFilter] : Object.keys(TENSES);
  const focus = options.focus || null;
  const seen = new Set();
  const result = [];
  const planned = [];
  const maxAttempts = count * 80;
  let attempts = 0;

  if (!tenseFilter) {
    tenseKeys.forEach((tenseKey) => planned.push({ tenseKey, type: randomChoice(DRILL_QUESTION_TYPES) }));
    QUESTION_TYPES.forEach((type) => planned.push({ tenseKey: randomChoice(tenseKeys), type }));
  }

  const maxComprehension = count >= 18 ? 3 : 2;
  const maxFocused = Math.floor(count * 0.55);
  let focusedCount = 0;

  while (result.length < count && attempts < maxAttempts) {
    attempts += 1;
    const next = planned.shift();
    const canUseFocus = focus && focusedCount < maxFocused && Math.random() < 0.7;
    const tenseKey = next ? next.tenseKey : canUseFocus ? focus.tense : randomChoice(tenseKeys);
    let type = next ? next.type : canUseFocus ? focus.type : randomChoice(RANDOM_QUESTION_TYPES);
    if (type === "comprehension" && result.filter((q) => q.type === "comprehension").length >= maxComprehension) {
      type = randomChoice(DRILL_QUESTION_TYPES);
    }
    const q = buildQuestion(tenseKey, type);
    if (q.type === "fill" || q.type === "formQuestion") {
      q.options = makeSelectableOptions(q);
    }
    if (seen.has(q.sig)) continue;
    seen.add(q.sig);
    delete q.sig;
    result.push(q);
    if (focus && q.tense === focus.tense && q.type === focus.type) focusedCount += 1;
  }
  return result;
}

# English Tenses Challenge

Open [index.html](index.html) in a browser. No installation or server is needed.

## Learning materials

The generator keeps the original beach vocabulary and five tenses, and adds:

- Vocabulary from the supplied *Winnie's Amazing Pumpkin* book by Valerie Thomas and Korky Paul: vegetables, gardening, cooking, magic, the farmers' market, a beanstalk, and the pumpkin helicopter.
- Past Simple for story events, Past Continuous for ongoing past actions, and Past Perfect for an event completed before another past event (the pumpkin had broken away from its vine).
- Present Perfect statements, negatives, questions, participles, gap completion, and sentence-order practice based on the two supplied Wordwall activities.

Sources:

- https://wordwall.net/resource/105674560/esl/present-perfect-statements-anagram
- https://wordwall.net/resource/105673298/esl/present-perfect-statements-complete-the-sentence
- The 19-page PDF supplied in chat.

The anagram source's "has swam" is corrected to "has swum". The verb table stores simple past and past participles separately. "Gotten" follows the American English form used in the gap-completion source.

Reading passages are short original summaries or grammar adaptations, not transcriptions. Present Perfect readings adapt the book's situations for practice; the original story is primarily past-tense narration. Recipe imperatives and occasional modal expressions are context, not additional tense categories.

Each mixed quiz/test retains seven-tense coverage and the original exercise types, adds multiple-choice sentence ordering, and includes Present Perfect gap completion, Present Perfect ordering, and a book-based reading question. New vocabulary is favoured without removing earlier vocabulary. Adaptive practice also supports the added tenses and exercise type.

## Verification

Run the dependency-free tests with Node.js:

```bash
node --test questions.test.cjs
node --check questions.js
node --check app.js
```

Tests cover participles, subject agreement, 500 seeded mixed sessions, sentence-order token preservation, Past Perfect, adaptive Present Perfect practice, reading coverage, and valid answer choices.

Browser verification covered a complete 18-question challenge, correct scoring and review, and mobile layouts at 390 x 844 for gap completion, sentence ordering, question formation, and comprehension.
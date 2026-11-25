// Pure helpers for scoring — no Vue here, so they are easy to test.

/** Highest possible total: the best option of every question. */
export function maxScoreOf(questions) {
  return questions.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.points)), 0);
}

/** Sum of points for the chosen option indexes (answers[i] = option index for question i). */
export function scoreOf(questions, answers) {
  return answers.reduce((sum, optionIndex, i) => {
    const option = questions[i]?.options[optionIndex];
    return sum + (option ? option.points : 0);
  }, 0);
}

/**
 * Categories sorted best → worst, each with the point range it covers:
 * `from` = lowest score in the category, `to` = highest.
 */
export function buildLevels(results, maxScore) {
  const levels = results
    .slice()
    .sort((a, b) => b.min - a.min)
    .map((level) => ({ ...level, from: Math.ceil((level.min * maxScore) / 100 - 1e-9) }));
  levels.forEach((level, i) => {
    level.to = i === 0 ? maxScore : levels[i - 1].from - 1;
  });
  return levels;
}

export function levelFor(levels, score) {
  return levels.find((level) => score >= level.from) || levels[levels.length - 1];
}

export function formatRange(level) {
  return level.from === level.to ? `${level.from}` : `${level.from}–${level.to}`;
}

/**
 * A fresh play-through: the order questions are asked in, for every question
 * (by its index in quiz.questions) the order its options are shown in,
 * and the order the «А ты знал?» facts appear in.
 */
export function createRound(quiz) {
  const questionIndexes = quiz.questions.map((_, i) => i);
  return {
    questionOrder: quiz.shuffleQuestions === false ? questionIndexes : shuffle(questionIndexes),
    optionOrder: quiz.questions.map((q) => {
      const optionIndexes = q.options.map((_, k) => k);
      return quiz.shuffleOptions === false ? optionIndexes : shuffle(optionIndexes);
    }),
    factOrder: shuffle(quiz.facts || []),
  };
}

export function shuffle(items) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Russian plural: plural(5, ["вопрос", "вопроса", "вопросов"]) → "вопросов". */
export function plural(n, forms) {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

/** Only allow hex colors from quiz.js into inline styles. */
export function safeColor(color) {
  return /^#[0-9a-f]{3,8}$/i.test(color || "") ? color : "#00e5ff";
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

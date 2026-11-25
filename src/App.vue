<script setup>
import { computed, ref, watch } from "vue";
import quiz from "./quiz.js";
import { buildLevels, createRound, levelFor, maxScoreOf, prefersReducedMotion, scoreOf } from "./lib/quiz-logic.js";
import { FADE } from "./lib/ui.js";
import NeonBackground from "./components/NeonBackground.vue";
import StartScreen from "./components/StartScreen.vue";
import QuestionScreen from "./components/QuestionScreen.vue";
import ResultScreen from "./components/ResultScreen.vue";

const total = quiz.questions.length;
const maxScore = maxScoreOf(quiz.questions);
const levels = buildLevels(quiz.results, maxScore);

const screen = ref("start"); // "start" | "quiz" | "result"
const step = ref(0); // how many questions have been answered in this play-through
const questionOrder = ref([]); // question indexes in the order they are asked
const optionOrder = ref([]); // optionOrder[q] = option indexes of question q in display order
const answers = ref([]); // answers[q] = chosen option index for question q
const factDeck = ref([]); // facts in random order for this play-through
const locked = ref(false); // true for a moment after a pick, while the choice is highlighted

const current = computed(() => questionOrder.value[step.value]); // index in quiz.questions
const score = computed(() => scoreOf(quiz.questions, answers.value));
const level = computed(() => levelFor(levels, score.value));

// Two new facts for every question (left and right card), cycling through the deck
const questionFacts = computed(() => {
  const deck = factDeck.value;
  if (!deck.length) return [];
  if (deck.length === 1) return [deck[0]];
  return [deck[(2 * step.value) % deck.length], deck[(2 * step.value + 1) % deck.length]];
});

// Load the level pictures in the background so the result appears instantly
let preloaded = false;
function preloadImages() {
  if (preloaded) return;
  preloaded = true;
  quiz.results.forEach((r) => {
    if (r.image) new Image().src = r.image;
  });
}

function begin() {
  preloadImages();
  const round = createRound(quiz);
  questionOrder.value = round.questionOrder;
  optionOrder.value = round.optionOrder;
  factDeck.value = round.factOrder;
  answers.value = [];
  step.value = 0;
  locked.value = false;
  screen.value = "quiz";
}

function pick(optionIndex) {
  if (locked.value) return;
  locked.value = true;
  answers.value[current.value] = optionIndex;
  setTimeout(() => {
    locked.value = false;
    if (step.value < total - 1) step.value++;
    else screen.value = "result";
  }, prefersReducedMotion() ? 150 : 450);
}

function back() {
  if (locked.value) return;
  if (step.value === 0) screen.value = "start";
  else step.value--;
}

watch([screen, step], () => window.scrollTo({ top: 0 }));
</script>

<template>
  <NeonBackground />
  <main class="relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 pt-8 pb-12 sm:px-8 sm:pt-12">
    <Transition v-bind="FADE" mode="out-in">
      <StartScreen v-if="screen === 'start'" key="start" :quiz="quiz" :total="total" @start="begin" />
      <QuestionScreen
        v-else-if="screen === 'quiz'"
        key="quiz"
        :question="quiz.questions[current]"
        :index="step"
        :total="total"
        :order="optionOrder[current]"
        :picked="answers[current]"
        :locked="locked"
        :facts="questionFacts"
        @pick="pick"
        @back="back"
      />
      <ResultScreen
        v-else
        key="result"
        :title="quiz.title"
        :score="score"
        :max-score="maxScore"
        :level="level"
        :levels="levels"
        @restart="begin"
      />
    </Transition>
  </main>
</template>

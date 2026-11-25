<script setup>
import { onMounted, ref } from "vue";
import TickerTape from "./TickerTape.vue";
import { plural } from "../lib/quiz-logic.js";
import { BTN_PRIMARY } from "../lib/ui.js";

defineProps({
  quiz: { type: Object, required: true },
  total: { type: Number, required: true },
});
const emit = defineEmits(["start"]);

const heading = ref(null);
onMounted(() => heading.value?.focus({ preventScroll: true }));
</script>

<template>
  <section class="flex flex-1 flex-col">
    <TickerTape v-if="quiz.ticker && quiz.ticker.length" :items="quiz.ticker" />

    <div class="flex flex-1 flex-col items-center justify-center py-14 text-center">
      <h1
        ref="heading"
        tabindex="-1"
        class="max-w-full bg-linear-to-r from-neon-cyan via-neon-violet to-neon-pink bg-clip-text pb-2 font-display text-[clamp(1.75rem,7.6vw,4rem)] leading-[1.08] font-extrabold tracking-[-0.02em] text-balance text-transparent outline-none [filter:drop-shadow(0_0_28px_rgb(163_107_255/0.45))]"
      >
        {{ quiz.title }}
      </h1>
      <p class="mt-5 max-w-[32ch] text-xl leading-snug font-medium text-pretty text-muted sm:text-2xl">
        {{ quiz.subtitle }}
      </p>
      <button type="button" :class="[BTN_PRIMARY, 'mt-10 max-sm:w-full']" @click="emit('start')">Начать тест</button>
      <p class="mt-4 text-sm font-medium text-faint">
        {{ total }} {{ plural(total, ["вопрос", "вопроса", "вопросов"]) }}, пара минут
      </p>
    </div>
  </section>
</template>

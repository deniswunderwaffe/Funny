<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { formatRange, plural, prefersReducedMotion, safeColor } from "../lib/quiz-logic.js";
import { BTN_GHOST, BTN_PRIMARY } from "../lib/ui.js";

const props = defineProps({
  title: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  level: { type: Object, required: true },
  levels: { type: Array, required: true },
});
const emit = defineEmits(["restart"]);

const reduceMotion = prefersReducedMotion();
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const targetOffset = computed(
  () => CIRCUMFERENCE * (1 - (props.maxScore ? props.score / props.maxScore : 0))
);

// The ring fills up and the number counts up from zero
const ringOffset = ref(reduceMotion ? targetOffset.value : CIRCUMFERENCE);
const shownScore = ref(reduceMotion ? props.score : 0);
const toast = ref("");
const heading = ref(null);
let frame = 0;

function countUp(duration = 1400, delay = 300) {
  const start = performance.now() + delay;
  const tick = (now) => {
    const p = Math.min(1, Math.max(0, (now - start) / duration));
    shownScore.value = Math.round(props.score * (1 - Math.pow(1 - p, 3)));
    if (p < 1) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
}

onMounted(() => {
  heading.value?.focus({ preventScroll: true });
  if (reduceMotion) return;
  requestAnimationFrame(() => requestAnimationFrame(() => (ringOffset.value = targetOffset.value)));
  countUp();
});
onUnmounted(() => cancelAnimationFrame(frame));

async function share() {
  const url = location.href.split("#")[0];
  const text = `Мой результат в тесте на экономическую грамотность: «${props.level.title}», ${props.score} из ${props.maxScore}. Проверь себя:`;
  if (navigator.share) {
    try {
      await navigator.share({ title: props.title, text, url });
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    toast.value = "Текст со ссылкой скопирован — вставь его другу в чат.";
  } catch {
    toast.value = "Не получилось скопировать. Скопируй адрес страницы из браузера.";
  }
}
</script>

<template>
  <section class="flex flex-col items-center text-center" :style="{ '--c': safeColor(level.color) }">
    <p class="text-base font-bold text-muted sm:text-lg">Твой диагноз</p>

    <!-- Level picture: the whole image is shown, a blurred copy fills the empty space -->
    <div
      v-if="level.image"
      class="relative mt-5 aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[color:var(--c)] bg-black shadow-[0_0_50px_-12px_var(--c)] motion-safe:animate-rise"
    >
      <img :src="level.image" alt="" aria-hidden="true" class="absolute inset-0 size-full scale-110 object-cover opacity-45 blur-2xl" />
      <img :src="level.image" :alt="level.title" class="relative size-full object-contain" />
    </div>

    <!-- Score ring; sits on the picture's bottom edge when there is a picture -->
    <div
      class="relative grid place-items-center rounded-full bg-black motion-safe:animate-rise motion-safe:[animation-delay:120ms]"
      :class="level.image ? '-mt-16 size-32 sm:-mt-20 sm:size-40' : 'mt-6 size-52 sm:size-60'"
    >
      <svg viewBox="0 0 120 120" class="size-full -rotate-90 overflow-visible" aria-hidden="true">
        <circle cx="60" cy="60" :r="RADIUS" fill="none" stroke="rgb(255 255 255 / 0.1)" stroke-width="7" />
        <circle
          v-if="score > 0"
          cx="60"
          cy="60"
          :r="RADIUS"
          fill="none"
          stroke="var(--c)"
          stroke-width="7"
          stroke-linecap="round"
          :stroke-dasharray="CIRCUMFERENCE"
          :style="{ strokeDashoffset: ringOffset }"
          class="transition-[stroke-dashoffset] delay-300 duration-[1400ms] ease-[cubic-bezier(.2,.8,.2,1)] [filter:drop-shadow(0_0_6px_var(--c))]"
        />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span
          class="font-display leading-none font-extrabold tabular-nums [color:var(--c)] [text-shadow:0_0_24px_color-mix(in_oklab,var(--c)_70%,transparent)]"
          :class="level.image ? 'text-4xl sm:text-5xl' : 'text-6xl sm:text-7xl'"
        >{{ shownScore }}</span>
        <span class="mt-1.5 text-xs font-bold text-muted sm:text-sm">
          из {{ maxScore }} {{ plural(maxScore, ["балла", "баллов", "баллов"]) }}
        </span>
      </div>
    </div>

    <h1
      ref="heading"
      tabindex="-1"
      class="mt-6 font-display text-[clamp(1.75rem,7.4vw,3.5rem)] leading-[1.06] font-extrabold tracking-[-0.02em] text-balance outline-none motion-safe:animate-rise [color:var(--c)] [text-shadow:0_0_36px_color-mix(in_oklab,var(--c)_55%,transparent)]"
    >
      {{ level.title }}
    </h1>
    <p class="mt-5 max-w-[34ch] text-xl leading-relaxed font-medium text-pretty text-ink/85 sm:text-[1.375rem]">
      {{ level.text }}
    </p>

    <div class="mt-12 w-full text-left">
      <h2 class="px-1 text-sm font-bold text-faint">Все уровни</h2>
      <ol class="mt-3 grid gap-1.5">
        <li
          v-for="item in levels"
          :key="item.title"
          :style="{ '--c': safeColor(item.color) }"
          class="flex items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 text-base sm:text-lg"
          :class="
            item.title === level.title
              ? 'border-[color:var(--c)] font-bold text-ink [background-color:color-mix(in_oklab,var(--c)_12%,transparent)] shadow-[0_0_30px_-10px_var(--c)]'
              : 'border-transparent font-medium text-muted'
          "
        >
          <span class="flex items-center gap-3">
            <span class="size-2.5 flex-none rounded-full [background:var(--c)] [box-shadow:0_0_10px_var(--c)]"></span>
            {{ item.title }}
          </span>
          <span class="font-display text-sm whitespace-nowrap tabular-nums">{{ formatRange(item) }}</span>
        </li>
      </ol>
    </div>

    <div class="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      <button type="button" :class="BTN_PRIMARY" @click="share">Поделиться результатом</button>
      <button type="button" :class="BTN_GHOST" @click="emit('restart')">Пройти ещё раз</button>
    </div>
    <p class="mt-4 min-h-6 text-sm font-medium text-muted" role="status" aria-live="polite">{{ toast }}</p>
  </section>
</template>

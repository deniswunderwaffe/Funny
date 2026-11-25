<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { FADE, FOCUS, OPTION, OPTION_KEY } from "../lib/ui.js";
import FactCard from "./FactCard.vue";

const props = defineProps({
  question: { type: Object, required: true },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
  order: { type: Array, required: true }, // option indexes in display order
  picked: { type: Number, default: null }, // chosen option index, if any
  locked: { type: Boolean, default: false },
  facts: { type: Array, default: () => [] }, // up to two facts for this question
});
const emit = defineEmits(["pick", "back"]);

const LETTERS = "АБВГДЕЖЗИК";
const label = (k) => LETTERS[k] || String(k + 1);

// Progress bar: starts one step back and slides forward, so every move is animated
const progress = computed(() => ((props.index + 1) / props.total) * 100);
const barWidth = ref((props.index / props.total) * 100);
watch(progress, (value) => (barWidth.value = value));

// Long questions get a smaller font so they still fit on a phone screen
const textSize = computed(() => {
  const length = props.question.text.length;
  if (length > 105) return "text-[clamp(1.375rem,5vw,2.125rem)]";
  if (length > 70) return "text-[clamp(1.5rem,5.6vw,2.375rem)]";
  return "text-[clamp(1.75rem,6.2vw,2.75rem)]";
});

const heading = ref(null);
const focusHeading = () => heading.value?.focus({ preventScroll: true });

// Keyboard: 1–4 or А–Г picks an answer
function onKeydown(event) {
  if (event.metaKey || event.ctrlKey || event.altKey || props.locked) return;
  let k = Number.parseInt(event.key, 10) - 1;
  if (Number.isNaN(k)) k = LETTERS.indexOf(event.key.toUpperCase());
  if (k >= 0 && k < props.order.length) {
    event.preventDefault();
    emit("pick", props.order[k]);
  }
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
  focusHeading();
  requestAnimationFrame(() => requestAnimationFrame(() => (barWidth.value = progress.value)));
});
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <section class="flex flex-1 flex-col">
    <div class="flex items-center justify-between">
      <button
        type="button"
        class="-ml-2 inline-flex items-center gap-1 rounded-full px-2 py-2 text-base font-bold text-muted transition-colors hover:text-ink"
        :class="FOCUS"
        @click="emit('back')"
      >
        <svg viewBox="0 0 20 20" class="size-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12.5 4.5 7 10l5.5 5.5" />
        </svg>
        Назад
      </button>
      <span class="font-display text-sm font-bold text-muted tabular-nums">
        <span class="text-ink">{{ index + 1 }}</span> / {{ total }}
      </span>
    </div>

    <div
      class="mt-4 h-1.5 rounded-full bg-white/10"
      role="progressbar"
      aria-label="Прогресс"
      aria-valuemin="1"
      :aria-valuemax="total"
      :aria-valuenow="index + 1"
    >
      <div
        class="h-full rounded-full bg-linear-to-r from-neon-cyan via-neon-violet to-neon-pink shadow-[0_0_16px_rgb(0_229_255/0.6)] transition-[width] duration-500 ease-out motion-reduce:transition-none"
        :style="{ width: barWidth + '%' }"
      ></div>
    </div>

    <Transition v-bind="FADE" mode="out-in" @after-enter="focusHeading">
      <div :key="index">
        <h2
          ref="heading"
          tabindex="-1"
          class="mt-12 leading-[1.12] font-extrabold tracking-[-0.03em] text-balance outline-none sm:mt-16"
          :class="textSize"
        >
          {{ question.text }}
        </h2>

        <div class="mt-8 grid gap-3 sm:mt-10" role="group" aria-label="Варианты ответа">
          <button
            v-for="(optionIndex, k) in order"
            :key="optionIndex"
            type="button"
            :class="[OPTION, locked && 'pointer-events-none', locked && picked !== optionIndex && 'opacity-35']"
            :data-picked="picked === optionIndex ? '' : null"
            @click="emit('pick', optionIndex)"
          >
            <span :class="OPTION_KEY" aria-hidden="true">{{ label(k) }}</span>
            <span>{{ question.options[optionIndex].text }}</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- «А ты знал?»: on wide screens two cards float beside the question, on narrower screens one sits under the answers -->
    <FactCard
      v-if="facts[0]"
      :fact="facts[0]"
      tone="cyan"
      class="absolute top-44 right-full mr-10 hidden w-60 -rotate-2 xl:block 2xl:mr-16 2xl:w-72"
    />
    <FactCard
      v-if="facts[1]"
      :fact="facts[1]"
      tone="green"
      class="absolute top-80 left-full ml-10 hidden w-60 rotate-2 xl:block 2xl:ml-16 2xl:w-72"
    />
    <FactCard v-if="facts[0]" :fact="facts[0]" tone="green" class="mt-10 xl:hidden" />
  </section>
</template>

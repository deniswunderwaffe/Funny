<script setup>
import { FADE_UP } from "../lib/ui.js";

defineProps({
  fact: { type: Object, required: true }, // { value: "100 леев", text: "в месяц приносит..." }
  tone: { type: String, default: "green" }, // neon color of the big number: green | cyan | pink
});

const TONES = {
  green: "text-neon-green [text-shadow:0_0_18px_rgb(57_255_136/0.55)]",
  cyan: "text-neon-cyan [text-shadow:0_0_18px_rgb(0_229_255/0.55)]",
  pink: "text-neon-pink [text-shadow:0_0_18px_rgb(255_45_149/0.55)]",
};
</script>

<template>
  <aside class="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left backdrop-blur-md sm:p-6">
    <p class="text-xs font-bold text-faint sm:text-sm">А ты знал?</p>
    <!-- The card stays put; only its content swaps when the fact changes -->
    <Transition v-bind="FADE_UP" mode="out-in">
      <div :key="fact.value + fact.text">
        <p class="mt-2 font-display text-2xl leading-tight font-extrabold" :class="TONES[tone] || TONES.green">
          {{ fact.value }}
        </p>
        <p class="mt-2 text-base leading-relaxed font-medium text-pretty text-ink/75">{{ fact.text }}</p>
      </div>
    </Transition>
  </aside>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true }, // [["Гречка", "+100%"], ...]
});

const isUp = (value) => String(value).trim().startsWith("+");
</script>

<template>
  <!-- Full-width "stock ticker"; the list is rendered twice so the loop is seamless -->
  <div
    aria-hidden="true"
    class="relative left-1/2 -mt-8 w-screen -translate-x-1/2 overflow-hidden border-y border-white/10 bg-white/[0.03] py-3 backdrop-blur-sm sm:-mt-12 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
  >
    <div class="flex w-max motion-safe:animate-ticker">
      <template v-for="copy in 2" :key="copy">
        <template v-for="(item, i) in items" :key="`${copy}-${i}`">
          <span class="flex items-center gap-2.5 px-6 text-sm font-semibold whitespace-nowrap sm:text-base">
            <span class="text-muted">{{ item[0] }}</span>
            <span
              class="font-bold tabular-nums [text-shadow:0_0_14px_currentColor]"
              :class="isUp(item[1]) ? 'text-neon-green' : 'text-neon-pink'"
            >{{ item[1] }}</span>
          </span>
          <span class="size-1 flex-none self-center rounded-full bg-white/20"></span>
        </template>
      </template>
    </div>
  </div>
</template>

<template>
  <!-- Neon glow blobs and a faint grid behind everything -->
  <div aria-hidden="true" class="pointer-events-none fixed inset-0 overflow-hidden">
    <div
      class="absolute inset-0 [background-image:linear-gradient(rgb(255_255_255/0.045)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.045)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]"
    ></div>
    <div class="absolute -top-48 -left-40 size-[34rem] rounded-full bg-neon-cyan/20 blur-[120px] motion-safe:animate-drift"></div>
    <div
      class="absolute -right-48 -bottom-56 size-[38rem] rounded-full bg-neon-pink/20 blur-[130px] motion-safe:animate-drift motion-safe:[animation-delay:-8s]"
    ></div>
  </div>
</template>

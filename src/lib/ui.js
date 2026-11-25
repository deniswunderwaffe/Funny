// Tailwind class sets shared between components.

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan";

const BTN = `inline-flex items-center justify-center rounded-full px-9 py-4.5 text-lg font-extrabold transition duration-200 active:scale-[.98] ${FOCUS}`;

export const BTN_PRIMARY =
  `${BTN} bg-linear-to-r from-neon-cyan via-neon-violet to-neon-pink text-black ` +
  "shadow-[0_0_40px_-8px_rgb(163_107_255/0.85)] hover:shadow-[0_0_60px_-6px_rgb(255_45_149/0.9)] hover:brightness-110";

export const BTN_GHOST = `${BTN} border border-white/20 bg-white/[0.03] text-ink backdrop-blur hover:border-white/40 hover:bg-white/[0.08]`;

export const OPTION =
  "group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left text-lg font-semibold leading-snug backdrop-blur-sm " +
  "transition-[background-color,border-color,box-shadow,opacity] duration-200 sm:gap-5 sm:px-6 sm:py-5 sm:text-xl " +
  "not-data-picked:hover:border-neon-cyan/60 not-data-picked:hover:bg-white/[0.07] not-data-picked:hover:shadow-[0_0_28px_-10px_rgb(0_229_255/0.7)] " +
  "data-picked:border-neon-cyan data-picked:bg-neon-cyan/15 data-picked:shadow-[0_0_36px_-6px_rgb(0_229_255/0.85)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan";

export const OPTION_KEY =
  "grid size-9 flex-none place-items-center rounded-xl border border-white/15 font-display text-xs font-bold text-muted transition-colors " +
  "group-data-picked:border-neon-cyan group-data-picked:bg-neon-cyan group-data-picked:text-black sm:size-10 sm:text-sm";

// Props for Vue <Transition> — a quick fade, switched off for reduced motion.
export const FADE = {
  enterActiveClass: "transition-opacity duration-300 ease-out motion-reduce:transition-none",
  enterFromClass: "opacity-0",
  leaveActiveClass: "transition-opacity duration-150 ease-in motion-reduce:transition-none",
  leaveToClass: "opacity-0",
};

// Same, but the new content also slides up a little (used for the fact cards).
export const FADE_UP = {
  enterActiveClass: "transition duration-400 ease-out motion-reduce:transition-none",
  enterFromClass: "translate-y-2 opacity-0",
  leaveActiveClass: "transition-opacity duration-150 ease-in motion-reduce:transition-none",
  leaveToClass: "opacity-0",
};

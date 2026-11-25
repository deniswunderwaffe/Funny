# Тест на экономическую грамотность

A small, funny quiz built with **Vue 3 + Vite + Tailwind CSS v4**. Neon on black, works on phones.

## Edit the quiz

Everything you'd want to change is in **`src/quiz.js`**: the title, the questions, the answer
options with their points, the five result categories (with their neon colors and summaries), the ticker lines,
and the «А ты знал?» facts shown beside the questions. Questions and options are shuffled on every play-through.

The result pictures are in **`public/levels/`**: `lvl1.jpg` (worst) … `lvl5.jpg` (best). To change a picture,
replace the file and keep its name.

## Run it locally

Requires Node.js 20.19+ (or 22+).

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

## Deploy to Vercel

**Option A — GitHub (recommended):**
1. Push this folder to a new GitHub repository.
2. In Vercel, click **Add New → Project** and import that repository.
3. Vercel detects **Vite** automatically (build command `npm run build`, output folder `dist`). Click **Deploy**.

Every push to the repository redeploys the site.

**Option B — Vercel CLI, straight from this folder:**

```bash
npx vercel
```

Answer the prompts; add `--prod` to publish to the production URL.

## Project layout

```
index.html                  page shell, fonts, meta tags
src/quiz.js                 quiz content (edit this)
src/App.vue                 quiz flow: start → questions → result
src/components/             StartScreen, QuestionScreen, ResultScreen, TickerTape, NeonBackground
src/lib/quiz-logic.js       scoring helpers
src/lib/ui.js               shared Tailwind class sets
src/style.css               Tailwind theme (colors, fonts, animations)
```

# CharForge AI

A web application for generating AI character images with deep customisation and a **human-realistic portrait mode** powered by the Flux Super Realism LoRA. Built with Next.js 14, React 18, and Hugging Face inference.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![React](https://img.shields.io/badge/React-18-blue) ![Vitest](https://img.shields.io/badge/tested%20with-Vitest-6E9F18) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

✨ **Deep Character Customisation**
- Diverse races, outfits, hairstyles, expressions, and settings
- 14 art styles including the new **Human Realistic** mode for photographic portraits
- Free-text additional details field for one-off tweaks

🎨 **5 Quick-Start Presets**
- Warrior, Mage, Rogue, Paladin, Fairy — one-click preset loading

📸 **Human Realistic Mode**
- Powered by [`strangerzonehf/Flux-Super-Realism-LoRA`](https://huggingface.co/strangerzonehf/Flux-Super-Realism-LoRA) — a FLUX-based LoRA fine-tuned for hyper-realistic human portraits
- Automatically activates the LoRA trigger word, injects a negative prompt, and uses optimised inference parameters (35 steps, guidance 7.0) to eliminate cartoonish output
- Falls back to `FLUX.1-schnell` (within the FLUX family) if the realism model is unavailable instead of dropping to older SD models

🤖 **Smart Model Routing**
- Style-aware model selection: Human Realistic → Flux-Super-Realism-LoRA; all other styles → FLUX.1-schnell (or your `NEXT_PUBLIC_HF_MODEL` override)
- Per-model timeout tuning and exponential-backoff retry logic

💾 **Gallery & History**
- Auto-saves every generated image to browser localStorage
- Tag images for organisation; remove individual tags with one click
- Delete single images or clear the entire gallery

📤 **Share & Export**
- Download as PNG
- Share directly to **X (Twitter)**, **Instagram**, or **TikTok** via native share menus
- "More…" option invokes the browser's native Web Share API where supported
- Copy prompt to clipboard

🧪 **Full Test Coverage**
- 60 tests across all components and utilities using **Vitest** + React Testing Library
- Run with `npm test` or get coverage with `npm run test:coverage`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18, TypeScript, Tailwind CSS |
| State | Zustand (localStorage-persisted) |
| AI — Realism | `strangerzonehf/Flux-Super-Realism-LoRA` |
| AI — Default | `black-forest-labs/FLUX.1-schnell` |
| Icons | Lucide React |
| Testing | Vitest, React Testing Library, @testing-library/jest-dom |

## Prerequisites

- Node.js 18+ and npm
- Free Hugging Face API key — <https://huggingface.co/settings/tokens>

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Get your Hugging Face API key

1. Go to <https://huggingface.co/settings/tokens>
2. Create a token with **Read** access
3. Copy the token

### 3. Configure environment variables

Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_HF_API_KEY=your_hugging_face_api_key_here

# Optional: override the default model for non-realism styles
# NEXT_PUBLIC_HF_MODEL=black-forest-labs/FLUX.1-schnell
```

### 4. Run the dev server
```bash
npm run dev
```

Open <http://localhost:3000> in your browser.

## Usage

### Create Character tab
1. Pick a preset or customise each field individually
2. Set **Style** to **Human Realistic** for photographic portraits
3. Click **Generate Character** — allow 30–120 seconds depending on the model
4. Use **Refine** to regenerate with the same settings, or tweak options first

### Gallery tab
- Click any thumbnail to open the detail panel
- Add / remove tags for organisation
- Download, share, or delete from the detail panel

## Model Reference

| Style selected | Model used | Notes |
|---|---|---|
| Human Realistic | `strangerzonehf/Flux-Super-Realism-LoRA` | LoRA on FLUX; trigger word `fluxlora` applied automatically |
| All other styles | `black-forest-labs/FLUX.1-schnell` | Fast FLUX base model |
| Fallback (any) | `black-forest-labs/FLUX.1-schnell` | Used when primary unavailable |
| Fallback (non-realism) | `stabilityai/stable-diffusion-xl-base-1.0` | Second fallback for non-realism styles |

To always use a specific model for non-realism styles, set `NEXT_PUBLIC_HF_MODEL` in `.env.local`.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Run production build
npm run lint         # ESLint
npm test             # Run all tests (Vitest)
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report (HTML + lcov)
```

## File Structure

```
ai-character-creator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/route.ts    # Image generation API with model routing
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Tab layout (Create / Gallery)
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx               # CharForge brand header
│   │   ├── CharacterCustomizer.tsx  # Character creation form + preset loader
│   │   ├── ImagePreview.tsx         # Preview with download, copy, share, refine
│   │   └── ImageGallery.tsx         # Gallery grid + detail panel + tagging
│   ├── __tests__/
│   │   ├── characterUtils.test.ts
│   │   ├── store.test.ts
│   │   ├── Header.test.tsx
│   │   ├── CharacterCustomizer.test.tsx
│   │   ├── ImagePreview.test.tsx
│   │   └── ImageGallery.test.tsx
│   └── lib/
│       ├── store.ts                 # Zustand store with localStorage persistence
│       └── characterUtils.ts        # Prompt builder, download, share helpers
├── vitest.config.ts
├── vitest.setup.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## API Reference

### `POST /api/generate`

Generates an image from the given prompt and style.

**Request body:**
```json
{
  "prompt": "a real Human female person, wearing Medieval warrior armor...",
  "style": "Human realistic"
}
```

**Success response:**
```json
{
  "success": true,
  "image": "data:image/jpeg;base64,...",
  "prompt": "...",
  "model": "strangerzonehf/Flux-Super-Realism-LoRA"
}
```

**Error response:**
```json
{ "error": "Model is currently loading. Please wait a moment and try again." }
```

## Troubleshooting

### Cartoon-looking output with Human Realistic
- This happens when the LoRA model is busy and the API falls back to FLUX.1-schnell — retry in a few seconds
- Make sure you have not overridden `NEXT_PUBLIC_HF_MODEL` with a non-FLUX model

### "Model is loading" / 503 error
- The HF free tier auto-sleeps inactive models; wait ~30 seconds and retry
- The app retries automatically with exponential backoff before returning an error

### API key not working
- Verify the token at <https://huggingface.co/settings/tokens>
- The token must have at least **Read** scope
- Restart the dev server after editing `.env.local`

### Images not saving
- Check browser localStorage quota (typically 5–10 MB)
- Delete older images from the Gallery tab to free space

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repo at <https://vercel.com>
3. Add environment variable: `NEXT_PUBLIC_HF_API_KEY`
4. Deploy

```bash
# Or via CLI:
npx vercel
```

### Other Node.js platforms

Compatible with Netlify, Railway, Render, Heroku, and AWS Amplify. Ensure the `NEXT_PUBLIC_HF_API_KEY` environment variable is set on the host.

## Browser Support

Chrome/Edge 90+, Firefox 88+, Safari 14+, iOS Safari, Chrome Mobile

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Hugging Face API documentation
3. Check browser console for errors

## Acknowledgments

- Inspired by mage.space
- Powered by [Hugging Face](https://huggingface.co/)
- Built with [Next.js](https://nextjs.org/) & [React](https://react.dev/)
- UI by [Tailwind CSS](https://tailwindcss.com/) & [Lucide](https://lucide.dev/)

---

**Happy character creating! ✨**

# AI Character Creator

A web application for generating stunning AI character images with customizable features, similar to mage.space. Built with Next.js and Hugging Face's Stable Diffusion models.

![AI Character Creator](https://img.shields.io/badge/Next.js-14-black) ![React](https://img.shields.io/badge/React-18-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

✨ **Character Customization**
- Choose from diverse races, outfits, hairstyles
- Select art styles (realistic, fantasy, anime, etc.)
- Set character expressions and environments
- Add custom details for unique creations

🎨 **5 Character Presets**
- Warrior, Mage, Rogue, Paladin, Fairy
- One-click preset loading for quick character creation

💾 **Image Gallery & History**
- Automatic saving of all generated images
- Browse and manage your character collection
- Tag and organize generated images
- Local storage persistence

🔄 **Editing & Refinement**
- Regenerate with same or modified settings
- Adjust prompts and regenerate
- Compare variations

📥 **Share & Export**
- Download images as PNG
- Share via built-in share button
- Copy prompts for later use or sharing

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **AI Backend**: Hugging Face Stable Diffusion 2.1
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage

## Prerequisites

- Node.js 18+ and npm/yarn
- Free Hugging Face API key (https://huggingface.co/settings/tokens)

## Setup Instructions

### 1. Clone the Repository
```bash
cd ai-character-creator
```

### 2. Get Your Hugging Face API Key

1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Create a token with `read` access
4. Copy the token

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_HF_API_KEY=your_hugging_face_api_key_here
NEXT_PUBLIC_HF_MODEL=stabilityai/stable-diffusion-2-1
```

Replace `your_hugging_face_api_key_here` with your actual API key.

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Create Character Tab**: 
   - Use presets or customize individual features
   - Add additional details in the text area
   - Click "Generate Character"
   - Wait 30-60 seconds for image generation

2. **Gallery Tab**:
   - Browse all previously generated characters
   - Click an image to view details
   - Add tags for organization
   - Download or share images
   - Delete images or clear entire gallery

## Generation Times

- First generation: 30-60 seconds (model initialization)
- Subsequent generations: 20-45 seconds
- Varies based on Hugging Face server load

## Available Models

You can switch between different Stable Diffusion models by changing `NEXT_PUBLIC_HF_MODEL`:

- `stabilityai/stable-diffusion-2-1` - Best quality
- `stabilityai/stable-diffusion-2-1-base` - Faster
- `runwayml/stable-diffusion-v1-5` - Alternative, often faster
- `CompVis/stable-diffusion-v1-4` - Legacy

## Troubleshooting

### "Model is loading" Error
- The model takes time to load on first use
- Wait a minute and try again
- Hugging Face free tier has auto-sleep

### API Key Not Working
- Verify the token at https://huggingface.co/settings/tokens
- Make sure first character is NOT missing
- Restart the dev server after changing .env.local

### Images Not Saving
- Check browser localStorage limits
- Try clearing cache if storage is full
- Use gallery to delete older images

### Slow Generation
- Hugging Face free tier is slower during peak hours
- Consider using a different model
- Premium API key would be faster

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_HF_API_KEY` = Your Hugging Face token
5. Deploy!

```bash
# Or deploy directly:
npm install -g vercel
vercel
```

### Deploy to Other Platforms

This app is compatible with any Node.js hosting:
- Netlify
- Railway
- Render
- Heroku
- AWS Amplify

## File Structure

```
ai-character-creator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/route.ts    # Image generation API
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Main page
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── Header.tsx               # Header component
│   │   ├── CharacterCustomizer.tsx  # Character creation form
│   │   ├── ImagePreview.tsx         # Image display & controls
│   │   └── ImageGallery.tsx         # Gallery view
│   └── lib/
│       ├── store.ts                 # Zustand state management
│       └── characterUtils.ts        # Utility functions
├── public/                          # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## API Routes

### POST `/api/generate`
Generates an AI image from a prompt.

**Request:**
```json
{
  "prompt": "A female elf mage in purple robes..."
}
```

**Response:**
```json
{
  "success": true,
  "image": "data:image/jpeg;base64,...",
  "prompt": "A female elf mage..."
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. Use presets for faster creation
2. Refine prompts quickly without regenerating
3. Delete old images to free up storage
4. Use tags to organize large galleries
5. Consider upgrading Hugging Face API for faster access

## Future Enhancements

- [ ] User accounts & cloud storage
- [ ] More character preset categories
- [ ] Image upscaling options
- [ ] Batch generation
- [ ] Social sharing & gallery
- [ ] Advanced prompt editing
- [ ] Multiple model comparison
- [ ] Real-time preview

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

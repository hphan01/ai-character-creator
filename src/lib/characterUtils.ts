export interface CharacterOptions {
  race: string
  outfit: string
  hairstyle: string
  style: string
  expression: string
  setting: string
  additionalDetails?: string
}

export const characterOptions = {
  races: [
    'Human female',
    'Human male',
    'Elf female',
    'Elf male',
    'Dwarf female',
    'Dwarf male',
    'Orc female',
    'Orc male',
    'Half-orc female',
    'Half-orc male',
    'Tiefling female',
    'Tiefling male',
    'Dragonborn female',
    'Dragonborn male',
    'Hybrid',
    'Alien',
  ],
  outfits: [
    'Medieval warrior armor',
    'Elegant ball gown',
    'Casual modern clothes',
    'Cyberpunk outfit',
    'Fantasy mage robes',
    'Steampunk gear',
    'Sunlit beach outfit',
    'Dark gothic clothing',
    'Astronaut suit',
    'Knight plate armor',
    'Leather jacket and jeans',
    'Samurai armor',
    'Royal court dress',
    'Tactical gear',
    'Academic robes',
  ],
  hairstyles: [
    'Long wavy hair',
    'Short pixie cut',
    'Braided crown',
    'Flowing silver hair',
    'Dark dreadlocks',
    'Sleek high ponytail',
    'Curly afro',
    'Spiky mohawk',
    'Shoulder length locks',
    'Undercut fade',
    'Two-tone split dye',
    'Long straight hair',
    'Messy bun',
    'Shaved sides',
  ],
  styles: [
    'Realistic detailed portrait',
    'Fantasy art style',
    'Anime style',
    'Comic book art',
    'Oil painting',
    'Watercolor',
    'Digital art',
    'Character sheet',
    'Concept art',
    'Photorealistic',
    'Stylized 3D',
    'Illustration',
    'Storybook art',
  ],
  expressions: [
    'Confident and proud',
    'Mysterious and brooding',
    'Cheerful and friendly',
    'Serious and determined',
    'Wise and contemplative',
    'Excited and energetic',
    'Calm and serene',
    'Fierce and angry',
    'Playful and mischievous',
  ],
  settings: [
    'Plain background',
    'Fantasy forest',
    'Dark castle interior',
    'Futuristic city',
    'Magical library',
    'Misty mountains',
    'Crystal cavern',
    'Ancient ruins',
    'Space station',
    'Tavern interior',
    'Temple',
    'Storm clouds',
  ],
}

export function generatePrompt(options: CharacterOptions): string {
  const basePrompt = [
    options.race,
    options.outfit,
    options.hairstyle,
    `${options.expression} expression`,
    `${options.style} style`,
    `${options.setting} background`,
    options.additionalDetails && ', ' + options.additionalDetails,
  ]
    .filter(Boolean)
    .join(', ')

  return `${basePrompt}, highly detailed, professional, masterpiece`
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename || 'character.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function shareImage(dataUrl: string, prompt: string) {
  const text = `Check out this AI-generated character: "${prompt}"\n\nCreated with AI Character Creator`
  
  if (navigator.share) {
    navigator.share({
      title: 'AI Character',
      text: text,
    }).catch(err => console.log('Share failed:', err))
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${text}\n\n[Image URL would be here]`).then(() => {
      alert('Share text copied to clipboard!')
    })
  }
}

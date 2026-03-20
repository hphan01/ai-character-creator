'use client'

import { useState } from 'react'
import { Loader, Zap } from 'lucide-react'
import {
  CharacterOptions,
  characterOptions,
  generatePrompt,
} from '@/lib/characterUtils'
import { useCharacterStore, GeneratedImage } from '@/lib/store'
import ImagePreview from './ImagePreview'

export default function CharacterCustomizer() {
  const [options, setOptions] = useState<CharacterOptions>({
    race: 'Human female',
    outfit: 'Medieval warrior armor',
    hairstyle: 'Long wavy hair',
    style: 'Fantasy art style',
    expression: 'Confident and proud',
    setting: 'Fantasy forest',
    additionalDetails: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const { addImage } = useCharacterStore()

  const updateOption = (key: keyof CharacterOptions, value: string) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  const handleGenerateImage = async () => {
    setLoading(true)
    setError('')
    setGeneratedImage(null)

    const prompt = generatePrompt(options)
    setCurrentPrompt(prompt)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style: options.style }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to generate image')
        return
      }

      setGeneratedImage(data.image)

      // Save to gallery
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        image: data.image,
        prompt: prompt,
        timestamp: Date.now(),
        tags: [options.race, options.outfit, options.style],
      }
      addImage(newImage)
    } catch (err) {
      setError('An error occurred while generating the image')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadPreset = (preset: 'warrior' | 'mage' | 'rogue' | 'paladin' | 'fairy') => {
    const presets: Record<string, CharacterOptions> = {
      warrior: {
        race: 'Human male',
        outfit: 'Knight plate armor',
        hairstyle: 'Shaved sides',
        style: 'Realistic detailed portrait',
        expression: 'Fierce and angry',
        setting: 'Dark castle interior',
      },
      mage: {
        race: 'Elf female',
        outfit: 'Fantasy mage robes',
        hairstyle: 'Long wavy hair',
        style: 'Fantasy art style',
        expression: 'Mysterious and brooding',
        setting: 'Magical library',
      },
      rogue: {
        race: 'Half-orc male',
        outfit: 'Leather jacket and jeans',
        hairstyle: 'Spiky mohawk',
        style: 'Digital art',
        expression: 'Playful and mischievous',
        setting: 'Futuristic city',
      },
      paladin: {
        race: 'Human female',
        outfit: 'Knight plate armor',
        hairstyle: 'Long straight hair',
        style: 'Fantasy art style',
        expression: 'Wise and contemplative',
        setting: 'Temple',
      },
      fairy: {
        race: 'Elf female',
        outfit: 'Elegant ball gown',
        hairstyle: 'Flowing silver hair',
        style: 'Anime style',
        expression: 'Cheerful and friendly',
        setting: 'Misty mountains',
      },
    }
    setOptions({ ...presets[preset], additionalDetails: options.additionalDetails })
    setGeneratedImage(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* Controls */}
      <div className="space-y-6">
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Character Presets</h2>
          <div className="grid grid-cols-2 gap-2">
            {(['warrior', 'mage', 'rogue', 'paladin', 'fairy'] as const).map(preset => (
              <button
                key={preset}
                onClick={() => loadPreset(preset)}
                className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg capitalize transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Customization Options */}
        <div className="glass rounded-xl p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <h2 className="text-2xl font-bold sticky top-0 bg-neutral-900 py-2 -mx-6 px-6">
            Customize Character
          </h2>

          {Object.entries(characterOptions).map(([key, values]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-200 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <select
                value={options[key as keyof CharacterOptions] || ''}
                onChange={(e) => updateOption(key as keyof CharacterOptions, e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
              >
                {values.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Additional Details
            </label>
            <textarea
              value={options.additionalDetails || ''}
              onChange={(e) => updateOption('additionalDetails', e.target.value)}
              placeholder="Add any extra details (e.g., 'holding a glowing sword', 'with dragon wings')"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateImage}
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {loading ? (
            <>
              <Loader className="animate-spin w-5 h-5" />
              Generating...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate Character
            </>
          )}
        </button>

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Preview */}
      <div>
        {generatedImage && (
          <ImagePreview
            image={generatedImage}
            prompt={currentPrompt}
            onRegenerate={handleGenerateImage}
          />
        )}
        {!generatedImage && !loading && (
          <div className="glass rounded-xl p-8 flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <p className="text-gray-300 text-lg">
                Configure your character and click &quot;Generate Character&quot; to create an AI image
              </p>
            </div>
          </div>
        )}
        {loading && (
          <div className="glass rounded-xl p-8 flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <Loader className="animate-spin w-16 h-16 mx-auto mb-4 text-red-500" />
              <p className="text-gray-200">Creating your character...</p>
              <p className="text-gray-400 text-sm mt-2">(This may take 30-60 seconds)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

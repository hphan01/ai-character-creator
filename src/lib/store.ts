import { create } from 'zustand'

export interface GeneratedImage {
  id: string
  image: string
  prompt: string
  timestamp: number
  tags?: string[]
}

interface CharacterState {
  images: GeneratedImage[]
  addImage: (image: GeneratedImage) => void
  removeImage: (id: string) => void
  clearAll: () => void
  updateImageTags: (id: string, tags: string[]) => void
}

export const useCharacterStore = create<CharacterState>((set) => {
  // Load from localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('character-images')
    if (saved) {
      try {
        const images = JSON.parse(saved)
        set({ images })
      } catch (e) {
        console.error('Failed to load images from localStorage', e)
      }
    }
  }

  return {
    images: [],
    addImage: (image) =>
      set((state) => {
        const newState = { images: [image, ...state.images] }
        if (typeof window !== 'undefined') {
          localStorage.setItem('character-images', JSON.stringify(newState.images))
        }
        return newState
      }),
    removeImage: (id) =>
      set((state) => {
        const newState = { images: state.images.filter((img) => img.id !== id) }
        if (typeof window !== 'undefined') {
          localStorage.setItem('character-images', JSON.stringify(newState.images))
        }
        return newState
      }),
    clearAll: () => {
      set({ images: [] })
      if (typeof window !== 'undefined') {
        localStorage.removeItem('character-images')
      }
    },
    updateImageTags: (id, tags) =>
      set((state) => {
        const newImages = state.images.map((img) =>
          img.id === id ? { ...img, tags } : img
        )
        if (typeof window !== 'undefined') {
          localStorage.setItem('character-images', JSON.stringify(newImages))
        }
        return { images: newImages }
      }),
  }
})

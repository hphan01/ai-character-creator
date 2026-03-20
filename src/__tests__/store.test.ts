import { describe, it, expect, beforeEach } from 'vitest'
import { act } from 'react'
import { useCharacterStore } from '@/lib/store'

const mockImage = {
  id: '1',
  image: 'data:image/png;base64,abc',
  prompt: 'A brave warrior',
  timestamp: 1000,
  tags: ['Human male', 'Knight plate armor'],
}

beforeEach(() => {
  act(() => useCharacterStore.getState().clearAll())
})

describe('useCharacterStore', () => {
  it('starts with an empty images array', () => {
    expect(useCharacterStore.getState().images).toEqual([])
  })

  it('addImage prepends the new image', () => {
    act(() => useCharacterStore.getState().addImage(mockImage))
    expect(useCharacterStore.getState().images[0]).toEqual(mockImage)
  })

  it('addImage persists to localStorage', () => {
    act(() => useCharacterStore.getState().addImage(mockImage))
    const stored = JSON.parse(localStorage.getItem('character-images') || '[]')
    expect(stored[0].id).toBe('1')
  })

  it('removeImage removes the correct entry', () => {
    act(() => useCharacterStore.getState().addImage(mockImage))
    act(() => useCharacterStore.getState().removeImage('1'))
    expect(useCharacterStore.getState().images).toHaveLength(0)
  })

  it('removeImage updates localStorage', () => {
    act(() => useCharacterStore.getState().addImage(mockImage))
    act(() => useCharacterStore.getState().removeImage('1'))
    const stored = JSON.parse(localStorage.getItem('character-images') || '[]')
    expect(stored).toHaveLength(0)
  })

  it('clearAll empties the images array', () => {
    act(() => useCharacterStore.getState().addImage(mockImage))
    act(() => useCharacterStore.getState().clearAll())
    expect(useCharacterStore.getState().images).toHaveLength(0)
  })

  it('clearAll removes localStorage key', () => {
    act(() => useCharacterStore.getState().addImage(mockImage))
    act(() => useCharacterStore.getState().clearAll())
    expect(localStorage.getItem('character-images')).toBeNull()
  })

  it('updateImageTags updates tags for the correct image', () => {
    act(() => useCharacterStore.getState().addImage(mockImage))
    act(() => useCharacterStore.getState().updateImageTags('1', ['new-tag']))
    const updated = useCharacterStore.getState().images.find((i) => i.id === '1')
    expect(updated?.tags).toEqual(['new-tag'])
  })

  it('updateImageTags persists changes to localStorage', () => {
    act(() => useCharacterStore.getState().addImage(mockImage))
    act(() => useCharacterStore.getState().updateImageTags('1', ['tagged']))
    const stored = JSON.parse(localStorage.getItem('character-images') || '[]')
    expect(stored[0].tags).toEqual(['tagged'])
  })
})

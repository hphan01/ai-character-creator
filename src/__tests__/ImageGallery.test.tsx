import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ImageGallery from '@/components/ImageGallery'
import { useCharacterStore } from '@/lib/store'
import type { GeneratedImage } from '@/lib/store'

// Mock the store so we can control its state in tests
vi.mock('@/lib/store', () => ({
  useCharacterStore: vi.fn(),
}))

const mockUseCharacterStore = vi.mocked(useCharacterStore)

const sampleImage: GeneratedImage = {
  id: '1',
  image: 'data:image/png;base64,abc',
  prompt: 'Human female, Fantasy forest, highly detailed',
  timestamp: new Date('2024-01-01').getTime(),
  tags: ['Human female', 'Medieval warrior armor'],
}

const emptyState = {
  images: [],
  removeImage: vi.fn(),
  clearAll: vi.fn(),
  updateImageTags: vi.fn(),
  addImage: vi.fn(),
}

const populatedState = {
  ...emptyState,
  images: [sampleImage],
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ImageGallery – empty state', () => {
  it('shows empty state message when there are no images', () => {
    mockUseCharacterStore.mockReturnValue(emptyState)
    render(<ImageGallery />)
    expect(screen.getByText(/No generated characters yet/i)).toBeInTheDocument()
  })
})

describe('ImageGallery – with images', () => {
  beforeEach(() => {
    mockUseCharacterStore.mockReturnValue(populatedState)
  })

  it('renders the gallery grid with images', () => {
    render(<ImageGallery />)
    expect(screen.getByAltText(sampleImage.prompt)).toBeInTheDocument()
  })

  it('shows the image count in the heading', () => {
    render(<ImageGallery />)
    expect(screen.getByText(/Generated Characters \(1\)/i)).toBeInTheDocument()
  })

  it('renders Clear All button', () => {
    render(<ImageGallery />)
    expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument()
  })

  it('calls clearAll after confirming the dialog', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<ImageGallery />)
    fireEvent.click(screen.getByRole('button', { name: /clear all/i }))
    expect(populatedState.clearAll).toHaveBeenCalledTimes(1)
  })

  it('does NOT call clearAll when confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<ImageGallery />)
    fireEvent.click(screen.getByRole('button', { name: /clear all/i }))
    expect(populatedState.clearAll).not.toHaveBeenCalled()
  })

  it('shows details panel when an image card is clicked', () => {
    render(<ImageGallery />)
    fireEvent.click(screen.getByAltText(sampleImage.prompt))
    expect(screen.getByText('Details')).toBeInTheDocument()
  })

  it('renders existing tags in the details panel', () => {
    render(<ImageGallery />)
    fireEvent.click(screen.getByAltText(sampleImage.prompt))
    expect(screen.getByText('Human female')).toBeInTheDocument()
    expect(screen.getByText('Medieval warrior armor')).toBeInTheDocument()
  })

  it('calls removeImage after confirming delete', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<ImageGallery />)
    fireEvent.click(screen.getByAltText(sampleImage.prompt))
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(populatedState.removeImage).toHaveBeenCalledWith('1')
  })

  it('does NOT call removeImage when delete is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<ImageGallery />)
    fireEvent.click(screen.getByAltText(sampleImage.prompt))
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(populatedState.removeImage).not.toHaveBeenCalled()
  })

  it('adds a tag when input is filled and Add is clicked', () => {
    render(<ImageGallery />)
    fireEvent.click(screen.getByAltText(sampleImage.prompt))
    const input = screen.getByPlaceholderText(/Add tag/i)
    fireEvent.change(input, { target: { value: 'spooky' } })
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }))
    expect(populatedState.updateImageTags).toHaveBeenCalledWith(
      '1',
      expect.arrayContaining(['spooky'])
    )
  })

  it('adds a tag when Enter is pressed in the tag input', () => {
    render(<ImageGallery />)
    fireEvent.click(screen.getByAltText(sampleImage.prompt))
    const input = screen.getByPlaceholderText(/Add tag/i)
    fireEvent.change(input, { target: { value: 'epic' } })
    fireEvent.keyPress(input, { key: 'Enter', charCode: 13 })
    expect(populatedState.updateImageTags).toHaveBeenCalledWith(
      '1',
      expect.arrayContaining(['epic'])
    )
  })

  it('removes a tag when the × button is clicked', () => {
    render(<ImageGallery />)
    fireEvent.click(screen.getByAltText(sampleImage.prompt))
    fireEvent.click(screen.getByLabelText(/Remove tag Human female/i))
    expect(populatedState.updateImageTags).toHaveBeenCalledWith(
      '1',
      expect.not.arrayContaining(['Human female'])
    )
  })
})

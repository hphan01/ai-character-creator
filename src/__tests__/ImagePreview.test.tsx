import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ImagePreview from '@/components/ImagePreview'
import * as characterUtils from '@/lib/characterUtils'

const defaultProps = {
  image: 'data:image/png;base64,abc',
  prompt: 'Human female, Fantasy art style, highly detailed',
  onRegenerate: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ImagePreview', () => {
  it('renders the generated image', () => {
    render(<ImagePreview {...defaultProps} />)
    const img = screen.getByAltText('Generated character')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', defaultProps.image)
  })

  it('displays the prompt text', () => {
    render(<ImagePreview {...defaultProps} />)
    expect(screen.getByText(defaultProps.prompt)).toBeInTheDocument()
  })

  it('renders Download button', () => {
    render(<ImagePreview {...defaultProps} />)
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
  })

  it('renders Copy Prompt button', () => {
    render(<ImagePreview {...defaultProps} />)
    expect(screen.getByRole('button', { name: /copy prompt/i })).toBeInTheDocument()
  })

  it('renders Refine button', () => {
    render(<ImagePreview {...defaultProps} />)
    expect(screen.getByRole('button', { name: /refine/i })).toBeInTheDocument()
  })

  it('calls onRegenerate when Refine is clicked', () => {
    const onRegenerate = vi.fn()
    render(<ImagePreview {...defaultProps} onRegenerate={onRegenerate} />)
    fireEvent.click(screen.getByRole('button', { name: /refine/i }))
    expect(onRegenerate).toHaveBeenCalledTimes(1)
  })

  it('calls downloadImage when Download is clicked', () => {
    const spy = vi.spyOn(characterUtils, 'downloadImage').mockImplementation(() => {})
    render(<ImagePreview {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /download/i }))
    expect(spy).toHaveBeenCalledWith(defaultProps.image, expect.stringMatching(/^character-/))
  })

  it('copies prompt to clipboard and shows "✓ Copied"', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    })

    render(<ImagePreview {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /copy prompt/i }))

    await waitFor(() => expect(screen.getByText(/✓ Copied/)).toBeInTheDocument())
    expect(writeTextMock).toHaveBeenCalledWith(defaultProps.prompt)
  })

  it('renders Share button', () => {
    render(<ImagePreview {...defaultProps} />)
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
  })

  it('opens Share menu when Share button is clicked', () => {
    render(<ImagePreview {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /share/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('closes Share menu when clicking outside', () => {
    render(<ImagePreview {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /share/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})

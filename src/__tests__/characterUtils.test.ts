import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generatePrompt,
  downloadImage,
  shareImage,
  characterOptions,
  type CharacterOptions,
} from '@/lib/characterUtils'

const baseOptions: CharacterOptions = {
  race: 'Human female',
  outfit: 'Medieval warrior armor',
  hairstyle: 'Long wavy hair',
  style: 'Fantasy art style',
  expression: 'Confident and proud',
  setting: 'Fantasy forest',
}

describe('characterOptions', () => {
  it('exports non-empty arrays for all option keys', () => {
    const keys = ['race', 'outfit', 'hairstyle', 'style', 'expression', 'setting'] as const
    keys.forEach((key) => {
      expect(characterOptions[key].length).toBeGreaterThan(0)
    })
  })
})

describe('generatePrompt', () => {
  it('includes all option values in the output', () => {
    const prompt = generatePrompt(baseOptions)
    expect(prompt).toContain('Human female')
    expect(prompt).toContain('Medieval warrior armor')
    expect(prompt).toContain('Long wavy hair')
    expect(prompt).toContain('Fantasy art style')
    expect(prompt).toContain('Confident and proud')
    expect(prompt).toContain('Fantasy forest')
  })

  it('ends with quality suffix', () => {
    const prompt = generatePrompt(baseOptions)
    expect(prompt).toMatch(/highly detailed, professional, masterpiece$/)
  })

  it('includes additionalDetails when provided', () => {
    const prompt = generatePrompt({ ...baseOptions, additionalDetails: 'holding a glowing sword' })
    expect(prompt).toContain('holding a glowing sword')
  })

  it('omits additionalDetails section when empty string', () => {
    const prompt = generatePrompt({ ...baseOptions, additionalDetails: '' })
    // Should not have a leading comma from the empty detail
    expect(prompt).not.toMatch(/,\s*,/)
  })

  it('omits additionalDetails section when undefined', () => {
    const prompt = generatePrompt(baseOptions)
    expect(prompt).not.toContain('undefined')
  })
})

describe('downloadImage', () => {
  beforeEach(() => {
    // Mock DOM methods used by downloadImage
    const clickMock = vi.fn()
    vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickMock,
    } as unknown as HTMLAnchorElement)
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.body)
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => document.body)
  })

  it('creates an anchor element and triggers a click', () => {
    downloadImage('data:image/png;base64,abc', 'test.png')
    expect(document.createElement).toHaveBeenCalledWith('a')
    expect(document.body.appendChild).toHaveBeenCalled()
    expect(document.body.removeChild).toHaveBeenCalled()
  })

  it('falls back to "character.png" when no filename given', () => {
    const anchor = { href: '', download: '', click: vi.fn() } as unknown as HTMLAnchorElement
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)
    downloadImage('data:image/png;base64,abc', '')
    expect(anchor.download).toBe('character.png')
  })
})

describe('shareImage', () => {
  it('calls navigator.share when available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', { value: shareMock, configurable: true })

    shareImage('data:image/png;base64,abc', 'A brave warrior')
    expect(shareMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'AI Character' })
    )
  })

  it('falls back to clipboard when navigator.share is unavailable', async () => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true })
    const clipboardMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: clipboardMock },
      configurable: true,
    })
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    shareImage('data:image/png;base64,abc', 'A brave warrior')
    // clipboard.writeText is async; wait for microtasks
    await Promise.resolve()
    expect(clipboardMock).toHaveBeenCalled()
  })
})

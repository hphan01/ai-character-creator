import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CharacterCustomizer from '@/components/CharacterCustomizer'
import { useCharacterStore } from '@/lib/store'

vi.mock('@/lib/store', () => ({
  useCharacterStore: vi.fn(),
}))

const mockUseCharacterStore = vi.mocked(useCharacterStore)

const storeState = {
  images: [],
  addImage: vi.fn(),
  removeImage: vi.fn(),
  clearAll: vi.fn(),
  updateImageTags: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  mockUseCharacterStore.mockReturnValue(storeState)
  global.fetch = vi.fn()
})

describe('CharacterCustomizer', () => {
  it('renders the Character Presets section', () => {
    render(<CharacterCustomizer />)
    expect(screen.getByText('Character Presets')).toBeInTheDocument()
  })

  it('renders all six preset buttons including ninja', () => {
    render(<CharacterCustomizer />)
    ;['warrior', 'mage', 'rogue', 'paladin', 'fairy', 'ninja'].forEach((preset) => {
      expect(screen.getByRole('button', { name: new RegExp(preset, 'i') })).toBeInTheDocument()
    })
  })

  it('renders the Customize Character section', () => {
    render(<CharacterCustomizer />)
    expect(screen.getByText('Customize Character')).toBeInTheDocument()
  })

  it('renders the Generate Character button', () => {
    render(<CharacterCustomizer />)
    expect(screen.getByRole('button', { name: /generate character/i })).toBeInTheDocument()
  })

  it('shows the placeholder text when no image has been generated', () => {
    render(<CharacterCustomizer />)
    expect(
      screen.getByText(/Configure your character and click/i)
    ).toBeInTheDocument()
  })

  it('loading state shows spinner and disables the generate button', async () => {
    // Delay the fetch so we can observe loading state
    let resolveRequest!: (value: Response) => void
    global.fetch = vi.fn(
      () =>
        new Promise<Response>((res) => {
          resolveRequest = res
        })
    )

    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /generate character/i }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /generating/i })).toBeDisabled()
    )

    // Resolve to avoid unhandled promise
    resolveRequest(
      new Response(JSON.stringify({ image: 'data:image/png;base64,xyz' }), { status: 200 })
    )
  })

  it('displays an error message when the API returns an error', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'API error' }), { status: 500 })
    )

    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /generate character/i }))

    await waitFor(() => expect(screen.getByText(/API error/i)).toBeInTheDocument())
  })

  it('shows a generic error message when fetch throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network'))

    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /generate character/i }))

    await waitFor(() =>
      expect(
        screen.getByText(/An error occurred while generating the image/i)
      ).toBeInTheDocument()
    )
  })

  it('renders the image preview after a successful generation', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ image: 'data:image/png;base64,success' }),
        { status: 200 }
      )
    )

    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /generate character/i }))

    await waitFor(() =>
      expect(screen.getByAltText('Generated character')).toBeInTheDocument()
    )
  })

  it('calls addImage after a successful generation', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ image: 'data:image/png;base64,success' }),
        { status: 200 }
      )
    )

    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /generate character/i }))

    await waitFor(() => expect(storeState.addImage).toHaveBeenCalledTimes(1))
    const saved = storeState.addImage.mock.calls[0][0]
    expect(saved).toMatchObject({
      image: 'data:image/png;base64,success',
      tags: expect.any(Array),
    })
  })

  it('applying a preset resets the dropdowns', () => {
    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /warrior/i }))
    // After warrior preset the race should be "Human male"
    expect(
      (screen.getByDisplayValue('Human male') as HTMLSelectElement).value
    ).toBe('Human male')
  })

  it('updates a dropdown value when changed', () => {
    render(<CharacterCustomizer />)
    const raceSelect = screen.getByDisplayValue('Human female') as HTMLSelectElement
    fireEvent.change(raceSelect, { target: { value: 'Elf male' } })
    expect(raceSelect.value).toBe('Elf male')
  })

  it('updates the additional details textarea', () => {
    render(<CharacterCustomizer />)
    const textarea = screen.getByPlaceholderText(
      /Add any extra details/i
    ) as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'holding a staff' } })
    expect(textarea.value).toBe('holding a staff')
  })

  // ── Custom Prompt mode ──────────────────────────────────────────────────────

  it('renders the Custom Prompt button', () => {
    render(<CharacterCustomizer />)
    expect(screen.getByRole('button', { name: /custom prompt/i })).toBeInTheDocument()
  })

  it('switches to custom prompt mode when Custom Prompt is clicked', () => {
    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /custom prompt/i }))
    expect(screen.getByRole('heading', { name: /custom prompt/i })).toBeInTheDocument()
    expect(screen.queryByText('Customize Character')).not.toBeInTheDocument()
  })

  it('shows the custom prompt textarea in custom mode', () => {
    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /custom prompt/i }))
    expect(screen.getByLabelText('Custom prompt')).toBeInTheDocument()
  })

  it('disables Generate when custom mode is active but prompt is empty', () => {
    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /custom prompt/i }))
    expect(screen.getByRole('button', { name: /generate character/i })).toBeDisabled()
  })

  it('enables Generate once custom prompt has text', () => {
    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /custom prompt/i }))
    fireEvent.change(screen.getByLabelText('Custom prompt'), {
      target: { value: 'a red dragon breathing fire' },
    })
    expect(screen.getByRole('button', { name: /generate character/i })).not.toBeDisabled()
  })

  it('sends the custom prompt directly to the API', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ image: 'data:image/png;base64,ok' }), { status: 200 })
    )

    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /custom prompt/i }))
    fireEvent.change(screen.getByLabelText('Custom prompt'), {
      target: { value: 'a red dragon breathing fire' },
    })
    fireEvent.click(screen.getByRole('button', { name: /generate character/i }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1))
    const body = JSON.parse((global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body)
    expect(body.prompt).toBe('a red dragon breathing fire')
    expect(body.style).toBeUndefined()
  })

  it('tags the saved image as Custom in custom mode', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ image: 'data:image/png;base64,ok' }), { status: 200 })
    )

    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /custom prompt/i }))
    fireEvent.change(screen.getByLabelText('Custom prompt'), {
      target: { value: 'a warrior in snow' },
    })
    fireEvent.click(screen.getByRole('button', { name: /generate character/i }))

    await waitFor(() => expect(storeState.addImage).toHaveBeenCalledTimes(1))
    expect(storeState.addImage.mock.calls[0][0].tags).toEqual(['Custom'])
  })

  it('returns to dropdown mode via "Back to dropdowns" link', () => {
    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /custom prompt/i }))
    fireEvent.click(screen.getByText(/← Back to dropdowns/i))
    expect(screen.getByText('Customize Character')).toBeInTheDocument()
  })

  it('switching to a preset from custom mode restores the dropdowns', () => {
    render(<CharacterCustomizer />)
    fireEvent.click(screen.getByRole('button', { name: /custom prompt/i }))
    fireEvent.click(screen.getByRole('button', { name: /mage/i }))
    expect(screen.getByText('Customize Character')).toBeInTheDocument()
  })
})

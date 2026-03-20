import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

describe('Header', () => {
  it('renders the CHARFORGE brand name', () => {
    render(<Header />)
    expect(screen.getByText('CHAR')).toBeInTheDocument()
    expect(screen.getByText('FORGE')).toBeInTheDocument()
  })

  it('renders the AI badge', () => {
    render(<Header />)
    expect(screen.getByText('AI')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<Header />)
    expect(screen.getByText(/Character Image Generator/i)).toBeInTheDocument()
  })

  it('renders a <header> landmark element', () => {
    const { container } = render(<Header />)
    expect(container.querySelector('header')).toBeTruthy()
  })
})

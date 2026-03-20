'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, ChevronDown } from 'lucide-react'
import { downloadImage } from '@/lib/characterUtils'

interface ShareMenuProps {
  prompt: string
  image: string
  className?: string
}

export default function ShareMenu({ prompt, image, className = 'relative' }: ShareMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const shareText = encodeURIComponent(`Check out this AI character I created! 🎨\n\n"${prompt.slice(0, 200)}"\n\n#AIArt #CharForge #AICharacter`)

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  const handleInstagram = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    downloadImage(image, `charforge-${timestamp}.png`)
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  const handleTikTok = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    downloadImage(image, `charforge-${timestamp}.png`)
    window.open('https://www.tiktok.com/upload', '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  return (
    <div ref={ref} className={className}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Share2 className="w-4 h-4" />
        Share
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full mb-2 left-0 right-0 bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden shadow-xl shadow-black/60 z-50"
        >
          <button
            role="menuitem"
            onClick={handleTwitter}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors focus:outline-none focus:bg-neutral-800"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.004 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X (Twitter)
          </button>
          <div className="border-t border-neutral-800" />
          <button
            role="menuitem"
            onClick={handleInstagram}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors focus:outline-none focus:bg-neutral-800"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Share on Instagram
            <span className="ml-auto text-xs text-gray-500 font-normal">saves image</span>
          </button>
          <div className="border-t border-neutral-800" />
          <button
            role="menuitem"
            onClick={handleTikTok}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors focus:outline-none focus:bg-neutral-800"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.76a4.85 4.85 0 01-1.02-.07z" />
            </svg>
            Share on TikTok
            <span className="ml-auto text-xs text-gray-500 font-normal">saves image</span>
          </button>
        </div>
      )}
    </div>
  )
}

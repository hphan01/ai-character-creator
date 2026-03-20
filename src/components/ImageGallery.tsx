'use client'

import { useState, useRef, useEffect } from 'react'
import { useCharacterStore, GeneratedImage } from '@/lib/store'
import { Trash2, Download, Share2, Tag, ChevronDown } from 'lucide-react'
import { downloadImage } from '@/lib/characterUtils'

function ShareMenu({ prompt, image }: { prompt: string; image: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const tweetText = `Check out this AI character I created! 🎨\n\n"${prompt.slice(0, 200)}"\n\n#AIArt #CharForge #AICharacter`
  const shareText = encodeURIComponent(tweetText)

  const handleTwitter = async () => {
    setOpen(false)
    const filename = `charforge-${Date.now()}.png`

    // Try Web Share API with image file first (works on mobile/supported browsers)
    if (typeof navigator !== 'undefined' && navigator.canShare) {
      try {
        const res = await fetch(image)
        if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`)
        const blob = await res.blob()
        const file = new File([blob], filename, { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: 'AI Character', text: tweetText })
          return
        }
      } catch (err) {
        console.warn('Web Share API failed, falling back to download + tweet:', err)
      }
    }

    // Fallback: download the image then open Twitter intent so users can attach it manually
    downloadImage(image, filename)
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank', 'noopener,noreferrer')
  }

  const handleInstagram = () => {
    downloadImage(image, `charforge-${Date.now()}.png`)
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  const handleTikTok = () => {
    downloadImage(image, `charforge-${Date.now()}.png`)
    window.open('https://www.tiktok.com/upload', '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
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
          <button role="menuitem" onClick={handleTwitter}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors focus:outline-none focus:bg-neutral-800"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.004 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X (Twitter)
            <span className="ml-auto text-xs text-gray-500 font-normal">shares image</span>
          </button>
          <div className="border-t border-neutral-800" />
          <button role="menuitem" onClick={handleInstagram}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors focus:outline-none focus:bg-neutral-800"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Instagram
            <span className="ml-auto text-xs text-gray-500 font-normal">saves image</span>
          </button>
          <div className="border-t border-neutral-800" />
          <button role="menuitem" onClick={handleTikTok}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors focus:outline-none focus:bg-neutral-800"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.76a4.85 4.85 0 01-1.02-.07z" />
            </svg>
            TikTok
            <span className="ml-auto text-xs text-gray-500 font-normal">saves image</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default function ImageGallery() {
  const { images, removeImage, clearAll, updateImageTags } = useCharacterStore()
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null)
  const [newTag, setNewTag] = useState('')

  const handleAddTag = (imageId: string) => {
    if (newTag.trim() && selectedImage) {
      const tags = [...(selectedImage.tags || []), newTag.trim()]
      updateImageTags(imageId, tags)
      const updated = images.find(img => img.id === imageId)
      if (updated) {
        setSelectedImage({ ...updated, tags })
      }
      setNewTag('')
    }
  }

  const handleRemoveTag = (imageId: string, tagToRemove: string) => {
    const tags = (selectedImage?.tags || []).filter(t => t !== tagToRemove)
    updateImageTags(imageId, tags)
    if (selectedImage) {
      setSelectedImage({ ...selectedImage, tags })
    }
  }

  if (images.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-gray-200 text-lg mb-4">No generated characters yet!</p>
        <p className="text-gray-400">
          Go to &quot;Create Character&quot; tab to generate your first AI character image.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Gallery Grid */}
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Generated Characters ({images.length})</h2>
          {images.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete all images?')) {
                  clearAll()
                  setSelectedImage(null)
                }
              }}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map(image => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={`glass rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                selectedImage?.id === image.id ? 'ring-2 ring-red-600' : ''
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.image}
                alt={image.prompt}
                className="w-full h-48 object-cover hover:opacity-75 transition-opacity"
              />
              <div className="p-2">
                <p className="text-xs text-gray-300 truncate">{image.prompt}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(image.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      {selectedImage && (
        <div className="glass rounded-xl p-6 sticky top-4 h-fit space-y-4 max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-bold">Details</h3>

          {/* Preview */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage.image}
            alt={selectedImage.prompt}
            className="w-full rounded-lg"
          />

          {/* Prompt */}
          <div>
            <p className="text-sm font-semibold text-gray-200 mb-2">Prompt:</p>
            <p className="text-sm bg-black/50 rounded-lg p-3 text-gray-200 break-words border border-neutral-700">
              {selectedImage.prompt}
            </p>
          </div>

          {/* Tags */}
          <div>
            <p className="text-sm font-semibold text-gray-200 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedImage.tags?.map(tag => (
                <div
                  key={tag}
                  className="bg-neutral-800 rounded-full px-3 py-1 text-xs text-gray-200 flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(selectedImage.id, tag)}
                    className="text-gray-300 hover:text-white focus:outline-none"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAddTag(selectedImage.id)
                }}
                placeholder="Add tag..."
                className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
              />
              <button
                onClick={() => handleAddTag(selectedImage.id)}
                className="bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Add
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="text-xs text-gray-400 border-t border-neutral-700 pt-4">
            <p>Created: {new Date(selectedImage.timestamp).toLocaleString()}</p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-4">
            <button
              onClick={() => downloadImage(selectedImage.image, `character-${selectedImage.id}.png`)}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <ShareMenu prompt={selectedImage.prompt} image={selectedImage.image} />
            <button
              onClick={() => {
                if (confirm('Delete this image?')) {
                  removeImage(selectedImage.id)
                  setSelectedImage(null)
                }
              }}
              className="col-span-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

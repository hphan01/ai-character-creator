'use client'

import { Download, RotateCcw } from 'lucide-react'
import { downloadImage } from '@/lib/characterUtils'
import { useState } from 'react'
import ShareMenu from '@/components/ShareMenu'

interface ImagePreviewProps {
  image: string
  prompt: string
  onRegenerate: () => void
}

export default function ImagePreview({
  image,
  prompt,
  onRegenerate,
}: ImagePreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    downloadImage(image, `character-${timestamp}.png`)
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt="Generated character"
          className="w-full h-auto"
        />
      </div>

      <div className="glass rounded-xl p-4 space-y-4">
        <div>
          <p className="text-sm text-gray-200 mb-2">Prompt:</p>
          <p className="text-sm bg-black/50 rounded-lg p-3 text-gray-200 border border-neutral-700 break-words">
            {prompt}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopyPrompt}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {copied ? '✓ Copied' : 'Copy Prompt'}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <ShareMenu prompt={prompt} image={image} className="relative flex-1" />
          <button
            onClick={onRegenerate}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <RotateCcw className="w-4 h-4" />
            Refine
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Download, Share2, RotateCcw } from 'lucide-react'
import { downloadImage, shareImage } from '@/lib/characterUtils'
import { useState } from 'react'

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

  const handleShare = () => {
    shareImage(image, prompt)
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
          <p className="text-sm text-gray-400 mb-2">Prompt:</p>
          <p className="text-sm bg-gray-800/50 rounded-lg p-3 text-gray-300 border border-gray-700 break-words">
            {prompt}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopyPrompt}
            className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            {copied ? '✓ Copied' : 'Copy Prompt'}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={handleShare}
            className="flex-1 bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={onRegenerate}
            className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Refine
          </button>
        </div>
      </div>
    </div>
  )
}

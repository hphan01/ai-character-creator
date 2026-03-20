'use client'

import { useState } from 'react'
import { useCharacterStore, GeneratedImage } from '@/lib/store'
import { Trash2, Download, Tag } from 'lucide-react'
import { downloadImage } from '@/lib/characterUtils'
import ShareMenu from '@/components/ShareMenu'

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

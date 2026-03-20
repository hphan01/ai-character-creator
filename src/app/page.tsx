'use client'

import { useState } from 'react'
import CharacterCustomizer from '@/components/CharacterCustomizer'
import ImageGallery from '@/components/ImageGallery'
import Header from '@/components/Header'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create')

  return (
    <main className="min-h-screen bg-black">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-red-500 ${
              activeTab === 'create'
                ? 'bg-red-700 text-white shadow-lg'
                : 'bg-neutral-800 text-gray-200 hover:bg-neutral-700'
            }`}
          >
            Create Character
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-red-500 ${
              activeTab === 'gallery'
                ? 'bg-red-700 text-white shadow-lg'
                : 'bg-neutral-800 text-gray-200 hover:bg-neutral-700'
            }`}
          >
            Gallery
          </button>
        </div>

        {activeTab === 'create' && <CharacterCustomizer />}
        {activeTab === 'gallery' && <ImageGallery />}
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import CharacterCustomizer from '@/components/CharacterCustomizer'
import ImageGallery from '@/components/ImageGallery'
import Header from '@/components/Header'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create')

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'create'
                ? 'bg-gray-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Create Character
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'gallery'
                ? 'bg-gray-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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

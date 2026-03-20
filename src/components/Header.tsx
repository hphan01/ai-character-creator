'use client'

export default function Header() {
  return (
    <header className="border-b border-gray-600/20 glass">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              ✨ AI Character Creator
            </h1>
            <p className="text-gray-400 mt-2">
              Generate stunning AI character images like mage.space
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

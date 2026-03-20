'use client'

export default function Header() {
  return (
    <header className="border-b border-neutral-800 bg-neutral-900">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo mark */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-red-700 flex items-center justify-center shadow-lg shadow-red-900/50">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
                  {/* Stylized character silhouette with spark */}
                  <circle cx="16" cy="9" r="4" fill="white" fillOpacity="0.95" />
                  <path d="M9 28 C9 21 23 21 23 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" fillOpacity="0.95" />
                  <path d="M24 4 L25.5 7.5 L29 9 L25.5 10.5 L24 14 L22.5 10.5 L19 9 L22.5 7.5 Z" fill="#fca5a5" />
                  <path d="M6 2 L7 4.5 L9.5 5.5 L7 6.5 L6 9 L5 6.5 L2.5 5.5 L5 4.5 Z" fill="#fca5a5" fillOpacity="0.7" />
                </svg>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-xl bg-red-700 animate-ping opacity-20" />
            </div>

            {/* Wordmark */}
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-3xl font-black tracking-tight leading-none">
                  <span className="text-white">CHAR</span><span className="text-red-500">FORGE</span>
                </h1>
                <span className="text-[10px] font-bold tracking-widest text-red-400 uppercase bg-red-950/60 border border-red-800 px-1.5 py-0.5 rounded">
                  AI
                </span>
              </div>
              <p className="text-gray-400 text-xs tracking-widest uppercase mt-0.5 font-medium">
                Character Image Generator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

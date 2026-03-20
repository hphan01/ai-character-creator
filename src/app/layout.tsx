import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Character Creator',
  description: 'Generate amazing AI character images with customizable features',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        {children}
      </body>
    </html>
  )
}

#!/bin/bash
# Quick setup script for AI Character Creator

echo "🎨 AI Character Creator - Setup Script"
echo "======================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to https://huggingface.co/settings/tokens"
    echo "2. Create a new token with 'read' access"
    echo "3. Copy the token and open .env.local"
    echo "4. Replace YOUR_HUGGING_FACE_API_KEY_HERE with your token"
    echo ""
else
    echo "✅ .env.local found"
fi

echo ""
echo "🚀 To start development server:"
echo "    npm run dev"
echo ""
echo "📖 Then open http://localhost:3000 in your browser"
echo ""

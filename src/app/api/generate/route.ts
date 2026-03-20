import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_HF_API_KEY
    if (!apiKey || apiKey.includes('YOUR_')) {
      return NextResponse.json(
        { error: 'Hugging Face API key not configured. Please add it to .env.local' },
        { status: 500 }
      )
    }

    const model = process.env.NEXT_PUBLIC_HF_MODEL || 'runwayml/stable-diffusion-v1-5'

    console.log(`Generating image with prompt: "${prompt.substring(0, 50)}..." using model: ${model}`)

    const response = await fetch(
      `https://router.huggingface.co/models/${model}`,
      {
        headers: { 
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      }
    )

    console.log('HF Response Status:', response.status)
    const contentType = response.headers.get('content-type')
    console.log('Response Content-Type:', contentType)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('HF API Error:', errorText, 'Status:', response.status)
      
      if (response.status === 410) {
        return NextResponse.json(
          { error: 'The model is no longer available. Please update your .env.local file with a supported model.' },
          { status: 503 }
        )
      }
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limited. Please wait a moment and try again.' },
          { status: 429 }
        )
      }

      if (response.status === 503) {
        return NextResponse.json(
          { error: 'Model is loading. This can take 1-2 minutes on first run. Please try again in a moment.' },
          { status: 503 }
        )
      }
      
      return NextResponse.json(
        { error: `Failed to generate image: ${errorText || 'Unknown error'}` },
        { status: 503 }
      )
    }

    // Check if response is JSON (status/error message) or binary (image)
    if (contentType && contentType.includes('application/json')) {
      const jsonResponse = await response.json()
      console.log('Received JSON response:', jsonResponse)
      
      // Model might be queued
      if (jsonResponse.estimated_time) {
        return NextResponse.json(
          { error: `Model is loading. Please wait ${Math.ceil(jsonResponse.estimated_time)} seconds and try again.` },
          { status: 503 }
        )
      }
      
      return NextResponse.json(
        { error: 'Unexpected response from API. Please try again.' },
        { status: 503 }
      )
    }

    // Handle binary image response
    const buffer = await response.arrayBuffer()
    
    if (buffer.byteLength === 0) {
      console.error('Received empty response buffer')
      return NextResponse.json(
        { error: 'Received empty image data. Please try again.' },
        { status: 503 }
      )
    }

    const base64 = Buffer.from(buffer).toString('base64')
    const imageData = `data:image/jpeg;base64,${base64}`

    return NextResponse.json({
      success: true,
      image: imageData,
      prompt,
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 180  // 3 minutes to support FLUX models

// List of reliable models to try as fallback
const FALLBACK_MODELS = [
  'stabilityai/stable-diffusion-xl-base-1.0',
  'stabilityai/stable-diffusion-2-1',
]

// Model-specific timeout settings (in milliseconds)
const MODEL_TIMEOUTS: Record<string, number> = {
  'black-forest-labs/FLUX.1-schnell': 60000,          // 1 minute
  'stabilityai/stable-diffusion-xl-base-1.0': 90000,  // 1.5 minutes
  'stabilityai/stable-diffusion-2-1': 90000,          // 1.5 minutes
}

function getTimeoutForModel(model: string): number {
  // Check for exact match first
  if (MODEL_TIMEOUTS[model]) {
    return MODEL_TIMEOUTS[model]
  }
  // Default timeout
  return 60000
}

async function generateImageWithRetry(prompt: string, apiKey: string, model: string, retries = 2): Promise<{ success: boolean; data?: ArrayBuffer; error?: string }> {
  const timeout = getTimeoutForModel(model)
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[Attempt ${attempt}/${retries}] Generating image with model: ${model} (timeout: ${timeout}ms)`)
      
      const response = await fetch(
        `https://router.huggingface.co/hf-inference/models/${model}`,
        {
          headers: { 
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ inputs: prompt }),
          signal: AbortSignal.timeout(timeout),
        }
      )

      const contentType = response.headers.get('content-type') || ''
      console.log(`[Attempt ${attempt}] Response status: ${response.status}, Content-Type: ${contentType}`)

      // Handle loading/queued responses
      if (response.status === 503) {
        const text = await response.text()
        console.warn(`[Attempt ${attempt}] Model loading or too busy: ${text.substring(0, 100)}`)
        
        if (attempt < retries) {
          // Wait before retrying
          const waitTime = Math.min(5000 * attempt, 30000) // Exponential backoff
          console.log(`Waiting ${waitTime}ms before retry...`)
          await new Promise(r => setTimeout(r, waitTime))
          continue
        }
        return { success: false, error: 'Model is currently loading. Please wait a moment and try again.' }
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`[Attempt ${attempt}] Error: ${errorText.substring(0, 200)}`)
        return { success: false, error: `API Error: ${errorText.substring(0, 100)}` }
      }

      // Try to get image data
      const buffer = await response.arrayBuffer()
      
      if (buffer.byteLength === 0) {
        console.warn(`[Attempt ${attempt}] Received empty buffer`)
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 2000))
          continue
        }
        return { success: false, error: 'Received empty response. Please try again.' }
      }

      console.log(`[Attempt ${attempt}] Successfully received image data: ${buffer.byteLength} bytes`)
      return { success: true, data: buffer }

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error(`[Attempt ${attempt}] Exception: ${errorMsg}`)
      
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 2000))
        continue
      }
      return { success: false, error: errorMsg }
    }
  }
  
  return { success: false, error: 'Failed after all retries' }
}

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

    // Use FLUX.1-schnell as default - fast and free on HF inference
    const primaryModel = process.env.NEXT_PUBLIC_HF_MODEL || 'black-forest-labs/FLUX.1-schnell'
    const modelsToTry = [primaryModel, ...FALLBACK_MODELS.filter(m => m !== primaryModel)]

    console.log(`Starting image generation for prompt: "${prompt.substring(0, 50)}..."`)
    console.log(`Models to try: ${modelsToTry.join(', ')}`)

    // Try each model
    for (const model of modelsToTry) {
      console.log(`\n--- Trying model: ${model} ---`)
      const result = await generateImageWithRetry(prompt, apiKey, model, 2)

      if (result.success && result.data) {
        const base64 = Buffer.from(result.data).toString('base64')
        const imageData = `data:image/jpeg;base64,${base64}`

        return NextResponse.json({
          success: true,
          image: imageData,
          prompt,
          model,
        })
      }

      console.log(`Model ${model} failed: ${result.error}`)
      // Continue to next model
    }

    return NextResponse.json(
      { error: 'All models failed. The image generation service may be overloaded. Please try again in a few minutes.' },
      { status: 503 }
    )

  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

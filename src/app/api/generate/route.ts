import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 180  // 3 minutes to support FLUX models

// Primary model for hyper-realistic human portraits
const REALISM_MODEL = 'strangerzonehf/Flux-Super-Realism-LoRA'

// List of reliable models to try as fallback
const FALLBACK_MODELS = [
  'black-forest-labs/FLUX.1-schnell',
  'stabilityai/stable-diffusion-xl-base-1.0',
  'stabilityai/stable-diffusion-2-1',
]

// Model-specific timeout settings (in milliseconds)
const MODEL_TIMEOUTS: Record<string, number> = {
  'strangerzonehf/Flux-Super-Realism-LoRA': 120000,   // 2 minutes – larger LoRA model
  'black-forest-labs/FLUX.1-schnell': 60000,          // 1 minute
  'stabilityai/stable-diffusion-xl-base-1.0': 90000,  // 1.5 minutes
  'stabilityai/stable-diffusion-2-1': 90000,          // 1.5 minutes
}

/** Enhance prompt with photorealism boosters when using the realism model.
 * The trigger word `fluxlora` MUST be present at the start of the prompt
 * to activate the LoRA weights. Without it the model ignores the LoRA entirely.
 */
function buildRealismPrompt(prompt: string): string {
  return `fluxlora, ${prompt}, hyperrealistic, photorealistic, ultra-detailed skin texture, \
pore-level detail, natural subsurface scattering, professional portrait photography, \
Sony A7R V, 85mm f/1.4 lens, soft cinematic lighting, shallow depth of field, \
film grain, 8K UHD, RAW photo, award-winning photography`
}

/** Parameters injected into the HF inference API body for the realism model */
const REALISM_PARAMS = {
  negative_prompt:
    'cartoon, anime, illustration, painting, drawing, art, sketch, 3d render, cgi, ' +
    'ugly, deformed, disfigured, bad anatomy, blurry, low quality, watermark, text, ' +
    'oversaturated, plastic skin, airbrushed, unnatural lighting',
  num_inference_steps: 35,
  guidance_scale: 7.0,
}

/** Pick the best primary model for the requested style */
function selectPrimaryModel(style?: string): string {
  if (style === 'Human realistic') return REALISM_MODEL
  return process.env.NEXT_PUBLIC_HF_MODEL || 'black-forest-labs/FLUX.1-schnell'
}

/** For realism mode, only fall back to FLUX-based models — never SD1/SD2 */
function buildModelQueue(primaryModel: string, style?: string): string[] {
  if (style === 'Human realistic') {
    // Keep fallbacks within the FLUX family so realism is preserved
    return [
      REALISM_MODEL,
      'black-forest-labs/FLUX.1-schnell',
    ]
  }
  return [primaryModel, ...FALLBACK_MODELS.filter(m => m !== primaryModel)]
}

function getTimeoutForModel(model: string): number {
  // Check for exact match first
  if (MODEL_TIMEOUTS[model]) {
    return MODEL_TIMEOUTS[model]
  }
  // Default timeout
  return 60000
}

async function generateImageWithRetry(prompt: string, apiKey: string, model: string, retries = 2, extraParams?: Record<string, unknown>): Promise<{ success: boolean; data?: ArrayBuffer; error?: string }> {
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
          body: JSON.stringify({ inputs: prompt, parameters: extraParams }),
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
    const { prompt, style } = await request.json()

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

    const primaryModel = selectPrimaryModel(style)
    const modelsToTry = buildModelQueue(primaryModel, style)
    const isRealism = style === 'Human realistic'

    // Use an enhanced prompt for the realism model
    const effectivePrompt = isRealism ? buildRealismPrompt(prompt) : prompt

    console.log(`Starting image generation for prompt: "${effectivePrompt.substring(0, 100)}..."`)
    console.log(`Style: ${style || 'default'} → primary model: ${primaryModel}`)
    console.log(`Models to try: ${modelsToTry.join(', ')}`)

    // Try each model
    for (const model of modelsToTry) {
      console.log(`\n--- Trying model: ${model} ---`)
      const promptForModel = model === REALISM_MODEL ? effectivePrompt : (isRealism ? effectivePrompt : prompt)
      const params = model === REALISM_MODEL ? REALISM_PARAMS : undefined
      const result = await generateImageWithRetry(promptForModel, apiKey, model, 2, params)

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

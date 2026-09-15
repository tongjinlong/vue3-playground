import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_TITLE: z.string().trim().min(1),
  VITE_API_BASE_URL: z.union([
    z
      .string()
      .url()
      .regex(/^https?:\/\//),
    z.string().regex(/^\/(?!\/)/),
  ]),
})

export function parseEnv(raw: unknown) {
  const result = envSchema.safeParse(raw)

  if (!result.success) {
    const fields = result.error.issues.map((issue) => issue.path.join('.')).join(', ')

    throw new Error(`Invalid environment configuration: ${fields}`)
  }

  return result.data
}

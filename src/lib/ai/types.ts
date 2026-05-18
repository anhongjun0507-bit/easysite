import { z } from 'zod'

export const menuItemSchema = z.object({
  label: z.string().min(1).max(20),
  description: z.string().min(1).max(80),
})

export const heroCopySchema = z.object({
  headline: z.string().min(1).max(80),
  subhead: z.string().min(1).max(160),
  tone: z.string().min(1).max(20),
})

export const colorPaletteSchema = z.object({
  name: z.string().min(1).max(20),
  primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  recommended: z.boolean(),
})

export const aiCopyResultSchema = z.object({
  menuStructure: z.array(menuItemSchema).min(3).max(10),
  heroCopy: z.array(heroCopySchema).length(3),
  aboutDraft: z.string().min(20).max(500),
  colors: z.array(colorPaletteSchema).length(3),
})

export type MenuItem = z.infer<typeof menuItemSchema>
export type HeroCopy = z.infer<typeof heroCopySchema>
export type ColorPalette = z.infer<typeof colorPaletteSchema>
export type AiCopyResult = z.infer<typeof aiCopyResultSchema>

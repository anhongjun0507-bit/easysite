'use client'

/**
 * /letters 사운드 — 전부 런타임 합성(오디오 파일 0KB).
 *
 * 규칙
 *  · 자동재생 금지. 사용자가 켜기 전에는 AudioContext 를 **만들지도 않는다**.
 *  · 앰비언트는 밤의 저음 한 겹 + 아주 느린 흔들림. 멜로디를 만들지 않는다(편지를 방해하지 않게).
 *  · SFX 는 종이 스치는 소리(필터 노이즈)와 소인 찍히는 소리(짧은 저음) 둘뿐.
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let ambient: { stop: () => void } | null = null
let enabled = false
let lastSfxAt = 0

const AMBIENT_GAIN = 0.055
const SFX_GAIN = 0.09

function ensureContext(): AudioContext | null {
  if (ctx) return ctx
  const Ctor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)
  return ctx
}

/** 밤의 저음 — 디튠된 사인 두 개를 로우패스에 통과시키고 아주 느린 LFO 로 숨쉬게 한다 */
function startAmbient(context: AudioContext, out: GainNode) {
  // 신호 흐름: 오실레이터 → 로우패스 → 숨쉬기(LFO 로 흔들리는 게인) → master
  const breath = context.createGain()
  breath.gain.value = 0.65
  breath.connect(out)

  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 380
  filter.Q.value = 0.7
  filter.connect(breath)

  const voices = [110, 110.6, 165].map((freq, i) => {
    const osc = context.createOscillator()
    osc.type = i === 2 ? 'triangle' : 'sine'
    osc.frequency.value = freq
    const gain = context.createGain()
    gain.gain.value = i === 2 ? 0.16 : 0.5
    osc.connect(gain).connect(filter)
    osc.start()
    return { osc, gain }
  })

  // 아주 느린 진폭 흔들림 (0.06Hz ≈ 16초 주기)
  const lfo = context.createOscillator()
  lfo.frequency.value = 0.06
  const lfoGain = context.createGain()
  lfoGain.gain.value = 0.35
  lfo.connect(lfoGain).connect(breath.gain)
  lfo.start()

  return {
    stop() {
      voices.forEach(({ osc }) => osc.stop())
      lfo.stop()
      filter.disconnect()
      breath.disconnect()
    },
  }
}

export function isSoundOn(): boolean {
  return enabled
}

export async function setSound(on: boolean): Promise<void> {
  enabled = on
  if (!on) {
    if (master && ctx) master.gain.setTargetAtTime(0, ctx.currentTime, 0.4)
    return
  }
  const context = ensureContext()
  if (!context || !master) return
  if (context.state === 'suspended') await context.resume()
  if (!ambient) ambient = startAmbient(context, master)
  master.gain.setTargetAtTime(AMBIENT_GAIN, context.currentTime, 0.9)
}

/** 종이가 스치는 소리 — 짧은 노이즈 버스트를 밴드패스로 훑는다 */
export function playPaper(): void {
  if (!enabled || !ctx || !master) return
  const now = ctx.currentTime
  if (now - lastSfxAt < 0.12) return // 연타 방지
  lastSfxAt = now

  const length = Math.floor(ctx.sampleRate * 0.34)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) {
    const fade = 1 - i / length
    data[i] = (Math.random() * 2 - 1) * fade * fade
  }
  const src = ctx.createBufferSource()
  src.buffer = buffer

  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.setValueAtTime(1400, now)
  band.frequency.exponentialRampToValueAtTime(3200, now + 0.3)
  band.Q.value = 0.8

  const gain = ctx.createGain()
  gain.gain.value = SFX_GAIN
  src.connect(band).connect(gain).connect(master)
  src.start(now)
  src.stop(now + 0.36)
}

/** 소인이 찍히는 소리 — 아주 짧은 저음 한 방 */
export function playStamp(): void {
  if (!enabled || !ctx || !master) return
  const now = ctx.currentTime
  if (now - lastSfxAt < 0.12) return
  lastSfxAt = now

  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(180, now)
  osc.frequency.exponentialRampToValueAtTime(52, now + 0.16)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(SFX_GAIN * 1.5, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24)

  osc.connect(gain).connect(master)
  osc.start(now)
  osc.stop(now + 0.26)
}

/** 페이지를 떠날 때 정리 */
export function disposeAudio(): void {
  ambient?.stop()
  ambient = null
  void ctx?.close()
  ctx = null
  master = null
  enabled = false
}

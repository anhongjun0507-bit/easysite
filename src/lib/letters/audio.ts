'use client'

/**
 * /letters 사운드 — 피아노 한 곡 + 런타임 합성 레이어.
 *
 * 규칙
 *  · 자동재생 금지. 사용자가 켜기 전에는 AudioContext 를 **만들지도 않고** 곡도 받지 않는다.
 *  · 곡은 쇼팽 자장가 Op.57 (Musopen 녹음, CC0 — 저작권·크레딧 의무 없음).
 *    4분짜리라 통째로 디코딩하지 않고 <audio> 로 흘려보낸다(메모리 절약 + 첫 소리까지 대기 짧음).
 *  · 저음 앰비언트는 곡과 같은 내림라(D♭) 로 맞춰 둔다. 곡이 도착하기 전 토글에 즉시 반응하는 역할도 겸한다.
 *  · SFX 는 종이 스치는 소리(필터 노이즈)와 소인 찍히는 소리(짧은 저음) 둘뿐.
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let ambient: { stop: () => void } | null = null
let music: ReturnType<typeof startMusic> | null = null
let enabled = false
let lastSfxAt = 0

const BED_GAIN = 0.055
const SFX_GAIN = 0.09
const MUSIC_SRC = '/letters/berceuse.mp3'
const MUSIC_GAIN = 2
/** 녹음 끝의 무음 — 여기 닿기 전에 되감아 이음매를 짧게 만든다 */
const MUSIC_TAIL = 6.5

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
  breath.gain.value = 0.3 // 피아노가 주인공이라 예전(0.65)보다 낮춘다
  breath.connect(out)

  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 380
  filter.Q.value = 0.7
  filter.connect(breath)

  // D♭2 · 살짝 디튠한 D♭2 · A♭2 — 곡(내림라장조)과 같은 화음이라 부딪히지 않는다
  const voices = [69.3, 69.72, 103.83].map((freq, i) => {
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

/** 피아노 한 곡 — 파일을 통째로 디코딩하지 않고 <audio> 를 그래프에 물려 흘려보낸다 */
function startMusic(context: AudioContext, out: GainNode) {
  const el = new Audio(MUSIC_SRC)
  el.loop = true

  const gain = context.createGain()
  gain.gain.value = 0
  context.createMediaElementSource(el).connect(gain).connect(out)

  // loop 는 파일 끝(무음 포함)에서 돌아온다 — 소리가 남아 있는 지점에서 미리 되감는다
  const rewind = () => {
    if (el.duration && el.currentTime > el.duration - MUSIC_TAIL) el.currentTime = 0
  }
  el.addEventListener('timeupdate', rewind)

  const play = () => void el.play().catch(() => {}) // 제스처 밖에서 막히면 저음만 남는다
  play()
  gain.gain.setTargetAtTime(MUSIC_GAIN, context.currentTime, 1.8)

  // 소리를 끄면 master 가 이미 0 이지만, 재생을 멈춰야 배터리·트래픽을 안 쓴다
  let pauseTimer: ReturnType<typeof setTimeout> | undefined
  return {
    resume() {
      clearTimeout(pauseTimer)
      play()
    },
    suspend() {
      clearTimeout(pauseTimer)
      pauseTimer = setTimeout(() => {
        if (!enabled) el.pause()
      }, 1400)
    },
    stop() {
      clearTimeout(pauseTimer)
      el.removeEventListener('timeupdate', rewind)
      el.pause()
      el.removeAttribute('src')
      gain.disconnect()
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
    music?.suspend()
    return
  }
  const context = ensureContext()
  if (!context || !master) return
  if (context.state === 'suspended') await context.resume()
  // 저음을 먼저 올려 토글에 즉시 반응하고, 곡은 받아지는 대로 그 위에 얹힌다
  if (!ambient) ambient = startAmbient(context, master)
  master.gain.setTargetAtTime(BED_GAIN, context.currentTime, 0.9)
  if (music) music.resume()
  else music = startMusic(context, master)
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
  music?.stop()
  music = null
  ambient?.stop()
  ambient = null
  void ctx?.close()
  ctx = null
  master = null
  enabled = false
}

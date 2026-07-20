'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useEffect, useRef, useState } from 'react'
import { damp, scrollState } from '@/lib/letters/scroll'
import type { PerfProfile } from '@/lib/letters/perf'
import { NightSky } from './NightSky'
import { RouteArc } from './RouteArc'

/**
 * 이 페이지의 유일한 WebGL 레이어 — 화면에 고정된 풀스크린 캔버스 한 장.
 *
 * 여기서 그리는 것: 밤하늘 · 항로 · 종이비행기 (= 분위기)
 * 여기서 그리지 않는 것: 편지 캡쳐 이미지.
 *   캡쳐는 next/image + CSS 3D 로 HTML 에 남긴다 — alt 텍스트·키보드 조작·blur placeholder·CLS 0 을
 *   포기하면서까지 텍스처로 옮길 이유가 없다. WebGL 은 캡쳐 뒤의 공기만 맡는다.
 */

/** 셰이더 컴파일·텍스처 업로드를 첫 스크롤 전에 끝내 둔다(첫 프레임 히치 제거) */
function Warmup() {
  const { gl, scene, camera } = useThree()
  useEffect(() => {
    gl.compile(scene, camera)
    gl.render(scene, camera)
    gl.clear()
  }, [gl, scene, camera])
  return null
}

/** 스크롤 = 고도. 카메라가 별밭을 통과해 내려가고, 포인터로 아주 살짝 기운다. */
function CameraRig() {
  const { camera } = useThree()
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    camera.position.y = damp(camera.position.y, 2 - scrollState.progress * 13, 2.2, dt)
    camera.position.x = damp(camera.position.x, scrollState.pointerX * 0.45, 1.4, dt)
    camera.rotation.x = damp(camera.rotation.x, scrollState.pointerY * 0.03, 1.4, dt)
  })
  return null
}

export function Stage({ perf }: { perf: PerfProfile }) {
  const [visible, setVisible] = useState(true)
  const wrap = useRef<HTMLDivElement>(null)

  // 탭이 뒤에 있으면 렌더를 멈춘다 (배터리·팬 소음)
  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  if (perf.tier === 'none') return null

  return (
    <div className="lt-canvas" ref={wrap} aria-hidden>
      <Canvas
        dpr={perf.dpr}
        frameloop={visible ? 'always' : 'never'}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        camera={{ fov: 58, near: 0.1, far: 60, position: [0, 2, 6] }}
      >
        <Warmup />
        <CameraRig />
        <NightSky count={perf.stars} />
        <RouteArc />
        {perf.postprocessing && (
          <EffectComposer enableNormalPass={false} multisampling={0}>
            <Bloom intensity={0.7} luminanceThreshold={0.22} luminanceSmoothing={0.5} mipmapBlur />
            <Vignette offset={0.28} darkness={0.92} eskil={false} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}

'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { damp, scrollState } from '@/lib/letters/scroll'

/**
 * 밤하늘 — 카메라가 세로로 유영하며 통과하는 별밭.
 *
 * · 별은 월드에 고정, 카메라가 스크롤 진행도만큼 아래로 내려간다(= 편지를 따라 이동하는 감각)
 * · 포인터 근처 별이 밝아진다(Love Lost 의 포인터 스포트라이트 문법)
 * · 파티클 하나당 attribute 3개(위치·크기·시드)뿐 — 저사양에서도 draw call 1회
 */

const FIELD = { x: 15, yTop: 9, yBottom: -20, zNear: 1.5, zFar: -20 }

const VERT = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  varying float vIntensity;
  varying float vTint;

  void main() {
    vec3 pos = position;
    // 아주 느린 표류 — 정지해 있으면 사진처럼 죽는다
    pos.x += sin(uTime * 0.06 + aSeed * 6.283) * 0.14;
    pos.y += cos(uTime * 0.045 + aSeed * 4.712) * 0.10;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float twinkle = 0.55 + 0.45 * sin(uTime * (0.35 + aSeed * 0.9) + aSeed * 12.0);

    // 포인터 스포트라이트: 화면좌표 기준 거리
    vec2 ndc = gl_Position.xy / max(gl_Position.w, 0.0001);
    float spot = smoothstep(0.85, 0.0, distance(ndc, uPointer));

    vIntensity = twinkle * (0.45 + 0.85 * spot);
    vTint = spot;
    gl_PointSize = aSize * uPixelRatio * (11.0 / max(-mv.z, 0.6));
  }
`

const FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vIntensity;
  varying float vTint;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.02, d);
    if (alpha < 0.01) discard;
    vec3 color = mix(uColorA, uColorB, vTint * 0.75);
    gl_FragColor = vec4(color, alpha * vIntensity);
  }
`

export function NightSky({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null)

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const seeds = new Float32Array(count)

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() * 2 - 1) * FIELD.x
      positions[i * 3 + 1] = FIELD.yBottom + Math.random() * (FIELD.yTop - FIELD.yBottom)
      positions[i * 3 + 2] = FIELD.zFar + Math.random() * (FIELD.zNear - FIELD.zFar)
      // 큰 별은 드물게 — 균일하면 인공적으로 보인다
      sizes[i] = 0.5 + Math.pow(Math.random(), 3.2) * 3.4
      seeds[i] = Math.random()
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: 1 },
        uColorA: { value: new THREE.Color('#e8e2df') },
        uColorB: { value: new THREE.Color('#ff9398') },
      },
    })

    return { geometry: geo, material: mat }
  }, [count])

  // 씬에서 빠질 때 GPU 자원 반납
  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)
    const u = material.uniforms
    u.uTime.value += dt
    u.uPixelRatio.value = state.gl.getPixelRatio()
    u.uPointer.value.x = damp(u.uPointer.value.x, scrollState.pointerX, 3, dt)
    u.uPointer.value.y = damp(u.uPointer.value.y, scrollState.pointerY, 3, dt)

    // 스크롤이 곧 고도 — 별밭을 통과해 내려간다
    if (points.current) {
      points.current.rotation.z = damp(points.current.rotation.z, scrollState.progress * 0.12, 1.6, dt)
    }
  })

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
}

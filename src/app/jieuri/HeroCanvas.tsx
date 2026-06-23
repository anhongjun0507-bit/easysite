'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

/**
 * 히어로 WebGL 배경 — 도메인 워프 FBM 셰이더로 '살아 흐르는' 그라데이션.
 * 지으리 팔레트(인디고·바이올렛·스카이·핑크), 포인터에 부드럽게 반응.
 * 풀스크린 단일 쿼드 + 저해상도(dpr 캡) → GPU 비용 낮게 유지.
 */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uPointer;

  const vec3 C_BG     = vec3(0.976, 0.976, 1.000); // #f9f9ff
  const vec3 C_INDIGO = vec3(0.392, 0.400, 0.945); // #6366f1
  const vec3 C_VIOLET = vec3(0.486, 0.227, 0.929); // #7c3aed
  const vec3 C_SKY    = vec3(0.220, 0.741, 0.972); // #38bdf8
  const vec3 C_PINK   = vec3(0.925, 0.282, 0.600); // #ec4899

  vec2 hash2(vec2 p){
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                   dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y);
    vec2 mouse = vec2(uPointer.x * aspect, uPointer.y);
    float t = uTime * 0.05;

    // 도메인 워프 (흐름 + 포인터 영향) — 큰 스케일로 우아하게
    vec2 q = vec2(fbm(p * 1.1 + t), fbm(p * 1.1 + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p * 1.1 + 1.8 * q + vec2(1.7, 9.2) + mouse * 0.40),
                  fbm(p * 1.1 + 1.8 * q + vec2(8.3, 2.8) - mouse * 0.40));
    float f = fbm(p * 1.1 + 2.0 * r + t * 1.6);

    // 팔레트 매핑 — 채도 살려 '흐르는' 컬러가 또렷하게
    vec3 col = C_BG;
    col = mix(col, C_INDIGO, smoothstep(-0.10, 0.55, f));
    col = mix(col, C_VIOLET, smoothstep(0.15, 0.90, length(r)));
    col = mix(col, C_SKY,    smoothstep(0.20, 0.95, q.x * q.x + q.y * 0.3 + 0.15));
    col = mix(col, C_PINK,   smoothstep(0.50, 1.10, f + r.y * 0.5) * 0.70);

    // 하이라이트(블룸 느낌)
    col += pow(max(f, 0.0), 3.0) * 0.12;

    // 리치하게 — 화이트는 살짝만(가독 스크림은 CSS가 담당)
    col = mix(C_BG, col, 0.88);

    // 프리미엄 비네트 — 가장자리 살짝 깊게
    float vig = length((uv - 0.5) * vec2(1.05, 1.0));
    col *= 1.0 - 0.12 * smoothstep(0.55, 1.10, vig);

    // 그레인
    float g = fract(sin(dot(uv * uRes, vec2(12.9898, 78.233))) * 43758.5453);
    col += (g - 0.5) * 0.020;

    gl_FragColor = vec4(col, 1.0);
  }
`

function FlowPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { size } = useThree()
  const current = useRef(new THREE.Vector2(0, 0))
  const target = useRef(new THREE.Vector2(0, 0))

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
    }),
    [],
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      )
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((_, delta) => {
    const mat = materialRef.current
    if (!mat) return
    mat.uniforms.uTime.value += Math.min(delta, 0.05)
    mat.uniforms.uRes.value.set(size.width, size.height)
    current.current.lerp(target.current, 0.04)
    mat.uniforms.uPointer.value.copy(current.current)
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      dpr={[0.7, 1.2]}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      frameloop="always"
    >
      <FlowPlane />
    </Canvas>
  )
}

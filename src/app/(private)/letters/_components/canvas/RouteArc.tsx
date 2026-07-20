'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { damp, scrollState } from '@/lib/letters/scroll'

/**
 * 항로 — 밤하늘에 점선이 그어지고 그 끝을 종이비행기가 활공한다.
 *
 * 카메라를 세로로 따라다니게 두고(그룹 y = 카메라 y), 그리기·투명도는 프롤로그 구간
 * 진행도(scrollState.prologue)로만 제어한다. 덕분에 카메라 유영 로직과 항로 로직이 서로를 모른다.
 * 선이 "그려지는" 연출은 dash 장난이 아니라 setDrawRange 로 실제로 잘라 그린다.
 */

const SEGMENTS = 220

/** 한국(왼쪽 아래)에서 미국(오른쪽 위)으로, 지구 곡률처럼 한 번 크게 부푼 곡선 */
function buildCurve() {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(-6.4, -1.6, -1.2),
    new THREE.Vector3(-3.2, 1.0, -0.2),
    new THREE.Vector3(0, 1.9, 0.4),
    new THREE.Vector3(3.4, 0.9, -0.2),
    new THREE.Vector3(6.6, -1.5, -1.2),
  ])
}

/** 종이비행기 — 접힌 종이 한 장을 삼각형 두 면으로 (텍스처 없이 실루엣만) */
function buildPlaneGeometry() {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute(
    'position',
    new THREE.BufferAttribute(
      // prettier-ignore
      new Float32Array([
        0, 0, 0.24,   -0.16, 0, -0.18,   0, 0.06, -0.06,
        0, 0, 0.24,    0, 0.06, -0.06,   0.16, 0, -0.18,
      ]),
      3,
    ),
  )
  geo.computeVertexNormals()
  return geo
}

export function RouteArc() {
  const group = useRef<THREE.Group>(null)
  const plane = useRef<THREE.Mesh>(null)
  const shown = useRef(0)

  const { curve, line, lineMaterial, planeGeometry, planeMaterial } = useMemo(() => {
    const c = buildCurve()
    const geo = new THREE.BufferGeometry().setFromPoints(c.getSpacedPoints(SEGMENTS))
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#ff9398'),
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const l = new THREE.Line(geo, mat)
    l.frustumCulled = false

    return {
      curve: c,
      line: l,
      lineMaterial: mat,
      planeGeometry: buildPlaneGeometry(),
      planeMaterial: new THREE.MeshBasicMaterial({
        color: new THREE.Color('#f4efec'),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    }
  }, [])

  useEffect(
    () => () => {
      line.geometry.dispose()
      lineMaterial.dispose()
      planeGeometry.dispose()
      planeMaterial.dispose()
    },
    [line, lineMaterial, planeGeometry, planeMaterial],
  )

  // 프레임마다 새 Vector3 를 만들지 않는다
  const head = useMemo(() => new THREE.Vector3(), [])
  const ahead = useMemo(() => new THREE.Vector3(), [])
  const worldAhead = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)
    const t = Math.min(0.999, Math.max(0.001, scrollState.prologue))
    const active = scrollState.prologue > 0.0005 && scrollState.prologue < 0.9995

    // 구간 앞뒤 12%로 페이드 — 갑자기 나타나거나 사라지지 않게
    const target = active ? Math.min(1, t / 0.12, (1 - t) / 0.12) : 0
    shown.current = damp(shown.current, target, 4.5, dt)
    lineMaterial.opacity = shown.current * 0.8
    planeMaterial.opacity = shown.current

    // 비행기가 지나온 만큼만 선이 남는다
    line.geometry.setDrawRange(0, Math.max(2, Math.floor(SEGMENTS * t) + 1))

    if (group.current) {
      group.current.position.y = state.camera.position.y
      group.current.visible = shown.current > 0.002
    }

    if (plane.current && group.current) {
      curve.getPointAt(t, head)
      curve.getPointAt(Math.min(0.999, t + 0.012), ahead)
      plane.current.position.copy(head)
      // 로컬 좌표를 월드로 옮겨서 바라보게 한다(그룹이 y로 움직이므로)
      plane.current.lookAt(group.current.localToWorld(worldAhead.copy(ahead)))
      plane.current.rotation.z += Math.sin(state.clock.elapsedTime * 1.4) * 0.03
    }
  })

  return (
    <group ref={group} position={[0, 0, -3.2]}>
      <primitive object={line} />
      <mesh ref={plane} geometry={planeGeometry} material={planeMaterial} />
    </group>
  )
}

import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Sphere, MeshDistortMaterial, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gokuImage from '../assets/goku_vegeta.png';
import { AppTheme, PRESET_THEMES } from '../themes/themeEngine';

function TouchParticles({ trigger, color }: { trigger: number; color: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<Float32Array | null>(null);

  useEffect(() => {
    if (trigger > 0) {
      const newParticles = new Float32Array(180 * 3);
      for (let i = 0; i < 180 * 3; i++) {
        newParticles[i] = (Math.random() - 0.5) * 0.6;
      }
      setParticles(newParticles);
      if (pointsRef.current) {
        (pointsRef.current.material as THREE.PointsMaterial).opacity = 1;
        pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(newParticles, 3));
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  }, [trigger]);

  useFrame(() => {
    if (pointsRef.current && particles) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i++) {
        positions[i] *= 1.09;
      }
      (pointsRef.current.material as THREE.PointsMaterial).opacity *= 0.93;
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!particles || trigger === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color={color}
        transparent
        opacity={1}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function createProceduralThemeTexture(theme: AppTheme): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, theme.primary);
  grad.addColorStop(0.5, theme.secondary);
  grad.addColorStop(1, '#090d16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.35;
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    const y = (i / 14) * 512;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + (i % 2 === 0 ? 40 : -40), 340, y + (i % 2 === 0 ? -40 : 40), 512, y);
    ctx.stroke();
  }

  const radial = ctx.createRadialGradient(256, 256, 20, 256, 256, 220);
  radial.addColorStop(0, '#ffffff');
  radial.addColorStop(0.3, theme.accent);
  radial.addColorStop(1, 'transparent');
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 512, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function AICore({
  mode,
  isRunning,
  theme,
  burstTrigger,
}: {
  mode: string;
  isRunning: boolean;
  theme: AppTheme;
  burstTrigger: number;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const baseScaleRef = useRef(1);
  const [hovered, setHover] = useState(false);
  const [clickTrigger, setClickTrigger] = useState(0);

  const orbTexture = useTexture(theme.orbImageUrl || gokuImage);

  useEffect(() => {
    orbTexture.colorSpace = THREE.SRGBColorSpace;
    orbTexture.wrapS = THREE.RepeatWrapping;
    orbTexture.wrapT = THREE.ClampToEdgeWrapping;
    orbTexture.repeat.set(-2, 1);
    orbTexture.offset.set(1.5, 0);
    orbTexture.anisotropy = 16;
    orbTexture.needsUpdate = true;
  }, [orbTexture]);

  const customTexture = useMemo(() => {
    if (theme.orbImageUrl) return null;
    return createProceduralThemeTexture(theme);
  }, [theme]);

  useEffect(() => {
    if (burstTrigger > 0) {
      setClickTrigger(prev => prev + 1);
    }
  }, [burstTrigger]);

  useFrame((state) => {
    if (coreRef.current) {
      baseScaleRef.current = THREE.MathUtils.lerp(baseScaleRef.current, hovered ? 0.82 : 1, 0.1);

      if (isRunning && mode === 'Work') {
        const scale = baseScaleRef.current + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        coreRef.current.scale.set(scale, scale, scale);
      } else if (isRunning && mode === 'Break') {
        const scale = baseScaleRef.current + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
        coreRef.current.scale.set(scale, scale, scale);
      } else {
        coreRef.current.scale.set(baseScaleRef.current, baseScaleRef.current, baseScaleRef.current);
      }

      const spinSpeed = isRunning && mode === 'Work' ? 0.8 : 0.3;
      coreRef.current.rotation.y = Math.sin(state.clock.elapsedTime * spinSpeed) * (Math.PI / 2);
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      coreRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const activeMap = theme.orbImageUrl ? orbTexture : customTexture;

  return (
    <group>
      <Sphere
        ref={coreRef}
        args={[1, 128, 128]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onPointerDown={() => setClickTrigger(prev => prev + 1)}
      >
        <MeshDistortMaterial
          key={theme.id}
          map={activeMap}
          color={hovered ? '#ffffff' : theme.orbImageUrl ? '#f0f0f0' : theme.coreColor}
          attach="material"
          distort={isRunning && mode === 'Work' ? 0.32 : 0.14}
          speed={isRunning && mode === 'Work' ? 4.5 : isRunning && mode === 'Break' ? 1 : 2.2}
          roughness={0.15}
          metalness={0.78}
          emissive={theme.orbImageUrl ? '#222222' : theme.coreEmissive}
          emissiveIntensity={hovered ? 0.5 : 0.22}
        />
      </Sphere>
      <TouchParticles trigger={clickTrigger} color={theme.particleColor} />
    </group>
  );
}

export default function AvatarCanvas({
  mode = 'Work',
  isRunning = false,
  theme = PRESET_THEMES.dragonball,
  burstTrigger = 0,
}: {
  mode?: string;
  isRunning?: boolean;
  theme?: AppTheme;
  burstTrigger?: number;
}) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3.5], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[2, 2, -2]} intensity={2} castShadow />
        <spotLight position={[-2, 2, 2]} intensity={2.2} color={theme.accent} />

        <Suspense fallback={<Text position={[0, 0, 0]} fontSize={0.2} color="white">Waking AI...</Text>}>
          <AICore mode={mode} isRunning={isRunning} theme={theme} burstTrigger={burstTrigger} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color={theme.primary} />
        </Suspense>
      </Canvas>
    </div>
  );
}

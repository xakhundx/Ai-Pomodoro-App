import React, { Suspense, useRef, useState, useEffect, useMemo, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gokuImage from '../assets/goku_vegeta.png';
import { AppTheme, PRESET_THEMES } from '../themes/themeEngine';

// Mobile-Safe Error Boundary so WebGL context failure never crashes the React UI
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('WebGL / Canvas encountered an error, rendering mobile fallback orb:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function TouchParticles({ trigger, color }: { trigger: number; color: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<Float32Array | null>(null);

  useEffect(() => {
    if (trigger > 0) {
      const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 90 : 160;
      const newParticles = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
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
        positions[i] *= 1.08;
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
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    const y = (i / 14) * 512;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + (i % 2 === 0 ? 40 : -40), 340, y + (i % 2 === 0 ? -40 : 40), 512, y);
    ctx.stroke();
  }

  const radial = ctx.createRadialGradient(256, 256, 20, 256, 256, 220);
  radial.addColorStop(0, '#ffffff');
  radial.addColorStop(0.35, theme.accent);
  radial.addColorStop(1, 'transparent');
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 512, 512);

  // Add theme badge emblem text on procedural fallback
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(theme.interestPrompt.toUpperCase().slice(0, 14), 256, 268);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function LoadingOrb({ color }: { color: string }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.z += delta * 2;
  });
  return (
    <mesh ref={ringRef}>
      <ringGeometry args={[0.85, 0.9, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
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

  const fallbackTexture = useMemo(() => createProceduralThemeTexture(theme), [theme]);
  const [loadedTexture, setLoadedTexture] = useState<THREE.Texture>(fallbackTexture);

  useEffect(() => {
    setLoadedTexture(fallbackTexture);
    const targetUrl = theme.orbImageUrl || gokuImage;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      targetUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.repeat.set(-2, 1);
        tex.offset.set(1.5, 0);
        tex.anisotropy = 4; // Mobile-safe anisotropy (works on all GPUs)
        tex.needsUpdate = true;
        setLoadedTexture(tex);
      },
      undefined,
      () => {
        setLoadedTexture(fallbackTexture);
      }
    );
  }, [theme.orbImageUrl, fallbackTexture]);

  useEffect(() => {
    if (burstTrigger > 0) {
      setClickTrigger(prev => prev + 1);
    }
  }, [burstTrigger]);

  useFrame((state) => {
    if (coreRef.current) {
      baseScaleRef.current = THREE.MathUtils.lerp(baseScaleRef.current, hovered ? 0.84 : 1, 0.1);

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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const sphereSegments = isMobile ? 48 : 80;

  return (
    <group>
      <Sphere
        ref={coreRef}
        args={[1, sphereSegments, sphereSegments]}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onPointerDown={() => setClickTrigger(prev => prev + 1)}
      >
        <MeshDistortMaterial
          key={`${theme.id}-${loadedTexture.uuid}`}
          map={loadedTexture}
          color={hovered ? '#ffffff' : '#f0f0f0'}
          attach="material"
          distort={isRunning && mode === 'Work' ? 0.32 : 0.14}
          speed={isRunning && mode === 'Work' ? 4.5 : isRunning && mode === 'Break' ? 1 : 2.2}
          roughness={0.18}
          metalness={0.75}
          emissive="#222222"
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
  // Mobile fallback if WebGL is unavailable or crashes on mobile device
  const fallbackUI = (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '170px',
          height: '170px',
          borderRadius: '50%',
          backgroundImage: theme.orbImageUrl ? `url(${theme.orbImageUrl})` : undefined,
          backgroundColor: theme.primary,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: `0 0 35px ${theme.primary}, 0 0 70px ${theme.accent}66, inset 0 0 20px rgba(255,255,255,0.4)`,
          animation: 'pulseGlow 3s ease-in-out infinite',
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        touchAction: 'pan-y',
      }}
    >
      <WebGLErrorBoundary fallback={fallbackUI}>
        <Canvas
          dpr={typeof window !== 'undefined' && window.devicePixelRatio > 1.5 ? [1, 1.5] : [1, 2]}
          camera={{ position: [0, 0, 3.5], fov: 45 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'default' }}
        >
          {/* Zero-download, offline-ready studio lighting calibrated for mobile and desktop */}
          <ambientLight intensity={1.2} />
          <hemisphereLight intensity={1.4} groundColor="#090d16" />
          <directionalLight position={[3, 3, 2]} intensity={2.2} />
          <directionalLight position={[-3, -2, -2]} intensity={1.0} color={theme.secondary} />
          <pointLight position={[0, 1.5, 2.5]} intensity={2.2} color={theme.accent} />
          <pointLight position={[-2, -2, 2]} intensity={1.4} color={theme.primary} />

          <Suspense fallback={<LoadingOrb color={theme.accent} />}>
            <AICore mode={mode} isRunning={isRunning} theme={theme} burstTrigger={burstTrigger} />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}

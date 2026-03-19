import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Sphere, MeshDistortMaterial, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gokuImage from '../assets/goku_vegeta.png';

function TouchParticles({ trigger }: { trigger: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<Float32Array | null>(null);
  const opacities = useRef<number[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      const newParticles = new Float32Array(150 * 3);
      for(let i=0; i<150 * 3; i++) {
        // Start tightly clustered near center
        newParticles[i] = (Math.random() - 0.5) * 0.5; 
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
      for(let i=0; i<positions.length; i++) {
        positions[i] *= 1.1; // Explode outward aggressively
      }
      (pointsRef.current.material as THREE.PointsMaterial).opacity *= 0.92;
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!particles || trigger === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#00ffff" transparent opacity={1} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function AICore({ mode, isRunning }: { mode: string, isRunning: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [clickTrigger, setClickTrigger] = useState(0);

  const texture = useTexture(gokuImage);
  
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(-2, 1);
    texture.offset.set(1.5, 0);
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((state) => {
    if (coreRef.current) {
      if (isRunning && mode === 'Work') {
        const scale = (hovered ? 0.8 : 1) + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        coreRef.current.scale.set(scale, scale, scale);
      } else if (isRunning && mode === 'Break') {
        const scale = (hovered ? 0.8 : 1) + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
        coreRef.current.scale.set(scale, scale, scale);
      } else {
        const targetScale = hovered ? 0.8 : 1;
        coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      }
      
      // Gentle sway instead of full rotation so the image remains uncropped and front-facing
      coreRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      coreRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

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
          map={texture}
          color={hovered ? "#ffffff" : "#f0f0f0"} 
          attach="material" 
          distort={isRunning && mode === 'Work' ? 0.35 : 0.15} 
          speed={isRunning && mode === 'Work' ? 5 : (isRunning && mode === 'Break' ? 1 : 2.5)} 
          roughness={0.15} 
          metalness={0.8}
          emissive="#222222"
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </Sphere>
      <TouchParticles trigger={clickTrigger} />
    </group>
  );
}

export default function AvatarCanvas({ mode = 'Work', isRunning = false }: { mode?: string, isRunning?: boolean }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3.5], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, -2]} intensity={2} castShadow />
        <spotLight position={[-2, 2, 2]} intensity={2} color="#38bdf8" />
        
        <Suspense fallback={<Text position={[0, 0, 0]} fontSize={0.2} color="white">Waking AI...</Text>}>
          <AICore mode={mode} isRunning={isRunning} />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#0ea5e9" />
        </Suspense>
      </Canvas>
    </div>
  );
}

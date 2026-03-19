import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Sphere, MeshDistortMaterial, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gokuImage from '../assets/goku_vegeta.png';

function CustomEnv() {
  const texture = useTexture(gokuImage);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return <Environment map={texture} />;
}

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

  useFrame((state) => {
    if (coreRef.current) {
      if (isRunning && mode === 'Work') {
        coreRef.current.rotation.y += 0.01;
        coreRef.current.rotation.x += 0.005;
        const scale = (hovered ? 0.8 : 1) + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        coreRef.current.scale.set(scale, scale, scale);
      } else if (isRunning && mode === 'Break') {
        coreRef.current.rotation.y += 0.002;
        const scale = (hovered ? 0.8 : 1) + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
        coreRef.current.scale.set(scale, scale, scale);
      } else {
        coreRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        coreRef.current.rotation.x = state.clock.elapsedTime * 0.1;
        const targetScale = hovered ? 0.8 : 1;
        coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      }
      
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
          color={hovered ? "#ffffff" : "#00bfff"} 
          attach="material" 
          distort={isRunning && mode === 'Work' ? 0.65 : 0.4} 
          speed={isRunning && mode === 'Work' ? 5 : (isRunning && mode === 'Break' ? 1 : 2.5)} 
          roughness={0.05} 
          metalness={0.95}
          emissive={hovered ? "#00ffff" : "#0047ab"}
          emissiveIntensity={hovered ? 1.2 : 0.8}
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
          <CustomEnv />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#0ea5e9" />
        </Suspense>
      </Canvas>
    </div>
  );
}

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Sphere, MeshDistortMaterial, Text } from '@react-three/drei';
import * as THREE from 'three';

function AICore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (coreRef.current) {
      // Rotate slowly over time
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      
      // Floating animation
      coreRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Sphere 
      ref={coreRef}
      args={[1, 64, 64]} 
      onPointerOver={() => setHover(true)} 
      onPointerOut={() => setHover(false)}
      scale={hovered ? 1.05 : 1}
    >
      <MeshDistortMaterial 
        color={hovered ? "#38bdf8" : "#0ea5e9"} 
        attach="material" 
        distort={0.4} 
        speed={2} 
        roughness={0.2} 
        metalness={0.8}
        emissive={hovered ? "#38bdf8" : "#0f172a"}
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
}

export default function AvatarCanvas() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, -2]} intensity={2} castShadow />
        <spotLight position={[-2, 2, 2]} intensity={2} color="#38bdf8" />
        
        <Suspense fallback={<Text position={[0, 0, 0]} fontSize={0.2} color="white">Waking AI...</Text>}>
          <AICore />
          <Environment preset="city" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#0ea5e9" />
        </Suspense>
      </Canvas>
    </div>
  );
}

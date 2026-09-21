import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, SpotLight, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Volumetric Spotlight with soft harmonic swaying motion
 */
function SwayingSpotlight() {
  const lightRef = useRef();
  const targetRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lightRef.current) {
      // Soft gentle swaying of the spotlight source
      lightRef.current.position.x = Math.sin(t * 0.75) * 1.8;
      lightRef.current.position.z = 2.0 + Math.cos(t * 0.5) * 1.2;
    }
    if (targetRef.current) {
      // Very subtle sway on the target point on stage
      targetRef.current.position.x = Math.sin(t * 0.5) * 0.6;
      targetRef.current.position.z = Math.cos(t * 0.4) * 0.4;
    }
  });

  return (
    <>
      {/* Invisible target point that the spotlight tracks */}
      <object3D ref={targetRef} position={[0, -1.8, 0]} />

      {/* Volumetric SpotLight beam pointing downward */}
      <SpotLight
        ref={lightRef}
        target={targetRef.current}
        position={[0, 9, 2.5]}
        angle={0.65}
        penumbra={0.9}
        distance={24}
        intensity={4.5}
        color="#cceeff"
        attenuation={8}
        anglePower={5}
        volumetric
        castShadow
      />

      {/* Auxiliary cyan rim light for cinematic contrast */}
      <spotLight
        position={[-6, 7, -2]}
        intensity={1.2}
        color="#00c8ff"
        angle={0.5}
        penumbra={1}
      />
      
      {/* Deep purple back accent light */}
      <spotLight
        position={[6, 8, -4]}
        intensity={1.0}
        color="#7c3aed"
        angle={0.6}
        penumbra={1}
      />
    </>
  );
}

/**
 * Reflective stage ground plane using MeshReflectorMaterial
 */
function StageFloor() {
  return (
    <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[70, 70]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mirror={0.6}
        mixBlur={0.8}
        mixStrength={2.0}
        roughness={0.35}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0a0c12"
        metalness={0.7}
      />
    </mesh>
  );
}

/**
 * Floating ambient particle/dust motes drifting inside the spotlight path
 */
function FloatingDustMotes() {
  return (
    <group position={[0, 1.2, 0]}>
      {/* Primary bright motes concentrated in beam */}
      <Sparkles
        count={85}
        scale={[4.2, 7.5, 4.2]}
        size={2.8}
        speed={0.35}
        opacity={0.8}
        color="#e0f7ff"
        noise={0.6}
      />
      {/* Wider ambient subtle cyan sparkles */}
      <Sparkles
        count={50}
        scale={[8.0, 9.0, 8.0]}
        size={1.6}
        speed={0.2}
        opacity={0.35}
        color="#00c8ff"
        noise={0.4}
      />
    </group>
  );
}

/**
 * Stage Scene assembly with seamless #070709 fog and ambient lights
 */
function StageScene() {
  return (
    <>
      {/* Fog effect blending seamlessly into #070709 */}
      <color attach="background" args={['#070709']} />
      <fog attach="fog" args={['#070709', 5, 22]} />

      {/* Dim baseline ambient fill so shadows remain visible but moody */}
      <ambientLight intensity={0.15} color="#111c2e" />

      {/* Overhead swaying volumetric spotlight beam */}
      <SwayingSpotlight />

      {/* Ambient dust motes inside the spotlight path */}
      <FloatingDustMotes />

      {/* Dark reflective floor plane */}
      <StageFloor />
    </>
  );
}

/**
 * Main HeroBackgroundCanvas component
 */
export default function HeroBackgroundCanvas({ className = '', style = {} }) {
  return (
    <div
      className={`hero-background-canvas-container ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#070709',
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 1.8, 8.5], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        shadows
      >
        <StageScene />
      </Canvas>
    </div>
  );
}

export { HeroBackgroundCanvas };

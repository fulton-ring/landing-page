"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function WireframeBox({ position, rotationSpeed, color = "#1f2937" }: { position: [number, number, number], rotationSpeed: number, color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 0.7;
    }
  });

  const edges = useMemo(() => {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const wireframe = new THREE.EdgesGeometry(geometry);
    return wireframe;
  }, []);

  return (
    <lineSegments position={position} ref={meshRef}>
      <primitive object={edges} />
      <lineBasicMaterial color={color} linewidth={1} />
    </lineSegments>
  );
}

function WireframeSphere({ position, rotationSpeed, color = "#374151" }: { position: [number, number, number], rotationSpeed: number, color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.z += rotationSpeed * 0.5;
    }
  });

  const edges = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1.5, 16, 16);
    const wireframe = new THREE.EdgesGeometry(geometry);
    return wireframe;
  }, []);

  return (
    <lineSegments position={position} ref={meshRef}>
      <primitive object={edges} />
      <lineBasicMaterial color={color} linewidth={1} />
    </lineSegments>
  );
}

function FloatingWireframes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <WireframeBox position={[-3, 2, -5]} rotationSpeed={0.005} color="#111827" />
      <WireframeBox position={[3, -2, -7]} rotationSpeed={0.008} color="#1f2937" />
      <WireframeSphere position={[0, 3, -6]} rotationSpeed={0.006} color="#374151" />
      <WireframeBox position={[-4, -3, -8]} rotationSpeed={0.007} color="#111827" />
      <WireframeSphere position={[4, 1, -9]} rotationSpeed={0.004} color="#1f2937" />
    </group>
  );
}

function AnimatedGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      const opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      (gridRef.current.material as THREE.Material).opacity = opacity;
    }
  });

  return (
    <gridHelper 
      ref={gridRef} 
      args={[20, 20, "#4b5563", "#6b7280"]} 
      position={[0, 0, -10]}
    />
  );
}

export default function Wireframe3D() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <AnimatedGrid />
        <FloatingWireframes />
      </Canvas>
    </div>
  );
}


"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

interface WireframeShape3DProps {
  type: "store" | "factory" | "zap" | "shield" | "home" | "mappin" | "check" | "target" | "database" | "dashboard" | "network" | "gears" | "graph" | "cloud";
  color?: string;
  rotationSpeed?: number;
}

function WireframeShape3D({ 
  type, 
  color = "#111827",
  rotationSpeed = 0 
}: WireframeShape3DProps) {
  // Rotation removed - icons are static

  const geometry = useMemo(() => {
    switch (type) {
      case "store":
        return new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
      case "factory":
        return new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.7, 0.7, 1.2, 8));
      case "zap":
        return new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.8));
      case "shield":
        return new THREE.EdgesGeometry(new THREE.ConeGeometry(0.8, 1.2, 8));
      case "home":
        return new THREE.EdgesGeometry(new THREE.ConeGeometry(1.1, 0.9, 4));
      case "mappin":
        return new THREE.EdgesGeometry(new THREE.SphereGeometry(0.6, 12, 8));
      case "check":
        return new THREE.EdgesGeometry(new THREE.TorusGeometry(0.5, 0.15, 8, 16));
      case "database":
        // Cylinder for database
        return new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.8, 0.8, 1.5, 12));
      case "dashboard":
        // Box with grid lines for dashboard
        return new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 0.8, 0.1));
      case "network":
        // Icosahedron for network
        return new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.8));
      case "gears":
        // Torus for gears/cogs
        return new THREE.EdgesGeometry(new THREE.TorusGeometry(0.6, 0.2, 8, 16));
      case "graph":
        // Pyramid/tetrahedron for graph/chart
        return new THREE.EdgesGeometry(new THREE.TetrahedronGeometry(0.9));
      case "cloud":
        // Sphere with less detail for cloud
        return new THREE.EdgesGeometry(new THREE.SphereGeometry(0.7, 8, 6));
      default:
        return new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
    }
  }, [type]);

  if (type === "target") {
    const ring1 = useMemo(() => new THREE.EdgesGeometry(new THREE.TorusGeometry(0.8, 0.1, 8, 16)), []);
    const ring2 = useMemo(() => new THREE.EdgesGeometry(new THREE.TorusGeometry(0.5, 0.1, 8, 16)), []);
    const ring3 = useMemo(() => new THREE.EdgesGeometry(new THREE.TorusGeometry(0.25, 0.1, 8, 16)), []);
    const crossH = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.6, 0.05, 0.05)), []);
    const crossV = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.05, 1.6, 0.05)), []);
    
    return (
      <group>
        <lineSegments>
          <primitive object={ring1} />
          <lineBasicMaterial color={color} linewidth={1.5} />
        </lineSegments>
        <lineSegments>
          <primitive object={ring2} />
          <lineBasicMaterial color={color} linewidth={1.5} />
        </lineSegments>
        <lineSegments>
          <primitive object={ring3} />
          <lineBasicMaterial color={color} linewidth={1.5} />
        </lineSegments>
        <lineSegments>
          <primitive object={crossH} />
          <lineBasicMaterial color={color} linewidth={1.5} />
        </lineSegments>
        <lineSegments>
          <primitive object={crossV} />
          <lineBasicMaterial color={color} linewidth={1.5} />
        </lineSegments>
      </group>
    );
  }

  return (
    <lineSegments>
      <primitive object={geometry} />
      <lineBasicMaterial color={color} linewidth={1.5} />
    </lineSegments>
  );
}

interface WireframeIcon3DProps {
  type: "store" | "factory" | "zap" | "shield" | "home" | "mappin" | "check" | "target" | "database" | "dashboard" | "network" | "gears" | "graph" | "cloud";
  size?: number;
  color?: string;
  rotationSpeed?: number;
}

export default function WireframeIcon3D({ 
  type, 
  size = 40, 
  color = "#111827",
  rotationSpeed = 0.008 
}: WireframeIcon3DProps) {
  return (
    <div 
      className="inline-block relative" 
      style={{ 
        width: size, 
        height: size,
        minWidth: size,
        minHeight: size,
        position: 'relative'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ width: size, height: size, display: 'block' }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        frameloop="always"
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={0.5} />
        <WireframeShape3D type={type} color={color} rotationSpeed={rotationSpeed} />
      </Canvas>
    </div>
  );
}


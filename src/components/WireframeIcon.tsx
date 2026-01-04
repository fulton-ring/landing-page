"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WireframeIconProps {
  type: "store" | "factory" | "zap" | "shield" | "home" | "mappin" | "check" | "target";
  size?: number;
  color?: string;
  rotationSpeed?: number;
}

function WireframeShape({ 
  type, 
  size = 1, 
  color = "#111827",
  rotationSpeed = 0.005 
}: WireframeIconProps) {
  const meshRef = useRef<THREE.LineSegments>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 0.7;
      meshRef.current.rotation.z += rotationSpeed * 0.3;
    }
  });

  const geometry = useMemo(() => {
    let geom: THREE.BufferGeometry;
    
    switch (type) {
      case "store":
        // Box shape for store
        geom = new THREE.BoxGeometry(size, size, size);
        break;
      case "factory":
        // Cylinder for factory
        geom = new THREE.CylinderGeometry(size * 0.7, size * 0.7, size * 1.2, 8);
        break;
      case "zap":
        // Octahedron for zap/energy
        geom = new THREE.OctahedronGeometry(size);
        break;
      case "shield":
        // Cone for shield
        geom = new THREE.ConeGeometry(size * 0.8, size * 1.2, 8);
        break;
      case "home":
        // Pyramid/cone for home
        geom = new THREE.ConeGeometry(size * 1.1, size * 0.9, 4);
        break;
      case "mappin":
        // Sphere for location pin
        geom = new THREE.SphereGeometry(size * 0.6, 12, 8);
        break;
      case "check":
        // Torus for checkmark (circle)
        geom = new THREE.TorusGeometry(size * 0.5, size * 0.15, 8, 16);
        break;
      case "target":
        // Multiple tori for target rings
        const group = new THREE.Group();
        const torus1 = new THREE.TorusGeometry(size * 0.8, size * 0.1, 8, 16);
        const torus2 = new THREE.TorusGeometry(size * 0.5, size * 0.1, 8, 16);
        const torus3 = new THREE.TorusGeometry(size * 0.25, size * 0.1, 8, 16);
        group.add(new THREE.LineSegments(new THREE.EdgesGeometry(torus1)));
        group.add(new THREE.LineSegments(new THREE.EdgesGeometry(torus2)));
        group.add(new THREE.LineSegments(new THREE.EdgesGeometry(torus3)));
        // For now, use the largest torus as the main geometry
        geom = torus1;
        break;
      default:
        geom = new THREE.BoxGeometry(size, size, size);
    }
    
    return new THREE.EdgesGeometry(geom);
  }, [type, size]);

  if (type === "target") {
    // Render multiple rings for target
    return (
      <group>
        <lineSegments ref={meshRef}>
          <primitive object={useMemo(() => new THREE.EdgesGeometry(new THREE.TorusGeometry(size * 0.8, size * 0.1, 8, 16)), [size])} />
          <lineBasicMaterial color={color} linewidth={1.5} />
        </lineSegments>
        <lineSegments>
          <primitive object={useMemo(() => new THREE.EdgesGeometry(new THREE.TorusGeometry(size * 0.5, size * 0.1, 8, 16)), [size])} />
          <lineBasicMaterial color={color} linewidth={1.5} />
        </lineSegments>
        <lineSegments>
          <primitive object={useMemo(() => new THREE.EdgesGeometry(new THREE.TorusGeometry(size * 0.25, size * 0.1, 8, 16)), [size])} />
          <lineBasicMaterial color={color} linewidth={1.5} />
        </lineSegments>
      </group>
    );
  }

  return (
    <lineSegments ref={meshRef}>
      <primitive object={geometry} />
      <lineBasicMaterial color={color} linewidth={1.5} />
    </lineSegments>
  );
}

export default function WireframeIcon({ 
  type, 
  size = 40, 
  color = "#111827",
  rotationSpeed = 0.008 
}: WireframeIconProps) {
  const canvasSize = size * 2;
  
  return (
    <div className="inline-block" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${canvasSize} ${canvasSize}`}
        className="w-full h-full"
      >
        {/* Fallback: Render as SVG wireframe for now, or we can use Three.js canvas */}
        <g transform={`translate(${canvasSize / 2}, ${canvasSize / 2})`}>
          {type === "store" && (
            <g stroke={color} strokeWidth="2" fill="none">
              <rect x={-size * 0.4} y={-size * 0.4} width={size * 0.8} height={size * 0.8} />
              <line x1={-size * 0.4} y1={-size * 0.4} x2={-size * 0.5} y2={-size * 0.5} />
              <line x1={size * 0.4} y1={-size * 0.4} x2={size * 0.5} y2={-size * 0.5} />
              <line x1={-size * 0.5} y1={-size * 0.5} x2={size * 0.5} y2={-size * 0.5} />
              <line x1={-size * 0.4} y1={size * 0.4} x2={-size * 0.5} y2={size * 0.5} />
              <line x1={size * 0.4} y1={size * 0.4} x2={size * 0.5} y2={size * 0.5} />
              <line x1={-size * 0.5} y1={size * 0.5} x2={size * 0.5} y2={size * 0.5} />
              <line x1={-size * 0.4} y1={-size * 0.4} x2={-size * 0.4} y2={size * 0.4} />
              <line x1={size * 0.4} y1={-size * 0.4} x2={size * 0.4} y2={size * 0.4} />
            </g>
          )}
          {type === "factory" && (
            <g stroke={color} strokeWidth="2" fill="none">
              <ellipse cx="0" cy={size * 0.3} rx={size * 0.35} ry={size * 0.15} />
              <line x1={-size * 0.35} y1={size * 0.3} x2={-size * 0.35} y2={-size * 0.3} />
              <line x1={size * 0.35} y1={size * 0.3} x2={size * 0.35} y2={-size * 0.3} />
              <ellipse cx="0" cy={-size * 0.3} rx={size * 0.35} ry={size * 0.15} />
            </g>
          )}
          {type === "zap" && (
            <g stroke={color} strokeWidth="2" fill="none">
              <polygon points={`0,${-size * 0.5} ${size * 0.3},${size * 0.1} ${-size * 0.2},${size * 0.1} 0,${size * 0.5} ${-size * 0.3},${-size * 0.1} ${size * 0.2},${-size * 0.1}`} />
            </g>
          )}
          {type === "shield" && (
            <g stroke={color} strokeWidth="2" fill="none">
              <path d={`M 0,${-size * 0.5} L ${size * 0.4},${-size * 0.2} L ${size * 0.4},${size * 0.3} L 0,${size * 0.5} L ${-size * 0.4},${size * 0.3} L ${-size * 0.4},${-size * 0.2} Z`} />
            </g>
          )}
          {type === "home" && (
            <g stroke={color} strokeWidth="2" fill="none">
              <polygon points={`0,${-size * 0.4} ${size * 0.4},${size * 0.2} ${-size * 0.4},${size * 0.2}`} />
              <rect x={-size * 0.25} y={size * 0.2} width={size * 0.5} height={size * 0.4} />
            </g>
          )}
          {type === "mappin" && (
            <g stroke={color} strokeWidth="2" fill="none">
              <circle cx="0" cy={size * 0.1} r={size * 0.3} />
              <line x1="0" y1={size * 0.4} x2="0" y2={size * 0.5} />
            </g>
          )}
          {type === "check" && (
            <g stroke={color} strokeWidth="2" fill="none">
              <circle cx="0" cy="0" r={size * 0.4} />
              <polyline points={`${-size * 0.15},0 0,${size * 0.15} ${size * 0.15},${-size * 0.15}`} />
            </g>
          )}
          {type === "target" && (
            <g stroke={color} strokeWidth="2" fill="none">
              <circle cx="0" cy="0" r={size * 0.4} />
              <circle cx="0" cy="0" r={size * 0.25} />
              <circle cx="0" cy="0" r={size * 0.1} />
              <line x1={-size * 0.4} y1="0" x2={size * 0.4} y2="0" />
              <line x1="0" y1={-size * 0.4} x2="0" y2={size * 0.4} />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}


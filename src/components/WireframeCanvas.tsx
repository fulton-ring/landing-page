"use client";

import { useEffect, useRef } from "react";

export default function WireframeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Generate random wireframe structure
    const nodes: Array<{ x: number; y: number; z: number }> = [];
    const connections: Array<[number, number]> = [];

    // Create nodes in 3D space
    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 500 - 250,
      });
    }

    // Connect nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 200) {
          connections.push([i, j]);
        }
      }
    }

    let time = 0;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let mouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;
    };
    
    const handleMouseLeave = () => {
      mouseActive = false;
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      time += 0.01;
      // Clear without darkening - use transparent or very light
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#6b7280";
      ctx.lineWidth = 1;

      // Project 3D to 2D and draw connections with mouse interaction
      const mouseZInfluence = mouseActive ? (Math.sin(time * 2) * 30) : 0;
      
      const projectedNodes = nodes.map((node) => {
        let zOffset = Math.sin(time + node.z * 0.01) * 50;
        
        // Nodes near mouse get pulled forward in 3D space
        if (mouseActive) {
          const nodeDist2D = Math.sqrt(
            Math.pow(node.x - mouseX, 2) + Math.pow(node.y - mouseY, 2)
          );
          if (nodeDist2D < 200) {
            const pull = (1 - nodeDist2D / 200) * 100;
            zOffset -= pull;
          }
        }
        
        const scale = 400 / (400 + node.z + zOffset);
        return {
          x: (node.x - canvas.width / 2) * scale + canvas.width / 2,
          y: (node.y - canvas.height / 2) * scale + canvas.height / 2,
          z: node.z + zOffset,
          original: node,
        };
      });

      // Sort by z for proper rendering
      projectedNodes.sort((a, b) => b.z - a.z);

      connections.forEach(([i, j]) => {
        const a = projectedNodes[i];
        const b = projectedNodes[j];
        if (!a || !b) return;

        const dist = Math.abs(a.z - b.z);
        let opacity = Math.max(0, 1 - dist / 300);
        
        // Calculate distance from mouse to line midpoint
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const lineDist = Math.sqrt(
          Math.pow(mouseX - midX, 2) + Math.pow(mouseY - midY, 2)
        );
        
        // Enhance lines near mouse
        if (mouseActive && lineDist < 150) {
          const mouseInfluence = 1 - (lineDist / 150);
          opacity = Math.min(1, opacity + mouseInfluence * 0.4);
          ctx.lineWidth = 1 + mouseInfluence * 1.5;
        } else {
          ctx.lineWidth = 1;
        }

        ctx.beginPath();
        ctx.strokeStyle = `rgba(107, 114, 128, ${opacity * 0.35})`;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      // Draw nodes with enhanced mouse interaction
      projectedNodes.forEach((node) => {
        const dist = Math.sqrt(
          Math.pow(node.x - mouseX, 2) + Math.pow(node.y - mouseY, 2)
        );
        const glow = Math.max(0, 1 - dist / 250);
        
        let size = 3;
        let opacity = 0.4;
        
        if (mouseActive && dist < 250) {
          // Nodes glow and grow near mouse
          size = 3 + glow * 5;
          opacity = 0.4 + glow * 0.45;
          
          // Add a glow ring for nodes very close to mouse
          if (dist < 100) {
            const ringOpacity = (1 - dist / 100) * 0.35;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 4, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(107, 114, 128, ${ringOpacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }

        ctx.fillStyle = `rgba(107, 114, 128, ${opacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset line width
        ctx.lineWidth = 1;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-70"
      style={{ mixBlendMode: "normal", pointerEvents: "auto", cursor: "none" }}
    />
  );
}


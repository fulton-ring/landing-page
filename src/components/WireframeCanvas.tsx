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

    // Generate 3D mesh grid
    const getResponsiveGrid = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      const cellSize = isMobile ? 35 : isTablet ? 45 : 55;
      const cols = Math.ceil(canvas.width / cellSize) + 3;
      const rows = Math.ceil(canvas.height / cellSize) + 3;
      return { cellSize, cols, rows };
    };

    // 3D projection helper
    const project3D = (x: number, y: number, z: number) => {
      const fov = 400;
      const scale = fov / (fov + z);
      return {
        x: (x - canvas.width / 2) * scale + canvas.width / 2,
        y: (y - canvas.height / 2) * scale + canvas.height / 2,
        scale,
      };
    };

    const animate = () => {
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { cellSize, cols, rows } = getResponsiveGrid();
      const lineWidth = window.innerWidth < 768 ? 0.5 : window.innerWidth < 1024 ? 0.6 : 0.7;
      const baseOpacity = window.innerWidth < 768 ? 0.2 : window.innerWidth < 1024 ? 0.25 : 0.3;

      // Create 3D mesh points
      const meshPoints: Array<Array<{ x: number; y: number; z: number }>> = [];
      
      for (let row = 0; row < rows; row++) {
        meshPoints[row] = [];
        for (let col = 0; col < cols; col++) {
          const x = (col - 1) * cellSize;
          const y = (row - 1) * cellSize;
          
          // Calculate mouse influence
          const distToMouse = Math.sqrt(
            Math.pow(mouseX - (x + canvas.width / 2), 2) + 
            Math.pow(mouseY - (y + canvas.height / 2), 2)
          );
          const mouseInfluence = mouseActive
            ? Math.max(0, (1 - distToMouse / 300) * 30)
            : 0;
          
          // Create undulating surface with multiple wave frequencies
          const wave1 = Math.sin((x * 0.02) + time) * 25;
          const wave2 = Math.sin((y * 0.015) + time * 0.8) * 20;
          const wave3 = Math.sin((x * 0.01 + y * 0.01) + time * 1.2) * 15;
          const z = wave1 + wave2 + wave3 + mouseInfluence;
          
          meshPoints[row][col] = { x, y, z };
        }
      }

      // Draw mesh lines with depth fading
      ctx.strokeStyle = `rgba(107, 114, 128, ${baseOpacity})`;
      ctx.lineWidth = lineWidth;

      // Draw horizontal mesh lines
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols - 1; col++) {
          const p1 = meshPoints[row][col];
          const p2 = meshPoints[row][col + 1];
          
          const proj1 = project3D(p1.x, p1.y, p1.z);
          const proj2 = project3D(p2.x, p2.y, p2.z);
          
          // Fade based on z-depth
          const avgZ = (p1.z + p2.z) / 2;
          const depthFactor = Math.max(0, 1 - (avgZ + 50) / 200);
          
          if (depthFactor > 0) {
            ctx.strokeStyle = `rgba(107, 114, 128, ${baseOpacity * depthFactor})`;
            ctx.beginPath();
            ctx.moveTo(proj1.x, proj1.y);
            ctx.lineTo(proj2.x, proj2.y);
            ctx.stroke();
          }
        }
      }

      // Draw vertical mesh lines
      for (let row = 0; row < rows - 1; row++) {
        for (let col = 0; col < cols; col++) {
          const p1 = meshPoints[row][col];
          const p2 = meshPoints[row + 1][col];
          
          const proj1 = project3D(p1.x, p1.y, p1.z);
          const proj2 = project3D(p2.x, p2.y, p2.z);
          
          // Fade based on z-depth
          const avgZ = (p1.z + p2.z) / 2;
          const depthFactor = Math.max(0, 1 - (avgZ + 50) / 200);
          
          if (depthFactor > 0) {
            ctx.strokeStyle = `rgba(107, 114, 128, ${baseOpacity * depthFactor})`;
            ctx.beginPath();
            ctx.moveTo(proj1.x, proj1.y);
            ctx.lineTo(proj2.x, proj2.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes at intersections with depth
      const nodeSize = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 1.2 : 1.5;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const p = meshPoints[row][col];
          const proj = project3D(p.x, p.y, p.z);
          
          const depthFactor = Math.max(0, 1 - (p.z + 50) / 200);
          if (depthFactor > 0) {
            const opacity = baseOpacity * depthFactor * 1.3;
            ctx.fillStyle = `rgba(107, 114, 128, ${opacity})`;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, nodeSize * proj.scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

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

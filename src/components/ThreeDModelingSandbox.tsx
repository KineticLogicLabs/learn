/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RefreshCw, Layers, Sliders, Box, HelpCircle, Activity, Compass, Cpu } from 'lucide-react';
import { MeshType, SandboxOptions } from '../types';

export default function ThreeDModelingSandbox() {
  // Canvas and interaction states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [options, setOptions] = useState<SandboxOptions>({
    meshType: MeshType.TORUS_KNOT,
    resolution: 32,
    scale: 1.2,
    rotationSpeed: 0.8,
    rippleFrequency: 1.8,
    deformScale: 1.0,
    isWireframe: true,
    showVertices: false,
    showShading: true,
  });

  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [angles, setAngles] = useState({ yaw: 0.4, pitch: -0.5, roll: 0.1 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<{ x: number; y: number; index: number; coords3d: [number, number, number] } | null>(null);
  const [fps, setFps] = useState<number>(60);
  const [stats, setStats] = useState({ vertices: 0, polygons: 0 });

  // Handle manual dragging to orbit the shape
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragStart) {
      // Vertex hover check
      if (canvasRef.current && projectedPointsRef.current.length > 0) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        let found = false;
        for (let i = 0; i < projectedPointsRef.current.length; i++) {
          const pt = projectedPointsRef.current[i];
          const dist = Math.hypot(pt.px - mouseX, pt.py - mouseY);
          if (dist < 8) {
            setHoveredVertex({
              x: pt.px,
              y: pt.py,
              index: i,
              coords3d: pt.orig,
            });
            found = true;
            break;
          }
        }
        if (!found) setHoveredVertex(null);
      }
      return;
    }
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setAngles(prev => ({
      ...prev,
      yaw: prev.yaw + dx * 0.007,
      pitch: prev.pitch + dy * 0.007,
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUpOrLeave = () => {
    setDragStart(null);
  };

  // References to keep data across animation frames smoothly
  const anglesRef = useRef(angles);
  anglesRef.current = angles;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  const projectedPointsRef = useRef<{ px: number; py: number; orig: [number, number, number] }[]>([]);

  // Math helper formulas to display in UI
  const meshFormula = useMemo(() => {
    switch (options.meshType) {
      case MeshType.TORUS_KNOT:
        return {
          title: '3,7 Torus Knot Vector',
          latex: 'r = cos(7θ) + 2; x = r·cos(3θ); y = r·sin(3θ); z = -sin(7θ)',
          desc: 'Extruded circular tubular coordinates wrapped procedurally across a toroidal manifold.'
        };
      case MeshType.MOBIUS_STRIP:
        return {
          title: 'Non-Orientable Mobius Sheet',
          latex: 'x = (1 + 0.5·v·cos(u/2))·cos(u); z = 0.5·v·sin(u/2)',
          desc: 'A single-sided topological construct parameterized with a half-angle vertex twist.'
        };
      case MeshType.KINETIC_GRID:
        return {
          title: 'Dynamic Wave Lattice',
          latex: 'z = sin(r·f - t) · d; r = sqrt(x² + y²)',
          desc: 'Real-time spatial deformation mesh simulating continuous fluid wave kinetics.'
        };
      case MeshType.HYPERBOLIC_PARABOLOID:
        return {
          title: 'Hyperbolic Paraboloid Saddle',
          latex: 'z = d · (x² - y²) · 0.35',
          desc: 'An elegant doubly-ruled mathematical surface with uniform negative curvature.'
        };
      case MeshType.DODECAHEDRON:
        return {
          title: 'Platonic Dodecahedron (12-Faces)',
          latex: 'Vertices: (±1, ±1, ±1) & (0, ±1/φ, ±φ) where φ = 1.618',
          desc: 'A clean architectural polygon composed of twelve regular pentagonal subdivisions.'
        };
    }
  }, [options.meshType]);

  // Main procedural 3D modeling coordinate generator
  const generateMesh = (type: MeshType, res: number, deform: number, time: number) => {
    const vertices: [number, number, number][] = [];
    const faces: number[][] = [];

    if (type === MeshType.TORUS_KNOT) {
      // A beautiful 3D tube wound around a torus knot (3,7)
      const p = 3;
      const q = 7;
      const uSteps = res; // segments along the knot
      const vSteps = 8;   // subdivisions of the tube profile circle
      const tubeRadius = 0.25 * deform;

      // 1. Generate core backbone curve points and their tangent frames
      const backbone: [number, number, number][] = [];
      const tangent: [number, number, number][] = [];
      const normal: [number, number, number][] = [];
      const binormal: [number, number, number][] = [];

      for (let i = 0; i < uSteps; i++) {
        const theta = (i / uSteps) * Math.PI * 2;
        const r = Math.cos(q * theta) * 0.45 + 1.2;
        const x = r * Math.cos(p * theta) * 0.7;
        const y = r * Math.sin(p * theta) * 0.7;
        const z = -Math.sin(q * theta) * 0.6;
        backbone.push([x, y, z]);

        // Tangent approximation
        const dTheta = 0.005;
        const rNext = Math.cos(q * (theta + dTheta)) * 0.45 + 1.2;
        const xNext = rNext * Math.cos(p * (theta + dTheta)) * 0.7;
        const yNext = rNext * Math.sin(p * (theta + dTheta)) * 0.7;
        const zNext = -Math.sin(q * (theta + dTheta)) * 0.6;
        
        const tx = xNext - x;
        const ty = yNext - y;
        const tz = zNext - z;
        const tLen = Math.hypot(tx, ty, tz);
        tangent.push([tx / tLen, ty / tLen, tz / tLen]);
      }

      // Compute simple Frenet-Serret frames
      for (let i = 0; i < uSteps; i++) {
        const T = tangent[i];
        // Arbitrary vector to cross with
        let A: [number, number, number] = [0, 1, 0];
        if (Math.abs(T[1]) > 0.9) A = [1, 0, 0];

        // Normal = T x A
        const nx = T[1] * A[2] - T[2] * A[1];
        const ny = T[2] * A[0] - T[0] * A[2];
        const nz = T[0] * A[1] - T[1] * A[0];
        const nLen = Math.hypot(nx, ny, nz);
        const N: [number, number, number] = [nx / nLen, ny / nLen, nz / nLen];
        normal.push(N);

        // Binormal = T x N
        const bx = T[1] * N[2] - T[2] * N[1];
        const by = T[2] * N[0] - T[0] * N[2];
        const bz = T[0] * N[1] - T[1] * N[0];
        binormal.push([bx, by, bz]);
      }

      // 2. Extrude tubular circles around the backbone
      for (let i = 0; i < uSteps; i++) {
        const center = backbone[i];
        const N = normal[i];
        const B = binormal[i];

        for (let j = 0; j < vSteps; j++) {
          const phi = (j / vSteps) * Math.PI * 2;
          const x = center[0] + (Math.cos(phi) * N[0] + Math.sin(phi) * B[0]) * tubeRadius;
          const y = center[1] + (Math.cos(phi) * N[1] + Math.sin(phi) * B[1]) * tubeRadius;
          const z = center[2] + (Math.cos(phi) * N[2] + Math.sin(phi) * B[2]) * tubeRadius;
          vertices.push([x, y, z]);
        }
      }

      // 3. Connect vertices with quad faces
      for (let i = 0; i < uSteps; i++) {
        const nextI = (i + 1) % uSteps;
        for (let j = 0; j < vSteps; j++) {
          const nextJ = (j + 1) % vSteps;
          
          const idx0 = i * vSteps + j;
          const idx1 = i * vSteps + nextJ;
          const idx2 = nextI * vSteps + nextJ;
          const idx3 = nextI * vSteps + j;

          faces.push([idx0, idx1, idx2, idx3]);
        }
      }
    } 
    else if (type === MeshType.MOBIUS_STRIP) {
      // Standard parameterized Mobius Band
      const uSteps = res;
      const vSteps = 6; // width resolution

      for (let i = 0; i < uSteps; i++) {
        const u = (i / uSteps) * Math.PI * 2;
        for (let j = 0; j < vSteps; j++) {
          const v = (j / (vSteps - 1) - 0.5) * 0.8 * deform;
          
          // Mobius Strip Formula
          const r = 1.0 + (v * Math.cos(u / 2));
          const x = r * Math.cos(u) * 1.1;
          const y = r * Math.sin(u) * 1.1;
          const z = v * Math.sin(u / 2) * 1.1;

          vertices.push([x, y, z]);
        }
      }

      // Construct faces
      for (let i = 0; i < uSteps - 1; i++) {
        for (let j = 0; j < vSteps - 1; j++) {
          const idx0 = i * vSteps + j;
          const idx1 = i * vSteps + (j + 1);
          const idx2 = (i + 1) * vSteps + (j + 1);
          const idx3 = (i + 1) * vSteps + j;
          faces.push([idx0, idx1, idx2, idx3]);
        }
      }

      // Connect the seam (reverses the v-axis orientation since it has a 180 deg twist!)
      for (let j = 0; j < vSteps - 1; j++) {
        const idx0 = (uSteps - 1) * vSteps + j;
        const idx1 = (uSteps - 1) * vSteps + (j + 1);
        
        // Connect seam to index 0, but reversed in v dimension
        const idx2 = 0 * vSteps + (vSteps - 1 - (j + 1));
        const idx3 = 0 * vSteps + (vSteps - 1 - j);
        faces.push([idx0, idx1, idx2, idx3]);
      }
    } 
    else if (type === MeshType.KINETIC_GRID) {
      // Rippling Sine-wave lattice
      const size = Math.round(res / 2) + 4; // limit resolution grid to look clean
      const range = 2.4;

      for (let i = 0; i < size; i++) {
        const x = (i / (size - 1) - 0.5) * range;
        for (let j = 0; j < size; j++) {
          const y = (j / (size - 1) - 0.5) * range;
          const r = Math.hypot(x, y);
          
          // Ripple function based on simulation time and deformation sliders
          const z = Math.sin(r * options.rippleFrequency - time * 0.05) * 0.45 * deform;
          vertices.push([x, y, z]);
        }
      }

      // Draw grid panels
      for (let i = 0; i < size - 1; i++) {
        for (let j = 0; j < size - 1; j++) {
          const idx0 = i * size + j;
          const idx1 = i * size + (j + 1);
          const idx2 = (i + 1) * size + (j + 1);
          const idx3 = (i + 1) * size + j;
          faces.push([idx0, idx1, idx2, idx3]);
        }
      }
    } 
    else if (type === MeshType.HYPERBOLIC_PARABOLOID) {
      // Geometric Saddle Shape
      const size = Math.round(res / 2) + 4;
      const range = 2.2;

      for (let i = 0; i < size; i++) {
        const x = (i / (size - 1) - 0.5) * range;
        for (let j = 0; j < size; j++) {
          const y = (j / (size - 1) - 0.5) * range;
          
          // Saddle formula: z = x² - y²
          const z = (x * x - y * y) * 0.35 * deform;
          vertices.push([x, y, z]);
        }
      }

      // Draw grid panels
      for (let i = 0; i < size - 1; i++) {
        for (let j = 0; j < size - 1; j++) {
          const idx0 = i * size + j;
          const idx1 = i * size + (j + 1);
          const idx2 = (i + 1) * size + (j + 1);
          const idx3 = (i + 1) * size + j;
          faces.push([idx0, idx1, idx2, idx3]);
        }
      }
    } 
    else if (type === MeshType.DODECAHEDRON) {
      // Golden ratio φ
      const phi = (1 + Math.sqrt(5)) / 2;
      const rawVerts: [number, number, number][] = [
        // Cube vertices
        [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
        [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
        // Golden rectangles vertices
        [0, 1/phi, phi], [0, 1/phi, -phi], [0, -1/phi, phi], [0, -1/phi, -phi],
        [1/phi, phi, 0], [1/phi, -phi, 0], [-1/phi, phi, 0], [-1/phi, -phi, 0],
        [phi, 0, 1/phi], [phi, 0, -1/phi], [-phi, 0, 1/phi], [-phi, 0, -1/phi]
      ];

      // Normalize scale nicely
      const normVerts = rawVerts.map(([x, y, z]) => {
        const scaleFactor = 0.9 * deform;
        return [x * scaleFactor, y * scaleFactor, z * scaleFactor] as [number, number, number];
      });

      vertices.push(...normVerts);

      // A dodecahedron has 12 pentagonal faces
      const rawFaces = [
        [8, 10, 2, 16, 0],   // front-right-top
        [8, 0, 12, 14, 4],   // front-top-left
        [8, 4, 18, 6, 10],   // front-left-bottom
        [10, 6, 15, 13, 2],  // front-bottom-right
        [16, 2, 13, 3, 17],  // right-mid
        [12, 0, 16, 17, 1],  // top-right-back
        [14, 12, 1, 9, 5],   // top-mid
        [18, 4, 14, 5, 19],  // top-left-back
        [6, 18, 19, 7, 15],  // left-mid
        [15, 7, 11, 3, 13],  // bottom-mid
        [11, 7, 19, 5, 9],   // back-mid-left
        [11, 9, 1, 17, 3]    // back-mid-right
      ];

      faces.push(...rawFaces);
    }

    return { vertices, faces };
  };

  // Main high-performance render loop using HTML5 Canvas
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsInterval = lastTime;
    let simTime = 0;

    const render = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure crisp high-DPI scaling
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }

      // Compute FPS metrics
      frameCount++;
      const now = performance.now();
      if (now - fpsInterval >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - fpsInterval)));
        frameCount = 0;
        fpsInterval = now;
      }

      // Rotate automatically if active
      if (isRotatingRef.current) {
        const delta = (now - lastTime) * 0.001;
        setAngles(prev => ({
          ...prev,
          yaw: prev.yaw + optionsRef.current.rotationSpeed * 0.25 * delta,
          pitch: prev.pitch + optionsRef.current.rotationSpeed * 0.1 * delta,
        }));
        simTime += (now - lastTime) * optionsRef.current.rippleFrequency;
      } else {
        simTime += (now - lastTime); // steady state time
      }
      lastTime = now;

      // Clear with warm bone white base
      ctx.fillStyle = '#FBFBF9';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle inner canvas coordinate guides
      ctx.strokeStyle = 'rgba(13, 20, 41, 0.05)';
      ctx.lineWidth = 1;
      
      // Vertical crosshair
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      // Horizontal crosshair
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Render model geometries
      const { vertices, faces } = generateMesh(
        optionsRef.current.meshType,
        optionsRef.current.resolution,
        optionsRef.current.deformScale,
        simTime
      );

      // Update structural stats
      setStats({ vertices: vertices.length, polygons: faces.length });

      // Rotate and Project 3D points to 2D Screen Coordinate Space
      const yaw = anglesRef.current.yaw;
      const pitch = anglesRef.current.pitch;
      const roll = anglesRef.current.roll;

      const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch), sinP = Math.sin(pitch);
      const cosR = Math.cos(roll), sinR = Math.sin(roll);

      const projected: { x: number; y: number; zDepth: number }[] = [];
      const cachedPoints: { px: number; py: number; orig: [number, number, number] }[] = [];

      const zoom = optionsRef.current.scale * 150;
      const distance = 4; // camera distance perspective matrix helper
      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < vertices.length; i++) {
        const [ax, ay, az] = vertices[i];

        // 3D Matrix Rotations
        // 1. Yaw (Y-axis rotation)
        let x1 = ax * cosY - az * sinY;
        let z1 = ax * sinY + az * cosY;

        // 2. Pitch (X-axis rotation)
        let y2 = ay * cosP - z1 * sinP;
        let z2 = ay * sinP + z1 * cosP;

        // 3. Roll (Z-axis rotation)
        let x3 = x1 * cosR - y2 * sinR;
        let y3 = x1 * sinR + y2 * cosR;

        // Perspective projection calculation
        // zDepth determines sorting and projection scaling
        const zDepth = z2 + distance;
        const scale = zoom / zDepth;
        const px = centerX + x3 * scale;
        const py = centerY - y3 * scale;

        projected.push({ x: px, y: py, zDepth });
        cachedPoints.push({ px, py, orig: [ax, ay, az] });
      }

      projectedPointsRef.current = cachedPoints;

      // Face Centroid Z-Sorting (Painter's algorithm to resolve rendering order)
      const sortedFaces = faces.map((faceIndices, faceIdx) => {
        let zSum = 0;
        faceIndices.forEach(idx => {
          if (projected[idx]) zSum += projected[idx].zDepth;
        });
        const averageZ = zSum / faceIndices.length;
        return { indices: faceIndices, index: faceIdx, depth: averageZ };
      }).sort((a, b) => b.depth - a.depth); // sort farthest away first

      // Simulated Light Source Vector in 3D Coordinate Space (Front, Top-Right)
      const lightSource = [0.5, 0.6, -0.8];
      const lightLength = Math.hypot(lightSource[0], lightSource[1], lightSource[2]);
      const L = [lightSource[0] / lightLength, lightSource[1] / lightLength, lightSource[2] / lightLength];

      // Draw sorted faces
      sortedFaces.forEach(faceData => {
        const idxs = faceData.indices;
        if (idxs.length < 3) return;

        // Calculate face normal vector in rotated 3D coordinate space before projection
        const p0 = vertices[idxs[0]];
        const p1 = vertices[idxs[1]];
        const p2 = vertices[idxs[2]];

        if (!p0 || !p1 || !p2) return;

        // Vector A = P1 - P0
        const ax = p1[0] - p0[0];
        const ay = p1[1] - p0[1];
        const az = p1[2] - p0[2];

        // Vector B = P2 - P0
        const bx = p2[0] - p0[0];
        const by = p2[1] - p0[1];
        const bz = p2[2] - p0[2];

        // Normal = A x B
        let nx = ay * bz - az * by;
        let ny = az * bx - ax * bz;
        let nz = ax * by - ay * bx;
        const nLen = Math.hypot(nx, ny, nz);

        if (nLen > 0.0001) {
          nx /= nLen;
          ny /= nLen;
          nz /= nLen;
        }

        // Apply same rotations to normal vector
        // 1. Yaw
        let r_nx1 = nx * cosY - nz * sinY;
        let r_nz1 = nx * sinY + nz * cosY;
        // 2. Pitch
        let r_ny2 = ny * cosP - r_nz1 * sinP;
        let r_nz2 = ny * sinP + r_nz1 * cosP;
        // 3. Roll
        let r_nx3 = r_nx1 * cosR - r_ny2 * sinR;
        let r_ny3 = r_nx1 * sinR + r_ny2 * cosR;

        // Dot product between light and rotated normal
        const dot = r_nx3 * L[0] + r_ny3 * L[1] + r_nz2 * L[2];
        const intensity = Math.min(Math.max((dot + 1) / 2, 0), 1); // map to 0.0 - 1.0 range

        // Draw flat polygon shaded faces
        if (optionsRef.current.showShading) {
          ctx.beginPath();
          ctx.moveTo(projected[idxs[0]].x, projected[idxs[0]].y);
          for (let k = 1; k < idxs.length; k++) {
            ctx.lineTo(projected[idxs[k]].x, projected[idxs[k]].y);
          }
          ctx.closePath();

          // High-end blended shading using main deep blue accent and soft opacity overlays
          // Flat shaded surface
          const alpha = 0.12 + 0.68 * intensity;
          ctx.fillStyle = `rgba(13, 20, 41, ${alpha})`;
          ctx.fill();

          // Technical soft white ambient light overlay on top
          ctx.fillStyle = `rgba(251, 251, 249, ${0.15 * intensity})`;
          ctx.fill();
        }

        // Draw wireframe overlay outline
        if (optionsRef.current.isWireframe) {
          ctx.beginPath();
          ctx.moveTo(projected[idxs[0]].x, projected[idxs[0]].y);
          for (let k = 1; k < idxs.length; k++) {
            ctx.lineTo(projected[idxs[k]].x, projected[idxs[k]].y);
          }
          ctx.closePath();

          // Subtle translucent outlines
          ctx.strokeStyle = optionsRef.current.showShading 
            ? 'rgba(13, 20, 41, 0.25)' 
            : 'rgba(13, 20, 41, 0.7)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      // Draw point intersection vertex nodes
      if (optionsRef.current.showVertices) {
        for (let i = 0; i < projected.length; i++) {
          const pt = projected[i];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#0d1429';
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative" id="sandbox-root-container">
      {/* 1. Left controls panel (Editorial Glassmorphic Transport Sheet) */}
      <div className="lg:col-span-4 flex flex-col justify-between glass-sheet p-6 rounded-2xl relative overflow-hidden" id="sandbox-controls-panel">
        {/* Subtle architectural vertical side gradient bar */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-accent-blue" />

        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-accent-blue tracking-widest uppercase">
              <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
              <span>LAB_INSTRUMENT_K3D</span>
            </div>
            <h3 className="text-2xl font-serif font-medium text-charcoal tracking-tight">
              Geometric Engine
            </h3>
            <p className="text-xs font-serif text-charcoal-muted leading-relaxed">
              Synthesize 3D parametric topologies dynamically. Drag the canvas directly to orbit the spatial projection manually.
            </p>
          </div>

          {/* Model Selection Tabs */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-charcoal-muted tracking-widest block uppercase">
              Select Analytical Mesh:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: MeshType.TORUS_KNOT, label: 'Torus Knot' },
                { type: MeshType.MOBIUS_STRIP, label: 'Mobius Band' },
                { type: MeshType.KINETIC_GRID, label: 'Kinetic Wave' },
                { type: MeshType.HYPERBOLIC_PARABOLOID, label: 'HP Saddle' },
                { type: MeshType.DODECAHEDRON, label: 'Dodecahedron' }
              ].map((item) => (
                <button
                  key={item.type}
                  id={`btn-mesh-select-${item.type}`}
                  onClick={() => setOptions(prev => ({ ...prev, meshType: item.type }))}
                  className={`px-3 py-2 text-left rounded-lg text-xs font-mono tracking-tight transition-all duration-300 flex items-center justify-between border ${
                    options.meshType === item.type
                      ? 'bg-accent-blue/15 text-accent-blue border-accent-blue/30 font-semibold'
                      : 'bg-bone-warm/30 text-charcoal-light border-accent-blue/5 hover:bg-bone-warm hover:text-charcoal'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${options.meshType === item.type ? 'bg-accent-blue' : 'bg-transparent'}`} />
                </button>
              ))}
            </div>
          </div>

          <hr className="border-accent-blue/10" />

          {/* Range Sliders Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-accent-blue" />
              <span className="text-[10px] font-mono text-charcoal-muted tracking-widest uppercase">
                Parametric Synthesizers
              </span>
            </div>

            {/* Scale/Zoom Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-charcoal-light">
                <span>Projection Zoom</span>
                <span>{options.scale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.2"
                step="0.1"
                value={options.scale}
                onChange={(e) => setOptions(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                className="w-full accent-accent-blue bg-accent-blue/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                id="input-projection-zoom"
              />
            </div>

            {/* Deformation Scale Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-charcoal-light">
                <span>Deform / Twist</span>
                <span>{options.deformScale.toFixed(2)}s</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={options.deformScale}
                onChange={(e) => setOptions(prev => ({ ...prev, deformScale: parseFloat(e.target.value) }))}
                className="w-full accent-accent-blue bg-accent-blue/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                id="input-deform-twist"
              />
            </div>

            {/* Subdivisions Resolution Slider */}
            {options.meshType !== MeshType.DODECAHEDRON && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-charcoal-light">
                  <span>Subdivisions (Res)</span>
                  <span>{options.resolution} pts</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="64"
                  step="2"
                  value={options.resolution}
                  onChange={(e) => setOptions(prev => ({ ...prev, resolution: parseInt(e.target.value) }))}
                  className="w-full accent-accent-blue bg-accent-blue/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                  id="input-subdivisions"
                />
              </div>
            )}

            {/* Kinetic Frequency Ripple Slider */}
            {options.meshType === MeshType.KINETIC_GRID && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-charcoal-light">
                  <span>Ripple Frequency</span>
                  <span>{options.rippleFrequency.toFixed(1)} Hz</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={options.rippleFrequency}
                  onChange={(e) => setOptions(prev => ({ ...prev, rippleFrequency: parseFloat(e.target.value) }))}
                  className="w-full accent-accent-blue bg-accent-blue/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                  id="input-ripple-frequency"
                />
              </div>
            )}

            {/* Orbit Speed Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-charcoal-light">
                <span>Orbit Speed Factor</span>
                <span>{options.rotationSpeed.toFixed(1)} rad/s</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.5"
                step="0.1"
                value={options.rotationSpeed}
                onChange={(e) => setOptions(prev => ({ ...prev, rotationSpeed: parseFloat(e.target.value) }))}
                className="w-full accent-accent-blue bg-accent-blue/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                id="input-orbit-speed"
              />
            </div>
          </div>

          <hr className="border-accent-blue/10" />

          {/* Toggle Rendering Outputs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-accent-blue" />
              <span className="text-[10px] font-mono text-charcoal-muted tracking-widest uppercase">
                Rasterizer Profiles
              </span>
            </div>
            
            <div className="space-y-2">
              {/* Shading checkbox */}
              <label className="flex items-center gap-3 text-xs font-mono text-charcoal-light cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={options.showShading}
                  onChange={(e) => setOptions(prev => ({ ...prev, showShading: e.target.checked }))}
                  className="rounded border-accent-blue/20 text-accent-blue focus:ring-accent-blue/30 h-4.5 w-4.5 accent-accent-blue"
                  id="toggle-shaded-faces"
                />
                <span>Analytical Shaded Faces</span>
              </label>

              {/* Wireframe checkbox */}
              <label className="flex items-center gap-3 text-xs font-mono text-charcoal-light cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={options.isWireframe}
                  onChange={(e) => setOptions(prev => ({ ...prev, isWireframe: e.target.checked }))}
                  className="rounded border-accent-blue/20 text-accent-blue focus:ring-accent-blue/30 h-4.5 w-4.5 accent-accent-blue"
                  id="toggle-wireframe"
                />
                <span>Geometric Vector Wireframe</span>
              </label>

              {/* Vertices checkbox */}
              <label className="flex items-center gap-3 text-xs font-mono text-charcoal-light cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={options.showVertices}
                  onChange={(e) => setOptions(prev => ({ ...prev, showVertices: e.target.checked }))}
                  className="rounded border-accent-blue/20 text-accent-blue focus:ring-accent-blue/30 h-4.5 w-4.5 accent-accent-blue"
                  id="toggle-vertex-points"
                />
                <span>Vertex Node Intersections</span>
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Formula Display */}
        <div className="mt-8 p-3 rounded-lg bg-bone-warm/40 border border-accent-blue/10 space-y-2" id="sandbox-formula-log">
          <div className="flex justify-between items-center text-[9px] font-mono text-accent-blue">
            <span className="font-semibold tracking-wider">MATHEMATICAL FORMULA:</span>
            <span>PROG_101 // LOGIC</span>
          </div>
          <div className="font-mono text-xs text-charcoal font-medium break-all select-all tracking-tight bg-bone-light/80 p-1.5 rounded border border-accent-blue/5">
            {meshFormula.latex}
          </div>
          <p className="text-[10px] font-serif text-charcoal-muted leading-snug">
            {meshFormula.desc}
          </p>
        </div>
      </div>

      {/* 2. Right Canvas Area (Elegant Glassmorphic Frame) */}
      <div className="lg:col-span-8 flex flex-col justify-between glass-sheet rounded-2xl p-6 relative overflow-hidden h-[500px] lg:h-auto min-h-[480px]" id="sandbox-canvas-frame" ref={containerRef}>
        
        {/* Top Header Panel */}
        <div className="flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            {/* Play / Pause Rotation button */}
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="p-2.5 rounded-full bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue transition-all duration-300"
              title={isRotating ? 'Pause Orbit' : 'Resume Orbit'}
              id="btn-toggle-rotation"
            >
              {isRotating ? <Pause className="w-4 h-4 fill-accent-blue/10" /> : <Play className="w-4 h-4 fill-accent-blue/10" />}
            </button>
            
            {/* Reset angles button */}
            <button
              onClick={() => setAngles({ yaw: 0.4, pitch: -0.5, roll: 0.1 })}
              className="p-2.5 rounded-full bg-accent-blue/5 hover:bg-accent-blue/15 text-charcoal-light hover:text-accent-blue transition-all duration-300"
              title="Reset Orbit Camera"
              id="btn-reset-orbit-camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Technical Diagnostics */}
          <div className="flex gap-4 text-[10px] font-mono text-charcoal-muted tracking-widest uppercase">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-accent-blue" />
              <span>FPS: <span className="font-semibold text-accent-blue">{fps}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-accent-blue" />
              <span>VERT: <span className="font-semibold text-charcoal">{stats.vertices}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-accent-blue" />
              <span>POLY: <span className="font-semibold text-charcoal">{stats.polygons}</span></span>
            </div>
          </div>
        </div>

        {/* HTML5 Canvas Projector */}
        <div className="flex-1 relative w-full my-4 cursor-grab active:cursor-grabbing overflow-hidden rounded-xl border border-accent-blue/5">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="w-full h-full block touch-none"
            id="sandbox-interactive-canvas"
          />

          {/* Holographic Vertex Label (on Hover) */}
          <AnimatePresence>
            {hoveredVertex && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute bg-charcoal-dark/95 backdrop-blur text-bone-light px-3 py-1.5 rounded-lg border border-accent-blue/40 shadow-xl text-[9px] font-mono pointer-events-none z-20 space-y-0.5"
                style={{
                  left: `${hoveredVertex.x + 12}px`,
                  top: `${hoveredVertex.y - 12}px`,
                }}
                id="vertex-hover-overlay"
              >
                <div className="text-accent-blue font-bold">NODE_INDEX: #{hoveredVertex.index}</div>
                <div className="text-bone-light/80">X: {hoveredVertex.coords3d[0].toFixed(3)}</div>
                <div className="text-bone-light/80">Y: {hoveredVertex.coords3d[1].toFixed(3)}</div>
                <div className="text-bone-light/80">Z: {hoveredVertex.coords3d[2].toFixed(3)}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fine instructions overlay */}
          <div className="absolute bottom-4 right-4 pointer-events-none text-[9px] font-mono text-charcoal-muted tracking-wide text-right hidden sm:block bg-bone-light/75 px-2.5 py-1 rounded border border-accent-blue/10">
            DRAG TO ROTATE // ROT_YAW: {angles.yaw.toFixed(2)} rad // ROT_PITCH: {angles.pitch.toFixed(2)} rad
          </div>
        </div>

        {/* Curated Lab Metadata Bottom Bar */}
        <div className="flex justify-between items-center pt-3 border-t border-accent-blue/10 text-[10px] font-mono text-charcoal-muted">
          <div className="flex items-center gap-1 text-accent-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue inline-block" />
            <span>RENDER_ENGINE_2D_PROJECTOR: ONLINE</span>
          </div>
          <span>KINETIC LOGIC LABS // PORTFOLIO_V1</span>
        </div>
      </div>
    </div>
  );
}

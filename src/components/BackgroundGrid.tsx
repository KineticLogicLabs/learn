/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';

export default function BackgroundGrid() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinate metrics between 0.000 and 1.000
      const xNorm = Math.min(Math.max(e.clientX / window.innerWidth, 0), 1);
      const yNorm = Math.min(Math.max(e.clientY / window.innerHeight, 0), 1);
      setCoords({ x: xNorm, y: yNorm });
    };

    const handleResize = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Base warm background */}
      <div className="absolute inset-0 bg-bone-light" id="bg-canvas-container" />
      
      {/* Major Technical Grid */}
      <div className="absolute inset-0 grid-lines opacity-75" />

      {/* Minor Technical Grid */}
      <div className="absolute inset-0 grid-lines-fine opacity-50" />

      {/* Decorative Technical Crosshairs and Corner Marks */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-accent-blue/20" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-accent-blue/20" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-accent-blue/20" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-accent-blue/20" />

      {/* Architectural Axis Lines */}
      <div className="absolute left-16 top-0 bottom-0 w-[1px] bg-accent-blue/[0.04]" />
      <div className="absolute right-16 top-0 bottom-0 w-[1px] bg-accent-blue/[0.04]" />
      <div className="absolute top-24 left-0 right-0 h-[1px] bg-accent-blue/[0.04]" />

      {/* Top right subtle time marker */}
      <div className="absolute top-8 right-12 text-[10px] font-mono text-charcoal-muted tracking-widest hidden md:block">
        KINETIC_LOGIC_LABS // L.T. 2026
      </div>
    </div>
  );
}

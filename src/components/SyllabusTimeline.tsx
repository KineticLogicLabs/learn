/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronRight, Hash, Compass, Bookmark } from 'lucide-react';
import { syllabusWeeks } from '../data';

export default function SyllabusTimeline() {
  const [expandedWeek, setExpandedWeek] = useState<string | null>('Weeks 01–04');

  const extraDetails: Record<string, string[]> = {
    'Weeks 01–04': [
      'Unit 1.1: Vector space axioms and standard 3D dot-product geometries.',
      'Unit 1.2: Affine transformations, rotational Euler matrices, and coordinate shearing.',
      'Unit 1.3: Real-world translation matrix modeling and homogenous scaling models.',
      'Core Lab Assignment: Implement a custom wireframe projector class in pure TypeScript.'
    ],
    'Weeks 05–08': [
      'Unit 2.1: Continuous Bezier interpolation and rational de Casteljau recursion curves.',
      'Unit 2.2: Analytical torus knot parameters and 3D tube geometry projection.',
      'Unit 2.3: Mobius topology constructs and parameter seam calculation checks.',
      'Core Lab Assignment: Generate a solid extruded Mobius loop with customizable vertex counts.'
    ],
    'Weeks 09–12': [
      'Unit 3.1: Catmull-Clark subdivision schemes for high-order polygonal lattices.',
      'Unit 3.2: Face normal cross-product math and smooth vertex normal interpolation.',
      'Unit 3.3: Lambertian diffuse dot-product lighting calculations on custom vertex grids.',
      'Core Lab Assignment: Construct a real-time flat shader engine for procedurally subdivided meshes.'
    ],
    'Weeks 13–16': [
      'Unit 4.1: Real-time kinetic vertex displacement loops (Deformers) using sine variables.',
      'Unit 4.2: Trajectory optimization algorithms for mechanical links and linkages.',
      'Unit 4.3: Compiling coordinate vertex tables to SVG formats for physical plotters.',
      'Core Lab Assignment: Build an interactive wave ripple mesh deformer in our visual sandbox.'
    ]
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative" id="curriculum-timeline-container">
      {/* Editorial introduction sidebar on the left */}
      <div className="lg:col-span-4 space-y-6" id="timeline-introduction-panel">
        <div className="space-y-3">
          <h3 className="text-3xl md:text-4xl font-serif font-light text-charcoal tracking-tight">
            Curriculum Structure
          </h3>
          <p className="font-serif text-base text-charcoal-light leading-relaxed">
            Our educational blueprint transitions from mathematical basics directly to live fabrication projects.
          </p>
        </div>
      </div>

      {/* Main interactive timeline on the right */}
      <div className="lg:col-span-8 space-y-4 relative pl-6 md:pl-10" id="timeline-interactive-tracks">
        {/* Left vertical timeline pipe */}
        <div className="absolute left-[7px] md:left-[11px] top-4 bottom-4 w-[1px] bg-accent-blue/15" />

        {syllabusWeeks.map((weekData, index) => {
          const isExpanded = expandedWeek === weekData.week;
          return (
            <div
              key={weekData.week}
              id={`syllabus-week-item-${index}`}
              className={`glass-sheet transition-all duration-300 rounded-xl relative ${
                isExpanded 
                  ? 'border-accent-blue/35 bg-bone-warm/30 shadow-md' 
                  : 'hover:border-accent-blue/25 hover:bg-bone-warm/20 cursor-pointer'
              }`}
              onClick={() => setExpandedWeek(isExpanded ? null : weekData.week)}
            >
              {/* Vertical Timeline Pin node */}
              <div className={`absolute -left-[24px] md:-left-[34px] top-6 h-3 w-3 rounded-full border-2 transition-all duration-500 z-10 ${
                isExpanded 
                  ? 'bg-accent-blue border-accent-blue shadow-sm scale-125' 
                  : 'bg-bone-light border-accent-blue/30 scale-100 group-hover:border-accent-blue/65'
              }`} />

              <div className="p-5 md:p-6 space-y-4">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-accent-blue tracking-widest font-bold">
                      <Hash className="w-3.5 h-3.5 text-accent-blue/40" />
                      <span>{weekData.week}</span>
                    </div>
                    <h4 className="text-lg md:text-xl font-serif font-medium text-charcoal">
                      {weekData.title}
                    </h4>
                  </div>
                  
                  {/* Indicator trigger badge */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono text-charcoal-muted tracking-wide hidden sm:block bg-bone-warm/50 px-2 py-0.5 rounded border border-accent-blue/5">
                      {weekData.theme}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-accent-blue"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>

                {/* Always visible brief description */}
                <p className="font-serif text-sm text-charcoal-light leading-relaxed">
                  {weekData.details}
                </p>

                {/* Expandable Technical Sub-Units */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-accent-blue/10 space-y-3 mt-4">
                        <span className="text-[9px] font-mono text-accent-blue tracking-widest font-bold block">
                          DETAILED_SUBORDINATE_UNITS:
                        </span>
                        
                        <div className="space-y-2.5 pl-2">
                          {extraDetails[weekData.week]?.map((unitText, uIdx) => (
                            <div key={uIdx} className="flex items-start gap-2.5">
                              <BookOpen className="w-3.5 h-3.5 text-accent-blue/60 mt-0.5 shrink-0" />
                              <span className="font-serif text-xs text-charcoal-light leading-relaxed">
                                {unitText}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

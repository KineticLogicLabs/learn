/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Clock, ArrowRight, Square } from 'lucide-react';
import { Program } from '../types';

interface ProgramCardProps {
  key?: string;
  program: Program;
  onSelect: (id: string) => void;
}

export default function ProgramCard({ program, onSelect }: ProgramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-sheet glass-sheet-hover flex flex-col justify-between p-6 md:p-8 rounded-2xl relative overflow-hidden group min-h-[400px]"
      id={`program-card-${program.id}`}
    >
      {/* Dynamic light gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/[0.01] via-transparent to-accent-blue/[0.04] pointer-events-none group-hover:opacity-100 transition-opacity duration-500" />

      <div className="space-y-6 relative z-10">
        {/* Title & Tagline */}
        <div className="space-y-2">
          <h4 className="text-xl md:text-2xl font-serif font-medium text-charcoal tracking-tight group-hover:text-accent-blue transition-colors duration-300">
            {program.title}
          </h4>
          <p className="font-serif italic text-xs text-charcoal-muted font-light leading-relaxed border-l-2 border-accent-blue/20 pl-3">
            "{program.tagline}"
          </p>
        </div>

        {/* Description Body */}
        <p className="font-serif text-sm text-charcoal-light leading-relaxed">
          {program.description}
        </p>

        {/* Syllabus / Technical Highlights Checklist */}
        <div className="space-y-2.5">
          <span className="text-[9px] font-mono text-accent-blue tracking-widest uppercase font-bold block">
            CORE_TOPOLOGICAL_FOCUS:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-charcoal-light">
            {program.curriculumSummary.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <Square className="w-3 h-3 text-accent-blue mt-0.5 shrink-0 fill-accent-blue/5" />
                <span className="leading-tight">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metadata Bottom Strip & Call to Action */}
      <div className="border-t border-accent-blue/10 pt-4 mt-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-1.5 text-xs font-mono text-charcoal-muted">
          <Clock className="w-3.5 h-3.5 text-accent-blue/60" />
          <span>{program.duration} Duration</span>
        </div>

        <button
          onClick={() => onSelect(program.id)}
          className="text-xs font-mono font-bold tracking-wider text-accent-blue group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1.5 cursor-pointer"
          id={`btn-explore-${program.id}`}
        >
          <span>Explore Syllabus</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

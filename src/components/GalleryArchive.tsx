/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Award, FileSpreadsheet, Box } from 'lucide-react';
import { studentProjects } from '../data';

export default function GalleryArchive() {
  const [selectedProj, setSelectedProj] = useState<string | null>(null);

  return (
    <div className="space-y-8" id="gallery-archive-root">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-accent-blue tracking-widest font-bold uppercase">
            <Award className="w-4 h-4 text-accent-blue" />
            <span>STUDENT_geometry_DOCKET_2026</span>
          </div>
          <h3 className="text-3xl font-serif font-medium text-charcoal tracking-tight">
            Student Work Archive
          </h3>
          <p className="font-serif text-sm text-charcoal-muted max-w-2xl leading-relaxed">
            A curated ledger of exemplary spatial modeling models synthesized by students during previous program cohorts. These demonstrate raw parameter modeling, topological subdivision, and physics lattice scripting.
          </p>
        </div>

        {/* Legend block */}
        <div className="hidden md:block text-[10px] font-mono text-charcoal-muted border border-accent-blue/10 bg-bone-warm/30 rounded px-3 py-2 leading-relaxed">
          <span>PROJECTS_AUDITED: <strong className="text-accent-blue">04 ACTIVE</strong></span><br />
          <span>LICENSING: CREATIVE_COMMONS_BY_NC</span>
        </div>
      </div>

      {/* Grid of Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="student-projects-grid">
        {studentProjects.map((proj) => (
          <div
            key={proj.id}
            id={`project-item-${proj.id}`}
            onClick={() => setSelectedProj(proj.id === selectedProj ? null : proj.id)}
            className="glass-sheet p-6 rounded-xl relative overflow-hidden cursor-pointer group hover:border-accent-blue/30 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Soft backdrop animation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/[0.01] via-transparent to-accent-blue/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center text-[10px] font-mono text-charcoal-muted">
                <span className="text-accent-blue font-bold">{proj.date}</span>
                <span>ID: {proj.id.toUpperCase()}</span>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg md:text-xl font-serif font-medium text-charcoal group-hover:text-accent-blue transition-colors duration-300">
                  {proj.title}
                </h4>
                <p className="font-mono text-[10px] text-charcoal-light flex items-center gap-1.5">
                  <Box className="w-3 h-3 text-accent-blue/60" />
                  <span>AUTHOR: <strong className="text-charcoal">{proj.author}</strong></span>
                </p>
              </div>

              <p className="font-serif text-sm text-charcoal-muted leading-relaxed">
                {proj.description}
              </p>

              {/* Collapsible technical recipe metadata */}
              <AnimatePresence>
                {selectedProj === proj.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-accent-blue/10 space-y-2 mt-4 text-[11px] font-mono text-charcoal-light bg-bone-warm/30 p-3 rounded border border-accent-blue/5">
                      <span className="font-semibold text-accent-blue block uppercase text-[9px] tracking-wider">TOPOLOGICAL_RECIPE_LOG:</span>
                      <div>GEN_SCHEME: Parametric Subdivision + Normals Calculation</div>
                      <div>SURFACE_INDEX: {proj.geometryType}</div>
                      <div>COMPILED_OUTPUT: SVG / STL Coordinate Matrix Table</div>
                      <div className="text-[10px] text-charcoal-muted italic mt-1 font-serif leading-snug">
                        *This model was printed on a custom 4-axis multi-plane spatial plotter at the Labs.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom info click trigger */}
            <div className="flex justify-between items-center text-[11px] font-mono text-accent-blue pt-4 border-t border-accent-blue/5 mt-5">
              <span>{proj.geometryType} MESH</span>
              <span className="text-charcoal-light text-[10px] hover:text-accent-blue group-hover:translate-x-0.5 transition-transform duration-300 flex items-center gap-1">
                {selectedProj === proj.id ? 'Close Specifications' : 'Inspect Specifications'}
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

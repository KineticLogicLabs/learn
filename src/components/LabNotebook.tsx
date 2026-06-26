/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { BookMarked, Filter, Clock, Search } from 'lucide-react';
import { labNotebookEntries } from '../data';

export default function LabNotebook() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Procedural Modeling', 'Kinetic Dynamics', 'Spatial Computation'];

  const filteredEntries = labNotebookEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          entry.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || entry.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8" id="lab-notebook-root">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-accent-blue tracking-widest font-bold uppercase">
            <BookMarked className="w-4 h-4 text-accent-blue" />
            <span>LAB_RESEARCH_LEDGER_2026</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-serif font-light text-charcoal tracking-tight">
            Research Notebook & Log
          </h3>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-accent-blue text-bone-light border-accent-blue/40 font-semibold'
                  : 'bg-bone-warm/30 text-charcoal-light border-accent-blue/5 hover:bg-bone-warm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Excerpt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="notebook-entries-grid">
        {filteredEntries.map((entry, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="glass-sheet p-6 rounded-xl flex flex-col justify-between hover:border-accent-blue/30 transition-all duration-300 relative group"
            id={`notebook-entry-${idx}`}
          >
            {/* Top info and category badge */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-charcoal-muted">
                <span className="text-accent-blue font-bold uppercase">{entry.category}</span>
                <span>{entry.date}</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-serif font-medium text-charcoal leading-snug group-hover:text-accent-blue transition-colors duration-300">
                  {entry.title}
                </h4>
                <p className="font-mono text-[9px] text-charcoal-muted tracking-wide">
                  BY: {entry.author.toUpperCase()}
                </p>
              </div>

              <p className="font-serif text-xs text-charcoal-light leading-relaxed">
                {entry.summary}
              </p>
            </div>

            {/* Read action footer */}
            <div className="border-t border-accent-blue/10 pt-3 mt-5 flex justify-between items-center text-[10px] font-mono text-charcoal-muted">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-accent-blue/40" />
                <span>3 Min Read</span>
              </span>
              <span className="text-accent-blue font-bold uppercase group-hover:underline tracking-tight cursor-pointer">
                Excerpts Logged
              </span>
            </div>
          </motion.div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm font-serif text-charcoal-muted">
            No logs matched the selected category filter.
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Program, SyllabusWeek, StudentProject } from './types';

export const programs: Program[] = [
  {
    id: 'kll-101',
    code: 'KLL-101',
    title: '3D Modeling with Fusion',
    tagline: 'Parametric CAD, mesh assembly, and geometric design.',
    description: 'Learn sketch generation, volumetric assemblies, and digital manufacturing pipelines.',
    duration: '12 Weeks',
    level: 'All Levels',
    curriculumSummary: [
      'Parametric Sketching',
      'Surface Modeling',
      'Joints & Motion'
    ],
    features: [
      'Weekly critique cycles'
    ]
  },
  {
    id: 'kll-102',
    code: 'KLL-102',
    title: 'AI Website design and creation',
    tagline: 'Leverage AI to sketch, code, style, and deploy production sites.',
    description: 'Design and deploy modern full-stack web applications using generative model prompting.',
    duration: '10 Weeks',
    level: 'All Levels',
    curriculumSummary: [
      'AI Workflows',
      'Tailwind & Transitions',
      'Full-stack Deployments'
    ],
    features: [
      'Cloud sandbox access'
    ]
  }
];

export const syllabusWeeks: SyllabusWeek[] = [
  {
    week: 'Weeks 01–04',
    title: 'Mathematical Rigor',
    theme: 'Linear Space & Homogeneous Transformation',
    details: 'Vector mechanics, 3D coordinate transformations, and projection matrices.'
  },
  {
    week: 'Weeks 05–08',
    title: 'Procedural Topology',
    theme: 'Parametric Meshes & Curve Synthesis',
    details: 'Generating analytical math shapes (Torus Knot, Mobius Strip, Klein Bottle).'
  },
  {
    week: 'Weeks 09–12',
    title: 'Computational Lighting',
    theme: 'Subdivision Surfaces & Vertex Shader Shading',
    details: 'Implementing subdivision algorithms and face normal lighting calculations.'
  },
  {
    week: 'Weeks 13–16',
    title: 'Dynamic Deformations',
    theme: 'Kinetic Waves, Modulators & 3D Fabrication',
    details: 'Real-time vertex displacement loops and laser-cutting export pipelines.'
  }
];

export const studentProjects: StudentProject[] = [
  {
    id: 'proj-1',
    title: 'Mechanical Joint Linkage Assemble',
    author: 'Isolde Vance',
    programId: 'kll-101',
    description: 'Parametric joint movement and gear mechanism design.',
    geometryType: 'TORUS_KNOT',
    date: 'Spring 2026'
  },
  {
    id: 'proj-2',
    title: 'Gyroid Infill Volume Optimizer',
    author: 'Aravind Nair',
    programId: 'kll-101',
    description: 'High-strength additive manufacturing infills with minimal weight ratios.',
    geometryType: 'KINETIC_GRID',
    date: 'Summer 2026'
  },
  {
    id: 'proj-3',
    title: 'Prompt-Driven Layout Engine',
    author: 'Elena Rostova',
    programId: 'kll-102',
    description: 'A web prototype generator rendering responsive grid panels from prompts.',
    geometryType: 'HYPERBOLIC_PARABOLOID',
    date: 'Autumn 2025'
  },
  {
    id: 'proj-4',
    title: 'Dynamic React Canvas Builder',
    author: 'Marcus Chen',
    programId: 'kll-102',
    description: 'Interactive utility mapping layout instructions to React component blocks.',
    geometryType: 'DODECAHEDRON',
    date: 'Winter 2026'
  }
];

export const labNotebookEntries = [
  {
    date: 'June 20, 2026',
    category: 'Procedural Modeling',
    title: 'On Parametric Subdivision of Mobius Bands',
    author: 'Dr. Evelyn Carter',
    summary: 'Documenting boundary normal continuity when applying subdivision schemes to one-sided manifolds.'
  },
  {
    date: 'May 12, 2026',
    category: 'Kinetic Dynamics',
    title: 'Energy Conservation in High-Frequency Verlet Lattices',
    author: 'Prof. Julian Vance',
    summary: 'Evaluating drift errors in Euler integration vs Verlet integration for spring dampers.'
  },
  {
    date: 'April 05, 2026',
    category: 'Spatial Computation',
    title: 'Orthographic Projection Math for Compact Display Terminals',
    author: 'Staff Research',
    summary: 'Optimizing 3D projection formulas to work inside single-thread canvas frameworks.'
  }
];

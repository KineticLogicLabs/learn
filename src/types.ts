/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Program {
  id: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  duration: string;
  level: string;
  curriculumSummary: string[];
  features: string[];
}

export interface SyllabusWeek {
  week: string;
  title: string;
  theme: string;
  details: string;
}

export interface StudentProject {
  id: string;
  title: string;
  author: string;
  programId: string;
  description: string;
  geometryType: string;
  date: string;
}

export enum MeshType {
  TORUS_KNOT = 'TORUS_KNOT',
  MOBIUS_STRIP = 'MOBIUS_STRIP',
  KINETIC_GRID = 'KINETIC_GRID',
  HYPERBOLIC_PARABOLOID = 'HYPERBOLIC_PARABOLOID',
  DODECAHEDRON = 'DODECAHEDRON',
}

export interface SandboxOptions {
  meshType: MeshType;
  resolution: number; // grid or point subdivision
  scale: number;
  rotationSpeed: number; // automatic rotation speed
  rippleFrequency: number; // wave ripple speed/freq
  deformScale: number; // sine wave height or knot twist
  isWireframe: boolean;
  showVertices: boolean;
  showShading: boolean;
}

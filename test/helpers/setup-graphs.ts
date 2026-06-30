/**
 * Global test setup for graph tests.
 * Wires d3 to window before modules are evaluated.
 * The static import is safe (d3 works in Node); only the window
 * assignment is guarded so node-environment tests don't break.
 */
import * as d3 from 'd3';

if (typeof window !== 'undefined') {
  (window as any).d3 = d3;
}
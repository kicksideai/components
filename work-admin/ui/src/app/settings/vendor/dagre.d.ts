// SPDX-License-Identifier: MIT
// Types for the subset of @dagrejs/dagre used by the process map.
interface Point { x: number; y: number }
interface Label { width: number; height: number; x: number; y: number; points: Point[] }
interface Edge { v: string; w: string; name?: string }
declare class Graph {
  constructor(options: { multigraph: boolean })
  setGraph(options: Record<string, string | number>): void
  setDefaultEdgeLabel(factory: () => object): void
  setNode(id: string, label: { width: number; height: number }): void
  setEdge(from: string, to: string, label: object, name: string): void
  node(id: string): Label
  edge(edge: Edge): Label
  graph(): { width: number; height: number }
}
declare const dagre: { graphlib: { Graph: typeof Graph }; layout(graph: Graph): void }
export default dagre

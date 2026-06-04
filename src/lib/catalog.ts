// Catalog service — phase boundary for /api/catalog/packs.
// Phase 6: returns sample data after a simulated fetch delay.
// Phase 6+: replace fetchPacks() body with a real fetch call.

export type PackKind = 'text' | 'shape' | 'overlay'

export interface CatalogPack {
  id: string
  label: string
  kind: PackKind
  description?: string
}

// SAMPLE packs — clearly labeled; replaced by /api/catalog/packs in Phase 6
const SAMPLE_PACKS: CatalogPack[] = [
  { id: 'p1', label: 'Clean titles',    kind: 'text',    description: 'Minimal headline + subline' },
  { id: 'p2', label: 'Subscribe hook',  kind: 'shape',   description: 'Animated subscribe prompt' },
  { id: 'p3', label: 'Lower third',     kind: 'shape',   description: 'Name + role bar' },
  { id: 'p4', label: 'Minimal overlay', kind: 'overlay', description: 'Semi-transparent info band' },
  { id: 'p5', label: 'Caption band',    kind: 'text',    description: 'Subtitle strip with background' },
  { id: 'p6', label: 'Chapter marker',  kind: 'text',    description: 'Section heading card' },
]

export async function fetchPacks(): Promise<CatalogPack[]> {
  // TODO: Phase 6 real — return fetch('/api/catalog/packs').then(r => r.json())
  await new Promise((r) => setTimeout(r, 800))
  return SAMPLE_PACKS
}

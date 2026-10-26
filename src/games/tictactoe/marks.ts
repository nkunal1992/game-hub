/** Custom board pieces ("marks"): stroke-drawn SVG shapes + emoji fun marks. */

export type MarkKind = 'shape' | 'emoji'

export interface MarkDef {
  id: string
  label: string
  kind: MarkKind
  /** Stroke-drawn path data (viewBox 0 0 100 100) for shape marks. */
  paths?: string[]
  /** Glyph for emoji marks (rendered as SVG <text> so it scales with the cell). */
  emoji?: string
}

export const SHAPE_MARKS: MarkDef[] = [
  {
    id: 'cross',
    label: 'Cross',
    kind: 'shape',
    paths: ['M28 28 L72 72', 'M72 28 L28 72'],
  },
  {
    id: 'circle',
    label: 'Circle',
    kind: 'shape',
    paths: ['M50 27 A23 23 0 0 1 50 73 A23 23 0 0 1 50 27 Z'],
  },
  {
    id: 'triangle',
    label: 'Triangle',
    kind: 'shape',
    paths: ['M50 26 L76 72 L24 72 Z'],
  },
  {
    id: 'square',
    label: 'Square',
    kind: 'shape',
    paths: ['M28 28 L72 28 L72 72 L28 72 Z'],
  },
  {
    id: 'diamond',
    label: 'Diamond',
    kind: 'shape',
    paths: ['M50 24 L76 50 L50 76 L24 50 Z'],
  },
  {
    id: 'pentagon',
    label: 'Pentagon',
    kind: 'shape',
    paths: ['M50 23 L75.7 41.7 L65.9 71.8 L34.1 71.8 L24.3 41.7 Z'],
  },
  {
    id: 'hexagon',
    label: 'Hexagon',
    kind: 'shape',
    paths: ['M50 24 L72.5 37 L72.5 63 L50 76 L27.5 63 L27.5 37 Z'],
  },
  {
    id: 'star',
    label: 'Star',
    kind: 'shape',
    paths: [
      'M50 22 L58.8 40.2 L78.5 41.6 L64.2 55.4 L67.6 74.9 L50 65 L32.4 74.9 L35.8 55.4 L21.5 41.6 L41.2 40.2 Z',
    ],
  },
  {
    id: 'heart',
    label: 'Heart',
    kind: 'shape',
    paths: ['M50 76 C30 62 20 48 25 36 C29 26 44 26 50 38 C56 26 71 26 75 36 C80 48 70 62 50 76 Z'],
  },
  {
    id: 'plus',
    label: 'Plus',
    kind: 'shape',
    paths: ['M50 28 L50 72', 'M28 50 L72 50'],
  },
  {
    id: 'bolt',
    label: 'Bolt',
    kind: 'shape',
    paths: ['M56 20 L30 54 L46 54 L42 80 L72 42 L54 42 Z'],
  },
]

export const FUN_MARKS: MarkDef[] = [
  { id: 'frog', label: 'Frog', kind: 'emoji', emoji: '🐸' },
  { id: 'unicorn', label: 'Unicorn', kind: 'emoji', emoji: '🦄' },
  { id: 'dino', label: 'Dino', kind: 'emoji', emoji: '🦖' },
  { id: 'bee', label: 'Bee', kind: 'emoji', emoji: '🐝' },
  { id: 'octopus', label: 'Octopus', kind: 'emoji', emoji: '🐙' },
  { id: 'turtle', label: 'Turtle', kind: 'emoji', emoji: '🐢' },
  { id: 'fox', label: 'Fox', kind: 'emoji', emoji: '🦊' },
  { id: 'panda', label: 'Panda', kind: 'emoji', emoji: '🐼' },
  { id: 'cat', label: 'Cat', kind: 'emoji', emoji: '🐱' },
  { id: 'dog', label: 'Dog', kind: 'emoji', emoji: '🐶' },
  { id: 'lion', label: 'Lion', kind: 'emoji', emoji: '🦁' },
  { id: 'chick', label: 'Chick', kind: 'emoji', emoji: '🐥' },
  { id: 'fish', label: 'Fish', kind: 'emoji', emoji: '🐠' },
  { id: 'ghost', label: 'Ghost', kind: 'emoji', emoji: '👻' },
  { id: 'rocket', label: 'Rocket', kind: 'emoji', emoji: '🚀' },
  { id: 'pizza', label: 'Pizza', kind: 'emoji', emoji: '🍕' },
  { id: 'robot', label: 'Robot', kind: 'emoji', emoji: '🤖' },
]

export const MARKS: MarkDef[] = [...SHAPE_MARKS, ...FUN_MARKS]

const BY_ID = new Map(MARKS.map((m) => [m.id, m]))

export const DEFAULT_MARK_X = 'cross'
export const DEFAULT_MARK_O = 'circle'
export const COMPUTER_MARK = 'robot'

/** Look up a mark definition, falling back to the classic cross. */
export function markDef(id: string): MarkDef {
  return BY_ID.get(id) ?? BY_ID.get(DEFAULT_MARK_X)!
}

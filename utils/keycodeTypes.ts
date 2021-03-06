export const BaseKeycodeKind = [
  'BASIC',
  'MOD',
  'KEYPAD',
  'QMK',
  'SYSTEM',
  'PC',
  'MEDIA',
  'MOUSE',
  'LED',
] as const

export type BaseKeycodeKindType = typeof BaseKeycodeKind[number]

export type ModKey =
  | 'LSFT'
  | 'RSFT'
  | 'LCTL'
  | 'RCTL'
  | 'LALT'
  | 'RALT'
  | 'RGUI'
  | 'LGUI'
export interface BaseKeycode {
  qmk: string
  raw: number
  legend: string
  altLegend?: string
  kind: BaseKeycodeKindType
}

export const KeycodeKind = [
  'UNKNOWN',
  'BASIC',
  'SPECIAL',
  'FUNCTION',
  'ACTION',
  'MACRO',
  'LAYER_TAP',
  'LAYER_ON',
  'LAYER_MOMENTARY',
  'LAYER_DEFAULT',
  'LAYER_TOGGLE',
  'LAYER_ONESHOT',
  'MOD_ONESHOT',
  'TAPDANCE',
  'LAYER_TAPTOGGLE',
  'LAYER_MOD',
  'MOD_TAP',
]

export type KeycodeKindType = typeof KeycodeKind[number]

export interface UnknownKeycode {
  kind: 'UNKNOWN'
  raw: number
}

export interface BasicKeycode {
  kind: 'BASIC'
  qmk: string
  raw: number
  base: BaseKeycode
  mods: ModKey[]
}

export interface SpecialKeycode {
  kind: 'SPECIAL'
  qmk: string
  raw: number
  base: BaseKeycode
}

export interface FunctionKeycode {
  kind: 'FUNCTION'
  qmk: string
  raw: number
  action: number
}

export interface MacroKeycode {
  kind: 'MACRO'
  qmk: string
  raw: number
  macro: number
}

export interface LayerTapKeycode {
  kind: 'LAYER_TAP'
  qmk: string
  raw: number
  layer: number
  base: BaseKeycode
}

export interface LayerOnKeycode {
  kind: 'LAYER_ON'
  qmk: string
  raw: number
  layer: number
}

export interface LayerMomentaryKeycode {
  kind: 'LAYER_MOMENTARY'
  qmk: string
  raw: number
  layer: number
}

export interface LayerDefaultKeycode {
  kind: 'LAYER_DEFAULT'
  qmk: string
  raw: number
  layer: number
}

export interface LayerToggleKeycode {
  kind: 'LAYER_TOGGLE'
  qmk: string
  raw: number
  layer: number
}

export interface LayerOneshotKeycode {
  kind: 'LAYER_ONESHOT'
  qmk: string
  raw: number
  layer: number
}

export interface OneshotModKeycode {
  kind: 'MOD_ONESHOT'
  qmk: string
  raw: number
  mods: ModKey[]
}

export interface TapdanceKeycode {
  kind: 'TAPDANCE'
  qmk: string
  raw: number
  tapdance: number
}

export interface LayerTapToggleKeycode {
  kind: 'LAYER_TAPTOGGLE'
  qmk: string
  raw: number
  layer: number
}

export interface LayerModKeycode {
  kind: 'LAYER_MOD'
  qmk: string
  raw: number
  layer: number
  mods: ModKey[]
}

export interface ModTapKeycode {
  kind: 'MOD_TAP'
  qmk: string
  raw: number
  base: BaseKeycode
  mods: ModKey[]
}

export type KeycodeTypes =
  | UnknownKeycode
  | BasicKeycode
  | SpecialKeycode
  | FunctionKeycode
  | MacroKeycode
  | LayerTapKeycode
  | LayerOnKeycode
  | LayerMomentaryKeycode
  | LayerDefaultKeycode
  | LayerToggleKeycode
  | LayerOneshotKeycode
  | OneshotModKeycode
  | TapdanceKeycode
  | LayerTapToggleKeycode
  | LayerModKeycode
  | ModTapKeycode

export type SimpleLayerKeycodeTypes =
  | LayerOnKeycode
  | LayerMomentaryKeycode
  | LayerDefaultKeycode
  | LayerToggleKeycode
  | LayerOneshotKeycode
  | LayerTapToggleKeycode

export type AllLayerKeycodeTypes =
  | LayerTapKeycode
  | LayerOnKeycode
  | LayerMomentaryKeycode
  | LayerDefaultKeycode
  | LayerToggleKeycode
  | LayerOneshotKeycode
  | LayerTapToggleKeycode
  | LayerModKeycode

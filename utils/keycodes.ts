import {
  KeycodeTypes,
  ModKey,
  UnknownKeycode,
  SpecialKeycode,
  BaseKeycode,
  BaseKeycodeKindType,
  KeycodeKindType,
} from '@/utils/keycodeTypes'

export const BaseKeycodes: BaseKeycode[] = require('@/assets/data/BaseKeycodes.json')

function findBase(raw: number): BaseKeycode | undefined {
  return BaseKeycodes.find((keycode) => keycode.raw === raw)
}

function findSpecialKeycode(raw: number): SpecialKeycode | UnknownKeycode {
  const base = findBase(raw)
  return base
    ? {
        kind: 'SPECIAL',
        qmk: base.qmk,
        raw,
        base,
      }
    : {
        kind: 'UNKNOWN',
        raw,
      }
}

function parseModsToArray(mods: number): Array<ModKey> {
  const parsed = []
  const which = mods & 0x10 ? 'R' : 'L'
  if (mods & 0x01) parsed.push(which + 'CTL')
  if (mods & 0x02) parsed.push(which + 'SFT')
  if (mods & 0x04) parsed.push(which + 'ALT')
  if (mods & 0x08) parsed.push(which + 'GUI')

  return parsed as Array<ModKey>
}

function parseModsArrayToValue(mods: ModKey[]): number {
  return mods.reduce((ret, mod) => {
    ret |= mod.charAt(0) === 'R' ? 0x10 : 0
    switch (mod.charAt(1)) {
      case 'C':
        return ret | 0x01
      case 'S':
        return ret | 0x02
      case 'A':
        return ret | 0x04
      case 'G':
        return ret | 0x08
    }
    return ret
  }, 0)
}

function joinModsArrayToString(array: Array<ModKey>): string {
  return array.map<string>((v) => `MOD_${v}`).join('|')
}

export function buildKeycodeFromRaw(raw: number): KeycodeTypes {
  if (raw <= 0x1fff) {
    // basic + mod
    const mods = parseModsToArray(raw >> 8)
    const base = findBase(raw & 0x00ff)
    if (!base) return { kind: 'UNKNOWN', raw }
    if (
      base.kind === 'BASIC' ||
      base.kind === 'KEYPAD' ||
      base.kind === 'MOD'
    ) {
      return {
        kind: 'BASIC',
        qmk: mods.reduce((ret, v) => `${v}(${ret})`, base.qmk),
        raw,
        base,
        mods,
      }
    }
    return {
      kind: 'SPECIAL',
      qmk: base.qmk,
      raw,
      base,
    }
  } else if (raw <= 0x2fff) {
    // func
    return {
      kind: 'FUNCTION',
      qmk: `F(${raw & 0x0fff})`,
      raw,
      action: raw & 0xfff,
    }
  } else if (raw <= 0x3fff) {
    // macro
    return {
      kind: 'MACRO',
      qmk: `M(${raw & 0x0fff})`,
      raw,
      macro: raw & 0x0fff,
    }
  } else if (raw <= 0x4fff) {
    // tap keycode, hold layer
    const base = findBase(raw & 0xff)
    const layer = (raw & 0x0f00) >> 8
    return base
      ? {
          kind: `LAYER_TAP`,
          qmk: `LT(${layer},${base.qmk})`,
          raw,
          base,
          layer,
        }
      : {
          kind: 'UNKNOWN',
          raw,
        }
  } else if (raw <= 0x50ff) {
    // turn on layer
    // max 16
    const layer = raw & 0x00f
    return {
      kind: 'LAYER_ON',
      qmk: `TO(${layer})`,
      raw,
      layer,
    }
  } else if (raw <= 0x51ff) {
    // momentary layer
    const layer = raw & 0x00ff
    return {
      kind: 'LAYER_MOMENTARY',
      qmk: `MO(${layer})`,
      raw,
      layer,
    }
  } else if (raw <= 0x52ff) {
    // set default layer
    const layer = raw & 0x00ff
    return {
      kind: 'LAYER_DEFAULT',
      qmk: `DF(${layer})`,
      raw,
      layer,
    }
  } else if (raw <= 0x53ff) {
    // toggle layer
    const layer = raw & 0x00ff
    return {
      kind: 'LAYER_TOGGLE',
      qmk: `TG(${layer})`,
      raw,
      layer,
    }
  } else if (raw <= 0x54ff) {
    // one shot layer
    const layer = raw & 0x00ff
    return {
      kind: 'LAYER_ONESHOT',
      qmk: `OSL(${layer})`,
      raw,
      layer,
    }
  } else if (raw <= 0x55ff) {
    // one shot mod
    const mods = parseModsToArray(raw & 0xff)
    return {
      kind: 'MOD_ONESHOT',
      qmk: `OSM(${joinModsArrayToString(mods)})`,
      raw,
      mods,
    }
  } else if (raw <= 0x56ff) {
    return findSpecialKeycode(raw)
  } else if (raw <= 0x57ff) {
    const tapdance = raw & 0xff
    return {
      kind: 'TAPDANCE',
      qmk: `TD(${tapdance})`,
      raw,
      tapdance,
    }
  } else if (raw <= 0x58ff) {
    // tap toggle layer
    const layer = raw & 0x00ff
    return {
      kind: 'LAYER_TAPTOGGLE',
      qmk: `TT(${layer})`,
      raw,
      layer,
    }
  } else if (raw <= 0x59ff) {
    // momentaly switch layer with modifier (left mod only)
    const mods = parseModsToArray(raw & 0x0f)
    const layer = (raw & 0xf0) >> 4
    return {
      kind: 'LAYER_MOD',
      qmk: `LM(${layer}, ${joinModsArrayToString(mods)})`,
      raw,
      layer,
      mods,
    }
  } else if (raw <= 0x5bff) {
    return findSpecialKeycode(raw)
  } else if (raw >= 0x6000 && raw <= 0x7fff) {
    // mod tap
    const mods = parseModsToArray((raw & 0x1f00) >> 8)
    const base = findBase(raw & 0xff)
    return base
      ? {
          kind: 'MOD_TAP',
          qmk: `MT(${joinModsArrayToString(mods)}, ${base.qmk})`,
          raw,
          base,
          mods,
        }
      : {
          kind: 'UNKNOWN',
          raw,
        }
  }
  return findSpecialKeycode(raw)
}

export const RawBase: { [key in KeycodeKindType]: number } = {
  BASIC: 0,
  SPECIAL: 0,
  FUNCTION: 0x2000,
  MACRO: 0x3000,
  LAYER_TAP: 0x4000,
  LAYER_ON: 0x5010,
  LAYER_MOMENTARY: 0x5100,
  LAYER_DEFAULT: 0x5200,
  LAYER_TOGGLE: 0x5300,
  LAYER_ONESHOT: 0x5400,
  MOD_ONESHOT: 0x5500,
  TAPDANCE: 0x5700,
  LAYER_TAPTOGGLE: 0x5800,
  LAYER_MOD: 0x5900,
  MOD_TAP: 0x6000,
  UNKNOWN: 0,
} as const

export function buildRawFromKeycode(keycode: KeycodeTypes) {
  switch (keycode.kind) {
    case 'BASIC':
      return keycode.base.raw | (parseModsArrayToValue(keycode.mods) << 8)
    case 'SPECIAL':
      return keycode.base.raw
    case 'FUNCTION':
      return RawBase.FUNCTION | keycode.action
    case 'MACRO':
      return RawBase.MACRO | keycode.macro
    case 'LAYER_TAP':
      return RawBase.LAYER_TAP | (keycode.layer << 8) | keycode.base.raw
    case 'LAYER_ON':
      return RawBase.LAYER_ON | keycode.layer
    case 'LAYER_MOMENTARY':
      return RawBase.LAYER_MOMENTARY | keycode.layer
    case 'LAYER_DEFAULT':
      return RawBase.LAYER_DEFAULT | keycode.layer
    case 'LAYER_TOGGLE':
      return RawBase.LAYER_TOGGLE | keycode.layer
    case 'LAYER_ONESHOT':
      return RawBase.LAYER_ONESHOT | keycode.layer
    case 'MOD_ONESHOT':
      return RawBase.MOD_ONESHOT | parseModsArrayToValue(keycode.mods)
    case 'TAPDANCE':
      return RawBase.TAPDANCE | keycode.tapdance
    case 'LAYER_TAPTOGGLE':
      return RawBase.LAYER_TAPTOGGLE | keycode.layer
    case 'LAYER_MOD':
      return (
        RawBase.LAYER_MOD |
        (keycode.layer << 4) |
        (parseModsArrayToValue(keycode.mods) & 0x0f)
      )
    case 'MOD_TAP':
      return (
        RawBase.MOD_TAP |
        (parseModsArrayToValue(keycode.mods) << 8) |
        keycode.base.raw
      )
    case 'UNKNOWN':
      return keycode.raw
    default:
      return 0
  }
}

export function getKeycodeList(kind?: BaseKeycodeKindType): BaseKeycode[] {
  if (!kind) return BaseKeycodes as BaseKeycode[]
  return BaseKeycodes.filter((keycode) => keycode.kind === kind)
}

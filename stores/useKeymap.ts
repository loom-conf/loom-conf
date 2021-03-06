import {
  inject,
  InjectionKey,
  provide,
  reactive,
  ref,
} from '@nuxtjs/composition-api'
import { KeyLayout, buildLayoutFromKLE } from '@/models/keyboardLayout'
import { buildKeymapFromRaw, Keymap } from '@/models/keymap'
import { KeycodeTypes } from '@/utils/keycodeTypes'
import { DeviceSetting } from '@/models/deviceSetting'
import { LayoutOption } from '@/models/layoutOption'
import { KeyboardConfig } from '@/models/keyboardConfig'

export const createKeymap = () => {
  const keyCount = ref<number>(0)
  const keymap = ref<Keymap>([])
  const layout = ref<KeyLayout[]>([])
  const layoutOption = reactive<LayoutOption>(new LayoutOption())
  const currentLayer = ref<number>(0)

  function setKeyboardConfig(keyboardConfig: KeyboardConfig | undefined) {
    if (keyboardConfig?.matrix)
      keyCount.value = keyboardConfig.matrix.cols * keyboardConfig.matrix.rows
    if (!keyboardConfig?.layouts.keymap) layout.value = []
    else {
      layout.value = buildLayoutFromKLE(keyboardConfig.layouts.keymap)
    }
    layoutOption.setLabels(keyboardConfig?.layouts.labels)
    applyLayoutOption()
  }

  function setDeviceSetting(setting: DeviceSetting | undefined) {
    keymap.value = setting?.keymap ? buildKeymapFromRaw(setting.keymap) : []
    layoutOption.setRawSetting(setting?.layoutOption ?? 0)
  }

  function applyLayoutOption() {
    layout.value = layout.value.map((item) => {
      if (!item.layoutOption || !layoutOption.items) {
        item.disabled = false
      } else if (
        layoutOption.items[item.layoutOption.layout].value !==
        item.layoutOption.value
      ) {
        item.disabled = true
      } else {
        item.disabled = false
      }
      return item
    })
  }

  function changeLayoutOption(index: number, value: number) {
    if (layoutOption.items) {
      layoutOption.items[index].value = value
      applyLayoutOption()
    }
  }

  function setKeycode(keycode: KeycodeTypes, index: number) {
    keymap.value[index] = keycode
    applyLayoutOption()
  }

  function setCurrentLayer(layer: number) {
    currentLayer.value = layer
  }

  function getKeymapAsRawArray(): number[] {
    return keymap.value.map((keycode) => keycode.raw)
  }

  return {
    keymap,
    keyCount,
    layout,
    layoutOption,
    currentLayer,
    setKeycode,
    setKeyboardConfig,
    setDeviceSetting,
    changeLayoutOption,
    setCurrentLayer,
    getKeymapAsRawArray,
  }
}

/* provide/inject */
export const key: InjectionKey<ReturnType<typeof createKeymap>> = Symbol(
  'Keymap'
)

export const provideKeymap = () => {
  provide(key, createKeymap())
}

export const useKeymap = () => {
  const ret = inject(key)
  if (ret === undefined) throw new Error('useKeymap is not provided')
  else return ret
}

<template>
  <div>
    <VueSelect
      v-model="mods"
      taggable
      multiple
      :append-to-body="true"
      :options="['SFT', 'CTL', 'ALT', 'GUI']"
    />
    <div v-if="option" class="modsOption">
      <span
        ><input
          v-model="modsOption"
          type="radio"
          name="modOption"
          value="L"
        />L</span
      >
      <span
        ><input
          v-model="modsOption"
          type="radio"
          name="modOption"
          value="R"
        />R</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from '@nuxtjs/composition-api'
import VueSelect from 'vue-select'

export default defineComponent({
  components: { VueSelect },
  props: {
    modsKey: {
      type: Array as PropType<string[]>,
      default: [],
    },
    option: {
      type: Boolean,
      defalut: true,
    },
  },
  setup(_props, _context) {
    const mods = ref<string[]>(
      _props.modsKey[0] ? _props.modsKey.map((v) => v.slice(1)) : []
    )
    const modsOption = ref<'L' | 'R'>(
      !_props.modsKey[0]?.startsWith('R') ? 'L' : 'R'
    )
    watch([modsOption, mods], () => {
      _context.emit(
        'changeMods',
        mods.value.map((v: string) => `${modsOption.value}${v}`)
      )
    })
    return { mods, modsOption }
  },
})
</script>

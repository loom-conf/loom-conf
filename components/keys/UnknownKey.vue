<template>
  <div class="keyTop unknownKeyTop">
    <div class="labelRow">
      <div class="label">?</div>
    </div>
    <div class="legend">
      <div>
        <div>{{ keycode.raw }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { UnknownKeycode } from '@/utils/keycodeTypes'

export default defineComponent({
  props: {
    keycode: {
      type: Object as PropType<UnknownKeycode>,
      required: true,
    },
  },
  setup(_props, _context) {
    return {}
  },
})
</script>

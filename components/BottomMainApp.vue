<template>
  <div class="appSetting">
    <div class="item">
      <div class="header">Viewer</div>
      <div class="containt"></div>
    </div>
  </div>
</template>

<style lang="scss">
.appSetting {
  height: 0;
  .label {
    min-width: 350px;
  }
}
</style>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useAppSetting } from '@/stores/useAppSetting'

export default defineComponent({
  components: {},
  setup(_props, _context) {
    const { viewerOption } = useAppSetting()
    return { viewerOption }
  },
})
</script>

<template>
  <input
    :value="value"
    :class="inputClass"
    :placeholder="label"
    type="text"
    @input="updateInput"
  />
</template>

<style lang="scss" scoped>
input {
  outline: 0;
  background: white;
  border: 1px solid gray;
  padding: 0.2em;
  color: darken(gray, 20%);
  font-size: small;
  border-radius: 1px;
  height: 32px;

  &:focus {
    border-color: cornflowerblue;
    transition: all 0.2s ease-in;
  }

  &.disabled {
    background: $disableColor;
    color: lighten($disableColor, 20%);
    cursor: not-allowed;
  }
}
</style>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
  },
  setup(_props, _context) {
    const inputClass = computed(() => (_props.disabled ? 'disabled' : ''))
    const updateInput = (event: Event) => {
      if (event.target instanceof HTMLInputElement)
        _context.emit('input', event.target.value)
    }
    return { inputClass, updateInput }
  },
})
</script>
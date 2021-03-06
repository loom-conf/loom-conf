<template>
  <div class="main">
    <div class="container">
      <div class="title">
        <div class="item">
          <div class="imgContainer" @click="clickLogo">
            <img src="@/assets/img/loom.png" width="72px" height="72px" />
            <div :class="logoBgClass"></div>
          </div>
        </div>
        <div class="loom">LOOM</div>
      </div>
    </div>
    <KeyboardEditor
      class="keyboardEditor"
      :default-json-url="jsonURL"
      :default-keyboard-name="keyboardName"
    />
    <div class="footer copyright">© 2021 hsgw, All right reserved.</div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  background-color: $bgColor;
  width: 100vw;
  height: 100vh;
  .container {
    position: absolute;
    width: calc(#{$bottomTabWidth} - 48px);
    background: $mainBgColor;
    border: 10px solid black;
    border-top: none;
    border-radius: 0 0 12px 12px;
    margin: 0 24px;
    .title {
      text-align: center;
      img {
        position: relative;
        z-index: 50;
      }
      .logoBg {
        position: absolute;
        z-index: 45;
        width: 40px;
        height: 30px;
        top: 18px;
        left: 28px;
        background-color: white;
        transition: all 1s ease;
        &.animate {
          background: linear-gradient(
            45deg,
            #ff2400,
            #e81d1d,
            #e8b71d,
            #e3e81d,
            #1de840,
            #1ddde8,
            #2b1de8,
            #dd00f3,
            #dd00f3
          );
          background-size: 1800% 1800%;
          animation: rainbow 3s linear infinite;
        }
      }
      .loom {
        margin-top: 8px;
        margin-bottom: 16px;
        font-size: 18px;
        font-weight: 900;
        transform: rotateZ(345deg);
        transition: 1s ease-out;
        &:hover {
          cursor: none;
          transition: 100000s;
          transform: rotateZ(999999999deg);
        }
      }
    }
  }
  .footer {
    z-index: 100;
    position: absolute;
    padding: 0.2rem;
    font-size: smaller;
    &.copyright {
      text-align: right;
      background: $mainBgColor;
      bottom: 16px;
      right: 32px;
    }
  }
  .keyboardEditor {
    overflow: hidden;
    width: 100%;
    height: 100vh;
  }

  @keyframes rainbow {
    0% {
      background-position: 0% 82%;
    }
    50% {
      background-position: 100% 19%;
    }
    100% {
      background-position: 0% 82%;
    }
  }
}
</style>

<script lang="ts">
import {
  defineComponent,
  useContext,
  computed,
  ref,
  wrapProperty,
} from '@nuxtjs/composition-api'
import { mdiGithub } from '@mdi/js'
import KeyboardEditor from '@/components/KeyboardEditor.vue'

const useGtag = wrapProperty('$gtag', false)

export default defineComponent({
  components: { KeyboardEditor },
  setup(_props, _context) {
    const logoFlag = ref(false)
    const { route } = useContext()
    const gtagEvent = useGtag().event
    const keyboardName = computed(() => route.value.params.keyboard ?? '')
    const jsonURL = computed(() => route.value.query.config ?? '')

    const clickLogo = () => {
      logoFlag.value = !logoFlag.value
      gtagEvent('click_logo', { event_category: 'miscs' })
    }

    const logoBgClass = computed(() => [
      'logoBg',
      logoFlag.value ? 'animate' : '',
    ])

    return { mdiGithub, keyboardName, jsonURL, clickLogo, logoBgClass }
  },
})
</script>

<template>
  <div
    class="img-btn py-2 px-5 can-click text-center"
    :class="[dark ? 'white--text' : 'secondary--text', {'mx-auto': isCenter}, type]"
    @click.stop="clickBtn()"
  >
    {{ $t(buttonText) }}
  </div>
</template>

<script>
export default {
  props: {
    buttonText: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'bg-black'
    },
    dark: {
      type: Boolean,
      default: false
    },
    isCenter: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    clickBtn() {
      this.$emit("clickBtn")
    }
  }
}
</script>

<style lang="scss">
.img-btn {
  max-width: 230px;
  &.bg-black {
    background: url(../assets/img/btn-bg-black.svg) center / contain no-repeat;
  }
  &.bg-black-sloped {
    background: url(../assets/img/btn-bg-black-sloped.svg) center / contain no-repeat;
  }
  &.bg-white {
    background: url(../assets/img/btn-bg-white.svg) center / contain no-repeat;
  }
  &.bg-white-sloped {
    background: url(../assets/img/btn-bg-white-sloped.svg) center / contain no-repeat;
  }
  &.border-black {
    background: url(../assets/img/btn-border-black.svg) center / contain no-repeat;
  }
  &.border-black-sloped {
    background: url(../assets/img/btn-border-black-sloped.svg) center / contain no-repeat;
  }
}
</style>

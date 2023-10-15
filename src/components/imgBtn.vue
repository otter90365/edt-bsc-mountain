<template>
  <div
    class="img-btn py-2 px-5 can-click"
    :class="dark ? 'white--text' : 'secondary--text'"
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
    dark: {
      type: Boolean,
      default: false
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
  background: url(../assets/img/btn-bg-black.svg) center / contain no-repeat;
}
</style>

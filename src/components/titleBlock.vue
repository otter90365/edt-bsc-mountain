<template>
  <div class="title-block d-flex flex-column align-center text-center font-weight-bold">
    <h1 class="title-text d-flex align-center" :class="[titleFontSize, {'flex-column flex-md-row': icon}]">
      <img
        v-if="icon"
        id="title-icon"
        class="mr-2"
        :src="require(`@/assets/img/${icon}`)"
        :alt="`icon-${title}`"
        :width="$store.state.nowWidth > 960 ? '' : '30px'"
        :height="$store.state.nowWidth > 960 ? '' : '30px'"
      >
      {{ $t(title) }}
    </h1>
    <div class="subtitle-text mt-n1">{{ $t(subtitle) }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    titleFontSize: {
      type: String,
      default: 'rem-12'
    },
    subtitle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.title-block {
  .title-text {
    padding: 0 60px;
    background: url(../assets/img/deco-title.svg) center bottom / contain no-repeat;
  }
  .subtitle-text {
    color: #6D6F79;
  }
  img[id="title-icon"] {
    max-height: 25px !important;
  }
}
</style>

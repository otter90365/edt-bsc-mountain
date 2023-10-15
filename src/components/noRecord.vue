<template>
  <div class="no-record-block d-flex justify-center align-center white--text font-weight-bold">
    {{ $t('noRecord') }}
  </div>
</template>

<script>
export default {
  name: 'no-record'
}
</script>

<style scoped>
.no-record-block{
  background-color: #D3D3D3;
  height: 200px;
}
</style>
<template>
  <div class="other-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="other-card card-wrap d-flex flex-column justify-center align-center">
          <h2 class="mb-5">{{ $t('cannotFindPage') }}</h2>
          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="scss">
.other-page{
  .other-card{
    padding: 100px 0;
  }
}
</style>
<template>
  <div class="coming-soon-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9" md="6">
        <v-card light class="other-card card-wrap d-flex flex-column justify-center align-center">
          <v-icon color="amber" large class="mb-5">mdi-alert</v-icon>
          <h2>{{ $t('webConstructing') }}</h2>
          <div class="mb-15">{{ $t('webConstructingDescription') }}</div>
          <div class="can-click" @click="$router.push({name: 'Home'})">{{ $t('backToIndex') }}</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: "ComingSoon"
}
</script>
<style lang="scss">
.coming-soon-page{
  .other-card{
    padding: 100px 0;
  }
}
</style>
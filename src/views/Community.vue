<template>
  <div class="community-page">
    <v-row justify="center" class="my-15">
      <v-col cols="11" sm="9">
        <borderWrapCard class="mb-13">
          <template #content>
            <titleBlock class="mb-8" title="community" icon="icon-community.svg"></titleBlock>
            <addressBlock></addressBlock>

            <v-row class="mb-10 w-100">
              <v-col cols="12" sm="6" class="d-flex flex-column justify-center align-center">
                <imgBtn dark type="bg-black-sloped" buttonText="refererAmount"></imgBtn>
                <h2 :class="`secondary--text`">{{ refers }}</h2>
              </v-col>
              <v-col cols="12" sm="6" class="d-flex flex-column justify-center align-center">
                <imgBtn dark type="bg-black-sloped" buttonText="communityAmount"></imgBtn>
                <h2 :class="`secondary--text`">{{ community }}</h2>
              </v-col>
            </v-row>

            <imgBtn class="mb-3" type="border-black-sloped" buttonText="backToIndex" @clickBtn="$router.push({name: 'Home'})"></imgBtn>
          </template>
        </borderWrapCard>
      </v-col>
    </v-row>
    <loading :loadingShow="loadingShow" :content="'waitGetData'"></loading>
  </div>
</template>
<script>
import addressBlock from '@/components/addressBlock.vue'
import Defi from "@/plugins/defi.js";
import loading from '@/components/loading.vue'
import borderWrapCard from '@/components/borderWrapCard.vue'
import titleBlock from '@/components/titleBlock.vue'
import imgBtn from '@/components/imgBtn.vue'
export default {
  name: 'Community',
  data (){
    return {
      defiContract: null,
      refers: null,
      community: null,
      loadingShow: false,
    }
  },
  components:{
    addressBlock,
    loading,
    borderWrapCard,
    titleBlock,
    imgBtn
  },
  async mounted(){
    this.loadingShow = true
    this.defiContract = await new Defi()

    // defi isMember
    let isMember = await this.defiContract.isMember(this.$store.state.account)
    if (isMember){
      try {
        await this.$nextTick(async () => {
          let result = await this.defiContract.getCommunity(this.$store.state.account)
          // console.log('result', result)
          this.refers = result.myRefs
          this.community = result.community
          this.loadingShow = false
        });
      }catch(error){
        console.log('error', error)
      }
    }else{
      this.$router.push({name: 'Defi-registry'})
    }
  }
}
</script>
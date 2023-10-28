<template>
  <div class="order-block mb-3" style="width: 100%;">
    <v-row no-gutters class="order-header secondary--text d-flex justify-space-between align-center py-2 px-5" :class="`primary_${$route.params.token}`">
      <div>{{ $t('id') }} {{ data.id }}</div>
      <div
        class="font-weight-bold"
        :class="{'red--text':!data.canOrder}"
      >
        {{ data.canOrder ? 
            `${$t('loanDays')} ${data.settleday / 24} ${$t('day')}` :
            `${$t('contract')}${status === 'breach' ? $t('expired') :
                                status === 'buffer' ? $t('buffer') : $t('due')} ${countdown.day}${$t('day')} ${countdown.hour}${$t('hour')} ${countdown.min}${$t('min')} ${countdown.sec}${$t('sec')}`}}
      </div>
    </v-row>
    <v-row no-gutters class="order-content text-center" :data-type="$route.params.token">
      <v-col cols="3" class="border-right d-flex flex-md-row flex-column justify-center align-center">
        <v-row no-gutters class="w-100 h-100">
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">{{ $t('loanToken') }}</v-col>
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">{{ token.name ? token.name.toUpperCase() : '' }}</v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="border-right d-flex flex-md-row flex-column justify-center align-center">
        <v-row no-gutters class="w-100 h-100">
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">{{ $t('loanTokenAmount') }}</v-col>
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">
          <div>
            {{ round(data.amount, 3) || 0 }}
            <span class="text-caption">{{ token.name ? token.name.toUpperCase() : '' }}</span>
          </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="border-right d-flex flex-md-ro flex-column justify-center align-center">
        <v-row no-gutters class="w-100 h-100">
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">{{ $t('marketValue') }}</v-col>
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">
            <div>
              {{ round(value, 0) }}
              <span class="text-caption">{{ $route.params.token.toUpperCase() }}</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="d-flex flex-md-row flex-column justify-center align-center">
        <v-row no-gutters class="w-100 h-100">
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">{{ $t('status') }}</v-col>
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">
            <div class="font-weight-bold text-center">
              {{ $t(status) }}
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row no-gutters class="order-content border-top text-center" :data-type="$route.params.token">
      <v-col cols="3" class="border-right d-flex flex-md-row flex-column justify-center align-center">
        <v-row no-gutters class="w-100 h-100">
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">{{ $t('loanAmount') }}</v-col>
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">
            <div>
              {{ round(data.want) }}
              <span class="text-caption">{{ $route.params.token.toUpperCase() }}</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="border-right d-flex flex-md-row flex-column justify-center align-center">
        <v-row no-gutters class="w-100 h-100">
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">{{ $t('loanMortgage') }}</v-col>
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">{{ rate }}%</v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="border-right d-flex flex-md-row flex-column justify-center align-center">
        <v-row no-gutters class="w-100 h-100">
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">{{ $t('loanRate') }}</v-col>
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">{{ mode==='loan' ? round(data.rate) : round(data.rate / 2) }}%</v-col>
        </v-row>
      </v-col>
      <v-col cols="3" class="d-flex flex-md-row flex-column justify-center align-center">
        <v-row no-gutters class="w-100 h-100">
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">{{ $t('loanInterest') }}</v-col>
          <v-col cols="12" md="6" class="order-col py-2 d-flex justify-center align-center">
            <div>
              {{ mode==='loan' ? round(data.want * data.rate / 100) : round(data.want * data.rate / 100 / 2) }}
              <span class="text-caption">{{ $route.params.token.toUpperCase() }}</span>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    
    <div class="d-flex justify-space-around align-center order-btn border-top pa-2 secondary white--text" :data-type="$route.params.token">
      <div>{{ $t('APR') }} {{ mode==='loan' ? round(365 / (data.settleday / 24) * (round(data.rate))) : round(365 / (data.settleday / 24) * (round(data.rate) / 2)) }} %</div>

      <imgBtn
        v-if="isLock"
        buttonText="approve"
        type="bg-white-sloped"
        @clickBtn="approve()"
      ></imgBtn>
      <btn v-else
        :buttonText="buttonText"
        :isDisabled="mode==='loan' ? completed
                  : data.canOrder ? false : status!=='breach'"
        :isCenter="true"
        color="primary"
        @clickBtn="clickBtn()"
      ></btn>
    </div>
  </div>
</template>

<script>
import btn from '@/components/btn.vue';
import imgBtn from '@/components/imgBtn.vue'
import base from '@/mixin/base.js';
export default {
  name: 'order-block',
  mixins: [base],
  components:{
    btn,
    imgBtn
  },
  props:{
    data:{
      type: Object,
      default: ()=>{
        return {}
      }
    },
    mode: {
      type: String,
      default: 'default'
    },
    buttonText: {
      type: String,
      default: ''
    },
    isLock: {
      type: Boolean,
      default: false
    },
  },
  data(){
    return {
      value: null,
      rate: null,
      now: 0,
      dueTime: 0,
      countdown: {
        day: '--',
        hour: '--',
        min: '--',
        sec: '--',
      },
      timer: null,
      token: {},
    }
  },
  watch:{
    "data.token"(){
      this.getToken()
    },
    "data.id"(){
      this.rate = null
      this.value = null
      this.getToken()
    },
    "data.filledTime"(newVal){
      if (newVal){
        this.getNow()
      }
    }
  },
  computed:{
    status(){
      const BREACH_BUFFER_HOUR = 12

      if (this.data.canOrder) {
        return 'waiting'
      }

      if (this.data.isComplete) {
        if (this.data.filledTime) return 'repay'
        return 'isCancel'
      }
      
      if (this.data.filledTime + this.data.settleday + BREACH_BUFFER_HOUR * 3600 >= this.now / 1000
        && this.now / 1000 >= this.data.filledTime + this.data.settleday
      ) {
        return 'buffer'
      }
      
      if (this.now / 1000 > this.data.filledTime + this.data.settleday + BREACH_BUFFER_HOUR * 3600) {
        return 'breach'
      }

      return 'loaning'
    },
    completed(){
      if (this.status === 'waiting' || this.status === 'loaning' || this.status === 'buffer'){
        return false
      }else{
        return true
      }
    }
  },
  methods:{
    async getEgtValue(){
      if (this.token){
        // console.log(this.token.name)
        this.value = await this.getValue(this.token.name, this.data.amount, this.$route.params.token);
      }
    },
    async getMorgageRate(){
      this.rate = await this.getRate(this.data.want, this.value);
    },
    clickBtn(){
      this.$emit('clickBtn')
    },
    approve(){
      this.$emit('approve')
    },
    getNow(){
      let _this = this
      let sec, min, hour, day
      // if (this.data.isComplete){
      if (this.completed){
        sec = min = hour = day = 0
        this.countdown = { day, hour, min, sec }
        if (this.timer){  
          window.clearInterval(this.timer)
        }
      }else{
        this.timer = window.setInterval(function () {
          _this.now = Math.floor(Date.now())
          _this.dueTime = (_this.data.filledTime + _this.data.settleday) * 60 * 60 * 1000
          let offsetTIme = (_this.dueTime - _this.now) / 1000

          if (offsetTIme < -43200) {
            sec = min = hour = day = 0
            window.clearInterval(_this.timer)
          } else {
            sec = parseInt(offsetTIme % 60)
            min = parseInt((offsetTIme / 60) % 60)
            hour = parseInt((offsetTIme / 60 / 60) % 24)
            day = parseInt(offsetTIme / 60 / 60 / 24)
          }

          _this.countdown = { day, hour, min, sec }
        }, 1000);
      }
    },
    async getToken(){
      let _this = this
      this.token = this.$store.state.tokenList.find((item) => (item.tokenaddress).toLowerCase() === (_this.data.token).toLowerCase())
      await this.getEgtValue()
      await this.getMorgageRate()
    }
  },
  async mounted(){
    if (this.data.filledTime){
      this.getNow()
    }
    this.getToken()
  },
  destroyed(){
    if (this.timer){
      window.clearInterval(this.timer)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-content[data-type="tbt"]:nth-child(even){
  background-color: #A594BF;
}
.order-content[data-type="usdt"]:nth-child(even){
  background-color: #CCFCFC;
}
.order-content[data-type="tbt"]:nth-child(odd), .order-btn[data-type="tbt"]{
  background-color: #E4DCEF;
}
.order-content[data-type="usdt"]:nth-child(odd), .order-btn[data-type="usdt"]{
  background-color: #EDFEFE;
}
.order-content {
  .order-col {
    color: white;
    &:nth-child(1) {
      background-color: var(--v-secondary-base);
    }
    &:nth-child(2) {
      background-color: var(--v-light-secondary-base);
    }
  }
}
.border-right {
  border-right: 1px solid white !important;
}
.border-top {
  border-top: 1px solid white !important;
}
</style>
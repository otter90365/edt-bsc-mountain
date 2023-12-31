import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios);

export default new Vuex.Store({
  state: {
    account: '',
    chainId: false,
    isEth: false,
    tokenList: [],
    DefiAddress: '',
    EGTAddress: '',
    ETHAddress: '',
    USDTAddress: '0xDd5C6cfADD8631ba00EE3f0EA2aA3e747356D764',
    EGTSwapAddress: '0xBE96377f9b4798e265Aa61d1A9F06847bD4864fE',
    ADTAddress: '',
    locale: 'tw',
    langs: ['tw'],
    tokens: ['usdt'],
    currToken: '',
    nowWidth: 0,
    rpcUrl: '',
    bscscanApiUrl: 'https://api.bscscan.com',
    bscscanApiKey: '',
    // backendUrl: 'https://mountain-defi.api-absolute-uv.com',
    backendUrl: 'https://defi-backend-bgkgcaksaq-uc.a.run.app',
    backendVersion: '/api/v1',
    token: '',
    BREACH_BUFFER_HOUR: 12
  },
  mutations: {
    updateAccount(state, account){
      state.account = account
    },
    updateChainId(state, chainId){
      state.chainId = chainId
    },
    updateIsEth(state, isEth){
      state.isEth = isEth
    },
    updateToken(state, token){
      state.token = token
    },
    updateTokenList(state, tokenList){
      state.tokenList = tokenList.map(item => ({...item, name: item.name.toLowerCase()}))
      let EGT = tokenList.find((item) => (item.name).toLowerCase() === 'egt')
      if (EGT){
        state.EGTAddress = EGT.tokenaddress
      }
      let ETH = tokenList.find((item) => (item.name).toLowerCase() === 'eth')
      if (ETH){
        state.ETHAddress = ETH.tokenaddress
      }
    },
    updateAddress(state, address){
      state.ADTAddress = address.adt
    },
    updateDefiContract(state, address){
      state.DefiAddress = address
    },
    updateRpcUrl(state, rpcUrl){
      state.rpcUrl = rpcUrl
    },
    updateBscscanApiKey(state, key){
      state.bscscanApiKey = key
    },
    updateLang(state, lang){
      state.locale = lang
    },
    updateNowWidth(state, nowWidth){
      state.nowWidth = nowWidth
    },
    updateCurrToken(state, currToken){
      state.currToken = currToken
    },
    updateUserInfo(state, userInfo){
      state.userInfo = userInfo
    },
    clearInfo(state){
      state.userInfo = {}
			state.account = ''
			state.token = ''
    },
  },
  getters: {
    backendUrl(){
      // return 'https://mountain-defi.api-absolute-uv.com'
      return 'https://defi-backend-bgkgcaksaq-uc.a.run.app'
    },
    wsBackendUrl(state){
      return state.currToken === 'usdt' ? 'wss://egt-usd-defi.api-absolute-uv.com' : 'wss://egt-tbt-defi.api-absolute-uv.com'
      // return state.currToken === 'usdt' ? 'wss://staging-jackpot.egtdefibsc.com' : 'wss://egttbt.egtdefibsc.com'
    },
  },
  actions: {
    async getTokenPrice({ state }, data){
      console.log('state', state.chainId)
      let result = await Vue.axios.get(`https://pro-api.coingecko.com/api/v3/simple/price?ids=${data.token}&vs_currencies=${data.currency}&include_last_updated_at=true&x_cg_pro_api_key=CG-JC54SgmUabpyX94wxVDmLffX`)
      return result.data
    },
    async getAllOrders({ getters }){
      let result = await Vue.axios.post(`${getters.backendUrl}/api/v1/orders`)
      return result.data
    },
    async getAllRecords({ state }, data){
      console.log('state', state.chainId)
      // let result = await Vue.axios.get(`https://api-rinkeby.etherscan.io/api?module=account&action=txlist&&address=${data.defiAddress}&startblock=${data.startBlock}&endblock=${data.endBlock}&page=${data.page}&apikey=C9RIE4CZZGHNE7FICYK8FWWUC2MP8WAR86`)
      let result = await Vue.axios.get(`https://api.etherscan.io/api?module=account&action=txlist&&address=${data.defiAddress}&startblock=${data.startBlock}&endblock=${data.endBlock}&page=${data.page}&apikey=C9RIE4CZZGHNE7FICYK8FWWUC2MP8WAR86`)
      return result.data
    },
    async getCommunity({ state }, data){
      let result = await Vue.axios.get(`${state.bscscanApiUrl}/api?module=logs&action=getLogs&fromBlock=${data.fromBlock}&toBlock=lastest&address=${data.defiAddress}&topic0=${data.topic0}&apikey=${state.bscscanApiKey}`)
      return result.data
    },
    async getDefiContract({ getters, commit }){
      try{
        let result = await Vue.axios.get(`${getters.backendUrl}/api/v1/url`)
        if (result.data.status === 200){
          commit('updateDefiContract', result.data.data.usdt)
          commit('updateRpcUrl', result.data.data.url)
          commit('updateBscscanApiKey', result.data.data.api_key)
        }
      }catch(error){
        console.log('error', error)
      }
    },
    async getUserInfo({ state, commit }){
			let result = await Vue.axios.get(`${state.backendUrl}${state.backendVersion}/user_info`, {
				headers:{
					Authorization: `Bearer ${state.token}`
				}
			})
			if (result.data.status === 672){
				commit('updateUserInfo', result.data.data)
			}else{
				commit('updateUserInfo', {})
			}
			return result.data
		},
  },
  modules: {
  }
})

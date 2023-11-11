import ABI from '@/assets/abi/egtSwap.js'
import store from '../store'
const Contract = require('web3-eth-contract')

export default class EGTSwap {
  constructor() {
    Contract.setProvider(store.state.rpcUrl)
    this.contract = new Contract(ABI, store.state.EGTSwapAddress);
  }

  async isMember(walletAddress){
    let isMember = await this.contract.methods.isMember(walletAddress).call();
    return isMember
  }

  async register(refererAddress){
    let extraData =  await this.contract.methods.register(refererAddress)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async buy(amount){
    const num = amount * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    let extraData = await this.contract.methods.buy(numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sell(amount){
    const num = amount * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    let extraData = await this.contract.methods.sell(numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data){
    const transactionParameters = {
      to: store.state.EGTSwapAddress,
      from: window.ethereum.selectedAddress,
      data: data,
    };
    
    try{
      let txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      })
      return {txHash: txHash}
    }catch(error){
      // console.log('error', error)
      return error
    }
  }
}
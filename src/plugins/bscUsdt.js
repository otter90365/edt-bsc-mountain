// register the plugin on vue
import ABI from '@/assets/abi/usdt.js'
import store from '../store'
import { USDTAddress, rpcURL, rpcURL2 } from '@/assets/contract.js'
const Contract = require('web3-eth-contract');
const rpc = document.cookie.includes('appRpc=2') ? rpcURL2 : rpcURL
Contract.setProvider(rpc);

export default class bscUsdt {
  constructor() {
    this.contract = new Contract(ABI, USDTAddress);
    // console.log('this.contract', this.contract)
  }

  async getBalance(walletAddress) {
    try{
      let balance = await this.contract.methods.balanceOf(walletAddress).call();
      return parseFloat((parseInt(balance) / (10 ** 18)).toFixed(5));
    }catch(error){
      console.log('error', error)
    }
  }

  async getAllowance(walletAddress){
    let allowance = await this.contract.methods.allowance(walletAddress, store.state.DefiAddress).call();
    return parseInt(allowance) / (10 ** 18)
  }

  async approve(){
    const num = 1000000000 * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    // console.log('numString', numString)

    let extraData =  await this.contract.methods.approve(store.state.DefiAddress, numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async transfer(toAddress, amount){
    amount = amount * (10 ** 18)
    const amountString = amount.toLocaleString('fullwide', {useGrouping:false})
    let extraData =  await this.contract.methods.transfer(toAddress, amountString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data){
    const transactionParameters = {
      to: USDTAddress,
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
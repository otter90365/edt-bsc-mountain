// register the plugin on vue
import ABI from '@/assets/abi/egt.js'
import store from '../store'
const Web3 = require("web3")
const Contract = require('web3-eth-contract')

export default class EGT {
  constructor() {
    Contract.setProvider(store.state.rpcUrl)
    this.contract = new Contract(ABI, store.state.EGTAddress);
    // console.log('this.contract', this.contract)
  }

  async getBalance(walletAddress) {
    let balance = await this.contract.methods.balanceOf(walletAddress).call();
    return parseFloat((parseInt(balance) / (10 ** 18)).toFixed(10));
  }

  async getAllowance(walletAddress){
    let allowance = await this.contract.methods.allowance(walletAddress, store.state.DefiAddress).call();
    return parseInt(allowance) / (10 ** 18)
  }

  async getOtherAllowance(walletAddress, contract){
    let allowance = await this.contract.methods.allowance(walletAddress, contract).call();
    return parseInt(allowance) / (10 ** 18)
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

  async approve(){
    const num = 1000000000 * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    // console.log('numString', numString)

    let extraData =  await this.contract.methods.approve(store.state.DefiAddress, numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async approveOther(contract){
    const num = 1000000000 * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})

    let extraData =  await this.contract.methods.approve(contract, numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data, value){
    let web3
    if (value){
      web3 = await new Web3(new Web3.providers.HttpProvider(store.state.rpcUrl));
    }
    const transactionParameters = {
      to: store.state.EGTAddress,
      value: value ? web3.utils.toHex(value) : 0,
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
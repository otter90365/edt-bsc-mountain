// register the plugin on vue
import ABI from '@/assets/abi/egt.js'
import store from '../store'
import { rpcURL, rpcURL2 } from '@/assets/contract.js'
const Web3 = require("web3");
const Contract = require('web3-eth-contract');
const rpc = document.cookie.includes('appRpc=2') ? rpcURL2 : rpcURL
Contract.setProvider(rpc);

export default class ERC {
  constructor(token) {
    this.token = token
    this.decimals = parseInt(token.decimals)
    this.contract = new Contract(ABI, token.tokenaddress);
    // console.log('this.contract', this.contract)
  }

  async getBalance(walletAddress) {
    let balance = await this.contract.methods.balanceOf(walletAddress).call();
    return parseFloat((parseInt(balance) / (10 ** this.decimals)).toFixed(10));
  }

  async getAllowance(walletAddress){
    let allowance = await this.contract.methods.allowance(walletAddress, store.state.DefiAddress).call();
    return parseInt(allowance) / (10 ** this.decimals)
  }

  async getEgtAllowance(walletAddress){
    let allowance = await this.contract.methods.allowance(walletAddress, store.state.EGTAddress).call();
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
    let extraData = await this.contract.methods.buy()
    let data = extraData.encodeABI()
    return this.sendTransaction(data, numString)
  }

  async sell(amount){
    const num = amount * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    let extraData = await this.contract.methods.sell(numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async approve(){
    const num = 1000000000 * 10 ** this.decimals;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    // console.log('numString', numString)

    let extraData =  await this.contract.methods.approve(store.state.DefiAddress, numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async approveEgt(){
    const num = 1000000000 * 10 ** 18;
    const numString = num.toLocaleString('fullwide', {useGrouping:false})
    // console.log('numString', numString)

    let extraData =  await this.contract.methods.approve(store.state.EGTAddress, numString)
    let data = extraData.encodeABI()
    return this.sendTransaction(data)
  }

  async sendTransaction(data, value){
    let web3
    if (value){
      web3 = await new Web3(new Web3.providers.HttpProvider(rpc));
    }
    const transactionParameters = {
      to: this.token.tokenaddress,
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
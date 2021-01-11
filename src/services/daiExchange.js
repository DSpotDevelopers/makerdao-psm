import Web3 from 'web3'
import { legos } from "@studydefi/money-legos";

export const DEFAULT_TOKENS = {
    DAI: legos.erc20.dai,
    USDC: {
        abi: legos.erc20.abi,
        address: legos.erc20.address
    },
}


export class DAIExchange{
    static Operation = {
        BUY: 'buy',
        SELL: 'sell'
    }
    constructor(operation, provider){
        if (operation === undefined){
            throw new Error('<operation:DAIExchange.Operation> is required')
        }
        this._isApproved = false
        this._isTraded = false
        this._contract = undefined
        this._operation = operation 
        this._provider = provider || Web3.givenProvider
        this._web3 = new Web3(this._provider)
    }

    using({abi, address}){
        // TODO: check if contract is already defined
        this._contract = this._web3.eth.Contract(abi, address)
    }

    get isApproved(){
        return this._isApproved
    }

    get isTraded(){
        return this._isTraded
    }

    approve(){
        //approve it
        this._contract.methods.approve()
        this.isApproved = true
        return this
    }

    trade(){
        if(this._isApproved){
            this._traded = true
        }
        else{
            //TODO: inform needs approval
        }
        return this
    }

    static buyGem(provider){
        return new DAIExchange(DAIExchange.Operation.BUY, provider)
    }
    static sellGem(provider){
        return new DAIExchange(DAIExchange.Operation.SELL,provider)
    }
}


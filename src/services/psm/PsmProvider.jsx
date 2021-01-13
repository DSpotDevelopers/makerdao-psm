import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { legos } from '@studydefi/money-legos';
import PsmAbi from './abis/PSM.json';
import VatAbi from './abis/VAT.json';

const Tokens = {
  DAI: 'DAI',
  USDC_A: 'USDC-A',
  PSM: 'PSM',
  GEM_JOIN: 'GEM_JOIN',
  MCD_JOIN_USDC_A: 'MCD_JOIN_USDC_A',
  VAT: 'VAT',
};

const ABIs = {
  ERC20: legos.erc20.abi,
  PSM: PsmAbi,
  VAT: VatAbi,
};

const Addresses = {
  DAI: legos.erc20.dai.address,
  USDC_A: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  PSM: '0x89B78CfA322F6C5dE0aBcEecab66Aee45393cC5A',
  GEM_JOIN: '0x0A59649758aa4d66E25f08Dd01271e891fe52199',
  MCD_JOIN_USDC_A: legos.erc20.usdc.address,
  VAT: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
};

const Operation = {
  BUY: 'buy',
  SELL: 'sell',
};

const lockedOf = async (token, provider = Web3.givenProvider) => {
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(ABIs.ERC20, Addresses.USDC_A);
  let locked;
  await contract.methods.balanceOf(Addresses.MCD_JOIN_USDC_A).call((err, val) => {
    locked = val;
  });
  return locked;
};

const totalSupply = async (token, provider = Web3.givenProvider) => {
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(ABIs.ERC20, Addresses.USDC_A);
  let suuply;
  await contract.methods.totalSupply().call((err, val) => {
    suuply = val;
  });
  return suuply;
};

// FIX: not working
const isConnected = (provider = Web3.givenProvider) => (new Web3(provider)).isConnected;

const getStats = async (token, provider = Web3.givenProvider) => {
  const web3 = new Web3(provider);
  const vatContract = new web3.eth.Contract(ABIs.VAT, Addresses.VAT);
  let ilk;
  await vatContract.methods.ilks(web3.utils.fromAscii(token)).call((err, val) => {
    ilk = val;
  });
  let debt;
  await vatContract.methods.debt().call((err, val) => {
    debt = val;
  });
  const supply = await totalSupply(token);
  const locked = await lockedOf(token);
  return {
    used: ilk.Art * ilk.rate,
    line: ilk.line,
    daiPercent: (ilk.Art * ilk.rate * 100) / debt,
    linePercent: (ilk.Art * ilk.rate * 100) / ilk.line,
    // fee: 1,
    locked,
    lockedPercent: locked / supply,
  };
};

const isValidOperation = (from, to) => from !== to && (from === Tokens.DAI || to === Tokens.DAI);

const getOperation = (from, to) => {
  if (!isValidOperation(from, to)) {
    throw new Error('Only trades between DAI and other gems are allowed');
  }
  return from === Tokens.DAI ? Operation.BUY : Operation.SELL;
};

const WAD = 10 ** 18;
const TRADE_FACTOR = 10 ** 6;

const approve = async (from, to, amount, provider = Web3.givenProvider) => {
  const web3 = new Web3(provider);
  const psmContract = web3.eth.Contract(ABIs.PSM, Addresses.PSM);
  let tout;
  await psmContract.methods.tout().call((err, value) => {
    tout = value;
  });
  const [contract, approvalAddress, approvalAmount] = getOperation(from, to) === Operation.BUY
    ? [web3.eth.Contract(ABIs.ERC20, Addresses.DAI), Addresses.PSM, amount * (tout + WAD)]
    : [web3.eth.Contract(ABIs.ERC20, Addresses.USDC_A), Addresses.GEM_JOIN, amount * TRADE_FACTOR];

  let operationApproved = false;
  await contract.methods.approve().call(approvalAddress, approvalAmount,
    (err, value) => {
      operationApproved = value;
    });
  return operationApproved;
};

const trade = async (from, to, amount, walletAddress, provider = Web3.givenProvider) => {
  const web3 = new Web3(provider);
  const psmContract = web3.eth.Contract(ABIs.PSM, Addresses.PSM);
  const tradeOperation = getOperation(from, to) === Operation.BUY
    ? psmContract.methods.buyGem
    : psmContract.methods.sellGem;
  let traded = false;
  await tradeOperation().call(walletAddress, amount * TRADE_FACTOR, (err) => {
    if (!err) traded = true;
  });
  return traded;
};

const PsmContext = createContext(null);

const PsmProvider = ({
  isConnected: isConnectedFunc,
  approve: approveFunc,
  trade: tradeFunc,
  lockedOf: lockedOfFunc,
  getStats: getStatsFunc,
  validGems,
  children,
}) => {
  const value = {
    isConnected: isConnectedFunc,
    validGems,
    approve: approveFunc,
    trade: tradeFunc,
    getStats: getStatsFunc,
    lockedOf: lockedOfFunc,
  };

  return (
    <PsmContext.Provider value={value}>
      {children}
    </PsmContext.Provider>
  );
};

PsmProvider.propTypes = {
  isConnected: PropTypes.func,
  approve: PropTypes.func,
  trade: PropTypes.func,
  lockedOf: PropTypes.func,
  getStats: PropTypes.func,
  validGems: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.element.isRequired,
};

PsmProvider.defaultProps = {
  isConnected,
  approve,
  trade,
  getStats,
  lockedOf,
  validGems: [Tokens.USDC_A],
};

export default PsmProvider;

export const usePsmService = () => useContext(PsmContext);

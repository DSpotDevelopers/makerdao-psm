import React, { createContext, useContext } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { legos } from '@studydefi/money-legos';
import PsmAbi from './abis/PSM.json';
import VatAbi from './abis/VAT.json';

const Tokens = {
  DAI: 'DAI',
  USDC: 'USDC',
};

const Ilks = {
  USDC: 'USDC-A',
};

const ABIs = {
  ERC20: legos.erc20.abi,
  PSM: PsmAbi,
  VAT: VatAbi,
};

const Addresses = {
  DAI: legos.erc20.dai.address,
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  PSM: '0x89B78CfA322F6C5dE0aBcEecab66Aee45393cC5A',
  GEM_JOIN: '0x0A59649758aa4d66E25f08Dd01271e891fe52199',
  MCD_JOIN_USDC_A: legos.erc20.usdc.address,
  VAT: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
};

const Operation = {
  BUY: 'buy',
  SELL: 'sell',
};

const ApprovalAmount = {
  USDC: 1.157920892373162e+71,
  DAI: 115792089237316195423570985008687907853269984665640564039457584007913129639935,
};

const buildContract = (abi, address, provider = Web3.givenProvider) => {
  const web3 = new Web3(provider);
  return new web3.eth.Contract(abi, address);
};

const lockedOf = async (token, provider = Web3.givenProvider) => {
  const contract = buildContract(ABIs.ERC20, Addresses[token], provider);
  return contract.methods.balanceOf(Addresses.MCD_JOIN_USDC_A).call();
};

const totalSupply = async (token, provider = Web3.givenProvider) => {
  const contract = buildContract(ABIs.ERC20, Addresses[token], provider);
  return contract.methods.totalSupply().call();
};

// FIX: not working
const isConnected = (provider = Web3.givenProvider) => (new Web3(provider)).isConnected;

const getStats = async (token, provider = Web3.givenProvider) => {
  const web3 = new Web3(provider);
  const vatContract = buildContract(ABIs.VAT, Addresses.VAT, provider);
  const ilk = await vatContract.methods.ilks(web3.utils.fromAscii(Ilks[token])).call();
  const debt = await vatContract.methods.debt().call();
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

const getFees = async (provider = Web3.givenProvider) => {
  const psmContract = buildContract(ABIs.PSM, Addresses.PSM, provider);
  return {
    tin: await psmContract.methods.tin().call(),
    tout: await psmContract.methods.tout().call(),
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
const USDC_DECIMALS = 10 ** 6;

const isApproved = async (from, to, walletAddress, minimalAmount) => {
  const [contract, approvalAddress] = getOperation(from, to) === Operation.BUY
    ? [buildContract(ABIs.ERC20, Addresses.DAI), Addresses.PSM]
    : [buildContract(ABIs.ERC20, Addresses.USDC), Addresses.GEM_JOIN];
  const allowance = await contract.methods.allowance(walletAddress, approvalAddress).call();
  return allowance >= minimalAmount;
};

const approve = async (from, to, provider = Web3.givenProvider) => {
  const { tout } = await getFees(provider);
  const [contract, approvalAddress, approvalAmount] = getOperation(from, to) === Operation.BUY
    ? [buildContract(ABIs.ERC20, Addresses.DAI), Addresses.PSM, ApprovalAmount.DAI * (tout + WAD)]
    : [buildContract(ABIs.ERC20, Addresses.USDC),
      Addresses.GEM_JOIN, ApprovalAmount.USDC * USDC_DECIMALS];
  return contract.methods.approve(approvalAddress, approvalAmount).call();
};

const trade = async (from, to, amount, walletAddress, provider = Web3.givenProvider) => {
  const psmContract = buildContract(ABIs.PSM, Addresses.PSM, provider);
  const tradeOperation = getOperation(from, to) === Operation.BUY
    ? psmContract.methods.buyGem
    : psmContract.methods.sellGem;
  await tradeOperation(walletAddress, amount * USDC_DECIMALS).call();
};

const PsmContext = createContext(null);

const PsmProvider = ({
  isConnected: isConnectedFunc,
  approve: approveFunc,
  isApproved: isApprovedFunc,
  trade: tradeFunc,
  lockedOf: lockedOfFunc,
  getStats: getStatsFunc,
  getFees: getFeesFunc,
  validGems,
  children,
}) => {
  const value = {
    isConnected: isConnectedFunc,
    validGems,
    approve: approveFunc,
    isApproved: isApprovedFunc,
    trade: tradeFunc,
    getFees: getFeesFunc,
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
  isApproved: PropTypes.func,
  trade: PropTypes.func,
  lockedOf: PropTypes.func,
  getStats: PropTypes.func,
  getFees: PropTypes.func,
  validGems: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.element.isRequired,
};

PsmProvider.defaultProps = {
  isConnected,
  approve,
  isApproved,
  trade,
  getStats,
  getFees,
  lockedOf,
  validGems: [Tokens.USDC],
};

export default PsmProvider;

export const usePsmService = () => useContext(PsmContext);

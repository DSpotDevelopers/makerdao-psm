import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { legos } from '@studydefi/money-legos';
import PsmAbi from './PSM.json';

const Tokens = {
  DAI: 'DAI',
  USDC: 'USDC',
  PSM: 'PSM',
  GEM_JOIN: 'GemJoin',
};

const ABIs = {
  ERC20: legos.erc20.abi,
  PSM: PsmAbi,
};

const Addresses = {
  DAI: legos.erc20.dai.address,
  USDC: legos.erc20.usdc.address,
  PSM: '0x89B78CfA322F6C5dE0aBcEecab66Aee45393cC5A',
  GemJoin: '0x0A59649758aa4d66E25f08Dd01271e891fe52199',
};

const Operation = {
  BUY: 'buy',
  SELL: 'sell',
};

const isConnected = (provider = Web3.givenProvider) => (new Web3(provider)).isConnected();

// TODO: Implement
const connect = (provider = Web3.givenProvider) => provider;

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
    : [web3.eth.Contract(ABIs.ERC20, Addresses.USDC), Addresses.GemJoin, amount * TRADE_FACTOR];

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
  isConnectedFunc, connectFunc, approveFunc, tradeFunc, validGems, children,
}) => {
  const value = {
    isConnected: isConnectedFunc,
    connect: connectFunc,
    validGems,
    approve: approveFunc,
    trade: tradeFunc,
  };

  return (
    <PsmContext.Provider value={value}>
      {children}
    </PsmContext.Provider>
  );
};

PsmProvider.propTypes = {
  isConnectedFunc: PropTypes.func,
  connectFunc: PropTypes.func,
  approveFunc: PropTypes.func,
  tradeFunc: PropTypes.func,
  validGems: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.element.isRequired,
};

PsmProvider.defaultProps = {
  isConnectedFunc: isConnected,
  connectFunc: connect,
  approveFunc: approve,
  tradeFunc: trade,
  validGems: [Tokens.USDC],
};

export default PsmProvider;

export const usePsmService = () => useContext(PsmContext);

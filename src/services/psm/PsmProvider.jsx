import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import PsmAbi from './abi/PSM.json';
import VatAbi from './abi/VAT.json';
import ERC20Abi from './abi/ERC20.json';

const Tokens = {
  DAI: 'DAI',
  USDC: 'USDC',
  PAX: 'PAX',
};
const PSMTokens = [
  {
    psmToken: 'PSM-USDC-A',
    nameToken: 'USDC',
  }, {
    psmToken: 'PSM-PAX-A',
    nameToken: 'PAX',
  },
];
const ABIs = {
  ERC20: ERC20Abi,
  PSM: PsmAbi,
  VAT: VatAbi,
};

const Addresses = {
  DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  PAX: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
  PSM: '0x89B78CfA322F6C5dE0aBcEecab66Aee45393cC5A',
  GEM_JOIN: '0x0A59649758aa4d66E25f08Dd01271e891fe52199',
  VAT: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
};

const USDC_DECIMALS = 10 ** 6;
const WAD = 10 ** 18;
const RAD = 10 ** 45;
const MAX_APPROVAL_AMOUNT = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
const MIN_APPROVAL_AMOUNT = '0x0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';

const buildContract = (abi, address, provider = Web3.givenProvider) => {
  const web3 = new Web3(provider);
  return new web3.eth.Contract(abi, address);
};

const getStats = async (provider = Web3.givenProvider) => {
  // const tokenIls = 'PSM-USDC-A';

  const web3 = new Web3(provider);
  const vatContract = buildContract(ABIs.VAT, Addresses.VAT, provider);
  // eslint-disable-next-line max-len
  const ilksArray = PSMTokens.map((tokenIlk) => vatContract.methods.ilks(web3.utils.fromAscii(tokenIlk.psmToken)).call());

  const ilks = await Promise.all(ilksArray);

  const ilksExtracted = ilks.reduce((accumulator, ilk, index) => {
    const used = (ilk.Art * ilk.rate) / RAD;
    const line = ilk.line / RAD;
    const extractedData = {
      used,
      usedPercent: (used * 100) / line,
      total: line,
    };

    return ({
      ...accumulator,
      [PSMTokens[index].nameToken]: extractedData,
    });
  }, {});

  return ilksExtracted;
};

const getFees = async (provider = Web3.givenProvider) => {
  const psmContract = buildContract(ABIs.PSM, Addresses.PSM, provider);
  return {
    // eslint-disable-next-line no-mixed-operators
    tin: await psmContract.methods.tin().call() * 100 / WAD, // USDC -> DAI
    // eslint-disable-next-line no-mixed-operators
    tout: await psmContract.methods.tout().call() * 100 / WAD, // DAI -> USDC
  };
};

const isValidOperation = (from, to) => from !== to && (from === Tokens.DAI || to === Tokens.DAI);

const isBuying = (from, to) => {
  if (!isValidOperation(from, to)) {
    throw new Error('Only trades between DAI and other gems are allowed');
  }
  return from === Tokens.DAI;
};

const isApproved = async (from, to, walletAddress, provider = Web3.givenProvider) => {
  const [contract, approvalAddress] = isBuying(from, to)
    ? [buildContract(ABIs.ERC20, Addresses.DAI, provider), Addresses.PSM]
    : [buildContract(ABIs.ERC20, Addresses.USDC, provider), Addresses.GEM_JOIN];

  const allowance = await contract.methods.allowance(walletAddress, approvalAddress).call();
  return allowance >= MIN_APPROVAL_AMOUNT;
};

const approve = async (from, to, account, provider = Web3.givenProvider) => {
  const [contract, approvalAddress, approvalAmount] = isBuying(from, to)
    ? [buildContract(ABIs.ERC20, Addresses.DAI, provider), Addresses.PSM, MAX_APPROVAL_AMOUNT]
    : [buildContract(ABIs.ERC20, Addresses[Tokens[from]], provider),
    // eslint-disable-next-line indent
    Addresses.GEM_JOIN, MAX_APPROVAL_AMOUNT];

  return contract.methods.approve(approvalAddress, approvalAmount).send({ from: account });
};

const trade = async (from, to, pAmount, account, provider = Web3.givenProvider) => {
  const psmContract = buildContract(ABIs.PSM, Addresses.PSM, provider);
  const [operation, amount] = isBuying(from, to)
    ? [psmContract.methods.buyGem, Math.trunc(pAmount * USDC_DECIMALS)]
    : [psmContract.methods.sellGem, Math.trunc(pAmount * USDC_DECIMALS)];

  await operation(account, amount.toString()).send({ from: account });
};

const PsmContext = createContext(null);

const PsmProvider = ({
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
  approve,
  isApproved,
  trade,
  getStats,
  getFees,
  validGems: [Tokens.USDC],
  lockedOf: () => { },
};

export default PsmProvider;

export const usePsmService = () => useContext(PsmContext);

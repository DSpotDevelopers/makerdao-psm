import React, { createContext, useContext } from 'react';
import Big from 'big.js';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import PsmAbi from './abi/PSM.json';
import VatAbi from './abi/VAT.json';
import ERC20Abi from './abi/ERC20.json';
import DAIImg from '../../assets/dai.png';
import USDCImg from '../../assets/usdc.png';
import GUSDImg from '../../assets/gusd.png';
import USDPImg from '../../assets/usdp.png';

export const currencies = [{
  name: 'DAI',
  image: DAIImg,
}, {
  name: 'USDC',
  image: USDCImg,
},
{
  name: 'USDP',
  image: USDPImg,
},
{
  name: 'GUSD',
  image: GUSDImg,
},
];

const Tokens = {
  DAI: 'DAI',
  USDC: 'USDC',
  GUSD: 'GUSD',
  USDP: 'USDP',
};

const admitedCollaterals = {
  USDC: {
    ilkTokenName: 'PSM-USDC-A',
    nameToken: 'USDC',
    addressToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    addressPSM: '0x89B78CfA322F6C5dE0aBcEecab66Aee45393cC5A',
    addressGemJoin: '0x0A59649758aa4d66E25f08Dd01271e891fe52199',
    abiToken: PsmAbi,
    decimals: 10 ** 6,
  },
  USDP: {
    ilkTokenName: 'PSM-PAX-A',
    nameToken: 'USDP',
    addressToken: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
    addressPSM: '0x961Ae24a1Ceba861D1FDf723794f6024Dc5485Cf',
    addressGemJoin: '0x7bbd8cA5e413bCa521C2c80D8d1908616894Cf21',
    abiToken: PsmAbi,
    decimals: 10 ** 18,
  },
  GUSD: {
    ilkTokenName: 'PSM-GUSD-A',
    nameToken: 'GUSD',
    addressToken: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
    addressPSM: '0x204659B2Fd2aD5723975c362Ce2230Fba11d3900',
    addressGemJoin: '0x79A0FA989fb7ADf1F8e80C93ee605Ebb94F7c6A5',
    abiToken: PsmAbi,
    decimals: 10 ** 2,
  },
};

const ABIs = {
  ERC20: ERC20Abi,
  PSM: PsmAbi,
  VAT: VatAbi,
};

const ADDRESSES = {
  DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
  VAT: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
};

const WAD = 10 ** 18;
const RAD = 10 ** 45;
const MAX_APPROVAL_AMOUNT = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';
const MIN_APPROVAL_AMOUNT = '0x0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF';

const buildContract = (abi, address, provider = Web3.givenProvider) => {
  const web3 = new Web3(provider);
  return new web3.eth.Contract(abi, address);
};

const getStats = async (provider = Web3.givenProvider) => {
  const web3 = new Web3(provider);
  const vatContract = buildContract(ABIs.VAT, ADDRESSES.VAT, provider);

  const admitedCollateralsValues = Object.values(admitedCollaterals);

  const statsAll = admitedCollateralsValues.map((tokenIlk) => vatContract
    .methods.ilks(web3.utils.fromAscii(tokenIlk.ilkTokenName)).call());

  const statsResolved = await Promise.all(statsAll);

  const stats = statsResolved.reduce((accumulator, ilk, index) => {
    const used = (ilk.Art * ilk.rate) / RAD;
    const line = ilk.line / RAD;
    const extractedData = {
      used,
      usedPercent: (used * 100) / line,
      total: line,
    };

    return ({
      ...accumulator,
      [admitedCollateralsValues[index].nameToken]: extractedData,
    });
  }, {});

  return stats;
};

const getFees = async (provider = Web3.givenProvider) => {
  const contracts = Object.values(admitedCollaterals).map((gem) => {
    const psmContract = buildContract(gem.abiToken, gem.addressPSM, provider);
    return { psmContract, nameToken: gem.nameToken };
  });

  const tinArray = contracts.map((item) => item.psmContract.methods.tin().call());
  const toutArray = contracts.map((item) => item.psmContract.methods.tout().call());

  const tinValues = await Promise.all(tinArray);
  const toutValues = await Promise.all(toutArray);

  const fees = {};
  contracts.forEach((item, index) => {
    const feeStructure = {
      tin: (tinValues[index] * 100) / WAD, // Gem -> DAI

      tout: (toutValues[index] * 100) / WAD, // DAI -> Gem
    };

    fees[item.nameToken] = feeStructure;
  });

  return fees;
};

const isValidOperation = (from, to) => from !== to && (from === Tokens.DAI || to === Tokens.DAI);

const isBuying = (from, to) => {
  if (!isValidOperation(from, to)) {
    throw new Error('Only trades between DAI and other gems are allowed');
  }
  return from === Tokens.DAI;
};

const getGem = (from, to) => (from === Tokens.DAI ? to : from);

const isApproved = async (from, to, walletAddress, provider = Web3.givenProvider) => {
  const gem = admitedCollaterals[getGem(from, to)];

  const [contract, approvalAddress] = isBuying(from, to)
    ? [buildContract(ABIs.ERC20, ADDRESSES.DAI, provider), gem.addressPSM]
    : [buildContract(ABIs.ERC20, gem.addressToken, provider),
      gem.addressGemJoin];

  const allowance = await contract.methods.allowance(walletAddress, approvalAddress).call();
  return allowance >= MIN_APPROVAL_AMOUNT;
};

const approve = async (from, to, account, provider = Web3.givenProvider) => {
  const gem = admitedCollaterals[getGem(from, to)];
  const [contract, approvalAddress, approvalAmount] = isBuying(from, to)
    ? [buildContract(ABIs.ERC20, ADDRESSES.DAI, provider), gem.addressPSM,
      MAX_APPROVAL_AMOUNT]
    : [buildContract(ABIs.ERC20, gem.addressToken, provider),
      gem.addressGemJoin, MAX_APPROVAL_AMOUNT];

  return contract.methods.approve(approvalAddress, approvalAmount).send({ from: account });
};

const trade = async (from, to, pAmount, account, provider = Web3.givenProvider) => {
  const gem = admitedCollaterals[getGem(from, to)];

  const psmContract = buildContract(gem.abiToken, gem.addressPSM, provider);
  const decimalsBigNumber = Big(gem.decimals);

  const amount = decimalsBigNumber.times(pAmount).toFixed();

  // eslint-disable-next-line no-unused-vars
  const operation = isBuying(from, to)
    ? psmContract.methods.buyGem
    : psmContract.methods.sellGem;

  await operation(account, amount).send({ from: account });
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

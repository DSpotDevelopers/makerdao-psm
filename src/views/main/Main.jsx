import React, { useEffect, useState } from 'react';
import './Main.scss';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import logo from '../../assets/logo.svg';
import ConnectButton from '../../components/connect-button/ConnectButton';
import TransferButton from '../../components/transfer-button/TransferButton';
import Input from '../../components/input/Input';
import Select from '../../components/select/Select';
import DAIImg from '../../assets/dai.png';
import USDCImg from '../../assets/usdc.png';
import Button from '../../components/button/Button';
import Info from '../../components/info/Info';
import StatsImg from '../../assets/dollar.svg';
import InfoImg from '../../assets/hand.svg';
import { usePsmService } from '../../services/psm/PsmProvider';
import Notification from '../../components/notification/Notification';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const Main = () => {
  //
  // Notifications Logic
  //
  const [notification, setNotification] = useState(null);

  const notify = ({ type, message }) => {
    setNotification({
      type,
      message,
    });

    setTimeout(() => setNotification(null), 3000);
  };

  //
  // Connection Logic
  //
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(undefined);
  const [provider, setProvider] = useState(undefined);

  const [approved, setApproved] = useState(false);

  // Currencies states
  const currencies = [{
    name: 'DAI',
    image: DAIImg,
  }, {
    name: 'USDC',
    image: USDCImg,
  }];
  const [inputCurrency, setInputCurrency] = useState(currencies[0]);
  const [outputCurrency, setOutputCurrency] = useState(currencies[1]);

  const psmService = usePsmService();

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: '994ffbdba376443ba4b5bb1e714467d1',
      },
    },
  };

  const web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: false,
    providerOptions,
  });

  web3Modal.clearCachedProvider();

  const checkApproval = async (pInputCurrency, pOutputCurrency, pAccount) => {
    try {
      const isApproved = await psmService.isApproved(pInputCurrency, pOutputCurrency, pAccount);
      setApproved(isApproved);
    } catch (e) {
      notify({
        type: 'Error',
        message: e.message.toString(),
      });
    }
  };

  const connect = async () => {
    if (connected) {
      setConnected(false);
      return;
    }
    const tempProvider = await web3Modal.connect();

    const web3 = new Web3(tempProvider);

    try {
      const accounts = await web3.eth.getAccounts();

      setAccount(accounts[0]);
      setConnected(true);
      setProvider(tempProvider);

      await checkApproval(inputCurrency.name, outputCurrency.name, accounts[0]);

      notify({
        type: 'Success',
        message: 'Connected to wallet successfully',
      });
    } catch (e) {
      notify({
        type: 'Error',
        message: e.message.toString(),
      });
    }
  };

  //
  // PSM
  //
  const [stats, setStats] = useState(undefined);
  const [fees, setFees] = useState(undefined);

  useEffect(async () => {
    try {
      setStats(await psmService.getStats());
      setFees(await psmService.getFees());
    } catch (e) {
      notify({
        type: 'Error',
        message: e.message.toString(),
      });
    }
  }, []);

  const [inputValue, setInputValue] = useState(undefined);
  const [outputValue, setOutputValue] = useState(0.00);
  const [fee, setFee] = useState(0.00);

  const handleEntryChange = async ({ target: { value } }) => {
    setInputValue(value);
  };

  //
  // Select values ang logic
  //

  const handleClick = async (el, isLeft) => {
    const opposite = currencies.filter((x) => x.name !== el.name)[0];
    let tempInputCurrency;
    let tempOutputCurrency;

    if (isLeft) {
      tempInputCurrency = el;
      tempOutputCurrency = opposite;
    } else {
      tempOutputCurrency = el;
      tempInputCurrency = opposite;
    }

    setInputCurrency(tempInputCurrency);
    setOutputCurrency(tempOutputCurrency);

    if (account) {
      await checkApproval(tempInputCurrency.name, tempOutputCurrency.name, account);
    }
  };

  const isBuying = () => {
    if (!outputCurrency) return false;
    return outputCurrency.name === 'DAI';
  };

  //
  // Trade Logic
  //
  const [circleState, setCircleState] = useState(0);

  useEffect(() => {
    setCircleState(+!!inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (!fees && !inputValue) {
      setOutputValue(0.00);
      return;
    }

    let chargedFee;
    if (isBuying()) {
      // Determined from single equation outputValue = inputValue * (1 - tin)
      chargedFee = (inputValue * fees.tin) / 100;
    } else {
      // Determined from equations system:
      // inputValue - chargedFee = outputValue
      // chargedFee = outputValue * tout;
      const toutDecimal = fees.tout / 100;
      chargedFee = (inputValue * toutDecimal) / (1 + toutDecimal);
    }

    setOutputValue(inputValue - chargedFee);
    setFee(chargedFee);
  }, [inputValue, inputCurrency]);

  const trade = async () => {
    if (!account) return;

    if (!inputValue) {
      notify({
        type: 'Error',
        message: 'You should input how much you want to trade',
      });
      return;
    }

    setCircleState(2);

    try {
      let tradedAmountUSDC;
      if (isBuying()) {
        // Determined from single equation outputValue = inputValue * (1 - tin);
        tradedAmountUSDC = inputValue * (1 - fees.tin / 100);
      } else {
        // Determined from equations system:
        // inputValue - chargedFee = outputValue
        // chargedFee = outputValue * tout;
        const toutDecimal = fees.tout / 100;
        tradedAmountUSDC = inputValue * (1 - toutDecimal / (1 + toutDecimal));
      }

      await psmService.trade(inputCurrency.name, outputCurrency.name,
        tradedAmountUSDC, account, provider);

      notify({
        type: 'Success',
        message: 'Transference finished successfully',
      });
      setCircleState(3);

      setTimeout(() => {
        setCircleState(1);
      }, 3000);
    } catch (e) {
      setCircleState(1);
      notify({
        type: 'Error',
        message: e.message.toString(),
      });
    }
  };

  const approve = async () => {
    if (!account) return;

    await psmService.approve(inputCurrency.name, outputCurrency.name, account, provider);
    await checkApproval(inputCurrency.name, outputCurrency.name, account);
  };

  return (
    <div className="MainContainer">
      <div className="LogoContainer">
        <img src={logo} alt="Logo" />
        <div>PSM</div>
      </div>
      <ConnectButton onClick={connect} connected={connected} walletId={account} />
      <div className="TradeContainer">
        <div className="labels">
          <span className="Label">From</span>
          <span className="Label">To</span>
        </div>
        <div className="container">
          <div className="Side Left">
            <div style={{ marginBottom: '16px' }}>
              <Input left value={inputValue} onChange={handleEntryChange} />
            </div>
            <Select
              left
              value={inputCurrency}
              elements={currencies}
              handleClick={handleClick}
            />
          </div>
          <div className="Center">
            <TransferButton circleState={circleState} />
          </div>
          <div className="Side Right">
            <div style={{ marginBottom: '16px' }}>
              <Input right value={outputValue} />
            </div>
            <Select
              right
              value={outputCurrency}
              elements={currencies}
              handleClick={handleClick}
            />
          </div>
        </div>
      </div>
      <div className="InfoContainer">
        {inputValue && fee && (
          <Info img={InfoImg}>
            <div className="InfoData">
              <span>Fees:</span>
              {' '}
              <span className="Data">
                $
                {fee.toFixed(2)}
                {' '}
                / (
                {fees.tin}
                %)
              </span>
            </div>
          </Info>
        )}
      </div>
      <div className="NotificationsContainer">
        {notification && <Notification type={notification.type} value={notification.message} />}
      </div>
      <Button
        /* eslint-disable no-nested-ternary */
        label={connected ? (approved ? 'Trade' : 'Approve') : 'Connect'}
        onClick={() => (connected ? (approved ? trade() : approve()) : connect())}
        /* eslint-enable no-nested-ternary */
      />
      <div className="Copyright">
        <div>A Maker Community Project</div>
        <a href="https://github.com/BellwoodStudios/dss-psm" target="_blank" rel="noreferrer">
          Docs
        </a>
      </div>

      <div className="Stats">
        <Info img={StatsImg} left>
          <div className="StatsText">
            Currency Reserves
          </div>
        </Info>
        <div className="StatsRow">
          <div className="Image">
            <img src={USDCImg} alt="usdc" />
          </div>
          <div className="StatsInfo">
            <div className="Label">USDC:</div>
            <div className="Value">
              {stats && stats.used && numberWithCommas(stats.used.toFixed(2))}
              {' '}
              (
              {stats && stats.usedPercent && stats.usedPercent.toFixed(2)}
              %)
            </div>
          </div>
        </div>
        <div className="StatsRow">
          <div className="StatsInfo">
            <div className="Label">Liquidity Utilization:</div>
            <div className="Value">
              (
              {stats && stats.usedPercent && stats.usedPercent.toFixed(2)}
              %)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;

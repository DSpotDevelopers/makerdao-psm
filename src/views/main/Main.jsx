import React, { useEffect, useState } from 'react';
import './Main.scss';
import logo from '../../assets/logo.svg';
import ConnectButton from '../../components/connect-button/ConnectButton';
import TransferButton from '../../components/transfer-button/TransferButton';
import Input from '../../components/input/Input';
import Select from '../../components/select/Select';
import DaiImg from '../../assets/dai.png';
import Usdc from '../../assets/usdc.png';
import Button from '../../components/button/Button';
import Info from '../../components/info/Info';
import StatsImg from '../../assets/dollar.svg';
import { usePsmService } from '../../services/psm/PsmProvider';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const Main = () => {
  const psmService = usePsmService();
  // eslint-disable-next-line no-unused-vars
  const [stats, setStats] = useState(undefined);
  // eslint-disable-next-line no-unused-vars
  const [fees, setFees] = useState(undefined);
  useEffect(async () => {
    setStats(await psmService.getStats());
    setFees(await psmService.getFees());
  }, []);

  const [inputValue, setInputValue] = useState(undefined);
  const [outputValue, setOutputValue] = useState(0.00);
  const [fee, setFee] = useState(0.00);

  const handleEntryChange = ({ target: { value } }) => {
    setInputValue(value);
  };

  // eslint-disable-next-line no-unused-vars
  const [showInfo, setShowInfo] = useState(true);

  //
  // Select values ang logic
  //
  const currencies = [{
    name: 'DAI',
    image: DaiImg,
  }, {
    name: 'USDC',
    image: Usdc,
  }];

  const [inputCurrency, setInputCurrency] = useState(currencies[0]);
  const [outputCurrency, setOutputCurrency] = useState(currencies[1]);

  const handleClick = (el, isLeft) => {
    const opposite = currencies.filter((x) => x.name !== el.name)[0];
    if (isLeft) {
      setInputCurrency(el);
      setOutputCurrency(opposite);
    } else {
      setOutputCurrency(el);
      setInputCurrency(opposite);
    }
  };

  //
  // Trade Logic
  //
  const [trading, setTrading] = useState(false);

  const handleTradeClick = () => {
    setTrading(true);
  };

  const circleState = +(!!inputValue) + trading;

  useEffect(() => {
    if (!fees && !inputValue) {
      setOutputValue(0.00);
      return;
    }
    const tempFee = inputValue * (inputCurrency.name === 'USDC' ? fees.tin : fees.tout);
    setOutputValue(inputValue - tempFee);
    setFee(tempFee);
  }, [inputValue, inputCurrency]);

  return (
    <div className="MainContainer">
      <div className="LogoContainer">
        <img src={logo} alt="Logo" />
        <div>PSM</div>
      </div>
      <ConnectButton />
      <div className="TradeContainer">
        <div className="Side Left">
          <span className="Label">From</span>
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
          <span className="Label">To</span>
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
      <div className="InfoContainer">
        {showInfo && inputValue && fee && (
          <Info img={StatsImg}>
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
      <Button label="Trade" onClick={handleTradeClick} />
      <div className="Copyright">
        <div>A Maker Community Project</div>
        <a href="https://github.com/BellwoodStudios/dss-psm" target="_blank" rel="noreferrer">Docs</a>
      </div>

      <div className="Stats">
        <Info img={StatsImg} left>
          <div className="StatsText">
            Currency Reserves
          </div>
        </Info>
        <div className="StatsRow">
          <div className="Image">
            <img src={Usdc} alt="usdc" />
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

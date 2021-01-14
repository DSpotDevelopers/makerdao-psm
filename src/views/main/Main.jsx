import React, { useState } from 'react';
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
import InfoImg from '../../assets/dollar.svg';

const Main = () => {
  const [entryValue, setEntryValue] = useState(0);

  const handleEntryChange = ({ target: { value } }) => {
    setEntryValue(value);
  };

  // eslint-disable-next-line no-unused-vars
  const [showInfo, setShowInfo] = useState(true);

  const currencies = [{
    name: 'DAI',
    image: DaiImg,
  }, {
    name: 'USDC',
    image: Usdc,
  }];

  const [leftValue, setLeftValue] = useState(currencies[0]);
  const [rightValue, setRightValue] = useState(currencies[1]);

  const handleClick = (el, isLeft) => {
    const opposite = currencies.filter((x) => x.name !== el.name)[0];
    if (isLeft) {
      setLeftValue(el);
      setRightValue(opposite);
    } else {
      setRightValue(el);
      setLeftValue(opposite);
    }
  };

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
            <Input left value={entryValue} onChange={handleEntryChange} />
          </div>
          <Select
            left
            value={leftValue}
            elements={currencies}
            handleClick={handleClick}
          />
        </div>
        <div className="Center">
          <TransferButton />
        </div>
        <div className="Side Right">
          <span className="Label">To</span>
          <div style={{ marginBottom: '16px' }}>
            <Input right value="0.00" />
          </div>
          <Select
            right
            value={rightValue}
            elements={currencies}
            handleClick={handleClick}
          />
        </div>
      </div>
      <div className="InfoContainer">
        {showInfo && (
        <Info img={InfoImg}>
          <div className="InfoData">
            <span>Fees:</span>
            {' '}
            <span className="Data">$45.99 / (0.1%)</span>
          </div>
        </Info>
        )}
      </div>
      <Button label="Trade" />
      <div className="Copyright">
        <div>A Maker Community Project</div>
        <a href="https://github.com/BellwoodStudios/dss-psm" target="_blank" rel="noreferrer">Docs</a>
      </div>
    </div>
  );
};

export default Main;

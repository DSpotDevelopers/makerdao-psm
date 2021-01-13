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

const Main = () => {
  const [entryValue, setEntryValue] = useState(0);

  const handleEntryChange = ({ target: { value } }) => {
    setEntryValue(value);
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
          <Select left value="DAI" img={DaiImg} />
        </div>
        <div className="Center">
          <TransferButton />
        </div>
        <div className="Side Right">
          <span className="Label">To</span>
          <div style={{ marginBottom: '16px' }}>
            <Input right value="0.00" />
          </div>
          <Select right value="USDC" img={Usdc} />
        </div>
      </div>
      <Button label="Trade" />
      <div className="Copyright">A Maker Community Project</div>
    </div>
  );
};

export default Main;

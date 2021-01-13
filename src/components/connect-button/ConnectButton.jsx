import React from 'react';
import './ConnectButton.scss';
import imgWallet from '../../assets/wallet.svg';

const ConnectButton = () => (
  <div className="ConnectButton">
    <img src={imgWallet} alt="wallet" className="img" />
    Connect to Wallet...
  </div>
);

export default ConnectButton;

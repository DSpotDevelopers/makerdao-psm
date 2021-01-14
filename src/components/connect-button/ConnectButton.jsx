import React, { useState } from 'react';
import './ConnectButton.scss';
import imgWallet from '../../assets/wallet.svg';

const ConnectButton = () => {
  // eslint-disable-next-line no-unused-vars
  const [connecting, setConnecting] = useState(false);

  return (
    <div className="ConnectButtonWrapper no-select">
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div className={`Gradient ${connecting ? 'Connecting' : ''}`} onClick={() => setConnecting(!connecting)}>
        <img src={imgWallet} alt="wallet" className="img" />
      </div>
      {connecting && <span>Connect to Wallet...</span>}
      {!connecting && <input type="text" placeholder="Enter wallet id" />}
    </div>
  );
};

export default ConnectButton;

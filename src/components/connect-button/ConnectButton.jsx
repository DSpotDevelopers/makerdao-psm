import React from 'react';
import './ConnectButton.scss';
import PropTypes from 'prop-types';
import imgWallet from '../../assets/wallet.svg';

const ConnectButton = ({ onClick, connected, walletId }) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  <div className="ConnectButtonWrapper no-select" role="presentation" onClick={async () => onClick()}>
    <div className={`Gradient ${connected ? '' : 'Connecting'}`}>
      <img src={imgWallet} alt="wallet" className="img" />
    </div>
    {!connected && <span>Connect to Wallet...</span>}
    {connected && (
    <span className="WalletId">
      {walletId}
    </span>
    )}
  </div>
);

ConnectButton.propTypes = {
  onClick: PropTypes.func,
  connected: PropTypes.bool,
  walletId: PropTypes.string,
};

ConnectButton.defaultProps = {
  onClick: () => {},
  connected: false,
  walletId: '',
};

export default ConnectButton;

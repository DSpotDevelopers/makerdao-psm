import React, { useState } from 'react';
import './ConnectButton.scss';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import imgWallet from '../../assets/wallet.svg';
import { usePsmService } from '../../services/psm/PsmProvider';

const ConnectButton = () => {
  // eslint-disable-next-line no-unused-vars
  const [connected, setConnected] = useState(false);

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

  const handleConnection = async () => {
    const provider = await web3Modal.connect();

    // example from https://github.com/Web3Modal/web3modal/blob/master/example/src/App.tsx
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    // testing trade
    await psmService.approve('USDC', 'DAI', accounts[0], provider);
    await psmService.trade('USDC', 'DAI', 450, accounts[0], provider);

    setConnected(!connected);
  };

  return (
    <div className="ConnectButtonWrapper no-select">
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,no-return-await */}
      <div className={`Gradient ${connected ? '' : 'Connecting'}`} onClick={async () => await handleConnection()}>
        <img src={imgWallet} alt="wallet" className="img" />
      </div>
      {!connected && <span>Connect to Wallet...</span>}
      {connected && <input type="text" placeholder="Enter wallet id" />}
    </div>
  );
};

export default ConnectButton;

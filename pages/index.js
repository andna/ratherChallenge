import React, { useEffect } from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import Button from '@mui/material/Button';


export default function Home() {

  useEffect(function mount() {
    const domain = window.location.host;
    const origin = window.location.origin;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    function createSiweMessage(address, statement) {
      const message = new SiweMessage({
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: '1'
      });
      return message.prepareMessage();
    }

    function connectWallet() {
      provider.send('eth_requestAccounts', [])
          .catch(() => console.log('user rejected request'));
    }

    async function signInWithEthereum() {
      const message = createSiweMessage(
          await signer.getAddress(),
          'Sign in with Ethereum to the app.'
      );
      console.log(await signer.signMessage(message));
    }

    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const siweBtn = document.getElementById('siweBtn');
    connectWalletBtn.onclick = connectWallet;
    siweBtn.onclick = signInWithEthereum;

  })
  return (
    <div className={styles.container}>
      <div>
        <Button variant="contained" id={'connectWalletBtn'}>Connect wallet</Button>
      </div>
      <div>
          <Button variant="contained" id={'siweBtn'}>Sign-in with Ethereum</Button>
      </div>
    </div>
  )
}

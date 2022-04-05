import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider'
import Loader from "../components/atoms/loader";
import ACard from "../components/organisms/ACard";
import Layout from "../components/templates/layout";
import tokenApi from "./api/tokenAbiQuiz.json"
import Survey from "../components/survey";


export default function Home() {
  const ropstenChainId = '0x3';
  const tokenAddressQUIZ = '0x74f0b668ea3053052deaa5eedd1815f579f0ee03';
  const [provider, setProvider] = useState();
  //const [signer, setSigner] = useState();
  const [detectingEthereum, setDetectingEthereum] = useState(true);
  const [hasMetamaskInstalled, setHasMetamaskInstalled] = useState();
  const [isConnectedToRopsten, setIsConnectedToRopsten] = useState();
  const [connectedWallet, setConnectedWallet] = useState();
  const [quizBalance, setQuizBalance] = useState();

  useEffect(function mount() {
    detectEthereum();
  }, [])

  useEffect(() => {
    if(connectedWallet){
      obtainBalance(connectedWallet)
    }
  }, [connectedWallet])

  useEffect(() => {
    if(provider){
      //setSigner(provider.getSigner());
      checkNetwork();
    }
  }, [provider])

  useEffect(() => {
    if(isConnectedToRopsten != undefined){
      setHasMetamaskInstalled(true);
    }
  }, [isConnectedToRopsten])

  useEffect(() => {
    if(hasMetamaskInstalled != undefined){
      setDetectingEthereum(false);
      if(hasMetamaskInstalled){
        window.ethereum
            .request({ method: 'eth_accounts' })
            .then(updateAccounts)
      }
    }
  }, [hasMetamaskInstalled])

  function updateAccounts(accounts){
    setConnectedWallet(accounts[0]);
  }

  async function obtainBalance(accountAddress){

    //TODO obtain from source, but of "corse" there's a cors block :)
    /*fetch("https://ratherlabs-challenges.s3.sa-east-1.amazonaws.com/survey-sample.json", {
      'mode': 'cors', 'headers': { 'Access-Control-Allow-Origin': '*', }})
        .then(res => res.json()).then(data => tokenApi = data);*/

    if(!provider || provider == undefined){
      await setNewProvider();
    }
    console.log(tokenApi)
    const contract = new ethers.Contract(tokenAddressQUIZ, tokenApi, provider);
    const balance = (await contract.balanceOf(accountAddress)).toString();
    setQuizBalance(balance);
  }

  function checkNetwork(){
    window.ethereum
        .request({ method: 'eth_chainId' })
        .then((chainId)=>{
          setIsConnectedToRopsten(chainId === ropstenChainId)
        })
  }


  function setNewProvider(){
    setProvider(new ethers.providers.Web3Provider(window.ethereum));
  }

  async function detectEthereum() {

    const detected = await detectEthereumProvider()

    if (detected) {
      window.ethereum.on("chainChanged", () => {
        setNewProvider();
      });
      window.ethereum.on("accountsChanged", updateAccounts);
      setNewProvider();
    } else {
      setHasMetamaskInstalled(false);
    }

  }

  async function changeNetwork() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ropstenChainId }],
        })
      } catch (error) {
        console.error(error);
      }
    }
  }

  function connectWallet() {
    provider.send('eth_requestAccounts', [])
        .catch(() => console.log('user rejected request'));
  }


  return (

    <Layout>
        {detectingEthereum ?
            <Loader />
        :
            <>{hasMetamaskInstalled ?
                  <div>
                    {isConnectedToRopsten ?
                        <>
                          {connectedWallet ?
                              <>
                                <ACard
                                    title={quizBalance}
                                    label={'$QUIZ balance'}
                                />
                                <Survey />
                              </>
                              :
                              <ACard
                                  label={'You need to connect a wallet to continue.'}
                                  buttonText={'Connect Wallet'}
                                  onClick={connectWallet}
                              />
                          }
                        </>:
                        <ACard
                            label={'You need to switch to the Ropsten Test Network to continue.'}
                            buttonText={'Switch to Ropsten'}
                            onClick={changeNetwork}
                        />
                    }
                  </div>
                  :
                  <ACard
                      label={'Refresh this page after installing Metamask.'}
                      buttonText={'Go to Metamask'}
                      href={'https://metamask.io/download/'}
                      target={'_blank'}
                  />
            }</>
        }
    </Layout>

  )
}

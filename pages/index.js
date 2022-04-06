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
  const [submittingQuestions, setSubmittingQuestions] = useState();
  const [submittedQuestions, setSubmittedQuestions] = useState();

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

  const submitQuestions = async (questions) => {

    setSubmittingQuestions(true);

    const hexData = ConvertStringToHex(JSON.stringify(questions));
    //TODO SUBMIT TO VALIDATOR CONTRACT
    //sendEths(quizContractAddress, connectedWallet, connectedWalletPrivateKey, 1, hexData);

    //TODO remove fake timeout & setSubmitteds inside success of sendEths
    setTimeout(()=> {

      console.error('No question was submitted as a contract. The success card is just a representation.')
      setSubmittingQuestions(false);
      setSubmittedQuestions(true);
    },1500)
  }


  function ConvertStringToHex(str) {
    var arr = [];
    for (var i = 0; i < str.length; i++) {
      arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return "\\u" + arr.join("\\u");
  }


  const sendEths = async ({
                            to,
                            from,
                            fromPrivateKey,
                            value,
                            data = null,
                            gasPrice = ethers.utils.hexlify(1000),
                            gasLimit = ethers.utils.hexlify(21000),
                          }) => {
    const txCount = await provider.getTransactionCount(from);
    // build the transaction
    const tx = new Tx({
      nonce: ethers.utils.hexlify(txCount),
      to,
      value: ethers.utils.parseEther(value).toHexString(),
      gasLimit,
      gasPrice,
      data
    });
    // sign the transaction
    tx.sign(Buffer.from(fromPrivateKey, "hex"));
    // send the transaction
    const { hash } = await provider.sendTransaction(
        "0x" + tx.serialize().toString("hex")
    );
    await provider.waitForTransaction(hash);
  };

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
                                      hint={{text: connectedWallet}}
                                  />
                                  {submittingQuestions || submittedQuestions ?
                                      <>
                                        {submittingQuestions ?
                                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                              <Loader />
                                            </div>
                                            :
                                            <ACard
                                                title={'✅'}
                                                label={'You have successfully submitted your answers and earned some $QUIZ tokens.'}
                                                hint={{text: 'Come back tomorrow to receive a new survey.'}}
                                            />
                                        }
                                      </>
                                      :
                                      <Survey submit={submitQuestions}/>
                                  }
                              </>
                              :
                              <ACard
                                  title={'🛑'}
                                  label={'You need to connect an unlocked wallet to continue.'}
                                  buttonText={'Connect Wallet'}
                                  onClick={connectWallet}
                              />
                          }
                        </>:
                        <ACard
                            title={'🌐'}
                            label={'You need to switch to the Ropsten Test Network to continue.'}
                            buttonText={'Switch to Ropsten'}
                            onClick={changeNetwork}
                        />
                    }
                  </div>
                  :
                  <ACard
                      title={'🛑'}
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

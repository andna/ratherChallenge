import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider'
import Loader from "../../components/atoms/loader";
import ACard from "../../components/organisms/ACard";
import Layout from "../../components/templates/layout";
import tokenApi from "../../pages/api/tokenAbiQuiz.json"
import Survey from "../../components/templates/survey";
const Tx = require('ethereumjs-tx')


export default function Connector({handleConnectedData, handleSubmittedQuestions}) {
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
    const [errorSubmitting, setErrorSubmitting] = useState();
    const [finishedSurvey, setFinishedSurvey] = useState();

    useEffect(function mount() {
        detectEthereum();
    }, [])

    useEffect(() => {
        if(connectedWallet && isConnectedToRopsten){
            obtainBalance()
        }
    }, [connectedWallet])

    useEffect(() => {
        if(provider){
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
        handleConnectedData({balance: quizBalance, address: accounts[0]});
        setConnectedWallet(accounts[0]);
    }

    async function obtainBalance(){

        if(!provider || provider == undefined){
            await setNewProvider();
        }
        const contract = new ethers.Contract(tokenAddressQUIZ, tokenApi, provider);
        const balance = (await contract.balanceOf(connectedWallet)).toString();
        handleConnectedData({balance: balance, address: connectedWallet});
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
        sendEths(tokenAddressQUIZ, connectedWallet, "0.001", hexData);

        //TODO remove fake timeout & setSubmitteds inside success of sendEths

    }


    function ConvertStringToHex(str) {
        var arr = [];
        for (var i = 0; i < str.length; i++) {
            arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
        }
        return "\\u" + arr.join("\\u");
    }


    const sendEths = async (
                                to,
                                from,
                                value,
                                data = null) => {


        const transactionParameters = {
            nonce: '0x00', // ignored by MetaMask
            gasPrice: ethers.utils.parseUnits("19000", "gwei").toHexString(), // customizable by user during MetaMask confirmation.
            gas: '0x2710',
            to: to, // Required except during contract publications.
            from: from, // must match user's active address.
            value: ethers.utils.parseEther(value).toHexString(), // Only required to send ether to the recipient from the initiating external account.
            data: data, // Optional, but used for defining smart contract creation and interaction.
            chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };

// txHash is a hex string
// As with any RPC call, it may throw an error
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        }).then(i => {
            console.log('aaa',i)
            obtainBalance();

            setSubmittingQuestions(false);
            setSubmittedQuestions(true);
            handleSubmittedQuestions(true);
        }).catch(e => {

            setErrorSubmitting(e?.message.replace("MetaMask Tx Signature: ", "Error: "));

            setSubmittingQuestions(false);
            setSubmittedQuestions(false);
        });
    };

    return (

        <>
            {detectingEthereum ?
                <Loader />
                :
                <>{hasMetamaskInstalled ?
                    <div>
                        {isConnectedToRopsten ?
                            <>
                                {connectedWallet ?
                                    <>
                                        {!submittedQuestions &&
                                            <>
                                                {submittingQuestions ?
                                                    <div style={{display: 'flex', justifyContent: 'center'}}>
                                                        <Loader />
                                                    </div>
                                                    :
                                                    <>
                                                        {errorSubmitting ?
                                                            <ACard
                                                                title={'🛑'}
                                                                label={errorSubmitting}
                                                                buttonText={'Try Again'}
                                                                onClick={() => setErrorSubmitting(false)}
                                                            />
                                                            :
                                                            <Survey submit={submitQuestions}
                                                                    setFinishedSurvey={setFinishedSurvey}
                                                                    finishedSurvey={finishedSurvey}/>
                                                        }
                                                    </>


                                                }
                                            </>
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
                        title={'🔄'}
                        label={'Refresh this page after installing Metamask.'}
                        buttonText={'Go to Metamask'}
                        href={'https://metamask.io/download/'}
                        target={'_blank'}
                    />
                }</>
            }
        </>

    )
}

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Button, Col, Form, Container, Row } from "react-bootstrap";
import './App.css';
import logo from './rsk-logo.png';
import AcademyWallet from "./contracts/AcademyWallet.json";

function App() {
  const [account, setAccount] = useState('');
  const [academyWallet, setAcademyWallet] = useState(null);

  const [inputBalanceOfAddress, setInputBalanceOfAddress] = useState();
  const [balanceOf, setBalanceOf] = useState();

  useEffect(() => {
    async function loadWeb3() {      
      //window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          'Non-Ethereum browser detected. You should consider trying MetaMask!',
        );
      }
      console.log (window.web3.currentProvider);
    }
    
    async function loadBlockchainData() {
      try {
        const web3 = window.web3;
       
        // Load first account
        const [account] = await web3.eth.getAccounts();
        console.log ('account: ', account);
        setAccount(account);

        // Check which network is active on web3
        const networkId = await web3.eth.net.getId();
        console.log ('networkId: ', networkId);

        // Check if the contract has been published on that network
        var networkData = AcademyWallet.networks[networkId];        
        if (networkData) {
          console.log ('AcademyWallet address: ', networkData.address);
          var contract = new web3.eth.Contract(
            AcademyWallet.abi,
            networkData.address,
          );
          setAcademyWallet(contract);

        } else {
          window.alert('Smart contract not deployed to detected network.');
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadWeb3().then(() => loadBlockchainData());
  }, []);
   
  function getBalanceOf(e) {
    e.preventDefault();

    console.log ('inputBalanceOfAddress: ', inputBalanceOfAddress);
    try {
      academyWallet.methods
      .balanceOf(inputBalanceOfAddress.toLowerCase()).call()
      .then( function(res) {
        console.log ('res: ', res);
        setBalanceOf(res);
        setInputBalanceOfAddress();
      })
      .catch(err => window.alert(err.message));
    }
    catch (err) {
      window.alert(err.message);
    }
  };  
  
  return (
    //<img src={logo} className="App-logo" alt="logo" />
    <Container>
      <div className="App">
        <img src={logo} className="App-logo-static" alt="logo" />

        <div>
          <h1>RSK Academy wallet</h1>
          {academyWallet && <p>Wallet Address: {academyWallet._address}</p>}
          {account && <p>Your account: {account}</p>}
        </div>

        <Row>
          <Col>
            <Form onSubmit={getBalanceOf}>
              <Form.Group controlId="formGetBalanceOfAddress">
              <Form.Label>Balance for address</Form.Label>
                <Form.Control placeholder="Address"
                  onChange={e => setInputBalanceOfAddress(e.target.value)}
                  value={inputBalanceOfAddress}
                />
              </Form.Group>                  
              <Button type="submit">Get balance</Button>
            </Form>
            {balanceOf && <p>Value: {balanceOf}</p>}          
          </Col>
        </Row>
      </div>
      
      <br/>
      <br/>
    </Container>

  );
}

export default App;

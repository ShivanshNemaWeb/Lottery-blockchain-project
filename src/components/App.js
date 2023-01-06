import React, { useEffect } from "react";
import { useState } from "react";
import Web3 from "web3";
import lottery from "../truffle_abis/lottery.json";
const App=()=>{
    const [account,setAccount]=useState("");
    const [lotteryContract,setLotteryContract]=useState({});
    const [amount,setAmount]=useState("");
    const [manager,setManager]=useState("");
    const [balance,setBalance]=useState("");
    const injectWeb3=async()=>{
        if(window.ethereum){
            window.web3= new Web3(window.ethereum);
            await window.ethereum.eth_requestAccounts;
           }
           else if(window.web3){
             window.web3=new Web3(window.web3.currentProvider);
           }
           else{
             window.alert("System has no MetaMask");
           }
    }
    const getContracts=async()=>{
        const web3=window.web3;
        const accounts=await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const networkId=await web3.eth.net.getId();
        const LotteryData= lottery.networks[networkId];
        if(LotteryData){
            const lotteryCon=new web3.eth.Contract(lottery.abi,LotteryData.address); 
            console.log(lotteryCon);
            setLotteryContract(lotteryCon);
            setManager(await lotteryCon.methods.manager().call());
            setBalance(await web3.eth.getBalance(lotteryCon._address));
        }
        else{
            window.alert("Lottery contract not deployed");
        }
    }
    useEffect(async()=>{
     await injectWeb3();
     await getContracts();
    },[])
    return (
         <>
         <div style={{backgroundColor:"darkseagreen",width:"100%",height:"100vh",position:"absolute"}}>
            
         
         <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",marginTop:"10%",position:"relative  "}}>
            <h1 className="text-success">Lottery Contest !</h1>
           <h3 className="text-danger">Account:</h3><span><p className="text-dark">{account}</p></span>
           <div>
                <p className="text-white background-primary">Participate into the lottery contest by entering the amount and get a chance to win <span className="text-dark">
                {Web3.utils.fromWei(balance,'ether')} Ethers</span></p>
            </div>

            <input type="text" name="amount" value={amount} onChange={(e)=>{
                setAmount(e.target.value);
            }}/>
            <div className="buttons mt-3">
                <button type="" className="btn btn-primary m-3" onClick={async(e)=>{
                    e.preventDefault();
                  await lotteryContract.methods.enter().send({from:account,value:Web3.utils.toWei(amount,'ether')}).on("transactionHash",async(hash)=>{
                    console.log("Entered In a Lottery");
                  });
                }}>Enter</button>
                <button type="" className="btn btn-success" onClick={async()=>{
                    await lotteryContract.methods.pickWinner().send({from: manager}).on("TransactionHash",()=>{
                        console.log("winner has been picked");  
                    });
                }}>Pick Winner</button>
            </div>
         </div>
         </div>
         </>
    )
}
export default App;
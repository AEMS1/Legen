const connectWalletBtn = document.getElementById("connectWallet");
const walletAddressDisplay = document.getElementById("walletAddress");
const tokenPriceSpan = document.getElementById("tokenPrice");
const shipPriceSpan = document.getElementById("shipPrice");
const buyShipBtn = document.getElementById("buyShipBtn");

const tokenAddress = "0x4751C0DE56EFB3770615097347cbF131D302498A";
const ownerWallet = "0xec54951C7d4619256Ea01C811fFdFa01A9925683";
const shipPriceUSD = 0.5;
let userAddress;

const tokenABI = [...]; // اینجا ABI توکن رو قرار بده

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];
      walletAddressDisplay.innerText = Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)};
      await getTokenPrice();
    } catch (err) {
      alert("Wallet connection failed.");
    }
  } else {
    alert("Please install MetaMask.");
  }
}

async function getTokenPrice() {
  try {
    const response = await fetch(https://api.coingecko.com/api/v3/simple/token_price/bsc?contract_addresses=${tokenAddress}&vs_currencies=usd);
    const data = await response.json();
    const tokenPrice = data[tokenAddress.toLowerCase()].usd;
    const tokenAmount = (shipPriceUSD / tokenPrice).toFixed(2);
    tokenPriceSpan.innerText = $${tokenPrice};
    shipPriceSpan.innerText = ${tokenAmount} Tokens;
    return tokenAmount;
  } catch (err) {
    tokenPriceSpan.innerText = "Unavailable";
    shipPriceSpan.innerText = "-";
    return null;
  }
}

async function buyShip() {
  if (!userAddress) return alert("Connect your wallet first.");
  const tokenAmount = await getTokenPrice();
  if (!tokenAmount) return;

  const web3 = new Web3(window.ethereum);
  const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
  const decimals = await tokenContract.methods.decimals().call();
  const amountToSend = BigInt(Math.floor(tokenAmount * 10 ** decimals));

  try {
    await tokenContract.methods.transfer(ownerWallet, amountToSend.toString()).send({ from: userAddress });
    alert("Ship purchased successfully!");
  } catch (err) {
    alert("Transaction failed.");
  }
}

connectWalletBtn.addEventListener("click", connectWallet);
buyShipBtn.addEventListener("click", buyShip);
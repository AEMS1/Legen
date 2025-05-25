const LGD_TOKEN_ADDRESS = "0x4751C0DE56EFB3770615097347cbF131D302498A";
const BSC_RPC = "https://bsc-dataseed.binance.org/";

const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);

let wallet;
let lgdContract;

async function createWallet() {
  const randomWallet = ethers.Wallet.createRandom();
  wallet = randomWallet.connect(provider);

  localStorage.setItem("userAddress", wallet.address);
  localStorage.setItem("userPrivateKey", wallet.privateKey);

  document.getElementById("userAddress").innerText = wallet.address;
  document.getElementById("userPrivateKey").innerText = wallet.privateKey;

  await updateBalances();

  lgdContract = new ethers.Contract(LGD_TOKEN_ADDRESS, LGD_ABI, wallet);
}

async function updateBalances() {
  if (!wallet) return;

  const bnbBalance = await provider.getBalance(wallet.address);
  document.getElementById("bnbBalance").innerText = ethers.utils.formatEther(bnbBalance).slice(0, 6);

  const tokenContract = new ethers.Contract(LGD_TOKEN_ADDRESS, LGD_ABI, provider);
  const balance = await tokenContract.balanceOf(wallet.address);
  const decimals = await tokenContract.decimals();
  const formatted = ethers.utils.formatUnits(balance, decimals);
  document.getElementById("lgdBalance").innerText = parseFloat(formatted).toFixed(2);
}
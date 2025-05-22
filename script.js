// اتصال به کیف پول و بررسی وضعیت async function connectWallet() { if (window.ethereum) { try { const accounts = await ethereum.request({ method: 'eth_requestAccounts' }); const walletAddress = accounts[0]; document.getElementById('wallet-address').innerText = Connected: ${walletAddress}; checkIfAdmin(walletAddress); } catch (error) { console.error("User rejected request"); } } else { alert("Please install MetaMask!"); } }

// بررسی اینکه آیا کیف پول مدیر است یا خیر function checkIfAdmin(address) { const ownerAddress = '0xec54951C7d4619256Ea01C811fFdFa01A9925683'; if (address.toLowerCase() === ownerAddress.toLowerCase()) { document.getElementById('admin-panel').style.display = 'block'; } }

// محاسبه مقدار شرط function calculateBet() { const multiplier = parseInt(document.getElementById('bet-multiplier').value); const amount = parseInt(document.getElementById('bet-amount').value);

const minimums = { 1: 10000, 2: 15000, 3: 20000, 4: 25000, 5: 30000 };

if (amount < minimums[multiplier]) { alert(Minimum for multiplier ${multiplier} is ${minimums[multiplier]} LGD tokens.); return; }

placeBet(multiplier, amount); }

// ارسال تراکنش برای شرط بندی async function placeBet(multiplier, amount) { const tokenContractAddress = '0x4751C0DE56EFB3770615097347cbF131D302498A'; const gameContractAddress = '0xYourSmartContractAddressHere'; // جایگزین شود با آدرس واقعی const fee = amount * 0.01; // 1 درصد کارمزد const netAmount = amount - fee;

try { const provider = new ethers.providers.Web3Provider(window.ethereum); const signer = provider.getSigner();

const tokenABI = [
  "function transfer(address to, uint amount) public returns (bool)",
  "function balanceOf(address owner) view returns (uint)"
];

const token = new ethers.Contract(tokenContractAddress, tokenABI, signer);
await token.transfer(gameContractAddress, amount);

alert(Bet placed successfully with ${netAmount} LGD and multiplier ${multiplier});

} catch (err) { console.error(err); alert("Transaction failed"); } }

// قیمت زنده برای نمایش async function getLivePrice(symbol) { try { const response = await fetch(https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd); const data = await response.json(); document.getElementById(${symbol}-price).innerText = $${data[symbol].usd}; } catch (e) { console.error("Error fetching price", e); } }

// اجرای اولیه برای نرخ زنده function initLivePrices() { ['bitcoin', 'ethereum', 'binancecoin', 'dogecoin', 'polkadot', 'baby-doge-coin'].forEach(token => { getLivePrice(token); }); }

window.onload = initLivePrices;

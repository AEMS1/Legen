// مدیریت کیف پول کاربر داخل سایت (کلید خصوصی، موجودی، برداشت)
// بدون اتصال به MetaMask یا کیف پول خارجی (کیف پول ساده و درون‌سایتی)

let userWallet = null;  // {privateKey, address}
const entryFee = 10000; // ورودی بازی با توکن LGD
const contractOwner = "0xeD2952010b50480F4Cc5829d8e29A1E499f30c74"; // کیف پول سایت (برای دریافت ورودی)

const Web3 = window.Web3;
const web3 = new Web3("https://bsc-dataseed.binance.org/");

const lgdToken = new web3.eth.Contract(tokenABI, tokenAddress);

function generateWallet() {
  const newAccount = web3.eth.accounts.create();
  userWallet = newAccount;
  document.getElementById("privateKey").value = newAccount.privateKey;
  updateBalances();
}

async function updateBalances() {
  if (!userWallet) return;
  const address = userWallet.address;
  try {
    const balanceLGD = await lgdToken.methods.balanceOf(address).call();
    const decimals = await lgdToken.methods.decimals().call();
    const balanceBNB = await web3.eth.getBalance(address);

    document.getElementById("lgdBalance").textContent = (balanceLGD / (10 ** decimals)).toFixed(4);
    document.getElementById("bnbBalance").textContent = web3.utils.fromWei(balanceBNB, "ether");
  } catch (err) {
    console.error("Error updating balances:", err);
  }
}

async function withdrawTokens() {
  if (!userWallet) {
    alert("You have no wallet generated.");
    return;
  }

  const amountStr = prompt("Enter amount of LGD to withdraw:");
  if (!amountStr) return;
  const amount = Number(amountStr);
  if (isNaN(amount) || amount <= 0) {
    alert("Invalid amount");
    return;
  }

  try {
    // تو این پروژه چون قرارداد بازی و برداشت جداست و ما کنترل نداریم،
    // فقط آدرس برداشت را نمایش می‌دهیم.
    alert(To withdraw ${amount} LGD, please use a wallet like MetaMask and send from your site's wallet address:\n${userWallet.address});
  } catch (err) {
    alert("Error during withdraw: " + err.message);
  }
}

// ساخت کیف پول در بارگذاری صفحه
window.onload = () => {
  generateWallet();

  document.getElementById("withdrawBtn").onclick = withdrawTokens;

  // آپدیت موجودی هر 20 ثانیه
  setInterval(updateBalances, 20000);
};
// آدرس‌ها
const contractAddress = "0x4751C0DE56EFB3770615097347cbF131D302498A";
const ownerWallet = "0xec54951C7d4619256Ea01C811fFdFa01A9925683";

// اتصال به کیف پول
let userAccount;
async function connectWallet() {
  if (window.ethereum) {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    userAccount = accounts[0];
    document.getElementById("walletAddress").innerText = "Connected: " + userAccount;
    checkAdmin();
  } else {
    alert("Please install MetaMask.");
  }
}

// اتصال به Web3 و قرارداد
const web3 = new Web3(window.ethereum);
const tokenContract = new web3.eth.Contract(tokenABI, contractAddress);

// چک کردن اگر ادمین هست
function checkAdmin() {
  if (userAccount.toLowerCase() === ownerWallet.toLowerCase()) {
    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) adminPanel.style.display = "block";
  }
}

// خرید سفینه
async function buyShip(tokenAmount) {
  try {
    await tokenContract.methods.buyShip().send({
      from: userAccount,
      value: 0, // خرید با توکن، نه BNB
    });
    alert("Ship purchased!");
  } catch (error) {
    alert("Transaction failed.");
  }
}

// ارتقاء سفینه
async function upgradeShip(level) {
  try {
    await tokenContract.methods.upgradeShip(level).send({
      from: userAccount,
    });
    alert("Ship upgraded!");
  } catch (err) {
    alert("Upgrade failed.");
  }
}

// وارد شدن به مسابقه
async function enterMatch(matchType) {
  try {
    let tokenAmount = 0;

    if (matchType === "1v1") tokenAmount = 100000;
    else if (matchType === "2v2") tokenAmount = 200000;
    else if (matchType === "3v3") tokenAmount = 300000;

    await tokenContract.methods.enterMatch(matchType).send({
      from: userAccount,
    });

    alert("Entered match!");
  } catch (e) {
    alert("Failed to enter match.");
  }
}

// تغییر قیمت‌ها فقط برای ادمین
async function setPrices(entryFee, shipPrice, upgradeCost) {
  if (userAccount.toLowerCase() !== ownerWallet.toLowerCase()) return alert("Not admin");

  try {
    await tokenContract.methods.setPrices(entryFee, shipPrice, upgradeCost).send({
      from: userAccount,
    });
    alert("Prices updated.");
  } catch (e) {
    alert("Failed to update prices.");
  }
}

// گرفتن قیمت زنده از پنکیک‌سوآپ (BSCScan یا API دیگر)
async function getLivePrice() {
  // برای پروژه نهایی نیاز به API خارجی هست که باید از سرور جدا بخونی (نمی‌شه مستقیم از JS چون CORS می‌زنه)
  document.getElementById("livePrice").innerText = "1 TOKEN ≈ $0.012"; // ثابت یا از API خوانده شده
}

// لود اولیه
window.addEventListener("load", () => {
  if (window.ethereum) {
    connectWallet();
    getLivePrice();
  }
});
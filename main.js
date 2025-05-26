const connectButton = document.getElementById("connectButton");
const walletAddressSpan = document.getElementById("walletAddress");
const bnbBalanceSpan = document.getElementById("bnbBalance");
const lgdBalanceSpan = document.getElementById("lgdBalance");
const walletInfoDiv = document.getElementById("walletInfo");
const sendForm = document.getElementById("sendForm");
const tokenSelect = document.getElementById("tokenSelect");
const recipientInput = document.getElementById("recipient");
const amountInput = document.getElementById("amount");
const statusP = document.getElementById("status");

// قرارداد توکن LGD (BEP20 استاندارد ERC20)
const LGD_CONTRACT_ADDRESS = "0x4751C0DE56EFB3770615097347cbF131D302498A";
// ABI ساده ERC20 فقط با توابع balanceOf و transfer
const LGD_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

let provider;
let signer;
let lgdContract;

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask!");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const address = await signer.getAddress();

    walletAddressSpan.textContent = address;
    walletInfoDiv.style.display = "block";

    lgdContract = new ethers.Contract(LGD_CONTRACT_ADDRESS, LGD_ABI, signer);

    await updateBalances(address);

    statusP.textContent = "Wallet connected.";
    connectButton.disabled = true;

    // به روز رسانی موجودی هر بار که حساب تغییر کند
    window.ethereum.on("accountsChanged", async (accounts) => {
      if (accounts.length === 0) {
        walletInfoDiv.style.display = "none";
        connectButton.disabled = false;
        statusP.textContent = "Wallet disconnected.";
      } else {
        walletAddressSpan.textContent = accounts[0];
        await updateBalances(accounts[0]);
        statusP.textContent = "Account changed.";
      }
    });
  } catch (err) {
    console.error(err);
    statusP.textContent = "Error connecting wallet.";
  }
}

async function updateBalances(address) {
  try {
    // موجودی BNB
    const balanceBNB = await provider.getBalance(address);
    bnbBalanceSpan.textContent = ethers.utils.formatEther(balanceBNB) + " BNB";

    // موجودی توکن LGD
    const balanceLGD = await lgdContract.balanceOf(address);
    // فرض بر اینکه توکن LGD دارای 18 رقم اعشار است
    lgdBalanceSpan.textContent = ethers.utils.formatUnits(balanceLGD, 18) + " LGD";
  } catch (err) {
    console.error(err);
    statusP.textContent = "Error fetching balances.";
  }
}

async function sendTokens(event) {
  event.preventDefault();
  const token = tokenSelect.value;
  const recipient = recipientInput.value.trim();
  const amount = amountInput.value.trim();

  if (!ethers.utils.isAddress(recipient)) {
    alert("Invalid recipient address.");
    return;
  }
  if (parseFloat(amount) <= 0) {
    alert("Amount must be greater than zero.");
    return;
  }

  statusP.textContent = "Sending transaction...";

  try {
    if (token === "bnb") {
      // ارسال BNB
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount)
      });
      await tx.wait();
      statusP.textContent = "BNB sent successfully!";
    } else if (token === "lgd") {
      // ارسال توکن LGD
      const amountBN = ethers.utils.parseUnits(amount, 18);
      const tx = await lgdContract.transfer(recipient, amountBN);
      await tx.wait();
      statusP.textContent = "LGD tokens sent successfully!";
    }
    // بروزرسانی موجودی بعد از ارسال
    const address = await signer.getAddress();
    await updateBalances(address);
  } catch (err) {
    console.error(err);
    statusP.textContent = "Transaction failed or rejected.";
  }
}

connectButton.addEventListener("click", connectWallet);
sendForm.addEventListener("submit", sendTokens);
const referralContractAddress = "0xaea58b45d91a2ef408904ed05d309f82315723b6";
const tokenAddress = "0x98587e72e0a51eba363d1b64b9f7a483db08edc1";
const ownerAddress = "0xec54951C7d4619256Ea01C811fFdFa01A9925683"; // جایگزین کن با آدرس خودت

const referralABI = [
  {
    "inputs": [{"internalType": "address", "name": "inviter", "type": "address"}],
    "name": "registerReferral",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "confirmAndReward",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

let web3;
let account;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    document.getElementById("wallet").innerText = account;
    contract = new web3.eth.Contract(referralABI, referralContractAddress);

    const url = new URL(window.location.href);
    const inviter = url.searchParams.get("ref");

    if (inviter) {
      try {
        await contract.methods.registerReferral(inviter).send({ from: account });
        console.log("Referral ثبت شد.");
      } catch (err) {
        console.warn("Referral ممکن است قبلاً ثبت شده باشد.");
      }
    }
  } else {
    alert("لطفاً MetaMask را نصب کنید.");
  }
}

function copyReferral() {
  if (!account) return alert("اول کیف پول را متصل کنید.");
  const link = `${window.location.origin}${window.location.pathname}?ref=${account}`;
  navigator.clipboard.writeText(link);
  alert("لینک کپی شد:\n" + link);
}

async function sendBNB() {
  if (!contract || !account) return alert("اول کیف پول را متصل کنید.");

  const value = web3.utils.toWei("0.000015", "ether");

  try {
    await contract.methods.confirmAndReward().send({
      from: account,
      value: value
    });
    document.getElementById("status").innerText = "✅ پاداش با موفقیت دریافت شد.";
  } catch (err) {
    document.getElementById("status").innerText = "❌ عملیات انجام نشد.";
    console.error(err);
  }
}

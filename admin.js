let web3, contract, user;

const contractAddress = "0x81811cf143ee0db0f31508640b5ab164efbc353a"; // آدرس قرارداد مزایده
const contractABI = [
  {
    "inputs": [],
    "name": "buyVIP",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint8", "name": "auctionId", "type": "uint8" }
    ],
    "name": "joinAuction",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "isVIP",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVIPExpireTime",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint8", "name": "auctionId", "type": "uint8" }],
    "name": "getAuctionData",
    "outputs": [
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "uint256", "name": "rewardAmount", "type": "uint256" },
      { "internalType": "address[]", "name": "users", "type": "address[]" },
      { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint8", "name": "auctionId", "type": "uint8" },
      { "internalType": "uint256", "name": "reward", "type": "uint256" }
    ],
    "name": "setAuctionReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_vipPrice", "type": "uint256" }],
    "name": "setVIPPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint8", "name": "auctionId", "type": "uint8" }],
    "name": "resetAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

window.onload = async function () {
  if (!window.ethereum) return alert("لطفاً Metamask نصب کنید.");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  user = accounts[0];
  document.getElementById("adminAddress").innerText = user;
  contract = new web3.eth.Contract(contractABI, contractAddress);
};

async function updateConfig() {
  const reward30 = document.getElementById("reward30Input").value;
  const reward60 = document.getElementById("reward60Input").value;
  const maxBid = document.getElementById("maxBidInput").value;

  try {
    await contract.methods.setRewards(reward30, reward60).send({ from: user });
    await contract.methods.setMaxBid(web3.utils.toWei(maxBid, "ether")).send({ from: user });
    document.getElementById("status").innerText = "✅ تنظیمات با موفقیت ذخیره شد.";
  } catch (e) {
    console.error(e);
    document.getElementById("status").innerText = "❌ خطا در ذخیره تنظیمات.";
  }
}

async function resetAuctions() {
  try {
    await contract.methods.resetAllAuctions().send({ from: user });
    document.getElementById("status").innerText = "✅ مزایده‌ها ریست شدند.";
  } catch (e) {
    console.error(e);
    document.getElementById("status").innerText = "❌ خطا در ریست مزایده.";
  }
}

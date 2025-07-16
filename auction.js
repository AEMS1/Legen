let web3, contract, user;

const contractAddress = "0x81811cf143ee0db0f31508640b5ab164efbc353a"; // آدرس قرارداد شما

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("لطفاً Metamask را نصب کنید.");
    return;
  }
  await ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  user = accounts[0];
  document.getElementById("wallet").innerText = "🔗 Wallet: " + user;
  contract = new web3.eth.Contract(vipAbi, contractAddress);
  checkVIP();
  loadBids();
}

async function checkVIP() {
  const expiry = await contract.methods.vipExpiry(user).call();
  const now = Math.floor(Date.now() / 1000);
  if (expiry > now) {
    document.getElementById("vipStatus").innerText = "🎖️ VIP فعال است تا " + new Date(expiry * 1000).toLocaleString();
    document.getElementById("auctionPanel").style.display = "block";
  } else {
    document.getElementById("vipStatus").innerText = "❌ VIP فعال نیست";
  }
}

async function buyVIP() {
  const price = web3.utils.toWei("0.003", "ether");
  await contract.methods.buyVIP().send({ from: user, value: price });
  alert("VIP با موفقیت خریداری شد!");
  checkVIP();
}

async function placeBid(days) {
  const amount = document.getElementById("bid" + days).value;
  if (!amount) return alert("مقدار را وارد کنید.");
  const wei = web3.utils.toWei(amount, "ether");
  const method = days === 30 ? "placeBid30" : "placeBid60";
  await contract.methods[method]().send({ from: user, value: wei });
  alert("با موفقیت در مزایده شرکت کردید.");
  loadBids();
}

async function loadBids() {
  const bids30 = await contract.methods.getBids30().call();
  const bids60 = await contract.methods.getBids60().call();
  const r30 = await contract.methods.reward30().call();
  const r60 = await contract.methods.reward60().call();
  document.getElementById("reward30").innerText = web3.utils.fromWei(r30) + " توکن";
  document.getElementById("reward60").innerText = web3.utils.fromWei(r60) + " توکن";

  const formatBids = (bids) =>
    bids.map(b => `${b.bidder.slice(0, 6)}...${b.bidder.slice(-4)} - 💸 ${web3.utils.fromWei(b.amount)} BNB`).join("<br>");

  document.getElementById("bids30").innerHTML = formatBids(bids30);
  document.getElementById("bids60").innerHTML = formatBids(bids60);

  try {
    const winners30 = await contract.methods.getWinners30().call();
    const winners60 = await contract.methods.getWinners60().call();
    document.getElementById("winners").innerHTML =
      `<b>🔵 30 روزه:</b><br>${winners30.join("<br>")}<br><b>🔵 60 روزه:</b><br>${winners60.join("<br>")}<br><i>🎁 جوایز ظرف 1 روز ارسال می‌شوند</i>`;
  } catch { }
}

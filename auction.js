// فایل auction.js - شامل کل منطق مزایده

let auction30 = [];
let auction60 = [];
let vipUsers = {}; // آدرس + timestamp انقضا
let reward30 = 10000;
let reward60 = 30000;
let minBid30 = 0.01; // BNB
let minBid60 = 0.01; // BNB
let vipDuration = 65 * 24 * 3600 * 1000; // 65 روز
const ownerAddress = "0xec54951C7d4619256Ea01C811fFdFa01A9925683";

function isVIP() {
  const now = Date.now();
  return vipUsers[userAddress] && vipUsers[userAddress] > now;
}

async function buyVIP() {
  const oneDollarBNB = web3.utils.toWei("0.003", "ether"); // حدود 1 دلار
  try {
    await web3.eth.sendTransaction({ from: userAddress, to: ownerAddress, value: oneDollarBNB });
    vipUsers[userAddress] = Date.now() + vipDuration;
    alert("🎉 شما VIP شدید و می‌توانید در مزایده شرکت کنید!");
    showAuctionPanel();
  } catch (e) {
    alert("❌ خطا در پرداخت: " + e.message);
  }
}

function showAuctionPanel() {
  if (!isVIP()) {
    document.getElementById("auctionPanel").innerHTML =
      `<button onclick="buyVIP()">خرید VIP با 1 دلار BNB</button>`;
    return;
  }

  const html = `
    <h3>🔹 مزایده 30 روزه - جایزه: ${reward30} توکن</h3>
    <input id="bid30" type="number" placeholder="مقدار BNB">
    <button onclick="submitBid(30)">شرکت در مزایده</button>
    <div id="list30"></div>
    
    <h3>🔸 مزایده 60 روزه - جایزه: ${reward60} توکن</h3>
    <input id="bid60" type="number" placeholder="مقدار BNB">
    <button onclick="submitBid(60)">شرکت در مزایده</button>
    <div id="list60"></div>
  `;
  document.getElementById("auctionPanel").innerHTML = html;
  updateBidList();
}

async function submitBid(type) {
  const bidValue = parseFloat(document.getElementById(`bid${type}`).value);
  if (!bidValue || bidValue < (type === 30 ? minBid30 : minBid60)) return alert("مقدار کافی نیست");
  const valueWei = web3.utils.toWei(bidValue.toString(), "ether");
  try {
    await web3.eth.sendTransaction({ from: userAddress, to: ownerAddress, value: valueWei });
    const bid = { addr: userAddress, amount: bidValue };
    if (type === 30) auction30.push(bid);
    else auction60.push(bid);
    updateBidList();
  } catch (e) {
    alert("❌ خطا در پرداخت: " + e.message);
  }
}

function updateBidList() {
  const sortDesc = list => list.sort((a, b) => b.amount - a.amount);
  const list30HTML = sortDesc([...auction30])
    .map(x => `<div>${x.addr} — ${x.amount} BNB</div>`).join("");
  const list60HTML = sortDesc([...auction60])
    .map(x => `<div>${x.addr} — ${x.amount} BNB</div>`).join("");
  document.getElementById("list30").innerHTML = list30HTML;
  document.getElementById("list60").innerHTML = list60HTML;
}

function resetAuctions() {
  auction30 = [];
  auction60 = [];
}

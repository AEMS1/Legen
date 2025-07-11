let provider, signer, userAddress;
const owner = "0xec54951C7d4619256Ea01C811fFdFa01A9925683";
const contractAddress = "0xab8cbbba46ebc7ae38b6be977b774f3dc42c4262"; // Auction contract
const tokenAddress = "0x887ada8fe79740b913De549f81014f37e2f8D07a"; // AMS token

let contract, tokenContract;

async function connectWallet() {
    if (typeof window.ethereum === "undefined") return alert("Please install MetaMask!");
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();
    contract = new ethers.Contract(contractAddress, auctionAbi, signer);
    tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
    document.getElementById("connectWalletBtn").innerText = userAddress.slice(0, 6) + "..." + userAddress.slice(-4);
    checkAccess();
}

async function checkAccess() {
    const hasAccess = await contract.hasAuctionAccess(userAddress);
    if (hasAccess) {
        document.getElementById("access-section").style.display = "none";
        document.getElementById("auction-section").style.display = "block";
        startTimers();
        loadTopParticipants();
    }
}

async function buyAccess() {
    const entryFee = await contract.entryFee();
    const tx1 = await tokenContract.approve(contractAddress, entryFee);
    await tx1.wait();
    const tx2 = await contract.buyAuctionAccess();
    await tx2.wait();
    alert("Access granted!");
    checkAccess();
}

async function bidOnce(days) {
    const amountInput = document.getElementById(`bidAmount${days}`);
    const bnbAmount = ethers.parseEther(amountInput.value);
    const minRequired = await contract[`minBnb${days}`]();
    if (bnbAmount < minRequired) return alert(`Minimum BNB required: ${ethers.formatEther(minRequired)}`);
    const tx = await contract[`bid${days}`]({ value: bnbAmount });
    await tx.wait();
    alert("Bid submitted!");
    amountInput.value = "";
    loadTopParticipants();
}

async function loadTopParticipants() {
    for (const day of [30, 60]) {
        const top = await contract[`getTopParticipants${day}`]();
        const list = document.getElementById(`top3List${day}`);
        list.innerHTML = "";
        top.forEach((p, i) => {
            const li = document.createElement("li");
            li.textContent = `#${i + 1} ${p.addr.slice(0, 6)}... (${ethers.formatEther(p.amount)} BNB)`;
            list.appendChild(li);
        });
    }
}

function startTimers() {
    updateTimer(30);
    updateTimer(60);
    setInterval(() => {
        updateTimer(30);
        updateTimer(60);
    }, 1000);
}

async function updateTimer(days) {
    const end = await contract[`endTime${days}`]();
    const now = Math.floor(Date.now() / 1000);
    let diff = end - now;
    const timer = document.getElementById(`timer${days}`);
    if (diff <= 0) {
        timer.textContent = "Ended";
        return;
    }
    const d = Math.floor(diff / 86400);
    diff %= 86400;
    const h = Math.floor(diff / 3600);
    diff %= 3600;
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    timer.textContent = `${d}d ${h}h ${m}m ${s}s`;
}

// Events
document.getElementById("connectWalletBtn").onclick = connectWallet;
document.getElementById("buyAccessBtn").onclick = buyAccess;
document.getElementById("bidBtn30").onclick = () => bidOnce(30);
document.getElementById("bidBtn60").onclick = () => bidOnce(60);

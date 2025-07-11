let provider, signer, contract;
const contractAddress = "0xab8cbbba46ebc7ae38b6be977b774f3dc42c4262";
const owner = "0xec54951C7d4619256Ea01C811fFdFa01A9925683";

async function initAdmin() {
    if (typeof window.ethereum === "undefined") return alert("Install MetaMask");
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const addr = await signer.getAddress();
    if (addr.toLowerCase() !== owner.toLowerCase()) return alert("Not authorized");

    contract = new ethers.Contract(contractAddress, auctionAbi, signer);
    loadTop();
}

async function loadTop() {
    for (const day of [30, 60]) {
        const top = await contract[`getTopParticipants${day}`]();
        const list = document.getElementById(`top3Admin${day}`);
        list.innerHTML = "";
        top.forEach((p, i) => {
            const li = document.createElement("li");
            li.textContent = `#${i + 1} ${p.addr.slice(0, 6)}... (${ethers.formatEther(p.amount)} BNB)`;
            list.appendChild(li);
        });
    }
}

async function updateEntryFee() {
    const val = document.getElementById("newEntryFee").value;
    const tx = await contract.setEntryFee(ethers.parseUnits(val, 18));
    await tx.wait();
    alert("Entry fee updated!");
}

async function updateReward(day) {
    const val = document.getElementById(`rewardInput${day}`).value;
    const tx = await contract[`setReward${day}`](ethers.parseUnits(val, 18));
    await tx.wait();
    alert(`Reward ${day}-day updated!`);
}

async function updateMinBnb(day) {
    const val = document.getElementById(`minInput${day}`).value;
    const tx = await contract[`setMinBnb${day}`](ethers.parseEther(val));
    await tx.wait();
    alert(`Min BNB ${day}-day updated!`);
}

async function resetAuction(day) {
    const tx = await contract[`resetAuction${day}`]();
    await tx.wait();
    alert(`Auction ${day}-day reset!`);
}

// Events
window.onload = initAdmin;
document.getElementById("updateEntryFeeBtn").onclick = updateEntryFee;
document.getElementById("updateReward30").onclick = () => updateReward(30);
document.getElementById("updateReward60").onclick = () => updateReward(60);
document.getElementById("updateMin30").onclick = () => updateMinBnb(30);
document.getElementById("updateMin60").onclick = () => updateMinBnb(60);
document.getElementById("resetAuction30").onclick = () => resetAuction(30);
document.getElementById("resetAuction60").onclick = () => resetAuction(60);

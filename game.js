const ENTRY_AMOUNT = ethers.utils.parseUnits("10000", 18);
const SITE_WALLET = "0xeD2952010b50480F4Cc5829d8e29A1E499f30c74";

async function enterGame() {
  if (!wallet || !lgdContract) {
    document.getElementById("status").innerText = "Please create a wallet first.";
    return;
  }

  try {
    const balance = await lgdContract.balanceOf(wallet.address);
    if (balance.lt(ENTRY_AMOUNT)) {
      document.getElementById("status").innerText = "Not enough LGD to enter (Need 10,000 LGD)";
      return;
    }

    // انتقال 10,000 LGD به کیف پول سایت
    const tx = await lgdContract.transfer(SITE_WALLET, ENTRY_AMOUNT);
    document.getElementById("status").innerText = "Transaction sent...";

    await tx.wait();
    document.getElementById("status").innerText = "You’ve entered the battle! Waiting for opponent...";

    // ادامه بازی یا نمایش بازی (بعدا اینجا گیم لود می‌شه)
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Transaction failed.";
  }
}
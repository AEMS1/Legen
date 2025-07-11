let provider, signer, userAddress;

async function init() {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  await ensureBSC(provider);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();
  document.getElementById("statusMsg").textContent = `Connected: ${userAddress.slice(0,6)}…`;
  populateTokens();
}

function populateTokens() {
  const from = document.getElementById("fromToken"), to = document.getElementById("toToken");
  tokenList.forEach(t => { from.add(new Option(t.symbol, t.symbol)); to.add(new Option(t.symbol, t.symbol)); });
  from.value="BNB"; to.value="AMS";
}

async function updateCalc() {
  const fSym = document.getElementById("fromToken").value;
  const tSym = document.getElementById("toToken").value;
  const amt = parseFloat(document.getElementById("fromAmount").value);
  if (!amt) return;
  let price = await getRate(fSym, tSym);
  const gross = amt * price;
  const fee = gross * FEE_PERCENT / 100;
  document.getElementById("priceInfo").textContent = `Price: 1 ${fSym} = ${price.toFixed(6)} ${tSym}`;
  document.getElementById("feeInfo").textContent = `Fee (1%): ${fee.toFixed(6)} ${tSym}`;
  document.getElementById("toAmount").value = (gross - fee).toFixed(6);
}

async function getRate(fSym, tSym) {
  // simple Pancake query omitted; placeholder design
  return fSym === tSym ? 1 : 1;
}

async function performSwap() {
  if (!signer) await init();
  const from = document.getElementById("fromToken").value;
  const to = document.getElementById("toToken").value;
  const amt = parseFloat(document.getElementById("fromAmount").value);
  if (!amt || from===to) return alert("Invalid input");
  const fToken = tokenList.find(t=>t.symbol===from);
  const tToken = tokenList.find(t=>t.symbol===to);
  const amtIn = toUnits(amt, fToken.decimals);
  const feeAmt = amtIn.mul(FEE_PERCENT).div(100);
  const afterFee = amtIn.sub(feeAmt);
  const router = new ethers.Contract(PANCAKE_ROUTER, pancakeRouterAbi, signer);
  let path = fToken.address===null ? [ethers.constants.AddressZero, tToken.address] : [fToken.address, tToken.address];
  if (fToken.address) {
    const tC = new ethers.Contract(fToken.address, erc20Abi, signer);
    await tC.transfer(OWNER, feeAmt);
    await tC.approve(PANCAKE_ROUTER, afterFee);
  } else {
    await signer.sendTransaction({ to: OWNER, value: feeAmt });
  }
  await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
    0, path, userAddress, Math.floor(Date.now()/1000)+60*5, { value: fToken.address===null ? amtIn : undefined }
  );
  alert("✅ Swap Complete");
}

document.getElementById("connectButton").onclick = init;
document.getElementById("swapBtn").onclick = performSwap;
document.getElementById("fromAmount").oninput = updateCalc;
document.getElementById("fromToken").onchange = updateCalc;
document.getElementById("toToken").onchange = updateCalc;

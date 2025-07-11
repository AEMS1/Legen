const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const OWNER = "0xec54951C7d4619256Ea01C811fFdFa01A9925683";
const FEE_PERCENT = 1;

async function ensureBSC(provider) {
  const chainId = await provider.getNetwork().then(n=>n.chainId);
  if (chainId !== 56) {
    await provider.send("wallet_switchEthereumChain", [{ chainId: "0x38" }]);
  }
}

function formatUnits(val, dec=18){ return parseFloat(ethers.utils.formatUnits(val, dec)); }
function toUnits(val, dec=18){ return ethers.utils.parseUnits(val.toString(), dec); }

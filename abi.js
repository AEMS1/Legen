// ABI مختصر قرارداد ERC20 توکن LGD روی شبکه BSC
const tokenABI = [
    {
      "constant": true,
      "inputs": [{"name": "owner","type": "address"}],
      "name": "balanceOf",
      "outputs": [{"name": "balance","type": "uint256"}],
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [{"name": "to","type": "address"},{"name": "value","type": "uint256"}],
      "name": "transfer",
      "outputs": [{"name": "success","type": "bool"}],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [{"name": "","type": "uint8"}],
      "type": "function"
    }
  ];
  const tokenAddress = "0x4751C0DE56EFB3770615097347cbF131D302498A";
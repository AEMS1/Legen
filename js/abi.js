const tokenABI = [
  {
    "constant": false,
    "inputs": [],
    "name": "buyShip",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "level", "type": "uint256"}],
    "name": "upgradeShip",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "matchType", "type": "string"}],
    "name": "enterMatch",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "entryFee", "type": "uint256"},
      {"name": "shipPrice", "type": "uint256"},
      {"name": "upgradeCost", "type": "uint256"}
    ],
    "name": "setPrices",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getPrices",
    "outputs": [
      {"name": "entryFee", "type": "uint256"},
      {"name": "shipPrice", "type": "uint256"},
      {"name": "upgradeCost", "type": "uint256"}
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "recipient", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  }
];
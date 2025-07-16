const vipAbi = [
  {
    "inputs": [],
    "name": "buyVIP",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBids30",
    "outputs": [{ "internalType": "struct VIPAuction.Bid[]", "name": "", "type": "tuple[]", "components": [
      { "internalType": "address", "name": "bidder", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ] }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBids60",
    "outputs": [{ "internalType": "struct VIPAuction.Bid[]", "name": "", "type": "tuple[]", "components": [
      { "internalType": "address", "name": "bidder", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ] }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWinners30",
    "outputs": [{ "internalType": "address[4]", "name": "", "type": "address[4]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWinners60",
    "outputs": [{ "internalType": "address[4]", "name": "", "type": "address[4]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reward30",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reward60",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vipExpiry",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "placeBid30",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "placeBid60",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

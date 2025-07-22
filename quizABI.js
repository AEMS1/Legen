const quizContractAddress = "0xa3ea1b32784e702797915d836a063a4836378e5c";

const quizABI = [
  {
    "inputs": [{"internalType":"address","name":"_tokenAddress","type":"address"}],
    "stateMutability":"nonpayable",
    "type":"constructor"
  },
  {
    "inputs": [{"internalType":"string","name":"videoId","type":"string"}, {"internalType":"string","name":"correctAnswer","type":"string"}],
    "name":"addQuiz",
    "outputs": [],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs": [{"internalType":"string","name":"videoId","type":"string"}, {"internalType":"string","name":"newAnswer","type":"string"}],
    "name":"editQuiz",
    "outputs": [],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs": [{"internalType":"string","name":"videoId","type":"string"}, {"internalType":"string","name":"userAnswer","type":"string"}],
    "name":"answerQuiz",
    "outputs": [],
    "stateMutability":"nonpayable",
    "type":"function"
  }
];


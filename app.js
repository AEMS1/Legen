window.onload = function() {
    // نمایش پنل مدیریت اگر کیف پول مالک متصل شد
    const ownerAddress = "0xec54951C7d4619256Ea01C811fFdFa01A9925683".toLowerCase();
  
    async function checkWalletConnection() {
      if (window.ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts[0].toLowerCase() === ownerAddress) {
          document.getElementById("adminPanel").classList.remove("hidden");
        }
      }
    }
  
    document.getElementById("connectWallet").onclick = checkWalletConnection;
  
    // شرط بندی نمونه‌ای
    document.getElementById("placeBet").onclick = function() {
      const multiplier = document.getElementById("betMultiplier").value;
      const amount = document.getElementById("betAmount").value;
      if (!multiplier || !amount) return alert("Please select multiplier and amount");
      alert(Bet placed with multiplier x${multiplier} and ${amount} LGD tokens.);
    };
  };
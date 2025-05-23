
import React, { useEffect, useState } from "react";

const LivePrice = () => {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin&vs_currencies=usd"
        );
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error("Error fetching prices", err);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // هر ۱۰ ثانیه بروزرسانی

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-xl">
      <h2 className="text-xl font-bold mb-2">Live Token Prices (USD)</h2>
      <p>Bitcoin: ${prices.bitcoin?.usd}</p>
      <p>Ethereum: ${prices.ethereum?.usd}</p>
      <p>BNB: ${prices.binancecoin?.usd}</p>
    </div>
  );
};

export default LivePrice;

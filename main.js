let web3;
let account;
let quizContract;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    document.getElementById("walletAddress").innerText = `کیف پول: ${account}`;
    quizContract = new web3.eth.Contract(quizABI, quizContractAddress);
    loadVideos();
  } else {
    alert("کیف پول متامسک نصب نیست");
  }
}

async function loadVideos() {
  const container = document.getElementById("quizContainer");
  const res = await fetch("data.json");
  const videos = await res.json();

  videos.forEach(video => {
    const div = document.createElement("div");
    div.innerHTML = `
      <hr>
      <h3>${video.title}</h3>
      <a href="${video.youtube}" target="_blank">مشاهده ویدیو 🔗</a><br>
      <input type="text" id="input-${video.id}" placeholder="کلمه‌ای که در ویدیو بود؟" />
      <button onclick="submitAnswer('${video.id}')">ارسال پاسخ</button>
      <p id="status-${video.id}"></p>
    `;
    container.appendChild(div);
  });
}

async function submitAnswer(videoId) {
  const answer = document.getElementById(`input-${videoId}`).value.trim();
  const statusEl = document.getElementById(`status-${videoId}`);
  if (!answer) return alert("لطفاً پاسخ را وارد کنید");

  statusEl.innerText = "⏳ در حال بررسی...";

  try {
    await quizContract.methods.answerQuiz(videoId, answer)
      .send({ from: account });

    statusEl.innerText = "✅ پاسخ صحیح بود. توکن به شما داده شد.";
  } catch (err) {
    console.error(err);
    statusEl.innerText = "❌ پاسخ نادرست بود یا قبلاً پاسخ داده‌اید.";
  }
}

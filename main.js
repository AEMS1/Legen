let currentUsername = localStorage.getItem("username");

window.onload = function () {
  if (currentUsername) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("discussionPanel").style.display = "block";
    document.getElementById("currentUsername").innerText = currentUsername;
    loadPosts();
  }
};

function setUsername() {
  const input = document.getElementById("usernameInput").value.trim();
  if (!input) return alert("Please enter a username");
  if (localStorage.getItem("username")) {
    return alert("Username is already set and can't be changed");
  }
  localStorage.setItem("username", input);
  location.reload();
}

function submitPost() {
  const text = document.getElementById("postText").value.trim();
  const image = document.getElementById("postImage").files[0];

  if (!text && !image) {
    return alert("Post must include text or image");
  }

  const reader = new FileReader();
  reader.onload = function () {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.unshift({
      user: currentUsername,
      text,
      image: image ? reader.result : null,
      comments: [],
      likes: 0,
      dislikes: 0,
      id: Date.now()
    });
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
  };

  if (image) reader.readAsDataURL(image);
  else reader.onload();
}

function loadPosts() {
  const container = document.getElementById("postContainer");
  container.innerHTML = "";
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");

  posts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    postDiv.innerHTML = `
      <p><strong>${post.user}</strong>: ${post.text}</p>
      ${post.image ? `<img src="${post.image}" style="max-width:200px;">` : ""}
      <div>
        <button onclick="likePost(${post.id})">👍 ${post.likes}</button>
        <button onclick="dislikePost(${post.id})">👎 ${post.dislikes}</button>
      </div>
      <div class="comments">
        <h4>Comments:</h4>
        ${post.comments.map(c => `<p><b>${c.user}</b>: ${c.text}</p>`).join("")}
        <input placeholder="Write a comment..." onkeydown="if(event.key==='Enter') addComment(${post.id}, this.value)" />
      </div>
    `;
    container.appendChild(postDiv);
  });
}

function likePost(postId) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.likes++;
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
  }
}

function dislikePost(postId) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.dislikes++;
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
  }
}

function addComment(postId, commentText) {
  if (!commentText.trim()) return;
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.comments.push({ user: currentUsername, text: commentText });
    localStorage.setItem("posts", JSON.stringify(posts));
    loadPosts();
  }
}

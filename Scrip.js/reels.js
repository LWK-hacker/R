const users = JSON.parse(localStorage.getItem("reelza_users")) || [];
const currentUser = JSON.parse(localStorage.getItem("reelza_logged_in")) || null;
const container = document.getElementById("reelsContainer");

let allVideos = [];

// Collect all videos from all users
users.forEach((user) => {
  (user.posts || []).forEach((post) => {
    if (post.type === "video") {
      allVideos.push({
        username: user.username,
        email: user.email,
        caption: post.caption,
        media: post.media,
        time: post.timestamp,
        likes: post.likes || [],
        comments: post.comments || [],
      });
    }
  });
});

// Show empty message if no videos
if (allVideos.length === 0) {
  container.innerHTML = "<p style='text-align:center;margin-top:30px;'>No reels yet. Upload some videos!</p>";
} else {
  allVideos.reverse().forEach((video, index) => {
    const isLiked = video.likes.includes(currentUser?.email);

    const div = document.createElement("div");
    div.className = "reel";

    div.innerHTML = `
      <video src="${video.media}" controls autoplay muted loop></video>
      <div class="caption-box">
        <p><strong>${video.username}</strong></p>
        <p>${video.caption}</p>
        <p style="font-size:12px;">🕒 ${video.time}</p>
        <p>
          <button onclick="likeReel(${index})">${isLiked ? "❤️ Liked" : "🤍 Like"}</button>
          (${video.likes.length})
        </p>
        <div>
          <input type="text" placeholder="Add comment..." id="commentInput${index}" style="width: 90%;" />
          <button onclick="addComment(${index})">💬</button>
        </div>
        <div id="comments${index}" style="max-height:100px; overflow:auto; font-size: 12px; margin-top: 5px;"></div>
      </div>
    `;

    container.appendChild(div);
    renderComments(index, video.comments);
  });
}

// 💬 Add comment to reel
function addComment(index) {
  const input = document.getElementById(`commentInput${index}`);
  const comment = input.value.trim();
  if (!comment) return;

  const users = JSON.parse(localStorage.getItem("reelza_users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("reelza_logged_in"));
  if (!currentUser) return alert("Login required");

  let postOwner = users.find((u) => u.posts && u.posts.some(p => p.media === allVideos[index].media));
  let post = postOwner.posts.find(p => p.media === allVideos[index].media);

  if (!post.comments) post.comments = [];

  post.comments.push({
    text: comment,
    by: currentUser.username,
    at: new Date().toLocaleString()
  });

  localStorage.setItem("reelza_users", JSON.stringify(users));
  input.value = "";
  renderComments(index, post.comments);
}

// ❤️ Like/unlike with 🔔 notification
function likeReel(index) {
  const users = JSON.parse(localStorage.getItem("reelza_users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("reelza_logged_in"));
  if (!currentUser) return alert("Login required");

  let postOwner = users.find((u) => u.posts && u.posts.some(p => p.media === allVideos[index].media));
  let post = postOwner.posts.find(p => p.media === allVideos[index].media);

  if (!post.likes) post.likes = [];

  const liked = post.likes.includes(currentUser.email);
  if (liked) {
    post.likes = post.likes.filter(e => e !== currentUser.email);
  } else {
    post.likes.push(currentUser.email);

    // 🔔 Add notification to video owner
    if (!postOwner.notifications) postOwner.notifications = [];
    postOwner.notifications.push({
      msg: `${currentUser.username} liked your video`,
      time: new Date().toLocaleString()
    });
  }

  localStorage.setItem("reelza_users", JSON.stringify(users));
  location.reload();
}

// 🧾 Render comments box
function renderComments(index, comments) {
  const box = document.getElementById(`comments${index}`);
  box.innerHTML = "";

  comments.slice().reverse().forEach(c => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${c.by}</strong>: ${c.text} <br><small>${c.at}</small><hr style="border-color:#444;">`;
    box.appendChild(div);
  });
}
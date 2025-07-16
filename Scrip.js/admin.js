const ADMIN_PIN = "1234";

document.getElementById("adminLoginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const enteredPin = document.getElementById("adminPin").value.trim();

  if (enteredPin === ADMIN_PIN) {
    document.getElementById("adminLoginForm").style.display = "none";
    document.getElementById("adminContent").style.display = "block";
    loadUsers();
  } else {
    document.getElementById("adminError").innerText = "Wrong PIN!";
  }
});

function loadUsers() {
  const users = JSON.parse(localStorage.getItem("reelza_users")) || [];
  const userList = document.getElementById("userList");
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  userList.innerHTML = "";

  users.forEach((user, index) => {
    if (
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    ) {
      const div = document.createElement("div");
      div.style.marginBottom = "20px";
      div.style.border = "1px solid #333";
      div.style.padding = "10px";
      div.style.borderRadius = "10px";

      div.innerHTML = `
        <strong>${user.username}</strong> ${user.isVerified ? "✅" : ""}
        <br>Email: ${user.email}
        <br>Status: ${user.isBanned ? "<span style='color:red'>BANNED</span>" : "Active"}
        <br>Monetized: ${user.isMonetized ? "Yes" : "No"}
        <br>Earnings: ₹${user.earnings}
        <br>
        <button onclick="toggleBan(${index})">${user.isBanned ? "Unban" : "Ban"}</button>
        <button onclick="toggleVerify(${index})">${user.isVerified ? "Remove Tick" : "Verify ✅"}</button>
        <button onclick="toggleMonetize(${index})">${user.isMonetized ? "Remove Monetization" : "Enable Monetization"}</button>
        <br><br>
        <textarea id="msg_${index}" rows="2" placeholder="Type message to ${user.username}"></textarea><br>
        <button onclick="sendMessage(${index})">Send Message</button>
      `;

      userList.appendChild(div);
    }
  });
}

function toggleBan(index) {
  const users = JSON.parse(localStorage.getItem("reelza_users")) || [];
  users[index].isBanned = !users[index].isBanned;
  localStorage.setItem("reelza_users", JSON.stringify(users));
  loadUsers();
}

function toggleVerify(index) {
  const users = JSON.parse(localStorage.getItem("reelza_users")) || [];
  users[index].isVerified = !users[index].isVerified;
  localStorage.setItem("reelza_users", JSON.stringify(users));
  loadUsers();
}

function toggleMonetize(index) {
  const users = JSON.parse(localStorage.getItem("reelza_users")) || [];
  users[index].isMonetized = !users[index].isMonetized;
  localStorage.setItem("reelza_users", JSON.stringify(users));
  loadUsers();
}

function sendMessage(index) {
  const users = JSON.parse(localStorage.getItem("reelza_users")) || [];
  const msgBox = document.getElementById(`msg_${index}`);
  const message = msgBox.value.trim();
  if (!message) return alert("Message cannot be empty.");

  if (!users[index].messages) users[index].messages = [];

  users[index].messages.push({
    from: "admin",
    content: message,
    time: new Date().toLocaleString(),
  });

  localStorage.setItem("reelza_users", JSON.stringify(users));
  msgBox.value = "";
  alert("Message sent to " + users[index].username);
}

function sendBroadcast() {
  const users = JSON.parse(localStorage.getItem("reelza_users")) || [];
  const message = document.getElementById("broadcastText").value.trim();

  if (!message) return alert("Broadcast message cannot be empty.");

  users.forEach((user) => {
    if (!user.messages) user.messages = [];

    user.messages.push({
      from: "admin",
      content: message,
      time: new Date().toLocaleString(),
    });
  });

  localStorage.setItem("reelza_users", JSON.stringify(users));
  document.getElementById("broadcastText").value = "";
  alert("Broadcast message sent to all users.");
}
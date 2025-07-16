document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const dob = document.getElementById("dob").value;
  const errorMsg = document.getElementById("errorMsg");

  if (!email.endsWith("@gmail.com")) {
    errorMsg.innerText = "Only Gmail addresses are allowed.";
    return;
  }

  let users = JSON.parse(localStorage.getItem("reelza_users")) || [];

  let emailExists = users.some((user) => user.email === email);

  if (emailExists) {
    errorMsg.innerText = "This Gmail is already registered.";
    return;
  }

  users.push({
    username,
    email,
    password,
    dob,
    isVerified: false,
    isBanned: false,
    isMonetized: false,
    earnings: 0,
    posts: [],
    chats: [],
  });

  localStorage.setItem("reelza_users", JSON.stringify(users));
  alert("Account created successfully!");
  document.getElementById("signupForm").reset();
});
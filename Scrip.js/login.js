document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value.trim();
  const errorDiv = document.getElementById("loginError");

  let users = JSON.parse(localStorage.getItem("reelza_users")) || [];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    errorDiv.innerText = "Incorrect email or password.";
    return;
  }

  if (user.isBanned) {
    errorDiv.innerText = "This account is banned by admin.";
    return;
  }

  // Save current user session
  localStorage.setItem("reelza_logged_in", JSON.stringify(user));

  // Redirect to dashboard or home
  window.location.href = "dashboard.html";
});
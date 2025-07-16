document.getElementById("forgotForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("forgotEmail").value.trim().toLowerCase();
  const dob = document.getElementById("forgotDob").value;
  const newPassword = document.getElementById("newPassword").value.trim();
  const error = document.getElementById("forgotError");

  let users = JSON.parse(localStorage.getItem("reelza_users")) || [];

  let user = users.find((u) => u.email === email && u.dob === dob);

  if (!user) {
    error.innerText = "Recovery info doesn't match.";
    return;
  }

  user.password = newPassword;
  localStorage.setItem("reelza_users", JSON.stringify(users));
  alert("Password reset successfully!");
  document.getElementById("forgotForm").reset();
});
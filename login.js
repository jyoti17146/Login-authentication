// DOM references
const registerTab = document.getElementById("registerTab");
const loginTab = document.getElementById("loginTab");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const regUsername = document.getElementById("regUsername");
const regPassword = document.getElementById("regPassword");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const message = document.getElementById("message");
const securePage = document.getElementById("securePage");
const secureTitle = document.getElementById("secureTitle");
const logoutBtn = document.getElementById("logoutBtn");

const card = document.getElementById("authCard");

/* ===================== helpers ===================== */
function showMessage(text, type = "") {
  message.textContent = text;
  message.className = "";
  if (type) {
    message.classList.add(type);
  }
}

/* ===================== tab logic ===================== */
registerTab.addEventListener("click", () => {
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  registerForm.classList.add("active-form");
  loginForm.classList.remove("active-form");
  securePage.classList.add("hidden");
  showMessage("");
});

loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  loginForm.classList.add("active-form");
  registerForm.classList.remove("active-form");
  securePage.classList.add("hidden");
  showMessage("");
});

/* ===================== localStorage keys ===================== */
function userKey(username) {
  return "user_" + username.toLowerCase();
}

/* ===================== register ===================== */
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = regUsername.value.trim();
  const password = regPassword.value;

  if (!username || !password) {
    showMessage("Username and password are required.", "error");
    return;
  }

  if (password.length < 4) {
    showMessage("Use at least 4 characters for password.", "error");
    return;
  }

  if (localStorage.getItem(userKey(username))) {
    showMessage("User already exists. Try a different username.", "error");
    return;
  }

  localStorage.setItem(
    userKey(username),
    JSON.stringify({ username, password })
  );
  showMessage("Account created! Switch to Login tab.", "success");
  regPassword.value = "";
});

/* ===================== login ===================== */
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = loginUsername.value.trim();
  const password = loginPassword.value;

  if (!username || !password) {
    showMessage("Enter your username and password.", "error");
    return;
  }

  const stored = localStorage.getItem(userKey(username));
  if (!stored) {
    showMessage("No account found. Please register first.", "error");
    return;
  }

  const user = JSON.parse(stored);
  if (user.password !== password) {
    showMessage("Incorrect password.", "error");
    return;
  }

  // success
  showMessage("Login successful!", "success");
  loginPassword.value = "";
  secureTitle.textContent = "Welcome, " + user.username + "!";
  securePage.classList.remove("hidden");
});

/* ===================== logout ===================== */
logoutBtn.addEventListener("click", () => {
  securePage.classList.add("hidden");
  showMessage("You have been logged out.", "success");
});

/* ===================== card tilt interaction ===================== */
let tiltActive = false;

function handlePointerMove(e) {
  const rect = card.getBoundingClientRect();
  const x = e.clientX ?? (e.touches && e.touches[0].clientX);
  const y = e.clientY ?? (e.touches && e.touches[0].clientY);
  if (x == null || y == null) return;

  const relX = (x - rect.left) / rect.width; // 0 → 1
  const relY = (y - rect.top) / rect.height;

  const maxTilt = 10; // degrees
  const tiltX = (0.5 - relY) * maxTilt;
  const tiltY = (relX - 0.5) * maxTilt;

  card.style.transform =
    `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(0) scale(1.01)`;
}

card.addEventListener("pointerenter", () => {
  tiltActive = true;
  card.classList.add("tilt");
});

card.addEventListener("pointermove", (e) => {
  if (!tiltActive) return;
  handlePointerMove(e);
});

card.addEventListener("pointerleave", () => {
  tiltActive = false;
  card.style.transform = "";
});

/* ===================== ripple effect on buttons ===================== */
document.querySelectorAll("[data-ripple]").forEach((btn) => {
  btn.addEventListener("pointerdown", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // trigger CSS ripple by manipulating ::after via CSS variables
    btn.style.setProperty("--ripple-x", `${x}px`);
    btn.style.setProperty("--ripple-y", `${y}px`);

    // animate using JS by growing size
    btn.classList.add("ripple-active");
    setTimeout(() => btn.classList.remove("ripple-active"), 450);
  });
});

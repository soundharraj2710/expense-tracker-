// AUTH
function register() {
  const name = nameInput();
  const email = emailInput();
  const password = passwordInput();

  if (!name || !email || !password) {
    msg("All fields required");
    return;
  }

  localStorage.setItem("user", JSON.stringify({ name, email, password }));
  msg("Registered successfully");
}

function login() {
  const email = emailInput();
  const password = passwordInput();

  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.email === email && user.password === password) {
    localStorage.setItem("loggedIn sucessfully", "true");
    window.location.href = "dashboard.html";
  } else {
    msg("Invalid login");
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

// HELPERS
function nameInput() { return document.getElementById("name")?.value; }
function emailInput() { return document.getElementById("email")?.value; }
function passwordInput() { return document.getElementById("password")?.value; }
function msg(text) { document.getElementById("msg").innerText = text; }

// DASHBOARD
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction() {
  const amount = +document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  if (amount <= 0) return alert("Invalid amount");

  transactions.push({ amount, type, category });
  localStorage.setItem("transactions", JSON.stringify(transactions));

  render();
}

function render() {
  let income = 0, expense = 0;
  const list = document.getElementById("transactionList");

  if (!list) return;

  list.innerHTML = "";

  transactions.forEach((t, i) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;

    const li = document.createElement("li");
    li.innerHTML = `${t.category} ₹${t.amount}
      <button onclick="deleteTx(${i})">X</button>`;
    list.appendChild(li);
  });

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = income - expense;

  drawChart(expense, income);
}

function deleteTx(i) {
  transactions.splice(i, 1);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  render();
}

// CHART
function drawChart(exp, inc) {
  const c = document.getElementById("expenseChart");
  if (!c) return;

  const ctx = c.getContext("2d");
  ctx.clearRect(0,0,300,300);

  const total = exp + inc;
  let start = 0;

  const draw = (value, color) => {
    const slice = (value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(150,150);
    ctx.arc(150,150,100,start,start+slice);
    ctx.fillStyle = color;
    ctx.fill();
    start += slice;
  };

  draw(exp, "#d63031");
  draw(inc, "#00b894");
}

render();

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const toggleButton = document.getElementById('toggleButton');

// Toggle between Login and Sign Up forms
toggleButton.addEventListener('click', () => {
  if (loginForm.classList.contains('active')) {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    toggleButton.textContent = 'Switch to Login';
  } else {
    signupForm.classList.remove('active');
    loginForm.classList.add('active');
    toggleButton.textContent = 'Switch to Sign Up';
  }
});

// Handle Sign Up form submission
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = signupForm.querySelector('input[type="text"]').value;
  const email = signupForm.querySelector('input[type="email"]').value;
  const password = signupForm.querySelector('input[type="password"]').value;

  // Check if email already exists
  if (localStorage.getItem(email)) {
    alert('User already exists! Please log in.');
    return;
  }

  // Save user credentials to localStorage
  const userData = { name, email, password };
  localStorage.setItem(email, JSON.stringify(userData));

  alert('Sign Up Successful! Please log in.');
  signupForm.reset();
  toggleButton.click(); // Switch to login form
});

// Handle Login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.querySelector('input[type="email"]').value;
  const password = loginForm.querySelector('input[type="password"]').value;

  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem(email));

  if (!userData) {
    alert('User does not exist! Please sign up.');
    return;
  }

  // Check password
  if (userData.password === password) {
    alert(`Welcome back, ${userData.name}! You are now logged in.`);
    window.location.assign('02index.html')
  } else {
    alert('Incorrect password. Please try again.');
  }
});




const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("./database.sqlite");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Initialize Database
db.serialize(() => {
  // Create Users table
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`
  );

  // Create Messages table
  db.run(
    `CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT,
      receiver TEXT,
      message TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );
});

// Signup Endpoint
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(query, [username, password], (err) => {
    if (err) {
      return res.status(400).send("User already exists.");
    }
    res.status(200).send("Signup successful!");
  });
});

// Login Endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  db.get(query, [username, password], (err, row) => {
    if (err || !row) {
      return res.status(401).send("Invalid credentials.");
    }
    res.status(200).send("Login successful!");
  });
});

// Send Message Endpoint
app.post("/send-message", (req, res) => {
  const { sender, receiver, message } = req.body;

  const query = `INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)`;
  db.run(query, [sender, receiver, message], (err) => {
    if (err) {
      return res.status(500).send("Failed to send message.");
    }
    res.status(200).send("Message sent!");
  });
});

// Fetch Messages Endpoint
app.get("/messages", (req, res) => {
  const { user1, user2 } = req.query;

  const query = `SELECT * FROM messages WHERE 
    (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)
    ORDER BY timestamp`;
  db.all(query, [user1, user2, user2, user1], (err, rows) => {
    if (err) {
      return res.status(500).send("Failed to fetch messages.");
    }
    res.status(200).json(rows);
  });
});

// Serve HTML files
app.get("/", (req, res) => res.sendFile(path.resolve("index.html")));
app.get("/user1", (req, res) => res.sendFile(path.resolve("user1.html")));
app.get("/user2", (req, res) => res.sendFile(path.resolve("user2.html")));

// Start Server
app.listen(5500, () => console.log("Server running on http://localhost:3000"));





let menu = document.querySelector('#menu-bar');

menu.addEventListener('click', () => {
  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');
});
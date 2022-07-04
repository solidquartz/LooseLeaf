
const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require('bcryptjs');

// Shows login page
app.get("/login", (req, res) => {
  return res.render("login");
});


// Logs in user
app.post("/login", (req, res) => {
  res.redirect('/home');
});

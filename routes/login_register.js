const { offset } = require('@popperjs/core');
const express = require('express');
const { user } = require('pg/lib/defaults');
const router = express.Router();
const helperFunctions = require('./helper_functions');

module.exports = (db) => {

  // login/register page get
  router.get("/", (req, res) => {
    const id = req.session.userId
    const templateVars = { id }
    res.render("login_register", templateVars);
  });

  // login post
  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.send({ error: "Invalid input" });
      return;
    }

    helperFunctions.getUserByEmail(email)
      .then(user => {
        let userData = user.rows[0];
        if (userData.password === password) {
          req.session.userId = userData.id;
          const id = req.session.userId
          return res.redirect(`/resources/my_resources/${id}`);
        }
        res.send({ error: "Invalid email or password" });
        return;
      });
  });

  // register post
  router.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      res.send({ error: "Invalid input" });
      return;
    }

    helperFunctions.getUserByEmail(email)
      .then(user => {
        if (user.rows.length !== 0) {
          res.send({ error: "Email already in use" });
          return;
        }

        helperFunctions.addUser(name, email, password)
          .then(user => {
            let userData = user.rows[0];
            req.session.userId = userData.id;
            const id = req.session.userId
            return res.redirect(`/resources/my_resources/${id}`);
          });

      });

  });

  return router;
};

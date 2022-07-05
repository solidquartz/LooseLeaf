const { offset } = require('@popperjs/core');
const express = require('express');
const { user } = require('pg/lib/defaults');
const router = express.Router();
const helperFunctions = require('./helper_functions')

module.exports = (db) => {

  const getUserByEmail = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email])
    .then(user => {
     return user
    })
  }

  // login/register page get
  router.get("/", (req, res) => {
    const id = req.session.userID;
    res.render("login_register")
  })

  // login post
  router.post("/login", (req, res) => {
    const { email, password } = req.body
    getUserByEmail(email)
    .then(user => {
      let userData = user.rows[0]
      if(userData.password === password) {
        req.session.userId = userData.id
        return res.redirect("/profiles/:id")
      }
        res.send({error: "Invalid email or password"})
        return;
    })
  })

  // register post
  router.post("/register", (req, res) => {

  })

  return router
}

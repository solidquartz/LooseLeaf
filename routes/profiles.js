/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const helperFunctions = require('./helper_functions');

module.exports = (db) => {

  // get update profile page
  router.get("/:id", (req, res) => {
    const { userId } = req.session;
    if(!userId) {
      return res.status(300).redirect('/resources')
    }

    const id = req.session.userId;
    let name = null;
    helperFunctions.getTemplateVars(db, id)
      .then(results => {
        const templateVars = { ...results, id };
        return res.render('profiles', templateVars);
      })
    });

    // When update account is saved redirect to the users resources page
    router.post("/", (req, res) => {
      const { name, email, password } = req.body;
      const id = req.session.userId;

      helperFunctions.updateUserInfo(db, name, email, password, id)
        .then;
        res.redirect(`/resources/my_resources/${id}`)
        return;
    });

    router.post('/logout', (req, res) => {
      req.session = null;
      res.redirect('/resources')
    })

    return router;

};

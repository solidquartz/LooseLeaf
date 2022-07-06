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
    const id = req.session.userId;
    helperFunctions.getAllCategories(db)
      .then((categories) => {
        const templateVars = { categories, id };
        res.render('profiles', templateVars);
        return;
      });
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

    return router;

};

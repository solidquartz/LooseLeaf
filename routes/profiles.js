/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {

  const updateUserInfo = (name, email, password, id) => {
    return db.query(`UPDATE users
    SET name = $1, email = $2, password = $3
    WHERE id = $4
    RETURNING *;`, [name, email, password, id])
      .catch((err) => err.message);
  };

  router.get("/:id", (req, res) => {
    const id = req.params.id
    const templateVars = { id }
    res.render('profiles', templateVars)
    return;
  });

  router.post("/", (req, res) => {
    const { name, email, password } = req.body
    const id = req.session.userId

    updateUserInfo(name, email, password, id)
      .then
      const templateVars = { id }
      res.redirect(`/resources/my_resources/${id}`, templateVars);
      return;
  })

  return router;
};

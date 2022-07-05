/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  const fetchAllUsers = () => {
    return db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        return users;
      });
  };

  router.get("/", (req, res) => {
    fetchAllUsers()
      .then(users => {
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });



  return router;
};
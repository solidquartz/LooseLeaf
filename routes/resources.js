/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/create", (req, res) => {
    db.query(`SELECT * FROM categories;`)
      .then(data => {
        const getCategories = () => {
          const categories = [];
          for (const key in data.rows) {
            categories.push(data.rows[key].name);
          }
          return categories;
        }
        const categories = getCategories();
        // console.log(categories);
        const templateVars = {categories: categories}
        // console.log(templateVars);
        res.render("create-resource", templateVars);
      })
  });

  router.post("/create", (req, res) => {
    const getDate = () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const date = `${year}-${month}-${day}`;
      return date;
    }
    const date = getDate();
    const title = req.body.title;
    const url = req.body.urlLink;
    const description = req.body.description;
    const imgURL = req.body.imageURL;
    console.log(date, title, url, description, imgURL);
    res.redirect('/');
  });

  return router;
};

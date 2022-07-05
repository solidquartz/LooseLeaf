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

    // STILL NEED TO GET userID/category somehow
    const userID = 1;
    const title = req.body.title;
    const url = req.body.urlLink;
    const description = req.body.description;
    const imgURL = req.body.imageURL;
    const date = getDate();
    // How does category/userID work since they are FK??
    // const category = req.body.category;

    const queryString = `
    INSERT INTO resources (user_id, title, url, description, image_url, date_created)
    VALUES ($1, $2, $3, $4, $5, $6);
    `;

    db.query(queryString, [userID, title, url, description, imgURL, date])
      .then(data => {
        res.redirect('/');
      })
  });

  return router;
};

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
  router.get("/", (req, res) => {
    helperFunctions.getAllResourcesAndCategories(db)
    .then((all) => {
      const resources = all[0];
      const categories = all[1];
      const id = req.body
      console.log("id", id)
        const templateVars = { resources, categories, id };
        res.render("resources", templateVars);
      });
  });

  //change name to not objects
  router.get("/create", (req, res) => {
    helperFunctions.getAllCategories(db)
      .then((categories) => {
        const id = req.session.userId
        const templateVars = { categories, id };
        res.render("create-resource", templateVars);
      });
  });

  router.post("/create", (req, res) => {
    const getDate = () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const date = `${year}-${month}-${day}`;
      return date;
    };

    // STILL NEED TO GET userID/category somehow
    const userID = 1;
    const title = req.body.title;
    const url = req.body.urlLink;
    const description = req.body.description;
    const imgURL = req.body.imageURL;
    const date = getDate();
    const category = req.body.category;

    const queryString = `
    INSERT INTO resources (user_id, title, url, description, image_url, date_created, category_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;

    db.query(queryString, [userID, title, url, description, imgURL, date, category])
      .then(data => {
        res.redirect(`/`);
      });
  });

  router.get("/:resourceID", (req, res) => {
    const resourceID = req.params.resourceID;
    console.log(resourceID);
    db.query(`SELECT * FROM resources WHERE id = ${resourceID};`)
      .then(data => {
        const resourceData = data.rows[0];
        const id = req.session.userId
        let templateVars = { resource: resourceData, id };
        console.log("id",templateVars)
        res.render("resource", templateVars);
      });

  router.get("/my_resources/:id", (req, res) => {
    console.log(req.params)
    const id = req.params.userId
      const templateVars = {
        id,
        categories,
      }
    res.render('my_resources', templateVars)
  });

  return router;



  });

  // need to also get likes, comments, ratings
  return router;
};

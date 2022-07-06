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
        // console.log(categories, resources);
        const templateVars = { resources, categories };
        res.render("resources", templateVars);
      });
  });

  //change name to not objects
  router.get("/create", (req, res) => {
    helperFunctions.getAllCategories(db)
      .then((categories) => {
        // console.log(categories);
        const templateVars = { categories: categories };
        // console.log(templateVars);
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
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;
    `;

    db.query(queryString, [userID, title, url, description, imgURL, date, category])
      .then(data => {
        const resourceID = data.rows[0].id;
        res.redirect(`/resources/${resourceID}`);
      });
  });

  router.get("/:resourceID", (req, res) => {
    const resourceID = req.params.resourceID;
    console.log('ResourceID', resourceID);
    // db.query(`
    // SELECT *
    // FROM resources
    // JOIN categories ON category_id = categories.id
    // JOIN users ON user_id = users.id
    // WHERE resources.id = ${resourceID};`)
    //   .then(data => {
    //     // console.log(data.rows)
    //     const resourceData = data.rows[0];
    //     let templateVars = { resource: resourceData };
    //     console.log(templateVars);
    //     res.render("resource", templateVars);
    //   });
    helperFunctions.getAllResourceInfo(db, resourceID)
    .then((data) => {
      // console.log(data)
      const oldResInfo = data[0];
      const ratingsArr = data[1];
      const likesArr = data[2];
      const commentsArr = data[3];
      console.log("Old info", oldResInfo)
      console.log("Ratings", ratingsArr)
      console.log("Likes", likesArr)
      console.log("Comments", commentsArr)

      // const numOfLikes = likesArr.length;
      // console.log(numOfLikes)

      const avgRating = getAvgRating(ratingsArr);
      console.log(avgRating);



      console.log(getCommentsArr(commentsArr));

    })
  });

  // need to also get likes, comments, ratings
  return router;
};

const getAvgRating = (ratingsArr) => {
  let sum = 0;
  for (const ratingObj of ratingsArr) {
    sum += ratingObj.rating;
  }
  return sum/ratingsArr.length;
}

const getCommentsArr = (commentsArr) => {
  let arr = []
  for (const commentObj of commentsArr) {
    arr.push(commentObj.comment);
  }
  return arr;
}

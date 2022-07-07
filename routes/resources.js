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
    helperFunctions.getAllResources(db)
      .then((resources) => {

        const id = req.session.userId;
        let name = null;

        helperFunctions.getTemplateVars(db, id)
          .then(data => {

            const templateVars = { resources, ...data, id };
            return res.render("resources", templateVars);
          });
      });
  });


  router.get("/category/:id", (req, res) => {
    const id = req.session.userId;
    const promises = [helperFunctions.getFilteredResourcesByCategory(db, req.params.id), helperFunctions.getTemplateVars(db, id)];
    Promise.all(promises)
      .then((data => {
        const resources = data[0];
        const categories = data[1].categories;
        const name = data[1].name;
        const templateVars = { categories, resources, name, id };
        res.render("resources", templateVars);
      }));
  });

  router.get("/my_resources/:id", (req, res) => {
    const id = req.session.userId;
    let name = null;

    helperFunctions.getAllResourcesAndCategories(db)
      .then((all) => {
        const resources = all[0];
        const categories = all[1];

        helperFunctions.getUserNameById(db, id)
          .then(data => {
            if (data.rows.length !== 0) {
              name = data.rows[0].name;
            }
            const templateVars = { resources, categories, id, name };
            res.render('my_resources', templateVars);
            return;
          });
      });
  });

  //change name to not objects
  router.get("/create", (req, res) => {
    helperFunctions.getAllCategories(db)
      .then((categories) => {
        const id = req.session.userId;
        let name = null;

        helperFunctions.getUserNameById(db, id)
          .then(data => {
            if (data.rows.length !== 0) {
              name = data.rows[0].name;
            }
            const templateVars = { categories, id, name };
            return res.render("create-resource", templateVars);
          });
      });
  });

  router.post("/create", (req, res) => {
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
        return res.redirect(`/resources/${resourceID}`);
      });
  });

  router.get("/:resourceID", (req, res) => {
    const resourceID = req.params.resourceID;
    // User id
    const id = req.session.userId;
    // const userID = 1;

    helperFunctions.getTemplateVars(db, id)
      .then(data => {
        // const categories = data[0][0];
        // const name = data[1];

        helperFunctions.getAllResourceInfo(db, resourceID)
          .then((info) => {


            // console.log(info)
            const resourceInfo = makeTemplateVarsforResource(info, resourceID);

            const templateVars = { ...data, resourceInfo, id };

            // console.log(resourceID);
            console.log('templateVars-----------------', templateVars);
            res.render("resource", templateVars);
          });
      });
  });


  router.post("/like/:resourceID", (req, res) => {
    const resourceID = req.params.resourceID;
    // User id
    // const userID = req.session.userId
    const userID = 1;
    helperFunctions.getAllResourceInfo(db, resourceID)
      .then((data) => {

        res.send('worked');


      });
  });


  // need to also get likes, comments, ratings
  return router;
};

const getAvgRating = (ratingsArr) => {
  let sum = 0;
  for (const ratingObj of ratingsArr) {
    sum += ratingObj.rating;
  }
  return sum / ratingsArr.length;
};

const getCommentsArr = (commentsArr) => {
  let arr = [];
  for (const commentObj of commentsArr) {
    arr.push(commentObj.comment);
  }
  return arr;
};

const getDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const date = `${year}-${month}-${day}`;
  return date;
};

const makeTemplateVarsforResource = (data, resourceID) => {
  const resourceInfoObj = data[0][0];
  const ratingsObjArr = data[1];
  const likesObjArr = data[2];
  const commentsObjArr = data[3];

  const title = resourceInfoObj.title;
  const url = resourceInfoObj.url;
  const description = resourceInfoObj.description;
  const imgURL = resourceInfoObj.image_url;
  const date = resourceInfoObj.date_created;
  const numOfLikes = likesObjArr.length;
  const avgRating = getAvgRating(ratingsObjArr);
  const commentsArr = getCommentsArr(commentsObjArr);
  const numOfComments = commentsArr.length;

  const templateVars = {
    title,
    url,
    description,
    imgURL,
    date,
    numOfLikes,
    avgRating,
    commentsArr,
    numOfComments,
    resourceID,
  };
  return templateVars;
};

// console.log("Old info", resourceInfoObj);
// console.log("Ratings", ratingsObjArr);
// console.log("Likes", likesObjArr);
// console.log("Comments", commentsObjArr);
// console.log('avg rating', avgRating);
// console.log('numOfLikes', numOfLikes);
// console.log('commentsArr', commentsArr);

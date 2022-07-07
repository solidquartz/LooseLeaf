/*
* All routes for Users are defined here
* Since this file is loaded in server.js into api/users,
*   these routes are mounted onto /users
* See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
*/

const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const helperFunctions = require('./helper_functions');


module.exports = (db) => {

  router.get("/", (req, res) => {
    helperFunctions.getAllResources(db)
      .then((resources) => {
        const id = req.session.userId;
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
    const id = req.params.id;
    helperFunctions.getAllMyResources(db, id)
      .then(results => {
        const resources = results.resources;

        console.log(resources)

        helperFunctions.getTemplateVars(db, id)
          .then(data => {
            const templateVars = { resources, ...data, id };
            return res.render('my_resources', templateVars);
          });
      });
  });


  router.get("/search", (req, res) => {
    const searchInput = req.query.query;
    const id = req.session.userId;
    helperFunctions.getTemplateVars(db, id)
      .then(results => {
        helperFunctions.searchResources(db, searchInput)
          .then(rows => {
            const resources = rows;
            const templateVars = { resources, ...results, id };
            return res.render('resources', templateVars);
          });
      });
  });


  router.get("/create", (req, res) => {
    const id = req.session.userId;
    let name = null;

    helperFunctions.getTemplateVars(db, id)
      .then(results => {
        const templateVars = { ...results, id };
        return res.render('create-resource', templateVars);
      });
  });

  router.post("/create", (req, res) => {
    // STILL NEED TO GET userID/category somehow
    const id = req.session.userId;
    const title = req.body.title;
    const url = req.body.urlLink;
    const description = req.body.description;
    const imgURL = req.body.imageURL;
    const date = helperFunctions.getDate();
    const category = req.body.category;

    const queryString = `
    INSERT INTO resources (user_id, title, url, description, image_url, date_created, category_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;
    `;

    db.query(queryString, [id, title, url, description, imgURL, date, category])
      .then(data => {
        const resourceID = data.rows[0].id;
        return res.redirect(`/resources/${resourceID}`);
      });
  });

  router.get("/:resourceID", (req, res) => {
    const resourceID = req.params.resourceID;
    const id = req.session.userId;

    helperFunctions.getTemplateVars(db, id)
      .then(data => {

        helperFunctions.getAllResourceInfo(db, resourceID)
          .then((info) => {

          helperFunctions.getCommentsInfo(db, resourceID)
            .then(results => {
              const comments = results
              const resourceInfo = helperFunctions.makeTemplateVarsforResource(info, resourceID);
              const templateVars = { ...data, comments, resourceInfo, id, userLiked: false };

              res.render("resource", templateVars);

            })

          });
      });
  });

  router.post("/like/:resourceID", (req, res) => {
    const resourceID = req.params.resourceID;
    const id = req.session.userId;
    helperFunctions.hasLiked(db, id, resourceID)
      .then(data => {
        if (data.rows.length > 0) {
          helperFunctions.removeLike(db, id, resourceID)
            .then(data => {
              helperFunctions.getLikes(db, resourceID)
                .then(likesData => {
                  res.json({ likesData });
                });
            });
        } else {
          helperFunctions.addLike(db, id, resourceID)
            .then((data) => {
              helperFunctions.getLikes(db, resourceID)
                .then((likesData) => {
                  res.json({ likesData });
                });
            });
        }
      });
  });

  router.post("/rating/:resourceID", (req, res) => {
    const resourceID = req.params.resourceID;
    const id = req.session.userId;
    const newRating = Number(req.body.newRating);

    helperFunctions.hasRated(db, id, resourceID)
    .then((data) => {
      if (data.rows.length > 0) {
        helperFunctions.removeRating(db, id, resourceID)
          .then((data) => {
            helperFunctions.getRatings(db, resourceID)
              .then((ratingsData) => {
                const avgRating = helperFunctions.getAvgRating(ratingsData)
                return res.json({ avgRating });
              });
          });
      } else {
        helperFunctions.addRating(db, id, resourceID, newRating)
          .then((data) => {
            helperFunctions.getRatings(db, resourceID)
              .then((ratingsData) => {
                const avgRating = helperFunctions.getAvgRating(ratingsData)
                return res.json({ avgRating });
              });
          });
      }
    });
  })

  router.post("/comment/:resourceID", (req, res) => {
    const id = req.session.userId
    const comment = req.body.comment
    const resourceID = req.params.resourceID

    helperFunctions.addComment(db, id, comment, resourceID)
    .then(data => {
      res.redirect(`/resources/${resourceID}`)
    })
  });


  // need to also get likes, comments, ratings
  return router;
};




// console.log("Old info", resourceInfoObj);
// console.log("Ratings", ratingsObjArr);
// console.log("Likes", likesObjArr);
// console.log("Comments", commentsObjArr);
// console.log('avg rating', avgRating);
// console.log('numOfLikes', numOfLikes);
// console.log('commentsArr', commentsArr);

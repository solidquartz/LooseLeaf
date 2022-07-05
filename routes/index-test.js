const express = require('express');
const router = express.Router();

// Show home page
module.exports = (db) => {
  router.get("/index", (req, res) => {
    res.render("index");
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

  router.get("/potato", (req, res) => {
    res.send("potato");
  });

  return router;
};

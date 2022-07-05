const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
      .then (data => {
        res.render('/login_register')
      })
      .catch(err => {
        res
          .status(500)
          .send("Error: " + err.message)
      });
  });



  return router;
};


// const id = req.session.userID
//     db.query(`SELECT * FROM users WHERE id = $1`, [id])
//       .then(data => {
//         const user = data.rows[0]
//         console.log(user)
//         res.render('profiles', { user });
//       })

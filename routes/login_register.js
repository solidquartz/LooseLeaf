const express = require('express');
const { user } = require('pg/lib/defaults');
const router = express.Router();
const helperFunctions = require('./helper_functions')

module.exports = (db) => {
  const getUserByEmail = (email) => {
    return db.query(`SELECT * FROM users`)
    .then(res => {
      let currentUser = null;
      for(const user of res.rows) {
        if(user.email.toLowerCase() === email.toLowerCase)
        currentUser = user
        break;
      }
      return user
    })
    .catch(err => {
      return err.message
    })
  }

  router.get("/", (req, res) => {
    const id = req.session.userID;
    res.render("login_register")
  })


  router.post("/login", (req, res) => {
    const { email, password } = req.body
    console.log(req.body, "here hey are")
  })
  router.post("/register", (req, res) => {})
  return router
}







//   router.get("/login_register", (req, res) => {
//     // const id = req.session.userID;
//     // console.log("id", id)
//     db.query(`SELECT * FROM users WHERE id = $1`, [id])
//       .then(data => {
//         console.log("data", data)
//     })
//       .catch(err => {
//         res
//           .status(500)
//           .send("Error: " + err.message);
//       });
//   });
//   return router;
// };

// const login = function(email, password) {

// }

// router.post("/login_register", (req, res) => {
//   const { email, password } = req.body;
//   .then {

//   }
// const id = req.session.userID
//     db.query(`SELECT * FROM users WHERE id = $1`, [id])
//       .then(data => {
//         const user = data.rows[0]
//         console.log(user)
//         res.render('profiles', { user });
//       })

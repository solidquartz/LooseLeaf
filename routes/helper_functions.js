<<<<<<< HEAD
// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);
db.connect();


=======
// const { Pool } = require("pg");
// const dbParams = require("./lib/db.js");
// const db = new Pool(dbParams);
// db.connect();




// module.exports = { getUserByEmail }
>>>>>>> 9971d72fb9d7f149677ffc9adb0c0a43f1d51d5d
const getDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const date = `${year}-${month}-${day}`;
  return date;
}

const getCategories = () => {
  return db.query(`SELECT * FROM categories;`)
  .then(data => {
    const categories = [];
    for (const key in data.rows) {
      categories.push(data.rows[key].name);
    }
    return categories;
  })
}

const getCategoriesObject = () => {
  return db.query(`SELECT * FROM categories ORDER BY name;`)
    .then(data => {
      return data.rows
    })
}


module.exports = {getDate, getCategories, getCategoriesObject};

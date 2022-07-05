// // PG database client/connection setup
// const { Pool } = require("pg");
// const dbParams = require("../lib/db.js");
// const db = new Pool(dbParams);
// db.connect();


const getDate = (db) => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const date = `${year}-${month}-${day}`;
  return date;
};

const getCategories = (db) => {
  return db.query(`SELECT * FROM categories;`)
    .then(data => {
      const categories = [];
      for (const key in data.rows) {
        categories.push(data.rows[key].name);
      }
      return categories;
    });
};

const getCategoriesObject = (db) => {
  return db.query(`SELECT * FROM categories ORDER BY name;`)
    .then(data => {
      return data.rows;
    });
};

const getAllResources = (db) => {
  return db.query(`SELECT * FROM resources;`)
    .then(data => {
      return data.rows;
    });
};

const getAllResourcesAndCategories = (db) => {
  const queries = [getAllResources(db), getCategories(db)];
  return Promise.all(queries).catch(err =>
    console.log("getAllResourcesAndCategories: ", err.message));
};



module.exports = { getDate, getCategories, getCategoriesObject, getAllResources, getAllResourcesAndCategories };

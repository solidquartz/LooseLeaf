// // PG database client/connection setup
// const { Pool } = require("pg");
// const dbParams = require("../lib/db.js");
// const db = new Pool(dbParams);
// db.connect();

// Query Functions
const getAllCategories = (db) => {
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

const getRatings = (db, resourceID) => {
  return db.query(`SELECT * FROM ratings WHERE resource_id = ${resourceID};`)
    .then(data => {
      return data.rows
    })
};

const getLikes = (db, resourceID) => {
  return db.query(`SELECT * FROM likes WHERE resource_id = ${resourceID};`)
    .then(data => {
      return data.rows
    })
};

const getComments = (db, resourceID) => {
  return db.query(`SELECT * FROM comments WHERE resource_id = ${resourceID};`)
    .then(data => {
      return data.rows
    })
};

const getResourceInfo = (db, resourceID) => {
  return db.query(`
  SELECT *
  FROM resources
  JOIN categories ON category_id = categories.id
  JOIN users ON user_id = users.id
  WHERE resources.id = ${resourceID};`)
    .then(data => {
      return data.rows
    })
};

const getAllResourceInfo = (db, resourceID) => {
  const queries = [getResourceInfo(db, resourceID), getRatings(db, resourceID), getLikes(db, resourceID), getComments(db, resourceID)];
  return Promise.all(queries).catch(err =>
    console.log("getAllResourceInfo: ", err.message));
}

const getAllResourcesAndCategories = (db) => {
  const queries = [getAllResources(db), getAllCategories(db)];
  return Promise.all(queries).catch(err =>
    console.log("getAllResourcesAndCategories: ", err.message));
};

// Other functions
const getAvgRating = (ratingsArr) => {
  let sum = 0;
  for (const ratingObj of ratingsArr) {
    sum += ratingObj.rating;
  }
  return sum/ratingsArr.length;
}

const getDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const date = `${year}-${month}-${day}`;
  return date;
};

module.exports = {
  getDate,
  getAllCategories,
  getAllResources,
  getAllResourcesAndCategories,
  getAllResourceInfo,
  getAvgRating
};

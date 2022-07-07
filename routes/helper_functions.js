// // PG database client/connection setup
// const { Pool } = require("pg");
// const dbParams = require("../lib/db.js");
// const db = new Pool(dbParams);
// db.connect();

////////// Categories Table Queries /////////
const getAllCategories = (db) => {
  return db.query(`SELECT * FROM categories ORDER BY name;`)
    .then(data => {
      return data.rows;
    });
};


////////// Resources Table Queries /////////

const getAllResources = (db) => {
  return db.query(`SELECT * FROM resources;`)
    .then(data => {
      return data.rows;
    });
};

const getMyCreatedResources = (db, userId) => {
  return db.query(`
  SELECT * FROM resources
  JOIN users ON user_id = users.id
  WHERE user_id = $1
  `, [userId])
    .then(data => {
      return data.rows;
    });
};

const getMyLikedResources = (db, userId) => {
  return db.query(`
  SELECT * FROM resources
  JOIN likes ON resource_id = resources.id
  WHERE likes.user_id = $1`, [userId])
    .then(data => {
      return data.rows;
    });
};


const getAllMyResources = (db, userId) => {
  const promises = [getMyCreatedResources(db, userId), getMyLikedResources(db, userId)];
  return Promise.all(promises)
    .then(data => {
      let resources = [];
      for (const resourceInfo of data) {
        resources.push(resourceInfo);
      }
      return { resources };
    });

};

///////// Ratings Table Queries /////////

const getRatings = (db, resourceID) => {
  return db.query(`SELECT * FROM ratings WHERE resource_id = $1;`, [resourceID])
    .then(data => {
      return data.rows;
    });
};


////////// Likes Table Queries /////////

const getLikes = (db, resourceID) => {
  return db.query(`SELECT * FROM likes WHERE resource_id = $1;`, [resourceID])
    .then(data => {
      return data.rows;
    });
};

const hasLiked = (db, userID, resourceID) => {
  return db.query(`SELECT * FROM likes WHERE user_id = $1 AND resource_id = $2;`, [userID, resourceID])
    .catch((err) => err.message);
};

const addLike = (db, userID, resourceID) => {
  return db.query(`INSERT INTO likes (user_id, resource_id) VALUES ($1, $2);`, [userID, resourceID])
    .catch((err) => err.message);
};

const removeLike = (db, userID, resourceID) => {
  return db.query(`DELETE FROM likes WHERE user_id = $1 AND resource_id = $2;`, [userID, resourceID])
    .catch((err) => err.message);
};

////////// Comments Table Queries /////////

const getComments = (db, resourceID) => {
  return db.query(`SELECT * FROM comments WHERE resource_id = $1;`, [resourceID])
    .then(data => {
      return data.rows;
    });
};


const getCommentsInfo = (db, resourceID) => {
  return db.query(`SELECT * FROM comments
  JOIN users ON user_id = users.id
  WHERE resource_id = $1;`, [resourceID])
    .then(data => {
      return data.rows;
    });
};


const addComment = (db, userId, comment, resourceID) => {
  return db.query(`INSERT INTO comments (user_id, comment, resource_id)
  VALUES ($1, $2, $3)
  RETURNING *;`, [userId, comment, resourceID])
    .catch((err) => err.message);
};

////////// Users Table Queries /////////
const updateUserInfo = (db, name, email, password, id) => {
  return db.query(`UPDATE users
  SET name = $1, email = $2, password = $3
  WHERE id = $4
  RETURNING *;`, [name, email, password, id])
    .catch((err) => err.message);
};

const getUserByEmail = (db, email) => {
  return db.query(`SELECT * FROM users WHERE email = $1`, [email])
    .then(user => {
      return user;
    })
    .catch((err) => err.message);
};

const addUser = (db, name, email, password) => {
  return db.query(`INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`, [name, email, password])
    .catch((err) => err.message);
};

const getUserNameById = (db, id) => {
  return db.query(`SELECT name FROM users WHERE id = $1`, [id])
    .catch((err) => err.message);
};


///// Multiple Table Queries ///////
const getAllResourcesAndCategories = (db) => {
  const queries = [getAllResources(db), getAllCategories(db)];
  return Promise.all(queries).catch(err =>
    console.log("getAllResourcesAndCategories: ", err.message));
};

const getFilteredResourcesByCategory = (db, id) => {
  return db.query(`
  SELECT * FROM resources
  JOIN categories ON category_id = categories.id
  WHERE category_id = $1
`, [id])
    .then(data => {
      return data.rows;
    });
};

const getResourceInfo = (db, resourceID) => {
  return db.query(`
  SELECT *
  FROM resources
  JOIN categories ON category_id = categories.id
  JOIN users ON user_id = users.id
  WHERE resources.id = $1;`, [resourceID])
    .then(data => {
      return data.rows;
    });
};



const getAllResourceInfo = (db, resourceID) => {
  const queries = [getResourceInfo(db, resourceID), getRatings(db, resourceID), getLikes(db, resourceID), getComments(db, resourceID)];
  return Promise.all(queries).catch(err =>
    console.log("getAllResourceInfo: ", err.message));
};

const getTemplateVars = (db, userId) => {
  const promises = [getAllCategories(db), getUserNameById(db, userId)];
  return Promise.all(promises)
    .then(data => {
      let name = null;
      if (data[1].rows.length !== 0) {
        name = data[1].rows[0].name;
      }
      return { categories: data[0], name };
    });

};

//////// Search ////////
const searchResources = (db, searchInput) => {
  return db.query(`
  SELECT * FROM resources
  JOIN categories ON category_id = categories.id
  WHERE resources.title LIKE '%$1%';`, [searchInput])
    .then(data => {
      console.log("data: ", data);
      return data;
    })
    .catch((err) => err.message);
};



module.exports = {
  getAllCategories,
  getFilteredResourcesByCategory,
  getAllResources,
  getAllResourcesAndCategories,
  getAllResourceInfo,
  updateUserInfo,
  getUserByEmail,
  addUser,
  getUserNameById,
  getTemplateVars,
  addLike,
  removeLike,
  getMyLikedResources,
  hasLiked,
  getLikes,
  getMyCreatedResources,
  getAllMyResources,
  addComment,
  getComments,
  getCommentsInfo,
  searchResources
};

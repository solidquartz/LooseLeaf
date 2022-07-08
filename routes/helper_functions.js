
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
      if (!data[0] && !data[1]) {
        return { resources: [] };
      }

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

const hasRated = (db, userID, resourceID) => {
  return db.query(`SELECT * FROM ratings WHERE user_id = $1 AND resource_id = $2;`, [userID, resourceID])
    .catch((err) => err.message);
};

const addRating = (db, userID, resourceID, rating) => {
  return db.query(`INSERT INTO ratings (user_id, rating, resource_id) VALUES ($1, $2, $3);`, [userID, rating, resourceID])
    .then(data => {
      getRatings(db, resourceID)
        .then(allRatings => {
          const resourceAverage = getAvgRating(allRatings);
          return db.query(`UPDATE resources
      SET average_rating = $2
      WHERE id = $1`, [resourceID, resourceAverage]);
        });

    });

};

const removeRating = (db, userID, resourceID) => {
  return db.query(`DELETE FROM ratings WHERE user_id = $1 AND resource_id = $2;`, [userID, resourceID])
    .then(data => {
      getRatings(db, resourceID)
        .then(allRatings => {
          const resourceAverage = getAvgRating(allRatings);
          return db.query(`UPDATE resources
      SET average_rating = $2
      WHERE id = $1`, [resourceID, resourceAverage]);
        });
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
    .then(data => {
      return db.query(`UPDATE resources
      SET total_likes = total_likes + 1
      WHERE id = $1`, [resourceID]);
    });
};

const removeLike = (db, userID, resourceID) => {
  return db.query(`DELETE FROM likes WHERE user_id = $1 AND resource_id = $2;`, [userID, resourceID])
    .then(data => {
      return db.query(`UPDATE resources
    SET total_likes = total_likes - 1
    WHERE id = $1`, [resourceID]);
    });
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
    .then(response => {
      return db.query(`UPDATE resources
      SET total_comments = total_comments + 1
      WHERE id = $1;`, [resourceID]);
    });
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
  const lowerSearchInput = searchInput.toLowerCase();
  return db.query(
    {
      text: `SELECT * FROM resources
  JOIN categories ON category_id = categories.id
  WHERE LOWER(resources.title) LIKE $1 OR LOWER(resources.description) LIKE $1 OR LOWER(categories.name) LIKE $1 OR LOWER(resources.url) LIKE $1;`,
      values: ['%' + lowerSearchInput + '%']
    })
    .then(res => {
      return res.rows;
    });
};


const getAvgRating = (ratingsArr) => {
  if (ratingsArr.length === 0) {
    return 0;
  }

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
  const numOfRatings = ratingsObjArr.length;
  const commentsArr = getCommentsArr(commentsObjArr);
  const numOfComments = commentsArr.length;
  const name = resourceInfoObj.name;



  const templateVars = {
    title,
    url,
    description,
    imgURL,
    date,
    numOfLikes,
    avgRating,
    numOfRatings,
    commentsArr,
    numOfComments,
    resourceID,
    name
  };
  return templateVars;
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
  searchResources,
  hasRated,
  addRating,
  removeRating,
  getRatings,
  getComments,
  getCommentsInfo,
  makeTemplateVarsforResource,
  getDate,
  getCommentsArr,
  getAvgRating

};

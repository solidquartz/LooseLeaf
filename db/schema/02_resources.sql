DROP TABLE IF EXISTS resources CASCADE;

CREATE TABLE resources (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255) NOT NULL,
  date_created DATE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  total_comments INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  average_rating INTEGER DEFAULT 0
);

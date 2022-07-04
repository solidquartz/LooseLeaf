CREATE TABLE ratings (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE
);

INSERT INTO ratings (user_id, rating, resource_id)
VALUES (1, 4, 3);

INSERT INTO ratings (user_id, rating, resource_id)
VALUES (1, 3, 2);

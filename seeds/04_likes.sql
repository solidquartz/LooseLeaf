CREATE TABLE likes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE
);

INSERT INTO ratings (user_id, resource_id)
VALUES (1, 3);

INSERT INTO ratings (user_id, resource_id)
VALUES (2, 3);


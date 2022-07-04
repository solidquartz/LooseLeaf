CREATE TABLE comments (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE
);

INSERT INTO ratings (user_id, comment, resource_id)
VALUES (2, 'Great choice!', 3);

INSERT INTO ratings (user_id, resource_id)
VALUES (1, 'Nice resource', 3);


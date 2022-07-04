CREATE TABLE tags (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE
);

INSERT INTO tags (user_id, name, resource_id)
VALUES (1, other, 1);

INSERT INTO tags (user_id, name, resource_id)
VALUES (2, learning, 3);

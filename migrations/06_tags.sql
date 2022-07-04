CREATE TABLE tags (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE
);

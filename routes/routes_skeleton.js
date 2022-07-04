// Show home page
app.get("/home", (req, res) => {
  res.render("home");
});


// Shows register page
app.get("/register", (req, res) => {
  res.render("register");
});

// Shows profile page
app.get("/:profileID", (req, res) => {
  res.render("profile");
});

// Shows individual leaf page
app.get("/:leafID", (req, res) => {
  res.render("leaf");
});

// Shows create individual leaf template page
app.get("/:leafID/create", (req, res) => {
  res.render("leaf_create");
});

// Shows create individual leaf edit page  --> Do we need this page or can it just be the leaf page?
app.get("/:leafID/edit", (req, res) => {
  res.render("leaf_edit");
});

// Shows all resources (toggle b/w all, likes and created)
app.get("/:leaves", (req, res) => {
  res.render("leaves");
});

// Redirect to external URL
app.get("/external_url", (req, res) => {
  // get the long URL somehow (maybe from leaf object)
  res.redirect(externalURL);
});



// Creates a new user
app.post("/register", (req, res) => {
  res.redirect('/home');
});

// Logs out user
app.post("/logout", (req, res) => {
  res.redirect('/home');
});

// Creates new leaf  --> do we need an ID for this one or just use a gerenic create page since its all the same?
app.post("/:leafID/create", (req, res) => {
  // After creating leaf redirect to leaf page
  res.redirect('/leaf');
});

// Edits new leaf
app.post("/:leafID/edit", (req, res) => {
  // After editing leaf redirect to leaf page
  res.redirect('/leaf');
});

// Edits new leaf
app.post("/:profileID/edit", (req, res) => {
  // After editing profile redirect back to profile page
  res.redirect('/profile');
});

// Delete individual created resource
app.post("/:leafID/delete", (req, res) => {
  // After deleting leaf redirect back to home
  res.redirect('/home');
});

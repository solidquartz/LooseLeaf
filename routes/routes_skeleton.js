// Show home page
app.get("/index", (req, res) => {
  res.render("index");
});


// Shows register page
app.get("/register", (req, res) => {
  res.render("register");
});

// Shows profile page
app.get("/profiles/:profile_id", (req, res) => {
  res.render("profile");
});

// Shows individual leaf page
app.get("/resources/:resource_id", (req, res) => {
  res.render("resource");
});

// Shows create individual leaf template page
app.get("/resources/create", (req, res) => {
  res.render("resource_create");
});

// Shows create individual leaf edit page
app.get("/resources/:resourceID/edit", (req, res) => {
  res.render("resource_edit");
});

// Shows all resources (toggle b/w all, likes and created)
app.get("/resources", (req, res) => {
  res.render("resources");
});

// Redirect to external URL
app.get("/external", (req, res) => {
  // get the long URL somehow (maybe from leaf object)
  res.redirect(externalURL);
});

// Logs in user
app.post("/login", (req, res) => {
  res.redirect('/home');
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
app.post("/resources/create", (req, res) => {
  // After creating leaf redirect to leaf page
  res.redirect('/resource');
});

// Edits new leaf
app.post("/:profileID/edit", (req, res) => {
  // After editing profile redirect back to profile page
  res.redirect('/profile');
});

// Delete individual created resource
app.post("/resources/:resourceID/delete", (req, res) => {
  // After deleting leaf redirect back to home
  res.redirect('/home');
});

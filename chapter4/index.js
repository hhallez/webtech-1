const express = require("express");
const handlebars = require("express-handlebars");

const app = express();

app.set("port", process.env.PORT || 3000);
app.engine("handlebars", handlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//home page
app.get("/", (req, res) => {
  res.render("home");
});

// 404 page
app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not found");
});

// 500 page
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.type("text/plain");
  res.status(500);
  res.send("500 - Server error");
});

app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost: " + app.get("port"));
});

const express = require("express");
const handlebars = require("express-handlebars");
const quotes = require("./lib/quotes.js");
const authors = require("./lib/authors.js");

const app = express();

app.set("port", process.env.PORT || 3000);
app.engine("handlebars", handlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//middleware
app.use(express.static(__dirname + "/public"));

app.use((req, res, next) =>{
  res.locals.authors = authors.getAuthors();
  next();
});


//home page
app.get("/", (req, res) => {
  res.render("home", {quote: quotes.random()});
});

//about page
app.get("/about", (req, res) => {
  res.render("about");
});

// 404 page
app.use((req, res) => {
  res.status(404);
  res.render("404");
});

// 500 page
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500);
  res.render("500");
});

app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost: " + app.get("port"));
});

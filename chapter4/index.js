const express = require("express");
const handlebars = require("express-handlebars");
const quotes = require("./lib/quotes.js");
const authors = require("./lib/authors.js");
const bodyParser = require("body-parser");

const app = express();

app.set("port", process.env.PORT || 3000);
app.engine("handlebars", handlebars({
  defaultLayout: "main", helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }}}));
app.set("view engine", "handlebars");

//middleware
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) =>{
  res.locals.authors = authors.getAuthors();
  next();
});

//home page
app.get("/", (req, res) => {
  res.render("home", {quote: quotes.random(), csrf:"CSRF token goes here"});
});

app.post("/process", (req, res) => {
    console.log("Form: " + req.query.form);
    console.log("CSRF: " + req.body._csrf);
    console.log("Name: " + req.body.name);
    console.log("Email: " + req.body.email);
    res.redirect(303, "/thank-you");
});

//thank-you page
app.get("/thank-you", (req, res) => {
  res.render("thankyou");
});

//about page
app.get("/about", (req, res) => {
  res.render("about");
});

//section page
app.get("/section", (req, res) => {
  res.render("section", {layout:"headbottom"});
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

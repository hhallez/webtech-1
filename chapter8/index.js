const express = require("express");
const handlebars = require("express-handlebars");
const formidable = require("formidable");
const credentials = require("./credentials.js");
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync(__dirname + "/ssl/project.pem"),
  cert: fs.readFileSync(__dirname + "/ssl/project.crt")
};

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

//home page
app.get("/", (req, res) => {
  const now = new Date();
  res.render("home");
});

//Upload form handling
app.post("/authenticate", (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if(err) return res.redirect(303, "/error");
    res.redirect(303, "/private");
  });
});

app.get("/private", (req, res) => {
  res.render("private");
});

//error page
app.get("/error", (req, res) => {
  res.render("500");
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

https.createServer(options, app).listen(app.get("port"), () => {
  console.log("Server started on https://localhost:" + app.get("port"));
});

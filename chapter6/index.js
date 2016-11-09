const express = require("express");
const handlebars = require("express-handlebars");
const info = require("./lib/info.js");

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

//home page: XMLHTTP example
app.get("/", (req, res) => {
  res.render("home", {layout:"headandbottom"});
});

//Ajax responseText
app.get("/info", (req, res) => {
  res.type("text/plain");
  res.send("Ajax did it!");
});

//Ajax Handlebars
app.get("/featured", function(req,res){
  res.render("featured", {layout:"headandbottom"});
});

//Ajax Handlebars
app.get("/data/user", function(req, res){
  res.json(info.getRandomUser());
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

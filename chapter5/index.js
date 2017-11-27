const express = require("express");
const handlebars = require("express-handlebars");
const formidable = require("formidable");
const fs = require("fs");
const credentials = require("./credentials.js");

const app = express();

const dataDir = __dirname +"/data";
const photoDir = dataDir + "/photo";
const mv = require("mv");

const user = require("./models/user.js");

const dburl = credentials.dbconnection;
const mongoose = require("mongoose");
const opts = {
  server: {
    socketOptions: {keepAlive: 1}
  }
};

mongoose.connect(dburl, opts);

if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if(!fs.existsSync(photoDir)) fs.mkdirSync(photoDir);

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
  res.render("home", {
    year: now.getFullYear(), month: now.getMonth()
  });
});

//Upload form handling
app.post("/upload/:year/:month", (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if(err) return res.redirect(303, "/error");

    new user({name: fields.name, email: fields.email}).save();

    const photo = files.photo;
    const dir = photoDir + "/" + Date.now();
    const path = dir + "/" + "uploadedphoto.jpg";

    fs.mkdirSync(dir);

    mv(photo.path.toString(), path.toString(), (err) =>{
      if(err) console.log("Error - moving resource from tmp to data directory");
    });

    res.redirect(303, "/upload-succeeded");
  });
});

app.get("/upload-succeeded", (req, res) => {
  res.render("upload-succeeded");
});

app.get("/users", (req, res) => {
  user.find({}, (err, users) => {
    const context = {
      users: users.map((user) => {
        return{name: user.name,
              email: user.email};
      })
    };
    res.render("users", context);
  });
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

app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost:" + app.get("port"));
});

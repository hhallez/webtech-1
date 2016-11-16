const express = require("express");
const handlebars = require("express-handlebars");

const credentials = require("./credentials.js");

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

const mailer = require("nodemailer");

const transporter = mailer.createTransport({
  service: "Mailgun",
  auth: {
    user: credentials.postmaster,
    pass: credentials.pwmailgun
  }
});

const email = {
  from: "Sinterklaas",
  to: credentials.emailTo,
  subject: "Hello NodeMailer!",
  text: "Look Ma, unicode symbols ✔",
  html: "<strong>Look Ma, unicode symbols ✔</strong>"
};


//middleware
app.use(express.static(__dirname + "/public"));

//home page
app.get("/", (req, res) => {
  transporter.sendMail(email, (error, info)=>{
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  res.render("home");
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

const http = require('http'), fs = require("fs");
const hostname = '127.0.0.1';
const port = 3000;

function serveStaticFile(res, path, contentType, responseCode) {
  if(!responseCode) responseCode = 200;
  fs.readFile(__dirname + path, (err,data) => {
    if(err) {
      res.writeHead(500, {"Content-Type": "text/plain"});
      res.end("500 - Internal Error");
    } else {
      res.writeHead(responseCode, {"Content-Type": contentType});
      res.end(data);
    }
  })
}

const server = http.createServer((req, res) => {
  const path = req.url.replace(/\/?(?:\?.*)?$/, "").toLowerCase();
  switch(path){
    case "": serveStaticFile(res, "/public/home.html", "text/html");
             break;
    case "/about": serveStaticFile(res, "/public/about.html", "text/html");
             break;
    case "/img/hello.png" : serveStaticFile(res, "/public/img/hello.png", "image/png");
             break;
    default: serveStaticFile(res, "/public/404.html", "text/html", 404);
             break;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

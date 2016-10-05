const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    const path = req.url.replace(/\/?(?:\?.*)?$/, "").toLowerCase();
    switch (path) {
        case "": res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Home");
            break;
        case "/about": res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("About");
            break;
        default: res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("This is not the page you are looking for...");
            break;  }});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

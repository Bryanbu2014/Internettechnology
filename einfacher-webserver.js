const http = require('http');
const hostname = '127.0.0.1';
const port = 8080;

const server = http.createServer((req, res) => {res.statusCode = 200;
res.setHeader('Content-Type', 'text/html');
res.end('<!DOCTYPE html><html><head></head><body><h1>Mensch super das geht!</h1></body></html>')});

server.listen(port, hostname, () => {
    console.log('Server laeuft unter http://'+hostname+':'+port);

});
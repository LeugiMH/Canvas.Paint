const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { Socket } = require('dgram');
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.sendFile(__dirname + '\public\index.html');
});

    let desenhos = [];

io.on('connection', (socket) => {
    console.log('Usuário conectado');

    socket.emit('desenhos antigos', desenhos);

    socket.on('desenhar', (desenho) => {
        desenhos.push(desenho);
        io.emit('desenho', desenho);
    });

    socket.on('disconnect', () => {
        console.log("Usuário desconectado");
    });
});

server.listen(3000, () => {
    console.log('listening on: 3000');
});
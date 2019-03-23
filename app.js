
const express = require('express');
var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent') // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

const database = require("./database");
    // Chargement de la page index.html


    app.use(express.json({extended : false})); // pour supporter JSON-encoded bodies name=blabla&firstname=gnagna...

    
app.get('/', function (req, res) {
    res.sendFile('./client/index.html');
    });



app.get('/user', function (req, res) {

    database.getUsers(function(user){
        console.log(req.body);
        res.send(user);
        
        }, null);
    })

app.post('/user', function (req, res) {

    database.sendUser(function(user){
        console.log(req.body);
        res.send(user);
        
        }, req.body);
    })







app.get('/chat.html', function (req, res) {
  res.sendfile(__dirname + '/client/chat.html');
  
});

io.sockets.on('connection', function (socket, pseudo) {
    
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
        console.log(pseudo, "connecté");
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 


    socket.on('disconnect', function(pseudo){
        io.sockets.emit('logout', socket.pseudo);
        console.log(socket.pseudo, "déconnecté");
    });
});

const ip = '192.168.0.16';
const port = 8181;
server.listen(port, ip);
console.log("coucou le chat est sur l'url : http://" + ip + ":" + port + "/chat.html" );

// changer l'ip si ne fonctionne pas
// lancer le chat avec 'nodemon app.js'
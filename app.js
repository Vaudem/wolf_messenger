// var http = require('http');
// var fs = require('fs');

// // Chargement du fichier index.html affiché au client
// var server = http.createServer(function(req, res) {
//     fs.readFile('./index.html', 'utf-8', function(error, content) {
//         res.writeHead(200, {"Content-Type": "text/html"});
//         res.end(content);
//     });
// });

// // Chargement de socket.io
// var io = require('socket.io').listen(server);

// // Quand un client se connecte, on le note dans la console
// io.sockets.on('connection', function (socket) {
//     console.log('Coucou Vanessa! Un client est connecté !');
// });



// io.sockets.on('connection', function (socket) {
//     socket.emit('message', 'Vous êtes bien connecté !');
  
// });


// //bouton "embêter"
// io.sockets.on('connection', function (socket) {
//     socket.on('message', function (message) {
//         console.log('Un client me parle ! Il me dit : ' + message);
//     }); 
// });

    
// io.sockets.on('connection', function (socket) {
//     socket.on('nom', function (pseudo) {
//         console.log(pseudo + ' est dans la place !!');
//     }); 
// });





var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent') // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 
});


server.listen(8080, '192.168.0.15');
const mysql = require('mysql'); // on récupère le module SQL

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'wolf',
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
});

connection.connect(function(){
    console.log("coucou database connectée");
});

const end = function end(){
    connection.end();
};



const getUsers = function getUsers(clbk,id){
    var sql;
    if(!id){
        //sql = "SELECT vinyl.id, vinyl.name, vinyl.artist, vinyl.price, vinyl.quantity, label.name as 'nom_marque', vinyl.description, label.id as 'id_marque' FROM vinyl INNER JOIN label ON label.id = vinyl.id_label";
        sql = "SELECT * FROM users"
    } else {
        //sql = "SELECT vinyl.id, vinyl.name, vinyl.artist, vinyl.price, vinyl.quantity, label.name as 'nom_marque', vinyl.description, label.id as 'id_marque' FROM vinyl INNER JOIN label ON label.id = vinyl.id_label WHERE vinyl.id = ?";
        sql = "SELECT * FROM users WHERE id=?"
    };

    connection.query(sql, [id], function(error,results,fields){
        console.log(this.sql);
        if (error) throw error;
        clbk(results);
    });
};

const sendUser = function sendUser (clbk,payload){
    console.log(payload);
    const data = [payload.pseudo, payload.mdp, payload.avatar, payload.mail];
    var sql = "INSERT INTO users (pseudo, mdp, avatar, mail) VALUES (?,?,?,?)";
    connection.query(sql, data, function(error,results){  
        if (error) throw error;
        console.log(results); 
        return clbk(results);  
    });

};


// const deleteVinyl = function deleteVinyl(clbk,id){
    
//     var sql = "DELETE FROM `vinyl` WHERE `vinyl`.`id` = ?";
//     connection.query(sql, [id], function(error,results,fields){  
//         if (error) throw error;
//         console.log(results); 
//         return clbk(results);  
//     });

// };


// const updateVinyl = function updateVinyl(clbk, payload){
//     var sql;
//     sql = "UPDATE vinyl SET name = ? , artist = ? , price = ? , description = ? , quantity = ? WHERE id = ?";
//     var data = [payload.name, payload.artist, payload.price, payload.description, payload.quantity, payload.id];
//     connection.query(sql, data, function(error, results, fields){
//         if (error) throw error;
//         console.log(results);
//         return clbk(results);
//     });
// };


//SELECT vinyl.id, vinyl.name, vinyl.artist, vinyl.price,label.name as 'nom_marque', vinyl.description, label.id as 'id_marque' FROM vinyl INNER JOIN label ON  label.id= vinyl.id_label;

// const join = function join(clbk,id){

// }





module.exports = {
    getUsers,
    sendUser,
    //deleteVinyl,
    //updateVinyl,
    end
}; 
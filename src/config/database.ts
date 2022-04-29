var mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'aluni-node'
});

connection.connect((err) => {
    if(err) throw err;
    console.log('Connected to MySQL Server!');
});

export default connection;
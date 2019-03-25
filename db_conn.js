const pgp = require("pg-promise")();
const creds = require("./creds");

var options = {
    host: "localhost",
    port: 5432,
    database: "pokemongan",
    user: creds.username,
    password: creds.password,
};
var db = pgp(options);
exports.db = db;
/* (async () => {
    var data = await db.any("SELECT * FROM users ORDER BY id ASC");
    console.log(data);
    db.$pool.end();
})(); */

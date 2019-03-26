const csv = require("csv-parser");
const fs = require("fs");
const db = require("./db_conn").db;

var data = {};

String.prototype.replaceAll = function(search, replace) {
    var target = this;
    return target.split(search).join(replace);
};

async function read_pokemon() {
    var writes = [];
    values = "";
    fs.createReadStream("./pokemon.csv")
        .pipe(csv())
        .on("data", data => {
            try {
                data = Object.values(data);
                //prettier-ignore
                values += `(${data[0]}, '${data[1]}', ${data[2]}, ${data[3]}, ${data[4]}, ${data[5]}, ${data[6]}, '${data[7]}')`;
                values += ", ";
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            db.none(
                "INSERT INTO pokemon VALUES" +
                    values.slice(0, values.length - 2)
            ).then("done");
            console.log(values);
        });
}

function read_learn_moves() {
    values = "";
    fs.createReadStream("./pokemon_moves_gen7.csv")
        .pipe(csv())
        .on("data", data => {
            values = "";
            try {
                data = Object.values(data);
                //prettier-ignore
                values += `(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]}, ${data[4]}`;
                values += ")";
                db.none("INSERT INTO moveslearned VALUES" + values).then(() =>
                    console.log("doe")
                );
                console.log(values);
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            console.log("done");
            db.none(
                "INSERT INTO moves VALUES" + values.slice(0, values.length - 2)
            ).then(() => console.log("doe"));
            console.log("done");
            console.log(values);
        });
}

function read_moves() {
    fs.createReadStream("./moves.csv")
        .pipe(csv())
        .on("data", datum => {
            try {
                values = "(";
                pruned_datum = { ...datum };
                delete pruned_datum.contest_type_id;
                delete pruned_datum.contest_effect_id;
                delete pruned_datum.super_contest_effect_id;
                for (key of Object.keys(pruned_datum)) {
                    if (pruned_datum[key] == "") {
                        values += "NULL";
                    } else if (key == "identifier") {
                        values += "'" + pruned_datum[key] + "'";
                    } else {
                        values += pruned_datum[key];
                    }
                    values += ", ";
                }
                values = values.slice(0, values.length - 2);
                values += ")";
                db.none("INSERT INTO moves VALUES" + values).then(() => {
                    console.log("inserted");
                });
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            //read_stats(target_data);
        });
}

function read_stats(id) {
    let values = { level: 50 };
    input = fs.createReadStream("./pokemon_stats.csv");
    input
        .pipe(csv())
        .on("data", datum => {
            try {
                if (id == datum.pokemon_id) {
                    switch (datum.stat_id) {
                        case "1":
                            values.HP = parseInt(datum.base_stat);
                            break;
                        case "2":
                            values.Attack = parseInt(datum.base_stat);
                            break;
                        case "3":
                            values.Defense = parseInt(datum.base_stat);
                            break;
                        case "4":
                            values.SpAttack = parseInt(datum.base_stat);
                            break;
                        case "5":
                            values.SpDefense = parseInt(datum.base_stat);
                            break;
                        case "6":
                            values.Speed = parseInt(datum.base_stat);
                            break;
                    }
                }
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            delete values.level;
            console.log(id, values);
            db.none(
                "INSERT INTO basestats VALUES($1, $2, $3, $4, $5, $6, $7)",
                [
                    id,
                    values.HP,
                    values.Attack,
                    values.Defense,
                    values.SpAttack,
                    values.SpDefense,
                    values.Speed
                ]
            ).then(() => {
                console.log("inserted");
            });
        })
        .on("close", err => {
            console.log("stream closed");
            console.log(values);
        });
}

async function read_abilities() {
    var writes = [];
    values = "";
    fs.createReadStream("./abilities.csv")
        .pipe(csv())
        .on("data", data => {
            try {
                data = Object.values(data);
                //prettier-ignore
                values += `(${data[0]}, '${data[1]}', ${data[2]}, '${data[3]}')`;
                values += ", ";
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            db.none(
                "INSERT INTO abilities VALUES" +
                    values.slice(0, values.length - 2)
            ).then("done");
            console.log(values);
        });
}

async function read_abilities_learned() {
    var writes = [];
    values = "";
    fs.createReadStream("./pokemon_abilities.csv")
        .pipe(csv())
        .on("data", data => {
            try {
                data = Object.values(data);
                //prettier-ignore
                values += `(${data[0]}, ${data[1]}, '${data[2]}', ${data[3]})`;
                values += ", ";
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            db.none(
                "INSERT INTO abilitieslearned VALUES" +
                    values.slice(0, values.length - 2)
            ).then("done");
            console.log(values);
        });
}

async function read_item_categories() {
    var writes = [];
    values = "";
    fs.createReadStream("./item_categories.csv")
        .pipe(csv())
        .on("data", data => {
            try {
                data = Object.values(data);
                //prettier-ignore
                values += `(${data[0]}, ${data[1]}, '${data[2]}')`;
                values += ", ";
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            db.none(
                "INSERT INTO itemcategories VALUES" +
                    values.slice(0, values.length - 2)
            ).then("done");
            console.log(values);
        });
}

async function read_fling_effects() {
    var writes = [];
    values = "";
    fs.createReadStream("./item_fling_effects.csv")
        .pipe(csv())
        .on("data", data => {
            try {
                data = Object.values(data);
                //prettier-ignore
                values += `(${data[0]}, '${data[1]}')`;
                values += ", ";
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            db.none(
                "INSERT INTO flingeffects VALUES" +
                    values.slice(0, values.length - 2)
            ).then("done");
            console.log(values);
        });
}

async function read_items() {
    var writes = [];
    let values = "";
    fs.createReadStream("./items.csv")
        .pipe(csv())
        .on("data", datum => {
            try {
                //prettier-ignore
                values += "(";
                for (key of Object.keys(datum)) {
                    if (datum[key] == "") {
                        values += "NULL";
                    } else if (key == "identifier") {
                        values += "'" + datum[key] + "'";
                    } else {
                        values += datum[key];
                    }
                    values += ", ";
                }
                values = values.slice(0, values.length - 2);
                values += "), ";
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            db.none(
                "INSERT INTO items VALUES" + values.slice(0, values.length - 2)
            ).then("done");
            console.log(values);
        });
}

//read_moves();
//read_learn_moves();
//read_stats();
//read_abilities();
//read_abilities_learned();
//read_item_categories();
//read_fling_effects();
read_items();
/*db.any("SELECT id FROM pokemon")
    .then(data => {
        for (const id of data) {
            console.log(id.id);
            read_stats(id.id);
        }
    })
    .catch(error => {
        throw error;
    });*/

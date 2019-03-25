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

function read_learn_moves(target_data) {
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
                db.none("INSERT INTO moves VALUES" + values).then(() =>
                    console.log("doe")
                );
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            console.log("done");
            /*db.none(
                "INSERT INTO moves VALUES" + values.slice(0, values.length - 2)
            ).then(() => console.log("doe"));*/
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
    values = { level: 50 };
    input = fs.createReadStream("./pokemon_stats.csv");
    input
        .pipe(csv())
        .on("data", datum => {
            try {
                if (id == datum.pokemon_id) {
                    switch (datum.stat_id) {
                        case "1":
                            values.HP = HP_base_to_stat(
                                parseInt(datum.base_stat),
                                values.level
                            );
                            break;
                        case "2":
                            values.Attack = base_to_stat(
                                parseInt(datum.base_stat),
                                values.level
                            );
                            break;
                        case "3":
                            values.Defense = base_to_stat(
                                parseInt(datum.base_stat),
                                values.level
                            );
                            break;
                        case "4":
                            values.SpAttack = base_to_stat(
                                parseInt(datum.base_stat),
                                values.level
                            );
                            break;
                        case "5":
                            values.SpDefense = base_to_stat(
                                parseInt(datum.base_stat),
                                values.level
                            );
                            break;
                        case "6":
                            values.Speed = base_to_stat(
                                parseInt(datum.base_stat),
                                values.level
                            );
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
                "INSERT INTO level50stats VALUES($1, $2, $3, $4, $5, $6, $7)",
                [
                    id,
                    values.HP,
                    values.Attack,
                    values.Defense,
                    values.SpAttack,
                    values.SpDefense,
                    values.Speed,
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

function HP_base_to_stat(base, level) {
    IV = 0;
    EV = 0;
    stat = (base * 2 + IV + (EV / 4) * level) / 100;
    stat = Math.floor(stat);
    stat += level + 10;
    return stat;
}

function base_to_stat(base, level) {
    Nature = 1;
    IV = 0;
    EV = 0;
    stat = 2 * base + IV + EV / 4;
    stat *= level;
    stat /= 100;
    stat = Math.floor(stat) + 5;
    stat *= Nature;
    return stat;
}

async function get_data(pokemon, level) {
    const sleep = m => new Promise(r => setTimeout(r, m));
    data = {
        level,
        move_ids: [],
        moves: [],
    };
    read_pokemon(pokemon);
    await sleep(2000);
    return data;
}

read_moves();
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

exports.get_data = get_data;

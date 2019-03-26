const csv = require("csv-parser");
const fs = require("fs");

var data = {};

function read_pokemon(target) {
    var target_data = data;
    fs.createReadStream("./pokemon.csv")
        .pipe(csv())
        .on("data", data => {
            try {
                if (data.identifier == target) {
                    Object.assign(target_data, data);
                }
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            read_learn_moves(target_data);
        });
}

function read_learn_moves(target_data) {
    fs.createReadStream("./pokemon_moves_gen7.csv")
        .pipe(csv())
        .on("data", data => {
            try {
                if (data.pokemon_id == target_data.id) {
                    target_data.move_ids.push(data.move_id);
                }
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            //console.log('move_id', target_data)
            read_moves(target_data);
        });
}

function read_moves(target_data) {
    fs.createReadStream("./moves.csv")
        .pipe(csv())
        .on("data", datum => {
            try {
                if (target_data.move_ids.includes(datum.id)) {
                    pruned_datum = { ...datum };
                    delete pruned_datum.contest_type_id;
                    delete pruned_datum.contest_effect_id;
                    delete pruned_datum.super_contest_effect_id;
                    target_data.moves.push(pruned_datum);
                }
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            delete target_data.move_ids;
            read_stats(target_data);
        });
}

function read_stats(target_data) {
    fs.createReadStream("./pokemon_stats.csv")
        .pipe(csv())
        .on("data", datum => {
            try {
                if (target_data.id == datum.pokemon_id) {
                    switch (datum.stat_id) {
                        case "1":
                            target_data.HP = HP_base_to_stat(
                                parseInt(datum.base_stat),
                                target_data.level
                            );
                            break;
                        case "2":
                            target_data.Attack = base_to_stat(
                                parseInt(datum.base_stat),
                                target_data.level
                            );
                            break;
                        case "3":
                            target_data.Defense = base_to_stat(
                                parseInt(datum.base_stat),
                                target_data.level
                            );
                            break;
                        case "4":
                            target_data.SpAttack = base_to_stat(
                                parseInt(datum.base_stat),
                                target_data.level
                            );
                            break;
                        case "5":
                            target_data.SpDefense = base_to_stat(
                                parseInt(datum.base_stat),
                                target_data.level
                            );
                            break;
                        case "6":
                            target_data.Speed = base_to_stat(
                                parseInt(datum.base_stat),
                                target_data.level
                            );
                            break;
                    }
                }
            } catch (error) {
                console.error(error);
            }
        })
        .on("end", function() {
            data = target_data;
            console.log(data);
        });
}

function HP_base_to_stat(base, level) {
    IV = 31;
    EV = 0;
    stat = (base * 2 + IV + EV / 4) * (level / 100);
    stat = Math.floor(stat);
    stat += level + 10;
    return stat;
}

function base_to_stat(base, level) {
    Nature = 1;
    IV = 31;
    EV = 252;
    stat = 2 * base + IV + EV / 4;
    stat *= level / 100;
    stat = Math.floor(stat + 5);
    stat *= Nature;
    stat = Math.floor(stat);
    return stat;
}

async function get_data(pokemon, level) {
    const sleep = m => new Promise(r => setTimeout(r, m));
    data = {
        level,
        move_ids: [],
        moves: []
    };
    read_pokemon(pokemon);
    await sleep(2000);
    return data;
}

read_stats({ id: 475, level: 50 });
exports.get_data = get_data;

const db = require("./db_conn").db;

getMovesfromName = async name => {
    moves = await db.any(
        "SELECT DISTINCT moves.id, moves.identifier, type_id, power, pp, accuracy, priority, target_id, damage_class_id, effect_id, effect_chance FROM moves JOIN moveslearned ON moves.id = moveslearned.move_id JOIN pokemon ON pokemon.id = moveslearned.pokemon_id WHERE pokemon.identifier LIKE $1",
        name
    );
    return moves;
};

getMovesfromID = async id => {
    moves = await db.any(
        "SELECT DISTINCT moves.id, moves.identifier, type_id, power, pp, accuracy, priority, target_id, damage_class_id, effect_id, effect_chance FROM moves JOIN moveslearned ON moves.id = moveslearned.move_id WHERE moveslearned.pokemon_id=$1",
        id
    );
    return moves;
};

getMovesfromID(387).then(data => console.log(data));

exports.getMovesfromID = getMovesfromID;
exports.getMovesfromName = getMovesfromName;

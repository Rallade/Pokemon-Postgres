const assert = require("assert");
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

getStatsfromID = async (id, level, EVs, Nature) => {
    assert.equal(Nature.reduce((a, b) => a + b), 5);
    assert.equal(EVs.reduce((a, b) => a + b), 508);
    stats = await db.one("SELECT * FROM basestats WHERE pokemon_id=$1", id);
    stats.hp = HP_base_to_stat(stats.hp, level, EVs[0]);
    stats.attack = base_to_stat(stats.attack, level, EVs[1], Nature[0]);
    stats.defense = base_to_stat(stats.defense, level, EVs[2], Nature[1]);
    stats.specialattack = base_to_stat(
        stats.specialattack,
        level,
        EVs[3],
        Nature[2]
    );
    stats.specialdefense = base_to_stat(
        stats.specialdefense,
        level,
        EVs[4],
        Nature[3]
    );
    stats.speed = base_to_stat(stats.speed, level, EVs[5], Nature[4]);

    return stats;
};

function HP_base_to_stat(base, level, EV) {
    IV = 31;
    stat = (base * 2 + IV + EV / 4) * (level / 100);
    stat = Math.floor(stat);
    stat += level + 10;
    return stat;
}

function base_to_stat(base, level, EV, Nature) {
    let IV = 31;
    let stat = 2 * base + IV + EV / 4;
    stat *= level / 100;
    stat = Math.floor(stat + 5);
    stat *= Nature;
    stat = Math.floor(stat);
    return stat;
}

getStatsfromID(475, 50, [4, 252, 0, 0, 0, 252], [1.1, 1, 0.9, 1, 1]).then(
    data => console.log(data)
);

exports.getMovesfromID = getMovesfromID;
exports.getMovesfromName = getMovesfromName;

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
    stats = await db.one(
        "SELECT * FROM pokemon JOIN basestats ON pokemon.id = basestats.pokemon_id WHERE pokemon_id=$1",
        id
    );
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

getAbilitiesfromID = async id => {
    abilities = await db.any(
        "SELECT * FROM abilitieslearned WHERE pokemon_id=$1",
        id
    );
    for (const ability of abilities) {
        delete ability.pokemon_id;
    }
    return abilities;
};

getAbilityInfo = async id => {
    info = await db.one(
        "SELECT identifier AS ability FROM abilities WHERE id=$1",
        id
    );
    return info;
};

getItemInfo = async id => {
    info = await db.one("SELECT * FROM items WHERE id=$1", id);
    return info;
};

getRandomTeam = async levels => {
    //each member cannot be retrieved asnychronously, postgres seems to use the same random
    //seed between a few requests
    let team = [];
    for (let i = 0; i < 6; i++) {
        team.push(await getRandomPokemon(levels));
    }
    return team;
};

getRandomPokemon = async level => {
    pokemon = await db.one(
        "WITH selectedpokemon AS (SELECT * FROM pokemon JOIN basestats ON pokemon.id = basestats.pokemon_id ORDER BY RANDOM() LIMIT 1) SELECT * FROM abilitieslearned JOIN selectedpokemon ON abilitieslearned.pokemon_id = selectedpokemon.id ORDER BY RANDOM() LIMIT 1"
    );
    delete pokemon.is_hidden;
    delete pokemon.slot;
    EVs = genRandEVs();
    Nature = genRandNature();
    pokemon = calcStats(pokemon, level, EVs, Nature);
    pokemon.moves = await getRandomMoves(pokemon.pokemon_id);
    pokemon.item = await db.one(
        "SELECT id as item_id, identifier, category_id, fling_power, fling_effect_id FROM ITEMS ORDER BY RANDOM() LIMIT 1"
    );
    return pokemon;
};

getRandomMoves = async pokemon_id => {
    moves = await db.any(
        "SELECT move_id, identifier, type_id, power, accuracy, priority, target_id, damage_class_id, effect_id, effect_chance FROM moveslearned JOIN moves ON moveslearned.move_id=moves.id WHERE pokemon_id = $1 ORDER BY RANDOM() LIMIT 4",
        pokemon_id
    );
    return moves;
};

function genRandEVs() {
    var EVs = [0, 0, 0, 0, 0, 0];
    for (let index = 0; index < 508 / 4; index++) {
        stat = Math.floor(Math.random() * 6);
        EVs[stat] += 4;
    }
    return EVs;
}

function genRandNature() {
    bad = Math.floor(Math.random() * 5);
    do {
        good = Math.floor(Math.random() * 5);
    } while (bad == good);
    var Nature = [1, 1, 1, 1, 1];
    Nature[bad] = 0.9;
    Nature[good] = 1.1;
    return Nature;
}

function calcStats(stats, level, EVs, Nature) {
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
}

function HP_base_to_stat(base, level, EV) {
    let IV = 31;
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

getRandomTeam(50).then(pokemon => console.log(pokemon));

exports.getMovesfromID = getMovesfromID;
exports.getMovesfromName = getMovesfromName;
exports.getStatsfromID = getStatsfromID;
exports.getAbilitiesfromID = getAbilitiesfromID;
exports.getAbilityInfo = getAbilityInfo;
exports.getItemInfo = getItemInfo;
exports.getRandomPokemon = getRandomPokemon;

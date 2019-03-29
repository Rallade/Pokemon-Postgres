const db = require("./db_interface");

var numbers2pokemon = async numbers => {
    // pokemon_id, level, ability, EVs, Nature array, moves, item
    async_stats = db.getStatsfromID(
        numbers[0],
        numbers[1],
        numbers.slice(3, 9),
        numbers.slice(9, 14)
    );
    async_ability = db.getAbilityInfo(numbers[2]);
    async_item = db.getItemInfo(numbers[18]);
    async_moves = numbers.slice(14, 18).map(db.getMoveInfo);
    async_moves = await Promise.all(async_moves);
    info = await Promise.all([
        async_stats,
        async_ability,
        async_item,
        async_moves
    ]);

    stats = info[0];
    Object.assign(stats, info[1]);
    stats.item = info[2];
    stats.moves = info[3];
    stats.EVs = numbers.slice(3, 9);
    stats.Nature = numbers.slice(9, 14);
    return stats;
};

function pokemon2numbers(pokemon) {
    numbers = [];
    numbers.push(pokemon.pokemon_id);
    numbers.push(pokemon.level);
    numbers.push(pokemon.ability_id);
    numbers.push(...pokemon.EVs);
    numbers.push(...pokemon.Nature);
    numbers.push(...pokemon.moves.map(move => move.move_id));
    numbers.push(pokemon.item.item_id);
    console.log(pokemon);
    numbers2pokemon(numbers).then(pokemon => console.log(pokemon));
}

exports.numbers2pokemon = numbers2pokemon;
exports.pokemon2numbers = pokemon2numbers;

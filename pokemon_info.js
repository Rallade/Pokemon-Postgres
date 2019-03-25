const db = require("./db_conn").db;

getMovesfromName = async name => {
    moves = await db.any(
        "SELECT moves.identifier FROM moves JOIN moveslearned ON moves.id = moveslearned.move_id JOIN pokemon ON pokemon.id = moveslearned.pokemon_id WHERE pokemon.identifier LIKE $1",
        name
    );
    moves = moves.map(move => move.identifier);
    moves = new Set(moves);
    return moves;
};

getMovesfromID = async id => {
    moves = await db.any(
        "SELECT moves.identifier FROM moves JOIN moveslearned ON moves.id = moveslearned.move_id WHERE moveslearned.pokemon_id=$1",
        id
    );
    moves = moves.map(move => move.identifier);
    moves = new Set(moves);
    return moves;
};

getMovesfromID(475).then(data => console.log(data));

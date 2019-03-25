const getPokemonData = require('./get_pokemon_data')

async function main() {
    data = await getPokemonData.get_data('gallade', 95);
    console.log(data)
};

main().then();
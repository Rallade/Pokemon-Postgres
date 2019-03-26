CREATE TABLE pokemon
(
    id SMALLINT PRIMARY KEY,
    identifier VARCHAR(30),
    species_id SMALLINT,
    height SMALLINT,
    weight SMALLINT,
    base_experience SMALLINT,
    "order" SMALLINT,
    is_default BOOLEAN
);

CREATE TABLE moveslearned
(
    pokemon_id SMALLINT REFERENCES pokemon(id),
    version_group_id SMALLINT,
    move_id SMALLINT,
    pokemon_move_method_id SMALLINT,
    "level" SMALLINT,
    PRIMARY KEY (pokemon_id, version_group_id, move_id, "level")
);


CREATE TABLE basestats
(
    pokemon_id SMALLINT REFERENCES pokemon(id),
    HP SMALLINT,
    attack SMALLINT,
    defense SMALLINT,
    specialattack SMALLINT,
    specialdefense SMALLINT,
    speed SMALLINT,
    PRIMARY KEY
    (pokemon_id)
);

CREATE TABLE moves
(
    id SMALLINT PRIMARY KEY,
    identifier VARCHAR(40),
    generation_id SMALLINT,
    "type_id" SMALLINT,
    "power" SMALLINT,
    pp SMALLINT,
    accuracy SMALLINT,
    priority SMALLINT,
    target_id SMALLINT,
    damage_class_id SMALLINT,
    effect_id SMALLINT,
    effect_chance SMALLINT
);

alter table moveslearned
add constraint moveslearned_move_id_fkey
foreign key (move_id)
references moves(id);

CREATE TABLE abilities
(
    id SMALLINT PRIMARY KEY,
    identifier VARCHAR(40),
    generation_id SMALLINT,
    is_main_series BOOLEAN
);

CREATE TABLE abilitieslearned
(
    pokemon_id SMALLINT REFERENCES pokemon(id),
    ability_id SMALLINT REFERENCES abilities(id),
    is_hidden BOOLEAN,
    slot SMALLINT,
    PRIMARY KEY(pokemon_id, ability_id)
);

CREATE TABLE itemcategories
(
    id SMALLINT PRIMARY KEY,
    pocket_id SMALLINT,
    identifier VARCHAR(30)
);

CREATE TABLE flingeffects
(
    id SMALLINT PRIMARY KEY,
    identifier VARCHAR(30)
);

create TABLE items
(
    id SMALLINT PRIMARY KEY,
    identifier VARCHAR(40),
    category_id SMALLINT REFERENCES itemcategories(id),
    cost INTEGER,
    fling_power SMALLINT,
    fling_effect_id SMALLINT REFERENCES flingeffects(id)
);

DELETE FROM items WHERE category_id=10 OR category_id=14 OR category_id=1 OR category_id=8 OR category_id=9 OR category_id=11 OR category_id=16 OR category_id=43;
DELETE FROM items WHERE category_id>19 and category_id<42;
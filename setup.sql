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


CREATE TABLE level50stats
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
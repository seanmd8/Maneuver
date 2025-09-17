/** @type {TileGenerator} A healing fruit that spawns enemies.*/
function rotting_fruit_tree_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.fruit_tree_rotting,
        pic: `${IMG_FOLDER.tiles}rotting_fruit_tree.png`,
        description: other_tile_descriptions.fruit_tree_rotting,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        on_enter: decay_ai,
        on_death: rotting_fruit_tree_on_death,
        summons: FRUIT_TREE_SUMMONS
    }
}

/** @type {AIFunction} AI used when the fruit tree is moved on or destroyed.*/
function rotting_fruit_tree_on_death(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(chance(2, 5)){
        var new_spawn = rand_from(self.tile.summons)();
        stun(new_spawn);
        spawn_nearby(map, new_spawn, self.location);
    }
}
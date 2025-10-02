/** @type {TileGenerator} A healing fruit that spawns enemies.*/
function enticing_fruit_tree_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.fruit_tree_enticing,
        pic: `${IMG_FOLDER.tiles}enticing_fruit_tree.png`,
        description: other_tile_descriptions.fruit_tree_enticing,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        on_enter: enticing_fruit_tree_on_enter,
        summons: FRUIT_TREE_SUMMONS
    }
}

/** @type {AIFunction} AI used when the player moves onto the fruit tree.*/
function enticing_fruit_tree_on_enter(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.tile.type !== entity_types.player){
        return;
    }
    map.heal(self.location.plus(target.difference), 1);
    var spawns = random_num(2) + random_num(2);
    for(var i = 0; i < spawns; ++i){
        var new_spawn = random_from(self.tile.summons)();
        stun(new_spawn);
        spawn_nearby(map, new_spawn, self.location);
    }
    decay_ai(self, target, map);
}
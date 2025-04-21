/** @type {TileGenerator} A healing fruit that spawns enemies.*/
function enticing_fruit_tree_tile(){
    return {
        type: `terrain`,
        name: `Enticing Fruit Tree`,
        pic: `${IMG_FOLDER.tiles}enticing_fruit_tree.png`,
        description: enticing_fruit_tree_description,
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
    if(target.tile.type !== `player`){
        return;
    }
    map.heal(self.location.plus(target.difference), 1);
    var spawns = random_num(3);
    for(var i = 0; i < spawns; ++i){
        var new_spawn = rand_from(self.tile.summons)();
        stun(new_spawn);
        spawn_nearby(map, new_spawn, self.location);
    }
    decay_ai(self, target, map);
}
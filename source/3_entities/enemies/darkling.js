/** @type {TileGenerator} */
function darkling_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.darkling,
        pic: `${IMG_FOLDER.tiles}darkling.png`,
        description: enemy_descriptions.darkling,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: darkling_ai,
        telegraph: darkling_telegraph
    }
}

/** @type {AIFunction} AI used by darklings.*/
function darkling_ai(self, target, map){
    if(self.tile.direction !== undefined){
        // Teleport to it's rift.
        var moved = map.move(self.location, self.tile.direction);
        if(moved){
            // If moved, attack around it.
            attack_around(self.tile.direction, map);
        }
        else{
            // If something is blocking the rift, it dies.
            map.attack(self.location);
            return;
        }
    }
    // Create a new rift for next turn.
    self.tile.direction = map.random_empty();
    var darkling_rift = function(map_to_use){
        if(self.tile.health === undefined || self.tile.health > 0){
            map_to_use.mark_event(self.tile.direction, darkling_rift_mark(), false);
        }
    }
    map.add_event({name: event_names.darkling_rift, behavior: darkling_rift});
}

/** @type {TelegraphFunction} */
function darkling_telegraph(location, map, self){
    if(self.direction === undefined){
        return [];
    }
    return spider_telegraph(self.direction, map, self);
}
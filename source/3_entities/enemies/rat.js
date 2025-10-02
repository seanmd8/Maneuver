/** @type {TileGenerator} */
function rat_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.rat,
        pic: `${IMG_FOLDER.tiles}rat.png`,
        description: enemy_descriptions.rat,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: rat_ai,
        telegraph: rat_telegraph,
        flip: chance(1, 2),
        cycle: 1
    }
}

/** @type {AIFunction} AI used by rats.*/
function rat_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.flip === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle >= 1 && target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference));
        self.tile.cycle = -1;
    }
    // Move 2 spaces.
    for(var i = 0; i < 2; ++i){
        var directions = order_nearby(target.difference);
        if(self.tile.cycle <= 0){
            // If they bit the player within 2 turns, move away. Otherwise move closer.
            directions = reverse_arr(directions);
        }
        var moved = move_reckless(self, target, map, directions);
        if(moved !== undefined){
            if(moved.x < 0){
                self.tile.flip = false;
            }
            if(moved.x > 0){
                self.tile.flip = true;
            }
        }
    }
    ++self.tile.cycle;
}

/** @type {TelegraphFunction} Function to telegraph rat attacks.*/
function rat_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle >= 1){
        return spider_telegraph(location, map, self);
    }
    return [];
}
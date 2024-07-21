/** @type {TileGenerator} */
function rat_tile(){
    return {
        type: `enemy`,
        name: `rat`,
        pic: `${IMG_FOLDER.tiles}rat.png`,
        description: rat_description,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: rat_ai,
        telegraph: rat_telegraph,
        flip: random_num(2) === 0,
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
        var moved = false;
        for(var j = 0; j < directions.length && !moved; ++j){
            moved = map.move(self.location, self.location.plus(directions[j]));
            if(moved){
                self.location.plus_equals(directions[j])
                target.difference.minus_equals(directions[j])
                if(directions[j].x < 0){
                    self.tile.flip = false;
                }
                if(directions[j].x > 0){
                    self.tile.flip = true;
                }
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
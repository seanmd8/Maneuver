/** @type {TileGenerator} A crab which flees when hit. */
function igneous_crab_tile(){
    return {
        type: `enemy`,
        name: `igneous crab`,
        pic: `${IMG_FOLDER.tiles}igneous_crab.png`,
        description: igneous_crab_description,
        tags: new TagList(),
        health: 2,
        difficulty: 3,
        behavior: igneous_crab_ai,
        telegraph: igneous_crab_telegraph,
        on_hit: igneous_crab_hit,
        cycle: 0
    }
}

/** @type {AIFunction} AI used by igneous crabs.*/
function igneous_crab_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(self.tile.cycle > 0){
        var directions = reverse_arr(order_nearby(target.difference));
        for(var i = 0; i < directions.length && !map.move(self.location, self.location.plus(directions[i])); ++i){}
        --self.tile.cycle;
    }
    else{
        spider_ai(self, target, map);
    }
}
/** @type {AIFunction} Used to cause igneous crabs to flee when damaged.*/
function igneous_crab_hit(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property)
    }
    self.tile.cycle += 2;
}
/** @type {TelegraphFunction} Function to telegraph igneous crab attacks.*/
function igneous_crab_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle > 0){
        return [];
    }
    return spider_telegraph(location, map, self);
}


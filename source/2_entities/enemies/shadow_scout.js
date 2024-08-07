/** @type {TileGenerator} */
function shadow_scout_tile(){
    var look_arr = [empty_tile, shadow_scout_tile];
    var starting_cycle = random_num(2);
    return {
        type: `enemy`,
        name: `Shadow Scout`,
        pic: `${IMG_FOLDER.tiles}shadow_scout.png`,
        description: shadow_scout_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: shadow_scout_ai,
        telegraph: spider_telegraph,
        look_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by shadow scouts.*/
function shadow_scout_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.look_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    self.tile.cycle = 1 - self.tile.cycle;
    // Goes invisible on alternate turns.
    shapeshift(self.tile, self.tile.look_arr[self.tile.cycle]);
    self.tile.cycle === 0 ? self.tile.tags.add(TAGS.hidden) : self.tile.tags.remove(TAGS.hidden);
    spider_ai(self, target, map);
}
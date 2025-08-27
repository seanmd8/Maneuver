/** @type {TileGenerator} */
function shadow_scout_tile(){
    var starting_cycle = random_num(2);
    return {
        type: `enemy`,
        name: enemy_names.shadow_scout,
        pic: `${IMG_FOLDER.tiles}shadow_scout.png`,
        description: enemy_descriptions.shadow_scout,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: shadow_scout_ai,
        telegraph: spider_telegraph,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by shadow scouts.*/
function shadow_scout_ai(self, target, map){
    if( self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    self.tile.cycle = 1 - self.tile.cycle;
    // Goes invisible on alternate turns.
    self.tile.look = self.tile.cycle === 1 ? empty_tile() : undefined;
    self.tile.cycle === 1 ? self.tile.tags.add(TAGS.hidden) : self.tile.tags.remove(TAGS.hidden);
    spider_ai(self, target, map);
}
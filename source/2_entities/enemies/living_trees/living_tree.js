/** @type {TileGenerator} */
function living_tree_tile(){
    return {
        type: `enemy`,
        name: `Living Tree`,
        pic: `${IMG_FOLDER.tiles}living_tree.png`,
        description: living_tree_description,
        tags: new TagList(),
        health: 2,
        difficulty: 7,
        behavior: living_tree_ai,
        telegraph: living_tree_telegraph,
        cycle: random_num(2)
    }
}

/** @type {AIFunction} AI used by living trees.*/
function living_tree_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    // Checks if it can attack the player.
    var hits = get_2_away().filter(p => {
        return point_equals(p, target.difference);
    });
    if(hits.length > 0){
        map.attack(self.location.plus(target.difference));
        return;
    }
    if(self.tile.cycle === 0){
        self.tile.cycle = 1 - self.tile.cycle;
        throw new Error(ERRORS.skip_animation);
    }
    // Orders the places it could move.
    var directions = order_nearby(target.difference);
    if(target.difference.within_radius(1)){
        directions = reverse_arr(directions);
    }
    // Carefully tries to move.
    for(var i = 0; i < directions.length && !map.check_empty(self.location.plus(directions[i])); ++i){}
    if(i < directions.length){
        var move = directions[i];
        map.move(self.location, self.location.plus(move));
    }
    self.tile.cycle = 1 - self.tile.cycle;
}


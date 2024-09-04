/** @type {TileGenerator} */
function dart_tail_scorpion_tile(){
    return {
        type: `enemy`,
        name: `Dart Tail Scorpion`,
        pic: `${IMG_FOLDER.tiles}dart_tail_scorpion.png`,
        description: dart_tail_scorpion_description,
        tags: new TagList(),
        health: 1,
        difficulty: 6,
        behavior: dart_tail_scorpion_ai,
        telegraph: dart_tail_scorpion_telegraph,
        flip: random_num(2) === 0,
    }
}

/** @type {AIFunction} AI used by dart tailed scorpions.*/
function dart_tail_scorpion_ai(self, target, map){
    if(self.tile.flip === undefined){
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
    // Orders the places it could move.
    var directions = order_nearby(target.difference).filter(p => {
        return p.on_axis();
    });
    if(target.difference.within_radius(1)){
        directions = reverse_arr(directions);
    }
    // Carefully tries to move.
    for(var i = 0; i < directions.length && !map.check_empty(self.location.plus(directions[i])); ++i){}
    if(i < directions.length){
        var move = directions[i];
        map.move(self.location, self.location.plus(move));
        if(move.x !== 0){
            self.tile.flip = move.x > 0;
        }
    }
}

/** @type {TelegraphFunction} Function to telegraph rat attacks.*/
function dart_tail_scorpion_telegraph(location, map, self){
    return get_2_away().map(p => {
        return p.plus(location);
    })
}

/**
 * Function to make a square of points with a side length 5 centered on the origin.
 * @returns {Point[]} the points.
 */
function get_2_away(){
    var points = [];
    for(var x = -2; x <= 2; ++x){
        for(var y = -2; y <= 2; ++y){
            var p = new Point(x, y);
            if(p.within_radius(2) && !p.within_radius(1)){
                points.push(p);
            }
        }
    }
    return points;
}
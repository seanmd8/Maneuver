/** @type {TileGenerator} */
function scythe_tile(){
    return{
        type: `enemy`,
        name: `scythe`,
        pic: `${IMG_FOLDER.tiles}scythe.png`,
        description: scythe_description,
        health: 1,
        difficulty: 3,
        behavior: scythe_ai,
        telegraph: scythe_telegraph,
        rotate: 90 * random_num(4)
    }
}

/** @type {AIFunction} AI used by scythes.*/
function scythe_ai(self, target, map){
    if(self.tile.rotate === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    var distance = 3;
    self.tile.direction = sign(target.difference);
    if(self.tile.direction.on_axis()){
        // If the player is orthogonal, moves randomly.
        self.tile.direction = new Point(random_sign(), random_sign());
    }
    // Rotate image based on direction.
    var direction = self.tile.direction;
    set_rotation(self.tile);
    for(var i = 0; i < distance && map.move(self.location, self.location.plus(direction)) ; ++i){
        // moves <distance> spaces attacking each space it passes next to. Stops when blocked.
        self.location.plus_equals(direction);
        target.difference.minus_equals(direction);
        var passed = [new Point(direction.x, 0), new Point(0, direction.y)];
        for(var p of passed){
            if(point_equals(target.difference, p.times(-1)) || map.check_empty(self.location.minus(p))){
                map.attack(self.location.minus(p));
            }
        }
    }
}

/** @type {TelegraphFunction} */
function scythe_telegraph(location, map, self){
    var attacks = [];
    for(var direction of diagonal_directions){
        var current = location.copy();
        for(var i = 0; i < 3 && map.check_empty(current.plus_equals(direction)); ++i){
            attacks.push(current.plus(direction.times(new Point(-1, 0))));
            attacks.push(current.plus(direction.times(new Point(0, -1))));
        }
    }
    return attacks;
}
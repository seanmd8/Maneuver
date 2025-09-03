/** @type {TileGenerator} */
function blood_crescent_tile(){
    return{
        type: entity_types.enemy,
        name: enemy_names.blood_crescent,
        pic: `${IMG_FOLDER.tiles}blood_crescent.png`,
        description: enemy_descriptions.blood_crescent,
        tags: new TagList(),
        health: 1,
        difficulty: 6,
        behavior: blood_crescent_ai,
        telegraph: blood_crescent_telegraph,
        rotate: 90 * random_num(4)
    }
}

/** @type {AIFunction} AI used by Blood Crescents.*/
function blood_crescent_ai(self, target, map){
    if(self.tile.rotate === undefined){
        throw new Error(ERRORS.missing_property)
    }
    var distance = 3;
    self.tile.direction = order_nearby(target.difference).filter((p) => {
        return p.on_diagonal();
    })[0];
    // Rotate image based on direction.
    var direction = self.tile.direction;
    set_rotation(self.tile);
    var ahead = self.location.plus(direction);
    if(point_equals(self.location.plus(target.difference), ahead)){
        map.attack(ahead);
    }
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
        if(i + 1 < distance){
            ahead = self.location.plus(direction);
            if(point_equals(self.location.plus(target.difference), ahead)){
                map.attack(ahead);
            }
        }
    }
}

/** @type {TelegraphFunction} */
function blood_crescent_telegraph(location, map, self){
    var attacks = [];
    for(var direction of DIAGONAL_DIRECTIONS){
        var current = location.copy();
        for(var i = 0; i < 3 && map.check_empty(current.plus_equals(direction)); ++i){
            attacks.push(current.copy());
            attacks.push(current.plus(direction.times(new Point(-1, 0))));
            attacks.push(current.plus(direction.times(new Point(0, -1))));
        }
    }
    return attacks;
}
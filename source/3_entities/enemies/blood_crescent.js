/** @type {TileGenerator} */
function blood_crescent_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}blood_crescent_wait.png`, `${IMG_FOLDER.tiles}blood_crescent.png`];
    var starting_cycle = random_num(pic_arr.length);
    return{
        type: entity_types.enemy,
        name: enemy_names.blood_crescent,
        pic: pic_arr[starting_cycle],
        description: enemy_descriptions.blood_crescent,
        tags: new TagList(),
        health: 1,
        difficulty: 5,
        behavior: blood_crescent_ai,
        telegraph: blood_crescent_telegraph,
        pic_arr,
        cycle: starting_cycle,
        rotate: 90 * random_num(4)
    }
}

/** @type {AIFunction} AI used by Blood Crescents.*/
function blood_crescent_ai(self, target, map){
    if(self.tile.rotate === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if(self.tile.cycle === 1){
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
                if(
                    point_equals(target.difference, p.times(-1)) || 
                    map.check_empty(self.location.minus(p)) ||
                    (GS.boons.has(boon_names.manic_presence) && chance(1, 2))
                ){
                    map.attack(self.location.minus(p));
                }
            }
            if(i + 1 < distance){
                ahead = self.location.plus(direction);
                if(
                    point_equals(self.location.plus(target.difference), ahead) ||
                    (GS.boons.has(boon_names.manic_presence) && chance(1, 2))
                ){
                    map.attack(ahead);
                }
            }
        }
    }
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}

/** @type {TelegraphFunction} */
function blood_crescent_telegraph(location, map, self){
    var attacks = [];
    if(self.cycle === 0){
        return attacks;
    }
    for(var direction of DIAGONAL_DIRECTIONS){
        var current = location.copy();
        for(var i = 0; i < 2 && map.check_empty(current.plus_equals(direction)); ++i){
            attacks.push(current.copy());
            attacks.push(current.plus(direction.times(new Point(-1, 0))));
            attacks.push(current.plus(direction.times(new Point(0, -1))));
        }
    }
    return attacks;
}
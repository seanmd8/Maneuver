/** @type {TileGenerator}*/
function pheonix_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.pheonix,
        pic: `${IMG_FOLDER.tiles}pheonix.png`,
        description: enemy_descriptions.pheonix,
        tags: new TagList(),
        health: 1,
        difficulty: 5,
        behavior: pheonix_ai,
        telegraph: pheonix_telegraph,
        on_death: pheonix_death
    }
}

/** @type {AIFunction} AI used by pheonixes.*/
function pheonix_ai(self, target, map){
    var direction = new Point(0, 0);
    var distance = 0;
    if((target.difference.on_axis() || target.difference.on_diagonal()) && target.difference.within_radius(2)){
        // Sees the player and tries to attack them.
        var direction = sign(target.difference);
        if(map.check_empty(self.location.plus(direction.times(3)))){
            distance = 3;
        }
        else if(map.check_empty(self.location.plus(direction.times(2)))){
            distance = 2;
        }
    }
    var directions = order_nearby(target.difference);
    for(var i = 0; i < directions.length && distance === 0; ++i){
        // otherwise it flies towards them.
        direction = directions[i];
        for(var j = 3; j > 1 && distance === 0; --j){
            if(map.check_empty(self.location.plus(direction.times(j)))){
                distance = j;
            }
        }
    }
    if(distance > 0){
        map.move(self.location, self.location.plus(direction.times(distance)));
        for(var i = 0; i < distance; ++i){
            var space = self.location.plus(direction.times(i))
            map.attack(space);
            if(map.check_empty(space)){
                map.add_tile(raging_fire_tile(), space);
            }
        }
        self.location.plus_equals(direction.times(distance));
    }
}
/** @type {AIFunction} Spawns smoldering ashes on death.*/
function pheonix_death(self, target, map){
    map.add_tile(smoldering_ashes_tile(), self.location);
}
/** @type {TelegraphFunction} Function to telegraph pheonix attacks.*/
function pheonix_telegraph(location, map, self){
    var nearby = random_nearby();
    var telegraph = [];
    for(var direction of nearby){
        var distance = 0
        for(var j = 3; j > 1 && distance === 0; --j){
            if(map.check_empty(location.plus(direction.times(j)))){
                distance = j;
            }
        }
        for(var i = 0; i < distance; ++i){
            telegraph.push(location.plus(direction.times(i)));
        }
    }
    return telegraph;
}
/** @type {TileGenerator} */
function noxious_toad_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}noxious_toad_leaping.png`, `${IMG_FOLDER.tiles}noxious_toad.png`];
    var starting_cycle = random_num(pic_arr.length);
    return {
        type: entity_types.enemy,
        name: enemy_names.noxious_toad,
        pic: pic_arr[starting_cycle],
        display_pic: pic_arr[0],
        description: enemy_descriptions.noxious_toad, 
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: noxious_toad_ai,
        telegraph: noxious_toad_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by noxious toads.*/
function noxious_toad_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        var directions = order_nearby(target.difference);
        var moved = false;
        for(var i = 0; i < directions.length && !moved; ++i){
            // Leap orthogonally closer.
            if(directions[i].on_axis()){
                moved = map.move(self.location, self.location.plus(directions[i].times(2)));
                if(moved){
                    self.location.plus_equals(directions[i].times(2));
                    target.difference.minus_equals(directions[i].times(2))
                }
            }
        }
        if(moved){
            self.tile.cycle = 1;
            if(target.difference.within_radius(1)){
                // If it landed near the player, attack everything nearby.
                attack_around(self.location, map);
            }
        }
    }
    else{
        // Prepare to leap.
        self.tile.cycle = 0;
    }
    self.tile.pic = self.tile.pic_arr[self.tile.cycle]
}

/** @type {TelegraphFunction} */
function noxious_toad_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var attacks = [];
    if(self.cycle === 1){
        return attacks;
    }
    for(var direction of ORTHOGONAL_DIRECTIONS){
        var move = location.plus(direction.times(2));
        if(map.check_empty(move)){
            attacks.push(...spider_telegraph(move, map, self));
        }
        
    }
    return attacks;
}
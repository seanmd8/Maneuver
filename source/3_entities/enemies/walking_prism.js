/** @type {TileGenerator} */
function walking_prism_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}walking_prism_o.png`, `${IMG_FOLDER.tiles}walking_prism_d.png`];
    var description_arr = enemy_descriptions.walking_prism;
    var starting_cycle = random_num(pic_arr.length);
    return {
        type: entity_types.enemy,
        name: enemy_names.walking_prism,
        pic: pic_arr[starting_cycle],
        display_pic: pic_arr[1],
        description: `${description_arr[0]}${description_arr[1 + starting_cycle]}`, 
        tags: new TagList(),
        health: 2,
        difficulty: 3,
        behavior: walking_prism_ai,
        on_hit: walking_prism_on_hit,
        telegraph_other: walking_prism_telegraph,
        pic_arr,
        description_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction}.*/
function walking_prism_ai(self, target, map){
    if( self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(!target.difference.within_radius(1)){
        // If not next to player, moves towards them.
        move_closer_ai(self, target, map);
    }
    else{
        // If near the player, moves randomly.
        var near_points = random_nearby();
        for(var i = 0; i < near_points.length && !map.move(self.location, self.location.plus(near_points[i])); ++i){}
    }
}

/** @type {AIFunction}.*/
function walking_prism_on_hit(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        var directions = ORTHOGONAL_DIRECTIONS;
    }
    else{
        var directions = DIAGONAL_DIRECTIONS;
    }
    // Changes cycle.
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
    self.tile.description = `${self.tile.description_arr[0]}${self.tile.description_arr[1 + self.tile.cycle]}`

    // Attacks in a + or x depending on the old cycle.
    for(var direction of directions){
        for(var space = self.location.plus(direction); !map.attack(space) && map.check_empty(space); space.plus_equals(direction)){}
    }
}

/** @type {TelegraphFunction} */
function walking_prism_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle === 0){
        return turret_o_telegraph(location, map, self);
    }
    return turret_d_telegraph(location, map, self);
}
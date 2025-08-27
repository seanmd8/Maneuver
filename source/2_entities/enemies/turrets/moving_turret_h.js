/** @type {TileGenerator} */
function moving_turret_h_tile(){
    var direction = rand_from(HORIZONTAL_DIRECTIONS).copy();
    var tile = {
        type: `enemy`,
        name: enemy_names.turret_m,
        pic: `${IMG_FOLDER.tiles}moving_turret_h.png`,
        description: enemy_descriptions.turret_m,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: moving_turret_h_ai,
        telegraph: moving_turret_h_telegraph,
        rotate: 0,
        direction
    }
    set_rotation(tile);
    return tile;
}

/** @type {AIFunction} AI used by moving turrets that shoot orthogonally.*/
function moving_turret_h_ai(self, target, map){
    if( self.tile.rotate === undefined || 
        self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property)
    }
    // If the player is on the axis and not in the direction of travel, fire.
    if( 
        target.difference.on_axis() && 
        !point_equals(sign(target.difference), self.tile.direction) &&
        !point_equals(sign(target.difference), self.tile.direction.times(-1))
    ){
        turret_fire_ai(self, target, map);
    }
    // Try to move. Change direction if it hits something.
    if(!map.move(self.location, self.location.plus(self.tile.direction))){
        self.tile.direction.times_equals(-1);
        set_rotation(self.tile);
    }
}

/** @type {TelegraphFunction} */
function moving_turret_h_telegraph(location, map, self){
    var attacks = [];
    for(var direction of [self.direction.rotate(90), self.direction.rotate(-90)]){
        attacks.push(...get_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {TileGenerator} */
function moving_turret_d_tile(){
    var direction = DIAGONAL_DIRECTIONS[random_num(DIAGONAL_DIRECTIONS.length)].copy();
    var tile = {
        type: `enemy`,
        name: `Moving Turret`,
        pic: `${IMG_FOLDER.tiles}moving_turret_d.png`,
        description: moving_turret_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: moving_turret_d_ai,
        telegraph: moving_turret_d_telegraph,
        rotate: 0,
        direction
    }
    set_rotation(tile);
    return tile;
}

/** @type {AIFunction} AI used by moving turrets that shoot diagonally.*/
function moving_turret_d_ai(self, target, map){
    if( self.tile.rotate === undefined || 
        self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property)
    }
    // If the player is on the diagonal and not in the direction of travel, fire.
    if( 
        target.difference.on_diagonal() && 
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
function moving_turret_d_telegraph(location, map, self){
    var attacks = [];
    for(var direction of [self.direction.rotate(90), self.direction.rotate(-90)]){
        attacks.push(...get_points_in_direction(location, direction, map));
    }
    return attacks;
}
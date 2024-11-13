/** @type {TileGenerator} */
function turret_r_tile(){
    var tile = {
        type: `enemy`,
        name: `Rotary Turret`,
        pic: ``,
        description: turret_r_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: turret_r_ai,
        telegraph: turret_r_telegraph,
        pic_arr: [
            `${IMG_FOLDER.tiles}turret_r_N_S_counterclockwise.png`,
            `${IMG_FOLDER.tiles}turret_r_NW_SE_counterclockwise.png`,
            `${IMG_FOLDER.tiles}turret_r_N_S.png`, 
            `${IMG_FOLDER.tiles}turret_r_NW_SE.png`
        ],
        rotate: 0,
        direction: random_nearby()[0],
        spin_direction: random_sign()
    }
    tile.pic = tile.pic_arr[1 + tile.spin_direction + set_rotation(tile)];
    return tile;
}

/** @type {AIFunction} AI used by turrets that rotate.*/
function turret_r_ai(self, target, map){
    if( self.tile.rotate === undefined || 
        self.tile.pic_arr === undefined || 
        self.tile.direction === undefined || 
        self.tile.spin_direction === undefined){
        throw new Error(ERRORS.missing_property)
    }
    if((target.difference.on_axis() || target.difference.on_diagonal())){
        // Shoot if player is along the line of the current direction or it's opposite.
        if(point_equals(self.tile.direction, sign(target.difference))){
            turret_fire_ai(self, target, map);
        }
        else if(point_equals(self.tile.direction.times(-1), sign(target.difference))){
            self.tile.direction = self.tile.direction.times(-1);
            turret_fire_ai(self, target, map);
            self.tile.direction = self.tile.direction.times(-1);
        }
    }
    // Rotate 45 degrees in the correct direction.
    self.tile.direction = sign(self.tile.direction.plus(self.tile.direction.rotate(90 * self.tile.spin_direction)));
    self.tile.pic = self.tile.pic_arr[1 + self.tile.spin_direction + set_rotation(self.tile)];

}

/** @type {TelegraphFunction} */
function turret_r_telegraph(location, map, self){
    if(self.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var attacks = get_points_in_direction(location, self.direction, map);
    return attacks.concat(get_points_in_direction(location, self.direction.times(-1), map));
}
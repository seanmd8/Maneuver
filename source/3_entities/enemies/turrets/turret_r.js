/** @type {TileGenerator} */
function turret_r_tile(){
    var pic_arr = [
        `${IMG_FOLDER.tiles}turret_r_N_S_counterclockwise.png`,
        `${IMG_FOLDER.tiles}turret_r_NW_SE_counterclockwise.png`,
        `${IMG_FOLDER.tiles}turret_r_N_S.png`, 
        `${IMG_FOLDER.tiles}turret_r_NW_SE.png`
    ];
    var tile = {
        type: entity_types.enemy,
        name: enemy_names.turret_r,
        pic: pic_arr[0],
        display_pic: pic_arr[0],
        description: enemy_descriptions.turret_r,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: turret_r_ai,
        telegraph: turret_r_telegraph,
        pic_arr,
        rotate: 0,
        direction: random_nearby()[0],
        spin_direction: random_sign(),
    }
    tile.pic = pic_arr[1 + tile.spin_direction + set_rotation(tile)];
    return tile;
}

/** @type {AIFunction} AI used by turrets that rotate.*/
function turret_r_ai(self, target, map){
    if( self.tile.rotate === undefined || 
        self.tile.pic_arr === undefined || 
        self.tile.direction === undefined || 
        self.tile.spin_direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var fired = false;
    if((target.difference.on_axis() || target.difference.on_diagonal())){
        // Shoot if player is along the line of the current direction or it's opposite.
        if(point_equals(self.tile.direction, sign(target.difference))){
            turret_fire_ai(self, target, map);
            fired = true;
        }
        else if(point_equals(self.tile.direction.times(-1), sign(target.difference))){
            turret_fire_ai(self, {difference: self.tile.direction.times(-1)}, map);
            fired = true;
        }
    }
    if(!fired && GS.boons.has(boon_names.manic_presence)){
        var dirs = [
            self.tile.direction,
            self.tile.direction.times(-1),
        ];
        for(var p of dirs){
            if(chance(1, 2)){
                turret_fire_ai(self, {difference: p}, map);
            }
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
    return [
        ...look_at_points_in_direction(location, self.direction, map),
        ...look_at_points_in_direction(location, self.direction.times(-1), map),
    ];
}
/** @type {TileGenerator} */
function turret_r_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}turret_r_N_S.png`, `${IMG_FOLDER.tiles}turret_r_NE_SW.png`];
    var starting_cycle = random_num(4);
    var spin_direction = random_sign();
    if(spin_direction > 0){
        var starting_rotation = 90 * Math.floor(starting_cycle / 2);
    }
    else{
        var starting_rotation = 90 * Math.floor(((starting_cycle + 1) % 4) / 2);
    }
    return {
        type: `enemy`,
        name: `rotary turret`,
        pic: pic_arr[starting_cycle % 2],
        description: turret_r_description,
        health: 1,
        difficulty: 2,
        behavior: turret_r_ai,
        telegraph: turret_r_telegraph,
        pic_arr,
        rotate: starting_rotation,
        flip: (spin_direction === -1),
        cycle: starting_cycle,
        spin_direction
    }
}

/** @type {AIFunction} AI used by turrets that rotate.*/
function turret_r_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.rotate === undefined || 
        self.tile.flip === undefined || 
        self.tile.spin_direction === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    switch(self.tile.cycle){
        case 0:
            if(target.difference.x === 0){
                // Fires N and S.
                turret_fire_ai(self, target, map);
            }
            break;
        case 1:
            if(target.difference.x === -1 * target.difference.y){
                // Fires NE and SW.
                turret_fire_ai(self, target, map);
            }
            break;
        case 2:
            if(target.difference.y === 0){
                // Fires E and W.
                turret_fire_ai(self, target, map);
            }
            break;
        case 3:
            if(target.difference.x === target.difference.y){
                // Fires SE and NW.
                turret_fire_ai(self, target, map);
            }
            break;
        default:
            throw new Error(`Improper case for ${self.tile.name}`);
    }
    // Rotate.
    self.tile.cycle = (self.tile.cycle + self.tile.spin_direction + 4) % 4;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle % 2];
    if(!self.tile.flip){
        self.tile.rotate = 90 * Math.floor(self.tile.cycle / 2);
    }
    else{
        self.tile.rotate = 90 * Math.floor(((self.tile.cycle + 1) % 4) / 2);
    }
}

/** @type {TelegraphFunction} */
function turret_r_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    var attacks = [];
    
    switch(self.cycle){
        case 0:
            // Adds N and S.
            attacks = attacks.concat(get_points_in_direction(location, new Point(0, -1), map));
            attacks = attacks.concat(get_points_in_direction(location, new Point(0, 1), map));
            break;
        case 1:
            // Adds NE and SW.
            attacks = attacks.concat(get_points_in_direction(location, new Point(1, -1), map));
            attacks = attacks.concat(get_points_in_direction(location, new Point(-1, 1), map));
            break;
        case 2:
            // Adds E and W.
            attacks = attacks.concat(get_points_in_direction(location, new Point(-1, 0), map));
            attacks = attacks.concat(get_points_in_direction(location, new Point(1, 0), map));
            break;
        case 3:
            // Adds SE and NW.
            attacks = attacks.concat(get_points_in_direction(location, new Point(1, 1), map));
            attacks = attacks.concat(get_points_in_direction(location, new Point(-1, -1), map));
            break;
        default:
            throw new Error(`Improper case for ${self.name}`);
    }
    return attacks;
}
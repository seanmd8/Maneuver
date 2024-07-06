/** @type {TileGenerator} */
function young_dragon_tile(){
    var pic_arr = [ `${IMG_FOLDER.tiles}young_dragon_flight.png`, 
                    `${IMG_FOLDER.tiles}young_dragon_diagonal_flight.png`,
                    `${IMG_FOLDER.tiles}young_dragon_walk.png`,
                    `${IMG_FOLDER.tiles}young_dragon_diagonal_walk.png`,
                    `${IMG_FOLDER.tiles}young_dragon_breath.png`,
                    `${IMG_FOLDER.tiles}young_dragon_diagonal_breath.png`];

    return {
        type: `enemy`,
        name: `young dragon`,
        pic: pic_arr[0],
        description: `${young_dragon_description_arr[0]}${young_dragon_description_arr[1]}`,
        health: 4,
        difficulty: 1,
        death_message: young_dragon_death_message,
        behavior: young_dragon_behavior,
        telegraph: young_dragon_telegraph,
        on_death: boss_death,
        pic_arr,
        description_arr: young_dragon_description_arr,
        rotate: 180,
        cycle: 0,
        range: 3,
        direction: new Point(0, 1),
        card_drops: [firebreathing_horizontal, firebreathing_vertical, firebreathing_ne, firebreathing_nw, glide,
                     soar]
    }
}

/** @type {AIFunction} AI used by the Young Dragon.*/
function young_dragon_behavior(self, target, map){
    if( self.tile.pic_arr === undefined ||
        self.tile.description_arr === undefined ||
        self.tile.rotate === undefined ||
        self.tile.cycle === undefined ||
        self.tile.range === undefined ||
        self.tile.direction === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(self.tile.cycle === 0){
        // Flight
        var spaces = [new Point(3, 0), new Point(3, 1), new Point(3, -1), new Point(2, 2),]; 
        spaces.push(...spaces.map((p) => p.rotate(90)));
        spaces.push(...spaces.map((p) => p.rotate(180))); // All rotations of the original are included.
        spaces = randomize_arr(spaces);
        var moved = false;
        var preffered_distance = [4, 3, 5];
        for(let radius of preffered_distance){
            for(let space of spaces){
                if(moved){
                    break;
                }
                // Tries to move to a space the appropriate taxicab distance away from the player.
                var taxi = target.difference.minus(space).taxicab_distance();
                var destination = self.location.plus(space)
                if(!moved && taxi === radius && map.check_empty(destination)){
                    moved = map.move(self.location, destination);
                    self.tile.direction = sign(space);
                }
            }
        }
        for(let space of spaces){
            if(moved){
                break;
            }
            // Instead tries to move to a space that isn't next to the player.
            var next_to = target.difference.minus(space).within_radius(1);
            var destination = self.location.plus(space)
            if(!moved && !(next_to) && map.check_empty(destination)){
                moved = map.move(self.location, destination);
                self.tile.direction = sign(space);
            }
        }
        if(moved){
            ++self.tile.cycle;
            self.tile.pic = self.tile.pic_arr[2 * self.tile.cycle + set_rotation(self.tile)];
            self.tile.description = `${self.tile.description_arr[0]}${self.tile.description_arr[self.tile.cycle + 1]}`;
        }
        return;
    }
    if(self.tile.cycle === 1 && target.difference.taxicab_distance() <= self.tile.range + 1){
        // Aims it's breath.
        self.tile.direction =  order_nearby(target.difference)[0];
        ++self.tile.cycle;
        self.tile.pic = self.tile.pic_arr[2 * self.tile.cycle + set_rotation(self.tile)];
        self.tile.description = `${self.tile.description_arr[0]}${self.tile.description_arr[self.tile.cycle + 1]}${self.tile.range}.`;
        return;
    }
    if(self.tile.cycle === 2){
        // Breathe fire.
        var horizontal_cone = [];
        for(var i = 1; i <= self.tile.range; ++i){
            for(var j = -(i - 1); j < i; ++j){
                // Creates the horizontal cone pattern pointing North.
                horizontal_cone.push(new Point(j, -1 * i));
            }
        }
        var diagonal_cone = [];
        for(let i = 1; i <= self.tile.range; ++i){
            for(let j = 0; j < i; ++j){
                // Creates the diagonal cone pattern ponting North West.
                diagonal_cone.push(new Point(j - i, -1 - j));
            }
        }
        // Choose breath cone for the direction we are facing.
        var cone = [];
        if(self.tile.direction.on_axis()){
            cone = create_orthogonal_cone(self.tile.rotate, self.tile.range);
        }
        else if(self.tile.direction.on_diagonal()){
            cone = create_diagonal_cone(self.tile.rotate, self.tile.range);
        }
        // Breath attack.
        for(let space of cone){
            var target_space = self.location.plus(space)
            map.attack(target_space);
            if(map.check_empty(target_space)){
                var fire = raging_fire_tile();
                map.add_tile(fire, target_space);
            }
        }
    }
    // Prep Flight.
    // Happens when it fails to aim fire breath or after it uses it. 
    var nearby = order_nearby(target.difference)
    if(target.difference.within_radius(2)){
        nearby = nearby.reverse();
    }
    self.tile.direction = nearby[0];
    self.tile.cycle = 0;
    self.tile.pic = self.tile.pic_arr[2 * self.tile.cycle + set_rotation(self.tile)];
    self.tile.description = `${self.tile.description_arr[0]}${self.tile.description_arr[self.tile.cycle + 1]}`;
    return;
}

/** @type {TelegraphFunction} */
function young_dragon_telegraph(location, map, self){
    if( self.rotate === undefined ||
        self.cycle === undefined ||
        self.range === undefined ||
        self.direction === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(self.cycle !== 2){
        return [];
    }
    var cone = [];
    if(self.direction.on_axis()){
        cone = create_orthogonal_cone(self.rotate, self.range);
    }
    else if(self.direction.on_diagonal()){
        cone = create_diagonal_cone(self.rotate, self.range);
    }
    cone = cone.map((p) => p.plus(location));
    return cone;
}
/**
 * Function to create a orthogonal cone of points potruding from the origin.
 * @param {number} rotation A multiple of 90 degrees indicating how much the cone should be rotated from North.
 * @param {number} range The height of the cone.
 * @returns {Point[]} The resulting cone.
 */
function create_orthogonal_cone(rotation, range){
    var cone = [];
    for(var i = 1; i <= range; ++i){
        for(var j = -(i - 1); j < i; ++j){
            cone.push((new Point(j, -1 * i)).rotate(rotation));
        }
    }
    return cone;
}
/**
 * Function to create a diagonal cone of points potruding from the origin.
 * @param {number} rotation A multiple of 90 degrees indicating how much the cone should be rotated from North West.
 * @param {number} range The height of the cone.
 * @returns {Point[]} The resulting cone.
 */
function create_diagonal_cone(rotation, range){
    var cone = [];
    for(var i = 1; i <= range; ++i){
        for(var j = 0; j < i; ++j){
            cone.push((new Point(j - i, -1 - j)).rotate(rotation));
        }
    }
    return cone;
}
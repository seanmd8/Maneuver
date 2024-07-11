/** @type {TileGenerator} A fireball that travels in a straight line until it hits something. Direction is not yet set.*/
function fireball_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}fireball_n.png`, `${IMG_FOLDER.tiles}fireball_nw.png`];
    return {
        type: `enemy`,
        name: `fireball`,
        pic: `${IMG_FOLDER.tiles}fireball.png`,
        description: fireball_description,
        behavior: fireball_ai,
        telegraph: fireball_telegraph,
        on_enter: fireball_on_enter,
        pic_arr,
        rotate: 0,
        direction: undefined
    }
}

/** @type {AIFunction}  AI used by fireballs.*/
function fireball_ai(self, target, map){
    if(self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(!map.move(self.location, self.location.plus(self.tile.direction))){
        // When it hits something, explodes and damages it.
        map.attack(self.location.plus(self.tile.direction));
        self.tile.health = 1;
        map.attack(self.location);
    }
}
/** @type {AIFunction} Function used by fireballs to blow up when soemthing tries to move onto them.*/
function fireball_on_enter(self, target, map){
    hazard(self, target, map);
    self.tile.health = 1;
    map.attack(self.location);
}

/** @type {TelegraphFunction} */
function fireball_telegraph(location, map, self){
    if(self.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    return [location.plus(self.direction), ...hazard_telegraph(location, map, self)];
}

/**
 * Function to create a fireball and point it in the right direction.
 * @param {Point} direction Where it's headed.
 * @returns {Tile} The new fireball.
 */
function shoot_fireball(direction){
    var fireball = fireball_tile();
    fireball.direction = direction;
    fireball.pic = ifexists(fireball.pic_arr)[set_rotation(fireball)];
    return fireball;
}
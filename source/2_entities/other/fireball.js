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
        throw new Error(`tile missing properties used by it's ai.`);
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
/**
 * Used by a fireball tile to set the correct direction, rotation and picture.
 * @param {Tile} tile The tile to set the direction of.
 * @param {Point} direction Ehich way it should face.
 */
function set_direction(tile, direction){
    if( tile.pic_arr === undefined ||
        tile.rotate === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    tile.direction = direction;
    if(direction.within_radius(0)){
        tile.rotate = 90 * (Math.abs((direction.x * -2 + 1)) + direction.y);
        tile.pic = tile.pic_arr[0];
    }
    else{
        tile.rotate= 90 * ((direction.x + direction.y) / 2 + 1);
        if(direction.x === -1 && direction.y === 1){
            tile.rotate = 90 * 3;
        }
        tile.pic = tile.pic_arr[1];
    }
}

/** @type {TelegraphFunction} */
function fireball_telegraph(location, map, self){
    if(self.direction === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    return [location.plus(self.direction)].concat(hazard_telegraph(location, map, self));
}
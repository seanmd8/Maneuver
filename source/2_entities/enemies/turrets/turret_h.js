/** @type {TileGenerator} */
function turret_h_tile(){
    return {
        type: `enemy`,
        name: `turret`,
        pic: `${IMG_FOLDER.tiles}turret_h.png`,
        description: turret_h_description,
        health: 1,
        difficulty: 2,
        behavior: turret_h_ai,
        telegraph: turret_h_telegraph
    }
}

/** @type {AIFunction} AI used by turrets that shoot orthogonally.*/
function turret_h_ai(self, target, map){
    // Turret version that shoots orthogonally.
    if(target.difference.x === 0 || target.difference.y === 0){
        turret_fire_ai(self, target, map);
    }
    else{
        throw new Error(`skip animation delay`);
    }
}

/** @type {TelegraphFunction} */
function turret_h_telegraph(location, map, self){
    var attacks = [];
    for(var direction of horizontal_directions){
        attacks = attacks.concat(get_points_in_direction(location, direction, map));
    }
    return attacks;
}
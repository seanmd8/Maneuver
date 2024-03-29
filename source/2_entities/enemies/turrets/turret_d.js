/** @type {TileGenerator} */
function turret_d_tile(){
    return {
        type: `enemy`,
        name: `turret`,
        pic: `${IMG_FOLDER.tiles}turret_d.png`,
        description: turret_d_description,
        health: 1,
        difficulty: 2,
        behavior: turret_d_ai,
        telegraph: turret_d_telegraph
    }
}

/** @type {AIFunction} AI used by turrets that shoot diagonally.*/
function turret_d_ai(self, target, map){
    // Turret version that shoots diagonally.
    if(Math.abs(target.difference.x) === Math.abs(target.difference.y)){
        turret_fire_ai(self, target, map);
    }
}

/** @type {TelegraphFunction} */
function turret_d_telegraph(location, map, self){
    var attacks = [];
    for(var direction of diagonal_directions){
        attacks = attacks.concat(get_points_in_direction(location, direction, map));
    }
    return attacks;
}
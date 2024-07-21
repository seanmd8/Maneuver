/** @type {TileGenerator} */
function turret_h_tile(){
    return {
        type: `enemy`,
        name: `turret`,
        pic: `${IMG_FOLDER.tiles}turret_h.png`,
        description: turret_h_description,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: turret_h_ai,
        telegraph: turret_h_telegraph
    }
}

/** @type {AIFunction} AI used by turrets that shoot orthogonally.*/
function turret_h_ai(self, target, map){
    // Turret version that shoots orthogonally.
    if(target.difference.on_axis()){
        turret_fire_ai(self, target, map);
    }
    else{
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {TelegraphFunction} */
function turret_h_telegraph(location, map, self){
    var attacks = [];
    for(var direction of HORIZONTAL_DIRECTIONS){
        attacks.push(...get_points_in_direction(location, direction, map));
    }
    return attacks;
}
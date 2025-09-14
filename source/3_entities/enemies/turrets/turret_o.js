/** @type {TileGenerator} */
function turret_o_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.turret,
        pic: `${IMG_FOLDER.tiles}turret_o.png`,
        description: enemy_descriptions.turret_h,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: turret_o_ai,
        telegraph: turret_o_telegraph
    }
}

/** @type {AIFunction} AI used by turrets that shoot orthogonally.*/
function turret_o_ai(self, target, map){
    // Turret version that shoots orthogonally.
    if(target.difference.on_axis()){
        turret_fire_ai(self, target, map);
    }
    else if(GS.boons.has(boon_names.manic_presence)){
        for(var p of ORTHOGONAL_DIRECTIONS){
            if(chance(1, 2)){
                turret_fire_ai(self, {difference: p}, map);
            }
        }
    }
    else{
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {TelegraphFunction} */
function turret_o_telegraph(location, map, self){
    var attacks = [];
    for(var direction of ORTHOGONAL_DIRECTIONS){
        attacks.push(...get_points_in_direction(location, direction, map));
    }
    return attacks;
}
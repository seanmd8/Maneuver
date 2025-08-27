/** @type {AreaGenerator}*/
function generate_sewers_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}sewers.png`,
        generate_floor: generate_sewers_floor,
        enemy_list: [rat_tile, turret_h_tile, turret_d_tile, large_porcuslime_tile, medium_porcuslime_tile, 
                    corrosive_caterpillar_tile, noxious_toad_tile, acid_bug_tile, carrion_flies_tile],
        boss_floor_list: [two_headed_serpent_floor],
        next_area_list: area3,
        description: area_descriptions.sewers
    }
}

/** @type {FloorGenerator}*/
function generate_sewers_floor(floor_num, area, map){
    if(chance(1, 8)){
        river_terrain(floor_num, area, map);
    }
    else{
        var terrains = [slime_terrain, grate_terrain];
        rand_from(terrains)(floor_num, area, map);
    }
    generate_normal_floor(floor_num, area, map);
}

/** @type {FloorGenerator}*/
function slime_terrain(floor_num, area, map){
    var slime_amount = random_num(4);
    for(var i = 0; i < slime_amount; ++i){
        map.spawn_safely(corrosive_slime_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {FloorGenerator}*/
function grate_terrain(floor_num, area, map){
    var grate_amount = random_num(3);
    for(var i = 0; i < grate_amount; ++i){
        map.spawn_safely(sewer_grate_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}

function river_terrain(floor_num, area, map){
    var left = random_num(FLOOR_WIDTH / 2 - 1) + 1;
    var right = (FLOOR_WIDTH / 2) - left;
    var x_vals = [...range(0, left), ...range(FLOOR_WIDTH - right, FLOOR_WIDTH)];
    var y = random_num(FLOOR_HEIGHT - 4) + 2;
    for(var x of x_vals){
        map.add_tile(sewer_grate_tile(), new Point(x, y));
        map.add_tile(corrosive_slime_tile(), new Point(x, y + 1));        
        map.add_tile(corrosive_slime_tile(), new Point(x, y - 1));        
    }
    cross(
        [left, FLOOR_WIDTH - (right + 1)], 
        [1, 0, -1],
        (e1, e2) => {
            map.add_tile(corrosive_slime_tile(), new Point(e1, y + e2));
        }
    )
}
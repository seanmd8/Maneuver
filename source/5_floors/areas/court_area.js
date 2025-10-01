/** @type {AreaGenerator}*/
function generate_court_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}court.png`,
        generate_floor: generate_court_floor,
        enemy_list: [
            shadow_scout_tile, claustropede_2_tile, claustropede_3_tile, unspeakable_tile, wheel_of_fire_tile, 
            blood_crescent_tile, shadow_knight_elite_tile, maw_tile
        ],
        boss_floor_list: [lord_of_shadow_and_flame_floor],
        next_area_list: [generate_default_area],
        name: area_names.court,
    }
}

/** @type {FloorGenerator}*/
function generate_court_floor(floor_num, area, map){
    var reduction = 0;
    if(chance(1, 2)){
        starcaller_terrain(floor_num, area, map);
        reduction += 3;
    }
    for(var i = 0; i < 4; ++i){
        if(chance(1, 4)){
            shatter_sphere_terrain(floor_num, area, map);
            reduction += 1;
        }
    }
    generate_normal_floor(floor_num - reduction, area, map);
}

function starcaller_terrain(floor_num, area, map){
    var amount = random_num(2) + 1;
    var offsets = rand_no_repeats(range(0, 4), amount);
    for(var offset of offsets){
        var tile = starcaller_tile();
        tile.cycle = offset + 1;
        map.spawn_safely(tile, SAFE_SPAWN_ATTEMPTS, true);
    }
}

function shatter_sphere_terrain(floor_num, area, map){
    var amount = random_num(4) + random_num(4);
    var summons = [
        shatter_sphere_tile,
        moon_rock_tile
    ];
    for(var i = 0; i < amount; ++i){
        map.spawn_safely(random_from(summons)(), SAFE_SPAWN_ATTEMPTS, true);
    }
}
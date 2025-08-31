/** @type {AreaGenerator}*/
function generate_court_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}court.png`,
        generate_floor: generate_court_floor,
        enemy_list: [
            shadow_scout_tile, claustropede_tile, unspeakable_tile, wheel_of_fire_tile, blood_crescent_tile,
            shadow_knight_elite_tile, starcaller_tile
        ],
        boss_floor_list: [],
        next_area_list: [generate_default_area],
        description: area_descriptions.court
    }
}

/** @type {FloorGenerator}*/
function generate_court_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
/** @type {AreaGenerator}*/
function generate_library_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}library.png`,
        generate_floor: generate_library_floor,
        enemy_list: [
            moving_turret_h_tile, moving_turret_d_tile, brightling_tile, captive_void_tile, paper_construct_tile,
            unstable_wisp_tile, walking_prism_tile, specter_tile, clay_golem_tile, gem_crawler_tile
        ],
        boss_floor_list: [arcane_sentry_floor],
        next_area_list: area5,
        description: library_description
    }
}

/** @type {FloorGenerator}*/
function generate_library_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
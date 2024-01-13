// ----------------Areas.js----------------
// File containing functions to generate area objects.

const area_end = [generate_default_area];
const area1 = [generate_ruins_area];
const area2 = [/*generate_sewers_area, */generate_basement_area];
const area3 = [/*generate_magma_area, */generate_crypt_area];
const area4 = area_end;//[generate_forest_area, generate_library_area];
const area5 = [generate_sanctum_area];



/**
 * @typedef {object} Area
 * @property {string} background
 * @property {FloorGenerator} generate_floor
 * @property {TileGenerator[]} enemy_list
 * @property {FloorGenerator[]} boss_floor_list
 * @property {AreaGenerator[]} next_area_list
 * @property {string} description
 */

/**
 * @callback AreaGenerator
 * @returns {Area}
 */

/** @type {AreaGenerator}*/
function generate_ruins_area(){
    return {
        background: `${img_folder.backgrounds}ruins.png`,
        generate_floor: generate_ruins_floor,
        enemy_list: [spider_tile, turret_h_tile, turret_d_tile, scythe_tile, spider_web_tile, ram_tile, rat_tile, acid_bug_tile, shadow_knight_tile],
        boss_floor_list: [velociphile_floor],
        next_area_list: area2,
        description: ruins_description
    }
}
/** @type {AreaGenerator}*/
function generate_sewers_area(){
    return {
        background: `${img_folder.backgrounds}sewers.png`,
        generate_floor: generate_sewers_floor,
        enemy_list: [rat_tile, turret_h_tile, turret_d_tile, large_porcuslime_tile, medium_porcuslime_tile, corrosive_caterpillar_tile, noxious_toad_tile, acid_bug_tile],
        boss_floor_list: [],
        next_area_list: area3,
        description: sewers_description
    }
}
/** @type {AreaGenerator}*/
function generate_basement_area(){
    return {
        background: `${img_folder.backgrounds}basement.png`,
        generate_floor: generate_basement_floor,
        enemy_list: [spider_tile, turret_h_tile, turret_d_tile, turret_r_tile, scythe_tile, spider_web_tile, clay_golem_tile, rat_tile, shadow_knight_tile],
        boss_floor_list: [spider_queen_floor],
        next_area_list: area3,
        description: basement_description
    }
}
/** @type {AreaGenerator}*/
function generate_magma_area(){
    return {
        background: `${img_folder.backgrounds}magma.png`,
        generate_floor: generate_magma_floor,
        enemy_list: [],
        boss_floor_list: [],
        next_area_list: area4,
        description: magma_description
    }
}
/** @type {AreaGenerator}*/
function generate_crypt_area(){
    return {
        background: `${img_folder.backgrounds}crypt.png`,
        generate_floor: generate_crypt_floor,
        enemy_list: [shadow_knight_tile, spider_web_tile, vampire_tile, clay_golem_tile, rat_tile, spider_tile, turret_r_tile, brightling_tile],
        boss_floor_list: [lich_floor],
        next_area_list: area4,
        description: crypt_description
    }
}
/** @type {AreaGenerator}*/
function generate_forest_area(){
    return {
        background: `${img_folder.backgrounds}forest.png`,
        generate_floor: generate_forest_floor,
        enemy_list: [],
        boss_floor_list: [],
        next_area_list: area5,
        description: forest_description
    }
}
/** @type {AreaGenerator}*/
function generate_library_area(){
    return {
        background: `${img_folder.backgrounds}library.png`,
        generate_floor: generate_library_floor,
        enemy_list: [],
        boss_floor_list: [],
        next_area_list: area5,
        description: ruins_description
    }
}
/** @type {AreaGenerator}*/
function generate_sanctum_area(){
    return {
        background: `${img_folder.backgrounds}sanctum.png`,
        generate_floor: generate_sanctum_floor,
        enemy_list: [],
        boss_floor_list: [],
        next_area_list: [generate_default_area],
        description: sanctum_description
    }
}

/** @type {AreaGenerator}*/
function generate_default_area(){
    return {
        background: `${img_folder.backgrounds}default.png`,
        generate_floor: floor_generator,
        enemy_list: ENEMY_LIST,
        boss_floor_list: [],
        next_area_list: [generate_default_area],
        description: default_area_description
    }
}
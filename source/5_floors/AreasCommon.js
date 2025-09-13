// ----------------Areas.js----------------
// File containing functions used by areas.

// The structure of the dungeon. Each area can lead to a random one in the next numbered array.
const area_end = [generate_default_area]; // Once they have finished the completed areas, they go here.
const area1 = [generate_ruins_area];
const area2 = [generate_sewers_area, generate_basement_area];
const area3 = [generate_magma_area, generate_crypt_area];
const area4 = [generate_forest_area, generate_library_area];
const area5 = [generate_court_area];

/**
 * @typedef {Object} Area A section of the dungeon that ends with a boss fight.
 * @property {string} background The picture used as a background for this area.
 * @property {FloorGenerator} generate_floor A function to generate a normal floor of the dungeon.
 * @property {TileGenerator[]} enemy_list An array of which enemies can spawn here.
 * @property {FloorGenerator[]} boss_floor_list An array of functions that can create a boss floor at the end of the area.
 * @property {AreaGenerator[]} next_area_list An array of the areas that can follow this one.
 * @property {string} description A description given when entering this area.
 */

/**
 * @callback AreaGenerator A function to create 
 * @returns {Area}         and return an area object.
 */

// ---Unfinished Areas---

/** @type {AreaGenerator}*/
function generate_default_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}default.png`,
        generate_floor: floor_generator,
        enemy_list: ENEMY_LIST,
        boss_floor_list: [],
        next_area_list: [generate_default_area],
        name: area_names.default,
    }
}
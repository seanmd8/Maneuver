/** @type {AreaGenerator}*/
function generate_ruins_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}ruins.png`,
        generate_floor: generate_ruins_floor,
        enemy_list: [spider_tile, turret_o_tile, turret_d_tile, scythe_tile, vinesnare_bush_tile, 
                    ram_tile, rat_tile, shadow_knight_tile],
        boss_floor_list: [velociphile_floor],
        next_area_list: area2,
        description: area_descriptions.ruins
    }
}

/** @type {FloorGenerator}*/
function generate_ruins_floor(floor_num, area, map){
    // gives a little extra difficulty since it's the first area and there isn't any terrain.
    generate_normal_floor(floor_num + 1, area, map);
}
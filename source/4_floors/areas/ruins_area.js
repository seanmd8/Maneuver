/** @type {AreaGenerator}*/
function generate_ruins_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}ruins.png`,
        generate_floor: generate_ruins_floor,
        enemy_list: [spider_tile, turret_h_tile, turret_d_tile, scythe_tile, spider_web_tile, 
                    ram_tile, rat_tile, shadow_knight_tile, vinesnare_bush_tile],
        boss_floor_list: [velociphile_floor],
        next_area_list: area2,
        description: ruins_description
    }
}
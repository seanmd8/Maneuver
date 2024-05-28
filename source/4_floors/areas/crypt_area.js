/** @type {AreaGenerator}*/
function generate_crypt_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}crypt.png`,
        generate_floor: generate_crypt_floor,
        enemy_list: [shadow_knight_tile, vampire_tile, clay_golem_tile, turret_r_tile, shadow_scout_tile, 
                    darkling_tile, orb_of_insanity_tile],
        boss_floor_list: [lich_floor],
        next_area_list: area4,
        description: crypt_description
    }
}
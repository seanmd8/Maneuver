/** @type {AreaGenerator}*/
function generate_sewers_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}sewers.png`,
        generate_floor: generate_sewers_floor,
        enemy_list: [rat_tile, turret_h_tile, turret_d_tile, large_porcuslime_tile, medium_porcuslime_tile, 
                    corrosive_caterpillar_tile, noxious_toad_tile, acid_bug_tile, carrion_flies_tile],
        boss_floor_list: [two_headed_serpent_floor],
        next_area_list: area3,
        description: sewers_description
    }
}
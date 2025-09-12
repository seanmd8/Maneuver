function sewers_display_info(){
    var area = generate_sewers_area();
    return {
        name: area.name,
        background: area.background,
        boss: two_headed_serpent_tile,
        tiles: [
            ...area.enemy_list, 
            corrosive_slime_tile, 
            sewer_grate_tile,
            small_d_porcuslime_tile,
            small_o_porcuslime_tile,
        ],
    }
}

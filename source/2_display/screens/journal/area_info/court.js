function court_display_info(){
    var area = generate_court_area();
    return {
        name: area.name,
        background: area.background,
        boss: lord_of_shadow_and_flame_tile,
        tiles: [
            ...area.enemy_list, 
            claustropede_1_tile,
            starcaller_tile, 
            moon_rock_tile, 
            shatter_sphere_d_tile, 
            shatter_sphere_o_tile
        ],
    }
}
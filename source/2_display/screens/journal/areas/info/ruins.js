function ruins_display_info(){
    var area = generate_ruins_area();
    return {
        name: area.name,
        background: area.background,
        boss: velociphile_tile,
        tiles: [
            ...area.enemy_list
        ],
    }
}
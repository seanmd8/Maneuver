function basement_display_info(){
    var area = generate_basement_area();
    return {
        name: area.name,
        background: area.background,
        boss: spider_queen_tile,
        tiles: [
            ...area.enemy_list, 
            wall_tile, 
            damaged_wall_tile
        ],
    }
}
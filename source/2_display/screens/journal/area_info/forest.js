function forest_display_info(){
    var area = generate_forest_area();
    return {
        name: area.name,
        background: area.background,
        boss: forest_heart_tile,
        tiles: [
            ...area.enemy_list, 
            enticing_fruit_tree_tile,
            thorn_bramble_tile,
        ],
    }
}
function assorted_tiles_display_info(){
    var area = generate_ruins_area();
    return {
        name: area_names.assorted,
        background: area.background,
        tiles: [
            ...LORD_SUMMONS,
            arcane_node_tile,
            black_hole_tile,
            living_tree_rooted_tile,
            rotting_fruit_tree_tile,
            two_headed_serpent_body_tile,
        ],
    }
}
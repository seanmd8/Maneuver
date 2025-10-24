function basic_tiles_display_info(){
    var area = generate_ruins_area();
    return {
        name: area_names.basic,
        background: area.background,
        boss: player_tile,
        tiles: [
            armored_chest_tile,
            chest_tile,
            exit_tile,
            final_exit_tile,
            lock_tile,
        ],
    }
}
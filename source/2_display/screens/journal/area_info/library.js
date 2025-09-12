function library_display_info(){
    var area = generate_library_area();
    return {
        name: area.name,
        background: area.background,
        boss: arcane_sentry_tile,
        tiles: [
            ...area.enemy_list, 
            bookshelf_tile
        ],
    }
}
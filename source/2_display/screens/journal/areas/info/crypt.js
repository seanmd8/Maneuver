function crypt_display_info(){
    var area = generate_crypt_area();
    return {
        name: area.name,
        background: area.background,
        boss: lich_tile,
        tiles: [
            ...area.enemy_list, 
            coffin_tile
        ],
    }
}
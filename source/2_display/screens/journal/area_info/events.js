function events_display_info(){
    var area = generate_ruins_area();
    return {
        name: area_names.events,
        background: area.background,
        tiles: [
            // black_hole_beginning
            // darkling_rift
            // falling_rubble
            // starcaller_rift
            // sunlight
            // swaying_nettle_roots
            // thorn_roots
        ],
    }
}
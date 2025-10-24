function events_display_info(){
    var area = generate_ruins_area();
    return {
        name: area_names.events,
        background: area.background,
        tiles: [
            black_hole_beginning_mark,
            confusion_cloud_mark,
            darkling_rift_mark,
            falling_rubble_mark,
            nettle_roots_mark,
            starcaller_rift_mark,
            sunlight_mark,
            thorn_roots_mark,
        ],
    }
}
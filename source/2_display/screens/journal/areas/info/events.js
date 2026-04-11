function events_display_info(){
    var area = generate_ruins_area();
    return {
        name: area_names.events,
        background: area.background,
        tiles: [
            black_hole_beginning_mark,
            confusion_cloud_mark,
            delayed_strike_mark,
            delayed_stun_mark,
            darkling_rift_mark,
            falling_rubble_mark,
            hidden_enemy_mark,
            nettle_roots_mark,
            shockwave_mark,
            starcaller_rift_mark,
            sunlight_mark,
            thorn_roots_mark,
        ],
    }
}
function safe_passage(){
    return {
        name: boon_names.safe_passage,
        pic: `${IMG_FOLDER.boons}safe_passage.png`,
        description: boon_descriptions.safe_passage,
        prereq_description: boon_prereq_descriptions.safe_passage,
        prereq: prereq_safe_passage,
        chest_only: true,
    }
}

function prereq_safe_passage(){
    var player = GS.map.get_player();
    return player.max_health === undefined || player.health < player.max_health;
}

function do_safe_passage(){
    GS.boons.lose(boon_names.safe_passage);
    GS.refresh_boon_display();
    GS.map.player_heal(new Point(0, 0));
    GS.map.display_stats();
    var floor = GS.map.get_floor_num();
    var size = init_settings().area_size;
    var dif = size - (floor % size) - 1;
    GS.map.add_to_floor(dif);
    GS.enter_shop();
}
function limitless(){
    return {
        name: boon_names.limitless,
        pic: `${IMG_FOLDER.boons}limitless.png`,
        description: boon_descriptions.limitless,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: pick_limitless,
        max: 1,
    }
}

function pick_limitless(){
    GS.map.player_heal(new Point(0, 0));
    GS.map.get_player().max_health = undefined;
}
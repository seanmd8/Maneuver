function limitless(){
    return {
        name: boon_names.limitless,
        pic: `${IMG_FOLDER.boons}limitless.png`,
        description: boon_descriptions.limitless,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: on_pick_limitless,
        max: 1,
    }
}

function on_pick_limitless(){
    GS.map.get_player().max_health = undefined;
    GS.map.player_heal(new Point(0, 0), 2);
}
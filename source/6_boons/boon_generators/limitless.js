function limitless(){
    return {
        name: boon_names.limitless,
        pic: `${IMG_FOLDER.boons}limitless.png`,
        description: limitless_description,
        on_pick: on_pick_limitless
    }
}

function on_pick_limitless(){
    GS.map.get_player().max_health = undefined;
    GS.map.player_heal(new Point(0, 0), 2);
}
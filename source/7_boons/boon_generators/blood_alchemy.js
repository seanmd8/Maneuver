function blood_alchemy(){
    return {
        name: boon_names.blood_alchemy,
        pic: `${IMG_FOLDER.boons}blood_alchemy.png`,
        description: boon_descriptions.blood_alchemy,
        prereq_description: boon_prereq_descriptions.blood_alchemy,
        prereq: prereq_blood_alchemy,
        on_pick: pick_blood_alchemy,
    }
}

function prereq_blood_alchemy(){
    var player = GS.map.get_player();
    return player.max_health !== undefined && player.health > 2;
}

function pick_blood_alchemy(){
    change_max_health(2);
    for(var i = 0; i < 2; ++i){
        var location = GS.map.get_player_location();
        GS.map.attack(location);
    }
}
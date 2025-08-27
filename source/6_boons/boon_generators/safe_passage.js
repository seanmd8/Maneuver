
function safe_passage(){
    return {
        name: boon_names.safe_passage,
        pic: `${IMG_FOLDER.boons}safe_passage.png`,
        description: boon_descriptions.safe_passage,
        prereq: prereq_safe_passage,
        unlocks: [safe_passage]
    }
}

function prereq_safe_passage(){
    var player = GS.map.get_player();
    return player.max_health === undefined || player.health < player.max_health;
}
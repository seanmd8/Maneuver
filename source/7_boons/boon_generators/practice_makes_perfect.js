function practice_makes_perfect(){
    return {
        name: boon_names.practice_makes_perfect,
        pic: `${IMG_FOLDER.boons}practice_makes_perfect.png`,
        description: boon_descriptions.practice_makes_perfect,
        prereq_description: boon_prereq_descriptions.practice_makes_perfect,
        prereq: prereq_practice_makes_perfect,
        max: 1,
    }
}

function prereq_practice_makes_perfect(){
    var has_health = GS.map.get_player().max_health !== undefined;
    var not_deep = GS.map.get_floor_num() < 15;
    return has_health && not_deep;
}
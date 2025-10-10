function repetition(){
    return {
        name: boon_names.repetition,
        pic: `${IMG_FOLDER.boons}repetition.png`,
        description: boon_descriptions.repetition,
        prereq_description: boon_prereq_descriptions.none,
        max: 3,
    }
}

function repeat_amount(){
    var repetition_count = GS.boons.has(boon_names.repetition);
    var repeat = repetition_count > 0 && GS.map.get_turn_count() % 3 < repetition_count;
    return repeat ? 2 : 1;
}
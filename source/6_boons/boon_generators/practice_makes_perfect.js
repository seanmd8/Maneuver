
function practice_makes_perfect(){
    return {
        name: boon_names.practice_makes_perfect,
        pic: `${IMG_FOLDER.boons}practice_makes_perfect.png`,
        description: practice_makes_perfect_description,
        prereq: prereq_practice_makes_perfect
    }
}

function prereq_practice_makes_perfect(){
    return GS.map.get_player().max_health !== undefined;
}
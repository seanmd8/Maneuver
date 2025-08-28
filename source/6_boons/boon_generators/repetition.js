
function repetition(){
    return {
        name: boon_names.repetition,
        pic: `${IMG_FOLDER.boons}repetition.png`,
        description: boon_descriptions.repetition,
        prereq: prereq_repetition,
        unlocks: [repetition]
    }
}

function prereq_repetition(){
    return GS.boons.has(boon_names.repetition) < 3;
}
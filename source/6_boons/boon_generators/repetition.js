
function repetition(){
    return {
        name: boon_names.repetition,
        pic: `${IMG_FOLDER.boons}repetition.png`,
        description: repetition_description,
        prereq: prereq_repetition,
        unlocks: [repetition]
    }
}

function prereq_repetition(){
    return getSelection.boons.has(boon_names.repetition) < 3;
}
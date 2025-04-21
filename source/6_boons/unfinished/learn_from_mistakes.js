
function learn_from_mistakes(){
    return {
        name: boon_names.learn_from_mistakes,
        pic: `${IMG_FOLDER.boons}learn_from_mistakes.png`,
        description: learn_from_mistakes_description,
        on_pick: pick_learn_from_mistakes,
        unlocks: [learn_from_mistakes]
    }
}

// Delete any card twice
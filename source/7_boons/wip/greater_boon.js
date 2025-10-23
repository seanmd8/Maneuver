function greater_boon(){
    return {
        name: boon_names.greater_boon,
        pic: `${IMG_FOLDER.boons}greater_boon.png`,
        description: boon_descriptions.greater_boon,
        prereq_description: boon_prereq_descriptions.greater_boon,
        prereq: prereq_greater_boon,
        on_pick: pick_greater_boon,
    }
}

function prereq_greater_boon(){
    // Filter for @max
    // Filter for meets prereq
    // Return remainder > 0
}

function pick_greater_boon(){
    // Filter for @max
    // Filter for meets prereq
    // Use Deck Select? or put 3-5 choices in new chest screen
}
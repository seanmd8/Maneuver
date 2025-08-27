function slime_trail(){
    return {
        name: boon_names.slime_trail,
        pic: `${IMG_FOLDER.boons}slime_trail.png`,
        description: boon_descriptions.slime_trail,
        prereq: prereq_slime_trail,
        unlocks: [slime_trail]
    }
}

function prereq_slime_trail(){
    return GS.boons.has(boon_names.slime_trail) < 2;
}
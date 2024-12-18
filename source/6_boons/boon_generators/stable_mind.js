
function stable_mind(){
    return {
        name: boon_names.stable_mind,
        pic: `${IMG_FOLDER.boons}stable_mind.png`,
        description: stable_mind_description,
        prereq: prereq_stable_mind,
        unlocks: [stable_mind]
    }
}

function prereq_stable_mind(){
    return GS.boons.has(boon_names.stable_mind) < 2;
}
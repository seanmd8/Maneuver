
function quick_healing(){
    return {
        name: boon_names.quick_healing,
        pic: `${IMG_FOLDER.boons}quick_healing.png`,
        description: boon_descriptions.quick_healing,
        prereq: prereq_quick_healing,
        unlocks: [quick_healing]
    }
}
function prereq_quick_healing(){
    return GS.boons.has(boon_names.quick_healing) < 3;
}
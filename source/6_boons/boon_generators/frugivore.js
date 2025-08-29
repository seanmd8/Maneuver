function frugivore(){
    return {
        name: boon_names.frugivore,
        pic: `${IMG_FOLDER.boons}frugivore.png`,
        description: boon_descriptions.frugivore,
        prereq: prereq_frugivore,
        unlocks: [frugivore]
    }
}
function prereq_frugivore(){
    return GS.boons.has(boon_names.frugivore) < 2;
}
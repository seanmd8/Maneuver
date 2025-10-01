function hoarder(){
    return {
        name: boon_names.hoarder,
        pic: `${IMG_FOLDER.boons}hoarder.png`,
        description: boon_descriptions.hoarder,
        prereq_description: boon_prereq_descriptions.hoarder,
        prereq: prereq_hoarder,
        max: 1,
    }
}

function prereq_hoarder(){
    return GS.map.get_floor_num() < 15;
}
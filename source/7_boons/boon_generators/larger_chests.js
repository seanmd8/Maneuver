function larger_chests(){
    return {
        name: boon_names.larger_chests,
        pic: `${IMG_FOLDER.boons}larger_chests.png`,
        description: boon_descriptions.larger_chests,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: pick_larger_chests,
        max: 1,
    }
}

function pick_larger_chests(){
    display.add_class(UIIDS.chest,`large-chest`);
    GS.map.stats.alter_card_chest_choices(2);
    GS.map.stats.alter_boon_chest_choices(2);
}
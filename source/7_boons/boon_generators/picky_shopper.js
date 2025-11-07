function picky_shopper(){
    return {
        name: boon_names.picky_shopper,
        pic: `${IMG_FOLDER.boons}picky_shopper.png`,
        description: boon_descriptions.picky_shopper,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: pick_picky_shopper,
    }
}

function pick_picky_shopper(){
    GS.map.stats.alter_add_choices(1);
    GS.map.stats.alter_remove_choices(1);
}
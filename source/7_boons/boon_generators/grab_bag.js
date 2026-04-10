function grab_bag(){
    return {
        name: boon_names.grab_bag,
        pic: `${IMG_FOLDER.boons}grab_bag.png`,
        description: boon_descriptions.grab_bag,
        prereq_description: boon_prereq_descriptions.none,
        cost_description: boon_cost_descriptions.grab_bag,
        on_pick: pick_grab_bag,
        chest_only: true,
    }
}


function pick_grab_bag(){
    // Add 2 boons
    for(var i = 0; i < 2; ++i){
        var boon = random_from(GS.boons.get_choices().filter((b) => {
            return !b.chest_only;
        }));
        GS.boons.pick(boon.name);
    }
    GS.refresh_boon_display();

    // Add 2 confusion cards
    var has_voucher = GS.boons.has(boon_names.soul_voucher);
    if(!has_voucher){
        for(var i = 0; i < 2; ++i){
            if(!chance(GS.boons.has(boon_names.stable_mind), 2)){
                card = random_from(CONFUSION_CARDS)();
                GS.deck.add(card);
            }
        }
    }
}
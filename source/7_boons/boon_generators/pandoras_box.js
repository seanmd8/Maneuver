function pandoras_box(){
    return {
        name: boon_names.pandoras_box,
        pic: `${IMG_FOLDER.boons}pandoras_box.png`,
        description: boon_descriptions.pandoras_box,
        prereq_description: boon_prereq_descriptions.pandoras_box,
        prereq: prereq_pandoras_box,
        on_pick: pick_pandoras_box,
        chest_only: true,
    }
}

function prereq_pandoras_box(){
    return max_health_greater_than(2);
}

function pick_pandoras_box(){
    var max = GS.map.get_player().max_health;
    change_max_health(1 - max);
    for(var i = 0; i < max; ++i){
        var boon = random_from(GS.boons.get_choices().filter((b) => {
            return !b.chest_only;
        }));
        GS.boons.pick(boon.name);
    }
    GS.refresh_boon_display();
}
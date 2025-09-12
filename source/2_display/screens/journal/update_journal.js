function update_journal(){
    update_journal_cards();
    update_journal_boons();
    update_journal_areas();
}

function setup_journal_navbar(){
    var id = UIIDS.journal_navbar;

    var section_id_list = [
        UIIDS.journal_cards,
        UIIDS.journal_boons,
        UIIDS.journal_areas,
    ];

    var swap_visibility = function(id_list, id){
        return function(){
            display.swap_screen(id_list, id);
        }
    }

    display.create_visibility_toggle(id, journal_navbar_labels.cards, swap_visibility(section_id_list, UIIDS.journal_cards));
    display.create_visibility_toggle(id, journal_navbar_labels.boons, swap_visibility(section_id_list, UIIDS.journal_boons));
    display.create_visibility_toggle(id, journal_navbar_labels.areas, swap_visibility(section_id_list, UIIDS.journal_areas));

    display.swap_screen(section_id_list, UIIDS.journal_cards);
}
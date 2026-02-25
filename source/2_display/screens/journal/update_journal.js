function update_journal(){
    update_journal_cards();
    update_journal_boons();
    update_journal_areas();
    update_achievements();
}

const journal_navbar_ids = [
    UIIDS.journal_cards,
    UIIDS.journal_boons,
    UIIDS.journal_areas,
    UIIDS.achievements,
    UIIDS.journal_history
]

function setup_journal_navbar(){
    var id = UIIDS.journal_navbar;

    var swap_visibility = function(id_list, id){
        return function(){
            display.swap_screen(id_list, id);
        }
    }

    display.create_visibility_toggle(id, journal_navbar_labels.cards, swap_visibility(journal_navbar_ids, UIIDS.journal_cards));
    display.create_visibility_toggle(id, journal_navbar_labels.boons, swap_visibility(journal_navbar_ids, UIIDS.journal_boons));
    display.create_visibility_toggle(id, journal_navbar_labels.areas, swap_visibility(journal_navbar_ids, UIIDS.journal_areas));
    display.create_visibility_toggle(id, journal_navbar_labels.achievements, swap_visibility(journal_navbar_ids, UIIDS.achievements));
    display.create_visibility_toggle(id, journal_navbar_labels.history, swap_visibility(journal_navbar_ids, UIIDS.journal_history));

    display.swap_screen(journal_navbar_ids, UIIDS.journal_cards);
}
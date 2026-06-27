function update_journal(){
    update_journal_cards();
    update_journal_boons();
    update_journal_areas();
    update_achievements();
}


function setup_journal_navbar(){
    var id = UIIDS.journal_navbar;
    JOURNAL_DIVISIONS.set([
        UIIDS.journal_cards,
        UIIDS.journal_boons,
        UIIDS.journal_areas,
        UIIDS.achievements,
        UIIDS.journal_history
    ]);
    var swap = function(id){
        return function(){
            JOURNAL_DIVISIONS.swap(id)
        }
    }

    display.create_visibility_toggle(id, journal_navbar_labels.cards, swap(UIIDS.journal_cards));
    display.create_visibility_toggle(id, journal_navbar_labels.boons, swap(UIIDS.journal_boons));
    display.create_visibility_toggle(id, journal_navbar_labels.areas, swap(UIIDS.journal_areas));
    display.create_visibility_toggle(id, journal_navbar_labels.achievements, swap(UIIDS.achievements));
    display.create_visibility_toggle(id, journal_navbar_labels.history, swap(UIIDS.journal_history));

    JOURNAL_DIVISIONS.swap(UIIDS.journal_cards);
}
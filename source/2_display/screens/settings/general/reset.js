function reset_achievements(){
    GS.data.reset_achievements();
    update_achievements();
}
function reset_areas(){
    GS.data.reset_areas();
    update_journal_areas();
}
function reset_boons(){
    GS.data.reset_boons();
    update_journal_boons();
}
function reset_cards(){
    GS.data.reset_cards();
    update_journal_cards();
}
function reset_journal(){
    reset_achievements();
    reset_areas();
    reset_boons();
    reset_cards();
}
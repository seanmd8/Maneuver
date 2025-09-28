function update_journal_boons(){
    display.remove_children(UIIDS.journal_boons);
    display.create_fixed_box(UIIDS.journal_boons, UIIDS.journal_boon_info);
    var boons = boons_encountered(BOON_LIST, GS.data.boons);
    display.journal_boon_section(UIIDS.journal_boons, boon_messages.section_header, boons);

}
function boons_encountered(boons, encountered){
    var locked = get_locked_boons();
    return boons.map((b) => {
        var boon = b();
        if(locked.find((l) => {return l().name === boon.name;})){
            boon = symbol_locked_boon();
        }
        else if(!encountered.has(boon.name)){
            boon = symbol_not_encountered_boon();
        }
        else{
            boon.description = explain_boon_with_stats(boon);
        }
        boon.on_click = () => {
            display.display_message(UIIDS.journal_boon_info, boon.description);
        }
        return boon;
    });
}
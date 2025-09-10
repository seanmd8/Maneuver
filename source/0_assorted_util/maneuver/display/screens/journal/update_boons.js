function update_journal_boons(){
    display.remove_children(UIIDS.journal_boons);
    var boons = boons_encountered(BOON_LIST, GS.data.boons);
    display.journal_boon_section(UIIDS.journal_boons, boon_messages.section_header, boons);

}
function boons_encountered(boons, encountered){
    var locked = get_locked_boons();
    return boons.map((b) => {
        var boon = b();
        if(locked.find((l) => {
            return l().name === boon.name;
        })){
            return symbol_locked_boon();
        }
        if(encountered.has(boon.name)){
            return boon;
        }
        return symbol_not_encountered_boon();
    });
}
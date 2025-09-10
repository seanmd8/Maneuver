function update_journal_boons(){
    display.remove_children(UIIDS.journal_boons);
    var boons = boons_encountered(BOON_LIST, GS.data.boons);
    display.journal_boon_section(UIIDS.journal_boons, boon_messages.section_header, boons);

}
function boons_encountered(boons, encountered){
    return boons.map((b) => {
        var boon = b();
        if(encountered.has(boon.name)){
            return boon;
        }
        return symbol_not_encountered_boon();
    });
}
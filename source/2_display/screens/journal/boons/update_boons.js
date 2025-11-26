function update_journal_boons(){
    display.remove_children(UIIDS.journal_boons);
    var boons = boons_encountered(BOON_LIST, GS.data.boons);
    var has = boons_has_amount(boons);
    display.journal_boon_section(UIIDS.journal_boons, boon_messages.section_header, boons, has);
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
        return boon;
    });
}
function boons_has_amount(boons){
    var has = 0;
    var total = boons.length;
    for(var boon of boons){
        if(boon.name !== boon_names.locked && boon.name !== boon_names.not_encountered){
            ++has;
        }
    }
    return `${has}/${total}`;
}
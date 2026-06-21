class ScreenTracker{
    div;
    current;
    constructor(divisions){
        this.div = divisions;
    }
    swap(division){
        if(division !== undefined && this.div.find((d) => {d === division}) === -1){
            throw new Error(ERRORS.value_not_found);
        }
        display.swap_screen(this.div, division);
        this.current = division;
    }
    move(change){
        var index = this.div.indexOf(this.current);
        index = mod(index + change, this.div.length);
        this.swap(this.div[index]);
    }
    is(division){
        return division === this.current;
    }
    set(divisions){
        this.div = divisions;
        this.current = undefined;
    }
    add(division){
        this.div.push(division);
    }
}

const DISPLAY_DIVISIONS = new ScreenTracker([UIIDS.game_screen, UIIDS.guide, UIIDS.journal, UIIDS.settings]);
const GAME_SCREEN_DIVISIONS = new ScreenTracker([UIIDS.stage, UIIDS.shop, UIIDS.chest, UIIDS.deck_select]);
const SIDEBAR_DIVISIONS = new ScreenTracker([UIIDS.text_log, UIIDS.boon_list, UIIDS.discard_pile, UIIDS.full_deck, UIIDS.initiative, UIIDS.deck_order]);

// Set by it's display function.
const GUIDEBOOK_DIVISIONS = new ScreenTracker([]); 
const JOURNAL_DIVISIONS = new ScreenTracker([]);
const SETTINGS_DIVISIONS = new ScreenTracker([]);
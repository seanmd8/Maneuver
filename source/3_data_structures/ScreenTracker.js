
class ScreenTracker{
    div;
    current;
    constructor(divisions){
        this.div = divisions;
    }
    swap(division){
        if(division !== undefined && this.div.find((d) => {d === division}) === -1){
            throw new Error(ERRORS.value_not_found)
        }
        display.swap_screen(this.div, division);
        this.current = division;
    }
    is(division){
        return division === this.current;
    }
}

const DISPLAY_DIVISIONS = new ScreenTracker([UIIDS.game_screen, UIIDS.guide, UIIDS.controls, UIIDS.achievements]);
const GAME_SCREEN_DIVISIONS = new ScreenTracker([UIIDS.stage, UIIDS.shop, UIIDS.chest, UIIDS.deck_select]);
const SIDEBAR_DIVISIONS = new ScreenTracker([UIIDS.text_log, UIIDS.boon_list, UIIDS.discard_pile, UIIDS.initiative, UIIDS.deck_order]);
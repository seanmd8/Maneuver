/**
 * Function to create and add the buttons for the sidebar.
 */
function create_sidebar(){
    var location = UIIDS.sidebar_header;
    SIDEBAR_DIVISIONS.swap(UIIDS.text_log); // Hides all before some are removed from the list
    SIDEBAR_DIVISIONS.set([
        UIIDS.text_log, 
        UIIDS.discard_pile, 
        UIIDS.initiative
    ]);
    var swap = function(id){
        return function(){
            SIDEBAR_DIVISIONS.swap(id);
        }
    }
    display.remove_children(location);
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.text_log, swap(UIIDS.text_log));
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.discard_pile, swap(UIIDS.discard_pile));
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.initiative, swap(UIIDS.initiative));
    SIDEBAR_DIVISIONS.swap(UIIDS.text_log);
}
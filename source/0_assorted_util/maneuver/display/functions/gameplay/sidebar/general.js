/**
 * Function to create and add the buttons for the sidebar.
 */
function create_sidebar(){
    var location = UIIDS.sidebar_header;
    var swap_visibility = function(id_list, id){
        return function(){
            id_list.swap(id);
        }
    }
    display.remove_children(location);
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.text_log, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.text_log));
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.discard_pile, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.discard_pile));
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.initiative, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.initiative));
    SIDEBAR_DIVISIONS.swap(UIIDS.text_log);
}

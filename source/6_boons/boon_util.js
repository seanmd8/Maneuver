
/**
 * Checks to make sure there is no previous player on_hit function since they are mutually exclusive.
 * @returns 
 */
function no_player_on_hit(){
    return GS.map.get_player().on_hit === undefined;
}
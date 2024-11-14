/** @type {TelegraphFunction} Function to telegraph living tree attacks.*/
function living_tree_telegraph(location, map, self){
    return get_2_away().map(p => {
        return p.plus(location);
    })
}

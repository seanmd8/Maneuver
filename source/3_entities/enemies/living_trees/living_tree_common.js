/** @type {TelegraphFunction} Function to telegraph living tree attacks.*/
function living_tree_telegraph(location, map, self){
    var spaces = point_rectangle(new Point(-2, -2), new Point(2, 2));
    return spaces.map(p => {
        return p.plus(location);
    });
}
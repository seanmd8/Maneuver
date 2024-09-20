/** @type {TelegraphFunction} Function to telegraph living tree attacks.*/
function living_tree_telegraph(location, map, self){
    return get_2_away().map(p => {
        return p.plus(location);
    })
}

/**
 * Function to make a square of points with a side length 5 centered on the origin.
 * @returns {Point[]} the points.
 */
function get_2_away(){
    var points = [];
    for(var x = -2; x <= 2; ++x){
        for(var y = -2; y <= 2; ++y){
            var p = new Point(x, y);
            if(p.within_radius(2) && !p.within_radius(1)){
                points.push(p);
            }
        }
    }
    return points;
}
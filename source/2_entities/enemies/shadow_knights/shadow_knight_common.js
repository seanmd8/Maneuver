const L_SHAPES = [new Point(1, 2), new Point(-1, 2), new Point(1, -2), new Point(-1, -2),
                  new Point(2, 1), new Point(-2, 1), new Point(2, -1), new Point(-2, -1)];

/** @type {TelegraphFunction} */
function shadow_knight_telegraph(location, map, self){
    var attacks = [];
    var Ls = [new Point(1, 2), new Point(2, 1)];
    for(var L of  Ls){
        for(var transformation of DIAGONAL_DIRECTIONS){
            attacks.push(L.times(transformation).plus(location));
        }
    }
    return attacks;
}
/** @type {AIFunction} AI used by small and medium porcuslimes when moving diagonally.*/
function porcuslime_diagonal_ai(self, target, map){
    // Small version which moves then attacks diagonally.
    var directions = order_nearby(target.difference);
    var direction = undefined;
    for(var i = 0; i < directions.length && direction === undefined; ++i){
        // Finds the first diagonal direction.
        if(directions[i].on_diagonal()){
            direction = directions[i];
        }
    }
    move_attack_ai(self, {tile: target.tile, difference: direction}, map);
}
/** @type {AIFunction} AI used by small and medium porcuslimes when moving orthogonally.*/
function porcuslime_horizontal_ai(self, target, map){
    var directions = order_nearby(target.difference);
    var direction = undefined;
    for(var i = 0; i < directions.length && direction === undefined; ++i){
        // Finds the first orthogonal direction.
        if(directions[i].on_axis()){
            direction = directions[i];
        }
    }
    move_attack_ai(self, {tile: target.tile, difference: direction}, map);
}

/** @type {TelegraphFunction} */
function porcuslime_diagonal_telegraph(location, map, self){
    return move_attack_telegraph(location, map, diagonal_directions).concat(hazard_telegraph(location, map, self));
}
/** @type {TelegraphFunction} */
function porcuslime_horizontal_telegraph(location, map, self){
    return move_attack_telegraph(location, map, horizontal_directions).concat(hazard_telegraph(location, map, self));
}
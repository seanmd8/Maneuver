const L_SHAPES = [new Point(1, 2), new Point(-1, 2), new Point(1, -2), new Point(-1, -2),
                  new Point(2, 1), new Point(-2, 1), new Point(2, -1), new Point(-2, -1)];

/** @type {TileGenerator} */
function shadow_knight_tile(){
    return{
        type: `enemy`,
        name: `shadow knight`,
        pic: `${IMG_FOLDER.tiles}shadow_knight.png`,
        description: shadow_knight_description,
        health: 2,
        difficulty: 4,
        behavior: shadow_knight_ai,
        telegraph: shadow_knight_telegraph
    }
}

/** @type {AIFunction} AI used by shadow knights.*/
function shadow_knight_ai(self, target, map){
    // Moves in an L.
    if(target.difference.on_diagonal() && target.difference.within_radius(1)){
        // If the player is next to it diagonally, attempty to reposition to attack them next turn.
        if(map.move(self.location, self.location.plus(sign(target.difference).times(new Point(2, -1)))) ||
           map.move(self.location, self.location.plus(sign(target.difference).times(new Point(-1, 2))))){
            return;
        }
    }
    if(target.difference.taxicab_distance() === 3 && !target.difference.on_axis()){
        // If the player is a L away, attack them then try to move past them.
        map.attack(self.location.plus(target.difference), `player`);
        map.move(self.location, self.location.plus(target.difference.times(new Point(2, 2))));
        return;
    }
    // Otherwise, attempt to move closer
    if(Math.abs(target.difference.x) >= Math.abs(target.difference.y)){
        var new_dir = new Point(2, 1);
    }
    else{
        var new_dir = new Point(1, 2);
    }
    if(target.difference.x < 0){
        new_dir.x *= -1;
    }
    if(target.difference.y < 0){
        new_dir.y *= -1;
    }
    if(!map.move(self.location, self.location.plus(new_dir))){
        var directions = randomize_arr(L_SHAPES);
        for(var i = 0; i < directions.length && (self.tile.health === undefined || self.tile.health > 0); ++i){
            if(map.move(self.location, self.location.plus(directions[i]))){
                self.location.plus_equals(directions[i]);
                return;
            }
        }
    }
}

/** @type {TelegraphFunction} */
function shadow_knight_telegraph(location, map, self){
    var attacks = [];
    var Ls = [new Point(1, 2), new Point(2, 1)];
    for(var L of  Ls){
        for(var transformation of diagonal_directions){
            attacks.push(L.times(transformation).plus(location));
        }
    }
    return attacks;
}
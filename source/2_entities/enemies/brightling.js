/** @type {TileGenerator} */
function brightling_tile(){
    var starting_cycle = 0;
    return{
        type: `enemy`,
        name: `brightling`,
        pic: `${IMG_FOLDER.tiles}brightling.png`,
        description: brightling_description,
        health: 1,
        difficulty: 4,
        behavior: brightling_ai,
        cycle: starting_cycle

    }
}

/** @type {AIFunction} AI used by brightlings.*/
function brightling_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(self.tile.cycle === -1){
        // teleports to a random empty space, then cycle goes to 0.
        teleport_spell(self, target, map);
        ++self.tile.cycle;
        return;
    }
    if(random_num(4) < self.tile.cycle){
        // Attempts to teleport the player next to it, then cycle goes to -1 to prepare to teleport next turn.
        var near_points = random_nearby();
        for(var i = 0; i < near_points.length; ++i){
            if(map.check_empty(self.location.plus(near_points[i]))){
                map.move(self.location.plus(target.difference), self.location.plus(near_points[i]));
                self.tile.cycle = -1;
                // Since player has been moved, it returns to their turn.
                throw new Error(`pass to player`);
            }
        }
    }
    // Moves 2 spaces randomly and increments cycle.
    var near_points = random_nearby();
    for(var i = 0; i < 2; ++i){
        var moved = map.move(self.location, self.location.plus(near_points[i]));
        if(moved){
            self.location.plus_equals(near_points[i])
        }
    }
    ++self.tile.cycle;
}
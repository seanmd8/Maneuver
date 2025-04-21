/** @type {TileGenerator} */
function brightling_tile(){
    var starting_cycle = 0;
    return{
        type: `enemy`,
        name: `Brightling`,
        pic: `${IMG_FOLDER.tiles}brightling.png`,
        description: brightling_description,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: brightling_ai,
        cycle: starting_cycle

    }
}

/** @type {AIFunction} AI used by brightlings.*/
function brightling_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === -1){
        // teleports to a random empty space, then cycle goes to 0.
        teleport_spell(self, target, map);
        ++self.tile.cycle;
        return;
    }
    var near_points = random_nearby();
    if(chance(self.tile.cycle, 4) && !target.tile.tags.has(TAGS.unmovable)){
        // Attempts to teleport the player next to it, then cycle goes to -1 to prepare to teleport next turn.
        for(var near of near_points){
            if(map.check_empty(self.location.plus(near))){
                map.move(self.location.plus(target.difference), self.location.plus(near));
                self.tile.cycle = -1;
                // Since player has been moved, it returns to their turn.
                throw new Error(ERRORS.pass_turn);
            }
        }
    }
    // Moves 2 spaces randomly and increments cycle.
    for(var i = 0; i < 2; ++i){
        var moved = map.move(self.location, self.location.plus(near_points[i]));
        if(moved){
            self.location.plus_equals(near_points[i])
        }
    }
    ++self.tile.cycle;
}
/** @type {TileGenerator} */
function vampire_tile(){
    return {
        type: `enemy`,
        name: `vampire`,
        pic: `${IMG_FOLDER.tiles}vampire.png`,
        description: vampire_description,
        health: 2,
        max_health: 2,
        difficulty: 5,
        behavior: vampire_ai,
        telegraph: vampire_telegraph,
        on_hit: vampire_hit
    }
}

/** @type {AIFunction} AI used by vampires.*/
function vampire_ai(self, target, map){
    if( self.tile.health === undefined || 
        self.tile.max_health === undefined){
        throw new Error(ERRORS.missing_property)
    }
    var player_pos = self.location.plus(target.difference);
    var target_spaces = [new Point(player_pos.x + 1, player_pos.y + 1), 
                        new Point(player_pos.x - 1, player_pos.y + 1), 
                        new Point(player_pos.x + 1, player_pos.y - 1), 
                        new Point(player_pos.x - 1, player_pos.y - 1)];
    target_spaces = randomize_arr(target_spaces);
    var moved = false;
    var health = self.tile.health;
    for(var i = 0; i < target_spaces.length && !moved && health === self.tile.health; ++i){
        // Tries to move to a nearby space from which it can attack the player.
        var space = target_spaces[i];
        var target_distance = space.minus(self.location);
        if(target_distance.taxicab_distance() === 1){
            moved = map.move(self.location, space);
        }
    }
    // If you moved into range, attack and heal.
    if(moved && map.attack(self.location.plus(target.difference))){
        map.heal(space, 1);
    } 
    if(!moved && health === self.tile.health){
        // If it hasn't moved yet, just moves closer to the player.
        var directions = order_nearby(target.difference);
        for(var i = 0; i < directions.length && !moved  && health === self.tile.health; ++i){
            var direction = directions[i]
            if(direction.on_axis()){
                moved = map.move(self.location, self.location.plus(direction));
            }
            
        }
    }
}
/** @type {AIFunction} Function used when a vampire is hit to teleport it away.*/
function vampire_hit(self, target, map){
    if(self.tile.health !== undefined && self.tile.health > 0){
        stun(self.tile);
        teleport_spell(self, target, map);
    }
}

/** @type {TelegraphFunction} */
function vampire_telegraph(location, map, self){
    var attacks = [];
    for(var move_direction of HORIZONTAL_DIRECTIONS){
        var move = location.plus(move_direction);
        if(map.check_empty(move)){
            for(var attack_direction of DIAGONAL_DIRECTIONS){
                attacks.push(move.plus(attack_direction));
            }
        }
    }
    return attacks;
}
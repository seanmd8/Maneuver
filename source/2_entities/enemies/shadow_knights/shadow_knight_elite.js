/** @type {TileGenerator} */
function shadow_knight_elite_tile(){
    return{
        type: entity_types.enemy,
        name: enemy_names.shadow_knight_elite,
        pic: `${IMG_FOLDER.tiles}shadow_knight_elite.png`,
        description: enemy_descriptions.shadow_knight_elite,
        tags: new TagList(),
        health: 2,
        difficulty: 6,
        behavior: shadow_knight_elite_ai,
        telegraph: shadow_knight_telegraph
    }
}

/** @type {AIFunction} AI used by shadow knights.*/
function shadow_knight_elite_ai(self, target, map){
    var player_location = self.location.plus(target.difference);
    var possible_moves = L_SHAPES.map((p) => {
        return self.location.plus(p);
    });

    // If player can be attacked, attack twice then move to a random space an L away from them.
    var attack = possible_moves.filter((p) => {
        return point_equals(p, player_location);
    });
    if(attack.length > 0){
        map.attack(player_location);
        var possible_ends = L_SHAPES.map((p) => {
            return p.plus(player_location);
        });
        possible_ends = randomize_arr(possible_ends);
        for(var i = 0; i < possible_ends.length && !map.check_empty(possible_ends[i]); ++i){}
        if(i < possible_ends.length){
            map.move(self.location, possible_ends[i]);
        }
        return;
    }
    
    // If it can move to a square that can attack the player next turn, do so.
    var setup_attack = possible_moves.filter((p) => {
        if(p.minus(player_location).taxicab_distance() === 3){
            var hits = L_SHAPES.filter((p2) => {
                return point_equals(p2.plus(p), player_location);
            })
            if(hits.length > 0 && map.check_empty(p)){
                return true;
            }
        }
        return false;
    });
    if(setup_attack.length > 0){
        map.move(self.location, setup_attack[0]);
        return;
    }
    
    // Order moves based off of proximity to player.
    var ordered_moves = possible_moves.filter((p) => {
        return map.check_empty(p);
    }).toSorted((p1, p2) => {
        var distance_1 = p1.minus(player_location).taxicab_distance();
        var distance_2 = p2.minus(player_location).taxicab_distance();
        return distance_1 - distance_2;
    });
    // If there are no legal moves, don't move.
    if(ordered_moves.length === 0){
        return;
    }
    // If next to the player, move away.
    if(target.difference.within_radius(1)){
        map.move(self.location, ordered_moves[ordered_moves.length - 1]);
        return;
    }
    
    // Oterwise, move closer
    map.move(self.location, ordered_moves[0]);
}

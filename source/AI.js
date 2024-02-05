// ----------------AI.js----------------
// File containing the logic for the behavior of non player entities.


/**
 * @typedef {object} AISelfParam Information passed into an ai function about the entity calling it.
 * @property {Tile} tile The tile of the entity.
 * @property {Point} location The location of the tile on the grid.
 */

/**
 * @typedef {object} AITargetParam Information passed into an ai function about the entity it is targeting.
 * @property {Tile} tile The tile it is targeting.
 * @property {Point} difference The location of the tile it is targeting relative to the entity.
 */

/**
 * @callback AIFunction
 * @param {AISelfParam} self The entity performing this behavior.
 * @param {AITargetParam} target The entity being targeted.
 * @param {GameMap} map The gamemap where stuff should happen.
 */


// Normal Enemy AIs
/** @type {AIFunction} AI used by spiders and the Spider Queen.*/
function spider_ai(self, target, map){
    if(target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference), `player`);
    }
    else{
        // Otherwise, move closer.
        move_closer_ai(self, target, map);
    }
}
/** @type {AIFunction} AI used by turrets that shoot orthogonally.*/
function turret_h_ai(self, target, map){
    // Turret version that shoots orthogonally.
    if(target.difference.x === 0 || target.difference.y === 0){
        turret_fire_ai(self, target, map);
    }
}
/** @type {AIFunction} AI used by turrets that shoot diagonally.*/
function turret_d_ai(self, target, map){
    // Turret version that shoots diagonally.
    if(Math.abs(target.difference.x) === Math.abs(target.difference.y)){
        turret_fire_ai(self, target, map);
    }
}
/** @type {AIFunction} AI used by turrets that rotate.*/
function turret_r_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.rotate === undefined || 
        self.tile.flip === undefined || 
        self.tile.spin_direction === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    switch(self.tile.cycle){
        case 0:
            if(target.difference.x === 0){
                // Fires N and S.
                turret_fire_ai(self, target, map);
            }
            break;
        case 1:
            if(target.difference.x === -1 * target.difference.y){
                // Fires NE and SW.
                turret_fire_ai(self, target, map);
            }
            break;
        case 2:
            if(target.difference.y === 0){
                // Fires E and W.
                turret_fire_ai(self, target, map);
            }
            break;
        case 3:
            if(target.difference.x === target.difference.y){
                // Fires SE and NW.
                turret_fire_ai(self, target, map);
            }
            break;
        default:
            throw new Error(`Improper case for ${self.tile.name}`);
    }
    // Rotate.
    self.tile.cycle = (self.tile.cycle + self.tile.spin_direction + 4) % 4;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle % 2];
    if(!self.tile.flip){
        self.tile.rotate = 90 * Math.floor(self.tile.cycle / 2);
    }
    else{
        self.tile.rotate = 90 * Math.floor(((self.tile.cycle + 1) % 4) / 2);
    }
}
/** @type {AIFunction} AI used by all turrets to fire towards the player.*/
function turret_fire_ai(self, target, map){
    // Fires a shot in the direction of the player.
    var direction = sign(target.difference)
    try{
        for(var i = 1; !map.attack(self.location.plus(direction.times(i))); ++i){ 
            map.check_bounds(self.location.plus(direction.times(i)));
        }
    }
    catch(error){
        if(!(error.message === `x out of bounds` || error.message === `y out of bounds`)){
            throw error;
        }
    }
}
/** @type {AIFunction} AI used by scythes.*/
function scythe_ai(self, target, map){
    if(self.tile.rotate === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    var distance = 3;
    var direction = sign(target.difference);
    if(direction.x === 0 || direction.y === 0){
        // If the player is orthogonal, moves randomly.
        direction = new Point(random_sign(), random_sign());
    }
    // Rotate image based on direction.
    self.tile.rotate = 90 * (direction.x + direction.y + 2) / 2;
    if(direction.x === -1 && direction.y === 1){
        self.tile.rotate = 90 * 3;
    }
    for(var i = 0; i < distance && map.move(self.location, self.location.plus(direction)) ; ++i){
        // moves <distance> spaces attacking each space it passes next to.
        self.location.plus_equals(direction);
        map.attack(new Point(self.location.x - direction.x, self.location.y), `player`);
        map.attack(new Point(self.location.x, self.location.y - direction.y), `player`); 
    }
}
/** @type {AIFunction} AI used by shadow knights.*/
function shadow_knight_ai(self, target, map){
    // Moves in an L.
    if(Math.abs(target.difference.x) === 1 && Math.abs(target.difference.y) === 1){
        // If the player is next to it diagonally, attempty to reposition to attack them next turn.
        if(!map.move(self.location, self.location.plus(sign(target.difference).times(new Point(2, -1))))){
            map.move(self.location, self.location.plus(sign(target.difference).times(new Point(-1, 2))));
        }
        return;
    }
    if((Math.abs(target.difference.x) === 1 || Math.abs(target.difference.y) === 1) && target.difference.taxicab_distance() === 3){
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
    map.move(self.location, self.location.plus(new_dir));
}
/** @type {AIFunction} AI used by spider webs.*/
function spider_web_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spawn_timer === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    if(self.tile.cycle < self.tile.spawn_timer){
        // If the cycle hasn't reached the spawn timer, increments it.
        ++self.tile.cycle;
    }
    else{
        // Attempts to spawn a spider nearby and resets cycle.
        spawn_nearby(map, spider_tile(), self.location);
        self.tile.cycle = 0;
    }
}
/** @type {AIFunction} AI used by rams.*/
function ram_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    var direction = sign(target.difference);
    var wander_speed = 2;
    var moved = true;
    if(self.tile.cycle === 0){
        // moves <wander_speed> closer to a row or column that the player is in.
        if(Math.abs(target.difference.x) <= Math.abs(target.difference.y)){
            direction.y = 0;
            for(var i = 0; i < wander_speed && i < Math.abs(target.difference.x) && moved; ++i){
                moved = map.move(self.location, self.location.plus(direction));
                moved && self.location.plus_equals(direction);
            }
        }
        else{
            direction.x = 0;
            for(var i = 0; i < wander_speed && i < Math.abs(target.difference.y) && moved; ++i){
                moved = map.move(self.location, self.location.plus(direction));
                moved && self.location.plus_equals(direction);
            }
        }
        if(moved === true && (Math.abs(target.difference.x) < 3 || Math.abs(target.difference.y) < 3)){
            // If it sees them, prepares to charge.
            self.tile.cycle = 1;
            self.tile.pic = self.tile.pic_arr[self.tile.cycle];
        }
    }
    else{
        // Charges orthogonally until it hits something and rams it.
        // Reverts to wandering after.
        if(Math.abs(target.difference.x) > Math.abs(target.difference.y)){
            direction.y = 0;
        }
        else{
            direction.x = 0;
        }
        while(moved){
            moved = map.move(self.location, self.location.plus(direction));
            self.location.plus_equals(direction);
        }
        map.attack(self.location);
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[self.tile.cycle];
    }
}
/** @type {AIFunction} AI used by large porcuslimes.*/
function large_porcuslime_ai(self, target, map){
    if(self.tile.health !== undefined && self.tile.health === 2){
        // If health is 2, turns into the medium version.
        map.attack(self.location);
        map.attack(self.location);
        map.add_tile(medium_porcuslime_tile(), self.location);
        return;
    }
    if(self.tile.health !== undefined && self.tile.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(self.location);
        spawn_nearby(map, small_d_porcuslime_tile(), self.location);
        spawn_nearby(map, small_h_porcuslime_tile(), self.location);
        return;
    }
    var direction = sign(target.difference);
    move_attack_ai(self, {tile: target.tile, difference: direction}, map);
}
/** @type {AIFunction} AI used by medium porcuslimes.*/
function medium_porcuslime_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    if(self.tile.health !== undefined && self.tile.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(self.location);
        spawn_nearby(map, small_d_porcuslime_tile(), self.location);
        spawn_nearby(map, small_h_porcuslime_tile(), self.location);
        return;
    }
    if(self.tile.cycle === 0){
        // If cycle is at 0, direction will be orthogonally towards the player.
        porcuslime_horizontal_ai(self, target, map);
    }
    else{
        // If cycle is at 1, direction will be diagonally towards the player.
        porcuslime_diagonal_ai(self, target, map);
    }
    // Swaps cycle and picture between the two.
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}
/** @type {AIFunction} AI used by small and medium porcuslimes when moving diagonally.*/
function porcuslime_diagonal_ai(self, target, map){
    // Small version which moves then attacks diagonally.
    var directions = order_nearby(target.difference);
    var direction = undefined;
    for(var i = 0; i < directions.length && direction === undefined; ++i){
        // Finds the first diagonal direction.
        if(Math.abs(directions[i].x) === 1 && Math.abs(directions[i].y) === 1){
            direction = directions[i];
        }
    }
    if(direction === undefined){
        throw new Error(`porcuslime failed to pick a direction`);
    }
    move_attack_ai(self, {tile: target.tile, difference: direction}, map);
}
/** @type {AIFunction} AI used by small and medium porcuslimes when moving orthogonally.*/
function porcuslime_horizontal_ai(self, target, map){
    var directions = order_nearby(target.difference);
    var direction = undefined;
    for(var i = 0; i < directions.length && direction === undefined; ++i){
        if(directions[i].x === 0 || directions[i].y === 0){
            direction = directions[i];
        }
    }
    if(direction === undefined){
        throw new Error(`porcuslime failed to pick a direction`);
    }
    move_attack_ai(self, {tile: target.tile, difference: direction}, map);
}
/** @type {AIFunction} Function used when acid bugs die to explode and harm everything around them.*/
function acid_bug_death(self, target, map){
    // On death, attacks each space next to it.
    var attacks = random_nearby();
    for(var i = 0; i < attacks.length; ++i){
        map.attack(self.location.plus(attacks[i]));
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
/** @type {AIFunction} AI used by corrosive catterpillars.*/
function corrosive_caterpillar_ai(self, target, map){
    var direction = get_empty_nearby(self.location, random_nearby(), map);
    if(!(direction === undefined)){
        if(map.move(self.location, self.location.plus(direction))){
            map.add_tile(corrosive_slime_tile(), self.location);
        }
    }
}
/** @type {AIFunction} Function used on corrosive catterpillar death to slime where they were.*/
function corrosive_caterpillar_death(self, target, map){
    map.add_tile(corrosive_slime_tile(), self.location);
}
/** @type {AIFunction} AI used by noxious toads.*/
function noxious_toad_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(self.tile.cycle === 0){
        var directions = order_nearby(target.difference);
        var moved = false;
        for(var i = 0; i < directions.length && !moved; ++i){
            // Leap orthogonally closer.
            if(directions[i].x === 0 || directions[i].y === 0){
                moved = map.move(self.location, self.location.plus(directions[i].times(2)));
                if(moved){
                    self.location.plus_equals(directions[i].times(2));
                    target.difference.minus_equals(directions[i].times(2))
                }
            }
        }
        if(moved){
            self.tile.cycle = 1;
            if(target.difference.within_radius(1)){
                // If it landed near the player, attack everything nearby.
                attack_around(self.location, map);
            }
        }
    }
    else{
        // Prepare to leap.
        self.tile.cycle = 0;
    }
    self.tile.pic = self.tile.pic_arr[self.tile.cycle]
}
/** @type {AIFunction} AI used by vampires.*/
function vampire_ai(self, target, map){
    var player_pos = self.location.plus(target.difference);
    var target_spaces = [new Point(player_pos.x + 1, player_pos.y + 1), 
                        new Point(player_pos.x - 1, player_pos.y + 1), 
                        new Point(player_pos.x + 1, player_pos.y - 1), 
                        new Point(player_pos.x - 1, player_pos.y - 1)];
    target_spaces = randomize_arr(target_spaces);
    var moved = false;
    for(var i = 0; i < target_spaces.length && !moved; ++i){
        var space = target_spaces[i];
        var target_distance = space.minus(self.location);
        if(Math.abs(target_distance.x) + Math.abs(target_distance.y) === 1){
            moved = map.move(self.location, space);
        }
    }
    if(moved && map.attack(self.location.plus(target.difference)) // If you moved into range, attack.
        && self.tile.health !== undefined // If you have health
        && (self.tile.max_health === undefined || self.tile.health < self.tile.max_health)){ // and your health isn't at your max_health,
        ++self.tile.health; // heal.
    }
    if(!moved){
        var directions = order_nearby(target.difference);
        for(var i = 0; i < directions.length && !moved; ++i){
            var direction = directions[i]
            if(direction.x === 0 || direction.y === 0){
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
/** @type {AIFunction} AI used by clay golems.*/
function clay_golem_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference), `player`);
        self.tile.cycle = 1;
    }
    else if(self.tile.cycle === 1){
        // Otherwise, move closer if it didn't move last turn.
        move_closer_ai(self, target, map);
        self.tile.cycle = 0;
    }
    else{
        // Otherwise, it moved last turn so don't move.
        self.tile.cycle = 1;
    }
}
/** @type {AIFunction} Function used when clay golems are hit to stun them and reset their cycle.*/
function clay_golem_hit(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    stun(self.tile);
    self.tile.cycle = 1;
}
/** @type {AIFunction} AI used by vinesnare bushes.*/
function vinesnare_bush_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined ||
        self.tile.range === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(target.difference.within_radius(1)){
        // If 1 away, attack if not rooted, otherwise uproot.
        if(self.tile.cycle === 0){
            map.attack(self.location.plus(target.difference), `player`);
            return;
        }
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[0];
        return;
    }
    var moved = false;
    if(self.tile.cycle > 0 && target.difference.within_radius(self.tile.range)){
        var direction = sign(target.difference);
        if(target.difference.x === 0 || target.difference.y === 0 || Math.abs(target.difference.x) === Math.abs(target.difference.y)){
            // If the player is orthogonal or diagonal and within range, drag them closer.
            for(var i = Math.max(Math.abs(target.difference.x), Math.abs(target.difference.y));
                i > 1 && map.move(self.location.plus(direction.times(i)), self.location.plus(direction.times(i - 1)));
                --i){
                    moved = true;
                }
            
        }
    }
    if(moved){
        // If the player was moved, uproot and pass the turn to them.
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[0];
        throw new Error(`pass to player`);
    }
    if(++self.tile.cycle > 0){
        // Otherwise, root.
        self.tile.pic = self.tile.pic_arr[1];
    }
}
/** @type {AIFunction} AI used by rats.*/
function rat_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.flip === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(self.tile.cycle >= 1 && target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference), `player`);
        self.tile.cycle = -1;
    }
    // Move 2 spaces.
    for(var i = 0; i < 2; ++i){
        var directions = order_nearby(target.difference);
        if(self.tile.cycle <= 0){
            // If they bit the player within 2 turns, move away. Otherwise move closer.
            directions = reverse_arr(directions);
        }
        var moved = false;
        for(var j = 0; j < directions.length && !moved; ++j){
            moved = map.move(self.location, self.location.plus(directions[j]));
            if(moved){
                self.location.plus_equals(directions[j])
                target.difference.minus_equals(directions[j])
                if(directions[j].x < 0){
                    self.tile.flip = false;
                }
                if(directions[j].x > 0){
                    self.tile.flip = true;
                }
            }
        }
    }
    ++self.tile.cycle;
}
/** @type {AIFunction} AI used by shadow scouts.*/
function shadow_scout_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.look_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    self.tile.cycle = 1 - self.tile.cycle;
    // Goes invisibl eon alternate turns.
    shapeshift(self.tile, self.tile.look_arr[self.tile.cycle]);
    spider_ai(self, target, map);
}
/** @type {AIFunction} AI used by shadow scouts.*/
function darkling_ai(self, target, map){
    if(self.tile.direction !== undefined){
        // Teleport to it's rift.
        var moved = map.move(self.location, self.tile.direction);
        if(moved){
            // If moved, attack around it.
            attack_around(self.tile.direction, map);
        }
        else{
            // If something is blocking the rift, it dies.
            map.attack(self.location);
            return;
        }
    }
    // Create a new rift for next turn.
    self.tile.direction = map.random_empty();
    var darkling_rift = function(map_to_use){
        if(self.tile.health === undefined || self.tile.health > 0){
            map_to_use.mark_tile(self.tile.direction, darkling_rift_look);
        }
    }
    map.add_event(darkling_rift);
}
/** @type {AIFunction} AI used by shadow scouts.*/
function orb_of_insanity_ai(self, target, map){
    if( self.tile.range === undefined ||
        self.tile.pic_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(target.difference.within_radius(self.tile.range)){
        var ran = random_num(CONFUSION_CARDS.length);
        GS.give_temp_card(CONFUSION_CARDS[ran]());
        self.tile.pic = self.tile.pic_arr[1];
    }
    else{
        self.tile.pic = self.tile.pic_arr[0];
    }
}


// Boss AIs
/** @type {AIFunction} Function used on boss death to display the correct death message, unlock the floor, and by doing so heal the player.*/
function boss_death(self, target, map){
    if(self.tile.death_message === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(self.tile.card_drops !== undefined && self.tile.card_drops.length > 0){
        if(random_num(CHEST_CHANCE) === 0){
            // Create a chest containing a random card from it's loot table.
            var chest = chest_tile();
            var card = rand_no_repeates(self.tile.card_drops, 1)[0];
            add_card_to_chest(chest, card());
            map.add_tile(chest, self.location);
        }
    }
    display.display_message(UIIDS.display_message, `${self.tile.death_message}\n${boss_death_description}`);
    map.unlock();
}
/** @type {AIFunction} AI used by the Velociphile.*/
function velociphile_ai(self, target, map){
    // Moves towards the player 2/3 of the time, otherwise moves randomly.
    var directions = order_nearby(target.difference);
    if(random_num(3) === 0){
        directions = randomize_arr(directions);
    }
    // Direction is reselected until an unobstructed one is found.
    var direction = get_empty_nearby(self.location, directions, map);
    if(!(direction === undefined)){
        // Moves in the chosen direction until it hits something, which it then attacks.
        while(map.move(self.location, self.location.plus(direction))){
            self.location.plus_equals(direction);
        }
        map.attack(self.location.plus(direction));
    }
}
/** @type {AIFunction} Function used when the spider queen is hit to stun her and spawn a spider.*/
function spider_queen_hit(self, target, map){
    // Spawns a new spider nearby. Stuns it so it won't move right away.
    stun(self.tile);
    var new_spider = spider_tile();
    stun(new_spider);
    spawn_nearby(map, new_spider, self.location);
}
/** @type {AIFunction} AI used by the Lich.*/
function lich_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spells === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    var player_close = (target.difference.within_radius(1));
    var moves = reverse_arr(order_nearby(target.difference));
    var i;
    // Move 1 space away from the player.
    for(i = 0; i < moves.length && !map.move(self.location, self.location.plus(moves[i])); ++i){}
    if(i < moves.length){
        self.location.plus_equals(moves[i]);
        target.difference.minus_equals(moves[i]);
    }
    // Cast the current spell.
    self.tile.spells[self.tile.cycle].behavior(self, target, map);
    if(player_close){
        // If the player was next to it, prepare to teleport next turn.
        self.tile.cycle = 0;
    }
    else{
        // Otherwise prep a random spell other than teleport.
        self.tile.cycle = random_num(self.tile.spells.length - 1) + 1;
    }
    self.tile.description = `${lich_description}${self.tile.spells[self.tile.cycle].description}`;
    self.tile.pic = self.tile.spells[self.tile.cycle].pic;
}

// Spells
/** @type {AIFunction} Spell which teleports the user to a random location.*/
function teleport_spell(self, target, map){
    var space = map.random_empty();
    if(map.move(self.location, space)){
        self.location.x = space.x;
        self.location.y = space.y;
    }
}
/** @type {AIFunction} Spell which summons a random thing from the user's summon array.*/
function summon_spell(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    var tile = self.tile.summons[random_num(self.tile.summons.length)]();
    spawn_nearby(map, tile, self.location);
}
/** @type {AIFunction} Spell which causes an earthquake causing debris to rain from the ceiling.*/
function earthquake_spell(self, target, map){
    var health = self.tile.health;
    if( health === undefined){
        health = 4;
    }
    map.add_event(earthquake_event(map, (5 - health) * 5 + random_num(4)));
}
/** @type {AIFunction} Spell which creates a wave of fireballs aimed at the target.*/
function flame_wave_spell(self, target, map){
    var direction = get_empty_nearby(self.location, order_nearby(target.difference), map);
    var spawnpoints = [];
    if(direction === undefined){
        return;
    }
    if(direction.x === 0){
        // Shooting vertically.
        for(var i = 0; i < 3; ++i){
            spawnpoints.push(new Point(i - 1, direction.y));
        }
    }
    else if(direction.y === 0){
        // Shooting horizontally.
        for(var i = 0; i < 3; ++i){
            spawnpoints.push(new Point(direction.x, i - 1));
        }
    }
    else{
        // Shooting diagonally.
        spawnpoints.push(new Point(direction.x, direction.y));
        spawnpoints.push(new Point(direction.x, 0));
        spawnpoints.push(new Point(0, direction.y));
    }
    for(var i = 0; i < spawnpoints.length; ++i){
        var fireball = fireball_tile();
        set_direction(fireball, direction);
        map.add_tile(fireball, self.location.plus(spawnpoints[i]));
    }
}
/** @type {AIFunction} Spell which adds 2 random temporary debuff cards to the player's deck.*/
function confusion_spell(self, target, map){
    for(var i = 0; i < 2; ++i){
        var ran = random_num(CONFUSION_CARDS.length);
        GS.give_temp_card(CONFUSION_CARDS[ran]());
    }
}
/** @type {AIFunction} Spell which creates several lava pools between the user and their target.*/
function lava_moat_spell(self, target, map){
    var health = self.tile.health;
    if( health === undefined){
        health = 4;
    }
    var nearby = order_nearby(target.difference);
    for(var i = 0; i < health && count_nearby(self.location, map) < 6; ++i){
        var tile = lava_pool_tile();
        spawn_nearby(map, tile, self.location, nearby);
    }
}
/** @type {AIFunction} Spell which does nothing.*/
function rest_spell(self, target, map){}

// Other AIs
/** @type {AIFunction} Function used when something moves onto this to harm that thing.*/
function hazard(self, target, map){
    // General on_enter function to retaliate if something tries to move onto it.
    map.attack(self.location.plus(target.difference));
}
/** @type {AIFunction} Function used when a damaged wall is destroyed to potentially spawn something.*/
function wall_death(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(random_num(10) < 7){
        var ran = random_num(self.tile.summons.length);
        var new_enemy = self.tile.summons[ran]();
        stun(new_enemy);
        map.add_tile(new_enemy, self.location);
    }
}
/** @type {AIFunction}  AI used by fireballs.*/
function fireball_ai(self, target, map){
    if(self.tile.direction === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(!map.move(self.location, self.location.plus(self.tile.direction))){
        // When it hits something, explodes and damages it.
        map.attack(self.location.plus(self.tile.direction));
        self.tile.health = 1;
        map.attack(self.location);
    }
}
/** @type {AIFunction} Function used by fireballs to blow up when soemthing tries to move onto them.*/
function fireball_on_enter(self, target, map){
    hazard(self, target, map);
    self.tile.health = 1;
    map.attack(self.location);
}
/** @type {AIFunction} Function to open a chest when the player moves onto it.*/
function chest_on_enter(self, target, map){
    if(self.tile.contents === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(target.tile.type !== `player`){
        return;
    }
    self.tile.health = 1;
    map.attack(self.location);
    var leave_chest = function(){
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.stage);
        display.display_message(UIIDS.chest_instructions, ``);
        display.clear_tb(UIIDS.chest_confirm_row);
        display.clear_tb(UIIDS.contents);
        display.display_message(UIIDS.content_description, ``);
    }
    var abandon_button = {
        description: abandon_chest
    };
    var take_or_leave =  function(button, position){
        if(button.on_choose !== undefined){
            button.on_choose();
        }
        leave_chest();
    }
    var click_content = function(content, position){
        var confirm_button = {
            description: take_from_chest,
            on_choose: content.on_choose
        };
        display.display_message(UIIDS.content_description, content.description);
        display.clear_tb(UIIDS.chest_confirm_row);
        display.add_button_row(UIIDS.chest_confirm_row, [abandon_button, confirm_button], take_or_leave);
        display.select(UIIDS.contents, position.y, position.x);
    }
    display.display_message(UIIDS.chest_instructions, chest_inner_discription);
    display.add_tb_row(UIIDS.contents, self.tile.contents, CHEST_CONTENTS_SIZE, click_content);
    display.add_button_row(UIIDS.chest_confirm_row, [abandon_button], take_or_leave);
    display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.chest);
}



function earthquake_event(map, amount){
    var falling_debris = function(locations){
        return function(map_to_use){
            try{
                for(var location of locations){
                    map_to_use.attack(location);
                }
            }
            catch(error){
                if(error.message === `game over`){
                    throw new Error(`game over`, {cause: new Error(`falling rubble`)});
                }
                throw error;
            }
        }
    }
    var earthquake = function(amount){
        return function(map_to_use){
            var rubble = [];
            for(var j = 0; j < amount; ++j){
                var space = map_to_use.random_empty();
                map_to_use.mark_tile(space, falling_rubble_look);
                rubble.push(space);
            }
            map_to_use.add_event(falling_debris(rubble));
        }
        
    }
    return earthquake(amount);
}

/** @type {AIFunction} Attempts to move 1 space closer to the user until it succesfully moves or it dies.*/
function move_closer_ai(self, target, map){
    var directions = order_nearby(target.difference);
    for(var i = 0; i < directions.length && (self.tile.health === undefined || self.tile.health > 0); ++i){
        if(map.move(self.location, self.location.plus(directions[i]))){
            self.location.plus_equals(directions[i]);
            return;
        }
    }
}
/** @type {AIFunction} AI used when a entity should move and attack in a direction (the target's difference field).*/
function move_attack_ai(self, target, map){
    if(target.difference.within_radius(0)){
        throw new Error(`entity targeting itself`)
    }
    if(map.move(self.location, self.location.plus(target.difference))){
        self.location.plus_equals(target.difference);
    }
    map.attack(self.location.plus(target.difference));
}

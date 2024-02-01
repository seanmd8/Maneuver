// @ts-check
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
    var moved = false;
    if(target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference), `player`);
    }
    else if(self.tile.cycle > 0 && target.difference.within_radius(self.tile.range)){
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
        // If the player was moved, pass the turn to them.
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[0];
        throw new Error(`pass to player`);
    }
    if(++self.tile.cycle > 0){
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
        map_to_use.mark_tile(self.tile.direction, darkling_rift_look);
    }
    map.add_event(darkling_rift);
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
// ----------------Areas.js----------------
// File containing functions to generate area objects.

// The structure of the dungeon. Each area can lead to a random one in the next numbered array.
const area_end = [generate_default_area];
const area1 = [generate_ruins_area];
const area2 = [/*generate_sewers_area, */generate_basement_area];
const area3 = [/*generate_magma_area, */generate_crypt_area];
const area4 = area_end;//[generate_forest_area, generate_library_area];
const area5 = [generate_sanctum_area];



/**
 * @typedef {object} Area A section of the dungeon that ends with a boss fight.
 * @property {string} background The picture used as a background for this area.
 * @property {FloorGenerator} generate_floor A function to generate a normal floor of the dungeon.
 * @property {TileGenerator[]} enemy_list An array of which enemies can spawn here.
 * @property {FloorGenerator[]} boss_floor_list An array of functions that can create a boss floor at the end of the area.
 * @property {AreaGenerator[]} next_area_list An array of the areas that can follow this one.
 * @property {string} description A description given when entering this area.
 */

/**
 * @callback AreaGenerator A function to create 
 * @returns {Area}         and return an area object.
 */

/** @type {AreaGenerator}*/
function generate_ruins_area(){
    return {
        background: `${img_folder.backgrounds}ruins.png`,
        generate_floor: generate_ruins_floor,
        enemy_list: [spider_tile, turret_h_tile, turret_d_tile, scythe_tile, spider_web_tile, ram_tile, rat_tile, acid_bug_tile, shadow_knight_tile, vinesnare_bush_tile],
        boss_floor_list: [velociphile_floor],
        next_area_list: area2,
        description: ruins_description
    }
}
/** @type {AreaGenerator}*/
function generate_sewers_area(){
    return {
        background: `${img_folder.backgrounds}sewers.png`,
        generate_floor: generate_sewers_floor,
        enemy_list: [rat_tile, turret_h_tile, turret_d_tile, large_porcuslime_tile, medium_porcuslime_tile, corrosive_caterpillar_tile, noxious_toad_tile, acid_bug_tile],
        boss_floor_list: [],
        next_area_list: area3,
        description: sewers_description
    }
}
/** @type {AreaGenerator}*/
function generate_basement_area(){
    return {
        background: `${img_folder.backgrounds}basement.png`,
        generate_floor: generate_basement_floor,
        enemy_list: [spider_tile, turret_h_tile, turret_d_tile, turret_r_tile, scythe_tile, spider_web_tile, clay_golem_tile, rat_tile, shadow_knight_tile, brightling_tile],
        boss_floor_list: [spider_queen_floor],
        next_area_list: area3,
        description: basement_description
    }
}
/** @type {AreaGenerator}*/
function generate_magma_area(){
    return {
        background: `${img_folder.backgrounds}magma.png`,
        generate_floor: generate_magma_floor,
        enemy_list: [],
        boss_floor_list: [],
        next_area_list: area4,
        description: magma_description
    }
}
/** @type {AreaGenerator}*/
function generate_crypt_area(){
    return {
        background: `${img_folder.backgrounds}crypt.png`,
        generate_floor: generate_crypt_floor,
        enemy_list: [shadow_knight_tile, spider_web_tile, vampire_tile, clay_golem_tile, spider_tile, turret_r_tile, shadow_scout_tile, darkling_tile],
        boss_floor_list: [lich_floor],
        next_area_list: area4,
        description: crypt_description
    }
}
/** @type {AreaGenerator}*/
function generate_forest_area(){
    return {
        background: `${img_folder.backgrounds}forest.png`,
        generate_floor: generate_forest_floor,
        enemy_list: [],
        boss_floor_list: [],
        next_area_list: area5,
        description: forest_description
    }
}
/** @type {AreaGenerator}*/
function generate_library_area(){
    return {
        background: `${img_folder.backgrounds}library.png`,
        generate_floor: generate_library_floor,
        enemy_list: [],
        boss_floor_list: [],
        next_area_list: area5,
        description: ruins_description
    }
}
/** @type {AreaGenerator}*/
function generate_sanctum_area(){
    return {
        background: `${img_folder.backgrounds}sanctum.png`,
        generate_floor: generate_sanctum_floor,
        enemy_list: [],
        boss_floor_list: [],
        next_area_list: [generate_default_area],
        description: sanctum_description
    }
}

/** @type {AreaGenerator}*/
function generate_default_area(){
    return {
        background: `${img_folder.backgrounds}default.png`,
        generate_floor: floor_generator,
        enemy_list: ENEMY_LIST,
        boss_floor_list: [],
        next_area_list: [generate_default_area],
        description: default_area_description
    }
}// ----------------BossFloors.js----------------
// File containing functions to create boss floors.

/** @type {FloorGenerator} Generates the floor where the Velociphile appears.*/
function velociphile_floor(floor_num,  area, map){
    map.spawn_safely(velociphile_tile(), SAFE_SPAWN_ATTEMPTS, true);
    map.lock();
    for(var i = 0; i < 8; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    return velociphile_floor_message;
}
/** @type {FloorGenerator} Generates the floor where the Spider Queen appears.*/
function spider_queen_floor(floor_num, area, map){
    map.spawn_safely(spider_queen_tile(), SAFE_SPAWN_ATTEMPTS, true);
    map.lock();
    for(var i = 0; i < 4; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    for(var i = 0; i < 2; ++i){
        map.add_tile(spider_web_tile());
    }
    return spider_queen_floor_message;
}
/** @type {FloorGenerator} Generates the floor where the Lich appears.*/
function lich_floor(floor_num,  area, map){
    var locations = [
        new Point(FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2),
        new Point(1, FLOOR_HEIGHT - 2),
        new Point(FLOOR_WIDTH - 2, 1),
        new Point(1, 1)
    ]
    for(var i = 0; i < locations.length; ++i){
        map.add_tile(damaged_wall_tile(), locations[i]);
    }
    map.spawn_safely(lich_tile(), SAFE_SPAWN_ATTEMPTS, true);
    map.lock();
    return lich_floor_message;
}

// ----------------ButtonGrid.js----------------
// The ButtonGrid class is used to keep track of the possible moves a card has.

class ButtonGrid{
    #buttons; // A 3x3 2d array used to store the options.
    constructor(){
        var initial = {
            description: `--`
        }
        this.#buttons = [[initial, initial, initial],
                        [initial, initial, initial], 
                        [initial, initial, initial]];
    }
    /**
     * A function to add behavior to a button.
     * @param {string} description Text that should appear on the button.
     * @param {PlayerCommand[]} behavior An array of commands for the player to follow when the button is clicked.
     * @param {number} [number = -1] Which spot on the 3x3 grid (numbered 1-9) the button should appear on. 
     *                                  If it is blank or -1, the position will be infered from the description.
     */
    add_button(description, behavior, number = -1){
        // Adds a description and a list of commands to one of the buttons.
        // Throws error of the button number is out of range.
        if(number === -1){
            // If the button that should be edited is not provided, it will be infered from the description if possible.
            number = this.#convert_direction(description);
        }
        if(number < 1 || number > 9){
            throw new Error(`button out of range`);
        }
        var button = {
            description,
            behavior
        }
        this.#buttons[Math.floor((number - 1) / 3)][(number - 1) % 3] = button;
    }
    /**
     * A function to display the grid of buttons to a table.
     * @param {string} table_name The location where the buttons should be displayed.
     * @param {number} hand_pos the position of the card in hand that these buttons belong to.
     */
    show_buttons(table_name, hand_pos){
        // Displays the 3x3 grid to the given table.
        // When one of the buttons with functionality is clicked, the corresponding actions will be performed then it will be discarded.
        display.clear_tb(table_name);
        var make_press_button = function(hand_position){
            return function(button, position){
                if(button.behavior){
                    GS.player_turn(button.behavior, hand_position)
                }
            }
        }
        var press_button = make_press_button(hand_pos);
        for(var i = 0; i < this.#buttons.length; ++i){
            display.add_button_row(table_name, this.#buttons[i], press_button)
        }
    }
    /**
     * A helper function to infer the number (1-9) on the 3x3 button grid where a new button should go.
     * @param {string} direction String used to make the inference.
     * @returns {number} Returns the number (1-9) if it can be infered and -1 if it can't.
     */
    #convert_direction(direction){
        var direction_list = [NW, N, NE, W, C, E, SW, S, SE];
        for(var i = 0; i < direction_list.length; ++i){
            if(direction === direction_list[i]){
                return i + 1;
            }
        }
        if(direction === SPIN){
            return 5;
        }
        return -1;
    }
}// ----------------Cards.js----------------
// File containing the logic for each card.


// Cards that can be given on level up.
const CARD_CHOICES = [
    short_charge, jump, straight_charge, side_charge, step_left, 
    step_right, trample, horsemanship, lunge_left, lunge_right, 
    sprint, trident, whack_horizontal, spin_attack, butterfly, 
    retreat, force, side_attack, clear_behind, clear_in_front, 
    jab, overcome, hit_and_run, push_back, fork,
    explosion, breakthrough, flanking_diagonal, flanking_sideways, flanking_straight,
    pike, combat_diagonal, combat_horizontal, breakthrough_side, whack_diagonal,
    thwack, overcome_sideways, y_leap, diamond_slice, spearhead,
    alt_diagonal_left, alt_diagonal_right, alt_horizontal, alt_vertical, jab_diagonal,
    diamond_attack, slice_twice
];

const RARE_CARD_CHOICES = [
    teleport, sidestep_w, sidestep_e, sidestep_n, sidestep_s, 
    sidestep_nw, sidestep_ne, sidestep_se, sidestep_sw, punch_orthogonal, 
    punch_diagonal

]

// Cards that can be given as a debuff.
const CONFUSION_CARDS = [
    stumble_n, stumble_e, stumble_s, stumble_w, stumble_nw, 
    stumble_ne, stumble_se, stumble_sw, freeze_up, lash_out
]



/**
 * @typedef {object} PlayerCommand A object used to give a command for a single action the player should do.
 * @property {string} type What type of action it is (move, attack, etc.).
 * @property {Point} change The location the action should be performed at relative to the current one.
 */

/**
 * @callback PlayerCommandGenerator Creates a PlayerCommand Object.
 * @param {number} x The relative x location
 * @param {number} y The relative y location
 * @returns {PlayerCommand} The resulting command.
 */

/** @type {PlayerCommandGenerator} Function to create a move command.*/
function pmove(x, y){
    return {
        type: `move`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to create a attack command.*/
function pattack(x, y){
    return {
        type: `attack`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to create a teleport command.*/
function pteleport(x, y){
    return {
        type: `teleport`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to declare the previous commands as instant.*/
function pinstant(x, y){
    return {
        type: `instant`,
        change: new Point(x, y) // In this case, this point does nothing.
    }
}
/** @type {PlayerCommandGenerator} Function to stun any enemies at the given location.*/
function pstun(x, y){
    return {
        type: `stun`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to move in a direction until you hit something.*/
function pmove_until(x, y){
    return {
        type: `move_until`,
        change: new Point(x, y)
    }
}
// Cards
/**
 * @typedef {Object} Card A card used by the player to perform actions on their turn.
 * @property {string} name The name of the card which will be displayed as mouseover text.
 * @property {string} pic The card's image.
 * @property {ButtonGrid} options A button grid object which determines what actions the player can use the card to perform.
 * 
 * @property {number=} id A unique id that will be added to the card when it is added to the deck.
 * @property {boolean=} temp Given true when the card is temporary and will be removed on use or on end of floor.
 */
/**
 * @callback CardGenerator A function that creates a card.
 * @returns {Card} The resulting card.
 */

// basic_horizontal,  basic_diagonal, and slice are unique to the starting deck.
/** @type {CardGenerator}*/
function basic_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: `basic horizontal`,
        pic: `${img_folder.cards}basic_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function basic_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `basic diagonal`,
        pic: `${img_folder.cards}basic_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slice(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1)]);
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(1, -1)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(-1, 1)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-1, -1)]);
    return{
        name: `slice`,
        pic: `${img_folder.cards}slice.png`,
        options
    }
}
/** @type {CardGenerator}*/
function short_charge(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(0, -1)]);
    options.add_button(E, [pmove(1, 0), pattack(1, 0)]);
    options.add_button(S, [pmove(0, 1), pattack(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0)]);
    return{
        name: `short charge`,
        pic: `${img_folder.cards}short_charge.png`,
        options
    }
}
/** @type {CardGenerator}*/
function jump(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -2)]);
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(S, [pmove(0, 2)]);
    options.add_button(W, [pmove(-2, 0)]);
    return{
        name: `jump`,
        pic: `${img_folder.cards}jump.png`,
        options
    }
}

/** @type {CardGenerator}*/
function straight_charge(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pattack(0, 1)]);
    return{
        name: `straight charge`,
        pic: `${img_folder.cards}straight_charge.png`,
        options
    }
}
/** @type {CardGenerator}*/
function side_charge(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pmove(1, 0), pattack(1, 0)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0), pattack(-1, 0)]);
    return{
        name: `side charge`,
        pic: `${img_folder.cards}side_charge.png`,
        options
    }
}
/** @type {CardGenerator}*/
function step_left(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `step left`,
        pic: `${img_folder.cards}step_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function step_right(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(E, [pmove(1, 0), pmove(1, 0)]);
    options.add_button(NE, [pmove(1, -1)]);
    return{
        name: `step right`,
        pic: `${img_folder.cards}step_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function trample(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -2), pmove(1, -2)]);
    options.add_button(NW, [pattack(-1, -2), pmove(-1, -2)]);
    return{
        name: `trample`,
        pic: `${img_folder.cards}trample.png`,
        options
    }
}
/** @type {CardGenerator}*/
function horsemanship(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -1)]);
    options.add_button(SE, [pmove(2, 1)]);
    options.add_button(SW, [pmove(-2, 1)]);
    options.add_button(NW, [pmove(-2, -1)]);
    return{
        name: `horsemanship`,
        pic: `${img_folder.cards}horsemanship.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lunge_left(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(NW, [pmove(-1, -1), pmove(-1, -1), pattack(-1, -1)]);
    return{
        name: `lunge left`,
        pic: `${img_folder.cards}lunge_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lunge_right(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NE, [pmove(1, -1), pmove(1, -1), pattack(1, -1)]);
    return{
        name: `lunge right`,
        pic: `${img_folder.cards}lunge_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sprint(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1), pmove(0, -1)]);
    return{
        name: `sprint`,
        pic: `${img_folder.cards}sprint.png`,
        options
    }
}
/** @type {CardGenerator}*/
function trident(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -2), pattack(0, -2), pattack(-1, -2)]);
    options.add_button(E, [pattack(2, 1), pattack(2, 0), pattack(2, -1)]);
    options.add_button(W, [pattack(-2, 1), pattack(-2, 0), pattack(-2, -1)]);
    options.add_button(S, [pattack(1, 2), pattack(0, 2), pattack(-1, 2)]);
    return{
        name: `trident`,
        pic: `${img_folder.cards}trident.png`,
        options
    }
}
/** @type {CardGenerator}*/
function whack_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -1)]);
    options.add_button(E, [pattack(1, 0), pattack(1, 0)]);
    options.add_button(S, [pattack(0, 1), pattack(0, 1)]);
    options.add_button(W, [pattack(-1, 0), pattack(-1, 0)]);
    return{
        name: `whack horizontal`,
        pic: `${img_folder.cards}whack_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function spin_attack(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)]
    options.add_button(SPIN, spin);
    return{
        name: `spin attack`,
        pic: `${img_folder.cards}spin_attack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function butterfly(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: `butterfly`,
        pic: `${img_folder.cards}butterfly.png`,
        options
    }
}
/** @type {CardGenerator}*/
function retreat(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: `retreat`,
        pic: `${img_folder.cards}retreat.png`,
        options
    }
}
/** @type {CardGenerator}*/
function force(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pmove(0, -1), pattack(0, -1), pmove(0, -1)]);
    return{
        name: `force`,
        pic: `${img_folder.cards}force.png`,
        options
    }
}
/** @type {CardGenerator}*/
function side_attack(){
    var options = new ButtonGrid();
    options.add_button(E, [pattack(1, 0), pattack(2, 0), pattack(3, 0)]);
    options.add_button(W, [pattack(-1, 0), pattack(-2, 0), pattack(-3, 0)]);
    return{
        name: `side attack`,
        pic: `${img_folder.cards}side_attack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function clear_behind(){
    var options = new ButtonGrid();
    options.add_button(S, [pattack(2, 1), pattack(1, 1), pattack(0, 1), pattack(-1, 1), pattack(-2, 1), 
                           pattack(2, 2), pattack(1, 2), pattack(0, 2), pattack(-1, 2), pattack(-2, 2)]);
    return{
        name: `clear behind`,
        pic: `${img_folder.cards}clear_behind.png`,
        options
    }
}
/** @type {CardGenerator}*/
function clear_in_front(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), 
                           pattack(1, -2), pattack(0, -2), pattack(-1, -2)]);
    return{
        name: `clear in front`,
        pic: `${img_folder.cards}clear_in_front.png`,
        options
    }
}
/** @type {CardGenerator}*/
function jab(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -2)]);
    options.add_button(E, [pattack(1, 0), pattack(2, 0)]);
    options.add_button(S, [pattack(0, 1), pattack(0, 2)]);
    options.add_button(W, [pattack(-1, 0), pattack(-2, 0)]);
    return{
        name: `jab`,
        pic: `${img_folder.cards}jab.png`,
        options
    }
}
/** @type {CardGenerator}*/
function overcome(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), pmove(0, -2)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(-1, 1), pmove(0, 2)]);
    return{
        name: `overcome`,
        pic: `${img_folder.cards}overcome.png`,
        options
    }
}
/** @type {CardGenerator}*/
function hit_and_run(){
    var options = new ButtonGrid();
    options.add_button(S, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), pattack(1, 0), pattack(-1, 0), pmove(0, 1)]);
    return{
        name: `hit and run`,
        pic: `${img_folder.cards}hit_and_run.png`,
        options
    }
}
/** @type {CardGenerator}*/
function combat_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1), pmove(1, -1)]);
    options.add_button(SE, [pattack(1, 1), pmove(1, 1)]);
    options.add_button(SW, [pattack(-1, 1), pmove(-1, 1)]);
    options.add_button(NW, [pattack(-1, -1), pmove(-1, -1)]);
    return{
        name: `combat diagonal`,
        pic: `${img_folder.cards}combat_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function combat_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pmove(0, -1)]);
    options.add_button(E, [pattack(1, 0), pmove(1, 0)]);
    options.add_button(S, [pattack(0, 1), pmove(0, 1)]);
    options.add_button(W, [pattack(-1, 0), pmove(-1, 0)]);
    return{
        name: `combat horizontal`,
        pic: `${img_folder.cards}combat_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function push_back(){
    var options = new ButtonGrid();
    options.add_button(SE, [pattack(-1, -1), pmove(1, 1)]);
    options.add_button(S, [pattack(0, -1), pmove(0, 1)]);
    options.add_button(SW, [pattack(1, -1), pmove(-1, 1)]);
    return{
        name: `push back`,
        pic: `${img_folder.cards}push_back.png`,
        options
    }
}
/** @type {CardGenerator}*/
function fork(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(-1, -1), pattack(1, -2), pattack(-1, -2)]);
    options.add_button(E, [pattack(1, 1), pattack(1, -1), pattack(2, 1), pattack(2, -1)]);
    options.add_button(S, [pattack(1, 1), pattack(-1, 1), pattack(1, 2), pattack(-1, 2)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, -1), pattack(-2, 1), pattack(-2, -1)]);
    return{
        name: `fork`,
        pic: `${img_folder.cards}fork.png`,
        options
    }
}
/** @type {CardGenerator}*/
function explosion(){
    var area = [];
    var radius = 2;
    for(var i = -1 * radius; i <= radius; ++i){
        for(var j = -1 * radius; j <= radius; ++j){
            area.push(pattack(i, j));
        }
    }
    var options = new ButtonGrid();
    options.add_button(`Explode!`, area, 5);
    return{
        name: `explosion`,
        pic: `${img_folder.cards}explosion.png`,
        options
    }
}
/** @type {CardGenerator}*/
function breakthrough(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(1, 0), pattack(-1, 0), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pattack(1, 0), pattack(-1, 0), pattack(0, 1)]);
    return{
        name: `breakthrough`,
        pic: `${img_folder.cards}breakthrough.png`,
        options
    }
}
/** @type {CardGenerator}*/
function flanking_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(0, 1), pattack(-1, 0), pmove(1, -1), pattack(0, 1), pattack(-1, 0)]);
    options.add_button(NW, [pmove(-1, -1), pattack(0, 1), pattack(1, 0), pmove(-1, -1), pattack(0, 1), pattack(1, 0)]);
    return{
        name: `flanking diagonal`,
        pic: `${img_folder.cards}flanking_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function flanking_sideways(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pattack(0, 1), pattack(0, -1), pmove(1, 0), pattack(0, 1), pattack(0, -1)]);
    options.add_button(W, [pmove(-1, 0), pattack(0, 1), pattack(0, -1), pmove(-1, 0), pattack(0, 1), pattack(0, -1)]);
    return{
        name: `flanking sideways`,
        pic: `${img_folder.cards}flanking_sideways.png`,
        options
    }
}
/** @type {CardGenerator}*/
function flanking_straight(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(1, 0), pattack(-1, 0), pmove(0, -1), pattack(1, 0), pattack(-1, 0)]);
    options.add_button(S, [pmove(0, 1), pattack(1, 0), pattack(-1, 0), pmove(0, 1), pattack(1, 0), pattack(-1, 0)]);
    return{
        name: `flanking straight`,
        pic: `${img_folder.cards}flanking_straight.png`,
        options
    }
}
/** @type {CardGenerator}*/
function pike(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -2), pattack(1, -3), pattack(0, -3), pattack(-1, -3)]);
    options.add_button(E, [pattack(2, 0), pattack(3, 1), pattack(3, 0), pattack(3, -1)]);
    options.add_button(W, [pattack(-2, 0), pattack(-3, 1), pattack(-3, 0), pattack(-3, -1)]);
    options.add_button(S, [pattack(0, 2), pattack(1, 3), pattack(0, 3), pattack(-1, 3)]);

    return{
        name: `pike`,
        pic: `${img_folder.cards}pike.png`,
        options
    }
}
/** @type {CardGenerator}*/
function breakthrough_side(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pattack(1, 0), pattack(0, 1), pattack(0, -1)]);
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0), pattack(0, 1), pattack(0, -1)]);
    return{
        name: `breakthrough side`,
        pic: `${img_folder.cards}breakthrough_side.png`,
        options
    }
}
/** @type {CardGenerator}*/
function whack_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NW, [pattack(-1, -1), pattack(-1, -1)]);
    options.add_button(NE, [pattack(1, -1), pattack(1, -1)]);
    options.add_button(SE, [pattack(1, 1), pattack(1, 1)]);
    options.add_button(SW, [pattack(-1, 1), pattack(-1, 1)]);
    return{
        name: `whack diagonal`,
        pic: `${img_folder.cards}whack_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function thwack(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -1), pattack(0, -1)]);
    return{
        name: `thwack`,
        pic: `${img_folder.cards}thwack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function overcome_sideways(){
    var options = new ButtonGrid();
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(1, -1), pmove(2, 0)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-1, -1), pmove(-2, 0)]);
    return{
        name: `overcome sideways`,
        pic: `${img_folder.cards}overcome_sideways.png`,
        options
    }
}
/** @type {CardGenerator}*/
function y_leap(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    options.add_button(S, [pmove(0, 2)]);
    return{
        name: `Y leap`,
        pic: `${img_folder.cards}y_leap.png`,
        options
    }
}
/** @type {CardGenerator}*/
function diamond_slice(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(2, 0),
                pattack(1, -1),
                pattack(0, 2),
                pattack(0, -2),
                pattack(-1, 1),
                pattack(-2, 0),
                pattack(-1, -1)]
    options.add_button(SPIN, spin);
    return{
        name: `diamond slice`,
        pic: `${img_folder.cards}diamond_slice.png`,
        options
    }
}
/** @type {CardGenerator}*/
function spearhead(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(1, -1), pattack(1, 0), pattack(0, -1)]);
    options.add_button(NW, [pmove(-1, -1), pattack(-1, -1), pattack(-1, 0), pattack(0, -1)]);
    return{
        name: `spearhead`,
        pic: `${img_folder.cards}spearhead.png`,
        options
    }
}
/** @type {CardGenerator}*/
function alt_diagonal_left(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, 0), pattack(1, -1), pattack(0, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pattack(-1, 0), pattack(-1, 1), pattack(0, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `alternating diagonal left`,
        pic: `${img_folder.cards}alt_diagonal_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function alt_diagonal_right(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pattack(1, 0), pattack(1, 1), pattack(0, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pattack(-1, 0), pattack(-1, -1), pattack(0, -1)]);
    return{
        name: `alternating diagonal right`,
        pic: `${img_folder.cards}alt_diagonal_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function alt_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(-1, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: `alternating horizontal`,
        pic: `${img_folder.cards}alt_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function alt_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(1, -1)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-1, -1)]);
    return{
        name: `alternating vertical`,
        pic: `${img_folder.cards}alt_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function jab_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1), pattack(2, -2)]);
    options.add_button(SE, [pattack(1, 1), pattack(2, 2)]);
    options.add_button(SW, [pattack(-1, 1), pattack(-2, 2)]);
    options.add_button(NW, [pattack(-1, -1), pattack(-2, -2)]);
    return{
        name: `jab_diagonal`,
        pic: `${img_folder.cards}jab_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function diamond_attack(){
    var options = new ButtonGrid();
    options.add_button(SPIN, [pattack(0, -1), pattack(1, 0), pattack(0, 1), pattack(-1, 0)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: `diamond attack`,
        pic: `${img_folder.cards}diamond_attack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pteleport(0, 0)]);
    return{
        name: `teleport`,
        pic: `${img_folder.cards}teleport.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_w(){
    var options = new ButtonGrid();
    options.add_button(W, [pmove(-1, 0), pinstant(0, 0)]);
    return{
        name: `sidestep west`,
        pic: `${img_folder.cards}sidestep_w.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_e(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pinstant(0, 0)]);
    return{
        name: `sidestep east`,
        pic: `${img_folder.cards}sidestep_e.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_n(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pinstant(0, 0)]);
    return{
        name: `sidestep north`,
        pic: `${img_folder.cards}sidestep_n.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_s(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1), pinstant(0, 0)]);
    return{
        name: `sidestep south`,
        pic: `${img_folder.cards}sidestep_s.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-1, -1), pinstant(0, 0)]);
    return{
        name: `sidestep nw`,
        pic: `${img_folder.cards}sidestep_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pinstant(0, 0)]);
    return{
        name: `sidestep ne`,
        pic: `${img_folder.cards}sidestep_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1), pinstant(0, 0)]);
    return{
        name: `sidestep se`,
        pic: `${img_folder.cards}sidestep_se.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1), pinstant(0, 0)]);
    return{
        name: `sidestep sw`,
        pic: `${img_folder.cards}sidestep_sw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function punch_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pinstant(0, 0)]);
    options.add_button(E, [pattack(1, 0), pinstant(0, 0)]);
    options.add_button(S, [pattack(0, 1), pinstant(0, 0)]);
    options.add_button(W, [pattack(-1, 0), pinstant(0, 0)]);
    return{
        name: `punch orthogonal`,
        pic: `${img_folder.cards}punch_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function punch_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1), pinstant(0, 0)]);
    options.add_button(SE, [pattack(1, 1), pinstant(0, 0)]);
    options.add_button(SW, [pattack(-1, 1), pinstant(0, 0)]);
    options.add_button(NW, [pattack(-1, -1), pinstant(0, 0)]);
    return{
        name: `punch diagonal`,
        pic: `${img_folder.cards}punch_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slice_twice(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(1, -1), pattack(0, -1), pattack(0, -1), pattack(-1, -1), pattack(-1, -1)]);
    return{
        name: `slice twice`,
        pic: `${img_folder.cards}slice_twice.png`,
        options
    }
}





// Cards given to the player as debuffs
/** @type {CardGenerator}*/
function stumble_w(){
    var options = new ButtonGrid();
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: `stumble west`,
        pic: `${img_folder.cards}stumble_w.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_e(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0)]);
    return{
        name: `stumble east`,
        pic: `${img_folder.cards}stumble_e.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_n(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    return{
        name: `stumble north`,
        pic: `${img_folder.cards}stumble_n.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_s(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: `stumble south`,
        pic: `${img_folder.cards}stumble_s.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `stumble nw`,
        pic: `${img_folder.cards}stumble_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    return{
        name: `stumble ne`,
        pic: `${img_folder.cards}stumble_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    return{
        name: `stumble se`,
        pic: `${img_folder.cards}stumble_se.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: `stumble sw`,
        pic: `${img_folder.cards}stumble_sw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function freeze_up(){
    var options = new ButtonGrid();
    options.add_button(`Freeze Up`, [], 5);
    return{
        name: `freeze up`,
        pic: `${img_folder.cards}freeze_up.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lash_out(){
    var options = new ButtonGrid();
    var spin = [pattack(1, 1),
                pattack(1, 0),
                pattack(1, -1),
                pattack(0, 1),
                pattack(0, 0),
                pattack(0, -1),
                pattack(-1, 1),
                pattack(-1, 0),
                pattack(-1, -1)]
    options.add_button(`Lash Out`, spin, 5);
    return{
        name: `lash out`,
        pic: `${img_folder.cards}lash_out.png`,
        options
    }
}

// Cards dropped by bosses
/** @type {CardGenerator}*/
function roll_nesw(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove_until(1, -1), pattack(1, -1)]);
    options.add_button(SW, [pmove_until(-1, 1), pattack(-1, 1)]);
    return{
        name: `roll NE SW`,
        pic: `${img_folder.cards}roll_nesw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function roll_nwse(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove_until(1, 1), pattack(1, 1)]);
    options.add_button(NW, [pmove_until(-1, -1), pattack(-1, -1)]);
    return{
        name: `roll NW SE`,
        pic: `${img_folder.cards}roll_nwse.png`,
        options
    }
}
/** @type {CardGenerator}*/
function roll_ew(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove_until(1, 0), pattack(1, 0)]);
    options.add_button(W, [pmove_until(-1, 0), pattack(-1, 0)]);
    return{
        name: `roll E W`,
        pic: `${img_folder.cards}roll_ew.png`,
        options
    }
}
/** @type {CardGenerator}*/
function bite(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pinstant(0, 0)]);
    options.add_button(E, [pattack(1, 0), pinstant(0, 0)]);
    options.add_button(S, [pattack(0, 1), pinstant(0, 0)]);
    options.add_button(W, [pattack(-1, 0), pinstant(0, 0)]);
    options.add_button(NE, [pattack(1, -1), pinstant(0, 0)]);
    options.add_button(SE, [pattack(1, 1), pinstant(0, 0)]);
    options.add_button(SW, [pattack(-1, 1), pinstant(0, 0)]);
    options.add_button(NW, [pattack(-1, -1), pinstant(0, 0)]);
    return{
        name: `bite`,
        pic: `${img_folder.cards}bite.png`,
        options
    }
}
/** @type {CardGenerator}*/
function skitter(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `skitter`,
        pic: `${img_folder.cards}skitter.png`,
        options
    }
}
/** @type {CardGenerator}*/
function instant_teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pteleport(0, 0), pinstant(0, 0)]);
    return{
        name: `instant teleport`,
        pic: `${img_folder.cards}instant_teleport.png`,
        options
    }
}
/** @type {CardGenerator}*/
function debilitating_confusion(){
    var options = new ButtonGrid();
    var spin = [pstun(1, 1),
                pstun(1, 0),
                pstun(1, -1),
                pstun(0, 1),
                pstun(0, -1),
                pstun(-1, 1),
                pstun(-1, 0),
                pstun(-1, -1)];
    options.add_button(SPIN, spin.concat(spin));
    return{
        name: `debilitating confusion`,
        pic: `${img_folder.cards}debilitating_confusion.png`,
        options
    }
}




// Card Dummy Images to be displayed in the same space
/** @type {CardGenerator} Shown in shop to denote adding a card to your deck.*/
function add_card_symbol(){
    return{
        name: `Add a card to your deck`,
        pic: `${img_folder.other}plus.png`,
        options: new ButtonGrid()
    }
}
/** @type {CardGenerator} Shown in show to denote removing a card from your deck.*/
function remove_card_symbol(){
    return{
        name: `Remove a card from your deck`,
        pic: `${img_folder.other}minus.png`,
        options: new ButtonGrid()
    }
}
/** @type {CardGenerator} Shown in shop ind=stead of the remove symbol when your deck is at the minimum size.*/
function deck_at_minimum_symbol(){
    return{
        name: `Your deck is at the minimum size`,
        pic: `${img_folder.other}x.png`,
        options: new ButtonGrid()
    }
}

// ----------------Cards.js----------------
// File containing global constants used throughout the program.


// Starting player stats.
const PLAYER_STARTING_HEALTH = 3;
const HAND_SIZE = 3;
const ADD_CHOICE_COUNT = 3;
const REMOVE_CHOICE_COUNT = 3;
const MIN_DECK_SIZE = 5;
const CHEST_CHANCE = 2;


// Initialization settings.
const STARTING_ENEMY = spider_tile;
const STARTING_DECK = make_starting_deck;
const STARTING_AREA = generate_ruins_area;

// Dungeon generation settings.
const FLOOR_WIDTH = 8;
const FLOOR_HEIGHT = 8;
const AREA_SIZE = 5;
const SAFE_SPAWN_ATTEMPTS = 5;

// Visual and animation settings.
const CARD_SCALE = 90;
const CHEST_CONTENTS_SIZE = 120;
const TILE_SCALE = 30;
const CARD_SYMBOL_SCALE = 20;
const ANIMATION_DELAY = 300;
const DECK_DISPLAY_WIDTH = 4;
const TEXT_WRAP_WIDTH = 90;
const MARKUP_LANGUAGE = `html`;


// Keyboard controls.
const controls = {
    directional: [`q`, `w`, `e`, `a`, `s`, `d`, `z`, `x`, `c`],
    card: [`h`, `j`, `k`]
}
Object.freeze(controls);

// Image folder file structure.
const img_folder = {
    src: `images/`,
    backgrounds: `backgrounds/`,
    cards: `cards/`,
    other: `other/`,
    symbols: `symbols/`,
    tiles: `tiles/`
}
Object.freeze(img_folder);// ----------------Descriptions.js----------------
// Contains text that will be displayed.

// General.
const game_title = `Maneuver`;
const mod_deck = `Choose one card to add or remove:`;
const current_deck = `Current Deck (minimum `;
const welcome_message = `Use cards to move (blue) and attack (red).\n` 
                        + `Click on things to learn more about them.`;
const floor_message = `Welcome to floor `;
const game_over_message = `Game Over. You were killed by a `;
const retry_message = `Retry?`;
const stunned_msg = `Stunned x`;
const gameplay_screen_name = `Gameplay`;
const guide_screen_name = `Guidebook`;
const take_from_chest = `Take`;
const abandon_chest = `Abandon`;

// Normal Enemy Descriptions.
const spider_description = `Spider: Will attack the player if it is next to them. Otherwise it will move 1 space closer.`;
const turret_h_description = `Turret: Does not move. Fires beams orthogonally that hit the first thing in their path.`;
const turret_d_description = `Turret: Does not move. Fires beams diagonally that hit the first thing in their path.`;
const turret_r_description = `Turret: Does not move. Fires beams in two directions hitting the first thing in their path. `
                            +`Rotates every turn.`;
const scythe_description = `Scythe: Will move 3 spaces diagonally towards the player damaging them if it passes next to them. `
                            +`Can only see diagonally.`;
const shadow_knight_description = `Shadow Knight: Moves in an L shape. If it tramples the player, it will move again.`;
const spider_web_description = [`Spider Web: Does not move or attack. Spawns a spider every `, ` turns.`];
const ram_description = `Ram: Moves orthogonally. When it sees the player, it will prepare to charge towards them and ram them.`;
const large_porcuslime_description = `Large Porcuslime: Moves towards the player 1 space and attacks in that direction. Weakens when `
                            +`hit. It's spikes make it painful to touch.`;
const medium_porcuslime_description = `Medium Porcuslime: Moves towards the player 1 space and attacks in that direction. Alternates `
                            +`between orthoganal and diagonal movement. Splits when hit. It's spikes make it painful to touch.`;
const small_h_porcuslime_description = `Small Porcuslime: Moves towards the player 1 space orthogonally and attacks in that direction. `
                            +`It's spikes make it painful to touch.`;
const small_d_porcuslime_description = `Small Porcuslime: Moves towards the player 1 space diagonally and attacks in that direction. `
                            +`It's spikes make it painful to touch.`;
const acid_bug_description = `Acid bug: Moves towards the player 1 space. Has no normal attack, but will spray acid upon death hurting `
                            +`everything next to it.`;
const brightling_description = `Brightling: Is not aggressive. Will occasionally teleport the player close to it before teleoprting `
                            +`away the next turn.`;
const corrosive_caterpillar_description = `Corrosive Caterpillar: Is not aggressive. Leaves a trail of corrosive slime behind it when `
                            +`it moves or dies.`;
const noxious_toad_description = `Noxious Toad: Every other turn it will hop over a space orthogonally. If it lands near the player, it `
                            +`will damage everything next to it.`;
const vampire_description = `Vampire: Moves orthogonally then will attempt to attack diagonally. When it hits the player, it will heal `
                            +`itself. Teleports away and is stunned when hit.`;
const clay_golem_description = `Clay Golem: Will attack the player if it is next to them. Otherwise it will move 1 space closer. Taking `
                            +`damage will stun it and it cannot move two turns in a row.`;
const vinesnare_bush_description = [`Vinesnare Bush: Does not move. Will attack if the player is close to it. Otherwise, it can drag `
                            +`the player closer with vines from up to `, ` spaces away.`];
const rat_description = `Rat: Will attack the player if it is next to them. Otherwise it will move 2 spaces closer. After attacking, `
                            +`it will flee.`;
const shadow_scout_description = `Shadow Scout: Will attack the player if it is next to them. Otherwise it will move 1 space closer. `
                            +`Can go invisible every other turn.`
const darkling_description = `Darkling: Teleports around randomly hurting everything next to the location it arrives at. Blocking `
                            +`it's rift will destroy it.`;

// Area Descriptions.
const ruins_description = `You have entered the ruins.`;
const sewers_description = `You have entered the sewers.`;
const basement_description = `You have entered the basement.`;
const magma_description = `You have entered the magmatic caves.`;
const crypt_description = `You have entered the crypt.`;
const forest_description = `You have entered the subteranean forest.`;
const library_description = `You have entered the library.`;
const sanctum_description = `You have entered the sanctum.`;
const default_area_description = `You have reached the end of the current content. Floors will continue to generate but there will `
                                +`be no more boss fights. Good luck.`;

// Boss Descriptions.
const boss_death_description = `The exit opens.\n`
                                +`You feel your wounds begin to heal.`;
const velociphile_floor_message = `You hear a deafening shriek.`;
const velociphile_description = `Velociphile (Boss): A rolling ball of mouths and hate. Moves in straight lines. Must build up speed `
                                +`to ram you.`;
const velociphile_death_message = `The wailing falls silent as the Velociphile is defeated.`;
const spider_queen_floor_message = `The floor is thick with webs.`;
const spider_queen_description = `Spider Queen (Boss): Moves like a normal spider. Taking damage will stun her, but will also spawn `
                                +`spiders.`;
const spider_queen_death_message = `As the Spider Queen falls to the floor, the last of her children emerge.`;
const lich_floor_message = `Dust and dark magic swirl in the air.`;
const lich_description = `Lich (Boss): An undead wielder of dark magic. Each turn it will move away 1 space and then cast a spell.\n`
                        + `The Lich is currently preparing to cast:\n`;
const lich_death_message = `The Lich's body crumbles to dust.`;

// Lich Spell Descriptions.
const teleport_spell_description = `Teleport: The user moves to a random square on the map`;
const summon_spell_description = `Summon: Summons a random enemy`;
const earthquake_spell_description = `Earthquake: Causes chunks of the ceiling to rain down. Intensity increases at low health.`;
const flame_wave_spell_description = `Flame Wave: Creates 3 fireballs which will move forwards until they hit something.`;
const confusion_spell_description = `Confusion: Pollutes your deck with 2 temporary cards which will disapear after they are used.`;
const lava_moat_spell_description = `Lava Moat: Creates pools of molten lava to shield the user. Creates more at high health.`;
const rest_description = `Nothing.`;


// Other Tile Descriptions.
const empty_description = `There is nothing here.`;
const exit_description = `Stairs to the next floor.`;
const player_description = `You.`;
const lava_pool_description = `Lava Pool: Attempting to move here will hurt.`;
const corrosive_slime_description = `Corrosive Slime: Trying to walk in this will hurt. Clear it out by attacking.`;
const wall_description = `A wall. It seems sturdy.`;
const damaged_wall_description = `A damaged wall. Something might live inside.`;
const lock_description = `The exit is locked. Defeat the boss to continue.`;
const fireball_description = `A fireball. Moves forwards until it comes into contact with something, then damages it.`;
const falling_rubble_description = `Watch out, something is about to fall here.`;
const darkling_rift_description = `If this space isn't blocked, a darkling will teleport here next turn damaging everything nearby.`;
const chest_description = `A chest. It might have something useful inside.`;
const chest_inner_discription = `Choose up to one reward:`;

// Chest loot descriptions.
const add_card_description = `Add this card to your deck.`


// Cardinal Directions.
const NW = `NW`;
const N = `N`;
const NE = `NE`;
const E = `E`;
const SE = `SE`;
const S = `S`;
const SW = `SW`;
const W = `W`;
const C = `C`;
const SPIN = `Spin`;
// ----------------Display.js----------------
// File containing the display class which interacts with wherever the game is being displayed. 
// Currently the only way to display is via HTML, but if I wanted to port the game, this should
// make it easier to do without too much editing outside of this file and the uiid file. This also
// Standardizes how information is displayed making it easier to create new display elements.

/**
 * @typedef {Object} CellInfo The info required to create a table cell with an image.
 * @property {string} pic The image to be displayed in the cell.
 * @property {string=} name If name is provided, it will be used as mouseover text.
 * @property {number=} rotate If rotate is provided (in 90 degree increments) the image will be rotated by that amount.
 * @property {boolean=} flip If flip is provided, the image will be flipped horizontally.
 */

/**
 * @typedef {Object} ButtonInfo The info required to create a button table cell.
 * @property {string} description The text to be displayed in the button.
 */

/**
 * @callback OnClickFunction A function to be called when an element is clicked.
 * @param {CellInfo} tile The object used to create this element.
 * @param {Point} position The row and column of the element.
 */

/**
 * @callback BackgroundCreator A function to be called when an element is clicked.
 * @param {CellInfo} tile The object used to create this element.
 * @param {Point} position The row and column of the element.
 * @returns {string[]} An array of the pictures to layer in the background.
 */

/**
 * @callback NormalCallback A function with no args or returns.
 * @returns {void}
 */

/**
 * @typedef {Object} DropdownOption
 * @property {string} label The label that should be displayed in the dropdown menu.
 * @property {NormalCallback} on_change The function executed when this option is chosen.
 */

/**
 * @callback add_tb_row A function to add a row of images to a table.
 * @param {string} location The ID of the table to be added to.
 * @param {CellInfo[]} row_contents The objects used to construct the row's contents.
 * @param {number} scale The size of the images.
 * @param {OnClickFunction} [on_click = undefined] Optional parameter which is used to give onclick functionality to the images.
 * @param {BackgroundCreator} [background = undefined] Optional parameter which specifies a image to be layered underneath each other one.
 */

/**
 * @callback add_button_row A function to add a row of buttons to a table.
 * @param {string} location The ID of the table to be added to.
 * @param {ButtonInfo[]} row_contents The objects used to construct the row's contents.
 * @param {OnClickFunction} [on_click = undefined] Optional parameter which is used to give onclick functionality to the buttons.
 */

/**
 * @callback display_message A function to display a message to an element.
 * @param {string} location The ID of the element to display the message to.
 * @param {string} message The message to be displayed.
 */

/**
 * @callback clear_tb A function to remove all rows from a table.
 * @param {string} location The ID of the table to remove rows from.
 */

/**
 * @callback swap_screen A function to swap which div from a group is visible
 * @param {string[]} divisions An array of div names to set to invisible.
 * @param {string} [screen = undefined] Optional parameter for the ID of a div to set to visible.
 */

/**
 * @callback select A function to outline one image from a row of images in a table.
 * @param {string} location The ID of the table.
 * @param {number} row_num The row number of the image.
 * @param {number} column_num The column number of the image.
 * @param {number} [border = 3] Optional parameter to specify border thickness
 * @param {number} [color = 555] Optional parameter to specify border color.
 */

/**
 * @callback press A function to handle keyboard controls.
 * @param {KeyboardEvent} key_press The keystroke to handle.
 */

/**
 * @callback create_visibility_toggle A function to create a section of text that can be minimized with the press of a button.location, header, body
 * @param {string} location Where to create the section.
 * @param {string} header What the section is called.
 * @param {HTMLElement} body_elemnt The text to display in the section.
 */

/**
 * @callback create_dropdown A function to create a dropdown menu where the user can select an option.
 * @param {string} location Where the dropdown menu should be added to.
 * @param {DropdownOption[]} options_arr An array of each label and associated function that make up the dropdown menu.
 */

/**
 * @callback create_alternating_text_section A function to create a section of interspersed text with images and other elements.
 * @param {string} header The header to give the section. The div id will be of the form `${header} section`.
 * @param {string[]} par_arr An array of the strings which other elements should be placed between.
 * @param {HTMLElement[]} inline_arr An array of other elements to be added inline inbetween the strings. 
 *                                  It's length should be 1 or 0 less than par_arr's.
 * @returns {HTMLDivElement} The div including the mix of text and other elements.
 */

/**
 * @callback create_button Creates and returns a button element.
 * @param {string} label The button text.
 * @param {string} id The element id.
 * @param {NormalCallback=} on_click If provided, called when it is clicked.
 * @returns {HTMLInputElement} The created button.
 */
/**
 * @callback create_image Creates and returns an image eleemnt.
 * @param {string} src The pic to display.
 * @param {string} id The element id
 * @param {number | Point} size How largethe pic should be.
 * @returns {HTMLImageElement} The created image.
 */

/**
 * @typedef {Object} DisplayLibrary The library of functions used to handle displaying things in a specific language.
 * @property {add_tb_row} add_tb_row
 * @property {add_button_row} add_button_row
 * @property {display_message} display_message
 * @property {clear_tb} clear_tb
 * @property {swap_screen} swap_screen
 * @property {select} select
 * @property {press} press
 * @property {create_visibility_toggle} create_visibility_toggle
 * @property {create_dropdown} create_dropdown
 * @property {create_alternating_text_section} create_alternating_text_section
 * @property {create_button} create_button
 * @property {create_image} create_image
 */


/**
 * A function to get the display library for a given language.
 * @param {string} language The language to get the library for.
 * @returns {DisplayLibrary}
 */
function get_display(language){
    // Factory function for the display classes (currently only html)
    switch(language){
        case `html`:
            return DisplayHTML;
        default:
            throw new Error(`invalid display language`);
    }
}

/**
 * @callback get_transformation A helper function to format all css transformation properties detailed by an object into a single string.
 * @param {CellInfo} to_display The object that contains which transformations to perform.
 * @returns {string} String that can be used to apply the appropriate transformations.
 */

/**
 * @callback html_constructor Typedef for a HTMLElement constructor
 * @returns {*}
 * 
 * @overload 
 * @param {string} location
 * @returns {HTMLElement}
 * 
 * @overload
 * @param {string} location
 * @param {html_constructor} type
 * @returns {HTMLElement}
 * 
 * @callback get_element Function to get a html element, make sure it's not void, and optionally make sure it is the correct type.
 * @param {string} location The ID of the element to get.
 * @param {function} [type = undefined] Optional constructor of the type of element it should be.
 * @returns {*} Returns the element which is optionally guarenteed to be the right type.
 */

/**
 * @typedef HTML_Helpers A collection of the helper functions used by the DisplayHTML library.
 * @property {get_transformation} get_transformation
 * @property {get_element} get_element
 */


/**
 * Library containing functions used to diplay things in HTML.
 * Implements DisplayLibrary.
 * @type {DisplayLibrary & HTML_Helpers}
 */
const DisplayHTML = {
    // Required functions.
    add_tb_row: function(location, row_contents, scale, on_click, background = undefined){
        var table = DisplayHTML.get_element(location, HTMLTableElement);
        var row_num = table.rows.length;
        var row = document.createElement(`tr`);
        row.id = `${location} row ${row_num}`;
        var make_on_click = function(tile, position, click){
            return function(){
                return click(tile, position);
            }
        }
        for(var i = 0; i < row_contents.length; ++i){
            var to_display = row_contents[i];
            var cell = document.createElement(`td`);
            cell.id = `${location} ${row_num} ${i}`;
            cell.style.height = `${scale}px`;
            cell.style.width = `${scale}px`;
            cell.classList.add(`relative`);
            if(on_click !== undefined){
                cell.onclick = make_on_click(to_display, new Point(i, row_num), on_click);
            }
            if(to_display.name !== undefined){
                cell.title = to_display.name;
            }
            if(background !== undefined){
                var background_arr = background(to_display, new Point(i, row_num));
                for(var j = 0; j < background_arr.length; ++j){
                    var bottom_img = document.createElement(`img`);
                    bottom_img.id = `${location} ${row_num} ${i} background ${j} img`;
                    bottom_img.src = `${img_folder.src}${background_arr[j]}`;
                    bottom_img.height = scale;
                    bottom_img.width = scale;
                    bottom_img.classList.add(`absolute`);
                    bottom_img.style.position = `absolute`;
                    cell.append(bottom_img);
                }
                
            }
            var top_img = document.createElement(`img`);
            top_img.id = `${location} ${row_num} ${i} img`;
            top_img.src = `${img_folder.src}${to_display.pic}`;
            top_img.height = scale;
            top_img.width = scale;
            top_img.classList.add(`absolute`);
            top_img.style.transform = DisplayHTML.get_transformation(to_display);
            cell.append(top_img);
            row.append(cell);
        }
        table.append(row);
    },
    add_button_row: function(location, row_contents, on_click = undefined){
        var table = DisplayHTML.get_element(location, HTMLTableElement);
        var row_num = table.rows.length;
        var row = document.createElement(`tr`);
        row.id = `${location} row ${row_num}`;
        var make_on_click = function(tile, position, click){
            return function(){
                return click(tile, position);
            }
        }
        for(var i = 0; i < row_contents.length; ++i){
            var button_on_click = undefined;
            if(on_click !== undefined){
                button_on_click = make_on_click(row_contents[i], new Point(i, row_num), on_click);
            }
            row.append(DisplayHTML.create_button(row_contents[i].description, `${location} ${row_num} ${i}`, button_on_click));
        }
        table.append(row);
    },
    display_message: function(location, message){
        var output = wrap_str(message, TEXT_WRAP_WIDTH, ` `);
        DisplayHTML.get_element(location).innerText = output;
    },
    clear_tb: function(location){
        var table = DisplayHTML.get_element(location, HTMLTableElement);
        while(table.rows.length > 0){
            table.deleteRow(0);
        }
    },
    swap_screen: function(divisions, screen = undefined){
        for(var i = 0; i < divisions.length; ++i){
            DisplayHTML.get_element(divisions[i], HTMLDivElement).style.display = `none`;
        }
        if(screen !== undefined){
            DisplayHTML.get_element(screen, HTMLDivElement).style.display = `block`;
        }
    },
    select: function(location, row_num, column_num, border = 3, color = 555){
        var row = DisplayHTML.get_element(`${location} row ${row_num}`, HTMLTableRowElement);
        var column_count = row.cells.length;
        for(var i = 0; i < column_count; ++i){
            DisplayHTML.get_element(`${location} ${row_num} ${i} img`, HTMLImageElement).border = ``;
        }
        DisplayHTML.get_element(`${location} ${row_num} ${column_num} img`, HTMLImageElement).border = `${border}px solid #${color}`;
    },
    press: function(key_press){
        // Pick direction via keyboard.
        var key_num = search(key_press.key, controls.directional);
        if(key_num >= 0){
            try{
                DisplayHTML.get_element(`${UIIDS.move_buttons} ${Math.floor(key_num / 3)} ${key_num % 3}`).click();
            }
            catch(error){
                if(error.message !== `failed to retrieve html element`){
                    throw error;
                }
            }
            
        }
        // Select card via keyboard.
        key_num = search(key_press.key, controls.card);
        if(key_num >= 0){
            var element = DisplayHTML.get_element(`${UIIDS.hand_display} 0 ${key_num}`);
            element && element.click();
        }
    },
    create_visibility_toggle: function(location, header, body_element){
        var toggle_visible = function(button_table_id, body_id, header_txt, visible){
            return function(tile, position){
                var vis_str = visible ? `Hide` : `Show`;
                var callback = toggle_visible(tb_id, body_id, header_txt, !visible);
                DisplayHTML.clear_tb(button_table_id);
                DisplayHTML.add_button_row(button_table_id, [{description: `${vis_str} ${header_txt}`}], callback);
                var vis_style = visible ? `block` : `none`;
                DisplayHTML.get_element(body_id).style.display = vis_style;
            }
        }

        var section = DisplayHTML.get_element(location);
        var table = document.createElement(`table`);
        var tb_id = `${header} button table`;
        table.id = tb_id;
        section.append(table);

        body_element.style.display = `none`;
        section.append(body_element);
        DisplayHTML.add_button_row(tb_id, [{description: `Show ${header}`}], toggle_visible(tb_id, body_element.id, header, true));
    },
    create_dropdown: function(location, options_arr){
        var doc_location = this.get_element(location);
        var select_button = document.createElement(`select`);
        var select_id = `${location} select`
        select_button.id = select_id;
        var select_func = function(options, select_id){
            var option_func_map = new Map()
            for(var option of options){
                option_func_map.set(option.label, option.on_change);
            }
            return function(){
                var select_element = DisplayHTML.get_element(select_id, HTMLSelectElement);
                var label = select_element.value;
                var chosen_option = option_func_map.get(label);
                if(chosen_option === undefined){
                    throw new Error("unrecognized value in select element");
                }
                chosen_option();
            }
        }
        select_button.onchange = select_func(options_arr, select_id);
        for(var option_data of options_arr){
            var option = document.createElement(`option`);
            option.value = option_data.label;
            option.innerText = option_data.label;
            select_button.append(option);
        }
        doc_location.append(select_button);
    },
    create_alternating_text_section: function(header, par_arr, inline_arr){
        if(par_arr.length !== inline_arr.length && par_arr.length !== inline_arr.length + 1){
            throw new Error(`array size mismatch`);
        }
        var body_div = document.createElement(`div`);
        var body_div_id = `${header} section`;
        body_div.id = body_div_id;
        body_div.style.display = `none`;


        var body_header = document.createElement(`h2`);
        body_header.id = `${body_div_id} header`;
        body_header.innerText = `${header}:`;
        body_div.append(body_header);

        for(var i = 0; i < par_arr.length; ++i){
            var body_text = document.createElement(`p`);
            body_text.id = `${body_div_id} text ${i}`;
            body_text.innerText = wrap_str(par_arr[i], TEXT_WRAP_WIDTH, ` `);
            body_text.style.display = `inline`;
            body_div.append(body_text);
            if(i < inline_arr.length){
                inline_arr[i].id = `${body_div_id} non-text ${i}`
                inline_arr[i].style.display = `inline`;
                body_div.append(inline_arr[i]);
            }
        }
        
        return body_div;
    },
    create_button: function(label, id, on_click = undefined){
        var button = document.createElement(`input`);
        button.type = `button`;
        button.id = id;
        if(on_click !== undefined){
            button.onclick = on_click;
        }
        button.value = label;
        return button;
    },
    create_image: function(src, id, size){
        var image = document.createElement(`img`);
        image.src = `${img_folder.src}${src}`;
        image.id = id;
        if(typeof size === `number`){
            image.width = size;
            image.height = size;
        }
        else{
            image.width = size.x;
            image.height = size.y;
        }
        return image;
    },

    // Non Required helper functions.
    get_transformation: function(to_display){
        var transformation = ``;
        if(to_display.rotate !== undefined){
            transformation = `${transformation}rotate(${to_display.rotate}deg) `;
        }
        if(to_display.flip){
            transformation = `${transformation}scaleX(-1) `;
        }
        return transformation;   
    },
    get_element: function(location, type = undefined){
        var element = document.getElementById(location);
        if(element === null){
            throw new Error(`failed to retrieve html element`);
        }
        if(type !== undefined && !(element instanceof type)){
            throw new Error(`html element is the wrong type`);
        }
        return element
    }
}
Object.freeze(DisplayHTML);

// Set up the display library and the onkeydown function.
const display = get_display(MARKUP_LANGUAGE);
document.onkeydown = display.press;// ----------------EntityList.js----------------
// EntityList class is used by the GameMap class to keep track of entities without having to search through the map each time.

/**
 * @typedef Tile_W_Pos An object containing a Tile and it's current position.
 * @property {Tile} enemy The tile.
 * @property {Point} location It's current location.
 */

class EntityList{
    /** @type {number} The number of nun empty tiles on the floor.*/
    count_non_empty;
    /** @type {Point | undefined} The position of the player, or undefined if they haven't been added yet.*/
    #player_pos;
    /** @type {Point | undefined} The position of the exit, or undefined if it hasn't been added yet.*/
    #exit_pos;
    /** @type {Tile_W_Pos[]} An array of each entity on the floor with a behavior as well as their location.*/
    #enemy_list;
    /** @type {number} Used to give a unique ID to each tile that is added.*/
    #id_count;

    constructor(){
        this.count_non_empty = 2;
        this.#id_count = 0;
        this.#enemy_list = [];
    }
    /**
     * Gets a unique id and increments the count.
     * @returns {number} The id.
     */
    next_id(){
        return ++this.#id_count;
    }
    /**
     * @param {Point} location Where the player's location should be set to.
     */
    set_player_pos(location){
        this.#player_pos = location;
    }
    /**
     * Returns the player's location. Throws an error if it's undefined.
     * @returns {Point} The player's location.
     */
    get_player_pos(){
        if(this.#player_pos === undefined){
            throw new Error(`player does not exist`);
        }
        return this.#player_pos.copy();
    }
    /**
     * @param {Point} location Where the exit's location should be set to
     */
    set_exit(location){
        this.#exit_pos = location;
    }
    /**
     * Returns the exit's location. Throws an error if it's undefined.
     * @returns {Point} The exit's location.
     */
    get_exit_pos(){
        if(this.#exit_pos === undefined){
            throw new Error(`exit does not exist`);
        }
        return this.#exit_pos.copy();
    }
    /**
     * Adds a new enemy and it's location to the array of enemies.
     * @param {Point} location The location of the enemy.
     * @param {Tile} enemy The tile.
     */
    add_enemy(location, enemy){
        enemy.id = this.next_id();
        this.#enemy_list.push({location, enemy});
        ++this.count_non_empty;
    }
    /**
     * Changes an enemy's location.
     * @param {Point} location The new location.
     * @param {number} id The id of the enemy whose location should be moved. Throws an error if none match.
     */
    move_enemy(location, id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(`id not found`);
        }
        this.#enemy_list[index].location = location;
    }
    /**
     * Removes an enemy.
     * @param {number} id The id of the enemy to be removed. Throws an error if none match.
     */
    remove_enemy(id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(`id not found`);
        }
        this.#enemy_list.splice(index, 1);
        --this.count_non_empty;
    }
    /**
     * Helper function to determine the location of an entity in the entity_list.
     * @param {number} id ID to search for.
     * @returns {number} Returns the index if found and -1 if not.
     */
    #find_by_id(id){
        for(var i = 0; i < this.#enemy_list.length; ++i){
            if(this.#enemy_list[i].enemy.id === id){
                return i;
            }
        }
        return -1;
    }
    /**
     * Moves a enemy or a player. Throws an error if the type is something else or the entity is not in the entity_list.
     * @param {Point} location The new location.
     * @param {Tile} entity The Tile to be moved
     */
    move_any(location, entity){
        if(entity.type === `player`){
            this.set_player_pos(location);
        }
        else if(entity.type === `enemy`){
            if(entity.id === undefined){
                throw new Error(`enemy missing id`);
            }
            this.move_enemy(location, entity.id);
        }
        else{
            throw new Error(`moving invalid type`);
        }
    }
    /**
     * Each enemy takes a turn in order.
     * Throws an error if the player dies or is moved.
     * @param {GameMap} map The map object which their actions will be performed on.
     */
    async enemy_turn(map){
        // Triggers each enemy's behavior.
        // Displays the game map between each.
        var turn = []
        for(var i = 0; i < this.#enemy_list.length; ++i){
            turn.push(this.#enemy_list[i]);
        }
        for(var i = 0; i < turn.length; ++i){
            var e = turn[i];
            if(e.enemy.id === undefined){
                throw new Error(`enemy has no id`);
            }
            if(!(this.#find_by_id(e.enemy.id) === -1)){
                try{
                    if(e.enemy.stun !== undefined && e.enemy.stun > 0){
                        --e.enemy.stun;
                    }
                    else{
                        try{
                            if(e.enemy.behavior !== undefined){
                                var self = {
                                    tile: e.enemy,
                                    location: e.location.copy()
                                }
                                var target = {
                                    tile: map.get_player(),
                                    difference: this.get_player_pos().minus(e.location)
                                }
                                e.enemy.behavior(self, target, map);
                            }
                        }
                        catch(error){
                            if(!(error.message === `creature died`)){
                                throw error
                            }
                        }
                        map.display();
                        await delay(ANIMATION_DELAY);
                    }
                }
                catch(error){
                    if(error.message === `game over`){
                        throw new Error(`game over`, {cause: new Error(e.enemy.name)});
                    }
                    throw error;
                }
            } 
        }
    }
}
// ----------------Floors.js----------------
// File containing the functions for generating new floors.

const BOSS_FLOOR = [velociphile_floor, spider_queen_floor, lich_floor];


/**
 * @callback FloorGenerator Function to populate a floor.
 * @param {number} floor_number How many floors have they entered. Used to determine the combined difficulty of spawned enemies.
 * @param {Area} area Which area of the dungeon are we in.
 * @param {GameMap} map The gamemap which holds the floor.
 */
/** @type {FloorGenerator} The generator used by the default area to simulate no areas.*/
function floor_generator(floor_num, area, map){
    if(!(floor_num % AREA_SIZE === 0) || Math.floor(floor_num / AREA_SIZE) - 1 >= BOSS_FLOOR.length){
        generate_normal_floor(floor_num, area, map);
    }
    else{
        BOSS_FLOOR[Math.floor(floor_num / AREA_SIZE) - 1](floor_num, area, map);
    }
}

/** @type {FloorGenerator} The standard generator to add random enemies from the area whose combined difficulty scales based on the floor number.*/
function generate_normal_floor(floor_num, area, map){
    var enemy_list = area.enemy_list;
    for(var i = floor_num * 2; i > 0;){
        var choice = random_num(enemy_list.length);
        var new_enemy = enemy_list[choice]();
        if(new_enemy.difficulty !== undefined && new_enemy.difficulty <= i){
            if(map.spawn_safely(new_enemy, SAFE_SPAWN_ATTEMPTS, false)){
                i -= new_enemy.difficulty;
            };
        }
    }
}

/** @type {FloorGenerator}*/
function generate_ruins_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function generate_sewers_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function generate_basement_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function generate_magma_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function generate_crypt_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function generate_forest_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function generate_library_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function generate_sanctum_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}


// ----------------GameMap.js----------------
// GameMap class holds the information on the current floor and everything on it.

/**
 * @callback MapEventFunction Function to exicute an event on the map at the end of the enemies' turn.
 * @param {GameMap} map Function controlling behavior of the event.
 */

class GameMap{
    /** @type {number} Size of the grid's x axis.*/
    #x_max;
    /** @type {number} Size of the grid's y axis.*/
    #y_max;
    /** @type {EntityList} Used to keep track of non player entity locations and perform their turns.*/
    #entity_list;
    /** @type {Tile[][]} Grid representing the floor layout.*/
    #grid;
    /** @type {number} Which number floor this is.*/
    #floor_num;
    /** @type {number} Total number of turns that have elapsed.*/
    #turn_count;
    /** @type {MapEventFunction[]} Events that will happen at the end of the turn.*/
    #events;
    /** @type {Area} The current area of the dungeon they are in.*/
    #area;
    /**
     * @param {number} x_max The x size of floors in this dungeon.
     * @param {number} y_max The y size of floors in this dungeon.
     * @param {Area} area The starting area.
     */
    constructor(x_max, y_max, area){
        this.#x_max = x_max;
        this.#y_max = y_max;
        this.#entity_list = new EntityList();
        this.#floor_num = 0;
        this.#turn_count = 0;
        this.#events = [];
        this.#area = area;
        this.erase()
    }
    /**
     * Function to reset the floor so the next one can be generated,
     * @returns {number} The updated floor number.
     */
    erase(){
        // Function to start a new floor by erasing the board and adding only the player and the exit.
        // Returns the floor number.
        try{
            var player = this.get_player();
        }
        catch(error){
            if(error.message === `player does not exist`){
                var player = player_tile();
            }
            else{
                throw error;
            }
        }
        this.#entity_list = new EntityList();
        this.#grid = [];
        for(var i = 0; i < this.#y_max; ++i){
            this.#grid.push([]);
            for(var j = 0; j < this.#x_max; ++j){
                this.#grid[i].push(empty_tile());
            }
        }
        var exit_location = new Point(random_num(this.#y_max), 0);
        this.set_exit(exit_location);
        var player_location = new Point(random_num(this.#y_max), this.#x_max - 1);
        this.set_player(player_location, player);
        return ++this.#floor_num;
    }
    /**
     * @returns {Point} A random space on the floor.
     */
    random_space(){
        // Returns a random space in the grid.
        return new Point(random_num(this.#x_max), random_num(this.#y_max));
    }
    /**
     * @returns {Point} A random empty space on the floor.
     */
    random_empty(){
        // Returns a random empty space in the grid.
        // Throws an erro if the map is full.
        var num_empty = this.#x_max * this.#y_max - this.#entity_list.count_non_empty;
        var rand = random_num(num_empty);
        if(num_empty === 0){
            throw new Error(`map full`);
        }
        for(var x = 0; x < this.#x_max; ++x){
            for(var y = 0; y < this.#y_max; ++y){
                var pos = new Point(x, y)
                if(this.#get_grid(pos).type === `empty`){
                    if(rand === 0){
                        return pos;
                    }
                    --rand;
                }
            }
        }
        throw new Error(`grid full`);
    }
    /**
     * Thows an error if the provided point is out of bounds.
     * @param {Point} location The point to check.
     */
    check_bounds(location){
        // Throws an error if x or y is out of bounds.
        if(location.x < 0 || location.x >= this.#x_max){
            throw new Error(`x out of bounds`);
        }
        if(location.y < 0 || location.y >= this.#y_max){
            throw new Error(`y out of bounds`);
        }
    }
    /**
     * Checks if a point is within bounds.
     * @param {Point} location The point to check.
     * @returns {boolean} If the point is in bounds.
     */
    is_in_bounds(location){
        // Throws an error if x or y is out of bounds.
        if(location.x < 0 || location.x >= this.#x_max){
            return false;
        }
        if(location.y < 0 || location.y >= this.#y_max){
            return false;
        }
        return true;
    }
    /**
     * Checks if a location is in bounds and empty.
     * @param {Point} location The point to check.
     * @returns {boolean} Returns true if the location is both in bounds and empty and false otherwise.
     */
    check_empty(location){
        // returns true if the space at grid[x, y] is empty.
        // throws an error if the space is out of bounds.
        try{
            this.check_bounds(location);
        }
        catch{
            return false;
        }
        return this.#get_grid(location).type === `empty`;
    }
    /**
     * Places an exit tile at the given location
     * Throws an error if the location is out of bounds, the space is not empty or there is already an exit tile.
     * @param {Point} location The location to set the exit at.
     */
    set_exit(location){
        // Places the exit.
        // Throws an error if the space is occupied or out of bounds..
        this.check_bounds(location);
        if(!this.check_empty(location)){
            throw new Error(`space not empty`);
        }
        try{
            // If exit isn't undefined, throws error.
            this.#entity_list.get_exit_pos();
            throw new Error(`exit already set`)
        }
        catch(error) {
            if(error.message !== `exit does not exist`){
                throw error;
            }
            // otherwise continues.
        }
        this.#entity_list.set_exit(location);
        this.#set_grid(location, exit_tile());
    }
    /**
     * Places the player at the given location.
     * Throws an error if player is not a player, the location is out of bounds, the space is not empty or there is already a player tile.
     * @param {Point} player_location The location to set the player at.
     * @param {Tile} player The player tile to be placed,
     */
    set_player(player_location, player){
        // Places the player. If a non-negative value is given for the player's health, it will be set to that.
        // Throws an error is the space is occupied or out of bounds.
        if(player.type !== `player`){
            throw new Error(`tried to set non-player as player`)
        }
        this.check_bounds(player_location);
        if(!this.check_empty(player_location)){
            throw new Error(`space not empty`);
        }
        try{
            // If player isn't undefined, throws error.
            this.#entity_list.get_player_pos();
            throw new Error(`player already set`)
        }
        catch(error) {
            if(error.message !== `player does not exist`){
                throw error;
            }
            // otherwise continues.
        }
        this.#entity_list.set_player_pos(player_location);
        this.#set_grid(player_location, player);
    }
    /**
     * Function to add a tile to the map.
     * @param {Tile} tile The tile to be added.
     * @param {Point} [location = undefined] Optional location to place the tile. If the location is not empty, an error will be thrown.
     *                                          If not provided, the location will be a random unoccupied one.
     * @returns {Point | void} If it successfully adds the tile, return sthe location. Otherwise, returns void.
     */
    add_tile(tile, location = undefined){
        // Adds a new tile to a space.
        // Returns true if it was added successfuly.
        // If x or y aren't provided, it will select a random empty space.
        try{
            if(location === undefined){
                location = this.random_empty();
            }
            this.check_bounds(location);
            if(!this.check_empty(location)){
                throw new Error(`space not empty`);
            }
        }
        catch(error){
            return;
        }
        this.#set_grid(location, tile);
        if(tile.type === `enemy`){
            this.#entity_list.add_enemy(location, tile);
        }
        else if(!(tile.type === `empty`)){
            ++this.#entity_list.count_non_empty;
        }
        return location.copy();
    }
    /**
     * Makes a number of attempts to spawn the given enemy at a location where it can't immediately attack the player.
     * @param {Tile} tile The tile to be added.
     * @param {number} tries The number of attempts
     * @param {boolean} force If true, the enemy will be spawned randomly using add_tile after all tries are exhausted. 
     * @returns {Point | void} If the tile is added, it returns the location. Otherwise it returns void.
     */
    spawn_safely(tile, tries, force){
        var attacks = [];
        var player_location = this.#entity_list.get_player_pos();
        if(!player_location){
            throw new Error(`player doesn't exist`);
        }
        for(var i = 0; i < tries; ++i){
            var location = this.random_empty();
            if(tile.telegraph){
                attacks = tile.telegraph(location, this, tile);
            }
            if(!attacks.find((element) => point_equals(element, player_location))){
                return this.add_tile(tile, location);
            }
        }
        if(force){
            return this.add_tile(tile);
        }
    }
    /**
     * Function to display the gamemap and the player's health.
     * Clicking on a tile will give info about it.
     * Resets tiles marked as hit afterwards.
     * @returns {void}
     */
    display(){
        // Diplays the gamemap. Each element shows it's description and hp (if applicable) when clicked.
        // If any empty tiles have been marked as hit, it resets the pic to empty.
        // Shows the player's remaining health below.
        display.clear_tb(UIIDS.map_display);
        var make_on_click = function(gameMap){
            return function(tile, location){
                var description = tile_description(tile);
                display.display_message(UIIDS.display_message, description);
                gameMap.clear_telegraphs();
                if(tile.telegraph !== undefined && !tile.stun){
                    gameMap.display_telegraph(tile.telegraph(location, gameMap, tile));
                }
                gameMap.display();
            }
        }
        var make_background = function(area){
            return function(tile, location){
                var backgrounds = [area.background];
                if(tile.is_hit !== undefined){
                    backgrounds.push(tile.is_hit);
                }
                if(tile.event_happening !== undefined){
                    backgrounds.push(tile.event_happening);
                }
                return backgrounds;
            }
        }        
        for(var y = 0; y < this.#y_max; y++){
            display.add_tb_row(UIIDS.map_display, this.#grid[y], TILE_SCALE, make_on_click(this), make_background(this.#area));
        }
        display.clear_tb(UIIDS.health_display);
        display_health(this.get_player(), TILE_SCALE);
        this.clear_telegraphs()
	}
    /**
     * Moves a tile.
     * Throws errors if the player reaches the end of the floor or if the tile (player or not) dies.
     * @param {Point} start_point The current location of the tile to be moved.
     * @param {Point} end_point Where you want to move the tile to.
     * @returns {boolean} Returns true if the tile is moved succesfully, false if it is not.
     */
    move(start_point, end_point){
        // Moves the tile at start_point to end_point if it is empty. 
        // Triggers the attempted destination's on_enter if applicable.
        // Throws an error if the starting location is out of bounds.
        // Returns true if the move was successful.
        // Also throws errors if the player reaches the end of the floor or dies.
        this.check_bounds(start_point);
        try{
            this.check_bounds(end_point);
        }
        catch{
            return false;
        }
        var start = this.#get_grid(start_point);
        var end = this.#get_grid(end_point);
        if(start.type === `player` && end.type === `exit`){
            ++this.#turn_count;
            throw new Error(`floor complete`);
        }
        if(end.on_enter !== undefined){
            // If the destination does something if moved onto, call it.
            try{
                var entity_entered = {
                    tile: end,
                    location: end_point
                }
                var mover_info = {
                    tile: start,
                    difference: start_point.minus(end_point)
                }
                end.on_enter(entity_entered, mover_info, this);
            }
            catch(error){
                if(error.message === `game over`){
                    throw new Error(`game over`, {cause: new Error(end.name)});
                }
                else{
                    throw error;
                }
            }
            if(start.health !== undefined && start.health <= 0){
                throw new Error(`creature died`);
            }
        }
        if(end.type === `empty` && this.#get_grid(start_point) === start){
            this.#entity_list.move_any(end_point, start);
            this.#set_grid(end_point, start);
            this.#set_grid(start_point, empty_tile());
            return true;
        }
        return false;
    }
    /**
     * Moves the player relative to their current location.
     * @param {Point} direction Relative movement.
     * @returns {boolean} Returns true if the player is moved, false otherwise.
     */
    player_move(direction){
        // Moves the player the given relative distance.
        var player_pos = this.#entity_list.get_player_pos();
        return this.move(player_pos, player_pos.plus(direction));
    }
    /**
     * Teleports something at a space relative to the player to a random location.
     * @param {Point} target Relative location.
     * @returns {boolean} Returns true if something was teleported, false otherwise.
     */
    player_teleport(target){
        // Moves the player the given relative distance.
        var player_pos = this.#entity_list.get_player_pos();
        var destination = this.random_empty();
        return this.move(player_pos.plus(target), destination);
    }
    /**
     * Returns the player tile. Throws an error if there isn't one.
     * @returns {Tile} The player tile.
     */
    get_player(){
        // Returns the player's health.
        var pos = this.#entity_list.get_player_pos();
        return this.#get_grid(pos);
    }
    /**
     * Attacks a point on the grid.
     * @param {Point} location Where to attack.
     * @param {string} [hits = `all`] Optional parameter for what type of tile the attack hits. By default it hits anything.
     * @returns {boolean} Returns true if the attack hit.
     */
    attack(location, hits = `all`){
        // Attacks the specified square.
        // hits specifes if the attacks only hits enemy, player or all tiles.
        // If an enemy dies, it's on_death effect will be triggered if applicable.
        // Throws an error if the location is out of bounds.
        // Returns true if damage was dealt.
        try{
            this.check_bounds(location);
        }
        catch(error){
            return false;
        }
        var target = this.#get_grid(location);
        if(target.health !== undefined && target.type !== `player` && (hits === `enemy` || hits === `all`)){
            target.health -= 1;
            this.#get_grid(location).is_hit = `${img_folder.tiles}hit.png`;
            if(target.on_hit !== undefined){
                var player_pos = this.#entity_list.get_player_pos();
                var hit_entity = {
                    tile: target,
                    location: location
                }
                var aggressor_info = { // TODO: when damage source is implemented, use that instead.
                    tile: this.get_player(),
                    difference: player_pos.minus(location)
                }
                target.on_hit(hit_entity, aggressor_info, this);
            }
            if(target.health <= 0){
                this.#set_grid(location, empty_tile());
                this.#get_grid(location).is_hit = `${img_folder.tiles}hit.png`;
                if(target.type === `enemy`){
                    if(target.id === undefined){
                        throw new Error(`enemy missing id`);
                    }
                    this.#entity_list.remove_enemy(target.id);
                }
                if(target.on_death !== undefined){
                    var player_pos = this.#entity_list.get_player_pos();
                    var dying_entity = {
                        tile: target,
                        location: location
                    }
                    var player_info = {
                        tile: this.get_player(),
                        difference: player_pos.minus(location)
                    }
                    target.on_death(dying_entity, player_info, this);
                }
            }
            return true;
        }
        if(target.type === `player` && (hits === `player` || hits === `all`)){
            if(target.health === undefined){
                throw new Error(`player missing health`);
            }
            target.health -= 1;
            this.#get_grid(location).is_hit = `${img_folder.tiles}hit.png`;
            if(target.health === 0){
                throw new Error(`game over`)
            }
            return true;
        }
        if(target.type === `empty`){
            target.is_hit = `${img_folder.tiles}hit.png`;
        }
        return false;
    }
    /**
     * Attacks relative to the player's location.
     * @param {Point} direction Relative direction of attack.
     * @returns {boolean} Returns true if the attack hits and false otherwise.
     */
    player_attack(direction){
        var pos = this.#entity_list.get_player_pos();
        try{
            return this.attack(pos.plus(direction), `all`);
        }
        catch (error){
            if(error.message !== `game over`){
                throw error;
            }
            throw new Error(`game over`, {cause: new Error(`player`)});
        }
    }
    /**
     * Each enemy takes their turn.
     * Throws an error if the player dies or is moved.
     * @returns {Promise<undefined>} Resolves when their turn is done.
     */
    async enemy_turn(){
        // Causes each enemy to execute their behavior.
        ++this.#turn_count;
        await this.#entity_list.enemy_turn(this);
    }
    /**
     * Displays the floor number and turn count.
     * @param {string} location Where they should be displayed.
     */
    display_stats(location){
        // Shows the current floor and turn number.
        display.display_message(location, `Floor ${this.#floor_num} Turn: ${this.#turn_count}`);
    }
    /**
     * Replaces the exit tile with a lock tile.
     * Throws an error if there is no exit.
     * @returns {void}
     */
    lock(){
        var pos = this.#entity_list.get_exit_pos();
        this.#set_grid(pos, lock_tile())
    }
    /**
     * Replaces the lock tile with an exit one and heals the player to max.
     * Throws an error if there is no lock or exit.
     * @returns {void}
     */
    unlock(){
        var pos = this.#entity_list.get_exit_pos();
        this.#set_grid(pos, exit_tile());
        var player = this.get_player();
        player.health = player.max_health;
    }
    /**
     * Schedules an event to happen at end of turn.
     * @param {MapEventFunction} event The even to be added.
     */
    add_event(event){
        this.#events.push(event);
    }
    /**
     * Executes and removes each scheduled event.
     * Throws an error if one that isn't handled tries to happen or the player dies.
     * @returns {void}
     */
    resolve_events(){
        var current_events = this.#events;
        this.#events = [];
        for(var event of current_events){
            event(this);
        }
    }
    /**
     * Clears the current floor and goes to the next one then generates it based on the current area.
     * @returns {void}
     */
    next_floor(){
        this.erase();
        var floor_description = `${floor_message}${this.#floor_num}.`;
        if(this.#floor_num % AREA_SIZE === 1){
            var next_list = this.#area.next_area_list;
            this.#area = next_list[random_num(next_list.length)]();
            floor_description = `${floor_description}\n${this.#area.description}`;
        }
        if(this.#floor_num % AREA_SIZE === 0 && this.#area.boss_floor_list.length > 0){
            var boss_floor = this.#area.boss_floor_list[random_num(this.#area.boss_floor_list.length)]; 
            var boss_message = boss_floor(this.#floor_num, this.#area, this);
            floor_description = `${floor_description}\n${boss_message}`;
        }
        else{
            this.#area.generate_floor(this.#floor_num, this.#area, this);
        }
        display.display_message(UIIDS.display_message, floor_description);
    }
    /**
     * Gets a tile from a location on the grid.
     * Throws an error if the location is out of bounds.
     * @param {Point} location The location of the tile.
     * @returns {Tile} The tile at that location
     */
    #get_grid(location){
        this.check_bounds(location);
        return this.#grid[location.y][location.x];
    }
    /**
     * Puts a tile at the given location.
     * t=Throws an error if the location is out of bounds.
     * @param {Point} location Where to put the tile.
     * @param {Tile} value The tile to place.
     */
    #set_grid(location, value){
        this.check_bounds(location);
        this.#grid[location.y][location.x] = value;
    }
    /**
     * Marks which positions an entity can attack during it's next turn.
     * @param {Point[]} positions A list of positions to mark.
     */
    display_telegraph(positions){
        for(var position of positions){
            if(this.is_in_bounds(position)){
                this.#get_grid(position).is_hit = `${img_folder.tiles}hit_telegraph.png`;
            }
        }
    }
    /**
     * Clears all hits and other alternate pics from empty tiles in the grid.
     * @returns {void}
     */
    clear_telegraphs(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                var tile = this.#get_grid(new Point(x, y));
                tile.is_hit = undefined;
            }
        }
    }
    /**
     * Function to mark a tile with a specific name, description and background.
     * @param {Point} location The location of the tile to mark.
     * @param {TileGenerator} mark Contains the fields to use.
     */
    mark_tile(location, mark){
        if(this.is_in_bounds(location)){
            shapeshift(this.#get_grid(location), mark, true);
        }
    }
    /**
     * Function to clear all marked empty tiles.
     * @returns {void}
     */
    clear_marked(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                var tile = this.#get_grid(new Point(x, y));
                if(tile.type === `empty`){
                    shapeshift(tile, empty_tile, true);
                }
            }
        }
    }
    /**
     * Function to stun the enemy at a given location.
     * @param {Point} location The location of the tile to stun.
     * @returns {boolean} If something was stunned.
     */
    stun_tile(location){
        try{
            var tile = this.#get_grid(location);
        }
        catch(error){
            if(error.message === `x out of bounds` || error.message === `y out of bounds`){
                return false;
            }
            throw error;
        }
        if(tile.type === `enemy`){
            stun(tile);
            return true;
        }
        return false;
    }
    /**
     * Function to stun the enemy at a place releative to the player.
     * @param {Point} direction The location of the tile to stun relative to the player.
     * @returns {boolean} If something was stunned.
     */
    player_stun(direction){
        var pos = this.#entity_list.get_player_pos();
        return this.stun_tile(pos.plus(direction));
    }
}// ----------------GameState.js----------------
// File containing a class to control the general flow of the game.


class GameState{
    /** @type {GameMap} The map of the current floor.*/
    map;
    /** @type {MoveDeck} The player's deck of cards.*/
    deck;
    constructor(){
        // Starts the game on load.
        this.setup();
    }
    /** 
     * Function to set up or reset the game.
     * @returns {void} 
     */
    setup(){
        // Function ran on page load or on restart to set up the game.
        var start = STARTING_AREA();
        display.display_message(UIIDS.display_message, `${start.description}\n${welcome_message}`);
        this.map = new GameMap(FLOOR_WIDTH, FLOOR_HEIGHT, start); 
        this.map.spawn_safely(STARTING_ENEMY(), SAFE_SPAWN_ATTEMPTS, true);
        this.map.display();
        this.map.display_stats(UIIDS.stats);
        this.deck = STARTING_DECK();
        this.deck.display_hand(UIIDS.hand_display);
        display.display_message(UIIDS.shop_instructions, mod_deck);
        display.swap_screen(DISPLAY_DIVISIONS, UIIDS.game_screen);
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.stage);
    }
    /** 
     * Handles the effects of using a card, then passes to the enemies' turn.
     * Takes the appropriate actions if
     *      -The floor is completed
     *      -The player dies
     *      -The enemies' turn ends early
     * @param {PlayerCommand[]} behavior A set of commands to be executed one by one.
     * @param {number} hand_pos The position of the card that the player used in their hand.
     */
    async player_turn(behavior, hand_pos){
        // Function to execute the outcome of the player's turn.
        display.display_message(UIIDS.display_message, ``);
        this.map.clear_marked();
        try{
            var is_instant = false;
            for(var i = 0; i < behavior.length; ++i){
                // Does each valid command in the behavior array.
                is_instant = this.player_action(behavior[i]);
            }
            display.clear_tb(UIIDS.move_buttons);
            this.deck.discard(hand_pos);
            this.map.display();
            await delay(ANIMATION_DELAY);
            if(is_instant){
                this.deck.display_hand(UIIDS.hand_display);
                this.map.display_stats(UIIDS.stats);
                this.map.display();
                return;
            }
            await this.map.enemy_turn();
            this.prep_turn();
        }
        catch (error){
            var m = error.message;
            if(m === `floor complete`){
                // If the player has reached the end of the floor.
                this.map.display_stats(UIIDS.stats);
                this.enter_shop();
            }
            else if(m === `game over`){
                // If the player's health reached 0
                this.game_over(error.cause.message);
            }
            else if(m === `pass to player`){
                // If the enemies' turn was interrupted,
                // prep for player's next turn.
                this.prep_turn();
            }
            else{
                throw error;
            }
        }
    }
    /**
     * Handles an individual action of the player.
     * Throws an error if a command of the wrong type is sent in.
     * @param {PlayerCommand} action The command to be followed.
     * @returns {boolean} returns true if the action was instant, false otherwise.
     */
    player_action(action){
        switch(action.type){
            case `attack`:
                this.map.player_attack(action.change);
                break;
            case `move`:
                this.map.player_move(action.change);
                break;
            case `teleport`:
                this.map.player_teleport(action.change);
                break;
            case `instant`:
                return true;
            case `stun`:
                this.map.player_stun(action.change);
                break;
            case `move_until`:
                while(this.map.player_move(action.change)){};
                break;
            default:
                throw new Error(`invalid player action type`);
        }
        return false;
    }
    /** 
     * Sets up the next floor then leaves the shop.
     * @returns {void} 
     */
    new_floor(){
        // Creates the next floor.
        this.map.next_floor();
        this.map.display_stats(UIIDS.stats);
        this.map.display();
        this.deck.deal();
        this.deck.display_hand(UIIDS.hand_display);
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.stage);
    }
    /** 
     * Preps and swaps to the shop screen.
     * @returns {void} 
     */
    enter_shop(){
        // Gives the player the option to add or remove a card from their deck.
        // Their deck contents are also displayed.
        // Options to remove cards will not be displayed if the deck is at the minimum size already.
        display.clear_tb(UIIDS.move_buttons);
        display.clear_tb(UIIDS.add_card);
        display.clear_tb(UIIDS.remove_card);
        display.clear_tb(UIIDS.display_deck);
        this.deck.display_all(UIIDS.display_deck);
        this.#generate_add_row(UIIDS.add_card);
        this.#generate_remove_row(UIIDS.remove_card);
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.shop);
    }
    /** 
     * Creates the row of cards that can be added to the deck.
     * @param {string} table The table where it should be displayed.
    */
    #generate_add_row(table){
        var add_list_generators = rand_no_repeates(CARD_CHOICES, ADD_CHOICE_COUNT);
        var chance_of_rare = random_num(4);
        if(chance_of_rare < add_list_generators.length){
            var rare = rand_no_repeates(RARE_CARD_CHOICES, 1);
            add_list_generators[chance_of_rare] = rare[0];
        }
        var add_list = [];
        for(var i = 0; i < add_list_generators.length; ++i){
            add_list[i] = add_list_generators[i]();
        }
        add_list.unshift(add_card_symbol())
        var make_add_card = function(gamestate){
            return function(card, position){
                if(position.x > 0){
                    gamestate.deck.add(card);
                    gamestate.new_floor();
                }
            }
        }
        display.add_tb_row(table, add_list, CARD_SCALE, make_add_card(this));
    }
    /** 
     * Creates the row of cards that can be removed from the deck.
     * @param {string} table The table where it should be displayed.
     * */
    #generate_remove_row(table){
        var remove_list = this.deck.get_rand_cards(REMOVE_CHOICE_COUNT);
        if(remove_list.length > 0){
            remove_list.unshift(remove_card_symbol());
        }
        else{
            remove_list.unshift(deck_at_minimum_symbol());
        }
        var make_remove_card = function(gamestate){
            return function(card, position){
                if(position.x > 0){
                    gamestate.deck.remove(card.id);
                    gamestate.new_floor();
                }
            }
        }
        display.add_tb_row(table, remove_list, CARD_SCALE, make_remove_card(this));
    }
    /**
     * Called when the player dies. Gives the option to restart.
     * @param {string} cause Cause of death.
     */
    game_over(cause){
        // Tells the user the game is over, prevents them fro m continuing, tells them the cause
        // and gives them the chance to retry.
        this.map.display();
        display.clear_tb(UIIDS.hand_display);
        display.clear_tb(UIIDS.move_buttons);
        display.display_message(UIIDS.display_message, `${game_over_message}${cause}.`);
        display.clear_tb(UIIDS.move_buttons);
        var restart = function(game){
            return function(message, position){
                display.clear_tb(UIIDS.move_buttons);
                game.setup();
            };
        }
        var restart_message = [{
            description: retry_message
        }]
        display.add_button_row(UIIDS.move_buttons, restart_message, restart(this));
    }
    /**
     * Adds a temporary card to the player's deck.
     * @param {Card} card The card to be added.
     */
    give_temp_card(card){
        this.deck.add_temp(card);
    }
    /** 
     * Sets up the player's turn.
     * @returns {Promise<void>}
     */
    async prep_turn(){
        this.map.resolve_events();
        this.map.display();
        await delay(ANIMATION_DELAY);
        this.map.display();
        this.deck.display_hand(UIIDS.hand_display);
        this.map.display_stats(UIIDS.stats);
    }
}


// ----------------GeneralUtil.js----------------
// File for utility functions not connected to any specific project.

/**
 * Function to wait a set amount of time before continuing.
 * @param {number} milliseconds How long to wait in milliseconds.
 * @returns {Promise<*>} Resolves when the time is up.
 */
function delay(milliseconds){
    // Function to wait the given number of milliseconds.
    return new Promise(resolve =>{
        setTimeout(resolve, milliseconds);
    })
}
/**
 * Searches an array for an element.
 * @template T
 * @param {T} element The element to find.
 * @param {T[]} arr The array to search.
 * @returns {number} The index of the element, or -1 if it isn't found.
 */
function search(element, arr){
    for(var i = 0; i < arr.length; ++i){
        if(element === arr[i]){
            return i;
        }
    }
    return -1;
}
/**
 * Creates an array by drawing random elements from another with no repeats.
 * @template T
 * @param {T[]} source Array to draw from.
 * @param {number} draws Number of draws. If it is larger than source.length, then source.length will be used instead.
 * @returns {T[]} Array of random draws.
 */
function rand_no_repeates(source, draws){
    var index_arr = [];
    var result = [];
    draws = Math.min(draws, source.length);
    for(var i = 0; i < source.length; ++i){
        index_arr.push(i);
    }
    for(var i = 0; i < draws; ++i){
        var rand = random_num(index_arr.length);
        result.push(source[index_arr[rand]]);
        index_arr[rand] = index_arr[index_arr.length - 1];
        index_arr.pop();
    }
    return result;
}
/**
 * Wraps a string so each line has a maximum number of characters before automatically inserting a newline character.
 * @param {string} message The string to be wrapped.
 * @param {number} wrap_length How many characters maximum.
 * @param {string} [delimiter = undefined] Optional parameter for the delimiter. 
 *                                      If provided, then blocks of text in between delimiters will not be broken up.
 * @returns {string} The wrapped string.
 */
function wrap_str(message, wrap_length, delimiter = undefined){
    var new_message = ``;
    var str_arr = [];
    if(message.indexOf(`\n`) > -1){ // If it already has new line characters, 
        str_arr = message.split(`\n`);
        for(var i = 0; i < str_arr.length; ++i){
            new_message = `${new_message}${wrap_str(str_arr[i], wrap_length, delimiter)}\n`
        }
    }
    else if(delimiter === undefined){ // if there is no delimiter
        var start = 0;
        while(start < message.length){
            var end = Math.min(message.length, start + wrap_length);
            str_arr.push(message.slice(start, end));
            start = end;
        }
        for(var i = 0; i < str_arr.length; ++i){
            new_message = `${new_message}${str_arr[i]}\n`
        }
    }
    else{ // if there is a delimiter
        str_arr = message.split(delimiter);
        var line = ``
        for(var i = 0; i < str_arr.length; ++i){
            line = `${line}${str_arr[i]}${delimiter}`;
            if(line.length > wrap_length){
                new_message = `${new_message}${line.slice(0, -1 * delimiter.length)}\n`
                line = ``;
            } 
        }
        if(line.length > 0){
            new_message = `${new_message}${line.slice(0, -1 * delimiter.length)}\n`
        } 
    }
    return new_message.slice(0, -1);
}
/**
 * @overload Returns 1 if num is positive, -1 if it is negative, 0 if it is 0.
 * @param {number} num
 * @return {number}
 * 
 * @overload Returns a new point with it's x and y the sign of the one passed in.
 * @param {Point} num
 * @return {Point}
 * 
 * @param {*} num
 * @returns {*}
 */
function sign(num){
    // Returns whether num is positive, negative, or 0
    if(typeof num === `number`){
        if(num > 0){
            return 1;
        }
        if(num < 0){
            return -1;
        }
        return 0;
    }
    else{
        return new Point(sign(num.x), sign(num.y));
    }
}
/**
 * @returns {number} randomly returns 1 or -1.
 */
function random_sign(){
    return 2 * random_num(2) - 1;
}
/**
 * Function to return a copy of a array with it's order randomized.
 * @template T
 * @param {T[]} arr Array to randomize.
 * @returns {T[]} Randomized copy.
 */
function randomize_arr(arr){
    // Returns a copy of the given array with it's order randomized.
    arr = copy_arr(arr);
    var random_arr = [];
    while(arr.length > 0){
        var index = random_num(arr.length);
        random_arr.push(arr[index]);
        arr[index] = arr[arr.length - 1];
        arr.pop();
    }
    return random_arr;
}
/** 
 * Function to return a copy of an array.
 * @template T
 * @param {T[]} arr Array to copy.
 * @returns {T[]} Copy of the array.
 */
function copy_arr(arr){
    //returns a copy of the given array.
    var arr2 = [];
    for(var i = 0; i < arr.length; ++i){
        arr2[i] = arr[i];
    }
    return arr2;
}
/**
 * Function to return a copy of an array with it's order reversed.
 * @template T
 * @param {T[]} arr Array to be reversed.
 * @returns {T[]} Reversed array.
 */
function reverse_arr(arr){
    var new_arr = [];
    for(var i = arr.length - 1; i >= 0; --i){
        new_arr.push(arr[i]);
    }
    return new_arr;
}
/**
 * Function to return a random integer 0 <= r < x
 * @param {number} x The return should be less than this.
 * @returns {number} The random number.
 */
function random_num(x){
    return Math.floor(Math.random() * x);
}
/**
 * Function to check if the contents of two arrays are ===.
 * @param {[]} a1 The first array to be compared.
 * @param {[]} a2 the second array to be compared.
 * @returns {boolean} Returns true if the elements at each index in both arrays === the element at the same index of the other.
 */
function array_equals(a1, a2){
    if(!(a1.length === a2.length)){
        return false;
    }
    for(var i = 0; i < a1.length; ++i){
        if(!(a1[i] === a2[i])){
            return false;
        }
    }
    return true;
}
// ----------------GuideText.js----------------
// This file contains the headers and text for the guide / tutorial section.

const GUIDE_HEADERS = {
    basics: `The Basics`,
    cards: `Playing Your Cards`,
    enemies: `Dealing With Enemies`,
    shop: `The Shop`,
    bosses: `Bosses`,
}
Object.freeze(GUIDE_HEADERS);

const GUIDE_TEXT = {
    basics: [`Welcome to Maneuver. The goal of the game is to progress as deep into the dungeon as possible by completing each floor. `
            +`To finish a floor, you need to reach the stairs that lead down to the next one. Enemies will spawn on each floor which will `
            +`try to stop you from continuing. You do not need to defeat everything on the current floor to continue, but will often need to `
            +`fight most of them to survive. Read more about controlling your character in the next section. Good luck!\n\n`],

    cards: [`To control your character's actions, you have a deck of cards. Each card gives you 1-4 options for a set of actions `
            +`to take. The actions on the card will be performed relative to your current location (the black dot). Clicking on a card will `
            +`bring up a grid of buttons which will let you use it. When you use a card, it will be discarded and replaced with another from your `
            +`deck. Then everything else on the floor will get a chance to act (read more in the next section). When your deck runs out, your `
            +`discard pile will be shuffled back into it.\n`
            +`\n`
            +`Colors and symbols that make up a card:\n`,
                ` Your relative starting location.\n`,
                ` You will attack this space.\n`,
                ` You will move to this space.\n`,
                ` You will stun the enemy on this space.\n`,
                ` Each action the line goes through will be performed.\n`,
                ` Multiple actions will be performed in a specific order.\n`,
                ` Multiple actions of the same stype will be performed until one fails.\n`,
                `  `,    ` Multiple actions will be performed on the same space. Moves will be performed last.\n`,
                ` A card with a purple grid will be performed instantly.\n`,
                ` A card with a this background is temporary. It will be removed from your deck when you use it or when the floor ends.\n`
            +`\n`
            +`In addition to clicking on cards to use them, you can use the keys\n`,
                ` `, ` `, `\n`
            +`to select a card and\n`,
                ` `, ` `, `\n`,
                ` `, ` `, `\n`,
                ` `, ` `, `\n`
            +`to use it.\n`
            +`\n`
            +`Moving into a wall or an occupied space has no effect unless it is specified in the description of the destination space. `
            +`If other actions are performed after a failed move, they will be performed where you are rather than where you would have `
            +`been.\n\n`],

    enemies: [`As you travel through the dungeon, you will encounter various other creatures, many of whom want to kill you. Each creature has `
            +`different patterns of attack and movement and many of them have other unique abilities. Click on a tile to learn more about it. `
            +`Clicking will show you a description of it, how much health it has, and which squares it might be able to attack on it's next `
            +`turn. Some enemies also have the ability to move you during their turn. When this happens, you will get the chance to respond.\n`
            +`Remember that you do not need to kill everything to go to the next stage. Sometimes it's better to run past an enemy than to `
            +`fight it and risk getting surrounded or cornered. There may also be some creatures you encounter that are more helpful than `
            +`harmful.\n`
            +`Some effects will cause an enemy to become stunned. Stunned enemies will skip their next turn. Multiple instances of stun `
            +`will cause multiple turns to get skipped.\n\n`],

    shop: [`When you complete a floor, you will enter a shop where you must either add or remove a card from your deck. You will get `
            +`${ADD_CHOICE_COUNT} options of random cards to add, and ${REMOVE_CHOICE_COUNT} options of random cards from your deck to remove. `
            +`The current contents of your deck will be shown to help you choose. There is a minimum deck size of ${MIN_DECK_SIZE}, `
            +`so if you reach it you will not be able to remove more cards.\n`
            +`Some enemies or effects may add temporary cards to your deck. They will go away after you play them or go to the next `
            +`floor.\n\n`],

    bosses: [`Every ${AREA_SIZE} floors, you will encounter a boss floor. The stairs out of this floor will be locked until you defeat it's `
            +`powerful occupant. When you defeat the boss, in addition to unlocking the stairs, you will be fully healed. When leaving the floor `
            +`you will enter a new area of the dungeon with a different pool of inhabitants and a new boss at the end.\n\n`],
}
Object.freeze(GUIDE_TEXT);

const CARD_SYMBOLS = [
    {src: `${img_folder.symbols}you.png`,               x: 1, y: 1},
    {src: `${img_folder.symbols}attack.png`,            x: 1, y: 1},
    {src: `${img_folder.symbols}move.png`,              x: 1, y: 1},
    {src: `${img_folder.symbols}stun.png`,              x: 1, y: 1},
    {src: `${img_folder.symbols}multiple.png`,          x: 3, y: 1},
    {src: `${img_folder.symbols}multiple_ordered.png`,  x: 3, y: 1},
    {src: `${img_folder.symbols}move_until.png`,  x: 4, y: 1},
    {src: `${img_folder.symbols}attack_move.png`,       x: 1, y: 1},
    {src: `${img_folder.symbols}triple_attack.png`,     x: 1, y: 1},
    {src: `${img_folder.symbols}instant.png`,         x: 2, y: 2},
    {src: `${img_folder.symbols}temporary.png`,         x: 2, y: 2}
];




/**
 * Initiates the game when the page is loaded.
 * @returns {void}
 */
function initiate_game(){
    display.display_message(UIIDS.title, `${game_title}    `);
    create_main_dropdown(UIIDS.title);
    display_guide(UIIDS.guide);
    GS = new GameState();
}


// Deck Creation
/** @returns {MoveDeck} Returns a normal starting deck.*/
function make_starting_deck(){
    var deck = new MoveDeck();

    deck.add(basic_horizontal());
    deck.add(basic_horizontal());
    deck.add(basic_diagonal());
    deck.add(basic_diagonal());
    deck.add(slice());
    deck.add(slice());
    deck.add(short_charge());
    deck.add(jump());

    deck.deal();
    return deck;
}
// Makes a deck for testing new cards.
/** @returns {MoveDeck} Returns a custom deck for testing.*/
function make_test_deck(){
    var deck = new MoveDeck();
    var start = 11 * 5;
    for(var i = start; i < start + 5 && i < CARD_CHOICES.length; ++i){
        deck.add(CARD_CHOICES[i]());
    }
    deck.add(bite());
    deck.add(skitter());
    deck.add(instant_teleport());
    deck.add(debilitating_confusion());
    deck.add(roll_ew());
    deck.add(roll_nesw());
    deck.add(roll_nwse());

    deck.add(basic_horizontal());
    deck.add(basic_horizontal());

    deck.deal();
    return deck;
}



// AI utility functions
/**
 * stuns a tile by incrementing it's stun property. Adds the property first if necessary.
 * @param {Tile} tile The tile to stun.
 * @param {number} [amount = 1] Optional parameter for the amount of stun to add. Default is 1.
 */
function stun(tile, amount = 1){
    // Increases a tile's stun.
    if(tile.stun === undefined){
        tile.stun = 0;
    }
    tile.stun += amount;
}
/**
 * Used by a fireball tile to set the correct direction, rotation and picture.
 * @param {Tile} tile The tile to set the direction of.
 * @param {Point} direction Ehich way it should face.
 */
function set_direction(tile, direction){
    if( tile.pic_arr === undefined ||
        tile.rotate === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    tile.direction = direction;
    if(direction.within_radius(0)){
        tile.rotate = 90 * (Math.abs((direction.x * -2 + 1)) + direction.y);
        tile.pic = tile.pic_arr[0];
    }
    else{
        tile.rotate= 90 * ((direction.x + direction.y) / 2 + 1);
        if(direction.x === -1 && direction.y === 1){
            tile.rotate = 90 * 3;
        }
        tile.pic = tile.pic_arr[1];
    }
}
/**
 * @returns {Point[]} Returns a randomized array of points around (0, 0).
 */
function random_nearby(){
    // Returns an array of each point next to [0, 0] with it's order randomized.
    var cords = [
        new Point(-1, -1),
        new Point(-1, 0),
        new Point(-1, 1),
        new Point(0, -1),
        new Point(0, 1),
        new Point(1, -1),
        new Point(1, 0),
        new Point(1, 1)];
    return randomize_arr(cords);
}
/**
 * Gets a randomized array of points around (0, 0) ordered by how close they are to the given point.
 * @param {Point} direction The point to sort by.
 * @returns {Point[]} The resulting array.
 */
function order_nearby(direction){
    // Returns an array with points ordered from the nearest to the furthest from the given direction. 
    // Equal distance points are randomly ordered.
    var sign_dir = sign(direction);
    var ordering = [];
    ordering.push(sign_dir);
    if(sign_dir.x === 0){
        // Target is along the vertical line.
        var pair = randomize_arr([new Point(1, sign_dir.y), new Point(-1, sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(1, 0), new Point(-1, 0)])
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(1, -1 * sign_dir.y), new Point(-1, -1 * sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
    }
    else if(sign_dir.y === 0){
        // Target is along the horizontal line.
        var pair = randomize_arr([new Point(sign_dir.x, 1), new Point(sign_dir.x, 1)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(0, 1), new Point(0, -1)])
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(-1 * sign_dir.x, 1), new Point(-1 * sign_dir.x, -1)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
    }
    else if(Math.abs(direction.x) > Math.abs(direction.y)){  
        // Target is closer to the horizontal line than the vertical one.
        ordering.push(new Point(sign_dir.x, 0));
        ordering.push(new Point(0, sign_dir.y));
        ordering.push(new Point(sign_dir.x, -1 * sign_dir.y));
        ordering.push(new Point(-1 * sign_dir.x, sign_dir.y));
        ordering.push(new Point(0, -1 * sign_dir.y));
        ordering.push(new Point(-1 * sign_dir.x, 0));
    }
    else if(Math.abs(direction.x) < Math.abs(direction.y)){
        // Target is closer to the vertical line than the horizontal one one.
        ordering.push(new Point(0, sign_dir.y));
        ordering.push(new Point(sign_dir.x, 0));
        ordering.push(new Point(-1 * sign_dir.x, sign_dir.y));
        ordering.push(new Point(sign_dir.x, -1 * sign_dir.y));
        ordering.push(new Point(-1 * sign_dir.x, 0));
        ordering.push(new Point(0, -1 * sign_dir.y));
    }
    else{
        // Target is along the diagonal.
        var pair = randomize_arr([new Point(sign_dir.x, 0), new Point(0, sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(-1 * sign_dir.x, sign_dir.y), new Point(sign_dir.x, -1 * sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(-1 * sign_dir.x, 0), new Point(0, -1 * sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
    }
    ordering.push(new Point(-1 * sign_dir.x, -1 * sign_dir.y));
    return ordering;

}
/**
 * Function to get the first non empty location near a given location.
 * @param {Point} location The point to search around.
 * @param {Point[]} nearby_arr The array of relative locations to search.
 * @param {GameMap} map The map to search on.
 * @returns {Point | undefined} Returns an empty location if one is found and undefined otherwise.
 */
function get_empty_nearby(location, nearby_arr, map){
    for(var i = 0; i < nearby_arr.length; ++i){
        if(map.check_empty(location.plus(nearby_arr[i]))){
            return nearby_arr[i];
        }
    }
    return undefined;
}
/**
 * Counts how many locations next to the given one are not empty.
 * @param {Point} location The point to search around.
 * @param {GameMap} map The map to search.
 * @returns {number} The number of nearby occupied locations.
 */
function count_nearby(location, map){
    var count = 0;
    var nearby = random_nearby();
    for(var i = 0; i < nearby.length; ++i){
        if(!map.check_empty(location.plus(nearby[i]))){
            ++count;
        }
    }
    return count;
}
/**
 * A function to add a Tile to the game map at a position next to this one.
 * @param {GameMap} map The map to add the tile to.
 * @param {Tile} tile The tile to add.
 * @param {Point} location The point to spawn near.
 * @param {Point[]=} nearby Array of relative locations to spawn from randomly.
 *                            If not provided, it will choose from a randomized array of locations next to the given one.
 * @returns {Point | undefined} Returns the location of the new tile if it was successfully added, or undefined if no spaces were available.
 */
function spawn_nearby(map, tile, location, nearby = random_nearby()){
    // Attempts to spawn a <tile> at a space next to to the given cords.
    // If it succeeds, returns the location, otherwise returns false.
    for(var i = 0; i < nearby.length; ++i){
        if(map.add_tile(tile, location.plus(nearby[i]))){
            return nearby[i];
        }
    }
    return undefined;
}

/**
 * Function to attack all spaces around the current location.
 * @param {Point} location The square to attack around.
 * @param {GameMap} map The map to make attacks using.
 */
function attack_around(location, map){
    for(var direction of all_directions){
        map.attack(location.plus(direction));
    }
}


// misc display functions
/**
 * Function to create the full description including
 *      -stun amount
 *      -health
 *      -max health
 * when appropriate.
 * @param {Tile} tile Tile to make the description for.
 * @returns {string} The formatted description.
 */
function tile_description(tile){
    if(tile.description === undefined){
        throw new Error(`tile missing description`);
    }
    var hp = ``
    var stunned = ``;
    if(tile.max_health !== undefined && tile.health !== undefined){
        hp = `(${tile.health}/${tile.max_health} hp) `;
    }
    else if(tile.health !== undefined){
        hp = `(${tile.health} hp) `;
    }
    if(tile.stun !== undefined && tile.stun > 0){
        stunned = `*${stunned_msg}${tile.stun}* `;
    }
    return `${hp}${stunned}${tile.description}`;
}
/**
 * Function to display the player's current and max health.
 * @param {Tile} player The player to get health from.
 * @param {number} scale The size of the display images.
 */
function display_health(player, scale){
    if(player.health === undefined || player.max_health === undefined){
        throw new Error(`player missing health`);
    }
    var health = [];
    for(var i = 0; i < player.health; ++i){
        health.push({pic: `${img_folder.other}heart.png`});
    }
    for(var i = 0; i < (player.max_health - player.health); ++i){
        health.push({pic: `${img_folder.other}heart_broken.png`});
    }
    display.add_tb_row(UIIDS.health_display, health, scale);
}
/**
 * Function to create a dropdown menu capable of switching between the game and guide screens.
 * @param {string} location Where to create it.
 */
function create_main_dropdown(location){
    var options = [];
    var make_on_change = function(screens, screen){
        return function(){
            display.swap_screen(screens, screen);
        }
    }
    if(DISPLAY_DIVISION_NAMES.length !== DISPLAY_DIVISIONS.length){
        throw new Error("list length mismatch");
    }
    for(var i = 0; i < DISPLAY_DIVISIONS.length; ++i){
        var option = {
            label: DISPLAY_DIVISION_NAMES[i],
            on_change: make_on_change(DISPLAY_DIVISIONS, DISPLAY_DIVISIONS[i])
        }
        options.push(option);
    }
    display.create_dropdown(location, options);
}
/**
 * Function to display the guide.
 * @param {string} location Where to display it to.
 */
function display_guide(location){
    var cards_symbol_arr = get_card_symbols();
    var ctrl_symbol_arr = get_control_symbols();
    var cards_inline_arr = cards_symbol_arr.concat(ctrl_symbol_arr)

    var basics_section = display.create_alternating_text_section(GUIDE_HEADERS.basics, GUIDE_TEXT.basics, []);
    var cards_section = display.create_alternating_text_section(GUIDE_HEADERS.cards, GUIDE_TEXT.cards, cards_inline_arr);
    var enemies_section = display.create_alternating_text_section(GUIDE_HEADERS.enemies, GUIDE_TEXT.enemies, []);
    var shop_section = display.create_alternating_text_section(GUIDE_HEADERS.shop, GUIDE_TEXT.shop, []);
    var bosses_section = display.create_alternating_text_section(GUIDE_HEADERS.bosses, GUIDE_TEXT.bosses, []);

    display.create_visibility_toggle(location, GUIDE_HEADERS.basics, basics_section);
    display.create_visibility_toggle(location, GUIDE_HEADERS.cards, cards_section);
    display.create_visibility_toggle(location, GUIDE_HEADERS.enemies, enemies_section);
    display.create_visibility_toggle(location, GUIDE_HEADERS.shop, shop_section);
    display.create_visibility_toggle(location, GUIDE_HEADERS.bosses, bosses_section);
}

/**
 * Function to get an array of images for the card symbols to use when displaying the guide..
 * @returns {HTMLElement[]} The array of images.
 */
function get_card_symbols(){
    var images = [];
    for(var img of CARD_SYMBOLS){
        images.push(display.create_image(img.src, `${img.src} symbol`, new Point(img.x, img.y).times(CARD_SYMBOL_SCALE)));
    }
    return images;
}
/**
 * Function to get an array of buttons with the keys used for controls as the velue to use when displaying the guide.
 * @returns {HTMLElement[]} The array of buttons.
 */
function get_control_symbols(){
    var button_symbols = controls.card.concat(controls.directional);
    var buttons = [];
    for(var symbol of button_symbols){
        buttons.push(display.create_button(symbol, `${symbol} key`));
    }
    return buttons;
}
function add_card_to_chest(chest, card){
    var content = {
        pic: card.pic,
        on_choose: function(){
            GS.deck.add(card);
        },
        description: add_card_description
    }
    chest.contents.push(content);

}
// ----------------MoveDeck.js----------------
// The MoveDeck class contains the player's current deck of move cards.

class MoveDeck{
    /** @type {Card[]} The array of all cards they have.*/
    #decklist; // .
    /** @type {Card[]} The array of cards in their draw pile.*/
    #library; // 
    /** @type {Card[]} The array of cards curently usable.*/
    #hand; // 
    /** @type {Card[]} The array of cards they have used since they reshuffled.*/
    #discard_pile;
    /** @type {number} Used to give each card a unique id.*/
    #id_count;
    constructor(){
        this.#decklist = [];
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        this.#id_count = 0;
    }
    /**
     * Resets the deck to the decklist then deals a new hand.
     * @returns {void}
     */
    deal(){
        // Shuffles all cards together then deals a new hand.
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        for(var i = 0; i < this.#decklist.length; ++i){
            this.#library.push(this.#decklist[i]);
        }
        this.#library = randomize_arr(this.#library);
        for(var i = 0; i < HAND_SIZE; ++i){
            var top_card = this.#library.pop();
            if(top_card !== undefined){
                this.#hand.push(top_card);
            }
        }
    }
    /**
     * Discards the card at the given position in the hand, then draws a new one.
     * @param {number} hand_pos The position of the card which should be discarded.
     */
    discard(hand_pos){
        // Makes player discard the card at position x from their hand and draw a new one. 
        // If the library is empty, it will first shuffle in the discard. 
        // Throws an error if x doens't correspond to a card in hand.
        if(hand_pos >= this.#hand.length || hand_pos < 0){
            throw new Error(`hand out of bounds`);
        }
        if(this.#library.length === 0){
            var top_discard = this.#discard_pile.pop();
            while(top_discard !== undefined){
                this.#library.push(top_discard);
                top_discard = this.#discard_pile.pop();
            }
            this.#library = randomize_arr(this.#library);
        }
        if(!(this.#hand[hand_pos].temp !== undefined && this.#hand[hand_pos].temp === true)){
            this.#discard_pile.push(this.#hand[hand_pos]);
        }
        var top_card = this.#library.pop();
        if(top_card !== undefined){
            this.#hand[hand_pos] = top_card;
        }
    }
    /**
     * Adds a new card to the decklist.
     * @param {Card} new_card Card to add.
     */
    add(new_card){
        new_card.id = this.#id_count;
        this.#id_count++;
        this.#decklist.push(new_card);
        this.#library.push(new_card);
        this.#library = randomize_arr(this.#library);
    }
    /**
     * Adds a new card to the library after giving it a temp tag.
     * Temp cards are removed when deal is called (at the end of the floor) or when used.
     * @param {Card} new_card Card to add.
     */
    add_temp(new_card){
        new_card.id = this.#id_count;
        new_card.temp = true;
        this.#id_count++;
        this.#library.push(new_card);
        this.#library = randomize_arr(this.#library);
    }
    /**
     * Displays the hand.
     * @param {string} table Where it should be dispalyed.
     */
    display_hand(table){
        // Displays the hand to the given table.
        display.clear_tb(table);
        var make_prep_move = function(deck){
            return function(card, hand_pos){
                display.select(UIIDS.hand_display, 0, hand_pos.x);
                card.options.show_buttons(UIIDS.move_buttons, hand_pos.x);
                var deck = deck;
            }
        }
        var card_background = function(tile, location){
            var backgrounds = [];
            if(tile.temp){
                backgrounds.push(`${img_folder.other}temporary_background.png`)
            }
            else{
                backgrounds.push(`${img_folder.other}default_card_background.png`)
            }
            return backgrounds;
        }
        display.add_tb_row(table, this.#hand, CARD_SCALE, make_prep_move(this), card_background);
    }
    /**
     * Displays the whole decklist
     * @param {string} table Where it should be displayed.
     */
    display_all(table){
        display.display_message(UIIDS.current_deck, `${current_deck}${MIN_DECK_SIZE}):`)
        for(var i = 0; i < Math.ceil(this.#decklist.length / DECK_DISPLAY_WIDTH); ++i){
            display.add_tb_row(table, this.#decklist.slice(i * DECK_DISPLAY_WIDTH, (i + 1) * DECK_DISPLAY_WIDTH), CARD_SCALE)
            
        }
    }
    /**
     * Gets a random array of cards from the decklist with no repeats.
     * If the decklist is at minimum size, returns an empty array instead.
     * @param {number} size number of cards to get.
     * @returns {Card[]} The array of random cards.
     */
    get_rand_cards(size){
        if(this.#decklist.length <= MIN_DECK_SIZE){
            return [];
        }
        return rand_no_repeates(this.#decklist, size);
    }
    /**
     * Removes a card from the decklist.
     * @param {number} id The ID of the card to remove.
     * @returns {boolean} Returns true if the card was removed and false otherwise.
     */
    remove(id){
        // Removes the card with the given id from the deck.
        // Returns false if it could not be found.
        for(var i = 0; i < this.#decklist.length; ++i){
            if(this.#decklist[i].id === id){
                this.#decklist[i] = this.#decklist[this.#decklist.length - 1];
                this.#decklist.pop();
                return true;
            }
        }
        return false;
    }
}
// ----------------Point.js----------------
// File contains Point class and associated functions.

/**
 * @callback PointOp Function that simulates a binary operation between this point a point or number passed in.
 * @param {Point | number} p2 The other operand.
 *                      If p2 is a Point, the operation will be performed by matching their respective x and y values,
 *                      If p2 is a number, it will be used wherever either p2.x or p2.y would be used.
 * @returns {Point} Returns the resulting point.
 */

class Point{
    /** @type {number} The x value of the point. */
    x;
    /** @type {number} The y value of the point. */
    y;
    /**
     * @param {number} x The x value of the new point.
     * @param {number} y The y value of the new point.
     */
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    /** @type {PointOp} Returns this + p2, which is a new point*/
    plus(p2){
        return this.copy().plus_equals(p2);
    }
    /** @type {PointOp} Does this = this + p2, then returns this.*/
    plus_equals(p2){
        if(typeof p2 === `number`){
            this.x += p2;
            this.y += p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            this.x += p2.x;
            this.y += p2.y;
            return this
        }
        else{
            throw Error(`invalid type`);
        }
    }
    /** @type {PointOp} Returns this - p2, which is a new point*/
    minus(p2){
        return this.copy().minus_equals(p2);
    }
    /** @type {PointOp} Does this = this - p2, then returns this.*/
    minus_equals(p2){
        if(typeof p2 === `number`){
            this.x -= p2;
            this.y -= p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            this.x -= p2.x;
            this.y -= p2.y;
            return this
        }
        else{
            throw Error(`invalid type`);
        }
    }
    /** @type {PointOp} Returns this * p2, which is a new point*/
    times(p2){
        return this.copy().times_equals(p2);
    }
    /** @type {PointOp} Does this = this * p2, then returns this.*/
    times_equals(p2){
        if(typeof p2 === `number`){
            this.x *= p2;
            this.y *= p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            this.x *= p2.x;
            this.y *= p2.y;
            return this
        }
        else{
            throw Error(`invalid type`);
        }
    }
    /**
     * Function to check if a point's x and y values both have an absolute value <= radius.
     * @param {number} radius How far away from 0 x and y can be.
     * @returns {boolean} If the point is <= radius far from (0, 0).
     */
    within_radius(radius){
        return Math.abs(this.x) <= radius && Math.abs(this.y) <= radius;
    }
    /** @returns {Point} Returns a copy of this point.*/
    copy(){
        return new Point(this.x, this.y);
    }
    taxicab_distance(){
        return Math.abs(this.x) + Math.abs(this.y);
    }
}

/**
 * Checks to see if 2 points are equal.
 * @param {Point} p1 The first point to compare.
 * @param {Point} p2 The second point to compare.
 * @returns  {boolean} If the points are equal.
 */
function point_equals(p1, p2){
    if(p1.x !== undefined && p1.y !== undefined && p2.x !== undefined && p2.y !== undefined){
        return p1.x === p2.x && p1.y === p2.y;
    }
    else{
        throw Error(`invalid type`);
    }
}

/**
 * Adds each element in one point array to each eelment in another or a number array.
 * Throws an error if their length doesn't match.
 * @param {Point[]} a1 The point array being added to.
 * @param {Point[] | number[]} a2 The point or number array to add to it.
 * @returns  {Point[]} The resulting point array.
 */
function add_point_arr(a1, a2){
    if(a1.length != a2.length){
        throw new Error(`unequal array lengths`);
    }
    var sum_arr = [];
    for(var i = 0; i < a1.length; ++i){
        sum_arr.push(a1[i].plus(a2[i]));
    }
    return sum_arr;
}

/**
 * Adds a point or number to each element in a point array.
 * @param {Point[]} arr The point array being added to.
 * @param {Point | number} pt The point or number to add to it.
 * @returns  {Point[]} The resulting point array.
 */
function add_to_point_arr(arr, pt){
    var sum_arr = [];
    for(var i = 0; i < arr.length; ++i){
        sum_arr.push(arr[i].plus(pt));
    }
    return sum_arr;
}// ----------------TelegraphAttacks.js----------------
// Contains functions to get the points that a enemy could attack on it's next turn.

const horizontal_directions = [new Point(1, 0), new Point(-1, 0), new Point(0, -1), new Point(0, 1)];
const diagonal_directions = [new Point(1, 1), new Point(-1, 1), new Point(1, -1), new Point(-1, -1)];
const all_directions = horizontal_directions.concat(diagonal_directions);

/**
 * @callback TelegraphFunction Function to get the points that a entity can attack on it's next turn.
 * @param {Point} location Where the entity currently is.
 * @param {GameMap} map The map it's in.
 * @param {Tile} self Info about the entity.
 * @returns {Point[]} An array of the points on the map it could currently attack.
 */

/** @type {TelegraphFunction} */
function fireball_telegraph(location, map, self){
    if(self.direction === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    return [location.plus(self.direction)].concat(hazard_telegraph(location, map, self));
}
/** @type {TelegraphFunction} */
function spider_telegraph(location, map, self){
    return add_to_point_arr(all_directions, location);
}
/** @type {TelegraphFunction} */
function turret_h_telegraph(location, map, self){
    var attacks = [];
    for(var direction of horizontal_directions){
        attacks = attacks.concat(get_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function turret_d_telegraph(location, map, self){
    var attacks = [];
    for(var direction of diagonal_directions){
        attacks = attacks.concat(get_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function turret_r_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    var attacks = [];
    
    switch(self.cycle){
        case 0:
            // Adds N and S.
            attacks = attacks.concat(get_points_in_direction(location, new Point(0, -1), map));
            attacks = attacks.concat(get_points_in_direction(location, new Point(0, 1), map));
            break;
        case 1:
            // Adds NE and SW.
            attacks = attacks.concat(get_points_in_direction(location, new Point(1, -1), map));
            attacks = attacks.concat(get_points_in_direction(location, new Point(-1, 1), map));
            break;
        case 2:
            // Adds E and W.
            attacks = attacks.concat(get_points_in_direction(location, new Point(-1, 0), map));
            attacks = attacks.concat(get_points_in_direction(location, new Point(1, 0), map));
            break;
        case 3:
            // Adds SE and NW.
            attacks = attacks.concat(get_points_in_direction(location, new Point(1, 1), map));
            attacks = attacks.concat(get_points_in_direction(location, new Point(-1, -1), map));
            break;
        default:
            throw new Error(`Improper case for ${self.name}`);
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function scythe_telegraph(location, map, self){
    var attacks = [];
    for(var direction of diagonal_directions){
        var current = location.copy();
        for(var i = 0; i < 3 && map.check_empty(current.plus_equals(direction)); ++i){
            attacks.push(current.plus(direction.times(new Point(-1, 0))));
            attacks.push(current.plus(direction.times(new Point(0, -1))));
        }
    }
    return attacks;
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
/** @type {TelegraphFunction} */
function ram_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    if(self.cycle === 0){
        return [];
    }
    return turret_h_telegraph(location, map, self);
}
/** @type {TelegraphFunction} */
function large_porcuslime_telegraph(location, map, self){
    return porcuslime_diagonal_telegraph(location, map, self).concat(porcuslime_horizontal_telegraph(location, map, self));
}
/** @type {TelegraphFunction} */
function medium_porcuslime_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    if(self.cycle === 0){
        return porcuslime_horizontal_telegraph(location, map, self);
    }
    return porcuslime_diagonal_telegraph(location, map, self);
}
/** @type {TelegraphFunction} */
function porcuslime_diagonal_telegraph(location, map, self){
    return move_attack_telegraph(location, map, diagonal_directions).concat(hazard_telegraph(location, map, self));
}
/** @type {TelegraphFunction} */
function porcuslime_horizontal_telegraph(location, map, self){
    return move_attack_telegraph(location, map, horizontal_directions).concat(hazard_telegraph(location, map, self));
}
/** @type {TelegraphFunction} */
function noxious_toad_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    var attacks = [];
    if(self.cycle === 1){
        return attacks;
    }
    for(var direction of horizontal_directions){
        var move = location.plus(direction.times(2));
        if(map.check_empty(move)){
            attacks = attacks.concat(spider_telegraph(move, map, self));
        }
        
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function vampire_telegraph(location, map, self){
    var attacks = [];
    for(var move_direction of horizontal_directions){
        var move = location.plus(move_direction);
        if(map.check_empty(move)){
            for(var attack_direction of diagonal_directions){
                attacks.push(move.plus(attack_direction));
            }
        }
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function rat_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    if(self.cycle >= 1){
        return spider_telegraph(location, map, self);
    }
    return [];
}
/** @type {TelegraphFunction} */
function velociphile_telegraph(location, map, self){
    var attacks = [];
    for(var direction of all_directions){
        if(map.check_empty(location.plus(direction))){
            attacks = attacks.concat(get_points_in_direction(location.plus(direction), direction, map));
        }
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function darkling_telegraph(location, map, self){
    if(self.direction === undefined){
        return [];
    }
    return spider_telegraph(self.direction, map, self);
}
/** @type {TelegraphFunction} */
function hazard_telegraph(location, map, self){
    return [location];
}


// Telegraph utility functions

/**
 * Function to get all points from a location to and including the closest occupied space in a direction.
 * @param {Point} location The starting location which should not be included.
 * @param {Point} direction The relative direction to look from the starting location.
 * @param {GameMap} map The gamemap to look on.
 * @returns {Point[]} An array of the points in that direction up to the first occupied one.
 */
function get_points_in_direction(location, direction, map){
    location = location.copy();
    var points = [];
    while(map.check_empty(location.plus_equals(direction))){
        points.push(location.copy());
    }
    points.push(location);
    return points;
}
/**
 * Function that for an array of directions, attempts to move in a direction if possible, then attack in that direction.
 * @param {Point} location The starting location
 * @param {GameMap} map The map to look on.
 * @param {Point[]} directions The directions to attempt to move and attack in.
 * @returns {Point[]} Where moving then attacking in each of the chosen directions would hit.
 */
function move_attack_telegraph(location, map, directions){
    var attacks = [];
    for(var direction of directions){
        if(map.check_empty(location.plus(direction))){
            attacks.push(location.plus(direction.times(2)));
        }
        attacks.push(location.plus(direction));
    }
    return attacks;
}
/**
 * Finction to let a tile disguise itself as another one.
 * @param {Tile} tile The tile to disguise.
 * @param {TileGenerator} tile_generator The generator for a default version of the tile to disguise as. 
 * @param {boolean=} just_background If true, changes the is_hit field rather than the main image.
 */
function shapeshift(tile, tile_generator, just_background){
    var look = tile_generator();
    tile.description = look.description;
    tile.telegraph = look.telegraph;
    if(just_background){
        tile.event_happening = look.pic;
    }
    else{
        tile.pic = look.pic;
    }
}

// ----------------Tiles.js----------------
// This file contains the functions to generate tiles representing things on the game_map.

/**
 * @typedef {object} Tile Information about the contents of a single square of a floor of the dungeon.
 * 
 * // Required properties //
 * @property {string} type The type of thing this tile is (player, enemy, exit, etc).
 * @property {string} name More specific than type. Used for mousover text.
 * @property {string} pic The picture of the tile's contents.
 * @property {string} description A description given when the tile is clicked on.
 * 
 * // Misc //
 * @property {number=} health The amount of damage it can take before dying.
 * @property {number=} max_health It can never be healed above this.
 * @property {number=} difficulty Used to determine how many things can be spawned.
 * @property {string=} death_message Displayed on death.
 * 
 * // Functions controlling behavior. //
 * @property {AIFunction=} behavior What it does on it's turn. Targets the player.
 * @property {TelegraphFunction=} telegraph Used to show which squares it can attack on it's next turn.
 * @property {AIFunction=} on_enter What it does when something tries to move onto it. Targets whatever touched it.
 * @property {AIFunction=} on_hit What it does when attacked. Targets what attacked it.
 * @property {AIFunction=} on_death What it does when killed. Targets the player.
 * 
 * // Properties used to determing aesthetics //
 * @property {string[]=} pic_arr Used when the tile sometimes changes images.
 * @property {TileGenerator[]=} look_arr Used when the tile sometimes is disguised as another tile.
 * @property {number=} rotate How much to rotate the image when displaying it. Must be in 90 degree increments.
 * @property {boolean=} flip If the image should be horizontally flipped.
 * 
 * // Properties used by AI functions to determine behavior. //
 * @property {number=} cycle Used when a tile's state must persist between turns.
 * @property {number=} spawn_timer How many turns between spawning things.
 * @property {number=} range How far away can it attack.
 * @property {Point=} direction The relative direction is it moving.
 * @property {number=} spin_direction The direction it is spinning.
 * @property {Spell[]=} spells A array of behavior functions it can call along with their own descriptions and pictures.
 * @property {TileGenerator[]=} summons A array of tiles it can spawn.
 * @property {[]=} contents The contents of a chest.
 * @property {CardGenerator[]=} card_drops The cards a boss can drop on death.
 * 
 * // Properties added later //
 * @property {number=} stun When the tile is stunned, it's turn will be skipped.
 * @property {number=} id Given a unique one when added to a EntityList.
 * @property {string=} is_hit Used to telegraph which spaces have been or might be attacked.
 * @property {string=} event_happening Used to telegraph an event.
 */

/**
 * @callback TileGenerator Function used to create a tile.
 * @returns {Tile}
 */


// This is a array of all the enemies that can be spawned on a normal floor.
const ENEMY_LIST = [spider_tile, turret_h_tile, turret_d_tile, turret_r_tile, shadow_knight_tile, 
    scythe_tile, spider_web_tile, ram_tile, large_porcuslime_tile, medium_porcuslime_tile, 
    acid_bug_tile, brightling_tile, corrosive_caterpillar_tile, noxious_toad_tile, vampire_tile,
    clay_golem_tile, vinesnare_bush_tile, rat_tile, shadow_scout_tile];

// Non-Enemy tiles
/** @type {TileGenerator} Empty space.*/
function empty_tile(){
    return {
        type: `empty`,
        name: `empty`,
        pic: `${img_folder.tiles}empty.png`,
        description: empty_description
    }
}
/** @type {TileGenerator} The player must move here to complete the floor.*/
function exit_tile(){
    return {
        type: `exit`,
        name: `exit`,
        pic: `${img_folder.tiles}stairs.png`,
        description: exit_description
    }
}
/** @type {TileGenerator} Must be unlocked to reveal the exit.*/
function lock_tile(){
    return {
        type: `terrain`,
        name: `lock`,
        pic: `${img_folder.tiles}lock.png`,
        description: lock_description
    }
}
/** @type {TileGenerator} The starting player.*/
function player_tile(){
    return {
        type: `player`,
        name: `player`,
        pic: `${img_folder.tiles}helmet.png`,
        description: player_description,
        health: PLAYER_STARTING_HEALTH,
        max_health: PLAYER_STARTING_HEALTH
        
    }
}
/** @type {TileGenerator} A hazardous pool of lava.*/
function lava_pool_tile(){
    return {
        type: `terrain`,
        name: `lava pool`,
        pic: `${img_folder.tiles}lava_pool.png`,
        description: lava_pool_description,
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}
/** @type {TileGenerator} A hazardous pool of slime that can be cleared by attacking.*/
function corrosive_slime_tile(){
    return {
        type: `terrain`,
        name: `corrosive_slime`,
        pic: `${img_folder.tiles}corrosive_slime.png`,
        description: corrosive_slime_description,
        health: 1,
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}
/** @type {TileGenerator} A sturdy wall.*/
function wall_tile(){
    return {
        type: `terrain`,
        name: `wall`,
        pic: `${img_folder.tiles}wall.png`,
        description: wall_description
    }
}
/** @type {TileGenerator} A damaged wall that might spawn something on death.*/
function damaged_wall_tile(){
    var health = random_num(2) + 1;
    return {
        type: `terrain`,
        name: `damaged wall`,
        pic: `${img_folder.tiles}damaged_wall.png`,
        description: damaged_wall_description,
        health,
        on_death: wall_death,
        summons: [spider_tile, acid_bug_tile, spider_web_tile, rat_tile]
    }
}
/** @type {TileGenerator} A fireball that travels in a straight line until it hits something. Direction is not yet set.*/
function fireball_tile(){
    var pic_arr = [`${img_folder.tiles}fireball_n.png`, `${img_folder.tiles}fireball_nw.png`];
    return {
        type: `enemy`,
        name: `fireball`,
        pic: `${img_folder.tiles}fireball.png`,
        description: fireball_description,
        behavior: fireball_ai,
        telegraph: fireball_telegraph,
        on_enter: fireball_on_enter,
        pic_arr,
        rotate: 0,
        direction: undefined
    }
}
/** @type {TileGenerator} A chest letting the user choose a reward. Currently empty.*/
function chest_tile(){
    return {
        type: `chest`,
        name: `chest`,
        pic: `${img_folder.tiles}chest.png`,
        description: chest_description,
        health: 1,
        on_enter: chest_on_enter,
        contents: []
    }
}


// Look tiles to give a specific name, background and description to an event.
/** @type {TileGenerator} Used to show which location will have falling rubble next turn.*/
function falling_rubble_look(){
    return {
        type: `look`,
        name: `falling rubble`,
        pic: `${img_folder.tiles}falling_rubble.png`,
        description: falling_rubble_description
    }
}
/** @type {TileGenerator} Used to show where a darkling will teleport next turn.*/
function darkling_rift_look(){
    return {
        type: `look`,
        name: `darkling rift`,
        pic: `${img_folder.tiles}darkling_rift.png`,
        description: darkling_rift_description,
        telegraph: spider_telegraph
    }
}

// Normal Enemy Tiles

/** @type {TileGenerator} */
function spider_tile(){
    return {
        type: `enemy`,
        name: `spider`,
        pic: `${img_folder.tiles}spider.png`,
        description: spider_description,
        health: 1,
        difficulty: 1,
        behavior: spider_ai,
        telegraph: spider_telegraph
    }
}
/** @type {TileGenerator} */
function turret_h_tile(){
    return {
        type: `enemy`,
        name: `turret`,
        pic: `${img_folder.tiles}turret_h.png`,
        description: turret_h_description,
        health: 1,
        difficulty: 2,
        behavior: turret_h_ai,
        telegraph: turret_h_telegraph
    }
}
/** @type {TileGenerator} */
function turret_d_tile(){
    return {
        type: `enemy`,
        name: `turret`,
        pic: `${img_folder.tiles}turret_d.png`,
        description: turret_d_description,
        health: 1,
        difficulty: 2,
        behavior: turret_d_ai,
        telegraph: turret_d_telegraph
    }
}
/** @type {TileGenerator} */
function turret_r_tile(){
    var pic_arr = [`${img_folder.tiles}turret_r_N_S.png`, `${img_folder.tiles}turret_r_NE_SW.png`];
    var starting_cycle = random_num(4);
    var spin_direction = random_sign();
    if(spin_direction > 0){
        var starting_rotation = 90 * Math.floor(starting_cycle / 2);
    }
    else{
        var starting_rotation = 90 * Math.floor(((starting_cycle + 1) % 4) / 2);
    }
    return {
        type: `enemy`,
        name: `rotary turret`,
        pic: pic_arr[starting_cycle % 2],
        description: turret_r_description,
        health: 1,
        difficulty: 2,
        behavior: turret_r_ai,
        telegraph: turret_r_telegraph,
        pic_arr,
        rotate: starting_rotation,
        flip: (spin_direction === -1),
        cycle: starting_cycle,
        spin_direction
    }
}
/** @type {TileGenerator} */
function scythe_tile(){
    return{
        type: `enemy`,
        name: `scythe`,
        pic: `${img_folder.tiles}scythe.png`,
        description: scythe_description,
        health: 1,
        difficulty: 3,
        behavior: scythe_ai,
        telegraph: scythe_telegraph,
        rotate: 90 * random_num(4)
    }
}
/** @type {TileGenerator} */
function shadow_knight_tile(){
    return{
        type: `enemy`,
        name: `shadow knight`,
        pic: `${img_folder.tiles}shadow_knight.png`,
        description: shadow_knight_description,
        health: 2,
        difficulty: 4,
        behavior: shadow_knight_ai,
        telegraph: shadow_knight_telegraph
    }
}
/** @type {TileGenerator} */
function spider_web_tile(){
    var spawn_timer = 2
    return{
        type: `enemy`,
        name: `spider egg`,
        pic: `${img_folder.tiles}spider_web.png`,
        description: `${spider_web_description[0]}${spawn_timer + 1}${spider_web_description[1]}`,
        health: 1,
        difficulty: 4,
        behavior: spider_web_ai,
        cycle: 0,
        spawn_timer
    }
}
/** @type {TileGenerator} */
function ram_tile(){
    var pic_arr = [`${img_folder.tiles}ram.png`, `${img_folder.tiles}ram_charge.png`];
    var starting_cycle = 0;
    return{
        type: `enemy`,
        name: `ram`,
        pic: pic_arr[starting_cycle],
        description: ram_description,
        health: 2,
        difficulty: 5,
        behavior: ram_ai,
        telegraph: ram_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}
/** @type {TileGenerator} */
function large_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `large porcuslime`,
        pic: `${img_folder.tiles}large_porcuslime.png`,
        description: large_porcuslime_description,
        health: 3,
        difficulty: 8,
        behavior: large_porcuslime_ai,
        telegraph: large_porcuslime_telegraph,
        on_enter: hazard
    }
}
/** @type {TileGenerator} */
function medium_porcuslime_tile(){
    var starting_cycle = random_num(2);
    var pic_arr = [`${img_folder.tiles}medium_h_porcuslime.png`, `${img_folder.tiles}medium_d_porcuslime.png`];
    return {
        type: `enemy`,
        name: `medium porcuslime`,
        pic: pic_arr[starting_cycle],
        description: medium_porcuslime_description,
        health: 2,
        difficulty: 5,
        behavior: medium_porcuslime_ai,
        telegraph: medium_porcuslime_telegraph,
        on_enter: hazard,
        pic_arr,
        cycle: starting_cycle
    }
}
/** @type {TileGenerator} */
function small_h_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `small porcuslime`,
        pic: `${img_folder.tiles}small_h_porcuslime.png`,
        description: small_h_porcuslime_description,
        health: 1,
        difficulty: 3,
        behavior: porcuslime_horizontal_ai,
        telegraph: porcuslime_horizontal_telegraph,
        on_enter: hazard
        }
}
/** @type {TileGenerator} */
function small_d_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `small porcuslime`,
        pic: `${img_folder.tiles}small_d_porcuslime.png`,
        description: small_d_porcuslime_description,
        health: 1,
        difficulty: 3,
        behavior: porcuslime_diagonal_ai,
        telegraph: porcuslime_diagonal_telegraph,
        on_enter: hazard
    }
}
/** @type {TileGenerator} */
function acid_bug_tile(){
    return {
        type: `enemy`,
        name: `acid bug`,
        pic: `${img_folder.tiles}acid_bug.png`,
        description: acid_bug_description,
        health: 1,
        difficulty: 3,
        behavior: move_closer_ai,
        on_death: acid_bug_death,
    }
}
/** @type {TileGenerator} */
function brightling_tile(){
    var starting_cycle = 0;
    return{
        type: `enemy`,
        name: `brightling`,
        pic: `${img_folder.tiles}brightling.png`,
        description: brightling_description,
        health: 1,
        difficulty: 4,
        behavior: brightling_ai,
        cycle: starting_cycle

    }
}
/** @type {TileGenerator} */
function corrosive_caterpillar_tile(){
    return {
        type: `enemy`,
        name: `corrosive caterpillar`,
        pic: `${img_folder.tiles}corrosive_caterpillar.png`,
        description: corrosive_caterpillar_description,
        health: 1,
        difficulty: 2,
        behavior: corrosive_caterpillar_ai,
        on_death: corrosive_caterpillar_death
    }
}
/** @type {TileGenerator} */
function noxious_toad_tile(){
    var pic_arr = [`${img_folder.tiles}noxious_toad_leaping.png`, `${img_folder.tiles}noxious_toad.png`];
    var starting_cycle = random_num(pic_arr.length);
    return {
        type: `enemy`,
        name: `noxious toad`,
        pic: pic_arr[starting_cycle],
        description: noxious_toad_description, 
        health: 1,
        difficulty: 4,
        behavior: noxious_toad_ai,
        telegraph: noxious_toad_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}
/** @type {TileGenerator} */
function vampire_tile(){
    return {
        type: `enemy`,
        name: `vampire`,
        pic: `${img_folder.tiles}vampire.png`,
        description: vampire_description,
        health: 2,
        max_health: 2,
        difficulty: 5,
        behavior: vampire_ai,
        telegraph: vampire_telegraph,
        on_hit: vampire_hit
    }
}
/** @type {TileGenerator} */
function clay_golem_tile(){
    return {
        type: `enemy`,
        name: `clay golem`,
        pic: `${img_folder.tiles}clay_golem.png`,
        description: clay_golem_description,
        health: 3,
        difficulty: 4,
        behavior: clay_golem_ai,
        telegraph: spider_telegraph,
        on_hit: clay_golem_hit,
        cycle: 1
    }
}
/** @type {TileGenerator} */
function vinesnare_bush_tile(){
    var range = 3;
    var pic_arr = [`${img_folder.tiles}vinesnare_bush_lashing.png`, `${img_folder.tiles}vinesnare_bush_rooted.png`];
    var starting_cycle = 1;
    return {
        type: `enemy`,
        name: `vinesnare bush`,
        pic: pic_arr[starting_cycle],
        description: `${vinesnare_bush_description[0]}${range}${vinesnare_bush_description[1]}`,
        health: 1,
        difficulty: 4,
        behavior: vinesnare_bush_ai,
        telegraph: spider_telegraph,
        pic_arr,
        cycle: starting_cycle,
        range
    }
}
/** @type {TileGenerator} */
function rat_tile(){
    return {
        type: `enemy`,
        name: `rat`,
        pic: `${img_folder.tiles}rat.png`,
        description: rat_description,
        health: 1,
        difficulty: 2,
        behavior: rat_ai,
        telegraph: rat_telegraph,
        flip: random_num(2) === 0,
        cycle: 1

    }
}
/** @type {TileGenerator} */
function shadow_scout_tile(){
    var look_arr = [empty_tile, shadow_scout_tile];
    var starting_cycle = random_num(2);
    return {
        type: `enemy`,
        name: `shadow scout`,
        pic: `${img_folder.tiles}shadow_scout.png`,
        description: shadow_scout_description, 
        health: 1,
        difficulty: 3,
        behavior: shadow_scout_ai,
        telegraph: spider_telegraph,
        look_arr,
        cycle: starting_cycle
    }
}
function darkling_tile(){
    return {
        type: `enemy`,
        name: `darkling`,
        pic: `${img_folder.tiles}darkling.png`,
        description: darkling_description, 
        health: 1,
        difficulty: 4,
        behavior: darkling_ai,
        telegraph: darkling_telegraph,
    }
}

// Boss Tiles
/** @type {TileGenerator} */
function velociphile_tile(){
    return{
        type: `enemy`,
        name: `velociphile`,
        pic: `${img_folder.tiles}velociphile.png`,
        description: velociphile_description,
        health: 3,
        death_message: velociphile_death_message,
        behavior: velociphile_ai,
        telegraph: velociphile_telegraph,
        on_death: boss_death,
        card_drops: [roll_nesw, roll_nwse, roll_ew]
    }
}
/** @type {TileGenerator} */
function spider_queen_tile(){
    return{
        type: `enemy`,
        name: `spider queen`,
        pic: `${img_folder.tiles}spider_queen.png`,
        description: spider_queen_description,
        health: 3,
        death_message: spider_queen_death_message,
        behavior: spider_ai,
        telegraph: spider_telegraph,
        on_hit: spider_queen_hit,
        on_death: boss_death,
        card_drops: [skitter, bite]
    }
}
/** @type {TileGenerator} */
function lich_tile(){
    var spells = [
        spell_generator(teleport_spell, teleport_spell_description, `${img_folder.tiles}lich_teleport.png`), 
        spell_generator(summon_spell, summon_spell_description, `${img_folder.tiles}lich_summon.png`), 
        spell_generator(earthquake_spell, earthquake_spell_description, `${img_folder.tiles}lich_earthquake.png`), 
        spell_generator(flame_wave_spell, flame_wave_spell_description, `${img_folder.tiles}lich_flame_wave.png`),
        spell_generator(confusion_spell, confusion_spell_description, `${img_folder.tiles}lich_confusion.png`),
        spell_generator(lava_moat_spell, lava_moat_spell_description, `${img_folder.tiles}lich_lava_moat.png`),
        spell_generator(rest_spell, rest_description, `${img_folder.tiles}lich_rest.png`)
    ];
    var summons = [
        shadow_scout_tile,
        scythe_tile,
        shadow_knight_tile,
        ram_tile,
        medium_porcuslime_tile,
        clay_golem_tile,
        rat_tile,
        vampire_tile
    ];
    var starting_cycle = 1;
    return{
        type: `enemy`,
        name: `lich`,
        pic: spells[starting_cycle].pic,
        description: `${lich_description}${spells[starting_cycle].description}`,
        health: 4,
        death_message: lich_death_message,
        behavior: lich_ai,
        on_death: boss_death,
        cycle: starting_cycle,
        spells,
        summons,
        card_drops: [instant_teleport, debilitating_confusion]
    }
}
/**
 * @typedef Spell A set a behavior, description and pic used by the lich.
 * @property {AIFunction} behavior Function performing the spell.
 * @property {string} description A description of what the spell does.
 * @property {string} pic A picture to help telegraph the spell.
 */

/**
 * Function to generate and return a spell with the fields provided as parameters.
 * @param {AIFunction} behavior 
 * @param {string} description 
 * @param {string} pic 
 * @returns {Spell}
 */
function spell_generator(behavior, description, pic){
    return {
        behavior,
        description,
        pic
    }
}


// ----------------UIID.js----------------
// File containing a library of ids used to retrieve elements of the ui for displaying.

/**
 * Function to get a set of uiids (Identifiers that can be used to retrieve the appropriate ui element) for the appropriate language.
 * Throws an error if an invalid language is provided.
 * @param {string} language The language to get uiids for.
 * @returns {uiid_library} The library of uiids for that language.
 */
function get_uiids(language){
    // Factory function for the display classes (currently only html)
    switch(language){
        case `html`:
            return HTML_UIIDS;
        default:
            throw new Error(`invalid display language`);
    }
}

/**
 * @typedef uiid_library
 * @property {string} title Displays the title of the game.
 * @property {string} game_screen Controls the visibility of the game itself.
 *      @property {string} stats Displays the current stats.
 *      @property {string} stage Controls the visibility of the current floor.
 *          @property {string} map_display Displays the map of the floor.
 *          @property {string} health_display Displays the player's health.
 *          @property {string} hand_display Displays the player's hand of cards.
 *          @property {string} move_buttons Displays the buttons for the last card clicked on.
 *          @property {string} display_message Displays messages.
 *      @property {string} shop Controls the visibility of the shop.
 *          @property {string} shop_instructions Lets the player know they can add or remove a card.
 *          @property {string} add_card Displays which cards that could be added to their deck.
 *          @property {string} remove_card Displays which cards that could be removed from their deck.
 *          @property {string} current_deck Tells them the next element is their current deck.
 *          @property {string} display_deck Displays their entire deck.
 *      @property {string} chest Controls the visibility of the chest contents.
 *          @property {string} chest_instructions: A description of the contents of the chest.
 *          @property {string} contents The images associated with the contents.
 *          @property {string} chest_confirm_row: Buttons allowing you to confirm your pick or skip the reward.
 *          @property {string} content_description: A description of whichever one of the contents you last clicked on.
 * @property {string} guide Controls the visibility of the guide screen.
 */


/** @type {uiid_library} The uiid library for HTML.*/
const HTML_UIIDS = {
    title: `title`,
    game_screen: `gameScreen`,
        stats: `stats`,
        stage: `stage`,
            map_display: `mapDisplay`,
            health_display: `healthDisplay`,
            hand_display: `handDisplay`,
            move_buttons: `moveButtons`,
            display_message: `displayMessage`,
        shop: `shop`,
            shop_instructions: `shopInstructions`,
            add_card: `addCard`,
            remove_card: `removeCard`,
            current_deck: `currentDeck`,
            display_deck: `displayDeck`,
        chest: `chest`,
            chest_instructions: `chestInstructions`,
            contents: `contents`,
            chest_confirm_row: `chestConfirmRow`,
            content_description: `contentDescription`,
    guide: `guide`,
}
Object.freeze(HTML_UIIDS);

const UIIDS = get_uiids(MARKUP_LANGUAGE);

const GAME_SCREEN_DIVISIONS = [UIIDS.stage, UIIDS.shop, UIIDS.chest];
const DISPLAY_DIVISIONS = [UIIDS.game_screen, UIIDS.guide];
const DISPLAY_DIVISION_NAMES = [gameplay_screen_name, guide_screen_name];

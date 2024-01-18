// ----------------AI.js----------------
// File containing the logic for the behavior of non player entities.


/**
 * @callback AIFunction
 * @param {Point} location The current location of this entity.
 * @param {Point} difference The difference between this entity's location and what it is targeting.
 * @param {GameMap} map The game map where any actions will be performed.
 * @param {Tile} self The tile for the entity whose ai this is.
 */


// Normal Enemy AIs
/** @type {AIFunction} AI used by spiders and the Spider Queen.*/
function spider_ai(location, difference, map, self){
    if(difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(location.plus(difference), `player`);
    }
    else{
        // Otherwise, move closer.
        var directions = order_nearby(difference);
        for(var i = 0; i < directions.length && !map.move(location, location.plus(directions[i])); ++i){}
    }
}
/** @type {AIFunction} AI used by turrets that shoot orthogonally.*/
function turret_h_ai(location, difference, map, self){
    // Turret version that shoots orthogonally.
    if(difference.x === 0 || difference.y === 0){
        turret_fire_ai(location, difference, map, self);
    }
}
/** @type {AIFunction} AI used by turrets that shoot diagonally.*/
function turret_d_ai(location, difference, map, self){
    // Turret version that shoots diagonally.
    if(Math.abs(difference.x) === Math.abs(difference.y)){
        turret_fire_ai(location, difference, map, self);
    }
}
/** @type {AIFunction} AI used by turrets that rotate.*/
function turret_r_ai(location, difference, map, self){
    if( self.cycle === undefined || 
        self.rotate === undefined || 
        self.flip === undefined || 
        self.spin_direction === undefined || 
        self.pic_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    switch(self.cycle){
        case 0:
            if(difference.x === 0){
                // Fires N and S.
                turret_fire_ai(location, difference, map, self);
            }
            break;
        case 1:
            if(difference.x === -1 * difference.y){
                // Fires NE and SW.
                turret_fire_ai(location, difference, map, self);
            }
            break;
        case 2:
            if(difference.y === 0){
                // Fires E and W.
                turret_fire_ai(location, difference, map, self);
            }
            break;
        case 3:
            if(difference.x === difference.y){
                // Fires SE and NW.
                turret_fire_ai(location, difference, map, self);
            }
            break;
        default:
            throw new Error(`Improper case for ${self.name}`);
    }
    // Rotate.
    self.cycle = (self.cycle + self.spin_direction + 4) % 4;
    self.pic = self.pic_arr[self.cycle % 2];
    if(!self.flip){
        self.rotate = 90 * Math.floor(self.cycle / 2);
    }
    else{
        self.rotate = 90 * Math.floor(((self.cycle + 1) % 4) / 2);
    }
}
/** @type {AIFunction} AI used by all turrets to fire towards the player.*/
function turret_fire_ai(location, difference, map, self){
    // Fires a shot in the direction of the player.
    var direction = sign(difference)
    try{
        for(var i = 1; !map.attack(location.plus(direction.times(i))); ++i){ 
            map.check_bounds(location.plus(direction.times(i)));
        }
    }
    catch(error){
        if(!(error.message === `x out of bounds` || error.message === `y out of bounds`)){
            throw error;
        }
    }
}
/** @type {AIFunction} AI used by scythes.*/
function scythe_ai(location, difference, map, self){
    if(self.rotate === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    var distance = 3;
    var direction = sign(difference);
    if(direction.x === 0 || direction.y === 0){
        // If the player is orthogonal, moves randomly.
        direction = new Point(random_sign(), random_sign());
    }
    // Rotate image based on direction.
    self.rotate = 90 * (direction.x + direction.y + 2) / 2;
    if(direction.x === -1 && direction.y === 1){
        self.rotate = 90 * 3;
    }
    for(var i = 0; i < distance && map.move(location, location.plus(direction)) ; ++i){
        // moves <distance> spaces attacking each space it passes next to.
        location.plus_equals(direction)
        map.attack(new Point(location.x - direction.x, location.y), `player`);
        map.attack(new Point(location.x, location.y - direction.y), `player`); 
    }
}
/** @type {AIFunction} AI used by shadow knights.*/
function shadow_knight_ai(location, difference, map, self){
    // Moves in an L.
    if(Math.abs(difference.x) === 1 && Math.abs(difference.y) === 1){
        // If the player is next to it diagonally, attempty to reposition to attack them next turn.
        if(!map.move(location, location.plus(sign(difference).times(new Point(2, -1))))){
            map.move(location, location.plus(sign(difference).times(new Point(-1, 2))));
        }
        return;
    }
    if((Math.abs(difference.x) === 1 || Math.abs(difference.y) === 1) && Math.abs(difference.x) + Math.abs(difference.y) === 3){
        // If the player is a L away, attak them then try to move past them.
        map.attack(location.plus(difference), `player`);
        map.move(location, location.plus(difference.times(new Point(2, 2))));
        return;
    }
    // Otherwise, attempt to move closer
    if(Math.abs(difference.x) >= Math.abs(difference.y)){
        var new_dir = new Point(2, 1);
    }
    else{
        var new_dir = new Point(1, 2);
    }
    if(difference.x < 0){
        new_dir.x *= -1;
    }
    if(difference.y < 0){
        new_dir.y *= -1;
    }
    map.move(location, location.plus(new_dir));
}
/** @type {AIFunction} AI used by spider webs.*/
function spider_web_ai(location, difference, map, self){
    if( self.cycle === undefined || 
        self.spawn_timer === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    if(self.cycle < self.spawn_timer){
        // If the cycle hasn't reached the spawn timer, increments it.
        ++self.cycle;
    }
    else{
        // Attempts to spawn a spider nearby and resets cycle.
        spawn_nearby(map, spider_tile(), location);
        self.cycle = 0;
    }
}
/** @type {AIFunction} AI used by rams.*/
function ram_ai(location, difference, map, self){
    if( self.cycle === undefined || 
        self.pic_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    var direction = sign(difference);
    var wander_speed = 2;
    var moved = true;
    if(self.cycle === 0){
        // moves <wander_speed> closer to a row or column that the player is in.
        if(Math.abs(difference.x) <= Math.abs(difference.y)){
            direction.y = 0;
            for(var i = 0; i < wander_speed && i < Math.abs(difference.x) && moved; ++i){
                moved = map.move(location, location.plus(direction));
                moved && location.plus_equals(direction);
            }
        }
        else{
            direction.x = 0;
            for(var i = 0; i < wander_speed && i < Math.abs(difference.y) && moved; ++i){
                moved = map.move(location, location.plus(direction));
                moved && location.plus_equals(direction);
            }
        }
        if(moved === true && (Math.abs(difference.x) < 3 || Math.abs(difference.y) < 3)){
            // If it sees them, prepares to charge.
            self.cycle = 1;
            self.pic = self.pic_arr[self.cycle];
        }
    }
    else{
        // Charges orthogonally until it hits something and rams it.
        // Reverts to wandering after.
        if(Math.abs(difference.x) > Math.abs(difference.y)){
            direction.y = 0;
        }
        else{
            direction.x = 0;
        }
        while(moved){
            moved = map.move(location, location.plus(direction));
            location.plus_equals(direction);
        }
        map.attack(location);
        self.cycle = 0;
        self.pic = self.pic_arr[self.cycle];
    }
}
/** @type {AIFunction} AI used by large porcuslimes.*/
function large_porcuslime_ai(location, difference, map, self){
    if(self.health !== undefined && self.health === 2){
        // If health is 2, turns into the medium version.
        map.attack(location);
        map.attack(location);
        map.add_tile(medium_porcuslime_tile(), location);
        return;
    }
    if(self.health !== undefined && self.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(location);
        spawn_nearby(map, small_d_porcuslime_tile(), location);
        spawn_nearby(map, small_h_porcuslime_tile(), location);
        return;
    }
    var direction = sign(difference);
    move_attack_ai(location, direction, map, self);
}
/** @type {AIFunction} AI used by medium porcuslimes.*/
function medium_porcuslime_ai(location, difference, map, self){
    if( self.cycle === undefined || 
        self.pic_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`)
    }
    if(self.health !== undefined && self.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(location);
        spawn_nearby(map, small_d_porcuslime_tile(), location);
        spawn_nearby(map, small_h_porcuslime_tile(), location);
        return;
    }
    if(self.cycle === 0){
        // If cycle is at 0, direction will be orthogonally towards the player.
        porcuslime_horizontal_ai(location, difference, map, self);
    }
    else{
        // If cycle is at 1, direction will be diagonally towards the player.
        porcuslime_diagonal_ai(location, difference, map, self);
    }
    // Swaps cycle and picture between the two.
    self.cycle = 1 - self.cycle;
    self.pic = self.pic_arr[self.cycle];
}
/** @type {AIFunction} AI used by small and medium porcuslimes when moving diagonally.*/
function porcuslime_diagonal_ai(location, difference, map, self){
    // Small version which moves then attacks diagonally.
    var direction = order_nearby(difference);
    var dir = undefined;
    for(var i = 0; i < direction.length && dir === undefined; ++i){
        if(Math.abs(direction[i].x) === 1 && Math.abs(direction[i].y) === 1){
            dir = direction[i];
        }
    }
    if(dir === undefined){
        throw new Error(`porcuslime failed to pick a direction`);
    }
    move_attack_ai(location, dir, map, self);
}
/** @type {AIFunction} AI used by small and medium porcuslimes when moving orthogonally.*/
function porcuslime_horizontal_ai(location, difference, map, self){
    var direction = order_nearby(difference);
    var dir = undefined;
    for(var i = 0; i < direction.length && dir === undefined; ++i){
        if(direction[i].x === 0 || direction[i].y === 0){
            dir = direction[i];
        }
    }
    if(dir === undefined){
        throw new Error(`porcuslime failed to pick a direction`);
    }
    move_attack_ai(location, dir, map, self);
}
/** @type {AIFunction} AI used when a entity should move and attack in a direction (difference).*/
function move_attack_ai(location, difference, map, self){
    if(point_equals(difference, new Point(0, 0))){
        return;
    }
    var moved = map.move(location, location.plus(difference));
    if(moved){
        map.attack(location.plus(difference.times(2)));
    }
    else{
        map.attack(location.plus(difference));
    }
}
/** @type {AIFunction} AI used by acid bugs.*/
function acid_bug_ai(location, difference, map, self){
    // Moves 1 space towards the player.
    var directions = order_nearby(difference);
    for(var i = 0;
        i < directions.length &&
        !map.move(location, location.plus(directions[i]))
        && (self.health === undefined || self.health > 0);
        ++i){}
}
/** @type {AIFunction} Function used when acid bugs die to explode and harm everything around them.*/
function acid_bug_death(location, difference, map, self){
    // On death, attacks each space next to it.
    var attacks = random_nearby();
    for(var i = 0; i < attacks.length; ++i){
        map.attack(location.plus(attacks[i]));
    }
}
/** @type {AIFunction} AI used by brightlings.*/
function brightling_ai(location, difference, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(self.cycle === -1){
        // teleports to a random empty space, then cycle goes to 1.
        teleport_spell(location, difference, map, self);
        ++self.cycle;
    }
    else if(random_num(4) < self.cycle){
        // Teleports the player next to it then cycle goes to 0 to prepare to teleport.
        var near_points = random_nearby();
        for(var i = 0; i < near_points.length && !map.move(location.plus(difference), location.plus(near_points[i])); ++i){}
        self.cycle = -1;
        // Since player has been moved, it returns to their turn.
        throw new Error(`pass to player`);
    }
    else{
        // Moves 2 spaces randomly.
        var near_points = random_nearby();
        for(var i = 0; i < 2; ++i){
            var moved = map.move(location, location.plus(near_points[i]));
            if(moved){
                location.plus_equals(near_points[i])
            }
        }
        ++self.cycle;
    }
}
/** @type {AIFunction} AI used by corrosive catterpillars.*/
function corrosive_caterpillar_ai(location, difference, map, self){
    var direction = get_empty_nearby(location, random_nearby(), map);
    if(!(direction === undefined)){
        if(map.move(location, location.plus(direction))){
            map.add_tile(corrosive_slime_tile(), location);
        }
    }
}
/** @type {AIFunction} Function used on corrosive catterpillar death to slime where they were.*/
function corrosive_caterpillar_death(location, difference, map, self){
    map.add_tile(corrosive_slime_tile(), location);
}
/** @type {AIFunction} AI used by noxious toads.*/
function noxious_toad_ai(location, difference, map, self){
    if( self.cycle === undefined || 
        self.pic_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(self.cycle === 0){
        var directions = order_nearby(difference);
        var moved = false;
        for(var i = 0; i < directions.length && !moved; ++i){
            if(directions[i].x === 0 || directions[i].y === 0){
                moved = map.move(location, location.plus(directions[i].times(2)));
                if(moved){
                    location.plus_equals(directions[i].times(2));
                    difference.minus_equals(directions[i].times(2))
                }
            }
        }
        if(moved){
            self.cycle = 1;
            if(difference.within_radius(1)){
                attack_around(location, map);
            }
        }
    }
    else{
        self.cycle = 0;
    }
    self.pic = self.pic_arr[self.cycle]
}
/** @type {AIFunction} AI used by vampires.*/
function vampire_ai(location, difference, map, self){
    var player_pos = location.plus(difference);
    var target_spaces = [new Point(player_pos.x + 1, player_pos.y + 1), 
                        new Point(player_pos.x - 1, player_pos.y + 1), 
                        new Point(player_pos.x + 1, player_pos.y - 1), 
                        new Point(player_pos.x - 1, player_pos.y - 1)];
    target_spaces = randomize_arr(target_spaces);
    var moved = false;
    for(var i = 0; i < target_spaces.length && !moved; ++i){
        var target = target_spaces[i];
        var target_distance = target.minus(location);
        if(Math.abs(target_distance.x) + Math.abs(target_distance.y) === 1){
            moved = map.move(location, target);
        }
    }
    if(moved && map.attack(location.plus(difference)) // If you moved into range, attack.
        && self.health !== undefined // If you have health
        && (self.max_health === undefined || self.health < self.max_health)){ // and your health isn't at your max_health,
        ++self.health; // heal.
    }
    if(!moved){
        var directions = order_nearby(difference);
        for(var i = 0; i < directions.length && !moved; ++i){
            var direction = directions[i]
            if(direction.x === 0 || direction.y === 0){
                moved = map.move(location, location.plus(direction));
            }
            
        }
    }
}
/** @type {AIFunction} Function used when a vampire is hit to teleport it away.*/
function vampire_hit(location, difference, map, self){
    if(self.health !== undefined && self.health > 0){
        stun(self);
        teleport_spell(location, difference, map, self);
    }
}
/** @type {AIFunction} AI used by clay golems.*/
function clay_golem_ai(location, difference, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(location.plus(difference), `player`);
        self.cycle = 1;
    }
    else if(self.cycle === 1){
        // Otherwise, move closer.
        var directions = order_nearby(difference);
        for(var i = 0; i < directions.length && !map.move(location, location.plus(directions[i])); ++i){}
        self.cycle = 0;
    }
    else{
        self.cycle = 1;
    }
}
/** @type {AIFunction} Function used when clay golems are hit to stun them and reset their cycle.*/
function clay_golem_hit(location, difference, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    stun(self);
    self.cycle = 1;
}
/** @type {AIFunction} AI used by vinesnare bushes.*/
function vinesnare_bush_ai(location, difference, map, self){
    if( self.cycle === undefined || 
        self.pic_arr === undefined ||
        self.range === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    var moved = false;
    if(difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(location.plus(difference), `player`);
    }
    else if(self.cycle > 0 && difference.within_radius(self.range)){
        var direction = sign(difference);
        if(difference.x === 0 || difference.y === 0 || Math.abs(difference.x) === Math.abs(difference.y)){
            for(var i = Math.max(Math.abs(difference.x), Math.abs(difference.y));
                i > 1 &&
                map.move(location.plus(direction.times(i)), location.plus(direction.times(i - 1)));
                --i){
                    moved = true;
                }
            
        }
    }
    if(moved){
        self.cycle = 0;
        self.pic = self.pic_arr[0];
        throw new Error(`pass to player`);
    }
    if(++self.cycle > 0){
        self.pic = self.pic_arr[1];
    }
}
/** @type {AIFunction} AI used by rats.*/
function rat_ai(location, difference, map, self){
    if( self.cycle === undefined || 
        self.flip === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(self.cycle >= 1 && difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(location.plus(difference), `player`);
        self.cycle = -1;
    }
    // Otherwise, move closer.
    for(var i = 0; i < 2; ++i){
        var directions = order_nearby(difference);
        if(self.cycle <= 0){
            directions = reverse_arr(directions);
        }
        var moved = false;
        for(var j = 0; j < directions.length && !moved; ++j){
            moved = map.move(location, location.plus(directions[j]));
            if(moved){
                location.plus_equals(directions[j])
                difference.minus_equals(directions[j])
                if(directions[j].x < 0){
                    self.flip = false;
                }
                if(directions[j].x > 0){
                    self.flip = true;
                }
            }
        }
    }
    ++self.cycle;
}
/** @type {AIFunction} AI used by shadow scouts.*/
function shadow_scout_ai(location, difference, map, self){
    if( self.cycle === undefined || 
        self.look_arr === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    self.cycle = 1 - self.cycle;
    shapeshift(self, self.look_arr[self.cycle]);
    spider_ai(location, difference, map, self);
}
function darkling_ai(location, difference, map, self){
    if(self.direction !== undefined){
        var moved = map.move(location, self.direction);
        if(moved){
            attack_around(self.direction, map);
        }
        else{
            map.attack(location);
            return;
        }
    }
    self.direction = map.random_empty();
    var darkling_rift = function(map_to_use){
        map_to_use.mark_tile(self.direction, darkling_rift_look);
    }
    map.add_event(darkling_rift);
}


// Boss AIs
/** @type {AIFunction} Function used on boss death to display the correct death message, unlock the floor, and by doing so heal the player.*/
function boss_death(location, difference, map, self){
    if(self.death_message === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    display.display_message(UIIDS.display_message, `${self.death_message}\n${boss_death_description}`);
    map.unlock();
}
/** @type {AIFunction} AI used by the Velociphile.*/
function velociphile_ai(location, difference, map, self){
    // Moves towards the player 2/3 of the time, otherwise moves randomly.
    var directions = order_nearby(difference);
    if(random_num(3) === 0){
        directions = randomize_arr(directions);
    }
    // Direction is reselected until an unobstructed one is found.
    var direction = get_empty_nearby(location, directions, map);
    if(!(direction === undefined)){
        // Moves in the chosen direction until it hits something, which it then attacks.
        while(map.move(location, location.plus(direction))){
            location.plus_equals(direction);
        }
        map.attack(location.plus(direction));
    }
}
/** @type {AIFunction} Function used when the spider queen is hit to stun her and spawn a spider.*/
function spider_queen_hit(location, difference, map, self){
    // Spawns a new spider nearby. Stuns it so it won't move right away.
    stun(self);
    var new_spider = spider_tile();
    stun(new_spider);
    spawn_nearby(map, new_spider, location);
}
/** @type {AIFunction} AI used by the Lich.*/
function lich_ai(location, difference, map, self){
    if( self.cycle === undefined || 
        self.spells === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    var player_close = (difference.within_radius(1));
    var moves = reverse_arr(order_nearby(difference));
    var i;
    for(i = 0; i < moves.length && !map.move(location, location.plus(moves[i])); ++i){}
    if(i < moves.length){
        location.plus_equals(moves[i]);
        difference.minus_equals(moves[i]);
    }
    self.spells[self.cycle].behavior(location, difference, map, self);
    if(player_close){
        self.cycle = 0;
    }
    else{
        self.cycle = random_num(self.spells.length - 1) + 1;
    }
    self.description = `${lich_description}${self.spells[self.cycle].description}`;
    self.pic = self.spells[self.cycle].pic;
}

// Spells
/** @type {AIFunction} Spell which teleports the user to a random location.*/
function teleport_spell(location, difference, map, self){
    var space = map.random_empty();
    map.move(location, space);
}
/** @type {AIFunction} Spell which summons a random thing from the user's summon array.*/
function summon_spell(location, difference, map, self){
    if(self.summons === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    var tile = self.summons[random_num(self.summons.length)]();
    spawn_nearby(map, tile, location);
}
/** @type {AIFunction} Spell which causes an earthquake causing debris to rain from the ceiling.*/
function earthquake_spell(location, difference, map, self){
    var health = self.health;
    if( health === undefined){
        health = 4;
    }
    map.add_event(earthquake_event(map, (5 - health) * 5 + random_num(4)));
}
/** @type {AIFunction} Spell which creates a wave of fireballs aimed at the target.*/
function flame_wave_spell(location, difference, map, self){
    var direction = get_empty_nearby(location, order_nearby(difference), map);
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
        map.add_tile(fireball, location.plus(spawnpoints[i]));
    }
}
/** @type {AIFunction} Spell which adds 2 random temporary debuff cards to the player's deck.*/
function confusion_spell(location, difference, map, self){
    for(var i = 0; i < 2; ++i){
        var ran = random_num(CONFUSION_CARDS.length);
        GS.give_temp_card(CONFUSION_CARDS[ran]());
    }
}
/** @type {AIFunction} Spell which creates several lava pools between the user and their target.*/
function lava_moat_spell(location, difference, map, self){
    var health = self.health;
    if( health === undefined){
        health = 4;
    }
    var nearby = order_nearby(difference);
    for(var i = 0; i < health && count_nearby(location, map) < 6; ++i){
        var moat = lava_pool_tile();
        spawn_nearby(map, moat, location, nearby);
    }
}
/** @type {AIFunction} Spell which does nothing.*/
function rest_spell(location, difference, map, self){}

// Other AIs
/** @type {AIFunction} Function used when something moves onto this to harm that thing.*/
function hazard(location, difference, map, self){
    // General on_move function to retaliate if something tries to move onto it.
    map.attack(location.plus(difference));
}
/** @type {AIFunction} Function used when a damaged wall is destroyed to potentially spawn something.*/
function wall_death(location, difference, map, self){
    var spawn_list = [spider_tile, acid_bug_tile, spider_web_tile, rat_tile];
    if(random_num(10) < 7){
        var ran = random_num(spawn_list.length);
        var new_enemy = spawn_list[ran]();
        stun(new_enemy);
        map.add_tile(new_enemy, location);
    }
}
/** @type {AIFunction}  AI used by fireballs.*/
function fireball_ai(location, difference, map, self){
    if(self.direction === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(!map.move(location, location.plus(self.direction))){
        map.attack(location.plus(self.direction));
        self.health = 1;
        map.attack(location);
    }
}
/** @type {AIFunction} Function used by fireballs to blow up when soemthing tries to move onto them.*/
function fireball_on_enter(location, difference, map, self){
    hazard(location, difference, map, self);
    self.health = 1;
    map.attack(location);
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

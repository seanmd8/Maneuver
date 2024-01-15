// @ts-check
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
                for(var i = 0; i < directions.length; ++i){
                    map.attack(location.plus(directions[i]));
                }
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


// Boss AIs
/** @type {AIFunction} Function used on boss death to display the correct death message, unlock the floor, and by doing so heal the player.*/
function boss_death(location, difference, map, self){
    if(self.death_message === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    display.display_message(ui_id.display_message, `${self.death_message}\n${boss_death_description}`);
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
    map.add_event({
        type: `earthquake`,
        amount: (5 - health) * 5 + random_num(4)
    });
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
        enemy_list: [spider_tile, turret_h_tile, turret_d_tile, scythe_tile, spider_web_tile, ram_tile, rat_tile, acid_bug_tile, shadow_knight_tile],
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
        enemy_list: [spider_tile, turret_h_tile, turret_d_tile, turret_r_tile, scythe_tile, spider_web_tile, clay_golem_tile, rat_tile, shadow_knight_tile],
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
        enemy_list: [shadow_knight_tile, spider_web_tile, vampire_tile, clay_golem_tile, rat_tile, spider_tile, turret_r_tile, brightling_tile, shadow_scout_tile],
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
    map.add_tile(velociphile_tile());
    map.lock();
    for(var i = 0; i < 8; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    return velociphile_floor_message;
}
/** @type {FloorGenerator} Generates the floor where the Spider Queen appears.*/
function spider_queen_floor(floor_num, area, map){
    map.add_tile(spider_queen_tile());
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
    map.add_tile(lich_tile());
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
        return -1;
    }
}// ----------------Cards.js----------------
// File containing the logic for each card.


// Cards that can be given on level up.
const CARD_CHOICES = [
    short_charge, jump, straight_charge, side_charge, step_left, 
    step_right, trample, horsemanship, lunge_left, lunge_right, 
    sprint, trident, whack_horizontal, spin_attack, butterfly, 
    retreat, force, side_attack, clear_behind, spear_slice, 
    jab, overcome, hit_and_run, push_back, fork,
    explosion, breakthrough, flanking_diagonal, flanking_sideways, flanking_straight,
    pike, combat_diagonal, combat_horizontal, breakthrough_side, whack_diagonal,
    thwack, overcome_sideways, y_leap, diamond_slice, spearhead,
    alt_diagonal_left, alt_diagonal_right, alt_horizontal, alt_vertical, jab_diagonal
];

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
        type: "move",
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to create a attack command.*/
function pattack(x, y){
    return {
        type: "attack",
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
    options.add_button(`Spin`, spin, 5);
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
    options.add_button(C, [pattack(1, 1), pattack(0, 1), pattack(-1, 1), pattack(1, 2), pattack(0, 2), pattack(-1, 2)]);
    return{
        name: `clear behind`,
        pic: `${img_folder.cards}clear_behind.png`,
        options
    }
}
/** @type {CardGenerator}*/
function spear_slice(){
    var options = new ButtonGrid();
    options.add_button(C, [pattack(1, -1), pattack(-1, -1), pattack(1, -2), pattack(0, -2), pattack(-1, -2)]);
    return{
        name: `spear slice`,
        pic: `${img_folder.cards}spear_slice.png`,
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
    options.add_button(`Spin`, spin, 5);
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
const BUFF_CHOICE_COUNT = 2;
const BUFF_SPAWN_DENOMINATOR = 4;


// Initialization settings.
const STARTING_ENEMY = spider_tile;
const STARTING_DECK = make_starting_deck;
const STARTING_AREA = generate_ruins_area;

// Dungeon generation settings.
const FLOOR_WIDTH = 8;
const FLOOR_HEIGHT = 8;
const AREA_SIZE = 5;

// Visual and animation settings.
const CARD_SCALE = 90;
const TILE_SCALE = 30;
const ANIMATION_DELAY = 300;
const DECK_DISPLAY_WIDTH = 4;
const TEXT_WRAP_WIDTH = 45;
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
    cards: `cards/`,
    other: `other/`,
    tiles: `tiles/`,
    backgrounds: `backgrounds/`
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

// Normal Enemy Descriptions.
const spider_description = `Spider: Will attack the player if it is next to them. Otherwise it will move 1 space closer.`;
const turret_h_description = `Turret: Does not move. Fires beams orthogonally that hit the first thing in their path.`;
const turret_d_description = `Turret: Does not move. Fires beams diagonally that hit the first thing in their path.`;
const turret_r_description = `Turret: Does not move. Fires beams in two directions hitting the first thing in their path. Rotates every turn.`;
const scythe_description = `Scythe: Will move 3 spaces diagonally towards the player damaging them if it passes next to them. Can only see diagonally.`;
const shadow_knight_description = `Shadow Knight: Moves in an L shape. If it tramples the player, it will move again.`;
const spider_web_description = [`Spider Web: Does not move or attack. Spawns a spider every `, ` turns.`];
const ram_description = `Ram: Moves orthogonally. When it sees the player, it will prepare to charge towards them and ram them.`;
const large_porcuslime_description = `Large Porcuslime: Moves towards the player 1 space and attacks in that direction. Weakens when hit.`;
const medium_porcuslime_description = `Medium Porcuslime: Moves towards the player 1 space and attacks in that direction. Alternates between orthoganal and diagonal movement. Splits when hit.`;
const small_h_porcuslime_description = `Small Porcuslime: Moves towards the player 1 space orthogonally and attacks in that direction.`;
const small_d_porcuslime_description = `Small Porcuslime: Moves towards the player 1 space diagonally and attacks in that direction.`;
const acid_bug_description = `Acid bug: Moves towards the player 1 space. Has no normal attack, but will spray acid upon death hurting everything next to it.`;
const brightling_description = `Brightling: Is not aggressive. Will occasionally teleport the player close to it before teleoprting away the next turn.`;
const corrosive_caterpillar_description = `Corrosive Caterpillar: Is not aggressive. Leaves a trail of corrosive slime behind it when it moves or dies.`;
const noxious_toad_description = `Noxious Toad: Every other turn it will hop over a space orthogonally. If it lands near the player, it will damage everything next to it.`;
const vampire_description = `Vampire: Moves orthogonally then will attempt to attack diagonally. When it hits the player, it will heal itself. Teleports away and is stunned when hit.`;
const clay_golem_description = `Clay Golem: Will attack the player if it is next to them. Otherwise it will move 1 space closer. Taking damage will stun it and it cannot move two turns in a row.`;
const vinesnare_bush_description = [`Vinesnare Bush: Does not move. Will attack if the player is close to it. Otherwise, it can drag the player closer with vines from up to `, ` spaces away.`];
const rat_description = `Rat: Will attack the player if it is next to them. Otherwise it will move 2 spaces closer. After attacking, it will flee.`;
const shadow_scout_description = `Shadow Scout: Will attack the player if it is next to them. Otherwise it will move 1 space closer. Can go invisible every other turn.`

// Area Descriptions.
const ruins_description = `You have entered the ruins.`;
const sewers_description = `You have entered the sewers.`;
const basement_description = `You have entered the basement.`;
const magma_description = `You have entered the magmatic caves.`;
const crypt_description = `You have entered the crypt.`;
const forest_description = `You have entered the subteranean forest.`;
const library_description = `You have entered the library.`;
const sanctum_description = `You have entered the sanctum.`;
const default_area_description = `You have reached the end of the current content. Floors will continue to generate but there will be no more boss fights. Good luck.`;

// Boss Descriptions.
const boss_death_description = `The exit opens.\n`
                                + `You feel your wounds begin to heal.`;
const velociphile_floor_message = `You hear a deafening shriek.`;
const velociphile_description = `Velociphile (Boss): A rolling ball of mouths and hate. Moves in straight lines. Must build up speed to ram you.`;
const velociphile_death_message = `The wailing falls silent as the Velociphile is defeated.`;
const spider_queen_floor_message = `The floor is thick with webs.`;
const spider_queen_description = `Spider Queen (Boss): Moves like a normal spider. Taking damage will stun her, but will also spawn spiders.`;
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
const lava_pool_description = `Lava Pool: Attempting to move through this will hurt.`;
const corrosive_slime_description = `Corrosive Slime: Trying to walk in this will hurt. Clear it out by attacking.`;
const wall_description = `A wall. It seems sturdy.`;
const damaged_wall_description = `A damaged wall. Something might live inside.`;
const lock_description = `The exit is locked. Defeat the boss to continue.`;
const fireball_description = `A fireball. Moves forwards until it comes into contact with something, then damages it.`;
const falling_rubble_description = `Watch out, something is about to fall here.`;


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
 * @typedef {Object} DisplayLibrary The library of functions used to handle displaying things in a specific language.
 * @property {add_tb_row} add_tb_row
 * @property {add_button_row} add_button_row
 * @property {display_message} display_message
 * @property {clear_tb} clear_tb
 * @property {swap_screen} swap_screen
 * @property {select} select
 * @property {press} press
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
            var cell = document.createElement(`input`);
            cell.type = `button`;
            cell.id = `${location} ${row_num} ${i}`;
            if(!(on_click === undefined)){
                cell.onclick = make_on_click(row_contents[i], new Point(i, row_num), on_click);
            }
            cell.value = row_contents[i].description;
            row.append(cell);
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
                DisplayHTML.get_element(`${ui_id.move_buttons} ${Math.floor(key_num / 3)} ${key_num % 3}`).click();
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
            var element = DisplayHTML.get_element(`${ui_id.hand_display} 0 ${key_num}`);
            element && element.click();
        }
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
                                e.enemy.behavior(e.location.copy(), this.get_player_pos().minus(e.location), map, e.enemy);
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
            map.add_tile(new_enemy);
            i -= new_enemy.difficulty;
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
 * @typedef {Object} MapEvent
 * @property {string} type
 * 
 * @property {number=} amount
 * @property {Point[]=} rubble
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
    /** @type {MapEvent[]} Events that will happen at the end of the turn.*/
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
            return false;
        }
        this.#set_grid(location, tile);
        if(tile.type === `enemy`){
            this.#entity_list.add_enemy(location, tile);
        }
        else if(!(tile.type === `empty`)){
            ++this.#entity_list.count_non_empty;
        }
        return true;
    }
    /**
     * Function to display the gamemap and the player's health.
     * Clicking on a tile will give info about it.
     * Resets tiles marked as hit afterwards.
     * @returns {undefined}
     */
    display(){
        // Diplays the gamemap. Each element shows it's description and hp (if applicable) when clicked.
        // If any empty tiles have been marked as hit, it resets the pic to empty.
        // Shows the player's remaining health below.
        display.clear_tb(ui_id.map_display);
        var make_on_click = function(gameMap){
            return function(tile, location){
                var description = tile_description(tile);
                display.display_message(ui_id.display_message, description);
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
                if(tile.ishit !== undefined){
                    backgrounds.push(tile.ishit);
                }
                return backgrounds;
            }
        }        
        for(var y = 0; y < this.#y_max; y++){
            display.add_tb_row(ui_id.map_display, this.#grid[y], TILE_SCALE, make_on_click(this), make_background(this.#area));
        }
        display.clear_tb(ui_id.health_display);
        display_health(this.get_player(), TILE_SCALE);
        this.clear_telegraphs()
	}
    /**
     * Clears all hits and other alternate pics from empty tiles in the grid.
     * @returns {undefined}
     */
    clear_telegraphs(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                var tile = this.#get_grid(new Point(x, y));
                tile.ishit = undefined;
            }
        }
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
        // Triggers the attempted destination's on_move if applicable.
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
                end.on_enter(end_point, start_point.minus(end_point), this, end);
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
        if(target.health !== undefined && !(target.type === `player`) && (hits === `enemy` || hits === `all`)){
            target.health -= 1;
            if(target.on_hit !== undefined){
                var player_pos = this.#entity_list.get_player_pos();
                target.on_hit(location, player_pos.minus(location), this, target);
            }
            if(target.health <= 0){
                this.#set_grid(location, empty_tile());
                this.#get_grid(location).ishit = `${img_folder.tiles}hit.png`;
                if(target.type === `enemy`){
                    if(target.id === undefined){
                        throw new Error(`enemy missing id`)
                    }
                    this.#entity_list.remove_enemy(target.id)
                }
                if(target.on_death !== undefined){
                    var player_pos = this.#entity_list.get_player_pos();
                    target.on_death(location, player_pos.minus(location), this, target);
                }
            }
            return true;
        }
        if(target.type === `player` && (hits === `player` || hits === `all`)){
            if(target.health === undefined){
                throw new Error(`player missing health`);
            }
            target.health -= 1;
            if(target.health === 0){
                throw new Error(`game over`)
            }
            return true;
        }
        if(target.type === `empty`){
            target.ishit = `${img_folder.tiles}hit.png`;
        }
        return false;
    }
    /**
     * Attacks relative to the player's location.
     * @param {Point} direction Relative direction of attack.
     * @returns {boolean} Returns true if the attack hits and false otherwise.
     */
    player_attack(direction){
        // Attacks the given square relative to the player's current positon.
        var pos = this.#entity_list.get_player_pos();
        try{
            return this.attack(pos.plus(direction), `all`);
        }
        catch{
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
     * @returns {undefined}
     */
    lock(){
        var pos = this.#entity_list.get_exit_pos();
        this.#set_grid(pos, lock_tile())
    }
    /**
     * Replaces the lock tile with an exit one and heals the player to max.
     * Throws an error if there is no lock or exit.
     * @returns {undefined}
     */
    unlock(){
        var pos = this.#entity_list.get_exit_pos();
        this.#set_grid(pos, exit_tile());
        var player = this.get_player();
        player.health = player.max_health;
    }
    /**
     * Schedules an event to happen at end of turn.
     * @param {MapEvent} event The even to be added.
     */
    add_event(event){
        this.#events.push(event);
    }
    /**
     * Executes and removed each scheduled event.
     * Throws an error if one that isn't handled tries to happen or the player dies.
     * @returns {undefined}
     */
    resolve_events(){
        var new_events = [];
        for(var i = 0; i < this.#events.length; ++i){
            var event = this.#events[i];
            if(event.type === `earthquake`){
                if(event.amount === undefined){
                    throw new Error(`event is missing field`)
                }
                var rubble = [];
                for(var j = 0; j < event.amount; ++j){
                    var space = this.random_empty();
                    this.#get_grid(space).description = falling_rubble_description;
                    this.#get_grid(space).ishit = `${img_folder.tiles}falling_rubble.png`;
                    rubble.push(space);
                }
                new_events.push({
                    type: `earthquake_rubble`,
                    rubble
                });
            }
            else if(event.type === `earthquake_rubble`){
                if(event.rubble === undefined){
                    throw new Error(`event is missing field`)
                }
                try{
                    for(var j = 0; j < event.rubble.length; ++j){
                        this.attack(event.rubble[j]);
                    }
                }
                catch(error){
                    if(error.message === `game over`){
                        throw new Error(`game over`, {cause: new Error(`falling rubble`)});
                    }
                    throw error;
                }
            }
            else{
                throw new Error(`invalid event type`);
            }
        }
        this.#events = new_events;
    }
    /**
     * Clears the current floor and goes to the next one then generates it based on the current area.
     * @returns {undefined}
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
        display.display_message(ui_id.display_message, floor_description);
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
                this.#get_grid(position).ishit = `${img_folder.tiles}hit_telegraph.png`;
            }
        }
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
        display.display_message(ui_id.title, game_title);
        display.display_message(ui_id.display_message, `${start.description}\n${welcome_message}`);
        this.map = new GameMap(FLOOR_WIDTH, FLOOR_HEIGHT, start); 
        this.map.add_tile(STARTING_ENEMY());
        this.map.display();
        this.map.display_stats(ui_id.stats);
        this.deck = STARTING_DECK();
        this.deck.display_hand(ui_id.hand_display);
        display.display_message(ui_id.shop_instructions, mod_deck);
        display.swap_screen(GAME_SCREEN_DIVISIONS, ui_id.game_screen);
        display.swap_screen(GAME_SCREEN_DIVISIONS, ui_id.stage);
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
        display.display_message(ui_id.display_message, ``);
        try{
            for(var i = 0; i < behavior.length; ++i){
                // Does each valid command in the behavior array.
                this.player_action(behavior[i]);
            }
            display.clear_tb(ui_id.move_buttons);
            this.deck.discard(hand_pos);
            this.map.display();
            await delay(ANIMATION_DELAY);
            await this.map.enemy_turn();
            this.prep_turn();
        }
        catch (error){
            var m = error.message;
            if(m === `floor complete`){
                // If the player has reached the end of the floor.
                this.map.display_stats(ui_id.stats);
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
     */
    player_action(action){
        if(action.type === `attack`){
            this.map.player_attack(action.change);
        }
        else if(action.type === `move`){
            this.map.player_move(action.change);
        }
        else{
            throw new Error(`invalid action type`);
        }
    }
    /** 
     * Sets up the next floor then leaves the shop.
     * @returns {void} 
     */
    new_floor(){
        // Creates the next floor.
        this.map.next_floor();
        this.map.display_stats(ui_id.stats);
        this.map.display();
        this.deck.deal();
        this.deck.display_hand(ui_id.hand_display);
        display.swap_screen(GAME_SCREEN_DIVISIONS, ui_id.stage);
    }
    /** 
     * Preps and swaps to the shop screen.
     * @returns {void} 
     */
    enter_shop(){
        // Gives the player the option to add or remove a card from their deck.
        // Their deck contents are also displayed.
        // Options to remove cards will not be displayed if the deck is at the minimum size already.
        display.clear_tb(ui_id.move_buttons);
        display.clear_tb(ui_id.add_card);
        display.clear_tb(ui_id.remove_card);
        display.clear_tb(ui_id.display_deck);
        this.deck.display_all(ui_id.display_deck);
        this.#generate_add_row(ui_id.add_card);
        this.#generate_remove_row(ui_id.remove_card);
        display.swap_screen(GAME_SCREEN_DIVISIONS, ui_id.shop);
    }
    /** 
     * Creates the row of cards that can be added to the deck.
     * @param {string} table The table where it should be displayed.
    */
    #generate_add_row(table){
        var add_list_generators = rand_no_repeates(CARD_CHOICES, ADD_CHOICE_COUNT);
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
        display.clear_tb(ui_id.hand_display);
        display.clear_tb(ui_id.move_buttons);
        display.display_message(ui_id.display_message, `${game_over_message}${cause}.`);
        display.clear_tb(ui_id.move_buttons);
        var restart = function(message, position){
            display.clear_tb(ui_id.move_buttons);
            this.setup();
        };
        var restart_message = [{
            description: retry_message
        }]
        display.add_button_row(ui_id.move_buttons, restart_message, restart);
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
     * @returns {void}
     */
    prep_turn(){
        this.map.resolve_events();
        this.map.display();
        this.deck.display_hand(ui_id.hand_display);
        this.map.display_stats(ui_id.stats);
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
    if(message.indexOf(`\n`) > -1){
        str_arr = message.split(`\n`);
        for(var i = 0; i < str_arr.length; ++i){
            new_message = `${new_message}${wrap_str(str_arr[i], wrap_length, delimiter)}\n`
        }
    }
    else if(delimiter === undefined){
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
    else{
        str_arr = message.split(delimiter);
        var line = ``
        for(var i = 0; i < str_arr.length; ++i){
            line = `${line}${str_arr[i]}${delimiter}`;
            if(line.length >= wrap_length){
                new_message = `${new_message}${line.slice(0, -1 * delimiter.length)}\n`
                line = ``;
            } 
        }
        if(line.length >= 0){
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


/**
 * Initiates the game when the page is loaded.
 * @returns {undefined}
 */
function initiate_game(){
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
    var start = 40;
    for(var i = start; i < start + 5 && i < CARD_CHOICES.length; ++i){
        deck.add(CARD_CHOICES[i]());
    }
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
    display.add_tb_row(ui_id.health_display, health, scale);
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
     * @returns {undefined}
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
                display.select(ui_id.hand_display, 0, hand_pos.x);
                card.options.show_buttons(ui_id.move_buttons, hand_pos.x);
                var deck = deck;
            }
        }
        display.add_tb_row(table, this.#hand, CARD_SCALE, make_prep_move(this));
    }
    /**
     * Displays the whole decklist
     * @param {string} table Where it should be displayed.
     */
    display_all(table){
        display.display_message(ui_id.current_deck, `${current_deck}${MIN_DECK_SIZE}):`)
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
    return [location.plus(self.direction)];
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
    return move_attack_telegraph(location, map, diagonal_directions);
}
/** @type {TelegraphFunction} */
function porcuslime_horizontal_telegraph(location, map, self){
    return move_attack_telegraph(location, map, horizontal_directions);
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
 */
function shapeshift(tile, tile_generator){
    var look = tile_generator();
    tile.pic = look.pic;
    tile.description = look.description;
    tile.telegraph = look.telegraph;
}

// ----------------Tiles.js----------------
// This file contains the functions to generate tiles representing things on the game_map.

// Fields (not all are used by each tile):
//  type: the category this tile falls under (empty, exit, player, enemy, terrain)
//  name: necessary if it can deal damage or the type has multiple tiles.
//  pic: the picture representing this tile. May be an array if the picture changes.
//  health: how many hits it takes to kill this tile.
//  max_health: prevents healing from increasing health above here.
//  difficulty: how much it costs the floor generator to spawn this.
//  behavior: the logic for what this tile does on it's turn.
//  description: info that will be displayed when the user clicks on the tile.

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
 * @property {AIFunction=} behavior What it does on it's turn.
 * @property {TelegraphFunction=} telegraph Used to show which squares it can attack on it's next turn.
 * @property {AIFunction=} on_enter What it does when something tries to move onto it.
 * @property {AIFunction=} on_hit What it does when attacked.
 * @property {AIFunction=} on_death What it does when killed.
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
 * 
 * // Properties added later //
 * @property {number=} stun When the tile is stunned, it's turn will be skipped.
 * @property {number=} id Given a unique one when added to a EntityList.
 * @property {string=} ishit Used to telegraph and show which spaces have been attacked.
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
        on_death: wall_death
    }
}
/** @type {TileGenerator} A fireball that travels in a straight line until it hits something.*/
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
        telegraph: large_porcuslime_telegraph
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
        telegraph: porcuslime_horizontal_telegraph
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
        behavior: acid_bug_ai,
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
        on_death: boss_death
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
        on_death: boss_death
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
 * @returns {ui_id_library} The library of uiids for that language.
 */
function get_ui_ids(language){
    // Factory function for the display classes (currently only html)
    switch(language){
        case `html`:
            return HTML_UI_ID;
        default:
            throw new Error(`invalid display language`);
    }
}

/**
 * @typedef ui_id_library
 * @property {string} title Displays the title of the game.
 * @property {string} stats Displays the current stats.
 * @property {string} game_screen Controls the visibility of the game itself.
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
 * @property {string} tutorial Controls the visibility of the tutorial screen.
 */


/** @type {ui_id_library} The uiid library for HTML.*/
const HTML_UI_ID = {
    title: `title`,
    stats: `stats`,
    game_screen: `gameScreen`,
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
    tutorial: `tutorial`
}
Object.freeze(HTML_UI_ID);

const ui_id = get_ui_ids(MARKUP_LANGUAGE);

const GAME_SCREEN_DIVISIONS = [ui_id.stage, ui_id.shop, ui_id.chest];
const DISPLAY_DIVISIONS = [ui_id.game_screen, ui_id.tutorial];

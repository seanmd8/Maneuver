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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
function turret_h_ai(location, difference, map, self){
    // Turret version that shoots orthogonally.
    if(difference.x === 0 || difference.y === 0){
        turret_fire_ai(location, difference, map, self);
    }
}
/** @type {AIFunction}*/
function turret_d_ai(location, difference, map, self){
    // Turret version that shoots diagonally.
    if(Math.abs(difference.x) === Math.abs(difference.y)){
        turret_fire_ai(location, difference, map, self);
    }
}
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
function acid_bug_ai(location, difference, map, self){
    // Moves 1 space towards the player.
    var directions = order_nearby(difference);
    for(var i = 0;
        i < directions.length &&
        !map.move(location, location.plus(directions[i]))
        && (self.health === undefined || self.health > 0);
        ++i){}
}
/** @type {AIFunction}*/
function acid_bug_death(location, difference, map, self){
    // On death, attacks each space next to it.
    var attacks = random_nearby();
    for(var i = 0; i < attacks.length; ++i){
        map.attack(location.plus(attacks[i]));
    }
}
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
function corrosive_caterpillar_ai(location, difference, map, self){
    var direction = get_empty_nearby(location, random_nearby(), map);
    if(!(direction === undefined)){
        if(map.move(location, location.plus(direction))){
            map.add_tile(corrosive_slime_tile(), location);
        }
    }
}
/** @type {AIFunction}*/
function corrosive_caterpillar_death(location, difference, map, self){
    map.add_tile(corrosive_slime_tile(), location);
}
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
function vampire_hit(location, difference, map, self){
    if(self.health !== undefined && self.health > 0){
        stun(self);
        teleport_spell(location, difference, map, self);
    }
}
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
function clay_golem_hit(location, difference, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    stun(self);
    self.cycle = 1;
}
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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


// Boss AIs
/** @type {AIFunction}*/
function boss_death(location, difference, map, self){
    if(self.death_message === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    display.display_message(ui_id.display_message, `${self.death_message}\n${boss_death_description}`);
    map.unlock();
}
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
function spider_queen_hit(location, difference, map, self){
    // Spawns a new spider nearby. Stuns it so it won't move right away.
    stun(self);
    var new_spider = spider_tile();
    stun(new_spider);
    spawn_nearby(map, new_spider, location);
}
/** @type {AIFunction}*/
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
        self.cycle = random_num(self.spells.length);
    }
    self.description = `${lich_description}${self.spells[self.cycle].description}`;
    self.pic = self.spells[self.cycle].pic;
}

// Spells
/** @type {AIFunction}*/
function teleport_spell(location, difference, map, self){
    var space = map.random_empty();
    map.move(location, space);
}
/** @type {AIFunction}*/
function summon_spell(location, difference, map, self){
    if(self.summons === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    var tile = self.summons[random_num(self.summons.length)]();
    spawn_nearby(map, tile, location);
}
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
function confusion_spell(location, difference, map, self){
    for(var i = 0; i < 2; ++i){
        var ran = random_num(CONFUSION_CARDS.length);
        GS.give_temp_card(CONFUSION_CARDS[ran]());
    }
}
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
function rest_spell(location, difference, map, self){}

// Other AIs
/** @type {AIFunction}*/
function hazard(location, difference, map, self){
    // General on_move function to retaliate if something tries to move onto it.
    map.attack(location.plus(difference));
}
/** @type {AIFunction}*/
function wall_death(location, difference, map, self){
    var spawn_list = [spider_tile, acid_bug_tile, spider_web_tile, rat_tile];
    if(random_num(10) < 7){
        var ran = random_num(spawn_list.length);
        var new_enemy = spawn_list[ran]();
        stun(new_enemy);
        map.add_tile(new_enemy, location);
    }
}
/** @type {AIFunction}*/
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
/** @type {AIFunction}*/
function fireball_on_enter(location, difference, map, self){
    hazard(location, difference, map, self);
    self.health = 1;
    map.attack(location);
}

// AI Utility Functions
/**
 * @param {Tile} tile 
 * @param {number} [amount = 1]
 */
function stun(tile, amount = 1){
    // Increases a tile's stun.
    if(tile.stun === undefined){
        tile.stun = 0;
    }
    tile.stun += amount;
}
/**
 * @param {Tile} tile 
 * @param {Point} direction 
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
 * @overload
 * @param {number} num
 * @return {number}
 * 
 * @overload
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
 * @returns {number}
 */
function random_sign(){
    // Randomly returns 1 or -1.
    return 2 * random_num(2) - 1;
}
/**
 * @returns {Point[]}
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
 * @param {Point} direction
 * @returns {Point[]}
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
 * @param {Point} location 
 * @param {Point[]} nearby_arr 
 * @param {GameMap} map 
 * @returns {Point | undefined}
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
 * @param {Point} location 
 * @param {GameMap} map 
 * @returns {number}
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
 * @param {GameMap} map 
 * @param {Tile} tile 
 * @param {Point} location 
 * @param {Point[]=} nearby 
 * @returns {Point | undefined}
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
 * @template T
 * @param {T[]} arr 
 * @returns {T[]}
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
 * @template T
 * @param {T[]} arr 
 * @returns {T[]}
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
 * @template T
 * @param {T[]} arr 
 * @returns {T[]}
 */
function reverse_arr(arr){
    var new_arr = [];
    for(var i = arr.length - 1; i >= 0; --i){
        new_arr.push(arr[i]);
    }
    return new_arr;
}
/**
 * @param {number} x 
 * @returns {number}
 */
function random_num(x){
    return Math.floor(Math.random() * x);
}
/**
 * @param {[]} a1 
 * @param {[]} a2
 * @returns {boolean}
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
// ----------------Areas.js----------------
// File containing functions to generate area objects.

const area_end = [generate_default_area];
const area1 = [generate_ruins_area];
const area2 = [/*generate_sewers_area, */generate_basement_area];
const area3 = [/*generate_magma_area, */generate_crypt_area];
const area4 = area_end;//[generate_forest_area, generate_library_area];
const area5 = [generate_sanctum_area];



/**
 * @typedef {object} Area
 * @property {string} background
 * @property {FloorGenerator} generate_floor
 * @property {TileGenerator[]} enemy_list
 * @property {FloorGenerator[]} boss_floor_list
 * @property {AreaGenerator[]} next_area_list
 * @property {string} description
 */

/**
 * @callback AreaGenerator
 * @returns {Area}
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
        enemy_list: [shadow_knight_tile, spider_web_tile, vampire_tile, clay_golem_tile, rat_tile, spider_tile, turret_r_tile, brightling_tile],
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

/** @type {FloorGenerator}*/
function velociphile_floor(floor_num,  area, map){
    map.add_tile(velociphile_tile());
    map.lock();
    for(var i = 0; i < 8; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    return velociphile_floor_message;
}
/** @type {FloorGenerator}*/
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
/** @type {FloorGenerator}*/
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
     * @param {string} description 
     * @param {PlayerCommand[]} behavior 
     * @param {number} [number = 1]
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
     * @param {string} table_name 
     * @param {number} hand_pos 
     */
    show_buttons(table_name, hand_pos){
        // Displays the 3x3 grid to the given table.
        // When one of the buttons with functionality is clicked, the corresponding actions will be performed then it will be discarded.
        display.clear_tb(table_name);

        var make_press_button = function(hand_position){
            return function(button){
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
     * @param {string} direction 
     * @returns {number}
     */
    #convert_direction(direction){
        // Converts a short direction string into the number of the button it should use.
        // Returns -1 if the string doesn't match one in the list.
        var dir_list = [NW, N, NE, W, C, E, SW, S, SE];
        for(var i = 0; i < dir_list.length; ++i){
            if(direction === dir_list[i]){
                return i + 1;
            }
        }
        return -1;
    }
}// ----------------Cards.js----------------
// File containing the logic for each card.


// List of the options that can be given on level up.
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

const CONFUSION_CARDS = [
    stumble_n, stumble_e, stumble_s, stumble_w, stumble_nw, 
    stumble_ne, stumble_se, stumble_sw, freeze_up, lash_out
]

// Makes the starting deck
/** @returns {MoveDeck}*/
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
/** @returns {MoveDeck}*/
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

// command function generators
/**
 * @typedef {object} PlayerCommand
 * @property {string} type
 * @property {Point} change
 */

/**
 * @callback PlayerCommandGenerator
 * @param {number} x
 * @param {number} y
 * @returns {PlayerCommand}
 */

/** @type {PlayerCommandGenerator}*/
function pmove(x, y){
    return {
        type: "move",
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator}*/
function pattack(x, y){
    return {
        type: "attack",
        change: new Point(x, y)
    }
}
// Cards
/**
 * @typedef {Object} Card
 * @property {string} name
 * @property {string} pic
 * @property {ButtonGrid} options
 * 
 * @property {number=} id
 * @property {boolean=} temp
 */
/**
 * @callback CardGenerator
 * @returns {Card}
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

// ----------------Cards.js----------------
// File containing global constants used throughout the program.


// Starting player stats
const PLAYER_STARTING_HEALTH = 3;
const HAND_SIZE = 3;
const ADD_CHOICE_COUNT = 3;
const REMOVE_CHOICE_COUNT = 3;
const MIN_DECK_SIZE = 5;
const BUFF_CHOICE_COUNT = 2;
const BUFF_SPAWN_DENOMINATOR = 4;


// Initialization settings
const STARTING_ENEMY = spider_tile;
const STARTING_DECK = make_starting_deck;
const STARTING_AREA = generate_ruins_area;

// Dungeon generation settings
const FLOOR_WIDTH = 8;
const FLOOR_HEIGHT = 8;
const AREA_SIZE = 5;

// Visual and animation settings
const CARD_SCALE = 90;
const TILE_SCALE = 30;
const ANIMATION_DELAY = 300;
const DECK_DISPLAY_WIDTH = 4;
const TEXT_WRAP_WIDTH = 45;
const MARKUP_LANGUAGE = `html`;


const controls = {
    directional: [`q`, `w`, `e`, `a`, `s`, `d`, `z`, `x`, `c`],
    card: [`h`, `j`, `k`]
}
Object.freeze(controls);

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
const spider_web_description = [`Spider Web: Does not move. Spawns a spider every `, ` turns.`];
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
 * @typedef {Object} CellInfo
 * @property {string} pic
 * @property {string=} name
 * @property {number=} rotate
 * @property {boolean=} flip
 */

/**
 * @typedef {Object} ButtonInfo
 * @property {string} description
 */

/**
 * @callback OnClickFunction
 * @param {CellInfo} tile
 * @param {number} position
 */

/**
 * @callback add_tb_row
 * @param {string} location
 * @param {CellInfo[]} row_contents
 * @param {number} scale
 * @param {OnClickFunction} [on_click = undefined]
 * @param {string} [background = undefined]
 */

/**
 * @callback add_button_row
 * @param {string} location
 * @param {ButtonInfo[]} row_contents
 * @param {OnClickFunction} [on_click = undefined]
 */

/**
 * @callback display_message
 * @param {string} location
 * @param {string} message
 */

/**
 * @callback clear_tb
 * @param {string} location
 */

/**
 * @callback swap_screen
 * @param {string} screen
 */

/**
 * @callback select
 * @param {string} location
 * @param {number} row_num
 * @param {number} column_num
 * @param {number} [border = 3]
 * @param {number} [color = 555]
 */

/**
 * @callback press
 * @param {KeyboardEvent} key_press
 */

/**
 * @typedef {Object} DisplayLibrary
 * @property {add_tb_row} add_tb_row
 * @property {add_button_row} add_button_row
 * @property {display_message} display_message
 * @property {clear_tb} clear_tb
 * @property {swap_screen} swap_screen
 * @property {select} select
 * @property {press} press
 */


/**
 * @param {string} language 
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
 * @callback get_transformation
 * @param {CellInfo} to_display
 * @returns {string}
 */

/**
 * 
 * @callback html_constructor
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
 * @callback get_element
 * @param {string} location
 * @param {function} [type = undefined]
 * @returns {*}
 */

/**
 * @typedef HTML_Helpers
 * @property {get_transformation} get_transformation
 * @property {get_element} get_element
 */


/**
 * @type {DisplayLibrary & HTML_Helpers}
 * 
 */
const DisplayHTML = {
    // Required
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
            if(!(on_click === undefined)){
                cell.onclick = make_on_click(to_display, i, on_click);
            }
            if(to_display.name !== undefined){
                cell.title = to_display.name;
            }
            if(!(background === undefined)){
                var bottom_img = document.createElement(`img`);
                bottom_img.id = `${location} ${row_num} ${i} background img`;
                bottom_img.src = `${img_folder.src}${background}`;
                bottom_img.height = scale;
                bottom_img.width = scale;
                bottom_img.classList.add(`absolute`);
                bottom_img.style.position = `absolute`;
                cell.append(bottom_img);
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
                cell.onclick = make_on_click(row_contents[i], i, on_click);
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
    swap_screen: function(screen){
        switch(screen){
            case ui_id.game_screen:
                DisplayHTML.get_element(ui_id.tutorial, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.game_screen, HTMLDivElement).style.display = `block`;
                break;
            case ui_id.stage:
                DisplayHTML.get_element(ui_id.shop, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.chest, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.stage, HTMLDivElement).style.display = `block`;
                break;
            case ui_id.shop:
                DisplayHTML.get_element(ui_id.stage, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.chest, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.shop, HTMLDivElement).style.display = `block`;
                break;
            case ui_id.chest:
                DisplayHTML.get_element(ui_id.stage, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.shop, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.chest, HTMLDivElement).style.display = `block`;
                break;
            case ui_id.tutorial:
                DisplayHTML.get_element(ui_id.game_screen, HTMLDivElement).style.display = `none`;
                DisplayHTML.get_element(ui_id.tutorial, HTMLDivElement).style.display = `block`;
                break;
            default:
                throw new Error(`invalid screen swap`);
        }
        return;
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

    // Not Required helper function
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

const display = get_display(MARKUP_LANGUAGE);
document.onkeydown = display.press;// ----------------EntityList.js----------------
// EntityList class is used by the GameMap class to keep track of entities without having to search through the map each time.

class EntityList{
    count_non_empty // Keeps track of the number of entities currently in the class.
    #player_pos // Keeps track of the player postion.
    #exit_pos // Keeps track of the position of the exit.
    #enemy_list // A list of each enemy currently on the board and their locations.
    #id_count // Used to give each enemy a unique id as it is added.
    constructor(){
        this.count_non_empty = 2;
        this.#id_count = 0;
        this.#enemy_list = [];
    }
    /**
     * @returns {number}
     */
    next_id(){
        return ++this.#id_count;
    }
    /**
     * @param {Point} location 
     */
    set_player_pos(location){
        this.#player_pos = location;
    }
    /**
     * @returns {Point} 
     */
    get_player_pos(){
        if(this.#player_pos === undefined){
            throw new Error(`player does not exist`);
        }
        return this.#player_pos.copy();
    }
    /**
     * @param {Point} location 
     */
    set_exit(location){
        this.#exit_pos = location;
    }
    /**
     * @returns {Point} 
     */
    get_exit_pos(){
        if(this.#exit_pos === undefined){
            throw new Error(`exit does not exist`);
        }
        return this.#exit_pos.copy();
    }
    /**
     * @param {Point} location 
     * @param {Tile} enemy
     */
    add_enemy(location, enemy){
        enemy.id = this.next_id();
        this.#enemy_list.push({location, enemy});
        ++this.count_non_empty;
    }
    /**
     * @param {Point} location 
     * @param {number} id 
     */
    move_enemy(location, id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(`id not found`);
        }
        this.#enemy_list[index].location = location;
    }
    /**
     * @param {number} id 
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
     * @param {number} id 
     * @returns {number}
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
     * @param {Point} location 
     * @param {Tile} entity 
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
     * @param {GameMap} map 
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
            if(!(this.#find_by_id(e.enemy.id) === -1)){
                try{
                    if(e.enemy.stun !== undefined && e.enemy.stun > 0){
                        --e.enemy.stun;
                    }
                    else{
                        try{
                            e.enemy.behavior(e.location.copy(), this.#player_pos.minus(e.location), map, e.enemy);
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
 * @callback FloorGenerator
 * @param {number} floor_number 
 * @param {Area} area 
 * @param {GameMap} map
 */
/** @type {FloorGenerator}*/
function floor_generator(floor_num, area, map){
    if(!(floor_num % AREA_SIZE === 0) || Math.floor(floor_num / AREA_SIZE) - 1 >= BOSS_FLOOR.length){
        generate_normal_floor(floor_num, area, map);
    }
    else{
        BOSS_FLOOR[Math.floor(floor_num / AREA_SIZE) - 1](floor_num, area, map);
    }
}

/** @type {FloorGenerator}*/
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


// ----------------GameLoop.js----------------
// File contains functions that control the main gameplay.

/**
 * @returns {undefined}
 */
function initiate_game(){
    GS = new GameState();
}

class GameState{
    map;
    deck;
    constructor(){
        this.setup();
    }
    /** @returns {void} */
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
        display.swap_screen(ui_id.game_screen);
        display.swap_screen(ui_id.stage);
    }
    /** 
    * @param {PlayerCommand[]} behavior
    * @param {number} hand_pos 
    */
    async player_turn(behavior, hand_pos){
        // Function to execute the outcome of the player's turn.
        display.display_message(ui_id.display_message, ``);
        try{
            for(var i = 0; i < behavior.length; ++i){
                // Does each valid command in the behavior list.
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
     * @param {PlayerCommand} action 
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
    /** @returns {void} */
    new_floor(){
        // Creates the next floor.
        this.map.next_floor();
        this.map.display_stats(ui_id.stats);
        this.map.display();
        this.deck.deal();
        this.deck.display_hand(ui_id.hand_display);
        display.swap_screen(ui_id.stage);
    }
    /** @returns {void} */
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
        display.swap_screen(ui_id.shop);
    }
    /** 
     * @param {string} table
    */
    #generate_add_row(table){
        var add_list_generators = rand_no_repeates(CARD_CHOICES, ADD_CHOICE_COUNT);
        var add_list = [];
        for(var i = 0; i < add_list_generators.length; ++i){
            add_list[i] = add_list_generators[i]();
        }
        add_list.unshift({pic: `${img_folder.other}plus.png`})
        var make_add_card = function(gamestate){
            return function(card, position){
                if(position > 0){
                    gamestate.deck.add(card);
                    gamestate.new_floor();
                }
            }
        }
        display.add_tb_row(table, add_list, CARD_SCALE, make_add_card(this));
    }
    /** 
     * @param {string} table
     * */
    #generate_remove_row(table){
        var remove_list = this.deck.get_rand_cards(REMOVE_CHOICE_COUNT);
        if(remove_list){
            remove_list.unshift({pic: `${img_folder.other}minus.png`});
        }
        else{
            remove_list.unshift({pic: `${img_folder.other}x.png`});
        }
        var make_remove_card = function(gamestate){
            return function(card, position){
                if(position > 0){
                    gamestate.deck.remove(card.id);
                    gamestate.new_floor();
                }
            }
        }
        display.add_tb_row(table, remove_list, CARD_SCALE, make_remove_card(this));
    }
    /**
    * @param {string} cause 
    */
    game_over(cause){
        // Tells the user the game is over, prevents them fro m continuing, tells them the cause
        // and gives them the chance to retry.
        this.map.display();
        display.clear_tb(ui_id.hand_display);
        display.clear_tb(ui_id.move_buttons);
        display.display_message(ui_id.display_message, `${game_over_message}${cause}.`);
        display.clear_tb(ui_id.move_buttons);
        var restart = function(){
            display.clear_tb(ui_id.move_buttons);
            this.setup();
        };
        var restart_message = [{
            description: retry_message
        }]
        display.add_button_row(ui_id.move_buttons, restart_message, restart);
    }
    /**
     * @param {Card} card 
     */
    give_temp_card(card){
        this.deck.add_temp(card);
    }
    /** @returns {void} */
    prep_turn(){
        this.map.resolve_events();
        this.map.display();
        this.deck.display_hand(ui_id.hand_display);
        this.map.display_stats(ui_id.stats);
    }
}


/**
 * @param {number} ms 
 * @returns {Promise<*>}
 */
function delay(ms){
    // Function to wait the given number of milliseconds.
    return new Promise(resolve =>{
        setTimeout(resolve, ms);
    })
}

/**
 * @template T
 * @param {T} element 
 * @param {T[]} arr 
 * @returns {number}
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
 * @template T
 * @param {T[]} source 
 * @param {number} draws 
 * @returns {T[]}
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
 * @param {Tile} tile 
 * @returns {string}
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
 * @param {Tile} player 
 * @param {number} scale 
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
/**
 * @param {string} message 
 * @param {number} wrap_length 
 * @param {string} [delimiter = undefined]
 * @returns {string}
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
        str_arr = message.split(` `);
        var line = ``
        for(var i = 0; i < str_arr.length; ++i){
            line = `${line}${str_arr[i]} `;
            if(line.length >= wrap_length){
                new_message = `${new_message}${line.slice(0, -1)}\n`
                line = ``;
            } 
        }
        if(line.length >= 0){
            new_message = `${new_message}${line.slice(0, -1)}\n`
        } 
    }
    return new_message.slice(0, -1);
}// ----------------GameMap.js----------------
// GameMap class holds the information on the current floor and everything on it.

/**
 * @typedef {Object} MapEvent
 * @property {string} type
 * 
 * @property {number=} amount
 * @property {Point[]=} rubble
 */

class GameMap{
    #x_max; // Size of the grid's x axis.
    #y_max; // Size of the grid's y axis.
    #entity_list; // entity_list class makes keeping track of entity locations easier.
    #grid; // Grid is a 2d list of tiles representing the entity in each location.
    #floor_num; // The current floor number.
    #turn_count; // How many turns the player has taken.
    #events;
    #area;
    /**
     * @param {number} x_max 
     * @param {number} y_max 
     * @param {*} area 
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
     * @returns {number}
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
     * @returns {Point}
     */
    random_space(){
        // Returns a random space in the grid.
        return new Point(random_num(this.#x_max), random_num(this.#y_max));
    }
    /**
     * @returns {Point}
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
     * @param {Point} location 
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
     * @param {Point} location 
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
     * @param {Point} location 
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
     * @param {Point} player_location
     * @param {Tile} player
     */
    set_player(player_location, player){
        // Places the player. If a non-negative value is given for the player's health, it will be set to that.
        // Throws an error is the space is occupied or out of bounds.
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
     * @param {Tile} tile
     * @param {Point} [location = undefined]
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
     * @returns {undefined}
     */
    display(){
        // Diplays the gamemap. Each element shows it's description and hp (if applicable) when clicked.
        // If any empty tiles have been marked as hit, it resets the pic to empty.
        // Shows the player's remaining health below.
        display.clear_tb(ui_id.map_display);
        var make_on_click = function(gameMap){
            return function(tile){
                var description = tile_description(tile);
                display.display_message(ui_id.display_message, description);
                var gameMap = gameMap;
            }
        }
        for (var y = 0; y < this.#y_max; y++){
            display.add_tb_row(ui_id.map_display, this.#grid[y], TILE_SCALE, make_on_click(this), this.#area.background);
        }
        display.clear_tb(ui_id.health_display);
        display_health(this.get_player(), TILE_SCALE);
        this.clear_empty()
	}
    /**
     * @returns {undefined}
     */
    clear_empty(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                var tile = this.#get_grid(new Point(x, y));
                if(tile.type === `empty`){
                    tile.pic = `${img_folder.tiles}empty.png`;
                    tile.description = empty_description;
                }
            }
        }
    }
    /**
     * @param {Point} start_point 
     * @param {Point} end_point 
     * @returns {boolean}
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
     * @param {Point} direction 
     * @returns {boolean}
     */
    player_move(direction){
        // Moves the player the given relative distance.
        var player_pos = this.#entity_list.get_player_pos();
        return this.move(player_pos, player_pos.plus(direction));
    }
    /**
     * @returns {Tile}
     */
    get_player(){
        // Returns the player's health.
        var pos = this.#entity_list.get_player_pos();
        return this.#get_grid(pos);
    }
    /**
     * @param {Point} location 
     * @param {string} [hits = `all`]
     * @returns {boolean}
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
                this.#get_grid(location).pic = `${img_folder.tiles}hit.png`;
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
            target.pic = `${img_folder.tiles}hit.png`;
        }
        return false;
    }
    /**
     * @param {Point} direction
     * @returns {boolean}
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
     * @returns {Promise<undefined>}
     */
    async enemy_turn(){
        // Causes each enemy to execute their behavior.
        ++this.#turn_count;
        await this.#entity_list.enemy_turn(this);
    }
    /**
     * @param {string} location 
     */
    display_stats(location){
        // Shows the current floor and turn number.
        display.display_message(location, `Floor ${this.#floor_num} Turn: ${this.#turn_count}`);
    }
    /**
     * @returns {undefined}
     */
    lock(){
        // Locks the stairs for a boss fight.
        var pos = this.#entity_list.get_exit_pos();
        this.#set_grid(pos, lock_tile())
    }
    /**
     * @returns {undefined}
     */
    unlock(){
        // Unlocks the stairs after a boss fight.
        // Fully heals the player
        var pos = this.#entity_list.get_exit_pos();
        this.#set_grid(pos, exit_tile());
        var player = this.get_player();
        player.health = player.max_health;
    }
    /**
     * @param {MapEvent} event
     */
    add_event(event){
        this.#events.push(event);
    }
    /**
     * @returns {undefined}
     */
    resolve_events(){
        var new_events = [];
        for(var i = 0; i < this.#events.length; ++i){
            var event = this.#events[i];
            if(event.type === `earthquake`){
                var rubble = [];
                for(var j = 0; j < event.amount; ++j){
                    var space = this.random_empty();
                    this.#get_grid(space).description = falling_rubble_description;
                    this.#get_grid(space).pic = `${img_folder.tiles}falling_rubble.png`;
                    rubble.push(space);
                }
                new_events.push({
                    type: `earthquake_rubble`,
                    rubble
                });
            }
            else if(event.type === `earthquake_rubble`){
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
        }
        this.#events = new_events;
    }
    /**
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
     * @returns {Tile}
     */
    #get_grid(location){
        return this.#grid[location.y][location.x];
    }
    /**
     * @param {Point} location 
     * @param {Tile} value 
     */
    #set_grid(location, value){
        this.#grid[location.y][location.x] = value;
    }
}// ----------------MoveDeck.js----------------
// The MoveDeck class contains the player's current deck of move cards.

class MoveDeck{
    #list; // The list of all cards they have.
    #library; // The list of cards in their draw pile.
    #hand; // The list of cards curently usable.
    #discard_pile; // The list of cards they have used since they reshuffled.
    #id_count; // Used to give each card a unique id.
    constructor(){
        this.#list = [];
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        this.#id_count = 0;
    }
    /**
     * @returns {undefined}
     */
    deal(){
        // Shuffles all cards together then deals a new hand.
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        for(var i = 0; i < this.#list.length; ++i){
            this.#library.push(this.#list[i]);
        }
        this.#library = randomize_arr(this.#library);
        for(var i = 0; i < HAND_SIZE; ++i){
            this.#hand.push(this.#library.pop());
        }
    }
    /**
     * @param {number} hand_pos 
     */
    discard(hand_pos){
        // Makes player discard the card at position x from their hand and draw a new one. 
        // If the library is empty, it will first shuffle in the discard. 
        // Throws an error if x doens't correspond to a card in hand.
        if(hand_pos >= this.#hand.length || hand_pos < 0){
            throw new Error(`hand out of bounds`);
        }
        if(this.#library.length === 0){
            while(this.#discard_pile.length != 0){
                this.#library.push(this.#discard_pile.pop());
            }
            this.#library = randomize_arr(this.#library);
        }
        if(!(this.#hand[hand_pos].temp !== undefined && this.#hand[hand_pos].temp === true)){
            this.#discard_pile.push(this.#hand[hand_pos]);
        }
        this.#hand[hand_pos] = this.#library.pop();
    }
    /**
     * @param {Card} card 
     */
    add(card){
        // Adds a new card to the list.
        card.id = this.#id_count;
        this.#id_count++;
        this.#list.push(card);
    }
    /**
     * @param {Card} card 
     */
    add_temp(card){
        // Adds a temp card which will be removed at the end of the floor by only adding it to the library, not the list
        card.id = this.#id_count;
        card.temp = true;
        this.#id_count++;
        this.#library.push(card);
        this.#library = randomize_arr(this.#library);
    }
    /**
     * @param {string} table 
     */
    display_hand(table){
        // Displays the hand to the given table.
        display.clear_tb(table);
        var make_prep_move = function(deck){
            return function(card, hand_pos){
                display.select(ui_id.hand_display, 0, hand_pos);
                card.options.show_buttons(ui_id.move_buttons, hand_pos);
                var deck = deck;
            }
        }
        display.add_tb_row(table, this.#hand, CARD_SCALE, make_prep_move(this));
    }
    /**
     * @param {string} table 
     */
    display_all(table){
        // Displays the deck list to the given table.
        display.display_message(ui_id.current_deck, `${current_deck}${MIN_DECK_SIZE}):`)
        for(var i = 0; i < Math.ceil(this.#list.length / DECK_DISPLAY_WIDTH); ++i){
            display.add_tb_row(table, this.#list.slice(i * DECK_DISPLAY_WIDTH, (i + 1) * DECK_DISPLAY_WIDTH) ,CARD_SCALE)
            
        }
    }
    /**
     * @param {number} size 
     * @returns {Card[]}
     */
    get_rand_cards(size){
        if(this.#list.length <= MIN_DECK_SIZE){
            return [];
        }
        return rand_no_repeates(this.#list, size);
    }
    /**
     * @param {number} id 
     * @returns {boolean}
     */
    remove(id){
        // Removes the card with the given id from the deck.
        // Returns false if it could not be found.
        for(var i = 0; i < this.#list.length; ++i){
            if(this.#list[i].id === id){
                this.#list[i] = this.#list[this.#list.length - 1];
                this.#list.pop();
                return true;
            }
        }
        return false;
    }
}
class Point{
    x;
    y;
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    /**
     * @param {Point | number} p2 
     * @returns {Point}
     */
    plus(p2){
        return this.copy().plus_equals(p2);
    }
    /**
     * @param {Point | number} p2 
     * @returns {Point}
     */
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
    /**
     * @param {Point | number} p2 
     * @returns {Point}
     */
    minus(p2){
        return this.copy().minus_equals(p2);
    }
    /**
     * @param {Point | number} p2 
     * @returns {Point}
     */
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
    /**
     * @param {Point | number} p2 
     * @returns {Point}
     */
    times(p2){
        return this.copy().times_equals(p2);
    }
    /**
     * @param {Point | number} p2 
     * @returns {Point}
     */
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
     * @param {number} radius
     * @returns {boolean}
     */
    within_radius(radius){
        return Math.abs(this.x) <= radius && Math.abs(this.y) <= radius;
    }
    /**
     * @returns {Point}
     */
    copy(){
        return new Point(this.x, this.y);
    }
}

/**
 * @param {Point} p1 
 * @param {Point} p2 
 * @returns  {boolean}
 */
function point_equals(p1, p2){
    if(p1.x !== undefined && p1.y !== undefined && p2.x !== undefined && p2.y !== undefined){
        return p1.x === p2.x && p1.y === p2.y;
    }
    else{
        throw Error(`invalid type`);
    }
}// ----------------Tiles.js----------------
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
 * @typedef {object} Tile
 * 
 * @property {string} type
 * @property {string} name
 * @property {string} pic
 * @property {string} description
 * 
 * @property {number=} stun
 * @property {number=} id
 * 
 * @property {number=} health
 * @property {number=} max_health
 * @property {number=} difficulty
 * 
 * @property {string[]=} pic_arr
 * @property {number=} cycle
 * @property {Point=} direction
 * @property {number=} spin_direction
 * @property {number=} rotate
 * @property {boolean=} flip
 * 
 * @property {AIFunction=} behavior
 * @property {AIFunction=} on_enter
 * @property {AIFunction=} on_hit
 * @property {AIFunction=} on_death
 * @property {string=} death_message
 * 
 * 
 * @property {number=} spawn_timer
 * @property {number=} range
 * @property {Spell[]=} spells
 * @property {TileGenerator[]=} summons
 */

/**
 * @callback TileGenerator
 * @returns {Tile}
 */


// This is a list of all the enemies that can be spawned on a normal floor.
const ENEMY_LIST = [spider_tile, turret_h_tile, turret_d_tile, turret_r_tile, shadow_knight_tile, 
    scythe_tile, spider_web_tile, ram_tile, large_porcuslime_tile, medium_porcuslime_tile, 
    acid_bug_tile, brightling_tile, corrosive_caterpillar_tile, noxious_toad_tile, vampire_tile,
    clay_golem_tile, vinesnare_bush_tile, rat_tile];

// Non-Enemy tiles

/** @type {TileGenerator} */
function empty_tile(){
    return {
        type: `empty`,
        name: `empty`,
        pic: `${img_folder.tiles}empty.png`,
        description: empty_description
    }
}
/** @type {TileGenerator} */
function exit_tile(){
    return {
        type: `exit`,
        name: `exit`,
        pic: `${img_folder.tiles}stairs.png`,
        description: exit_description
    }
}
/** @type {TileGenerator} */
function lock_tile(){
    return {
        type: `terrain`,
        name: `lock`,
        pic: `${img_folder.tiles}lock.png`,
        description: lock_description
    }
}
/** @type {TileGenerator} */
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
/** @type {TileGenerator} */
function lava_pool_tile(){
    return {
        type: `terrain`,
        name: `lava pool`,
        pic: `${img_folder.tiles}lava_pool.png`,
        description: lava_pool_description,
        on_enter: hazard
    }
}
/** @type {TileGenerator} */
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
/** @type {TileGenerator} */
function wall_tile(){
    return {
        type: `terrain`,
        name: `wall`,
        pic: `${img_folder.tiles}wall.png`,
        description: wall_description
    }
}
/** @type {TileGenerator} */
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
/** @type {TileGenerator} */
function fireball_tile(){
    var pic_arr = [`${img_folder.tiles}fireball_n.png`, `${img_folder.tiles}fireball_nw.png`];
    return {
        type: `enemy`,
        name: `fireball`,
        pic: `${img_folder.tiles}fireball.png`,
        description: fireball_description,
        pic_arr,
        direction: undefined,
        rotate: 0,
        behavior: fireball_ai,
        on_enter: fireball_on_enter
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
        behavior: spider_ai
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
    }
}
/** @type {TileGenerator} */
function turret_d_tile(){
    return {
        type: `enemy`,
        name: `turret`,
        pic: `${img_folder.tiles}turret_d.png`,
        health: 1,
        difficulty: 2,
        behavior: turret_d_ai,
        description: turret_d_description
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
        pic_arr,
        cycle: starting_cycle,
        spin_direction,
        flip: (spin_direction === -1),
        rotate: starting_rotation,
        health: 1,
        difficulty: 2,
        behavior: turret_r_ai,
        description: turret_r_description
    }
}
/** @type {TileGenerator} */
function scythe_tile(){
    return{
        type: `enemy`,
        name: `scythe`,
        pic: `${img_folder.tiles}scythe.png`,
        rotate: 90 * random_num(4),
        health: 1,
        difficulty: 3,
        behavior: scythe_ai,
        description: scythe_description
    }
}
/** @type {TileGenerator} */
function shadow_knight_tile(){
    return{
        type: `enemy`,
        name: `shadow knight`,
        pic: `${img_folder.tiles}shadow_knight.png`,
        health: 2,
        difficulty: 4,
        behavior: shadow_knight_ai,
        description: shadow_knight_description
    }
}
/** @type {TileGenerator} */
function spider_web_tile(){
    var spawn_timer = 2
    return{
        type: `enemy`,
        name: `spider egg`,
        pic: `${img_folder.tiles}spider_web.png`,
        cycle: 0,
        spawn_timer,
        health: 1,
        difficulty: 4,
        behavior: spider_web_ai,
        description: `${spider_web_description[0]}${spawn_timer + 1}${spider_web_description[1]}`
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
        pic_arr,
        cycle: starting_cycle,
        health: 2,
        difficulty: 5,
        behavior: ram_ai,
        description: ram_description
    }
}
/** @type {TileGenerator} */
function large_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `large porcuslime`,
        pic: `${img_folder.tiles}large_porcuslime.png`,
        health: 3,
        difficulty: 8,
        behavior: large_porcuslime_ai,
        description: large_porcuslime_description
    }
}
/** @type {TileGenerator} */
function medium_porcuslime_tile(){
    var ran = random_num(2);
    var pic_arr = [`${img_folder.tiles}medium_h_porcuslime.png`, `${img_folder.tiles}medium_d_porcuslime.png`];
    return {
        type: `enemy`,
        name: `medium porcuslime`,
        pic: pic_arr[ran],
        pic_arr,
        cycle: ran,
        health: 2,
        difficulty: 5,
        behavior: medium_porcuslime_ai,
        description: medium_porcuslime_description
    }
}
/** @type {TileGenerator} */
function small_h_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `small porcuslime`,
        pic: `${img_folder.tiles}small_h_porcuslime.png`,
        health: 1,
        difficulty: 3,
        behavior: porcuslime_horizontal_ai,
        description: small_h_porcuslime_description
    }
}
/** @type {TileGenerator} */
function small_d_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `small porcuslime`,
        pic: `${img_folder.tiles}small_d_porcuslime.png`,
        health: 1,
        difficulty: 3,
        behavior: porcuslime_diagonal_ai,
        description: small_d_porcuslime_description
    }
}
/** @type {TileGenerator} */
function acid_bug_tile(){
    return {
        type: `enemy`,
        name: `acid bug`,
        pic: `${img_folder.tiles}acid_bug.png`,
        health: 1,
        difficulty: 3,
        behavior: acid_bug_ai,
        on_death: acid_bug_death,
        description: acid_bug_description
    }
}
/** @type {TileGenerator} */
function brightling_tile(){
    var starting_cycle = 0;
    return{
        type: `enemy`,
        name: `brightling`,
        pic: `${img_folder.tiles}brightling.png`,
        cycle: starting_cycle,
        health: 1,
        difficulty: 4,
        behavior: brightling_ai,
        description: brightling_description
    }
}
/** @type {TileGenerator} */
function corrosive_caterpillar_tile(){
    return {
        type: `enemy`,
        name: `corrosive caterpillar`,
        pic: `${img_folder.tiles}corrosive_caterpillar.png`,
        health: 1,
        difficulty: 2,
        behavior: corrosive_caterpillar_ai,
        on_death: corrosive_caterpillar_death,
        description: corrosive_caterpillar_description
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
        pic_arr,
        cycle: starting_cycle,
        health: 1,
        difficulty: 4,
        behavior: noxious_toad_ai,
        description: noxious_toad_description
    }
}
/** @type {TileGenerator} */
function vampire_tile(){
    return {
        type: `enemy`,
        name: `vampire`,
        pic: `${img_folder.tiles}vampire.png`,
        health: 2,
        max_health: 2,
        difficulty: 5,
        behavior: vampire_ai,
        on_hit: vampire_hit,
        description: vampire_description
    }
}
/** @type {TileGenerator} */
function clay_golem_tile(){
    return {
        type: `enemy`,
        name: `clay golem`,
        pic: `${img_folder.tiles}clay_golem.png`,
        cycle: 1,
        health: 3,
        difficulty: 4,
        behavior: clay_golem_ai,
        on_hit: clay_golem_hit,
        description: clay_golem_description
    }
}
/** @type {TileGenerator} */
function vinesnare_bush_tile(){
    var range = 3;
    var pic_arr = [`${img_folder.tiles}vinesnare_bush_lashing.png`, `${img_folder.tiles}vinesnare_bush_rooted.png`];
    return {
        type: `enemy`,
        name: `vinesnare bush`,
        pic: pic_arr[1],
        pic_arr,
        cycle: 1,
        health: 1,
        difficulty: 4,
        behavior: vinesnare_bush_ai,
        description: `${vinesnare_bush_description[0]}${range}${vinesnare_bush_description[1]}`,
        range
    }
}
/** @type {TileGenerator} */
function rat_tile(){
    return {
        type: `enemy`,
        name: `rat`,
        pic: `${img_folder.tiles}rat.png`,
        cycle: 1,
        flip: random_num(2) === 0,
        health: 1,
        difficulty: 2,
        behavior: rat_ai,
        description: rat_description
    }
}

// Boss Tiles
/** @type {TileGenerator} */
function velociphile_tile(){
    return{
        type: `enemy`,
        name: `velociphile`,
        pic: `${img_folder.tiles}velociphile.png`,
        health: 3,
        behavior: velociphile_ai,
        on_death: boss_death,
        description: velociphile_description,
        death_message: velociphile_death_message
    }
}
/** @type {TileGenerator} */
function spider_queen_tile(){
    return{
        type: `enemy`,
        name: `spider queen`,
        pic: `${img_folder.tiles}spider_queen.png`,
        health: 3,
        behavior: spider_ai,
        on_hit: spider_queen_hit,
        on_death: boss_death,
        description: spider_queen_description,
        death_message: spider_queen_death_message
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
        spider_tile,
        scythe_tile,
        shadow_knight_tile,
        ram_tile,
        medium_porcuslime_tile,
        clay_golem_tile,
        rat_tile
    ];
    var starting_cycle = 1;
    return{
        type: `enemy`,
        name: `lich`,
        pic: spells[starting_cycle].pic,
        health: 4,
        behavior: lich_ai,
        cycle: starting_cycle,
        spells,
        summons,
        on_death: boss_death,
        description: `${lich_description}${spells[starting_cycle].description}`,
        death_message: lich_death_message
    }
}
/**
 * @typedef Spell
 * @property {AIFunction} behavior
 * @property {string} description
 * @property {string} pic
 */

/**
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


/**
 * 
 * @param {string} language 
 * @returns {ui_id_library}
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
 * @property {string} title
 * @property {string} stats
 * @property {string} game_screen
 * @property {string} stage
 * @property {string} map_display
 * @property {string} health_display
 * @property {string} hand_display
 * @property {string} move_buttons
 * @property {string} display_message
 * @property {string} shop
 * @property {string} shop_instructions
 * @property {string} add_card
 * @property {string} remove_card
 * @property {string} current_deck
 * @property {string} display_deck
 * @property {string} chest
 * @property {string} tutorial
 */


/** @type {ui_id_library}*/
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
// ----------------AI.js----------------
// File containing the logic for attacks, movements and other effects of non-player entities.

// Parameters:
//  x: the x location of this entity on the game map.
//  y: the y location of this entity on the game map.
//  x_dif: the difference between the x value of this and the target (generally the player).
//  y_dif: the difference between the y value of this and the target (generally the player).
//  map: the game map.
//  enemy: the tile of the entity using the function.


// Normal Enemy AIs
function spider_ai(x, y, x_dif, y_dif, map, enemy){
    if(Math.abs(x_dif) <= 1 && Math.abs(y_dif) <= 1){
        // If the player is next to it, attack.
        map.attack(x + x_dif, y + y_dif, `player`);
    }
    else{
        // Otherwise, move closer.
        var directions = order_nearby(x_dif, y_dif);
        for(var i = 0; i < directions.length && !map.move(x, y, x + directions[i][0], y + directions[i][1]); ++i){}
    }
}
function turret_h_ai(x, y, x_dif, y_dif, map, enemy){
    // Turret version that shoots orthogonally.
    if(x_dif === 0 || y_dif === 0){
        turret_fire_ai(x, y, x_dif, y_dif, map, enemy);
    }
}
function turret_d_ai(x, y, x_dif, y_dif, map, enemy){
    // Turret version that shoots diagonally.
    if(Math.abs(x_dif) === Math.abs(y_dif)){
        turret_fire_ai(x, y, x_dif, y_dif, map, enemy);
    }
}
function turret_r_ai(x, y, x_dif, y_dif, map, enemy){
    switch(enemy.cycle){
        case 0:
            if(x_dif === 0){
                // Fires N and S.
                turret_fire_ai(x, y, x_dif, y_dif, map, enemy);
            }
            break;
        case 1:
            if(x_dif === -1 * y_dif){
                // Fires NE and SW.
                turret_fire_ai(x, y, x_dif, y_dif, map, enemy);
            }
            break;
        case 2:
            if(y_dif === 0){
                // Fires E and W.
                turret_fire_ai(x, y, x_dif, y_dif, map, enemy);
            }
            break;
        case 3:
            if(x_dif === y_dif){
                // Fires SE and NW.
                turret_fire_ai(x, y, x_dif, y_dif, map, enemy);
            }
            break;
        default:
            throw Error(`Improper case for ${enemy.name}`);
    }
    // Rotate.
    enemy.cycle = (enemy.cycle + enemy.direction + 4) % 4;
    enemy.pic = enemy.pic_arr[enemy.cycle % 2];
    if(!enemy.flip){
        enemy.rotate = 90 * Math.floor(enemy.cycle / 2);
    }
    else{
        enemy.rotate = 90 * Math.floor(((enemy.cycle + 1) % 4) / 2);
    }
}
function turret_fire_ai(x, y, x_dif, y_dif, map, enemy){
    // Fires a shot in the direction of the player.
    var x_direction = sign(x_dif);
    var y_direction = sign(y_dif);
    try{
        for(var i = 1; !map.attack(x + i * x_direction, y + i * y_direction); ++i){ 
            map.check_bounds(x + i * x_direction, y + i * y_direction);
        }
    }
    catch(error){
        if(!(error.message === `x out of bounds` || error.message === `y out of bounds`)){
            throw error;
        }
    }
}
function scythe_ai(x, y, x_dif, y_dif, map, enemy){
    var distance = 3;
    var direction = [sign(x_dif), sign(y_dif)];
    if(direction[0] === 0 || direction[1] === 0){
        // If the player is orthogonal, moves randomly.
        direction = [random_sign(), random_sign()];
    }
    // Rotate image based on direction.
    enemy.rotate = 90 * (direction[0] + direction[1] + 2) / 2;
    if(direction[0] === -1 && direction[1] === 1){
        enemy.rotate = 90 * 3;
    }
    for(var i = 0; i < distance && map.move(x, y, x + direction[0], y + direction[1]) ; ++i){
        // moves <distance> spaces attacking each space it passes next to.
        x += direction[0];
        y += direction[1];
        map.attack(x - direction[0], y, `player`);
        map.attack(x, y - direction[1], `player`); 
    }
}
function shadow_knight_ai(x, y, x_dif, y_dif, map, enemy){
    // Moves in an L.
    if(Math.abs(x_dif) === 1 && Math.abs(y_dif) === 1){
        // If the player is next to it diagonally, attempty to reposition to attack them next turn.
        if(!map.move(x, y, x + (2 * sign(x_dif)), y + (-1 * sign(y_dif)))){
            map.move(x, y, x + (-1 * sign(x_dif)), y + (2 * sign(y_dif)));
        }
        return;
    }
    if(Math.abs(x_dif) + Math.abs(y_dif) === 3){
        if(x_dif === 1 || x_dif === -1 || y_dif === 1 || y_dif === -1){
            // If the player is a L away, attak them then try to move past them.
            map.attack(x + x_dif, y + y_dif, `player`);
            map.move(x, y, x + x_dif * 2, y + y_dif * 2);
            return;
        }
    }
    // Otherwise, attempt to move closer
    if(Math.abs(x_dif) >= Math.abs(y_dif)){
        var new_x = 2;
        var new_y = 1;
    }
    else{
        var new_x = 1;
        var new_y = 2;
    }
    if(x_dif < 0){
        new_x *= -1;
    }
    if(y_dif < 0){
        new_y *= -1;
    }
    map.move(x, y, x + new_x, y + new_y);
}
function spider_web_ai(x, y, x_dif, y_dif, map, enemy){
    if(enemy.cycle < enemy.spawn_timer){
        // If the cycle hasn't reached the spawn timer, increments it.
        ++enemy.cycle;
    }
    else{
        // Attempts to spawn a spider nearby and resets cycle.
        spawn_nearby(map, spider_tile(), x, y);
        enemy.cycle = 0;
    }
}
function ram_ai(x, y, x_dif, y_dif, map, enemy){
    var x_direction = sign(x_dif);
    var y_direction = sign(y_dif);
    var wander_speed = 2;
    if(enemy.cycle === 0){
        // moves <wander_speed> closer to a row or column that the player is in.
        var moved = true;
        if(Math.abs(x_dif) <= Math.abs(y_dif)){
            for(var i = 0; i < wander_speed && i < Math.abs(x_dif) && moved; ++i){
                moved = map.move(x, y, x + x_direction, y);
                x += x_direction;
            }
        }
        else{
            for(var i = 0; i < wander_speed && i < Math.abs(y_dif) && moved; ++i){
                moved = map.move(x, y, x, y + y_direction);
                y += y_direction;
            }
        }
        if(moved === true && (Math.abs(x_dif) < 3 || Math.abs(y_dif) < 3)){
            // If it sees them, prepares to charge.
            enemy.cycle = 1;
            enemy.pic = enemy.pic_arr[enemy.cycle];
        }
    }
    else{
        // Charges orthogonally until it hits something and rams it.
        // Reverts to wandering after.
        var moved = true;
        if(Math.abs(x_dif) > Math.abs(y_dif)){
            while(moved){
                moved = map.move(x, y, x + x_direction, y);
                x += x_direction;
            }
            map.attack(x, y);
        }
        else{
            while(moved){
                moved = map.move(x, y, x, y + y_direction);
                y += y_direction;
            }
            map.attack(x, y);
        }
        enemy.cycle = 0;
        enemy.pic = enemy.pic_arr[enemy.cycle];
    }
}
function large_porcuslime_ai(x, y, x_dif, y_dif, map, enemy){
    if(enemy.health === 2){
        // If health is 2, turns into the medium version.
        map.attack(x, y);
        map.attack(x, y);
        map.add_tile(medium_porcuslime_tile(), x, y);
        return;
    }
    if(enemy.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(x, y);
        spawn_nearby(map, small_d_porcuslime_tile(), x, y);
        spawn_nearby(map, small_h_porcuslime_tile(), x, y);
        return;
    }
    if(-1 <= x_dif && x_dif <= 1 && -1 <= y_dif && y_dif <= 1){
        // If the player is next to it, attacks.
        map.attack(x + x_dif, y + y_dif);
    }
    else{
        // Otherwise moves closer and attacks in that direction.
        x_dif = sign(x_dif);
        y_dif = sign(y_dif);
        var moved = map.move(x, y, x + x_dif, y + y_dif);
        if(moved){
            map.attack(x + (2 * x_dif), y + (2 * y_dif));
        }
    }
}
function medium_porcuslime_ai(x, y, x_dif, y_dif, map, enemy){
    if(enemy.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(x, y);
        spawn_nearby(map, small_d_porcuslime_tile(), x, y);
        spawn_nearby(map, small_h_porcuslime_tile(), x, y);
        return;
    }
    if(enemy.cycle === 0){
        // If cycle is at 0, direction will be orthogonally towards the player.
        if(Math.abs(x_dif) > Math.abs(y_dif)){
            var dir = [sign(x_dif), 0];
        }
        else{
            var dir = [0, sign(y_dif)];
        }
    }
    else{
        // If cycle is at 1, direction will be diagonally towards the player.
        var dir = [sign(x_dif), sign(y_dif)];
        for(var i = 0; i < dir.length; ++i){
            if(dir[i] === 0){
                dir[i] = random_sign();
            }
        }
    }
    // Moves then attacks in that direction.
    var moved = map.move(x, y, x + dir[0], y + dir[1]);
    if(moved){
        map.attack(x + (2 * dir[0]), y + (2 * dir[1]));
    }
    else{
        map.attack(x + dir[0], y + dir[1]);
    }
    // Swaps cycle and picture between the two.
    enemy.cycle = 1 - enemy.cycle;
    enemy.pic = enemy.pic_arr[enemy.cycle];
}
function small_h_porcuslime_ai(x, y, x_dif, y_dif, map, enemy){
    // Small version which moves  then attacks orthogonally.
    if(Math.abs(x_dif) > Math.abs(y_dif)){
        var dir = [sign(x_dif), 0];
    }
    else{
        var dir = [0, sign(y_dif)];
    }
    var moved = map.move(x, y, x + dir[0], y + dir[1]);
    if(moved){
        map.attack(x + (2 * dir[0]), y + (2 * dir[1]));
    }
    else{
        map.attack(x + dir[0], y + dir[1]);
    }
}
function small_d_porcuslime_ai(x, y, x_dif, y_dif, map, enemy){
    // Small version which moves  then attacks diagonally.
    var dir = [sign(x_dif), sign(y_dif)];
    for(var i = 0; i < dir.length; ++i){
        if(dir[i] === 0){
            dir[i] = random_sign();
        }
    }
    var moved = map.move(x, y, x + dir[0], y + dir[1]);
    if(moved){
        map.attack(x + (2 * dir[0]), y + (2 * dir[1]));
    }
    else{
        map.attack(x + dir[0], y + dir[1]);
    }
}
function acid_bug_ai(x, y, x_dif, y_dif, map, enemy){
    // Moves 1 space towards the player.
    var directions = order_nearby(x_dif, y_dif);
    for(var i = 0;
        i < directions.length &&
        !map.move(x, y, x + directions[i][0], y + directions[i][1])
        && enemy.health > 0;
        ++i){}
}
function acid_bug_death(x, y, x_dif, y_dif, map, enemy){
    // On death, attacks each space next to it.
    var attacks = random_nearby();
    for(var i = 0; i < attacks.length; ++i){
        map.attack(x + attacks[i][0], y + attacks[i][1]);
    }
}
function brightling_ai(x, y, x_dif, y_dif, map, enemy){
    if(enemy.cycle === -1){
        // teleports to a random empty space, then cycle goes to 1.
        teleport_spell(x, y, x_dif, y_dif, map, enemy);
        ++enemy.cycle;
    }
    else if(random_num(4) < enemy.cycle){
        // Teleports the player next to it then cycle goes to 0 to prepare to teleport.
        var near_points = random_nearby();
        for(var i = 0; i < near_points.length && !map.move(x + x_dif, y + y_dif, x + near_points[i][0], y + near_points[i][1]); ++i){}
        enemy.cycle = -1;
        // Since player has been moved, it returns to their turn.
        throw new Error(`pass to player`);
    }
    else{
        // Moves 2 spaces randomly.
        var near_points = random_nearby();
        for(var i = 0; i < 2; ++i){
            var moved = map.move(x, y, x + near_points[i][0], y + near_points[i][1]);
            if(moved){
                x = x + near_points[i][0];
                y = y + near_points[i][1];
            }
        }
        ++enemy.cycle;
    }
}
function corrosive_caterpillar_ai(x, y, x_dif, y_dif, map, enemy){
    var direction = get_empty_nearby(x, y, random_nearby(), map);
    if(!(direction === false)){
        if(map.move(x, y, x + direction[0], y + direction[1])){
            map.add_tile(corrosive_slime_tile(), x, y);
        }
    }
}
function corrosive_caterpillar_death(x, y, x_dif, y_dif, map, enemy){
    map.add_tile(corrosive_slime_tile(), x, y);
}
function noxious_toad_ai(x, y, x_dif, y_dif, map, enemy){
    if(enemy.cycle === 0){
        var directions = order_nearby(x_dif, y_dif);
        var moved = false;
        for(var i = 0; i < directions.length && !moved; ++i){
            if(directions[i][0] === 0 || directions[i][1] === 0){
                moved = map.move(x, y, x + (2 * directions[i][0]), y + (2 * directions[i][1]));
                if(moved){
                    x += (2 * directions[i][0]);
                    y += (2 * directions[i][1]);
                    x_dif -= (2 * directions[i][0]);
                    y_dif -= (2 * directions[i][1]);
                }
            }
        }
        if(moved){
            enemy.cycle = 1;
            if(Math.abs(x_dif) <= 1 && Math.abs(y_dif) <= 1){
                for(var i = 0; i < directions.length; ++i){
                    map.attack(x+ directions[i][0], y + directions[i][1]);
                }
            }
        }
    }
    else{
        enemy.cycle = 0;
    }
    enemy.pic = enemy.pic_arr[enemy.cycle]
}
function vampire_ai(x, y, x_dif, y_dif, map, enemy){
    var player_pos = [x + x_dif, y + y_dif];
    var target_spaces = [[player_pos[0] + 1, player_pos[1] + 1], 
                        [player_pos[0] - 1, player_pos[1] + 1], 
                        [player_pos[0] + 1, player_pos[1] - 1], 
                        [player_pos[0] - 1, player_pos[1] - 1]];
    target_spaces = randomize_arr(target_spaces);
    var moved = false;
    for(var i = 0; i < target_spaces.length && !moved; ++i){
        var target = target_spaces[i];
        if(Math.abs(target[0] - x) + Math.abs(target[1] - y) === 1){
            moved = map.move(x, y, target[0], target[1]);
        }
    }
    if(moved && map.attack(x + x_dif, y + y_dif) && enemy.health < enemy.max_health){
        ++enemy.health;
    }
    if(!moved){
        var directions = order_nearby(x_dif, y_dif);
        for(var i = 0; i < directions.length && !moved; ++i){
            var direction = directions[i]
            if(direction[0] === 0 || direction[1] === 0){
                moved = map.move(x, y, x + direction[0], y + direction[1]);
            }
            
        }
    }
}
function vampire_hit(x, y, x_dif, y_dif, map, enemy){
    if(enemy.health > 0){
        stun(enemy);
        teleport_spell(x, y, x_dif, y_dif, map, enemy);
    }
}
function clay_golem_ai(x, y, x_dif, y_dif, map, enemy){
    if(Math.abs(x_dif) <= 1 && Math.abs(y_dif) <= 1){
        // If the player is next to it, attack.
        map.attack(x + x_dif, y + y_dif, `player`);
        enemy.cycle = 1;
    }
    else if(enemy.cycle === 1){
        // Otherwise, move closer.
        var directions = order_nearby(x_dif, y_dif);
        for(var i = 0; i < directions.length && !map.move(x, y, x + directions[i][0], y + directions[i][1]); ++i){}
        enemy.cycle = 0;
    }
    else{
        enemy.cycle = 1;
    }
}
function clay_golem_hit(x, y, x_dif, y_dif, map, enemy){
    stun(enemy);
    enemy.cycle = 1;
}
function vinesnare_bush_ai(x, y, x_dif, y_dif, map, enemy){
    var moved = false;
    if(Math.abs(x_dif) <= 1 && Math.abs(y_dif) <= 1){
        // If the player is next to it, attack.
        map.attack(x + x_dif, y + y_dif, `player`);
    }
    else if(enemy.cycle > 0 && Math.abs(x_dif) <= enemy.range && Math.abs(y_dif) <= enemy.range){
        var sign_x = sign(x_dif);
        var sign_y = sign(y_dif);
        if(x_dif === 0 || y_dif === 0 || Math.abs(x_dif) === Math.abs(y_dif)){
            for(var i = Math.max(Math.abs(x_dif), Math.abs(y_dif));
                i > 1 &&
                map.move(x + i * sign_x, y + i * sign_y, x + (i - 1) * sign_x, y + (i - 1) * sign_y);
                --i){
                    moved = true;
                }
            
        }
    }
    if(moved){
        enemy.cycle = 0;
        enemy.pic = enemy.pic_arr[0];
        throw new Error(`pass to player`);
    }
    if(++enemy.cycle > 0){
        enemy.pic = enemy.pic_arr[1];
    }
}
function rat_ai(x, y, x_dif, y_dif, map, enemy){
    if(enemy.cycle >= 1 && Math.abs(x_dif) <= 1 && Math.abs(y_dif) <= 1){
        // If the player is next to it, attack.
        map.attack(x + x_dif, y + y_dif, `player`);
        enemy.cycle = -1;
    }
    // Otherwise, move closer.
    for(var i = 0; i < 2; ++i){
        var directions = order_nearby(x_dif, y_dif);
        if(enemy.cycle <= 0){
            directions = reverse_arr(directions);
        }
        var moved = false;
        for(var j = 0; j < directions.length && !moved; ++j){
            moved = map.move(x, y, x + directions[j][0], y + directions[j][1]);
            if(moved){
                x += directions[j][0];
                x_dif -= directions[j][0];
                y += directions[j][1];
                y_dif -= directions[j][1];
                if(directions[j][0] < 0){
                    enemy.flip = false;
                }
                if(directions[j][0] > 0){
                    enemy.flip = true;
                }
            }
        }
    }
    ++enemy.cycle;
}


// Boss AIs
function boss_death(x, y, x_dif, y_dif, map, enemy){
    display.display_message(ui_id.display_message, `${enemy.death_message}\n${boss_death_description}`);
    map.unlock();
}
function velociphile_ai(x, y, x_dif, y_dif, map, enemy){
    // Moves towards the player 2/3 of the time, otherwise moves randomly.
    var directions = order_nearby(x_dif, y_dif);
    if(random_num(3) === 0){
        directions = randomize_arr(directions);
    }
    // Direction is reselected until an unobstructed one is found.
    var direction = get_empty_nearby(x, y, directions, map);
    if(!(direction === false)){
        // Moves in the chosen direction until it hits something, which it then attacks.
        while(map.move(x, y, x + direction[0], y + direction[1])){
            x += direction[0];
            y += direction[1];
        }
        map.attack(x + direction[0], y + direction[1]);
    }
}
function spider_queen_hit(x, y, x_dif, y_dif, map, enemy){
    // Spawns a new spider nearby. Stuns it so it won't move right away.
    stun(enemy);
    var new_spider = spider_tile();
    stun(new_spider);
    spawn_nearby(map, new_spider, x, y);
}
function lich_ai(x, y, x_dif, y_dif, map, enemy){
    var player_close = (Math.abs(x_dif) <= 1 && Math.abs(y_dif) <= 1);
    var moves = reverse_arr(order_nearby(x_dif, y_dif));
    var i;
    for(i = 0; i < moves.length && !map.move(x, y, x + moves[i][0], y + moves[i][1]); ++i){}
    if(i < moves.length){
        x += moves[i][0];
        x_dif -= moves[i][0];
        y += moves[i][1];
        y_dif -= moves[i][1];
    }
    enemy.spells[enemy.cycle][0](x, y, x_dif, y_dif, map, enemy);
    if(player_close){
        enemy.cycle = 0;
    }
    else{
        enemy.cycle = random_num(enemy.spells.length);
    }
    enemy.description = lich_description + enemy.spells[enemy.cycle][1];
    enemy.pic = enemy.spells[enemy.cycle][2];
}

// Spells
function teleport_spell(x, y, x_dif, y_dif, map, enemy){
    var space = map.random_empty();
    map.move(x, y, space.x, space.y);
}
function summon_spell(x, y, x_dif, y_dif, map, enemy){
    var tile = enemy.summons[random_num(enemy.summons.length)]();
    spawn_nearby(map, tile, x, y);
}
function earthquake_spell(x, y, x_dif, y_dif, map, enemy){
    map.add_event([`earthquake`, (4 - enemy.health) * 5 + random_num(4)]);
}
function flame_wave_spell(x, y, x_dif, y_dif, map, enemy){
    var direction = get_empty_nearby(x, y, order_nearby(x_dif, y_dif), map);
    var spawnpoints = [];
    if(direction === false){
        return;
    }
    if(direction[0] === 0){
        // Shooting vertically.
        for(var i = 0; i < 3; ++i){
            spawnpoints.push([i - 1, direction[1]]);
        }
    }
    else if(direction[1] === 0){
        // Shooting horizontally.
        for(var i = 0; i < 3; ++i){
            spawnpoints.push([direction[0], i - 1]);
        }
    }
    else{
        // Shooting diagonally.
        spawnpoints.push([direction[0], direction[1]]);
        spawnpoints.push([direction[0], 0]);
        spawnpoints.push([0, direction[1]]);
    }
    for(var i = 0; i < spawnpoints.length; ++i){
        var fireball = fireball_tile();
        set_direction(fireball, direction);
        map.add_tile(fireball, x + spawnpoints[i][0], y  + spawnpoints[i][1]);
    }
}
function confusion_spell(x, y, x_dif, y_dif, map, enemy){
    for(var i = 0; i < 2; ++i){
        var ran = random_num(CONFUSION_CARDS.length);
        give_temp_card(CONFUSION_CARDS[ran]());
    }
}
function lava_moat_spell(x, y, x_dif, y_dif, map, enemy){
    var nearby = order_nearby(x_dif, y_dif);
    for(var i = 0; i < enemy.health && count_nearby(x, y, map) < 6; ++i){
        var moat = lava_pool_tile();
        spawn_nearby(map, moat, x, y, nearby);
    }
}
function rest_spell(x, y, x_dif, y_dif, map, enemy){}

// Other AIs
function hazard(x, y, x_dif, y_dif, map, enemy){
    // General on_move function to retaliate if something tries to move onto it.
    map.attack(x + x_dif, y + y_dif);
}
function wall_death(x, y, x_dif, y_dif, map, enemy){
    var spawn_list = [spider_tile, acid_bug_tile, spider_web_tile, rat_tile];
    if(random_num(10) < 7){
        var ran = random_num(spawn_list.length);
        var new_enemy = spawn_list[ran]();
        stun(new_enemy);
        map.add_tile(new_enemy, x, y);
    }
}
function fireball_ai(x, y, x_dif, y_dif, map, enemy){
    if(!map.move(x, y, x + enemy.direction[0], y + enemy.direction[1])){
        map.attack(x + enemy.direction[0], y + enemy.direction[1]);
        enemy.health = 1;
        map.attack(x, y);
    }
}
function fireball_on_enter(x, y, x_dif, y_dif, map, enemy){
    hazard(x, y, x_dif, y_dif, map, enemy);
    enemy.health = 1;
    map.attack(x, y);
}

// AI Utility Functions
function stun(tile, amount = 1){
    // Increases a tile's stun.
    if(!tile.hasOwnProperty(`stun`)){
        tile.stun = 0;
    }
    tile.stun += amount;
}
function convert_direction(x, y){
    // Converts cords to a cardinal direction.
    var str = ``;
    if(y > 0){
        str += `s`;
    }
    if(y < 0){
        str += `n`;
    }
    if(x > 0){
        str += `e`;
    }
    if(x < 0){
        str += `w`;
    }
    return str;
}
function set_direction(enemy, direction){
    enemy.direction = direction;
    if(direction[0] === 0 || direction[1] === 0){
        enemy.rotate = 90 * (Math.abs((direction[0] * -2 + 1)) + direction[1]);
        enemy.pic = enemy.pic_arr[0];
    }
    else{
        enemy.rotate= 90 * ((direction[0] + direction[1]) / 2 + 1);
        if(direction[0] === -1 && direction[1] === 1){
            enemy.rotate = 90 * 3;
        }
        enemy.pic = enemy.pic_arr[1];
    }
}
function sign(x){
    // Returns whether x is positive, negative, or 0
    if(x > 0){
        return 1;
    }
    if(x < 0){
        return -1;
    }
    return 0;
}
function random_sign(){
    // Randomly returns 1 or -1.
    return 2 * random_num(2) - 1;
}
function random_nearby(){
    // Returns an array of each point next to [0, 0] with it's order randomized.
    var cords = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    return randomize_arr(cords);
}
function order_nearby(x_dir, y_dir){
    // Returns an array with points ordered from the nearest to the furthest from the given direction. 
    // Equal distance points are randomly ordered.
    var x_sign = sign(x_dir);
    var y_sign = sign(y_dir);
    var ordering = [];
    ordering.push([x_sign, y_sign]);
    if(x_sign === 0){
        // Target is along the vertical line.
        var pair = randomize_arr([[1, y_sign], [-1, y_sign]]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([[1, 0], [-1, 0]])
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([[1, -1 * y_sign], [-1, -1 * y_sign]]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
    }
    else if(y_sign === 0){
        // Target is along the horizontal line.
        var pair = randomize_arr([[x_sign, 1], [x_sign, 1]]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([[0, 1], [0, -1]])
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([[-1 * x_sign, 1], [-1 * x_sign, -1]]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
    }
    else if(Math.abs(x_dir) > Math.abs(y_dir)){  
        // Target is closer to the horizontal line than the vertical one.
        ordering.push([x_sign, 0]);
        ordering.push([0, y_sign]);
        ordering.push([x_sign, -1 * y_sign]);
        ordering.push([-1 * x_sign, y_sign]);
        ordering.push([0, -1 * y_sign]);
        ordering.push([-1 * x_sign, 0]);
    }
    else if(Math.abs(x_dir) < Math.abs(y_dir)){
        // Target is closer to the vertical line than the horizontal one one.
        ordering.push([0, y_sign]);
        ordering.push([x_sign, 0]);
        ordering.push([-1 * x_sign, y_sign]);
        ordering.push([x_sign, -1 * y_sign]);
        ordering.push([-1 * x_sign, 0]);
        ordering.push([0, -1 * y_sign]);
    }
    else{
        // Target is along the diagonal.
        var pair = randomize_arr([[x_sign, 0], [0, y_sign]]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([[-1 * x_sign, y_sign], [x_sign, -1 * y_sign]]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([[-1 * x_sign, 0], [0, -1 * y_sign]]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
    }
    ordering.push([-1 * x_sign, -1 * y_sign]);
    return ordering;

}
function get_empty_nearby(x, y, nearby_arr, map){
    for(var i = 0; i < nearby_arr.length; ++i){
        if(map.check_empty(x + nearby_arr[i][0], y + nearby_arr[i][1])){
            return nearby_arr[i];
        }
    }
    return false;
}
function count_nearby(x, y, map){
    var count = 0;
    var nearby = random_nearby();
    for(var i = 0; i < nearby.length; ++i){
        if(!map.check_empty(x + nearby[i][0], y + nearby[i][1])){
            ++count;
        }
    }
    return count;
}
function spawn_nearby(map, tile, x, y, nearby = random_nearby()){
    // Attempts to spawn a <tile> at a space next to to the given cords.
    // If it succeeds, returns the location, otherwise returns false.
    for(var i = 0; i < nearby.length; ++i){
        if(map.add_tile(tile, x + nearby[i][0], y + nearby[i][1])){
            return nearby[i];
        }
    }
    return false;
}
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
function copy_arr(arr){
    //returns a copy of the given array.
    var arr2 = [];
    for(var i = 0; i < arr.length; ++i){
        arr2[i] = arr[i];
    }
    return arr2;
}
function reverse_arr(arr){
    var new_arr = [];
    for(var i = arr.length - 1; i >= 0; --i){
        new_arr.push(arr[i]);
    }
    return new_arr;
}
function random_num(x){
    return Math.floor(Math.random() * x);
}
function array_equals(a1, a2){
    if(!(typeof a1 === `array`) || !(typeof a2 === `array`)){
        return false;
    }
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
    show_buttons(table_name, hand_pos){
        // Displays the 3x3 grid to the given table.
        // When one of the buttons with functionality is clicked, the corresponding actions will be performed then it will be discarded.
        display.clear_tb(table_name);

        var make_press_button = function(hand_position){
            return function(button){
                if(button.behavior){
                    player_turn(button.behavior, hand_position)
                }
            }
        }
        var press_button = make_press_button(hand_pos);
        for(var i = 0; i < this.#buttons.length; ++i){
            display.add_button_row(table_name, this.#buttons[i], press_button)
        }
    }
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

// Keys:
//  name: the name of the card.
//  pic: the picture used to represent the card in game.
//  options: a ButtonGrid object containing info on which descriptions and onclick functionality the card's buttons should have.

// The current commands are:
//  [`move`, x, y]: moves the player relative to their position.
//  [`attack`, x, y]: attacks relative to the player's position.


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
    stumble_n, stumble_e, stumble_s, stumble_w, stumble_nw, stumble_ne, stumble_se, stumble_sw, freeze_up, lash_out
]

// Makes the starting deck
function make_starting_deck(){
    deck = new MoveDeck();

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
function make_test_deck(){
    deck = new MoveDeck();
    var start = 40;
    for(var i = start; i < start + 5 && i < CARD_CHOICES.length; ++i){
        deck.add(CARD_CHOICES[i]());
    }
    deck.add(basic_horizontal());
    deck.deal();
    return deck;
}

// basic_horizontal,  basic_diagonal, and slice are unique to the starting deck.
function basic_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1]]);
    options.add_button(E, [[`move`, 1, 0]]);
    options.add_button(S, [[`move`, 0, 1]]);
    options.add_button(W, [[`move`, -1, 0]]);
    return{
        name: `basic horizontal`,
        pic: `${img_folder.cards}basic_horizontal.png`,
        options
    }
}
function basic_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 1, -1]]);
    options.add_button(SE, [[`move`, 1, 1]]);
    options.add_button(SW, [[`move`, -1, 1]]);
    options.add_button(NW, [[`move`, -1, -1]]);
    return{
        name: `basic diagonal`,
        pic: `${img_folder.cards}basic_diagonal.png`,
        options
    }
}
function slice(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 1, -1], [`attack`, 0, -1], [`attack`, -1, -1]]);
    options.add_button(E, [[`attack`, 1, 1], [`attack`, 1, 0], [`attack`, 1, -1]]);
    options.add_button(S, [[`attack`, 1, 1], [`attack`, 0, 1], [`attack`, -1, 1]]);
    options.add_button(W, [[`attack`, -1, 1], [`attack`, -1, 0], [`attack`, -1, -1]]);
    return{
        name: `slice`,
        pic: `${img_folder.cards}slice.png`,
        options
    }
}
function short_charge(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1], [`attack`, 0, -1]]);
    options.add_button(E, [[`move`, 1, 0], [`attack`, 1, 0]]);
    options.add_button(S, [[`move`, 0, 1], [`attack`, 0, 1]]);
    options.add_button(W, [[`move`, -1, 0], [`attack`, -1, 0]]);
    return{
        name: `short charge`,
        pic: `${img_folder.cards}short_charge.png`,
        options
    }
}
function jump(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -2]]);
    options.add_button(E, [[`move`, 2, 0]]);
    options.add_button(S, [[`move`, 0, 2]]);
    options.add_button(W, [[`move`, -2, 0]]);
    return{
        name: `jump`,
        pic: `${img_folder.cards}jump.png`,
        options
    }
}

function straight_charge(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1], [`move`, 0, -1], [`attack`, 0, -1]]);
    options.add_button(S, [[`move`, 0, 1], [`move`, 0, 1], [`attack`, 0, 1]]);
    return{
        name: `straight charge`,
        pic: `${img_folder.cards}straight_charge.png`,
        options
    }
}
function side_charge(){
    var options = new ButtonGrid();
    options.add_button(E, [[`move`, 1, 0], [`move`, 1, 0], [`attack`, 1, 0]]);
    options.add_button(W, [[`move`, -1, 0], [`move`, -1, 0], [`attack`, -1, 0]]);
    return{
        name: `side charge`,
        pic: `${img_folder.cards}side_charge.png`,
        options
    }
}
function step_left(){
    var options = new ButtonGrid();
    options.add_button(SW, [[`move`, -1, 1]]);
    options.add_button(W, [[`move`, -1, 0], [`move`, -1, 0]]);
    options.add_button(NW, [[`move`, -1, -1]]);
    return{
        name: `step left`,
        pic: `${img_folder.cards}step_left.png`,
        options
    }
}
function step_right(){
    var options = new ButtonGrid();
    options.add_button(SE, [[`move`, 1, 1]]);
    options.add_button(E, [[`move`, 1, 0], [`move`, 1, 0]]);
    options.add_button(NE, [[`move`, 1, -1]]);
    return{
        name: `step right`,
        pic: `${img_folder.cards}step_right.png`,
        options
    }
}
function trample(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`attack`, 1, -2], [`move`, 1, -2]]);
    options.add_button(NW, [[`attack`, -1, -2], [`move`, -1, -2]]);
    return{
        name: `trample`,
        pic: `${img_folder.cards}trample.png`,
        options
    }
}
function horsemanship(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 2, -1]]);
    options.add_button(SE, [[`move`, 2, 1]]);
    options.add_button(SW, [[`move`, -2, 1]]);
    options.add_button(NW, [[`move`, -2, -1]]);
    return{
        name: `horsemanship`,
        pic: `${img_folder.cards}horsemanship.png`,
        options
    }
}
function lunge_left(){
    var options = new ButtonGrid();
    options.add_button(SE, [[`move`, 1, 1]]);
    options.add_button(NW, [[`move`, -1, -1], [`move`, -1, -1], [`attack`, -1, -1]]);
    return{
        name: `lunge left`,
        pic: `${img_folder.cards}lunge_left.png`,
        options
    }
}
function lunge_right(){
    var options = new ButtonGrid();
    options.add_button(SW, [[`move`, -1, 1]]);
    options.add_button(NE, [[`move`, 1, -1], [`move`, 1, -1], [`attack`, 1, -1]]);
    return{
        name: `lunge right`,
        pic: `${img_folder.cards}lunge_right.png`,
        options
    }
}
function sprint(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1], [`move`, 0, -1], [`move`, 0, -1]]);
    return{
        name: `sprint`,
        pic: `${img_folder.cards}sprint.png`,
        options
    }
}
function trident(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 1, -2], [`attack`, 0, -2], [`attack`, -1, -2]]);
    options.add_button(E, [[`attack`, 2, 1], [`attack`, 2, 0], [`attack`, 2, -1]]);
    options.add_button(W, [[`attack`, -2, 1], [`attack`, -2, 0], [`attack`, -2, -1]]);
    return{
        name: `trident`,
        pic: `${img_folder.cards}trident.png`,
        options
    }
}
function whack_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 0, -1], [`attack`, 0, -1]]);
    options.add_button(E, [[`attack`, 1, 0], [`attack`, 1, 0]]);
    options.add_button(S, [[`attack`, 0, 1], [`attack`, 0, 1]]);
    options.add_button(W, [[`attack`, -1, 0], [`attack`, -1, 0]]);
    return{
        name: `whack horizontal`,
        pic: `${img_folder.cards}whack_horizontal.png`,
        options
    }
}
function spin_attack(){
    var options = new ButtonGrid();
    var spin = [[`attack`, 1, 1],
                [`attack`, 1, 0],
                [`attack`, 1, -1],
                [`attack`, 0, 1],
                [`attack`, 0, -1],
                [`attack`, -1, 1],
                [`attack`, -1, 0],
                [`attack`, -1, -1]]
    options.add_button(`Spin`, spin, 5);
    return{
        name: `spin attack`,
        pic: `${img_folder.cards}spin_attack.png`,
        options
    }
}
function butterfly(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 2, -2]]);
    options.add_button(SE, [[`move`, 1, 1]]);
    options.add_button(SW, [[`move`, -1, 1]]);
    options.add_button(NW, [[`move`, -2, -2]]);
    return{
        name: `butterfly`,
        pic: `${img_folder.cards}butterfly.png`,
        options
    }
}
function retreat(){
    var options = new ButtonGrid();
    options.add_button(SE, [[`move`, 1, 1]]);
    options.add_button(S, [[`move`, 0, 1], [`move`, 0, 1], [`move`, 0, 1]]);
    options.add_button(SW, [[`move`, -1, 1]]);
    return{
        name: `retreat`,
        pic: `${img_folder.cards}retreat.png`,
        options
    }
}
function force(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 0, -1], [`move`, 0, -1], [`attack`, 0, -1], [`move`, 0, -1]]);
    return{
        name: `force`,
        pic: `${img_folder.cards}force.png`,
        options
    }
}
function side_attack(){
    var options = new ButtonGrid();
    options.add_button(E, [[`attack`, 1, 0], [`attack`, 2, 0], [`attack`, 3, 0]]);
    options.add_button(W, [[`attack`, -1, 0], [`attack`, -2, 0], [`attack`, -3, 0]]);
    return{
        name: `side attack`,
        pic: `${img_folder.cards}side_attack.png`,
        options
    }
}
function clear_behind(){
    var options = new ButtonGrid();
    options.add_button(C, [[`attack`, 1, 1], [`attack`, 0, 1], [`attack`, -1, 1], [`attack`, 1, 2], [`attack`, 0, 2], [`attack`, -1, 2]]);
    return{
        name: `clear behind`,
        pic: `${img_folder.cards}clear_behind.png`,
        options
    }
}
function spear_slice(){
    var options = new ButtonGrid();
    options.add_button(C, [[`attack`, 1, -1], [`attack`, -1, -1], [`attack`, 1, -2], [`attack`, 0, -2], [`attack`, -1, -2]]);
    return{
        name: `spear slice`,
        pic: `${img_folder.cards}spear_slice.png`,
        options
    }
}
function jab(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 0, -1], [`attack`, 0, -2]]);
    options.add_button(E, [[`attack`, 1, 0], [`attack`, 2, 0]]);
    options.add_button(S, [[`attack`, 0, 1], [`attack`, 0, 2]]);
    options.add_button(W, [[`attack`, -1, 0], [`attack`, -2, 0]]);
    return{
        name: `jab`,
        pic: `${img_folder.cards}jab.png`,
        options
    }
}
function overcome(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 1, -1], [`attack`, 0, -1], [`attack`, -1, -1], [`move`, 0, -2]]);
    options.add_button(S, [[`attack`, 1, 1], [`attack`, 0, 1], [`attack`, -1, 1], [`move`, 0, 2]]);
    return{
        name: `overcome`,
        pic: `${img_folder.cards}overcome.png`,
        options
    }
}
function hit_and_run(){
    var options = new ButtonGrid();
    options.add_button(S, [[`attack`, 1, -1], [`attack`, 0, -1], [`attack`, -1, -1], [`attack`, 1, 0], [`attack`, -1, 0], [`move`, 0, 1]]);
    return{
        name: `hit and run`,
        pic: `${img_folder.cards}hit_and_run.png`,
        options
    }
}
function combat_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`attack`, 1, -1], [`move`, 1, -1]]);
    options.add_button(SE, [[`attack`, 1, 1], [`move`, 1, 1]]);
    options.add_button(SW, [[`attack`, -1, 1], [`move`, -1, 1]]);
    options.add_button(NW, [[`attack`, -1, -1], [`move`, -1, -1]]);
    return{
        name: `combat diagonal`,
        pic: `${img_folder.cards}combat_diagonal.png`,
        options
    }
}
function combat_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 0, -1], [`move`, 0, -1]]);
    options.add_button(E, [[`attack`, 1, 0], [`move`, 1, 0]]);
    options.add_button(S, [[`attack`, 0, 1], [`move`, 0, 1]]);
    options.add_button(W, [[`attack`, -1, 0], [`move`, -1, 0]]);
    return{
        name: `combat horizontal`,
        pic: `${img_folder.cards}combat_horizontal.png`,
        options
    }
}
function push_back(){
    var options = new ButtonGrid();
    options.add_button(SE, [[`attack`, -1, -1], [`move`, 1, 1]]);
    options.add_button(S, [[`attack`, 0, -1], [`move`, 0, 1]]);
    options.add_button(SW, [[`attack`, 1, -1], [`move`, -1, 1]]);
    return{
        name: `push back`,
        pic: `${img_folder.cards}push_back.png`,
        options
    }
}
function fork(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 1, -1], [`attack`, -1, -1], [`attack`, 1, -2], [`attack`, -1, -2]]);
    options.add_button(E, [[`attack`, 1, 1], [`attack`, 1, -1], [`attack`, 2, 1], [`attack`, 2, -1]]);
    options.add_button(S, [[`attack`, 1, 1], [`attack`, -1, 1], [`attack`, 1, 2], [`attack`, -1, 2]]);
    options.add_button(W, [[`attack`, -1, 1], [`attack`, -1, -1], [`attack`, -2, 1], [`attack`, -2, -1]]);
    return{
        name: `fork`,
        pic: `${img_folder.cards}fork.png`,
        options
    }
}
function explosion(){
    var area = [];
    var radius = 2;
    for(var i = -1 * radius; i <= radius; ++i){
        for(var j = -1 * radius; j <= radius; ++j){
            area.push([`attack`, i, j]);
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
function breakthrough(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1], [`attack`, 1, 0], [`attack`, -1, 0], [`attack`, 0, -1]]);
    return{
        name: `breakthrough`,
        pic: `${img_folder.cards}breakthrough.png`,
        options
    }
}
function flanking_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 1, -1], [`attack`, 0, 1], [`attack`, -1, 0], [`move`, 1, -1], [`attack`, 0, 1], [`attack`, -1, 0]]);
    options.add_button(NW, [[`move`, -1, -1], [`attack`, 0, 1], [`attack`, 1, 0], [`move`, -1, -1], [`attack`, 0, 1], [`attack`, 1, 0]]);
    return{
        name: `flanking diagonal`,
        pic: `${img_folder.cards}flanking_diagonal.png`,
        options
    }
}
function flanking_sideways(){
    var options = new ButtonGrid();
    options.add_button(E, [[`move`, 1, 0], [`attack`, 0, 1], [`attack`, 0, -1], [`move`, 1, 0], [`attack`, 0, 1], [`attack`, 0, -1]]);
    options.add_button(W, [[`move`, -1, 0], [`attack`, 0, 1], [`attack`, 0, -1], [`move`, -1, 0], [`attack`, 0, 1], [`attack`, 0, -1]]);
    return{
        name: `flanking sideways`,
        pic: `${img_folder.cards}flanking_sideways.png`,
        options
    }
}
function flanking_straight(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1], [`attack`, 1, 0], [`attack`, -1, 0], [`move`, 0, -1], [`attack`, 1, 0], [`attack`, -1, 0]]);
    options.add_button(S, [[`move`, 0, 1], [`attack`, 1, 0], [`attack`, -1, 0], [`move`, 0, 1], [`attack`, 1, 0], [`attack`, -1, 0]]);
    return{
        name: `flanking straight`,
        pic: `${img_folder.cards}flanking_straight.png`,
        options
    }
}
function pike(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 0, -2], [`attack`, 1, -3], [`attack`, 0, -3], [`attack`, -1, -3]]);
    options.add_button(E, [[`attack`, 2, 0], [`attack`, 3, 1], [`attack`, 3, 0], [`attack`, 3, -1]]);
    options.add_button(W, [[`attack`, -2, 0], [`attack`, -3, 1], [`attack`, -3, 0], [`attack`, -3, -1]]);
    return{
        name: `pike`,
        pic: `${img_folder.cards}pike.png`,
        options
    }
}
function breakthrough_side(){
    var options = new ButtonGrid();
    options.add_button(E, [[`move`, 1, 0], [`attack`, 1, 0], [`attack`, 0, 1], [`attack`, 0, -1]]);
    options.add_button(W, [[`move`, -1, 0], [`attack`, -1, 0], [`attack`, 0, 1], [`attack`, 0, -1]]);
    return{
        name: `breakthrough side`,
        pic: `${img_folder.cards}breakthrough_side.png`,
        options
    }
}
function whack_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NW, [[`attack`, -1, -1], [`attack`, -1, -1]]);
    options.add_button(NE, [[`attack`, 1, -1], [`attack`, 1, -1]]);
    options.add_button(SE, [[`attack`, 1, 1], [`attack`, 1, 1]]);
    options.add_button(SW, [[`attack`, -1, 1], [`attack`, -1, 1]]);
    return{
        name: `whack diagonal`,
        pic: `${img_folder.cards}whack_diagonal.png`,
        options
    }
}
function thwack(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 0, -1], [`attack`, 0, -1], [`attack`, 0, -1]]);
    return{
        name: `thwack`,
        pic: `${img_folder.cards}thwack.png`,
        options
    }
}
function overcome_sideways(){
    var options = new ButtonGrid();
    options.add_button(E, [[`attack`, 1, 1], [`attack`, 1, 0], [`attack`, 1, -1], [`move`, 2, 0]]);
    options.add_button(W, [[`attack`, -1, 1], [`attack`, -1, 0], [`attack`, -1, -1], [`move`, -2, 0]]);
    return{
        name: `overcome sideways`,
        pic: `${img_folder.cards}overcome_sideways.png`,
        options
    }
}
function y_leap(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 2, -2]]);
    options.add_button(NW, [[`move`, -2, -2]]);
    options.add_button(S, [[`move`, 0, 2]]);
    return{
        name: `Y leap`,
        pic: `${img_folder.cards}y_leap.png`,
        options
    }
}
function diamond_slice(){
    var options = new ButtonGrid();
    var spin = [[`attack`, 1, 1],
                [`attack`, 2, 0],
                [`attack`, 1, -1],
                [`attack`, 0, 2],
                [`attack`, 0, -2],
                [`attack`, -1, 1],
                [`attack`, -2, 0],
                [`attack`, -1, -1]]
    options.add_button(`Spin`, spin, 5);
    return{
        name: `diamond slice`,
        pic: `${img_folder.cards}diamond_slice.png`,
        options
    }
}
function spearhead(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 1, -1], [`attack`, 1, -1], [`attack`, 1, 0], [`attack`, 0, -1]]);
    options.add_button(NW, [[`move`, -1, -1], [`attack`, -1, -1], [`attack`, -1, 0], [`attack`, 0, -1]]);
    return{
        name: `spearhead`,
        pic: `${img_folder.cards}spearhead.png`,
        options
    }
}
function alt_diagonal_left(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`attack`, 1, 0], [`attack`, 1, -1], [`attack`, 0, -1]]);
    options.add_button(SE, [[`move`, 1, 1]]);
    options.add_button(SW, [[`attack`, -1, 0], [`attack`, -1, 1], [`attack`, 0, 1]]);
    options.add_button(NW, [[`move`, -1, -1]]);
    return{
        name: `alternating diagonal left`,
        pic: `${img_folder.cards}alt_diagonal_left.png`,
        options
    }
}
function alt_diagonal_right(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 1, -1]]);
    options.add_button(SE, [[`attack`, 1, 0], [`attack`, 1, 1], [`attack`, 0, 1]]);
    options.add_button(SW, [[`move`, -1, 1]]);
    options.add_button(NW, [[`attack`, -1, 0], [`attack`, -1, -1], [`attack`, 0, -1]]);
    return{
        name: `alternating diagonal right`,
        pic: `${img_folder.cards}alt_diagonal_right.png`,
        options
    }
}
function alt_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [[`attack`, 1, -1], [`attack`, 0, -1], [`attack`, -1, -1]]);
    options.add_button(E, [[`move`, 1, 0]]);
    options.add_button(S, [[`attack`, 1, 1], [`attack`, 0, 1], [`attack`, -1, 1]]);
    options.add_button(W, [[`move`, -1, 0]]);
    return{
        name: `alternating horizontal`,
        pic: `${img_folder.cards}alt_horizontal.png`,
        options
    }
}
function alt_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1]]);
    options.add_button(E, [[`attack`, 1, 1], [`attack`, 1, 0], [`attack`, 1, -1]]);
    options.add_button(S, [[`move`, 0, 1]]);
    options.add_button(W, [[`attack`, -1, 1], [`attack`, -1, 0], [`attack`, -1, -1]]);
    return{
        name: `alternating vertical`,
        pic: `${img_folder.cards}alt_vertical.png`,
        options
    }
}
function jab_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`attack`, 1, -1], [`attack`, 2, -2]]);
    options.add_button(SE, [[`attack`, 1, 1], [`attack`, 2, 2]]);
    options.add_button(SW, [[`attack`, -1, 1], [`attack`, -2, 2]]);
    options.add_button(NW, [[`attack`, -1, -1], [`attack`, -2, -2]]);
    return{
        name: `jab_diagonal`,
        pic: `${img_folder.cards}jab_diagonal.png`,
        options
    }
}

// Cards given to the player as debuffs
function stumble_w(){
    var options = new ButtonGrid();
    options.add_button(W, [[`move`, -1, 0]]);
    return{
        name: `stumble west`,
        pic: `${img_folder.cards}stumble_w.png`,
        options
    }
}
function stumble_e(){
    var options = new ButtonGrid();
    options.add_button(E, [[`move`, 1, 0]]);
    return{
        name: `stumble east`,
        pic: `${img_folder.cards}stumble_e.png`,
        options
    }
}
function stumble_n(){
    var options = new ButtonGrid();
    options.add_button(N, [[`move`, 0, -1]]);
    return{
        name: `stumble north`,
        pic: `${img_folder.cards}stumble_n.png`,
        options
    }
}
function stumble_s(){
    var options = new ButtonGrid();
    options.add_button(S, [[`move`, 0, 1]]);
    return{
        name: `stumble south`,
        pic: `${img_folder.cards}stumble_s.png`,
        options
    }
}
function stumble_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [[`move`, -1, -1]]);
    return{
        name: `stumble nw`,
        pic: `${img_folder.cards}stumble_nw.png`,
        options
    }
}
function stumble_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [[`move`, 1, -1]]);
    return{
        name: `stumble ne`,
        pic: `${img_folder.cards}stumble_ne.png`,
        options
    }
}
function stumble_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [[`move`, 1, 1]]);
    return{
        name: `stumble se`,
        pic: `${img_folder.cards}stumble_se.png`,
        options
    }
}
function stumble_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [[`move`, -1, 1]]);
    return{
        name: `stumble sw`,
        pic: `${img_folder.cards}stumble_sw.png`,
        options
    }
}
function freeze_up(){
    var options = new ButtonGrid();
    options.add_button(`Freeze Up`, [], 5);
    return{
        name: `freeze up`,
        pic: `${img_folder.cards}freeze_up.png`,
        options
    }
}
function lash_out(){
    var options = new ButtonGrid();
    var spin = [[`attack`, 1, 1],
                [`attack`, 1, 0],
                [`attack`, 1, -1],
                [`attack`, 0, 1],
                [`attack`, 0, 0],
                [`attack`, 0, -1],
                [`attack`, -1, 1],
                [`attack`, -1, 0],
                [`attack`, -1, -1]]
    options.add_button(`Lash Out`, spin, 5);
    return{
        name: `lash out`,
        pic: `${img_folder.cards}lash_out.png`,
        options
    }
}


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
const welcome_message = `Welcome to the dungeon.\n`
                            + `Use cards to move (blue) and attack (red).\n` 
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

function get_display(language){
    // Factory function for the display classes (currently only html)
    switch(language){
        case `html`:
            return DisplayHTML;
        default:
            throw exception(`invalid display language`);
    }
}

class DisplayHTML{
    static add_tb_row(location, row_contents, scale, on_click, background){
        var table = document.getElementById(location);
        var row_num = table.rows.length;
        var row = document.createElement(`tr`);
        row.id = `${location} row ${row_num}`;
        var make_on_click = function(tile, position){
            return function(){
                return on_click(tile, position);
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
                cell.onclick = make_on_click(to_display, i);
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
            top_img.style.transform = this.#get_transformation(to_display);
            cell.append(top_img);
            row.append(cell);
        }
        table.append(row);
    }
    static add_button_row(location, row_contents, on_click){
        var table = document.getElementById(location);
        var row_num = table.rows.length;
        var row = document.createElement(`tr`);
        row.id = `${location} row ${row_num}`;
        var make_on_click = function(tile, position){
            return function(){
                return on_click(tile, position);
            }
        }
        for(var i = 0; i < row_contents.length; ++i){
            var cell = document.createElement(`input`);
            cell.type = `button`;
            cell.id = `${location} ${row_num} ${i}`;
            if(!(on_click === undefined)){
                cell.onclick = make_on_click(row_contents[i], i);
            }
            cell.value = row_contents[i].description;
            row.append(cell);
        }
        table.append(row);
    }
    static display_message(location, message){
        var output = wrap_str(message, TEXT_WRAP_WIDTH, ` `);
        document.getElementById(location).innerText = output;
    }
    static clear_tb(location){
        while(document.getElementById(location).rows.length > 0){
            document.getElementById(location).deleteRow(0);
        }
    }
    static swap_screen(screen){
        switch(screen){
            case ui_id.game_screen:
                document.getElementById(ui_id.tutorial).style.display = `none`;
                document.getElementById(ui_id.game_screen).style.display = `block`;
                break;
            case ui_id.stage:
                document.getElementById(ui_id.shop).style.display = `none`;
                document.getElementById(ui_id.chest).style.display = `none`;
                document.getElementById(ui_id.stage).style.display = `block`;
                break;
            case ui_id.shop:
                document.getElementById(ui_id.stage).style.display = `none`;
                document.getElementById(ui_id.chest).style.display = `none`;
                document.getElementById(ui_id.shop).style.display = `block`;
                break;
            case ui_id.chest:
                document.getElementById(ui_id.stage).style.display = `none`;
                document.getElementById(ui_id.shop).style.display = `none`;
                document.getElementById(ui_id.chest).style.display = `block`;
                break;
            case ui_id.tutorial:
                document.getElementById(ui_id.game_screen).style.display = `none`;
                document.getElementById(ui_id.tutorial).style.display = `block`;
                break;
            default:
                throw Error(`invalid screen swap`);
        }
        return;
    }
    static select(location, row_num, column_num, border = 3, color = 555){
        var row = document.getElementById(`${location} row ${row_num}`);
        var column_count = row.cells.length;
        for(var i = 0; i < column_count; ++i){
            document.getElementById(`${location} ${row_num} ${i} img`).border = ``;
        }
        document.getElementById(`${location} ${row_num} ${column_num} img`).border = `${border}px solid #${color}`;
    }
    static press(key_press){
        // Pick direction via keyboard.
        var key_num = search(key_press.key, controls.directional);
        if(key_num >= 0){
            var element = document.getElementById(`${ui_id.move_buttons} ${Math.floor(key_num / 3)} ${key_num % 3}`);
            element && element.click();
        }
        // Select card via keyboard.
        key_num = search(key_press.key, controls.card);
        if(key_num >= 0){
            var element = document.getElementById(`${ui_id.hand_display} 0 ${key_num}`);
            element && element.click();
        }
    }
    static #get_transformation(to_display){
        var transformation = ``;
        if(to_display.hasOwnProperty(`rotate`)){
            transformation = `${transformation}rotate(${to_display.rotate}deg) `;
        }
        if(to_display.hasOwnProperty(`flip`) && to_display.flip){
            transformation = `${transformation}scaleX(-1) `;
        }
        return transformation;   
    }
}
const display = get_display(MARKUP_LANGUAGE);
document.onkeydown = display.press;// ----------------EntityList.js----------------
// EntityList class is used by the GameMap class to keep track of entities without having to search through the map each time.

class EntityList{
    count_non_empty // Keeps track of the number of entities currently in the class.
    #player // Keeps track of the player postion.
    #exit // Keeps track of the position of the exit.
    #enemy_list // A list of each enemy currently on the board and their locations.
    #id_count // Used to give each enemy a unique id as it is added.
    constructor(){
        this.count_non_empty = 2;
        this.#id_count = 0;
        this.#exit = 0;
        this.#enemy_list = [];
    }
    next_id(){
        return ++this.#id_count;
    }
    set_player(x, y){
        this.#player = {x, y};
    }
    get_player_pos(){
        if(this.#player === undefined){
            throw new Error(`player doesn't exist`);
        }
        return {x: this.#player.x, y: this.#player.y};
    }
    set_exit(x, y){
        this.#exit = {x, y};
    }
    get_exit_pos(){
        if(this.#player === 0){
            throw new Error(`exit doesn't exist`);
        }
        return {x: this.#exit.x, y: this.#exit.y};
    }
    add_enemy(x, y, enemy){
        enemy.id = this.next_id();
        this.#enemy_list.push({x, y, enemy});
        ++this.count_non_empty;
    }
    move_enemy(x, y, id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(`id not found`);
        }
        this.#enemy_list[index].x = x;
        this.#enemy_list[index].y = y;
    }
    remove_enemy(id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(`id not found`);
        }
        this.#enemy_list.splice(index, 1);
        --this.count_non_empty;
    }
    #find_by_id(id){
        for(var i = 0; i < this.#enemy_list.length; ++i){
            if(this.#enemy_list[i].enemy.id === id){
                return i;
            }
        }
        return -1;
    }
    move_any(x, y, entity){
        if(entity.type === `player`){
            this.set_player(x, y);
        }
        else if(entity.type === `enemy`){
            this.move_enemy(x, y, entity.id);
        }
        else{
            throw new Error(`moving invalid type`);
        }
    }
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
                    if(e.enemy.hasOwnProperty(`stun`) && e.enemy.stun > 0){
                        --e.enemy.stun;
                    }
                    else{
                        try{
                            e.enemy.behavior(e.x, e.y, this.#player.x - e.x, this.#player.y - e.y, map, e.enemy);
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
                        throw new Error(`game over`, {cause: e.enemy.name});
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

function floor_generator(floor, map){
    if(!(floor % AREA_SIZE === 0) || Math.floor(floor / AREA_SIZE) - 1 >= BOSS_FLOOR.length){
        generate_normal_floor(floor, map, ENEMY_LIST);
    }
    else{
        BOSS_FLOOR[Math.floor(floor / AREA_SIZE) - 1](floor, map);
    }
}

function generate_normal_floor(floor, map, enemies){
    for(var i = floor * 2; i > 0;){
        var choice = random_num(enemies.length);
        var new_enemy = enemies[choice]();
        if(new_enemy.difficulty <= i){
            map.add_tile(new_enemy);
            i -= new_enemy.difficulty;
        }
    }
    display.display_message(ui_id.display_message, `${floor_message}${floor}.`);
}
function velociphile_floor(floor, map){
    map.add_tile(velociphile_tile());
    map.lock();
    for(var i = 0; i < 8; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    display.display_message(ui_id.display_message, `${floor_message}${floor}.\n${velociphile_floor_message}`);
}
function spider_queen_floor(floor, map){
    map.add_tile(spider_queen_tile());
    map.lock();
    for(var i = 0; i < 4; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    for(var i = 0; i < 2; ++i){
        map.add_tile(spider_web_tile());
    }
    display.display_message(ui_id.display_message, `${floor_message}${floor}.\n${spider_queen_floor_message}`)
}
function lich_floor(floor, map){
    map.add_tile(damaged_wall_tile(), FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2);
    map.add_tile(damaged_wall_tile(), 1, FLOOR_HEIGHT - 2);
    map.add_tile(damaged_wall_tile(), FLOOR_WIDTH - 2, 1);
    map.add_tile(damaged_wall_tile(), 1, 1);
    map.add_tile(lich_tile());
    map.lock();
    display.display_message(ui_id.display_message, `${floor_message}${floor}.\n${lich_floor_message}`)
}// ----------------GameLoop.js----------------
// File contains functions that control the main gameplay.


function setup(){
    // Function ran on page load or on restart to set up the game.
    display.display_message(ui_id.title, game_title)
    display.display_message(ui_id.display_message, welcome_message);
    mapData = new GameMap(FLOOR_WIDTH, FLOOR_HEIGHT); 
    mapData.add_tile(STARTING_ENEMY());
    mapData.display();
    mapData.display_stats(ui_id.stats);
    deck = STARTING_DECK();
    deck.display_hand(ui_id.hand_display);
    display.display_message(ui_id.shop_instructions, mod_deck);
    display.swap_screen(ui_id.game_screen);
    display.swap_screen(ui_id.stage);
}
async function player_turn(behavior, hand_pos){
    // Function to execute the outcome of the player's turn.
    display.display_message(ui_id.display_message, ``);
    try{
        for(var i = 0; i < behavior.length; ++i){
            // Does each valid command in the behavior list.
            player_action(mapData, behavior[i]);
        }
        // Discards the card the user used.
        display.clear_tb(ui_id.move_buttons);
        deck.discard(hand_pos);
        mapData.display();
        await delay(ANIMATION_DELAY);
        // Does the enemies' turn.
        await mapData.enemy_turn();
        // Prep for player's next turn.
        prep_turn();
    }
    catch (error){
        var m = error.message;
        if(m === `floor complete`){
            // If the player has reached the end of the floor.
            mapData.display_stats(ui_id.stats);
            enter_shop();
        }
        else if(m === `game over`){
            // If the player's health reached 0
            game_over(error.cause);
        }
        else if(m === `pass to player`){
            // If the enemies' turn was interrupted,
            // prep for player's next turn.
            prep_turn();
        }
        else{
            throw error;
        }
    }
}
function player_action(mapData, action){
    if(action[0] === `attack`){
        mapData.player_attack(action[1], action[2]);
    }
    else if(action[0] === `move`){
        mapData.player_move(action[1], action[2]);
    }
    else{
        throw new Error(`invalid action type`);
    }
}
function new_floor(){
    // Creates the next floor.
    var floor = mapData.erase();
    floor_generator(floor, mapData);
    mapData.display_stats(ui_id.stats);
    mapData.display();
    deck.deal();
    deck.display_hand(ui_id.hand_display);
    display.swap_screen(ui_id.stage);
}
function enter_shop(){
    // Gives the player the option to add or remove a card from their deck.
    // Their deck contents are also displayed.
    // Options to remove cards will not be displayed if the deck is at the minimum size already.
    display.clear_tb(ui_id.move_buttons);
    display.clear_tb(ui_id.add_card);
    display.clear_tb(ui_id.remove_card);
    display.clear_tb(ui_id.display_deck);
    deck.display_all(ui_id.display_deck);
    generate_add_row(deck, ui_id.add_card);
    generate_remove_row(deck, ui_id.remove_card);
    display.swap_screen(ui_id.shop);
}
function generate_add_row(deck, table){
    var add_list = rand_no_repeates(CARD_CHOICES, ADD_CHOICE_COUNT);
    for(var i = 0; i < add_list.length; ++i){
        add_list[i] = add_list[i]();
    }
    add_list.unshift({pic: `${img_folder.other}plus.png`})
    var make_add_card = function(deck){
        return function(card, position){
            if(position > 0){
                deck.add(card);
                new_floor();
            }
        }
    }
    display.add_tb_row(table, add_list, CARD_SCALE, make_add_card(deck));
}
function generate_remove_row(deck, table){
    var remove_list = deck.get_rand_arr(REMOVE_CHOICE_COUNT);
    if(remove_list){
        remove_list.unshift({pic: `${img_folder.other}minus.png`});
    }
    else{
        remove_list.unshift({pic: `${img_folder.other}x.png`});
    }
    var make_remove_card = function(deck){
        return function(card, position){
            if(position > 0){
                deck.remove(card.id);
                new_floor();
            }
        }
    }
    display.add_tb_row(table, remove_list, CARD_SCALE, make_remove_card(deck));
}
function delay(ms){
    // Function to wait the given number of milliseconds.
    return new Promise(resolve =>{
        setTimeout(resolve, ms);
    })
}
function game_over(cause){
    // Tells the user the game is over, prevents them fro m continuing, tells them the cause
    // and gives them the chance to retry.
    mapData.display();
    display.clear_tb(ui_id.hand_display);
    display.clear_tb(ui_id.move_buttons);
    display.display_message(ui_id.display_message, `${game_over_message}${cause}.`);
    display.clear_tb(ui_id.move_buttons);
    var restart = function(){
        display.clear_tb(ui_id.move_buttons);
        setup();
    };
    var restart_message = [{
        description: retry_message
    }]
    display.add_button_row(ui_id.move_buttons, restart_message, restart);
}
function search(element, arr){
    for(var i = 0; i < arr.length; ++i){
        if(element === arr[i]){
            return i;
        }
    }
    return -1;
}
function give_temp_card(card){
    deck.add_temp(card);
}
function prep_turn(){
    mapData.resolve_events();
    mapData.display();
    deck.display_hand(ui_id.hand_display);
    mapData.display_stats(ui_id.stats);
}
function rand_no_repeates(source, draws){
    var index_arr = [];
    var result = [];
    draws = Math.min(draws, source.length);
    for(var i = 0; i < source.length; ++i){
        index_arr.push(i);
    }
    for(var i = 0; i < draws; ++i){
        rand = random_num(index_arr.length);
        result.push(source[index_arr[rand]]);
        index_arr[rand] = index_arr[index_arr.length - 1];
        index_arr.pop();
    }
    return result;
}
function tile_description(tile){
    var hp = ``
    var stunned = ``;
    if(tile.hasOwnProperty(`max_health`)){
        hp = `(${tile.health}/${tile.max_health} hp) `;
    }
    else if(tile.hasOwnProperty(`health`)){
        hp = `(${tile.health} hp) `;
    }
    if(tile.hasOwnProperty(`stun`) && tile.stun > 0){
        stunned = `*${stunned_msg}${tile.stun}* `;
    }
    return `${hp}${stunned}${tile.description}`;
}
function display_health(player, scale){
    var health = [];
    for(var i = 0; i < player.health; ++i){
        health.push({pic: `${img_folder.other}heart.png`});
    }
    for(var i = 0; i < (player.max_health - player.health); ++i){
        health.push({pic: `${img_folder.other}heart_broken.png`});
    }
    display.add_tb_row(ui_id.health_display, health, scale);
}
function wrap_str(message, wrap_length, delimiter = undefined){
    if(!(typeof message === `string`)){
        throw new Error(`message is not string`);
    }
    var new_message = ``;
    if(message.indexOf(`\n`) > -1){
        var str_arr = message.split(`\n`);
        for(var i = 0; i < str_arr.length; ++i){
            new_message = `${new_message}${wrap_str(str_arr[i], wrap_length, delimiter)}\n`
        }
    }
    else if(delimiter === undefined){
        var str_arr = []
        var start = 0;
        while(start < message.length){
            end = Math.min(message.length, start + wrap_length);
            str_arr.push(message.slice(start, end));
            start = end;
        }
        for(var i = 0; i < str_arr.length; ++i){
            new_message = `${new_message}${str_arr[i]}\n`
        }
    }
    else{
        var str_arr = message.split(` `);
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

class GameMap{
    #x_max; // Size of the grid's x axis.
    #y_max; // Size of the grid's y axis.
    #entity_list; // entity_list class makes keeping track of entity locations easier.
    #grid; // Grid is a 2d list of tiles representing the entity in each location.
    #floor_num; // The current floor number.
    #turn_count; // How many turns the player has taken.
    #events;
    constructor(x_max, y_max){
        this.#x_max = x_max;
        this.#y_max = y_max;
        this.#entity_list = new EntityList();
        this.#floor_num = 0;
        this.#turn_count = 0;
        this.#events = [];
        this.erase()
    }
    erase(){
        // Function to start a new floor by erasing the board and adding only the player and the exit.
        // Returns the floor number.
        try{
            var player = this.get_player();
        }
        catch(error){
            if(error.message === `player doesn't exist`){
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
        this.set_exit(random_num(this.#y_max), 0)
        this.set_player(random_num(this.#y_max), this.#x_max - 1, player)
        return ++this.#floor_num;
    }
    random_space(){
        // Returns a randome space in the grid.
        x = random_num(this.#x_max);
        y = random_num(this.#y_max);
        return {x, y};
    }
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
                if(this.#grid[y][x].type === `empty`){
                    if(rand === 0){
                        return {x, y};
                    }
                    --rand;
                }
            }
        }
    }
    check_bounds(x, y){
        // Throws an error if x or y is out of bounds.
        if(x < 0 || x >= this.#x_max){
            throw new Error(`x out of bounds`);
        }
        if(y < 0 || y >= this.#y_max){
            throw new Error(`y out of bounds`);
        }
    }
    check_empty(x, y){
        // returns true if the space at grid[x, y] is empty.
        // throws an error if the space is out of bounds.
        try{
            this.check_bounds(x, y);
        }
        catch{
            return false;
        }
        return this.#grid[y][x].type === `empty`;
    }
    set_exit(exit_x, exit_y){
        // Places the exit.
        // Throws an error if the space is occupied or out of bounds..
        this.check_bounds(exit_x, exit_y);
        if(!this.check_empty(exit_x, exit_y)){
            throw new Error(`space not empty`);
        }
        this.#entity_list.set_exit(exit_x, exit_y);
        this.#grid[exit_y][exit_x] = exit_tile();
    }
    set_player(player_x, player_y, player){
        // Places the player. If a non-negative value is given for the player's health, it will be set to that.
        // Throws an error is the space is occupied or out of bounds.
        this.check_bounds(player_x, player_y);
        if(!this.check_empty(player_x, player_y)){
            throw new Error(`space not empty`);
        }
        this.#entity_list.set_player(player_x, player_y);
        this.#grid[player_y][player_x] = player;
    }
    add_tile(tile, x = undefined, y = undefined){
        // Adds a new tile to a space.
        // Returns true if it was added successfuly.
        // If x or y aren't provided, it will select a random empty space.
        try{
            if(x === undefined || y === undefined){
                var position = this.random_empty();
                x = position.x;
                y = position.y;
            }
            this.check_bounds(x, y);
            if(!this.check_empty(x, y)){
                throw new Error(`space not empty`);
            }
        }
        catch{
            return false;
        }
        this.#grid[y][x] = tile;
        if(tile.type === `enemy`){
            this.#entity_list.add_enemy(x, y, tile);
        }
        else if(!(tile.type === `empty`)){
            ++this.#entity_list.count_non_empty;
        }
        return true;
    }
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
            display.add_tb_row(ui_id.map_display, this.#grid[y], TILE_SCALE, make_on_click(this), `${img_folder.backgrounds}default.png`);
        }
        display.clear_tb(ui_id.health_display);
        display_health(this.get_player(), TILE_SCALE);
        this.clear_empty()
	}
    clear_empty(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                var tile = this.#grid[y][x];
                if(tile.type === `empty`){
                    tile.pic = `${img_folder.tiles}empty.png`;
                    tile.description = empty_description;
                }
            }
        }
    }
    move(x1, y1, x2, y2){
        // Moves the tile at [x1, y1] to [x2, y2] if it is empty. 
        // Triggers the attempted destination's on_move if applicable.
        // Throws an error if the starting location is out of bounds.
        // Returns true if the move was successful.
        // Also throws errors if the player reaches the end of the floor or dies.
        this.check_bounds(x1, y1);
        try{
            this.check_bounds(x2, y2);
        }
        catch{
            return false;
        }
        var start = this.#grid[y1][x1];
        var end = this.#grid[y2][x2];
        if(start.type === `player` && end.type === `exit`){
            ++this.#turn_count;
            throw new Error(`floor complete`);
        }
        if(end.hasOwnProperty(`on_enter`)){
            // If the destination does something if moved onto, call it.
            try{
                end.on_enter(x2, y2, x1 - x2, y1 - y2, this, end);
            }
            catch(error){
                if(error.message === `game over`){
                    throw new Error(`game over`, {cause: end.name});
                }
                else{
                    throw error;
                }
            }
            if(start.hasOwnProperty(`health`) && start.health <= 0){
                throw new Error(`creature died`);
            }
        }
        if(end.type === `empty` && this.#grid[y1][x1] === start){
            this.#entity_list.move_any(x2, y2, start);
            this.#grid[y2][x2] = start;
            this.#grid[y1][x1] = empty_tile();
            return true;
        }
        return false;
    }
    player_move(x_dif, y_dif){
        // Moves the player the given relative distance.
        var pos = this.#entity_list.get_player_pos();
        return this.move(pos.x, pos.y, pos.x + x_dif, pos.y + y_dif)
    }
    get_player(){
        // Returns the player's health.
        var pos = this.#entity_list.get_player_pos();
        return this.#grid[pos.y][pos.x];
    }
    attack(x, y, hits = `all`){
        // Attacks the specified square.
        // hits specifes if the attacks only hits enemy, player or all tiles.
        // If an enemy dies, it's on_death effect will be triggered if applicable.
        // Throws an error if the location is out of bounds.
        // Returns true if damage was dealt.
        try{
            this.check_bounds(x, y);
        }
        catch(error){
            return false;
        }
        var target = this.#grid[y][x];
        if(target.hasOwnProperty(`health`) && !(target.type === `player`) && (hits === `enemy` || hits === `all`)){
            target.health -= 1;
            if(target.hasOwnProperty(`on_hit`)){
                var player_pos = this.#entity_list.get_player_pos();
                target.on_hit(x, y, player_pos[0] - x, player_pos[1] - y, this, target);
            }
            if(target.health <= 0){
                this.#grid[y][x] = empty_tile()
                this.#grid[y][x].pic = `${img_folder.tiles}hit.png`;
                if(target.type === `enemy`){
                    this.#entity_list.remove_enemy(target.id)
                }
                if(target.hasOwnProperty(`on_death`)){
                    var player_pos = this.#entity_list.get_player_pos();
                    target.on_death(x, y, player_pos[0] - x, player_pos[1] - y, this, target);
                }
            }
            return true;
        }
        if(target.type === `player` && (hits === `player` || hits === `all`)){
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
    player_attack(x_dif, y_dif){
        // Attacks the given square relative to the player's current positon.
        var pos = this.#entity_list.get_player_pos();
        try{
            this.attack(pos.x + x_dif, pos.y + y_dif, `all`);
        }
        catch{
            throw new Error(`game over`, {cause: `player`});
        }
    }
    async enemy_turn(){
        // Causes each enemy to execute their behavior.
        ++this.#turn_count;
        await this.#entity_list.enemy_turn(this);
    }
    display_stats(location){
        // Shows the current floor and turn number.
        display.display_message(location, `Floor ${this.#floor_num} Turn: ${this.#turn_count}`);
    }
    lock(){
        // Locks the stairs for a boss fight.
        var pos = this.#entity_list.get_exit_pos();
        this.#grid[pos.y][pos.x] = lock_tile();
    }
    unlock(){
        // Unlocks the stairs after a boss fight.
        // Fully heals the player
        var pos = this.#entity_list.get_exit_pos();
        this.#grid[pos.y][pos.x] = exit_tile();
        pos = this.#entity_list.get_player_pos();
        this.#grid[pos.y][pos.x].health = this.#grid[pos.y][pos.x].max_health;
    }
    add_event(event){
        this.#events.push(event);
    }
    resolve_events(){
        var new_events = [];
        for(var i = 0; i < this.#events.length; ++i){
            var event = this.#events[i];
            if(event[0] === `earthquake`){
                var rubble = [];
                for(var j = 0; j < event[1]; ++j){
                    var space = this.random_empty();
                    this.#grid[space.y][space.x].description = falling_rubble_description;
                    this.#grid[space.y][space.x].pic = `falling_rubble.png`;
                    rubble.push(space);
                }
                new_events.push([`earthquake_rubble`, rubble]);
            }
            else if(event[0] === `earthquake_rubble`){
                for(var j = 0; j < event[1].length; ++j){
                    this.attack(event[1][j].y, event[1][j].x);
                }
            }
        }
        this.#events = new_events;
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
    #shuffle(arr){
        // returns a new array which is a randomly ordered version of the previous one.
        var new_arr = [];
        while(arr.length != 0){
            var ran = random_num(arr.length);
            new_arr.push(arr[ran]);
            arr[ran] = arr[arr.length - 1];
            arr.pop();
        }
        return new_arr;
    }
    deal(){
        // Shuffles all cards together then deals a new hand.
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        for(var i = 0; i < this.#list.length; ++i){
            this.#library.push(this.#list[i]);
        }
        this.#library = this.#shuffle(this.#library);
        for(var i = 0; i < HAND_SIZE; ++i){
            this.#hand.push(this.#library.pop());
        }
    }
    discard(x){
        // Makes player discard the card at position x from their hand and draw a new one. 
        // If the library is empty, it will first shuffle in the discard. 
        // Throws an error if x doens't correspond to a card in hand.
        if(x >= this.#hand.length || x < 0){
            throw new Error(`hand out of bounds`);
        }
        if(this.#library.length === 0){
            while(this.#discard_pile.length != 0){
                this.#library.push(this.#discard_pile.pop());
            }
            this.#library = this.#shuffle(this.#library);
        }
        if(!(this.#hand[x].hasOwnProperty(`temp`) && this.#hand[x].temp === true)){
            this.#discard_pile.push(this.#hand[x]);
        }
        this.#hand[x] = this.#library.pop();
    }
    add(card){
        // Adds a new card to the list.
        card.id = this.#id_count;
        this.#id_count++;
        this.#list.push(card);
    }
    add_temp(card){
        // Adds a temp card which will be removed at the end of the floor by only adding it to the library, not the list
        card.id = this.#id_count;
        card.temp = true;
        this.#id_count++;
        this.#library.push(card);
        this.#library = this.#shuffle(this.#library);
    }
    display_hand(table){
        // Displays the hand to the given table.
        display.clear_tb(table);
        var make_prep_move = function(deck){
            return function(card, hand_pos){
                //deck.select(hand_pos);
                display.select(ui_id.hand_display, 0, hand_pos);
                card.options.show_buttons(ui_id.move_buttons, hand_pos);
                var deck = deck;
            }
        }
        display.add_tb_row(table, this.#hand, CARD_SCALE, make_prep_move(this));
    }
    display_all(table){
        // Displays the deck list to the given table.
        //document.getElementById(ui_id.current_deck).innerText = `${current_deck}${MIN_DECK_SIZE}):`;
        display.display_message(ui_id.current_deck, `${current_deck}${MIN_DECK_SIZE}):`)
        for(var i = 0; i < Math.ceil(this.#list.length / DECK_DISPLAY_WIDTH); ++i){
            display.add_tb_row(table, this.#list.slice(i * DECK_DISPLAY_WIDTH, (i + 1) * DECK_DISPLAY_WIDTH) ,CARD_SCALE)
            
        }
    }
    get_rand_arr(size){
        if(this.#list.length <= MIN_DECK_SIZE){
            return []
        }
        return rand_no_repeates(this.#list, size);
    }
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
    select(hand_pos){
        for(var i = 0; i < this.#hand.length; ++i){
            document.getElementById(`hand ${i} img`).border = ``;
        }
        document.getElementById(`hand ${hand_pos} img`).border = `3px solid #555`;
    }
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

// This is a list of all the enemies that can be spawned on a normal floor.
const ENEMY_LIST = [spider_tile, turret_h_tile, turret_d_tile, turret_r_tile, shadow_knight_tile, 
    scythe_tile, spider_web_tile, ram_tile, large_porcuslime_tile, medium_porcuslime_tile, 
    acid_bug_tile, brightling_tile, corrosive_caterpillar_tile, noxious_toad_tile, vampire_tile,
    clay_golem_tile, vinesnare_bush_tile, rat_tile];

// Non-Enemy tiles
function empty_tile(){
    return {
        type: `empty`,
        pic: `${img_folder.tiles}empty.png`,
        description: empty_description
    }
}
function exit_tile(){
    return {
        type: `exit`,
        pic: `${img_folder.tiles}stairs.png`,
        description: exit_description
    }
}
function lock_tile(){
    return {
        type: `terrain`,
        name: `lock`,
        pic: `${img_folder.tiles}lock.png`,
        description: lock_description
    }
}
function player_tile(){
    return {
        type: `player`,
        name: `player`,
        pic: `${img_folder.tiles}helmet.png`,
        health: PLAYER_STARTING_HEALTH,
        max_health: PLAYER_STARTING_HEALTH,
        description: player_description
    }
}
function lava_pool_tile(){
    return {
        type: `terrain`,
        name: `lava pool`,
        pic: `${img_folder.tiles}lava_pool.png`,
        description: lava_pool_description,
        on_enter: hazard
    }
}
function corrosive_slime_tile(){
    return {
        type: `terrain`,
        name: `corrosive_slime`,
        pic: `${img_folder.tiles}corrosive_slime.png`,
        health: 1,
        description: corrosive_slime_description,
        on_enter: hazard
    }
}
function wall_tile(){
    return {
        type: `terrain`,
        name: `wall`,
        pic: `${img_folder.tiles}wall.png`,
        description: wall_description
    }
}
function damaged_wall_tile(){
    var health = random_num(2) + 1;
    return {
        type: `terrain`,
        name: `damaged wall`,
        pic: `${img_folder.tiles}damaged_wall.png`,
        health,
        on_death: wall_death,
        description: damaged_wall_description

    }
}
function fireball_tile(){
    var pic_arr = [`${img_folder.tiles}fireball_n.png`, `${img_folder.tiles}fireball_nw.png`];
    return {
        type: `enemy`,
        name: `fireball`,
        pic: `${img_folder.tiles}fireball.png`,
        pic_arr,
        direction: [],
        rotate: 0,
        description: fireball_description,
        behavior: fireball_ai,
        on_enter: fireball_on_enter
    }
}

// Normal Enemy Tiles
function spider_tile(){
    return {
        type: `enemy`,
        name: `spider`,
        pic: `${img_folder.tiles}spider.png`,
        health: 1,
        difficulty: 1,
        behavior: spider_ai,
        description: spider_description
    }
}
function turret_h_tile(){
    return {
        type: `enemy`,
        name: `turret`,
        pic: `${img_folder.tiles}turret_h.png`,
        health: 1,
        difficulty: 2,
        behavior: turret_h_ai,
        description: turret_h_description
    }
}
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
function turret_r_tile(){
    var pic_arr = [`${img_folder.tiles}turret_r_N_S.png`, `${img_folder.tiles}turret_r_NE_SW.png`];
    var starting_cycle = random_num(4);
    var direction = random_sign();
    if(direction > 0){
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
        direction,
        flip: (direction === -1),
        rotate: starting_rotation,
        health: 1,
        difficulty: 2,
        behavior: turret_r_ai,
        description: turret_r_description
    }
}
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
function spider_web_tile(){
    spawn_timer = 2
    return{
        type: `enemy`,
        name: `spider egg`,
        pic: `${img_folder.tiles}spider_web.png`,
        cycle: 0,
        spawn_timer,
        health: 2,
        difficulty: 4,
        behavior: spider_web_ai,
        description: `${spider_web_description[0]}${spawn_timer + 1}${spider_web_description[1]}`
    }
}
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
function small_h_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `small porcuslime`,
        pic: `${img_folder.tiles}small_h_porcuslime.png`,
        health: 1,
        difficulty: 3,
        behavior: small_h_porcuslime_ai,
        description: small_h_porcuslime_description
    }
}
function small_d_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `small porcuslime`,
        pic: `${img_folder.tiles}small_d_porcuslime.png`,
        health: 1,
        difficulty: 3,
        behavior: small_d_porcuslime_ai,
        description: small_d_porcuslime_description
    }
}
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
function rat_tile(){
    return {
        type: `enemy`,
        name: `rat`,
        pic: `${img_folder.tiles}rat.png`,
        cycle: 1,
        health: 1,
        difficulty: 2,
        behavior: rat_ai,
        description: rat_description
    }
}

// Boss Tiles
function velociphile_tile(){
    return{
        type: `enemy`,
        name: `velociphile`,
        pic: `${img_folder.tiles}velociphile.png`,
        health: 3,
        difficulty: `boss`,
        behavior: velociphile_ai,
        on_death: boss_death,
        description: velociphile_description,
        death_message: velociphile_death_message
    }
}
function spider_queen_tile(){
    return{
        type: `enemy`,
        name: `spider queen`,
        pic: `${img_folder.tiles}spider_queen.png`,
        health: 3,
        difficulty: `boss`,
        behavior: spider_ai,
        on_hit: spider_queen_hit,
        on_death: boss_death,
        description: spider_queen_description,
        death_message: spider_queen_death_message
    }
}
function lich_tile(){
    var spells = [
        [teleport_spell, teleport_spell_description, `${img_folder.tiles}lich_teleport.png`], 
        [summon_spell, summon_spell_description, `${img_folder.tiles}lich_summon.png`], 
        [earthquake_spell, earthquake_spell_description, `${img_folder.tiles}lich_earthquake.png`], 
        [flame_wave_spell, flame_wave_spell_description, `${img_folder.tiles}lich_flame_wave.png`],
        [confusion_spell, confusion_spell_description, `${img_folder.tiles}lich_confusion.png`],
        [lava_moat_spell, lava_moat_spell_description, `${img_folder.tiles}lich_lava_moat.png`],
        [rest_spell, rest_description, `${img_folder.tiles}lich_rest.png`]
    ];
    var summons = [
        spider_tile,
        scythe_tile,
        shadow_knight_tile,
        ram_tile,
        medium_porcuslime_tile
    ];
    var starting_cycle = 1;
    return{
        type: `enemy`,
        name: `lich`,
        pic: spells[starting_cycle][2],
        health: 3,
        difficulty: `boss`,
        behavior: lich_ai,
        cycle: starting_cycle,
        spells,
        summons,
        on_death: boss_death,
        description: lich_description + spells[starting_cycle][1],
        death_message: lich_death_message
    }
}


function get_ui_ids(language){
    // Factory function for the display classes (currently only html)
    switch(language){
        case `html`:
            return HTML_UI_ID;
        default:
            throw exception(`invalid display language`);
    }
}

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
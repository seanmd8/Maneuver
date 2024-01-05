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

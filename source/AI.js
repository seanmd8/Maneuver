// ----------------AI.js----------------
// File containing the logic for attacks, movements and other effects of non-player entities.

// Parameters:
//  x: the x location of this entity on the game map.
//  y: the y location of this entity on the game map.
//  x_dif: the difference between the x value of this and the player.
//  y_dif: the difference between the y value of this and the player.
//  map: the game map.
//  enemy: the tile representing this entity.



function spider_ai(x, y, x_dif, y_dif, map, enemy){
    if(-1 <= x_dif && x_dif <= 1 && -1 <= y_dif && y_dif <= 1){
        // If the player is next to it, attack.
        map.attack(x + x_dif, y + y_dif, "player");
    }
    else{
        // Otherwise attempt to move closer.
        x_dif = sign(x_dif);
        y_dif = sign(y_dif);
        map.move(x, y, x + x_dif, y + y_dif);
    }
}
function turret_h_ai(x, y, x_dif, y_dif, map, enemy){
    // Turret version that shoots orthogonally.
    try{
        // If it sees the player, fires until it hits something or reaches the bounds of the map.
        if(x_dif === 0){
            var direction = sign(y_dif);
            for(var i = 1; !map.attack(x, y + i * direction); ++i){
                map.check_bounds(x, y + i * direction)
            }
        }
        else if(y_dif === 0){
            var direction = sign(x_dif);
            for(var i = 1; !map.attack(x + i * direction, y); ++i){
                map.check_bounds(x + i * direction, y)
            }
        }
    }
    catch(error){
        if(!(error.message === "x out of bounds" || error.message === "y out of bounds")){
            throw error;
        }
    }
}
function turret_d_ai(x, y, x_dif, y_dif, map, enemy){
    // Turret version that shoots diagonally.
    if(!(Math.abs(x_dif) === Math.abs(y_dif))){
        return;
    }
    // If it sees the player, fires until it hits something or the bounds of the map.
    var x_direction = sign(x_dif);
    var y_direction = sign(y_dif);
    try{
        for(var i = 1; !map.attack(x + i * x_direction, y + i * y_direction); ++i){ 
            map.check_bounds(x + i * x_direction, y + i * y_direction);
        }
    }
    catch(error){
        if(!(error.message === "x out of bounds" || error.message === "y out of bounds")){
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
    enemy.pic = "scythe_" + convert_direction(direction[0], direction[1]) + ".png";
    for(var i = 0; i < distance; ++i){
        // moves <distance> spaces attacking each space it passes next to.
        if(!map.move(x, y, x + direction[0], y + direction[1])){
            break;
        }
        x += direction[0];
        y += direction[1];
        map.attack(x - direction[0], y, "player");
        map.attack(x, y - direction[1], "player"); 
    }
}
function knight_ai(x, y, x_dif, y_dif, map, enemy){
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
            map.attack(x + x_dif, y + y_dif, "player");
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
        var spawnpoints = random_nearby();
        for(var i = 0; i < spawnpoints.length && !map.add_tile(spider_tile(), x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
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
        if(!map.add_tile(medium_porcuslime_tile(), x, y)){
            var spawnpoints = random_nearby();
            for(var i = 0; i < spawnpoints.length && !map.add_tile(medium_porcuslime_tile(), x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
        }
        return;
    }
    if(enemy.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(x, y);
        var spawnpoints = random_nearby();
        for(var i = 0; i < spawnpoints.length && !map.add_tile(small_h_porcuslime_tile(), x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
        spawnpoints = random_nearby();
        for(var i = 0; i < spawnpoints.length && !map.add_tile(small_d_porcuslime_tile(), x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
        return;
    }
    if(-1 <= x_dif && x_dif <= 1 && -1 <= y_dif && y_dif <= 1){
        // If the player is next to it, attacks.
        map.attack(x + x_dif, y + y_dif, "player");
    }
    else{
        // Otherwise moves closer and attacks in that direction.
        x_dif = sign(x_dif);
        y_dif = sign(y_dif);
        var moved = map.move(x, y, x + x_dif, y + y_dif);
        if(moved){
            map.attack(x + (2 * x_dif), y + (2 * y_dif), "player");
        }
    }
}
function medium_porcuslime_ai(x, y, x_dif, y_dif, map, enemy){
    if(enemy.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(x, y);
        var spawnpoints = random_nearby();
        for(var i = 0; i < spawnpoints.length && !map.add_tile(small_h_porcuslime_tile(), x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
        spawnpoints = random_nearby();
        for(var i = 0; i < spawnpoints.length && !map.add_tile(small_d_porcuslime_tile(), x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
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
                dir[i] = -1 + (2 * Math.floor(Math.random(2)));
            }
        }
    }
    // Moves then attacks in that direction.
    var moved = map.move(x, y, x + dir[0], y + dir[1]);
    if(moved){
        map.attack(x + (2 * dir[0]), y + (2 * dir[1]), "player");
    }
    else{
        map.attack(x + dir[0], y + dir[1], "player");
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
        map.attack(x + (2 * dir[0]), y + (2 * dir[1]), "player");
    }
    else{
        map.attack(x + dir[0], y + dir[1], "player");
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
        map.attack(x + (2 * dir[0]), y + (2 * dir[1]), "player");
    }
    else{
        map.attack(x + dir[0], y + dir[1], "player");
    }
}
function acid_bug_ai(x, y, x_dif, y_dif, map, enemy){
    // Moves 1 space towards the player.
    x_dif = sign(x_dif);
    y_dif = sign(y_dif);
    map.move(x, y, x + x_dif, y + y_dif);
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
        var space = map.random_empty();
        map.move(x, y, space.x, space.y);
        ++enemy.cycle;
    }
    else if(Math.floor(Math.random() * 4) < enemy.cycle){
        // Teleports the player next to it then cycle goes to 0 to prepare to teleport.
        var near_points = random_nearby();
        for(var i = 0; i < near_points.length && !map.move(x + x_dif, y + y_dif, x + near_points[i][0], y + near_points[i][1]); ++i){}
        enemy.cycle = -1;
        // Since player has been moved, it returns to their turn.
        throw new Error("pass to player");
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


function velociphile_ai(x, y, x_dif, y_dif, map, enemy){
    var directions = random_nearby();
    var direction = directions[0];
    // If the player is in a straight line, attempts to aim at them.
    if(Math.abs(x_dif) === Math.abs(y_dif) || x_dif === 0 || y_dif === 0){
        direction = [sign(x_dif), sign(y_dif)];
    }
    // Reselects direction at random until it finds one that is unobstructed.
    for(var i = 1; !map.check_empty(x + direction[0], y + direction[1]) && i < directions.length; ++i){
        direction = directions[i];
    }
    // Moves in the chosen direction until it hits something which it then attacks.
    while(map.move(x, y, x + direction[0], y + direction[1])){
        x += direction[0];
        y += direction[1];
    }
    map.attack(x + direction[0], y + direction[1]);
}
function velociphile_death(x, y, x_dif, y_dif, map, enemy){
    describe("All falls silent as the Velociphile is defeated.\n The exit unlocks.")
    map.unlock();
}

function hazard(x, y, x_dif, y_dif, map, enemy){
    // hazard function to retaliate if something moves onto it.
    map.attack(x + x_dif, y + y_dif);
}
function wall_death(x, y, x_dif, y_dif, map, enemy){
    var spawn_list = [spider_tile, acid_bug_tile, spider_web_tile];
    if(Math.floor(Math.random() * 7) < 10){
        var ran = Math.floor(Math.random() * spawn_list.length);
        var new_enemy = spawn_list[ran]();
        new_enemy.stun = 1;
        map.add_tile(new_enemy, x, y);
    }
}

function dummy_ai(x, y, x_dif, y_dif, map, enemy){
    // Does nothing. Used for testing.
}

// -----Utility functions used mainly by this file-----
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
function random_nearby(){
    // Returns an array of each point next to [0, 0] with it's order randomized.
    var cords = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    var ran_cords = [];
    while(cords.length > 0){
        var index = Math.floor(Math.random() * cords.length);
        ran_cords.push(cords[index]);
        cords[index] = cords[cords.length - 1];
        cords.pop();
    }
    return ran_cords;
}
function random_sign(){
    // Randomly returns 1 or -1.
    return Math.floor(1 - (2 * Math.floor(Math.random() * 2)));
}
function convert_direction(x, y){
    // Converts cords to a cardinal direction.
    var str = "";
    if(y > 0){
        str += "s";
    }
    if(y < 0){
        str += "n";
    }
    if(x > 0){
        str += "e";
    }
    if(x < 0){
        str += "w";
    }
    return str;
}
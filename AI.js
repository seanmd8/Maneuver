function spider_ai(x, y, x_dif, y_dif, map, enemy){
    if(-1 <= x_dif && x_dif <= 1 && -1 <= y_dif && y_dif <= 1){
        map.attack(x + x_dif, y + y_dif, "player");
    }
    else{
        x_dif = sign(x_dif);
        y_dif = sign(y_dif);
        map.move(x, y, x + x_dif, y + y_dif);
    }
}
function turret_h_ai(x, y, x_dif, y_dif, map, enemy){
    try{
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
    if(!(Math.abs(x_dif) === Math.abs(y_dif))){
        return;
    }
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
    var direction = Math.floor(Math.random() * 4);
    if(x_dif < 0 && y_dif < 0){
        direction = 0;
    }
    if(x_dif < 0 && y_dif > 0){
        direction = 1;
    }
    if(x_dif > 0 && y_dif < 0){
        direction = 2;
    }
    if(x_dif > 0 && y_dif > 0){
        direction = 3;
    }
    switch(direction){
        case 0:
            for(var i = 0; i < 3; ++i){
                if(!map.move(x, y, x - 1, y - 1)){
                    break;
                }
                x -= 1;
                y -= 1;
                map.attack(x + 1, y, "player");
                map.attack(x, y + 1, "player");
            }
            break;
        case 1:
            for(var i = 0; i < 3; ++i){
                if(!map.move(x, y, x - 1, y + 1)){
                    break;
                }
                x -= 1;
                y += 1;
                map.attack(x + 1, y, "player");
                map.attack(x, y - 1, "player");
            }
            break;
        case 2:
            for(var i = 0; i < 3; ++i){
                if(!map.move(x, y, x + 1, y - 1)){
                    break;
                }
                x += 1;
                y -= 1;
                map.attack(x - 1, y, "player");
                map.attack(x, y + 1, "player");
            }
            break;
        case 3:
            for(var i = 0; i < 3; ++i){
                if(!map.move(x, y, x + 1, y + 1)){
                    break;
                }
                x += 1;
                y += 1;
                map.attack(x - 1, y, "player");
                map.attack(x, y - 1, "player");
            }
            break;
    }
}
function knight_ai(x, y, x_dif, y_dif, map, enemy){
    if(Math.abs(x_dif) === 1 && Math.abs(y_dif) === 1){
        if(!map.move(x, y, x + (2 * sign(x_dif)), y + (-1 * sign(y_dif)))){
            map.move(x, y, x + (-1 * sign(x_dif)), y + (2 * sign(y_dif)));
        }
        return;
    }
    if(Math.abs(x_dif) + Math.abs(y_dif) === 3){
        if(x_dif === 1 || x_dif === -1 || y_dif === 1 || y_dif === -1){
            map.attack(x + x_dif, y + y_dif, "player");
            map.move(x, y, x + x_dif * 2, y + y_dif * 2);
            return;
        }
    }
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
function spider_egg_ai(x, y, x_dif, y_dif, map, enemy){
    if(enemy.cycle < enemy.spawn_timer){
        ++enemy.cycle;
    }
    else{
        var spawnpoints = random_nearby();
        for(var i = 0; i < spawnpoints.length && !map.add_enemy(spider_tile(), x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
        enemy.cycle = 0;
    }
}
function ram_ai(x, y, x_dif, y_dif, map, enemy){
    var x_direction = sign(x_dif);
    var y_direction = sign(y_dif);
    var wander_speed = 2;
    if(enemy.cycle === 0){
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
            enemy.cycle = 1;
            enemy.pic = enemy.pic_arr[enemy.cycle];
        }
    }
    else{
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
        map.attack(x, y);
        map.attack(x, y);
        if(!map.add_enemy(medium_porcuslime_tile(), x, y)){
            var spawnpoints = random_nearby();
            for(var i = 0; i < spawnpoints.length && !map.add_enemy(medium_porcuslime_tile(), x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
        }
        return;
    }
    if(enemy.health === 1){
        map.attack(x, y);
        var spawnpoints = random_nearby();
        for(var i = 0; i < spawnpoints.length && !map.add_enemy(small_h_porcuslime_tile(), x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
        spawnpoints = random_nearby();
        for(var i = 0; i < spawnpoints.length && !map.add_enemy(small_d_porcuslime_tile(), x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
        return;
    }
    if(-1 <= x_dif && x_dif <= 1 && -1 <= y_dif && y_dif <= 1){
        map.attack(x + x_dif, y + y_dif, "player");
    }
    else{
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
        map.attack(x, y);
        var spawnpoints = random_nearby();
        for(var i = 0; i < spawnpoints.length && !map.add_enemy(small_h_porcuslime_tile(), x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
        spawnpoints = random_nearby();
        for(var i = 0; i < spawnpoints.length && !map.add_enemy(small_d_porcuslime_tile(), x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
        return;
    }
    if(enemy.cycle === 0){
        if(Math.abs(x_dif) > Math.abs(y_dif)){
            var dir = [sign(x_dif), 0];
        }
        else{
            var dir = [0, sign(y_dif)];
        }
    }
    else{
        var dir = [sign(x_dif), sign(y_dif)];
        for(var i = 0; i < dir.length; ++i){
            if(dir[i] === 0){
                dir[i] = -1 + (2 * Math.floor(Math.random(2)));
            }
        }
    }
    var moved = map.move(x, y, x + dir[0], y + dir[1]);
    if(moved){
        map.attack(x + (2 * dir[0]), y + (2 * dir[1]), "player");
    }
    else{
        map.attack(x + dir[0], y + dir[1], "player");
    }
    enemy.cycle = 1 - enemy.cycle;
    enemy.pic = enemy.pic_arr[enemy.cycle];
}
function small_h_porcuslime_ai(x, y, x_dif, y_dif, map, enemy){
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
    enemy.cycle = 1 - enemy.cycle;
}
function small_d_porcuslime_ai(x, y, x_dif, y_dif, map, enemy){
    var dir = [sign(x_dif), sign(y_dif)];
    for(var i = 0; i < dir.length; ++i){
        if(dir[i] === 0){
            dir[i] = -1 + (2 * Math.floor(Math.random(2)));
        }
    }
    var moved = map.move(x, y, x + dir[0], y + dir[1]);
    if(moved){
        map.attack(x + (2 * dir[0]), y + (2 * dir[1]), "player");
    }
    else{
        map.attack(x + dir[0], y + dir[1], "player");
    }
    enemy.cycle = 1 - enemy.cycle;
}
function acid_elemental_ai(x, y, x_dif, y_dif, map, enemy){
    x_dif = sign(x_dif);
    y_dif = sign(y_dif);
    map.move(x, y, x + x_dif, y + y_dif);
}
function acid_elemental_death(x, y, x_dif, y_dif, map, enemy){
    var attacks = random_nearby();
    for(var i = 0; i < attacks.length; ++i){
        map.attack(x + attacks[i][0], y + attacks[i][1]);
    }
}


function velociphile_ai(x, y, x_dif, y_dif, map, enemy){
    
}



function sign(x){
    if(x > 0){
        return 1;
    }
    if(x < 0){
        return -1;
    }
    return 0;
}
function random_nearby(){
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
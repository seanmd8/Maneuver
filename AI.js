function spider_ai(x, y, x_dif, y_dif, map){
    if(-1 <= x_dif && x_dif <= 1 && -1 <= y_dif && y_dif <= 1){
        map.attack(x + x_dif, y + y_dif, "player");
    }
    else{
        if(x_dif > 0){
            x_dif = 1;
        }
        if(x_dif < 0){
            x_dif = -1;
        }
        if(y_dif > 0){
            y_dif = 1;
        }
        if(y_dif < 0){
            y_dif = -1;
        }
        map.move(x, y, x + x_dif, y + y_dif);
    }
}
function turret_h_ai(x, y, x_dif, y_dif, map){
    if(x_dif === 0){
        var direction = 1
        if(y_dif < 0){
            direction = -1;
        }
        for(var i = 1; i < 11; ++i){ 
            map.attack(x, y + i * direction);
        }
    }
    if(y_dif === 0){
        var direction = 1
        if(x_dif < 0){
            direction = -1;
        }
        for(var i = 1; i < 11; ++i){ 
            map.attack(x + i * direction, y);
        }
    }
}
function turret_d_ai(x, y, x_dif, y_dif, map){
    if(!(Math.abs(x_dif) === Math.abs(y_dif))){
        return;
    }
    var x_direction = 1
    if(x_dif < 0){
        x_direction = -1;
    }
    var y_direction = 1
    if(y_dif < 0){
        y_direction = -1;
    }
    for(var i = 1; i < 11; ++i){ 
        map.attack(x + i * x_direction, y + i * y_direction);
    }
}
function scythe_ai(x, y, x_dif, y_dif, map){
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
function knight_ai(x, y, x_dif, y_dif, map){
    // Needs buff
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


function velociphile_ai(x, y, x_dif, y_dif, map){
    
}
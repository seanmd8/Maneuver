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
    if(Math.floor(Math.random() * 10) < 10){
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
}// ----------------Cards.js----------------
// File containing the logic for each card.

// Keys:
//  name: the name of the card.
//  pic: the picture used to represent the card in game.
//  descriptions: list of descriptions put on the buttons the user uses for their decisions.
//  behavior: list of command groups which will be performed when the user clicks on the corresponding button

// The relative order of descriptions and behavior should match.
// The current commands are:
//  ["move", x, y]: moves the player relative to their position.
//  ["attack", x, y]: attacks relative to the player's position.


// List of the options that can be given on level up.
const CARD_CHOICES = [short_charge, jump, straight_charge, side_charge, step_left, 
                    step_right, trample, horsemanship, lunge_left, lunge_right, 
                    sprint, trident, whack, spin_attack, butterfly, 
                    retreat, force, side_attack, clear_behind, spear_slice, 
                    jab, overcome, hit_and_run, v, push_back,
                    fork, explosion, breakthrough, flanking_diagonal, flanking_sideways,
                    flanking_straight, pike];

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
    var start = 30;
    for(var i = start; i < start + 5 && i < CARD_CHOICES.length; ++i){
        deck.add(CARD_CHOICES[i]());
    }
    deck.add(basic_horizontal());
    deck.add(basic_horizontal());
    deck.deal();
    return deck;
}

// basic_horizontal and basic_diagonal are unique to the starting deck.
function basic_horizontal(){
    return{
        name: "basic horizontal",
        pic: "basic_horizontal.png",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["move", 0, -1]],
            [["move", 1, 0]],
            [["move", 0, 1]],
            [["move", -1, 0]]
            
        ]
    }
}
function basic_diagonal(){
    return{
        name: "basic diagonal",
        pic: "basic_diagonal.png",
        descriptions: [
            "NE",
            "SE",
            "SW",
            "NW"
        ],
        behavior: [
            [["move", 1, -1]],
            [["move", 1, 1]],
            [["move", -1, 1]],
            [["move", -1, -1]]
            
        ]
    }
}
function slice(){
    return{
        name: "slice",
        pic: "slice.png",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["attack", 1, -1],
            ["attack", 0, -1],
            ["attack", -1, -1]],

            [["attack", 1, 1],
            ["attack", 1, 0],
            ["attack", 1, -1]],

            [["attack", 1, 1],
            ["attack", 0, 1],
            ["attack", -1, 1]],

            [["attack", -1, 1],
            ["attack", -1, 0],
            ["attack", -1, -1]]  
        ]
    }
}
function short_charge(){
    return{
        name: "short charge",
        pic: "short_charge.png",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["move", 0, -1],
            ["attack", 0, -1]],

            [["move", 1, 0],
            ["attack", 1, 0]],

            [["move", 0, 1],
            ["attack", 0, 1]],

            [["move", -1, 0],
            ["attack", -1, 0]]
        ]
    }
}
function jump(){
    return{
        name: "jump",
        pic: "jump.png",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["move", 0, -2]],
            [["move", 2, 0]],
            [["move", 0, 2]],
            [["move", -2, 0]]
        ]
    }
}

function straight_charge(){
    return{
        name: "straight charge",
        pic: "straight_charge.png",
        descriptions: [
            "N",
            "S"
        ],
        behavior: [
            [["move", 0, -1],
            ["move", 0, -1],
            ["attack", 0, -1]],

            [["move", 0, 1],
            ["move", 0, 1],
            ["attack", 0, 1]]
        ]
    }
}
function side_charge(){
    return{
        name: "side charge",
        pic: "side_charge.png",
        descriptions: [
            "E",
            "W"
        ],
        behavior: [
            [["move", 1, 0],
            ["move", 1, 0],
            ["attack", 1, 0]],

            [["move", -1, 0],
            ["move", -1, 0],
            ["attack", -1, 0]]
        ]
    }
}
function step_left(){
    return{
        name: "step left",
        pic: "step_left.png",
        descriptions: [
            "NW",
            "W",
            "SW"
        ],
        behavior: [
            [["move", -1, -1]],
            [["move", -1, 0],
            ["move", -1, 0]],
            [["move", -1, 1]]
        ]
    }
}
function step_right(){
    return{
        name: "step right",
        pic: "step_right.png",
        descriptions: [
            "NE",
            "E",
            "SE"
        ],
        behavior: [
            [["move", 1, -1]],
            [["move", 1, 0],
            ["move", 1, 0]],
            [["move", 1, 1]]
        ]
    }
}
function trample(){
    return{
        name: "trample",
        pic: "trample.png",
        descriptions: [
            "NE",
            "NW"
        ],
        behavior: [
            [["attack", 1, -2],
            ["move", 1, -2]],

            [["attack", -1, -2],
            ["move", -1, -2]]
        ]
    }
}
function horsemanship(){
    return{
        name: "horsemanship",
        pic: "horsemanship.png",
        descriptions: [
            "NE",
            "SE",
            "SW",
            "NW"
        ],
        behavior: [
            [["move", 2, -1]],
            [["move", 2, 1]],
            [["move", -2, 1]],
            [["move", -2, -1]]
            
        ]
    }
}
function lunge_left(){
    return{
        name: "lunge left",
        pic: "lunge_left.png",
        descriptions: [
            "SE",
            "NW"
        ],
        behavior: [
            [["move", 1, 1]],

            [["move", -1, -1],
            ["move", -1, -1],
            ["attack", -1, -1]]
            
        ]
    }
}
function lunge_right(){
    return{
        name: "lunge right",
        pic: "lunge_right.png",
        descriptions: [
            "SW",
            "NE"
        ],
        behavior: [
            [["move", -1, 1]],

            [["move", 1, -1],
            ["move", 1, -1],
            ["attack", 1, -1]]
            
        ]
    }
}
function sprint(){
    return{
        name: "sprint",
        pic: "sprint.png",
        descriptions: [
            "N"
        ],
        behavior: [
            [["move", 0, -1],
            ["move", 0, -1],
            ["move", 0, -1]]
        ]
    }
}
function trident(){
    return{
        name: "trident",
        pic: "trident.png",
        descriptions: [
            "N",
            "E",
            "W"
        ],
        behavior: [
            [["attack", 1, -2],
            ["attack", 0, -2],
            ["attack", -1, -2]],

            [["attack", 2, 1],
            ["attack", 2, 0],
            ["attack", 2, -1]],

            [["attack", -2, 1],
            ["attack", -2, 0],
            ["attack", -2, -1]]
            
        ]
    }
}
function whack(){
    return{
        name: "whack",
        pic: "whack.png",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["attack", 0, -1],
            ["attack", 0, -1]],

            [["attack", 1, 0],
            ["attack", 1, 0]],

            [["attack", 0, 1],
            ["attack", 0, 1]],

            [["attack", -1, 0],
            ["attack", -1, 0]]
            
        ]
    }
}
function spin_attack(){
    return{
        name: "spin attack",
        pic: "spin_attack.png",
        descriptions: ["spin"],
        behavior: [
            [["attack", 1, 1],
            ["attack", 1, 0],
            ["attack", 1, -1],
            ["attack", 0, 1],
            ["attack", 0, -1],
            ["attack", -1, 1],
            ["attack", -1, 0],
            ["attack", -1, -1]]
        ]
    }
}
function butterfly(){
    return{
        name: "butterfly",
        pic: "butterfly.png",
        descriptions: [
            "NE",
            "SE",
            "SW",
            "NW"
   
        ],
        behavior: [
            [["move", 2, -2]],
            [["move", 1, 1]],
            [["move", -1, 1]],
            [["move", -2, -2]]
        ]
    }
}
function retreat(){
    return{
        name: "retreat",
        pic: "retreat.png",
        descriptions: [
            "SE", 
            "S",
            "SW"
        ],
        behavior: [
            [["move", 1, 1]],

            [["move", 0, 1],
            ["move", 0, 1],
            ["move", 0, 1]],

            [["move", -1, 1]]
        ]
    }
}
function force(){
    return{
        name: "force",
        pic: "force.png",
        descriptions: [
            "N",
        ],
        behavior: [
            [["attack", 0, -1],
            ["move", 0, -1],
            ["attack", 0, -1],
            ["move", 0, -1]]
        ]
    }
}
function side_attack(){
    return{
        name: "side attack",
        pic: "side_attack.png",
        descriptions: [
            "E",
            "W"
        ],
        behavior: [
            [["attack", 1, 0],
            ["attack", 2, 0],
            ["attack", 3, 0],],

            [["attack", -1, 0],
            ["attack", -2, 0],
            ["attack", -3, 0]]
        ]
    }
}
function clear_behind(){
    return{
        name: "clear behind",
        pic: "clear_behind.png",
        descriptions: [
            "S"
        ],
        behavior: [
            [["attack", 1, 1],
            ["attack", 0, 1],
            ["attack", -1, 1],
            ["attack", 1, 2],
            ["attack", 0, 2],
            ["attack", -1, 2]]
        ]
    }
}
function spear_slice(){
    return{
        name: "spear slice",
        pic: "spear_slice.png",
        descriptions: [
            "N", 
        ],
        behavior: [
            [["attack", 1, -2],
            ["attack", 1, -1],
            ["attack", 0, -2],
            ["attack", -1, -2],
            ["attack", -1, -1]]
        ]
    }
}
function jab(){
    return{
        name: "jab",
        pic: "jab.png",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["attack", 0, -1],
            ["attack", 0, -2]],

            [["attack", 1, 0],
            ["attack", 2, 0]],

            [["attack", 0, 1],
            ["attack", 0, 2]],

            [["attack", -1, 0],
            ["attack", -2, 0]]
        ]
    }
}
function overcome(){
    return{
        name: "overcome",
        pic: "overcome.png",
        descriptions: [
            "N",
            "S"
        ],
        behavior: [
            [
            ["attack", 1, -1],
            ["attack", 0, -1],
            ["attack", -1, -1],
            ["move", 0, -2]],

            [["attack", 1, 1],
            ["attack", 0, 1],
            ["attack", -1, 1],
            ["move", 0, 2]]
        ]
    }
}
function hit_and_run(){
    return{
        name: "hit and run",
        pic: "hit_and_run.png",
        descriptions: [
            "S"
        ],
        behavior: [
            [["attack", 1, -1],
            ["attack", 0, -1],
            ["attack", -1, -1],
            ["move", 0, 1]]
        ]
    }
}
function v(){
    return{
        name: "v",
        pic: "v.png",
        descriptions: [
            "NE",
            "NW"
        ],
        behavior: [
            [["attack", 1, -1],
            ["move", 1, -1]],

            [["attack", -1, -1],
            ["move", -1, -1]]
        ]
    }
}
function push_back(){
    return{
        name: "push back",
        pic: "push_back.png",
        descriptions: [
            "SE",
            "SW",
        ],
        behavior: [
            [["attack", -1, -1],
            ["move", 1, 1]],

            [["attack", 1, -1],
            ["move", -1, 1]],
        ]
    }
}
function fork(){
    return{
        name: "fork",
        pic: "fork.png",
        descriptions: [
            "N",
            "E",
            "S",
            "W"
        ],
        behavior: [
            [["attack", 1, -1],
            ["attack", -1, -1],
            ["attack", 1, -2],
            ["attack", -1, -2]],

            [["attack", 1, 1],
            ["attack", 1, -1],
            ["attack", 2, 1],
            ["attack", 2, -1]],

            [["attack", 1, 1],
            ["attack", -1, 1],
            ["attack", 1, 2],
            ["attack", -1, 2]],

            [["attack", -1, 1],
            ["attack", -1, -1],
            ["attack", -2, 1],
            ["attack", -2, -1]]
        ]
    }
}
function explosion(){
    var area = [];
    var radius = 2;
    for(var i = -1 * radius; i <= radius; ++i){
        for(var j = -1 * radius; j <= radius; ++j){
            area.push(["attack", i, j]);
        }
    }
    return{
        name: "explosion",
        pic: "explosion.png",
        descriptions: [
            "Explode"
        ],
        behavior: [
            area
        ]
    }
}
function breakthrough(){
    return{
        name: "breakthrough",
        pic: "breakthrough.png",
        descriptions: [
            "N"
        ],
        behavior: [
            [["move", 0, -1],
            ["attack", 0, -1],
            ["attack", 1, 0],
            ["attack", -1, 0]],
        ]
    }
}
function flanking_diagonal(){
    return{
        name: "flanking diagonal",
        pic: "flanking_diagonal.png",
        descriptions: [
            "NE",
            "NW"
        ],
        behavior: [
            [["move", 1, -1],
            ["attack", 0, 1],
            ["attack", -1, 0],
            ["move", 1, -1],
            ["attack", 0, 1],
            ["attack", -1, 0],],

            [["move", -1, -1],
            ["attack", 0, 1],
            ["attack", 1, 0],
            ["move", -1, -1],
            ["attack", 0, 1],
            ["attack", 1, 0],]
        ]
    }
}
function flanking_sideways(){
    return{
        name: "flanking sideways",
        pic: "flanking_sideways.png",
        descriptions: [
            "E",
            "W"
        ],
        behavior: [
            [["move", 1, 0],
            ["attack", 0, 1],
            ["attack", 0, -1],
            ["move", 1, 0],
            ["attack", 0, 1],
            ["attack", 0, -1]],

            [["move", -1, 0],
            ["attack", 0, 1],
            ["attack", 0, -1],
            ["move", -1, 0],
            ["attack", 0, 1],
            ["attack", 0, -1]]
        ]
    }
}
function flanking_straight(){
    return{
        name: "flanking straight",
        pic: "flanking_straight.png",
        descriptions: [
            "N",
            "S"
        ],
        behavior: [
            [["move", 0, -1],
            ["attack", 1, 0],
            ["attack", -1, 0],
            ["move", 0, -1],
            ["attack", 1, 0],
            ["attack", -1, 0]],

            [["move", 0, 1],
            ["attack", 1, 0],
            ["attack", -1, 0],
            ["move", 0, 1],
            ["attack", 1, 0],
            ["attack", -1, 0]]
        ]
    }
}
function pike(){
    return{
        name: "pike",
        pic: "pike.png",
        descriptions: [
            "N",
            "E",
            "W"
        ],
        behavior: [
            [["attack", 0, -2],
            ["attack", 1, -3],
            ["attack", 0, -3],
            ["attack", -1, -3]],

            [["attack", 2, 0],
            ["attack", 3, 1],
            ["attack", 3, 0],
            ["attack", 3, -1]],

            [["attack", -2, 0],
            ["attack", -3, 1],
            ["attack", -3, 0],
            ["attack", -3, -1]]
            
        ]
    }
}// ----------------EntityList.js----------------
// EntityList class is used by the GameMap class to keep track of entities without having to search through the map each time.

class EntityList{
    count // Keeps track of the number of entities currently in the class.
    #player // Keeps track of the player postion.
    #exit // Keeps track of the position of the exit.
    #enemy_list // A list of each enemy currently on the board and their locations.
    #id_count // Used to give each enemy a unique id as it is added.
    constructor(){
        this.count = 2;
        this.#id_count = 0;
        this.#player = 0;
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
        if(this.#player === 0){
            throw new Error("player doesn't exist");
        }
        return {x: this.#player.x, y: this.#player.y};
    }
    set_exit(x, y){
        this.#exit = {x, y};
    }
    get_exit_pos(){
        if(this.#player === 0){
            throw new Error("exit doesn't exist");
        }
        return {x: this.#exit.x, y: this.#exit.y};
    }
    add_enemy(x, y, enemy){
        enemy.id = this.next_id();
        this.#enemy_list.push({x, y, enemy});
        ++this.count;
    }
    move_enemy(x, y, id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error("id not found");
        }
        this.#enemy_list[index].x = x;
        this.#enemy_list[index].y = y;
    }
    remove_enemy(id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error("id not found");
        }
        this.#enemy_list = this.#enemy_list.slice(0, index).concat(this.#enemy_list.slice(index + 1, this.#enemy_list.length));
        --this.count;
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
        if(entity.type === "player"){
            this.set_player(x, y);
        }
        else if(entity.type === "enemy"){
            this.move_enemy(x, y, entity.id);
        }
        else{
            throw new Error("moving invalid type");
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
                    if(e.enemy.hasOwnProperty("stun") && e.enemy.stun > 0){
                        --e.enemy.stun;
                    }
                    else{
                        e.enemy.behavior(e.x, e.y, this.#player.x - e.x, this.#player.y - e.y, map, e.enemy);
                        map.display();
                        await delay(ANIMATION_DELAY);
                    }
                }
                catch(error){
                    if(error.message === "game over"){
                        throw new Error("game over", {cause: e.enemy.name});
                    }
                    throw error;
                }
            } 
        }
    }
}
// ----------------Floors.js----------------
// File containing the functions for generating new floors.

const BOSS_FLOOR = [velociphile_floor];

function floor_generator(floor, map){
    if(!(floor % 5 === 0) || Math.floor(floor / 5) - 1 >= BOSS_FLOOR.length){
        generate_normal_floor(floor, map, ENEMY_LIST);
    }
    else{
        BOSS_FLOOR[Math.floor(floor / 5) - 1](floor, map);
    }
}

function generate_normal_floor(floor, map, enemies){
    for(var i = floor * 2; i > 0;){
        var choice = Math.floor(Math.random() * enemies.length);
        var new_enemy = enemies[choice]();
        if(new_enemy.difficulty <= i){
            map.add_tile(new_enemy);
            i -= new_enemy.difficulty;
        }
    }
    describe("Welcome to floor " + floor + ".");
}

function velociphile_floor(floor, map){
    map.add_tile(velociphile_tile());
    map.lock();
    for(var i = 0; i < 8; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    describe("Welcome to floor " + floor + ".\nYou hear a deafening shriek.")
}// ----------------GameMap.js----------------
// GameMap class holds the information on the current floor and everything on it.

const GRID_SCALE = 30; // Controls the size of tiles when the map is displayed.

class GameMap{
    #x_max; // Size of the grid's x axis.
    #y_max; // Size of the grid's y axis.
    #entity_list; // entity_list class makes keeping track of entity locations easier.
    #grid; // Grid is a 2d list of tiles representing the entity in each location.
    #floor; // The current floor number.
    #turn_count; // How many turns the player has taken.
    constructor(x_max, y_max){
        this.#x_max = x_max;
        this.#y_max = y_max;
        this.#floor = 0;
        this.#turn_count = 0;
        this.erase()
    }
    erase(player_health = -1){
        // Function to start a new floor by erasing the board and adding only the player and the exit.
        // Returns the floor number.
        this.#entity_list = new EntityList();
        this.#grid = [];
        for(var i = 0; i < this.#x_max; ++i){
            this.#grid.push([]);
            for(var j = 0; j < this.#y_max; ++j){
                this.#grid[i].push(empty_tile());
            }
        }
        this.set_exit(Math.floor(Math.random() * this.#y_max), 0)
        this.set_player(Math.floor(Math.random() * this.#y_max), this.#x_max - 1, player_health)
        return ++this.#floor;
    }
    random_space(){
        // Returns a randome space in the grid.
        x = Math.floor(Math.random() * this.#x_max);
        y = Math.floor(Math.random() * this.#y_max);
        return {x, y};
    }
    random_empty(){
        // Returns a random empty space in the grid.
        // Throws an erro if the map is full.
        var num_empty = this.#x_max * this.#y_max - this.#entity_list.count;
        var rand = Math.floor(Math.random() * num_empty);
        if(num_empty === 0){
            throw new Error("map full");
        }
        for(var x = 0; x < this.#x_max; ++x){
            for(var y = 0; y < this.#y_max; ++y){
                if(this.#grid[x][y].type === "empty"){
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
            throw new Error("x out of bounds");
        }
        if(y < 0 || y >= this.#y_max){
            throw new Error("y out of bounds");
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
        return this.#grid[x][y].type === "empty";
    }
    set_exit(exit_x, exit_y){
        // Places the exit.
        // Throws an error if the space is occupied or out of bounds..
        this.check_bounds(exit_x, exit_y);
        if(!this.check_empty(exit_x, exit_y)){
            throw new Error("space not empty");
        }
        this.#entity_list.set_exit(exit_x, exit_y);
        this.#grid[exit_x][exit_y] = exit_tile();
    }
    set_player(player_x, player_y, player_health = -1){
        // Places the player. If a non-negative value is given for the player's health, it will be set to that.
        // Throws an error is the space is occupied or out of bounds.
        this.check_bounds(player_x, player_y);
        if(!this.check_empty(player_x, player_y)){
            throw new Error("space not empty");
        }
        this.#entity_list.set_player(player_x, player_y);
        var player = player_tile();
        if(player_health > 0){
            player.health = player_health;
        }
        this.#grid[player_x][player_y] = player;
    }
    add_tile(tile, x = -1, y = -1){
        // Adds a new tile to a space.
        // Returns true if it was added successfuly.
        // If x or y aren't provided, it will select a random empty space.
        try{
            if(x === -1 || y === -1){
                var position = this.random_empty();
                x = position.x;
                y = position.y;
            }
            this.check_bounds(x, y);
            if(!this.check_empty(x, y)){
                throw new Error("space not empty");
            }
        }
        catch{
            return false;
        }
        this.#grid[x][y] = tile;
        if(tile.type === "enemy"){
            this.#entity_list.add_enemy(x, y, tile);
        }
        return true;
    }
    display(){
        // Diplays the gamemap. Each element shows it's description and hp (if applicable) when clicked.
        // If any empty tiles have been marked as hit, it resets the pic to empty.
        // Shows the player's remaining health below.
		var visual_map = document.getElementById("mapDisplay");
        while(visual_map.rows.length > 0){
            visual_map.deleteRow(0);
        }
		for (var y = 0; y < this.#y_max; y++){
			var row = document.createElement("tr");
            row.id = "row " + y;
            var desc = function(str){return function(){
                describe(str);
            }};
			for (var x = 0; x < this.#x_max; x++){
                var tile_description = this.#grid[x][y].description;
                if(this.#grid[x][y].hasOwnProperty("health")){
                    tile_description = "(" + this.#grid[x][y].health + " hp) " + tile_description;
                }
                var cell = make_cell(x + " " + y, "images/tiles/" + this.#grid[x][y].pic, GRID_SCALE, desc, tile_description);
                if(this.#grid[x][y].type === "empty"){
                    this.#grid[x][y].pic = "empty.png";
                }
				row.append(cell);
			}
			visual_map.append(row);
		}
        var row = document.createElement("tr");
        row.id = "health";
        for(var i = 0; i < this.player_health(); ++i){
            var cell = make_cell("health " + i, "images/other/heart.png", GRID_SCALE);
			row.append(cell);
        }
        visual_map.append(row);
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
        var start = this.#grid[x1][y1];
        var end = this.#grid[x2][y2];
        if(start.type === "player" && end.type === "exit"){
            this.#turn_count++;
            throw new Error("floor complete");
        }
        if(end.hasOwnProperty("on_enter")){
            // If the destination does something if moved onto, call it.
            try{
                end.on_enter(x2, y2, x1 - x2, y1 - y2, this, end);
            }
            catch(error){
                if(error.message === "game over"){
                    throw new Error("game over", {cause: end.name});
                }
                else{
                    throw error;
                }
            }
        }
        if(!(end.type === "empty")){
            return false;
        }
        this.#entity_list.move_any(x2, y2, start);
        this.#grid[x2][y2] = start;
        this.#grid[x1][y1] = empty_tile();
        return true;
    }
    player_move(x_dif, y_dif){
        // Moves the player the given relative distance.
        var pos = this.#entity_list.get_player_pos();
        return this.move(pos.x, pos.y, pos.x + x_dif, pos.y + y_dif)
    }
    player_health(){
        // Returns the player's health.
        var pos = this.#entity_list.get_player_pos();
        return this.#grid[pos.x][pos.y].health;
    }
    attack(x, y, hits = "all"){
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
        var target = this.#grid[x][y];
        if(target.hasOwnProperty("health") && !(target.type === "player") && (hits === "enemy" || hits === "all")){
            target.health -= 1;
            if(target.health === 0){
                this.#grid[x][y] = empty_tile()
                this.#grid[x][y].pic = "hit.png";
                if(target.type === "enemy"){
                    this.#entity_list.remove_enemy(target.id)
                }
                if(target.hasOwnProperty("on_death")){
                    var player_pos = this.#entity_list.get_player_pos();
                    target.on_death(x, y, player_pos[0] - x, player_pos[1] - y, this, target);
                }
            }
            return true;
        }
        if(target.type === "player" && (hits === "player" || hits === "all")){
            target.health -= 1;
            if(target.health === 0){
                throw new Error("game over")
            }
            return true;
        }
        if(target.type === "empty"){
            target.pic = "hit.png";
        }
        return false;
    }
    player_attack(x_dif, y_dif){
        // Attacks the given square relative to the player's current positon.
        var pos = this.#entity_list.get_player_pos();
        try{
            this.attack(pos.x + x_dif, pos.y + y_dif, "all");
        }
        catch{
            throw new Error("game over", {cause: "player"});
        }
    }
    async enemy_turn(){
        // Causes each enemy to execute their behavior.
        this.#turn_count++;
        await this.#entity_list.enemy_turn(this);
    }
    display_stats(element){
        // Shows the current floor and turn number.
        element.innerText = "Floor " + this.#floor + " Turn: " + this.#turn_count;
    }
    lock(){
        // Locks the stairs for a boss fight.
        var pos = this.#entity_list.get_exit_pos();
        this.#grid[pos.x][pos.y] = lock_tile();
    }
    unlock(){
        // Unlocks the stairs after a boss fight.
        var pos = this.#entity_list.get_exit_pos();
        this.#grid[pos.x][pos.y] = exit_tile();
    }
}// ----------------Gameplay.js----------------
// File contains functions that control the main gameplay.

const ANIMATION_DELAY = 300; // Controls the length of time the map is displayed before moving onto the next entitie's turn in ms.
const WELCOME_MESSAGE = "Welcome to the dungeon.\n"
                        + "Use cards to move (blue) and attack (red).\n" 
                        + "Click on things to learn more about them."; // Message displayed at the start of the dungeon.
const STARTING_ENEMY = spider_tile; // Controls the single enemy on the first floor.


function setup(){
    // Function ran on page load or on restart to set up the game.
    describe(WELCOME_MESSAGE);
    mapData = new GameMap(8, 8);  
    mapData.add_tile(STARTING_ENEMY());
    mapData.display();
    mapData.display_stats(document.getElementById("stats"));
    deck = make_starting_deck();
    deck.display_hand(document.getElementById("handDisplay"));
}
function describe(description){
    // Used to display text to the "displayMessage" element
    document.getElementById("displayMessage").innerText = description;
}
function clear_tb(element_id){
    // Deletes all rows from the given html table.
    while(document.getElementById(element_id).rows.length > 0){
        document.getElementById(element_id).deleteRow(0);
    }
}
function prep_move(move, hand_pos){
    // When the user clicks a card in their hand, this creates buttons they can use to pick their move
    // from the options for that card.
    clear_tb("moveButtons");
    var row = document.createElement("tr");
    row.id = "buttons";
    for(var i = 0; i < move.descriptions.length; ++i){
        var cell = document.createElement("input");
        cell.type = "button"
        cell.name = move.descriptions[i];
        cell.value = move.descriptions[i];
        var act = function(behavior, hand_pos){return function(){action(behavior, hand_pos)}};
        cell.onclick = act(move.behavior[i], hand_pos);
        row.append(cell);
    }
    document.getElementById("moveButtons").append(row);
}
async function action(behavior, hand_pos){
    // Function to execute the outcome of the player's turn.
    try{
        for(var i = 0; i < behavior.length; ++i){
            // Does each valid command in the behavior list.
            if(behavior[i][0] === "attack"){
                mapData.player_attack(behavior[i][1], behavior[i][2]);
            }
            else if(behavior[i][0] === "move"){
                mapData.player_move(behavior[i][1], behavior[i][2]);
            }
            else{
                throw new Error("invalid action type");
            }
        }
        // Discards the card the user used.
        deck.discard(hand_pos);
        clear_tb("moveButtons");
        deck.display_hand(document.getElementById("handDisplay"));
        mapData.display();
        describe("");
        await delay(ANIMATION_DELAY);
        // Does the enemies' turn.
        await mapData.enemy_turn();
        mapData.display();
        // Update turn number.
        mapData.display_stats(document.getElementById("stats"))
    }
    catch (error){
        var m = error.message;
        if(m === "floor complete"){
            // If the player has reached the end of the floor.
            mapData.display_stats(document.getElementById("stats"))
            modify_deck();
        }
        else if(m === "game over"){
            // If the player's health reached 0
            game_over(error.cause);
        }
        else if(m === "pass to player"){
            // If the enemies' turn was interrupted.
            mapData.display();
            mapData.display_stats(document.getElementById("stats"))
        }
        else{
            console.log(m)
        }
    }
}
function new_floor(){
    // Creates the next floor.
    clear_tb("modifyDeck");
    document.getElementById("currentDeck").innerText = "";
    clear_tb("displayDeck");
    var floor = mapData.erase(mapData.player_health());
    floor_generator(floor, mapData);
    mapData.display_stats(document.getElementById("stats"));
    deck.deal();
    mapData.display();
    deck.display_hand(document.getElementById("handDisplay"));
}
function modify_deck(){
    // Gives the player the option to add or remove a card from their deck.
    // Their deck contents are also displayed.
    // Options to remove cards will not be displayed if the deck is at the minimum size already.
    var add_list = [];
    var remove_list = [];
    var table = document.getElementById("modifyDeck");
    deck.display_all(document.getElementById("displayDeck"));
    for(var i = 0; i < ADD_CHOICES; ++i){
        add_list.push(CARD_CHOICES[Math.floor(Math.random() * CARD_CHOICES.length)]());
    }
    try{
        for(var i = 0; i < REMOVE_CHOICES; ++i){
            remove_list.push(deck.get_rand());
        }
    }
    catch{
        // deck.get_rand throws an error if the deck is at the minimum size, in which case they should not
        // be able to remove more cards.
    }
    clear_tb("mapDisplay");
    clear_tb("handDisplay");
    clear_tb("moveButtons");
    describe("Choose one card to add or remove");

    // Options to add.
    var add = function(card){return function(){
        deck.add(card);
        new_floor();
    }};
    var add_row = document.createElement("tr");
    add_row.id = "add_row";
    var plus = make_cell("plus", "images/other/plus.png", HAND_SCALE);
    add_row.append(plus);
    for(var i = 0; i < add_list.length; ++i){
        var cell = make_cell("card " + i, "images/cards/" + add_list[i].pic, HAND_SCALE, add, add_list[i]);
        add_row.append(cell);
    }

    // Options to Remove.
    var remove = function(card){return function(){
        deck.remove(card.id);
        new_floor();
    }};
    var remove_row = document.createElement("tr");
    remove_row.id = "remove_row";
    var minus = make_cell("plus", "images/other/minus.png", HAND_SCALE);
    if(remove_row.length === 0){
        minus = make_cell("x", "images/other/x.png", HAND_SCALE);
    }
    remove_row.append(minus);
    for(var i = 0; i < remove_list.length; ++i){
        var cell = make_cell("card " + i, "images/cards/" + remove_list[i].pic, HAND_SCALE, remove, remove_list[i]);
        remove_row.append(cell);
    }

    table.append(add_row);
    table.append(remove_row);
}
function make_cell(id, pic, size, click = undefined, param1 = undefined, param2 = undefined){
    // Function to make a cell for a table.
    //  id is the id the cell should get.
    //  pic is the image source the cell should have.
    //  size is the width and height of the image.
    //  click is the onclick function.
    //  param1 and param2 are the parameter that should be given to the onclick if they are provided.
    // Returns the cell
    var cell = document.createElement("td");
    cell.id = id;
    var image = document.createElement("img");
    image.src = pic;
    image.height = size;
    image.width = size;
    if(click != undefined){
        if(param2 === undefined){
            image.onclick = click(param1);
        }
        else{
            image.onclick = click(param1, param2);
        }
    }
    cell.append(image);
    return cell;
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
    clear_tb("handDisplay");
    clear_tb("moveButtons");
    describe("Game Over. You were killed by a " + cause + ".");
    clear_tb("moveButtons");
    var row = document.createElement("tr");
    row.id = "buttons";
    var cell = document.createElement("input");
    cell.type = "button"
    cell.name = "retry";
    cell.value = "retry";
    var restart = function(){
        clear_tb("moveButtons");
        setup();
    };
    cell.onclick = restart;
    row.append(cell);
    document.getElementById("moveButtons").append(row);
}// ----------------MoveDeck.js----------------
// The MoveDeck class contains the player's current deck of move cards.

const HAND_SIZE = 3; // The number of options available each turn.
const HAND_SCALE = 100; // The size of the cards when they are displayed.
const ADD_CHOICES = 3; // How many card options they get when adding cards.
const REMOVE_CHOICES = 3; // How many card options they get when removing cards.
const DECK_MINIMUM = 5; // The minimum number of cards they can have in their deck.
const DECK_DISPLAY_WIDTH = 4; // How many cards shown per line when the deck is displayed.

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
            var ran = Math.floor(Math.random() * arr.length);
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
            throw new Error("hand out of bounds");
        }
        if(this.#library.length === 0){
            while(this.#discard_pile.length != 0){
                this.#library.push(this.#discard_pile.pop());
            }
            this.#library = this.#shuffle(this.#library);
        }
        this.#discard_pile.push(this.#hand[x]);
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
        this.#id_count++;
        this.#library.push(card);
        this.#library = this.#shuffle(this.#library);
    }
    display_hand(table){
        // Displays the hand to the given table.
        while(table.rows.length > 0){
            table.deleteRow(0);
        }
        var row = document.createElement("tr");
        row.id = "hand";
        var prep = function(move, hand_pos){return function(){prep_move(move, hand_pos)}};
        for(var i = 0; i < this.#hand.length; ++i){
            var cell =  make_cell("card " + i, "images/cards/" + this.#hand[i].pic, HAND_SCALE, prep, this.#hand[i], i);
			row.append(cell);
        }
        table.append(row);
    }
    display_all(table){
        // Displays the deck list to the given table.
        document.getElementById("currentDeck").innerText = "Current Deck (minimum " + DECK_MINIMUM + "):";
        for(var i = 0; i < Math.ceil(this.#list.length / DECK_DISPLAY_WIDTH); ++i){
            var row = document.createElement("tr");
            for(var j = 0; j < DECK_DISPLAY_WIDTH && j + i * DECK_DISPLAY_WIDTH < this.#list.length; ++j){
                var cell =  make_cell("card " + (i * DECK_DISPLAY_WIDTH + j), "images/cards/" + this.#list[i * DECK_DISPLAY_WIDTH + j].pic, HAND_SCALE);
			    row.append(cell);
            }
            table.append(row);
        }
    }
    get_rand(){
        // gets a random card in the deck.
        // Throws an error if the deck is at it's minimum size.
        if(this.#list.length <= DECK_MINIMUM){
            throw new Error("deck minimum reached");
        }
        return this.#list[Math.floor(Math.random() * this.#list.length)];
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
}// ----------------Tiles.js----------------
// This file contains the functions to generate tiles representing things on the game_map.

// Fields (not all are used by each tile):
//  type: the category this tile falls under (empty, exit, player, enemy, terrain)
//  name: necessary if it can deal damage or the type has multiple tiles.
//  pic: the picture representing this tile. May be an array if the picture changes.
//  health: how many hits it takes to kill this tile.
//  difficulty: how much it costs the floor generator to spawn this.
//  behavior: the logic for what this tile does on it's turn.
//  description: info that will be displayed when the user clicks on the tile.

// This is a list of all the enemies that can be spawned on a normal floor.
const ENEMY_LIST = [spider_tile, turret_h_tile, turret_d_tile, scythe_tile, knight_tile, 
    spider_web_tile, ram_tile, large_porcuslime_tile, medium_porcuslime_tile, acid_bug_tile, brightling_tile];

function empty_tile(){
    return {
        type: "empty",
        pic: "empty.png",
        description: empty_description
    }
}
function exit_tile(){
    return {
        type: "exit",
        pic: "stairs.png",
        description: exit_description
    }
}
function lock_tile(){
    return {
        type: "terrain",
        name: "lock",
        pic: "lock.png",
        description: lock_description
    }
}
function player_tile(){
    return {
        type: "player",
        name: "player",
        pic: "helmet.png",
        health: 3,
        description: player_description
    }
}

function spider_tile(){
    return {
        type: "enemy",
        name: "spider",
        pic: "spider.png",
        health: 1,
        difficulty: 1,
        behavior: spider_ai,
        description: spider_description
    }
}
function turret_h_tile(){
    return {
        type: "enemy",
        name: "turret",
        pic: "turret_h.png",
        health: 1,
        difficulty: 2,
        behavior: turret_h_ai,
        description: turret_h_description
    }
}
function turret_d_tile(){
    return {
        type: "enemy",
        name: "turret",
        pic: "turret_d.png",
        health: 1,
        difficulty: 2,
        behavior: turret_d_ai,
        description: turret_d_description
    }
}
function scythe_tile(){
    return{
        type: "enemy",
        name: "scythe",
        pic: "scythe_se.png",
        health: 1,
        difficulty: 3,
        behavior: scythe_ai,
        description: scythe_description
    }
}
function knight_tile(){
    return{
        type: "enemy",
        name: "knight",
        pic: "knight.png",
        health: 2,
        difficulty: 4,
        behavior: knight_ai,
        description: knight_description
    }
}
function spider_web_tile(){
    spawn_timer = 2
    return{
        type: "enemy",
        name: "spider egg",
        pic: "spider_web.png",
        cycle: 0,
        spawn_timer,
        health: 2,
        difficulty: 4,
        behavior: spider_web_ai,
        description: spider_web_description[0] + (spawn_timer + 1) + spider_web_description[1]
    }
}
function ram_tile(){
    var pic_arr = ["ram.png", "ram_charge.png"];
    var starting_cycle = 0;
    return{
        type: "enemy",
        name: "ram",
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
        type: "enemy",
        name: "porcuslime",
        pic: "large_porcuslime.png",
        health: 3,
        difficulty: 8,
        behavior: large_porcuslime_ai,
        description: large_porcuslime_description
    }
}
function medium_porcuslime_tile(){
    var ran = Math.floor(Math.random(2));
    var pic_arr = ["medium_h_porcuslime.png", "medium_d_porcuslime.png"];
    return {
        type: "enemy",
        name: "medium porcuslime",
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
        type: "enemy",
        name: "small porcuslime",
        pic: "small_h_porcuslime.png",
        health: 1,
        difficulty: 3,
        behavior: small_h_porcuslime_ai,
        description: small_h_porcuslime_description
    }
}
function small_d_porcuslime_tile(){
    return {
        type: "enemy",
        name: "small porcuslime",
        pic: "small_d_porcuslime.png",
        health: 1,
        difficulty: 3,
        behavior: small_d_porcuslime_ai,
        description: small_d_porcuslime_description
    }
}
function acid_bug_tile(){
    return {
        type: "enemy",
        name: "acid bug",
        pic: "acid_bug.png",
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
        type: "enemy",
        name: "brightling",
        pic: "brightling.png",
        cycle: starting_cycle,
        health: 1,
        difficulty: 4,
        behavior: brightling_ai,
        description: brightling_description
    }
}

function velociphile_tile(){
    return{
        type: "enemy",
        name: "velociphile",
        pic: "velociphile.png",
        health: 4,
        difficulty: "boss",
        behavior: velociphile_ai,
        on_death: velociphile_death,
        description: velociphile_description
    }
}

function lava_pool_tile(){
    return {
        type: "terrain",
        name: "lava pool",
        pic: "lava_pool.png",
        description: lava_pool_description,
        on_enter: hazard
    }
}
function wall_tile(){
    return {
        type: "terrain",
        name: "wall",
        pic: "wall.png",
        description: wall_description
    }
}
function damaged_wall_tile(){
    var health = Math.ceil(Math.random() * 2);
    return {
        type: "terrain",
        name: "damaged wall",
        pic: "damaged_wall.png",
        health,
        on_death: wall_death,
        description: damaged_wall_description

    }
}

// Descriptions
const empty_description = "There is nothing here.";
const exit_description = "Stairs to the next floor.";
const player_description = "You.";
const spider_description = "Spider: Will attack the player if it is next to them. Otherwise it will move 1 space closer.";
const turret_h_description = "Turret: Does not move. Fires beams orthogonally that hit the first thing in their path.";
const turret_d_description = "Turret: Does not move. Fires beams diagonally that hit the first thing in their path.";
const scythe_description = "Scythe: Will move 3 spaces diagonally towards the player damaging them if it passes next to them. Can only see diagonally.";
const knight_description = "Knight: Moves in an L shape. If it tramples the player, it will move again.";
const spider_web_description = ["Spider egg: Does not move. Spawns a spider every ", " turns."];
const ram_description = "Ram: Moves orthogonally. When it sees the player, it will prepare to charge towards them and ram them.";
const large_porcuslime_description = "Large Porcuslime: Moves towards the player 1 space and attacks in that direction. Weakens when hit."
const medium_porcuslime_description = "Medium Porcuslime: Moves towards the player 1 space and attacks in that direction. Alternates between orthoganal and diagonal movement. Splits when hit."
const small_h_porcuslime_description = "Small Porcuslime: Moves towards the player 1 space orthogonally and attacks in that direction."
const small_d_porcuslime_description = "Small Porcuslime: Moves towards the player 1 space diagonally and attacks in that direction."
const acid_bug_description = "Acid bug: Moves towards the player 1 space. Has no normal attack, but will spray acid upon death hurting everything next to it."
const brightling_description = "Brightling: Will occasionally teleport the player close to it before teleoprting away the next turn."

const velociphile_description = "Velociphile (Boss): A rolling ball of mouths and hate. Moves in straight lines. Must build up speed to ram you.";

const lava_pool_description = "Lava Pool: Attempting to move through this will hurt."
const wall_description = "A wall. It seems sturdy."
const damaged_wall_description = "A wall. It is damaged. something might live inside."
const lock_description = "The exit is locked. Defeat the boss to continue."
const enemy_list = [spider_tile, turret_h_tile, turret_d_tile, scythe_tile, knight_tile, spider_egg_tile, ram_tile];

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
function player_tile(){
    return {
        type: "player",
        pic: "helmet.png",
        health: 3,
        description: player_description
    }
}
function spider_tile(){
    return {
        type: "enemy",
        enemy_type: "spider",
        pic: "spider.png",
        id: "",
        health: 1,
        difficulty: 1,
        behavior: spider_ai,
        description: spider_description
    }
}
function turret_h_tile(){
    return {
        type: "enemy",
        enemy_type: "turret",
        pic: "turret_h.png",
        id: "",
        health: 1,
        difficulty: 2,
        behavior: turret_h_ai,
        description: turret_h_description
    }
}
function turret_d_tile(){
    return {
        type: "enemy",
        enemy_type: "turret",
        pic: "turret_d.png",
        id: "",
        health: 1,
        difficulty: 2,
        behavior: turret_d_ai,
        description: turret_d_description
    }
}
function scythe_tile(){
    return{
        type: "enemy",
        enemy_type: "scythe",
        pic: "scythe.png",
        id: "",
        health: 1,
        difficulty: 3,
        behavior: scythe_ai,
        description: scythe_description
    }
}
function knight_tile(){
    return{
        type: "enemy",
        enemy_type: "knight",
        pic: "knight.png",
        id: "",
        health: 2,
        difficulty: 4,
        behavior: knight_ai,
        description: knight_description
    }
}
function spider_egg_tile(){
    spawn_timer = 2
    return{
        type: "enemy",
        enemy_type: "spider egg",
        pic: "spider_egg.png",
        cycle: 0,
        spawn_timer,
        id: "",
        health: 2,
        difficulty: 4,
        behavior: spider_egg_ai,
        description: spider_egg_description[0] + (spawn_timer + 1) + spider_egg_description[1]
    }
}
function ram_tile(){
    return{
        type: "enemy",
        enemy_type: "ram",
        pic: "ram.png",
        cycle: 0,
        id: "",
        health: 2,
        difficulty: 5,
        behavior: ram_ai,
        description: ram_description
    }
}



function velociphile_tile(){
    return{
        type: "enemy",
        enemy_type: "velociphile",
        pic: "velociphile.png",
        id: "",
        health: 3,
        difficulty: "boss",
        behavior: velociphile_ai,
        description: velociphile_description
    }
}

const empty_description = "There is nothing here.";
const exit_description = "Stairs to the next floor.";
const player_description = "You.";
const spider_description = "Spider: Will attack the player if it is next to them. Otherwise it will move closer.";
const turret_h_description = "Turret: Does not move. Fires beams orthogonally hurting anything in it's path.";
const turret_d_description = "Turret: Does not move. Fires beams diagonally hurting anything in it's path.";
const scythe_description = "Scythe: Will move 3 spaces diagonally towards the player damaging them if it passes next to them. Can only see diagonally.";
const knight_description = "Knight: Moves in an L shape. If it tramples the player, it will move again.";
const spider_egg_description = ["Spider egg: Spawns a spider every ", " turns."];
const ram_description = "Ram: Moves orthogonally. When it sees the player, it will prepare to charge towards them and ram them.";



const velociphile_description = "Velociphile (Boss): A rolling ball of mouths and hate. Moves and attacks in straight lines.";


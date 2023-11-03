const enemy_list = [spider_tile, turret_h_tile, turret_d_tile, scythe_tile, knight_tile, 
    spider_web_tile, ram_tile, large_porcuslime_tile, medium_porcuslime_tile, acid_elemental_tile];

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
function spider_web_tile(){
    spawn_timer = 2
    return{
        type: "enemy",
        enemy_type: "spider egg",
        pic: "spider_web.png",
        cycle: 0,
        spawn_timer,
        id: "",
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
        enemy_type: "ram",
        pic: pic_arr[starting_cycle],
        pic_arr,
        cycle: starting_cycle,
        id: "",
        health: 2,
        difficulty: 5,
        behavior: ram_ai,
        description: ram_description
    }
}
function large_porcuslime_tile(){
    return {
        type: "enemy",
        enemy_type: "porcuslime",
        pic: "large_porcuslime.png",
        id: "",
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
        enemy_type: "medium porcuslime",
        pic: pic_arr[ran],
        pic_arr,
        cycle: ran,
        id: "",
        health: 2,
        difficulty: 5,
        behavior: medium_porcuslime_ai,
        description: medium_porcuslime_description
    }
}
function small_h_porcuslime_tile(){
    return {
        type: "enemy",
        enemy_type: "small porcuslime",
        pic: "small_h_porcuslime.png",
        id: "",
        health: 1,
        difficulty: 3,
        behavior: small_h_porcuslime_ai,
        description: small_h_porcuslime_description
    }
}
function small_d_porcuslime_tile(){
    return {
        type: "enemy",
        enemy_type: "small porcuslime",
        pic: "small_d_porcuslime.png",
        id: "",
        health: 1,
        difficulty: 3,
        behavior: small_d_porcuslime_ai,
        description: small_d_porcuslime_description
    }
}
function acid_elemental_tile(){
    return {
        type: "enemy",
        enemy_type: "acid elemental",
        pic: "acid_elemental.png",
        id: "",
        health: 1,
        difficulty: 3,
        behavior: acid_elemental_ai,
        on_death: acid_elemental_death,
        description: acid_elemental_description
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
const acid_elemental_description = "Acid Elemental: Moves towards the player 1 space. Has no normal attack, but will spray acid upon death hurting everything next to it."



const velociphile_description = "Velociphile (Boss): A rolling ball of mouths and hate. Moves and attacks in straight lines.";


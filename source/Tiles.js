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
    var starting_health = 3;
    return {
        type: "player",
        name: "player",
        pic: "helmet.png",
        health: starting_health,
        max_health: starting_health,
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
        health: 3,
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
const spider_web_description = ["Spider Web: Does not move. Spawns a spider every ", " turns."];
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

const boss_death_description = "The exit opens.\nYou feel your wounds begin to heal."
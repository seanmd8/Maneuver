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
const ENEMY_LIST = [spider_tile, turret_h_tile, turret_d_tile, spider_tile, shadow_knight_tile, 
    spider_web_tile, ram_tile, large_porcuslime_tile, medium_porcuslime_tile, acid_bug_tile,
    brightling_tile, corrosive_caterpillar_tile];

// Non-Enemy tiles
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
function lava_pool_tile(){
    return {
        type: "terrain",
        name: "lava pool",
        pic: "lava_pool.png",
        description: lava_pool_description,
        on_enter: hazard
    }
}
function corrosive_slime_tile(){
    return {
        type: "terrain",
        name: "corrosive_slime",
        pic: "corrosive_slime.png",
        health: 1,
        description: corrosive_slime_description,
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
    var health = random_num(2) + 1;
    return {
        type: "terrain",
        name: "damaged wall",
        pic: "damaged_wall.png",
        health,
        on_death: wall_death,
        description: damaged_wall_description

    }
}
function fireball_tile(){
    return {
        type: "enemy",
        name: "fireball",
        pic: "fireball.png",
        direction: [],
        description: fireball_description,
        behavior: fireball_ai,
        on_enter: fireball_on_enter
    }
}

// Normal Enemy Tiles
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
function shadow_knight_tile(){
    return{
        type: "enemy",
        name: "shadow_knight",
        pic: "shadow_knight.png",
        health: 2,
        difficulty: 4,
        behavior: shadow_knight_ai,
        description: shadow_knight_description
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
    var ran = random_num(2);
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
function corrosive_caterpillar_tile(){
    return {
        type: "enemy",
        name: "corrosive caterpillar",
        pic: "corrosive_caterpillar.png",
        health: 1,
        difficulty: 2,
        behavior: corrosive_caterpillar_ai,
        on_death: corrosive_caterpillar_death,
        description: corrosive_caterpillar_description
    }
}

// Boss Tiles
function velociphile_tile(){
    return{
        type: "enemy",
        name: "velociphile",
        pic: "velociphile.png",
        health: 3,
        difficulty: "boss",
        behavior: velociphile_ai,
        on_death: boss_death,
        description: velociphile_description,
        death_message: velociphile_death_message
    }
}
function spider_queen_tile(){
    return{
        type: "enemy",
        name: "spider queen",
        pic: "spider_queen.png",
        health: 3,
        difficulty: "boss",
        behavior: spider_ai,
        on_hit: spider_queen_hit,
        on_death: boss_death,
        description: spider_queen_description,
        death_message: spider_queen_death_message
    }
}
function lich_tile(){
    var spells = [
        [teleport_spell, teleport_spell_description], 
        [summon_spell, summon_spell_description], 
        [earthquake_spell, earthquake_spell_description], 
        [flame_wave_spell, flame_wave_spell_description],
        [confusion_spell, confusion_spell_description],
        [lava_barrier_spell, lava_barrier_description]
    ];
    var summons = [
        scythe_tile,
        shadow_knight_tile,
        ram_tile,
        large_porcuslime_tile
    ];
    var starting_cycle = 1;
    return{
        type: "enemy",
        name: "lich",
        pic: "lich.png",
        health: 3,
        difficulty: "boss",
        behavior: lich_ai,
        cycle: starting_cycle,
        spells,
        summons,
        earthquake_targets: [],
        on_death: boss_death,
        description: lich_description + spells[starting_cycle][1],
        death_message: lich_death_message
    }
}



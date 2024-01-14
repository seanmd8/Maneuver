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

/**
 * @typedef {object} Tile Information about the contents of a single square of a floor of the dungeon.
 * 
 * // Required properties //
 * @property {string} type The type of thing this tile is (player, enemy, exit, etc).
 * @property {string} name More specific than type. Used for mousover text.
 * @property {string} pic The picture of the tile's contents.
 * @property {string} description A description given when the tile is clicked on.
 * 
 * // Misc //
 * @property {number=} health The amount of damage it can take before dying.
 * @property {number=} max_health It can never be healed above this.
 * @property {number=} difficulty Used to determine how many things can be spawned.
 * @property {string=} death_message Displayed on death.
 * 
 * // Functions controlling behavior. //
 * @property {AIFunction=} behavior What it does on it's turn.
 * @property {AIFunction=} on_enter What it does when something tries to move onto it.
 * @property {AIFunction=} on_hit What it does when attacked.
 * @property {AIFunction=} on_death What it does when killed.
 * 
 * // Properties used to determing aesthetics //
 * @property {string[]=} pic_arr Used when the tile sometimes changes images.
 * @property {number=} rotate How much to rotate the image when displaying it. Must be in 90 degree increments.
 * @property {boolean=} flip If the image should be horizontally flipped.
 * 
 * // Properties used by AI functions to determine behavior. //
 * @property {number=} cycle Used when a tile's state must persist between turns.
 * @property {number=} spawn_timer How many turns between spawning things.
 * @property {number=} range How far away can it attack.
 * @property {Point=} direction The relative direction is it moving.
 * @property {number=} spin_direction The direction it is spinning.
 * @property {Spell[]=} spells A array of behavior functions it can call along with their own descriptions and pictures.
 * @property {TileGenerator[]=} summons A array of tiles it can spawn.
 * 
 * // Properties added later //
 * @property {number=} stun When the tile is stunned, it's turn will be skipped.
 * @property {number=} id Given a unique one when added to a EntityList.
 */

/**
 * @callback TileGenerator Function used to create a tile.
 * @returns {Tile}
 */


// This is a array of all the enemies that can be spawned on a normal floor.
const ENEMY_LIST = [spider_tile, turret_h_tile, turret_d_tile, turret_r_tile, shadow_knight_tile, 
    scythe_tile, spider_web_tile, ram_tile, large_porcuslime_tile, medium_porcuslime_tile, 
    acid_bug_tile, brightling_tile, corrosive_caterpillar_tile, noxious_toad_tile, vampire_tile,
    clay_golem_tile, vinesnare_bush_tile, rat_tile];

// Non-Enemy tiles
/** @type {TileGenerator} Empty space.*/
function empty_tile(){
    return {
        type: `empty`,
        name: `empty`,
        pic: `${img_folder.tiles}empty.png`,
        description: empty_description
    }
}
/** @type {TileGenerator} The player must move here to complete the floor.*/
function exit_tile(){
    return {
        type: `exit`,
        name: `exit`,
        pic: `${img_folder.tiles}stairs.png`,
        description: exit_description
    }
}
/** @type {TileGenerator} Must be unlocked to reveal the exit.*/
function lock_tile(){
    return {
        type: `terrain`,
        name: `lock`,
        pic: `${img_folder.tiles}lock.png`,
        description: lock_description
    }
}
/** @type {TileGenerator} The starting player.*/
function player_tile(){
    return {
        type: `player`,
        name: `player`,
        pic: `${img_folder.tiles}helmet.png`,
        description: player_description,
        health: PLAYER_STARTING_HEALTH,
        max_health: PLAYER_STARTING_HEALTH
        
    }
}
/** @type {TileGenerator} A hazardous pool of lava.*/
function lava_pool_tile(){
    return {
        type: `terrain`,
        name: `lava pool`,
        pic: `${img_folder.tiles}lava_pool.png`,
        description: lava_pool_description,
        on_enter: hazard
    }
}
/** @type {TileGenerator} A hazardous pool of slime that can be cleared by attacking.*/
function corrosive_slime_tile(){
    return {
        type: `terrain`,
        name: `corrosive_slime`,
        pic: `${img_folder.tiles}corrosive_slime.png`,
        description: corrosive_slime_description,
        health: 1,
        on_enter: hazard
    }
}
/** @type {TileGenerator} A sturdy wall.*/
function wall_tile(){
    return {
        type: `terrain`,
        name: `wall`,
        pic: `${img_folder.tiles}wall.png`,
        description: wall_description
    }
}
/** @type {TileGenerator} A damaged wall that might spawn something on death.*/
function damaged_wall_tile(){
    var health = random_num(2) + 1;
    return {
        type: `terrain`,
        name: `damaged wall`,
        pic: `${img_folder.tiles}damaged_wall.png`,
        description: damaged_wall_description,
        health,
        on_death: wall_death
    }
}
/** @type {TileGenerator} A fireball that travels in a straight line until it hits something.*/
function fireball_tile(){
    var pic_arr = [`${img_folder.tiles}fireball_n.png`, `${img_folder.tiles}fireball_nw.png`];
    return {
        type: `enemy`,
        name: `fireball`,
        pic: `${img_folder.tiles}fireball.png`,
        description: fireball_description,
        behavior: fireball_ai,
        on_enter: fireball_on_enter,
        pic_arr,
        rotate: 0,
        direction: undefined
    }
}

// Normal Enemy Tiles

/** @type {TileGenerator} */
function spider_tile(){
    return {
        type: `enemy`,
        name: `spider`,
        pic: `${img_folder.tiles}spider.png`,
        description: spider_description,
        health: 1,
        difficulty: 1,
        behavior: spider_ai
    }
}
/** @type {TileGenerator} */
function turret_h_tile(){
    return {
        type: `enemy`,
        name: `turret`,
        pic: `${img_folder.tiles}turret_h.png`,
        description: turret_h_description,
        health: 1,
        difficulty: 2,
        behavior: turret_h_ai,
    }
}
/** @type {TileGenerator} */
function turret_d_tile(){
    return {
        type: `enemy`,
        name: `turret`,
        pic: `${img_folder.tiles}turret_d.png`,
        description: turret_d_description,
        health: 1,
        difficulty: 2,
        behavior: turret_d_ai
    }
}
/** @type {TileGenerator} */
function turret_r_tile(){
    var pic_arr = [`${img_folder.tiles}turret_r_N_S.png`, `${img_folder.tiles}turret_r_NE_SW.png`];
    var starting_cycle = random_num(4);
    var spin_direction = random_sign();
    if(spin_direction > 0){
        var starting_rotation = 90 * Math.floor(starting_cycle / 2);
    }
    else{
        var starting_rotation = 90 * Math.floor(((starting_cycle + 1) % 4) / 2);
    }
    return {
        type: `enemy`,
        name: `rotary turret`,
        pic: pic_arr[starting_cycle % 2],
        description: turret_r_description,
        health: 1,
        difficulty: 2,
        behavior: turret_r_ai,
        pic_arr,
        rotate: starting_rotation,
        flip: (spin_direction === -1),
        cycle: starting_cycle,
        spin_direction
    }
}
/** @type {TileGenerator} */
function scythe_tile(){
    return{
        type: `enemy`,
        name: `scythe`,
        pic: `${img_folder.tiles}scythe.png`,
        description: scythe_description,
        health: 1,
        difficulty: 3,
        behavior: scythe_ai,
        rotate: 90 * random_num(4)
    }
}
/** @type {TileGenerator} */
function shadow_knight_tile(){
    return{
        type: `enemy`,
        name: `shadow knight`,
        pic: `${img_folder.tiles}shadow_knight.png`,
        description: shadow_knight_description,
        health: 2,
        difficulty: 4,
        behavior: shadow_knight_ai,
    }
}
/** @type {TileGenerator} */
function spider_web_tile(){
    var spawn_timer = 2
    return{
        type: `enemy`,
        name: `spider egg`,
        pic: `${img_folder.tiles}spider_web.png`,
        description: `${spider_web_description[0]}${spawn_timer + 1}${spider_web_description[1]}`,
        health: 1,
        difficulty: 4,
        behavior: spider_web_ai,
        cycle: 0,
        spawn_timer
    }
}
/** @type {TileGenerator} */
function ram_tile(){
    var pic_arr = [`${img_folder.tiles}ram.png`, `${img_folder.tiles}ram_charge.png`];
    var starting_cycle = 0;
    return{
        type: `enemy`,
        name: `ram`,
        pic: pic_arr[starting_cycle],
        description: ram_description,
        health: 2,
        difficulty: 5,
        behavior: ram_ai,
        pic_arr,
        cycle: starting_cycle
    }
}
/** @type {TileGenerator} */
function large_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `large porcuslime`,
        pic: `${img_folder.tiles}large_porcuslime.png`,
        description: large_porcuslime_description,
        health: 3,
        difficulty: 8,
        behavior: large_porcuslime_ai,
    }
}
/** @type {TileGenerator} */
function medium_porcuslime_tile(){
    var starting_cycle = random_num(2);
    var pic_arr = [`${img_folder.tiles}medium_h_porcuslime.png`, `${img_folder.tiles}medium_d_porcuslime.png`];
    return {
        type: `enemy`,
        name: `medium porcuslime`,
        pic: pic_arr[starting_cycle],
        description: medium_porcuslime_description,
        health: 2,
        difficulty: 5,
        behavior: medium_porcuslime_ai,
        pic_arr,
        cycle: starting_cycle
    }
}
/** @type {TileGenerator} */
function small_h_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `small porcuslime`,
        pic: `${img_folder.tiles}small_h_porcuslime.png`,
        description: small_h_porcuslime_description,
        health: 1,
        difficulty: 3,
        behavior: porcuslime_horizontal_ai
    }
}
/** @type {TileGenerator} */
function small_d_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `small porcuslime`,
        pic: `${img_folder.tiles}small_d_porcuslime.png`,
        description: small_d_porcuslime_description,
        health: 1,
        difficulty: 3,
        behavior: porcuslime_diagonal_ai,
    }
}
/** @type {TileGenerator} */
function acid_bug_tile(){
    return {
        type: `enemy`,
        name: `acid bug`,
        pic: `${img_folder.tiles}acid_bug.png`,
        description: acid_bug_description,
        health: 1,
        difficulty: 3,
        behavior: acid_bug_ai,
        on_death: acid_bug_death,
    }
}
/** @type {TileGenerator} */
function brightling_tile(){
    var starting_cycle = 0;
    return{
        type: `enemy`,
        name: `brightling`,
        pic: `${img_folder.tiles}brightling.png`,
        description: brightling_description,
        health: 1,
        difficulty: 4,
        behavior: brightling_ai,
        cycle: starting_cycle

    }
}
/** @type {TileGenerator} */
function corrosive_caterpillar_tile(){
    return {
        type: `enemy`,
        name: `corrosive caterpillar`,
        pic: `${img_folder.tiles}corrosive_caterpillar.png`,
        description: corrosive_caterpillar_description,
        health: 1,
        difficulty: 2,
        behavior: corrosive_caterpillar_ai,
        on_death: corrosive_caterpillar_death
    }
}
/** @type {TileGenerator} */
function noxious_toad_tile(){
    var pic_arr = [`${img_folder.tiles}noxious_toad_leaping.png`, `${img_folder.tiles}noxious_toad.png`];
    var starting_cycle = random_num(pic_arr.length);
    return {
        type: `enemy`,
        name: `noxious toad`,
        pic: pic_arr[starting_cycle],
        description: noxious_toad_description, 
        health: 1,
        difficulty: 4,
        behavior: noxious_toad_ai,
        pic_arr,
        cycle: starting_cycle
    }
}
/** @type {TileGenerator} */
function vampire_tile(){
    return {
        type: `enemy`,
        name: `vampire`,
        pic: `${img_folder.tiles}vampire.png`,
        description: vampire_description,
        health: 2,
        max_health: 2,
        difficulty: 5,
        behavior: vampire_ai,
        on_hit: vampire_hit
    }
}
/** @type {TileGenerator} */
function clay_golem_tile(){
    return {
        type: `enemy`,
        name: `clay golem`,
        pic: `${img_folder.tiles}clay_golem.png`,
        description: clay_golem_description,
        health: 3,
        difficulty: 4,
        behavior: clay_golem_ai,
        on_hit: clay_golem_hit,
        cycle: 1
    }
}
/** @type {TileGenerator} */
function vinesnare_bush_tile(){
    var range = 3;
    var pic_arr = [`${img_folder.tiles}vinesnare_bush_lashing.png`, `${img_folder.tiles}vinesnare_bush_rooted.png`];
    var starting_cycle = 1;
    return {
        type: `enemy`,
        name: `vinesnare bush`,
        pic: pic_arr[starting_cycle],
        description: `${vinesnare_bush_description[0]}${range}${vinesnare_bush_description[1]}`,
        health: 1,
        difficulty: 4,
        behavior: vinesnare_bush_ai,
        pic_arr,
        cycle: starting_cycle,
        range
    }
}
/** @type {TileGenerator} */
function rat_tile(){
    return {
        type: `enemy`,
        name: `rat`,
        pic: `${img_folder.tiles}rat.png`,
        description: rat_description,
        health: 1,
        difficulty: 2,
        behavior: rat_ai,
        flip: random_num(2) === 0,
        cycle: 1

    }
}

// Boss Tiles
/** @type {TileGenerator} */
function velociphile_tile(){
    return{
        type: `enemy`,
        name: `velociphile`,
        pic: `${img_folder.tiles}velociphile.png`,
        description: velociphile_description,
        health: 3,
        death_message: velociphile_death_message,
        behavior: velociphile_ai,
        on_death: boss_death
    }
}
/** @type {TileGenerator} */
function spider_queen_tile(){
    return{
        type: `enemy`,
        name: `spider queen`,
        pic: `${img_folder.tiles}spider_queen.png`,
        description: spider_queen_description,
        health: 3,
        death_message: spider_queen_death_message,
        behavior: spider_ai,
        on_hit: spider_queen_hit,
        on_death: boss_death
    }
}
/** @type {TileGenerator} */
function lich_tile(){
    var spells = [
        spell_generator(teleport_spell, teleport_spell_description, `${img_folder.tiles}lich_teleport.png`), 
        spell_generator(summon_spell, summon_spell_description, `${img_folder.tiles}lich_summon.png`), 
        spell_generator(earthquake_spell, earthquake_spell_description, `${img_folder.tiles}lich_earthquake.png`), 
        spell_generator(flame_wave_spell, flame_wave_spell_description, `${img_folder.tiles}lich_flame_wave.png`),
        spell_generator(confusion_spell, confusion_spell_description, `${img_folder.tiles}lich_confusion.png`),
        spell_generator(lava_moat_spell, lava_moat_spell_description, `${img_folder.tiles}lich_lava_moat.png`),
        spell_generator(rest_spell, rest_description, `${img_folder.tiles}lich_rest.png`)
    ];
    var summons = [
        spider_tile,
        scythe_tile,
        shadow_knight_tile,
        ram_tile,
        medium_porcuslime_tile,
        clay_golem_tile,
        rat_tile
    ];
    var starting_cycle = 1;
    return{
        type: `enemy`,
        name: `lich`,
        pic: spells[starting_cycle].pic,
        description: `${lich_description}${spells[starting_cycle].description}`,
        health: 4,
        death_message: lich_death_message,
        behavior: lich_ai,
        on_death: boss_death,
        cycle: starting_cycle,
        spells,
        summons,
    }
}
/**
 * @typedef Spell A set a behavior, description and pic used by the lich.
 * @property {AIFunction} behavior Function performing the spell.
 * @property {string} description A description of what the spell does.
 * @property {string} pic A picture to help telegraph the spell.
 */

/**
 * Function to generate and return a spell with the fields provided as parameters.
 * @param {AIFunction} behavior 
 * @param {string} description 
 * @param {string} pic 
 * @returns {Spell}
 */
function spell_generator(behavior, description, pic){
    return {
        behavior,
        description,
        pic
    }
}



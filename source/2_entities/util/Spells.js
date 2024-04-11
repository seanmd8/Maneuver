// ----------------Spells.js----------------
// File for spell ai functions.

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


/** @type {AIFunction} Spell which teleports the user to a random location.*/
function teleport_spell(self, target, map){
    var space = map.random_empty();
    if(map.move(self.location, space)){
        self.location.x = space.x;
        self.location.y = space.y;
    }
}
/** @type {AIFunction} Spell which summons a random thing from the user's summon array.*/
function summon_spell(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    var tile = self.tile.summons[random_num(self.tile.summons.length)]();
    spawn_nearby(map, tile, self.location);
}
/** @type {AIFunction} Spell which causes an earthquake causing debris to rain from the ceiling.*/
function earthquake_spell(self, target, map){
    var health = self.tile.health;
    if( health === undefined){
        health = 4;
    }
    map.add_event({name: `Earthquake`, behavior: earthquake_event((5 - health) * 5 + random_num(4))});
}
/** @type {AIFunction} Spell which creates a wave of fireballs aimed at the target.*/
function flame_wave_spell(self, target, map){
    var direction = get_empty_nearby(self.location, order_nearby(target.difference), map);
    var spawnpoints = [];
    if(direction === undefined){
        return;
    }
    if(direction.x === 0){
        // Shooting vertically.
        for(var i = 0; i < 3; ++i){
            spawnpoints.push(new Point(i - 1, direction.y));
        }
    }
    else if(direction.y === 0){
        // Shooting horizontally.
        for(var i = 0; i < 3; ++i){
            spawnpoints.push(new Point(direction.x, i - 1));
        }
    }
    else{
        // Shooting diagonally.
        spawnpoints.push(new Point(direction.x, direction.y));
        spawnpoints.push(new Point(direction.x, 0));
        spawnpoints.push(new Point(0, direction.y));
    }
    for(var i = 0; i < spawnpoints.length; ++i){
        var fireball = fireball_tile();
        set_direction(fireball, direction);
        map.add_tile(fireball, self.location.plus(spawnpoints[i]));
    }
}
/** @type {AIFunction} Spell which adds 2 random temporary debuff cards to the player's deck.*/
function confusion_spell(self, target, map){
    for(var i = 0; i < 2; ++i){
        var ran = random_num(CONFUSION_CARDS.length);
        GS.give_temp_card(CONFUSION_CARDS[ran]());
    }
}
/** @type {AIFunction} Spell which creates several lava pools between the user and their target.*/
function lava_moat_spell(self, target, map){
    var health = self.tile.health;
    if( health === undefined){
        health = 4;
    }
    var nearby = order_nearby(target.difference);
    for(var i = 0; i < health && count_nearby(self.location, map) < 6; ++i){
        var tile = lava_pool_tile();
        spawn_nearby(map, tile, self.location, nearby);
    }
}
/** @type {AIFunction} Spell which does nothing.*/
function rest_spell(self, target, map){}

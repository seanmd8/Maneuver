// ----------------AIUtil.js----------------
// File for AI utility functions functions and jsdoc typedefs used by ai functions.

/**
 * @typedef {object} AISelfParam Information passed into an ai function about the entity calling it.
 * @property {Tile} tile The tile of the entity.
 * @property {Point} location The location of the tile on the grid.
 */

/**
 * @typedef {object} AITargetParam Information passed into an ai function about the entity it is targeting.
 * @property {Tile} tile The tile it is targeting.
 * @property {Point} difference The location of the tile it is targeting relative to the entity.
 */

/**
 * @callback AIFunction
 * @param {AISelfParam} self The entity performing this behavior.
 * @param {AITargetParam} target The entity being targeted.
 * @param {GameMap} map The gamemap where stuff should happen.
 */

/** @type {AIFunction} Function used when something moves onto this to harm that thing.*/
function hazard(self, target, map){
    // General on_enter function to retaliate if something tries to move onto it.
    map.attack(self.location.plus(target.difference));
}
/** @type {AIFunction}  AI used by entities that decay over time or when moved onto.*/
function decay_ai(self, target, map){
    map.attack(self.location);
    throw new Error(`skip animation delay`);
}
/** @type {AIFunction} Attempts to move 1 space closer to the user until it succesfully moves or it dies.*/
function move_closer_ai(self, target, map){
    var directions = order_nearby(target.difference);
    for(var i = 0; i < directions.length && (self.tile.health === undefined || self.tile.health > 0); ++i){
        if(map.move(self.location, self.location.plus(directions[i]))){
            self.location.plus_equals(directions[i]);
            return;
        }
    }
}
/** @type {AIFunction} AI used when a entity should move and attack in a direction (the target's difference field).*/
function move_attack_ai(self, target, map){
    if(target.difference.within_radius(0)){
        throw new Error(`entity targeting itself`)
    }
    if(map.move(self.location, self.location.plus(target.difference))){
        self.location.plus_equals(target.difference);
    }
    map.attack(self.location.plus(target.difference));
}
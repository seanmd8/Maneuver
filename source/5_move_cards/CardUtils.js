// ----------------CardUtils.js----------------
// File containing utility functions used by cards.

// Cards that can be given on level up.
const CARD_CHOICES = [
    short_charge, jump, straight_charge, side_charge, step_left, 
    step_right, trample, horsemanship, lunge_left, lunge_right, 
    sprint, trident, whack_horizontal, spin_attack, butterfly, 
    retreat, force, side_attack, clear_behind, clear_in_front, 
    jab, overcome, hit_and_run, push_back, fork,
    explosion, breakthrough, flanking_diagonal, flanking_sideways, flanking_straight,
    pike, combat_diagonal, combat_horizontal, breakthrough_side, whack_diagonal,
    thwack, overcome_sideways, y_leap, diamond_slice, spearhead,
    alt_diagonal_left, alt_diagonal_right, alt_horizontal, alt_vertical, jab_diagonal,
    diamond_attack, slice_twice, reckless_horizontal, reckless_diagonal, advance,
    bounding_retreat, leap_left, leap_right, short_charge_diagonal, side_sprint,
    slash_step_forwards, slash_step_left, slash_step_right, slip_through_ne, slip_through_nw
];

const RARE_CARD_CHOICES = [
    teleport, sidestep_w, sidestep_e, sidestep_n, sidestep_s, 
    sidestep_nw, sidestep_ne, sidestep_se, sidestep_sw, punch_orthogonal, 
    punch_diagonal, reckless_attack_left, reckless_attack_right, reckless_sprint, reckless_teleport
]

// Cards that can be given as a debuff.
const CONFUSION_CARDS = [
    stumble_n, stumble_e, stumble_s, stumble_w, stumble_nw, 
    stumble_ne, stumble_se, stumble_sw, freeze_up, lash_out,
    lightheaded
]


/**
 * @typedef {object} PlayerCommand A object used to give a command for a single action the player should do.
 * @property {string} type What type of action it is (move, attack, etc.).
 * @property {Point} change The location the action should be performed at relative to the current one.
 */

/**
 * @callback PlayerCommandGenerator Creates a PlayerCommand Object.
 * @param {number} x The relative x location
 * @param {number} y The relative y location
 * @returns {PlayerCommand} The resulting command.
 */

/** @type {PlayerCommandGenerator} Function to create a move command.*/
function pmove(x, y){
    return {
        type: `move`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to create a attack command.*/
function pattack(x, y){
    return {
        type: `attack`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to create a teleport command.*/
function pteleport(x, y){
    return {
        type: `teleport`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to declare the previous commands as instant.*/
function pinstant(x, y){
    return {
        type: `instant`,
        change: new Point(x, y) // In this case, this point does nothing.
    }
}
/** @type {PlayerCommandGenerator} Function to stun any enemies at the given location.*/
function pstun(x, y){
    return {
        type: `stun`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to move in a direction until you hit something.*/
function pmove_until(x, y){
    return {
        type: `move_until`,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to heal the thing at the specified spot by 1.*/
function pheal(x, y){
    return {
        type: `heal`,
        change: new Point(x, y)
    }
}

// Cards
/**
 * @typedef {Object} Card A card used by the player to perform actions on their turn.
 * @property {string} name The name of the card which will be displayed as mouseover text.
 * @property {string} pic The card's image.
 * @property {ButtonGrid} options A button grid object which determines what actions the player can use the card to perform.
 * 
 * @property {number=} id A unique id that will be added to the card when it is added to the deck.
 * @property {boolean=} temp Given true when the card is temporary and will be removed on use or on end of floor.
 * @property {CardGenerator=} per_floor Provided to make temporary copies of a card if it can only be used once per floor.
 */
/**
 * @callback CardGenerator A function that creates a card.
 * @returns {Card} The resulting card.
 */
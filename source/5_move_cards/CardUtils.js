// ----------------CardUtils.js----------------
// File containing utility functions used by cards.

const BASIC_CARDS = [
    basic_horizontal, basic_diagonal, basic_slice
]

// Cards that can be given on level up.
const COMMON_CARDS = [
    short_charge, jump, straight_charge, side_charge, step_left, 
    step_right, trample, horsemanship, lunge_left, lunge_right, 
    sprint, trident, spin_attack, butterfly, fork,
    retreat, force, side_attack, clear_behind, clear_in_front, 
    jab, overcome, hit_and_run, push_back, breakthrough_side,
    explosion, breakthrough, flanking_diagonal, flanking_sideways, flanking_straight,
    pike, combat_diagonal, combat_horizontal, stunning_punch_orthogonal, stunning_punch_diagonal,
    thwack, overcome_sideways, y_leap, diamond_slice, spearhead,
    alt_diagonal_left, alt_diagonal_right, alt_horizontal, alt_vertical, jab_diagonal,
    diamond_attack, slice_twice, advance, dash_ne, dash_nw,
    bounding_retreat, leap_left, leap_right, short_charge_diagonal, side_sprint,
    slash_step_forwards, slash_step_left, slash_step_right, slip_through_ne, slip_through_nw,
    stunning_leap, stunning_side_leap, stunning_slice,
];

const RARE_CARDS = [
    teleport, sidestep_w, sidestep_e, sidestep_n, sidestep_s, 
    sidestep_nw, sidestep_ne, sidestep_se, sidestep_sw, punch_orthogonal, 
    punch_diagonal, reckless_attack_left, reckless_attack_right, reckless_sprint, reckless_teleport,
    reckless_horizontal, reckless_diagonal, 
]

// Cards that can be given as a debuff.
const CONFUSION_CARDS = [
    stumble_n, stumble_e, stumble_s, stumble_w, stumble_nw, 
    stumble_ne, stumble_se, stumble_sw, freeze_up, lash_out,
    lightheaded
]


/**
 * @typedef {Object} PlayerCommand A object used to give a command for a single action the player should do.
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
/** @type {PlayerCommandGenerator} Function to attack in a direction until you hit the edge of the board.*/
function pattack_until(x, y){
    return {
        type: `attack_until`,
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
 * @property {CardGenerator[]=} evolutions A list of cards to be added once this is removed.
 * 
 * @property {number=} id A unique id that will be added to the card when it is added to the deck.
 * @property {boolean=} temp Given true when the card is temporary and will be removed on use or on end of floor.
 * @property {CardGenerator=} per_floor Provided to make temporary copies of a card if it can only be used once per floor.
 */
/**
 * @callback CardGenerator A function that creates a card.
 * @returns {Card} The resulting card.
 */



/**
 * Function to explain an individual player action.
 * @param {PlayerCommand} action The command to explain.
 * @returns {String} An explanation for the player of what the action does.
 */
function explain_action(action){
    var target = explain_point(action.change);
    switch(action.type){
        case `attack`:
            return `${move_types.attack}: ${target}`;
        case `move`:
            return `${move_types.move}: ${target}`;
        case `teleport`:
            return move_types.teleport;
        case `stun`:
            if(point_equals(action.change, new Point(0, 0))){
                return move_types.confuse;
            }
            return `${move_types.stun}: ${target}`;
        case `move_until`:
            return `${move_types.move_until}: ${target}`;
        case `attack_until`:
            return `${move_types.attack_until}: ${target}`;
        case `heal`:
            return `${move_types.heal}: ${target}`;
        default:
            throw new Error(ERRORS.invalid_value);
    }
}

/**
 * Converts a point to an explanation of where it is relative to the player.
 * @param {Point} p The point to explain.
 * @returns {String} The location of the point explained in relation to the player.
 */
function explain_point(p){
    var direction = sign(p);
    var vertical = [four_directions.up, undefined, four_directions.down][direction.y + 1];
    var horizontal = [four_directions.left, undefined, four_directions.right][direction.x + 1];
    if(vertical === undefined && horizontal === undefined){
        return move_types.you;
    }
    else if(vertical === undefined){
        return `${horizontal} ${Math.abs(p.x)}`;
    }
    else if(horizontal === undefined){
        return `${vertical} ${Math.abs(p.y)}`;
    }
    else{
        return `${horizontal} ${Math.abs(p.x)}, ${vertical} ${Math.abs(p.y)}`;
    }
}

/**
 * 
 */
function telegraph_card(behavior, map, start_position){
    var telegraphs = {
        moves: [],
        attacks: [],
        stun: [],
        healing: [],
        teleport: []
    }
    if(behavior === undefined){
        return telegraphs;
    }
    for(var action of behavior){
        var next_position = start_position.plus(action.change);
        switch(action.type){
            case `attack`:
                telegraphs.attacks.push(next_position);
                break;
            case `move`:
                if(map.looks_movable(next_position)){
                    telegraphs.moves.push(next_position);
                }
                if(map.looks_empty(next_position)){
                    start_position = next_position;
                }
                break;
            case `teleport`:
                for(var p of get_all_points()){
                    if(map.looks_empty(p)){
                        telegraphs.teleport.push(p);
                    }
                }
                break;
            case `stun`:
                telegraphs.stun.push(next_position);
                break;
            case `move_until`:
                while(map.looks_empty(next_position)){
                    telegraphs.moves.push(next_position);
                    start_position = next_position;
                    next_position = start_position.plus(action.change);
                }
                if(map.looks_movable(next_position)){
                    telegraphs.moves.push(next_position);
                }
                break;
            case `attack_until`:
                while(map.is_in_bounds(next_position)){
                    telegraphs.attacks.push(next_position);
                    start_position = next_position;
                    next_position = start_position.plus(action.change);
                }
                break;
            case `heal`:
                telegraphs.healing.push(next_position);
                break;
            default:
                throw new Error(ERRORS.invalid_value);
        }
    }
    if([ 
        ...telegraphs.moves, 
        ...telegraphs.attacks, 
        ...telegraphs.stun, 
        ...telegraphs.healing, 
        ...telegraphs.teleport
    ].length === 0){
        // If they aren't doing anything, show that.
        telegraphs.moves.push(start_position);
    }
    return telegraphs;
}
function get_all_points(){
    var points = [];
    for(var x = 0; x < FLOOR_WIDTH; ++x){
        for(var y = 0; y < FLOOR_HEIGHT; ++y){
            points.push(new Point(x, y));
        }
    }
    return points;
}

function get_boss_cards(){
    var boss_cards = [];
    for(var boss of BOSS_LIST){
        boss_cards = [...boss_cards, ...boss().card_drops];
    }
    return boss_cards;
}
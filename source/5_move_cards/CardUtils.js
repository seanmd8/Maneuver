// ----------------CardUtils.js----------------
// File containing utility functions used by cards.

const BASIC_CARDS = [
    basic_orthogonal, basic_diagonal, basic_slice
];

const BOON_CARDS = [
    lost_technique, lost_maneuver,
    execution_1, execution_2, execution_3,
    maneuver_1, maneuver_2, maneuver_3,
    split_second_1, split_second_2,
    superweapon_1, superweapon_2
];

const BOSS_CARDS = {
    arcane_sentry: [beam_ne, beam_se, beam_sw, beam_nw, saw_strike],
    forest_heart: [snack, branch_strike, vine_snare],
    lich: [instant_teleport, debilitating_confusion, beam_orthogonal, beam_diagonal],
    spider_queen: [skitter, bite, chomp],
    two_headed_serpent: [regenerate, fangs, slither],
    velociphile: [roll_ne, roll_nw, roll_horizontal],
    young_dragon: [firebreathing_horizontal, firebreathing_vertical, firebreathing_ne, 
        firebreathing_nw, glide, soar],
}

const COMMON_CARDS = [
    advance, bounding_retreat, breakthrough_horizontal, breakthrough_vertical, butterfly, 
    charge_horizontal, charge_vertical, clear_behind, clear_in_front, combat_diagonal, 
    combat_orthogonal, dash_ne, dash_nw, diamond_attack, diamond_slice, 
    explosion, force, fork, flanking_diagonal, flanking_horizontal, 
    flanking_vertical, hit_and_run, horsemanship, jab_diagonal, jab_orthogonal, 
    jump, leap_left, leap_right, lunge_left, lunge_right, 
    overcome_horizontal, overcome_vertical, pike, push_back, short_charge_orthogonal, 
    short_charge_diagonal, slash_step_forwards, slash_step_left, slash_step_right, slice_twice, 
    slip_through_ne, slip_through_nw, spearhead, spin_attack, sprint_horizontal, 
    sprint_vertical, step_left, step_right, t_strike_horizontal, t_strike_vertical, 
    thwack, trample, trident, y_leap, y_strike_ne, y_strike_nw,
];

const CONFUSION_CARDS = [
    stumble_n, stumble_e, stumble_s, stumble_w, stumble_nw, 
    stumble_ne, stumble_se, stumble_sw, freeze_up, lash_out,
    lightheaded
]


function get_achievement_cards(){
    var list = [];
    GS.data.achievements.completed().map((a) => {
        if(a.cards !== undefined){
            list.push(...a.cards);
        }
    });
    return list;
}
function get_all_achievement_cards(){
    var list = [];
    get_achievements().map((a) => {
        if(a.cards !== undefined){
            list.push(...a.cards);
        }
    });
    return list;
}

function get_boss_cards(){
    var all = [];
    for (var field in BOSS_CARDS) {
        if (Object.hasOwn(BOSS_CARDS, field)) {
            all = [...all, ...BOSS_CARDS[field]];
        }
    }
    return all;
}

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
        type: action_types.move,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to create a attack command.*/
function pattack(x, y){
    return {
        type: action_types.attack,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to create a teleport command.*/
function pteleport(x, y){
    return {
        type: action_types.teleport,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to stun any enemies at the given location.*/
function pstun(x, y){
    return {
        type: action_types.stun,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to move in a direction until you hit something.*/
function pmove_until(x, y){
    return {
        type: action_types.move_until,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to attack in a direction until you hit the edge of the board.*/
function pattack_until(x, y){
    return {
        type: action_types.attack_until,
        change: new Point(x, y)
    }
}
/** @type {PlayerCommandGenerator} Function to heal the thing at the specified spot by 1.*/
function pheal(x, y){
    return {
        type: action_types.heal,
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
        case action_types.attack:
            return `${move_types.attack}: ${target}`;
        case action_types.move:
            return `${move_types.move}: ${target}`;
        case action_types.teleport:
            return move_types.teleport;
        case action_types.stun:
            if(action.change.is_origin()){
                return move_types.confuse;
            }
            return `${move_types.stun}: ${target}`;
        case action_types.move_until:
            return `${move_types.move_until}: ${target}`;
        case action_types.attack_until:
            return `${move_types.attack_until}: ${target}`;
        case action_types.heal:
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
        return `${horizontal}${Math.abs(p.x)}`;
    }
    else if(horizontal === undefined){
        return `${vertical}${Math.abs(p.y)}`;
    }
    else{
        return `${horizontal}${Math.abs(p.x)}, ${vertical}${Math.abs(p.y)}`;
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
            case action_types.attack:
                telegraphs.attacks.push(next_position);
                break;
            case action_types.move:
                if(map.looks_movable(next_position)){
                    telegraphs.moves.push(next_position);
                }
                if(map.looks_empty(next_position)){
                    start_position = next_position;
                }
                break;
            case action_types.teleport:
                for(var p of get_all_points()){
                    if(map.looks_empty(p)){
                        telegraphs.teleport.push(p);
                    }
                }
                break;
            case action_types.stun:
                telegraphs.stun.push(next_position);
                break;
            case action_types.move_until:
                while(map.looks_empty(next_position)){
                    telegraphs.moves.push(next_position);
                    start_position = next_position;
                    next_position = start_position.plus(action.change);
                }
                if(map.looks_movable(next_position)){
                    telegraphs.moves.push(next_position);
                }
                break;
            case action_types.attack_until:
                var temp_next = next_position;
                var temp_start = start_position;
                while(map.is_in_bounds(temp_next)){
                    telegraphs.attacks.push(temp_next);
                    temp_start = temp_next;
                    temp_next = temp_start.plus(action.change);
                }
                break;
            case action_types.heal:
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

function copy_card(source){
    return {
        name: source.name,
        pic: source.pic,
        options: source.options,
        evolutions: source.evolutions !== undefined ? [...source.evolutions] : undefined,
        per_floor: source.per_floor,
    }
}
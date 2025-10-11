// @ts-check
// ----------------GeneralUtil.js----------------
// File for utility functions not connected to any specific project.

/**
 * Function to wait a set amount of time before continuing.
 * @param {number} milliseconds How long to wait in milliseconds.
 * @returns {Promise<*>} Resolves when the time is up.
 */
function delay(milliseconds){
    // Function to wait the given number of milliseconds.
    return new Promise(resolve =>{
        setTimeout(resolve, milliseconds);
    });
}
/**
 * Creates an array by drawing random elements from another with no repeats.
 * @template T
 * @param {T[]} source Array to draw from.
 * @param {number} draws Number of draws. If it is larger than source.length, then source.length will be used instead.
 * @returns {T[]} Array of random draws.
 */
function rand_no_repeats(source, draws){
    var index_arr = [];
    var result = [];
    draws = Math.min(draws, source.length);
    for(var i = 0; i < source.length; ++i){
        index_arr.push(i);
    }
    for(var i = 0; i < draws; ++i){
        var rand = random_num(index_arr.length);
        result.push(source[index_arr[rand]]);
        index_arr[rand] = index_arr[index_arr.length - 1];
        index_arr.pop();
    }
    return result;
}
/**
 * Gets a random element from an array
 * @template T
 * @param {T[]} source Array to draw from.
 * @returns {T} Random element.
 */
function random_from(source){
    if(source.length === 0){
        throw new Error(ERRORS.array_size);
    }
    return rand_no_repeats(source, 1)[0];
}
/**
 * Wraps a string so each line has a maximum number of characters before automatically inserting a newline character.
 * @param {string} message The string to be wrapped.
 * @param {number} wrap_length How many characters maximum.
 * @param {string} [delimiter = undefined] Optional parameter for the delimiter.
 *                                      If provided, then blocks of text in between delimiters will not be broken up.
 * @returns {string} The wrapped string.
 */
function wrap_str(message, wrap_length, delimiter = undefined){
    var new_message = ``;
    var str_arr = [];
    if(message.indexOf(`\n`) > -1){ // If it already has new line characters
        str_arr = message.split(`\n`);
        for(var i = 0; i < str_arr.length; ++i){
            new_message += `${wrap_str(str_arr[i], wrap_length, delimiter)}\n`
        }
    }
    else if(delimiter === undefined){ // if there is no delimiter
        var start = 0;
        while(start < message.length){
            var end = Math.min(message.length, start + wrap_length);
            str_arr.push(message.slice(start, end));
            start = end;
        }
        for(var i = 0; i < str_arr.length; ++i){
            new_message += `${str_arr[i]}\n`
        }
    }
    else{ // if there is a delimiter
        str_arr = message.split(delimiter);
        var line = ``
        for(var i = 0; i < str_arr.length; ++i){
            line += `${str_arr[i]}${delimiter}`;
            if(line.length > wrap_length){
                new_message += `${line.slice(0, -1 * delimiter.length)}\n`
                line = ``;
            }
        }
        if(line.length > 0){
            new_message += `${line.slice(0, -1 * delimiter.length)}\n`
        }
    }
    return new_message.slice(0, -1);
}
/**
 * @overload Returns 1 if num is positive, -1 if it is negative, 0 if it is 0.
 * @param {number} num
 * @return {number}
 * 
 * @overload Returns a new point with it's x and y the sign of the one passed in.
 * @param {Point} num
 * @return {Point}
 * 
 * @param {*} num
 * @returns {*}
 */
function sign(num){
    // Returns whether num is positive, negative, or 0
    if(typeof num === `number`){
        if(num > 0){
            return 1;
        }
        if(num < 0){
            return -1;
        }
        return 0;
    }
    else{
        return new Point(sign(num.x), sign(num.y));
    }
}
/**
 * @returns {number} randomly returns 1 or -1.
 */
function random_sign(){
    return 2 * random_num(2) - 1;
}
/**
 * Function to return a copy of a array with it's order randomized.
 * @template T
 * @param {T[]} arr Array to randomize.
 * @returns {T[]} Randomized copy.
 */
function randomize_arr(arr){
    // Returns a copy of the given array with it's order randomized.
    arr = [...arr];
    var random_arr = [];
    while(arr.length > 0){
        var index = random_num(arr.length);
        random_arr.push(arr[index]);
        arr[index] = arr[arr.length - 1];
        arr.pop();
    }
    return random_arr;
}
/**
 * Function to return a copy of an array with it's order reversed.
 * @template T
 * @param {T[]} arr Array to be reversed.
 * @returns {T[]} Reversed array.
 */
function reverse_arr(arr){
    var new_arr = [];
    for(var i = arr.length - 1; i >= 0; --i){
        new_arr.push(arr[i]);
    }
    return new_arr;
}
/**
 * Function to return a random integer 0 <= r < x
 * @param {number} x The return should be less than this.
 * @returns {number} The random number.
 */
function random_num(x){
    return Math.floor(Math.random() * x);
}
/**
 * Function to return true n/d of the time.
 * @param {number} numerator
 * @param {number} denominator
 * @returns {boolean} If the chance succeeded.
 */
function chance(numerator, denominator){
    return random_num(denominator) < numerator;
}
/**
 * Function to check if the contents of two arrays are ===.
 * @param {[]} a1 The first array to be compared.
 * @param {[]} a2 the second array to be compared.
 * @returns {boolean} Returns true if the elements at each index in both arrays === the element at the same index of the other.
 */
function array_equals(a1, a2){
    if(!(a1.length === a2.length)){
        return false;
    }
    for(var i = 0; i < a1.length; ++i){
        if(!(a1[i] === a2[i])){
            return false;
        }
    }
    return true;
}
/**
 * Function to make sure a value is not undefined.
 * @template A
 * @param {A | undefined} exists
 * @returns {A}
 */
function ifexists(exists){
    if(exists === undefined){
        throw new Error(`value is undefined.`);
    }
    return exists;
}

function range(start = 0, stop, step = 1){
    if(stop === undefined){
        stop = start;
        start = 0;
    }
    var nums = [];
    for(var i = start; i < stop; i += step){
        nums.push(i);
    }
    return nums;
}

function cross(arr1, arr2, f){
    for(var e1 of arr1){
        for(var e2 of arr2){
            f(e1, e2);
        }
    }
}

function same_structure(obj1, obj2){
    if(typeof obj1 !== typeof obj2){
        return false;
    }
    if(typeof obj1 === `object`){
        for(var property in obj1){
            if(!same_structure(obj1[property], obj2[property])){
                return false;
            }
        }
    }
    return true;
}
// ----------------Point.js----------------
// File contains Point class and associated functions.

/**
 * @callback PointOp Function that simulates a binary operation between this point a point or number passed in.
 * @param {Point | number} p2 The other operand.
 *                      If p2 is a Point, the operation will be performed by matching their respective x and y values,
 *                      If p2 is a number, it will be used wherever either p2.x or p2.y would be used.
 * @returns {Point} Returns the resulting point.
 */

class Point{
    /** @type {number} The x value of the point. */
    x;
    /** @type {number} The y value of the point. */
    y;
    /**
     * @param {number} x The x value of the new point.
     * @param {number} y The y value of the new point.
     */
    constructor(x, y){
        if(x === undefined || y === undefined){
            throw new Error(ERRORS.invalid_value);
        }
        this.x = x;
        this.y = y;
    }
    /** @type {PointOp} Returns this + p2, which is a new point*/
    plus(p2){
        return this.copy().plus_equals(p2);
    }
    /** @type {PointOp} Does this = this + p2, then returns this.*/
    plus_equals(p2){
        if(typeof p2 === `number`){
            this.x += p2;
            this.y += p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            this.x += p2.x;
            this.y += p2.y;
            return this
        }
        else{
            throw Error(ERRORS.invalid_type);
        }
    }
    /** @type {PointOp} Returns this - p2, which is a new point*/
    minus(p2){
        return this.copy().minus_equals(p2);
    }
    /** @type {PointOp} Does this = this - p2, then returns this.*/
    minus_equals(p2){
        if(typeof p2 === `number`){
            this.x -= p2;
            this.y -= p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            this.x -= p2.x;
            this.y -= p2.y;
            return this
        }
        else{
            throw Error(ERRORS.invalid_type);
        }
    }
    /** @type {PointOp} Returns this * p2, which is a new point*/
    times(p2){
        return this.copy().times_equals(p2);
    }
    /** @type {PointOp} Does this = this * p2, then returns this.*/
    times_equals(p2){
        if(typeof p2 === `number`){
            this.x *= p2;
            this.y *= p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            this.x *= p2.x;
            this.y *= p2.y;
            return this
        }
        else{
            throw Error(ERRORS.invalid_type);
        }
    }
    /** @type {PointOp} Returns this * p2, which is a new point*/
    divide(p2){
        return this.copy().divide_equals(p2);
    }
    /** @type {PointOp} Does this = this * p2, then returns this.*/
    divide_equals(p2){
        if(typeof p2 === `number`){
            if(p2 === 0){
                throw new Error(ERRORS.divide_by_0);
            }
            this.x /= p2;
            this.y /= p2;
            return this
        }
        else if(p2.x !== undefined && p2.y !== undefined){
            if(p2.x === 0 || p2.y === 0){
                throw new Error(ERRORS.divide_by_0);
            }
            this.x /= p2.x;
            this.y /= p2.y;
            return this
        }
        else{
            throw Error(ERRORS.invalid_type);
        }
    }
    /**
     * Function to check if a point's x and y values both have an absolute value <= radius.
     * @param {number} radius How far away from 0 x and y can be.
     * @returns {boolean} If the point is <= radius far from (0, 0).
     */
    within_radius(radius){
        return Math.abs(this.x) <= radius && Math.abs(this.y) <= radius;
    }
    /** @returns {Point} Returns a copy of this point.*/
    copy(){
        return new Point(this.x, this.y);
    }
    /**
     * @returns {number} The taxicab distance away from the origin.
     */
    taxicab_distance(){
        return Math.abs(this.x) + Math.abs(this.y);
    }
    /**
     * Rotates a point by a multiple of 90 degrees around the origin.
     * @param {number} degrees How many degrees it should be rotated by. Must be a multiple of 90.
     * @returns {Point} A rotated copy of the point.
     */
    rotate(degrees){
        if(degrees % 90 !== 0){
            throw new Error(ERRORS.invalid_value);
        }
        degrees = degrees % 360;
        if(degrees === 0){
            return this.copy();
        }
        return new Point(this.y * -1, this.x).rotate(degrees - 90);
    }
    /**
     * @returns true if the point is on the x or y axis, false otherwise.
     * (0, 0) returns false.
     */
    on_axis(){
        return (this.x === 0 || this.y === 0) && !this.is_origin();
    }
    /**
     * @returns true if the point is on the lines y = x or y = -x, false otherwise.
     * (0, 0) returns false.
     */
    on_diagonal(){
        return Math.abs(this.x) === Math.abs(this.y) && !this.is_origin();
    }
    /**
     * @returns true if the point is the origin (0, 0).
     */
    is_origin(){
        return point_equals(this, new Point(0, 0));
    }
    /**
     * Function to set this equal to another point.
     * @param {Point} p the point it will be set equal to.
     */
    set(p){
        if(p.x === undefined || p.y === undefined){
            throw new Error(ERRORS.invalid_type);
        }
        this.x = p.x;
        this.y = p.y;
    }
}

/**
 * Checks to see if 2 points are equal.
 * @param {Point} p1 The first point to compare.
 * @param {Point} p2 The second point to compare.
 * @returns  {boolean} If the points are equal.
 */
function point_equals(p1, p2){
    if(p1.x !== undefined && p1.y !== undefined && p2.x !== undefined && p2.y !== undefined){
        return p1.x === p2.x && p1.y === p2.y;
    }
    else{
        throw Error(ERRORS.invalid_type);
    }
}
// Initialization settings used for testing.
function init_settings(){
    const init = {
        enemies: undefined,
        spawnpoints: undefined,
        chests: undefined,
        cards: undefined,
        area: undefined,
        area_size: undefined,
        achievements: undefined,
        identify_boons: undefined,
        save: undefined,
        load: undefined,
    }
    // Determines the starting enemies on the first floor.
    init.enemies = init.enemies ? init.enemies : [spider_tile];
    // Determines the boons found in chests on the first floor.
    init.chests = init.chests ? init.chests : [];
    // Determines the cards in the starting deck.
    init.make_deck = init.cards ? () => {return make_test_deck(init.cards)} : () => {return make_starting_deck()};
    // Determines the area to start in.
    init.area = init.area? [init.area] : area1;
    // Determines the size of each area.
    // Set to a minimum of 2 since bosses cannot generate on the first floor.
    init.area_size = init.area_size ? init.area_size : AREA_SIZE;
    // Determines achievements that should be automatically gained upon starting the game.
    init.achievements = init.achievements ? init.achievements : [];
    // Determined boons that should be added to the journal unpon starting the game.
    init.identify_boons = init.identify_boons ? init.identify_boons : [];
    // Determines the way of saving and loading the game.
    init.save = init.save ? init.save : SaveData.save_local_function(`player1`);
    init.load = init.load ? init.load: SaveData.load_local_function(`player1`);
    return init;
}
// Default keyboard controls
const DEFAULT_CONTROLS = {
    stage: {
        direction: [`q`, `w`, `e`, `a`, `s`, `d`, `z`, `x`, `c`],
        card: [`h`, `j`, `k`, `l`],
        info: [`i`],
        retry: [`r`],
    },
    shop: {
        add: [`q`, `w`, `e`, `r`, `t`, `y`],
        remove: [`a`, `s`, `d`, `f`, `g`, `h`],
        confirm: [` `],
    },
    chest: {
        choose: [`h`, `j`, `k`, `l`, `;`],
        confirm: [` `],
        reject: [`escape`],
    },
    toggle: {
        alt: [`shift`],
    }
}
Object.freeze(DEFAULT_CONTROLS);

// GameState global.
var GS;

// Starting player stats.
const PLAYER_STARTING_HEALTH = 3;
const HAND_SIZE = 3;
const ADD_CHOICE_COUNT = 3;
const REMOVE_CHOICE_COUNT = 3;
const MIN_DECK_SIZE = 5;

// Dungeon generation settings.
const FLOOR_WIDTH = 8;
const FLOOR_HEIGHT = 8;
const AREA_SIZE = 5;
const CHEST_LOCATION = 3;
const SECOND_CHEST_LOCATION = 2;
const BOON_CHOICES = 3;
const SAFE_SPAWN_ATTEMPTS = 5;

// Visual and animation settings.
const CARD_SCALE = 90;
const SMALL_CARD_SCALE = 75;
const CHEST_CONTENTS_SIZE = 120;
const TILE_SCALE = 40;
const JOURNAL_BOSS_SCALE = 120;
const JOURNAL_TILE_SCALE = 60;
const JOURNAL_AREA_WIDTH = 6;
const VICTORY_IMG_SCALE = TILE_SCALE * FLOOR_HEIGHT + 12;
const INITIATIVE_SCALE = 50;
const CARD_SYMBOL_SCALE = 20;
const ANIMATION_DELAY = 200;
const DECK_DISPLAY_WIDTH = 5;
const JOURNAL_DISPLAY_WIDTH = 10;
const TEXT_WRAP_WIDTH = 90;
const MARKUP_LANGUAGE = `html`;

// Image folder file structure.
const IMG_FOLDER = {
    src: `images/`,
    achievements: `achievements/`,
    actions: `actions/`,
    backgrounds: `backgrounds/`,
    cards: `cards/`,
    other: `other/`,
    symbols: `symbols/`,
    tiles: `tiles/`,
    boons: `boons/`,
    stats: `stats/`,
}
Object.freeze(IMG_FOLDER);
// Tags that entities can have.
const TAGS = {
    altar: `Altar`,
    boss: `Boss`,
    unmovable: `Unmovable`,
    unstunnable: `Unstunnable`,
    hidden: `Hidden`,
    invulnerable: `Invulnerable`,
    controlled: `Controlled`,
    thorn_bush_roots: `Thorn Bush Roots`,
    nettle_immune: `Nettle Immune`,
    arcane_sentry: `Arcane Sentry`,
    fireball: `Fireball`,
    obstruction: `Obstruction`,
}
Object.freeze(TAGS);
/** @returns {MoveDeck} Returns a normal starting deck.*/
function make_starting_deck(){
    var cards = [
        basic_orthogonal,
        basic_orthogonal,
        basic_diagonal,
        basic_diagonal,
        basic_slice,
        basic_slice,
        short_charge_orthogonal,
        jump,
    ];
    var deck = new MoveDeck(HAND_SIZE, MIN_DECK_SIZE, cards);

    deck.deal();
    return deck;
}
/** @returns {MoveDeck} Returns a custom deck for testing.*/
function make_test_deck(test_cards){
    var size = test_cards.length;
    for(var i = 0; i < Math.max(4 - size, 1); ++i){
        test_cards.push(basic_orthogonal);
    }
    test_cards.push(basic_slice);
    var deck = new MoveDeck(HAND_SIZE, MIN_DECK_SIZE, test_cards);
    deck.deal();
    return deck;
}
// Library for the various kinds of errors that the game could throw
const ERRORS = {
    invalid_type: `invalid type`,
    missing_property: `missing property`,
    pass_turn: `pass turn to player`,
    skip_animation: `skip animation delay`,
    game_over: `game over`,
    floor_complete: `floor complete`,
    array_size: `array size mismatch`,
    missing_id: `id not found`,
    invalid_value: `invalid value`,
    value_not_found: `value not found`,
    space_full: `space not empty`,
    already_exists: `value already set`,
    map_full: `map full`,
    creature_died: `creature died`,
    out_of_bounds: `out of bounds`,
    divide_by_0: `divide by 0`,
    failed_to_load: `Failed to load`,
    victory: `Victory`,
}
Object.freeze(ERRORS);
// ----------------ManeuverUtil.js----------------
// File for utility functions used throughout the program.

/**
 * Initiates the game when the page is loaded.
 * @returns {void}
 */
function initiate_game(){
    display.detect_keys();
    display.stop_space_scrolling();
    DISPLAY_DIVISIONS.swap(UIIDS.game_screen);
    display.display_message(UIIDS.title, gameplay_labels.title);
    create_main_dropdown(UIIDS.header_box);
    label_images();
    GS = new GameState();
    GS.setup();
    display_guide();
    setup_journal_navbar();
    setup_controls_page();
}

/**
 * Function to add a random temporary debuff card to the player's deck.
 */
function confuse_player(choices = CONFUSION_CARDS){
    // Chance redused by 50% for each stable_mind boon.
    if(!chance(GS.boons.has(boon_names.stable_mind), 2)){
        var card = random_from(choices)();
        GS.give_temp_card(card);
        GS.refresh_deck_display();
    }
}

function floor_has_chest(floor_of_area){
    if(floor_of_area === CHEST_LOCATION){
        return true;
    }
    if(GS.boons.has(boon_names.hoarder) && floor_of_area === SECOND_CHEST_LOCATION){
        return true;
    }
    return false;
}
const area_names = {
    ruins: `City Ruins`,
    sewers: `Sewers`,
    basement: `Basement`,
    magma: `Magmatic Caves`,
    crypt: `Crypt`,
    forest: `Subterranean Forest`,
    library: `Arcane Library`,
    court: `Candlelit Court`,
    
    default: `Post Game Area`,
    unknown: `Unknown`,
    assorted: `Assorted`
}
Object.freeze(area_names);
const boon_names = {
    locked: `Locked`,
    not_encountered: `Not Encountered`,

    ancient_card: `Ancient Card`,
    bitter_determination: `Bitter Determination`,
    blood_alchemy: `Blood Alchemy`,
    boss_slayer: `Boss Slayer`,
    brag_and_boast: `Brag & Boast`,
    chilly_presence: `Chilly Presence`,
    choose_your_path: `Choose Your Path`,
    clean_mind: `Clean Mind`,
    creative: `Creative`,
    dazing_blows: `Dazing Blows`,
    duplicate: `Duplicate`,
    empty_rooms: `Empty Rooms`,
    escape_artist: `Escape Artist`,
    expend_vitality: `Expend Vitality`,
    flame_strike: `Flame Strike`,
    flame_worship: `Flame Worship`,
    fleeting_thoughts: `Fleeting Thoughts`,
    fortitude: `Fortitude`,
    frenzy: `Frenzy`,
    frugivore: `Frugivore`,
    future_sight: `Future Sight`,
    gruntwork: `Gruntwork`,
    hoarder: `Hoarder`,
    larger_chests: `Larger Chests`,
    limitless: `Limitless`,
    manic_presence: `Manic Presence`,
    pacifism: `Pacifism`,
    pain_reflexes: `Pain Reflexes`,
    perfect_the_basics: `Perfect the Basics`,
    picky_shopper: `Picky Shopper`,
    practice_makes_perfect: `Practice Makes Perfect`,
    pressure_points: `Preassure Points`,
    quick_healing: `Quick Healing`,
    rebirth: `Rebirth`,
    repetition: `Repetition`,
    retaliate: `Retaliate`,
    rift_touched: `Rift Touched`,
    roar_of_challenge: `Roar of Challenge`,
    safe_passage: `Safe Passage`,
    shattered_glass: `Shattered Glass`,
    skill_trading: `Skill Trading`,
    slime_trail: `Slime Trail`,
    sniper: `Sniper`,
    spiked_shoes: `Spiked Shoes`,
    spontaneous: `Spontaneous`,
    stable_mind: `Stable Mind`,
    stealthy: `Stealthy`,
    stubborn: `Stubborn`,
    thick_soles: `Thick Soles`,
    vicious_cycle: `Vicious Cycle`,
}
Object.freeze(boon_names);

const boon_descriptions = {
    locked: `You have not unlocked this boon yet.`,
    not_encountered:
        `You have never taken this boon.`,

    bitter_determination: 
        `At the start of each floor, heal 1 if your health is exactly 1.`,
    blood_alchemy:
        `Take 2 damage, gain 2 max hp.`,
    boss_slayer: 
        `Bosses start with 2 less hp.`,
    brag_and_boast: 
        `Add 2 random boss cards and 2 random debuff cards to your deck.`,
    chilly_presence: 
        `Enemies have a 1/6 chance to become stunned at the end of their `
        +`turn. Bosses are not affected.`,
    choose_your_path: 
        `You get to decide which area to go to after each boss fight.`,
    clean_mind: 
        `Remove any 2 cards from your deck.`,
    creative: 
        `Increase your hand size by 1. Increases minimum deck size by 5.`,
    dazing_blows: 
        `Your attacks stun enemies. Bosses are unaffected.`,
    duplicate: 
        `Get a copy of any card in your deck.`,
    empty_rooms: 
        `Difficulty decreases by 3 floors`,
    escape_artist: 
        `Teleport away when attacked.`,
    expend_vitality: 
        `Heal 1 life at the start of each floor. Your max health is decreased by 1.`,
    flame_strike: 
        `Attacking an adjacent empty space has a 1/2 chance of shooting a fireball`,
    flame_worship:
        `An Altar of Scouring spawns on each non boss floor`,
    fleeting_thoughts: 
        `Temporary cards added to your deck will happen instantly.`,
    fortitude: 
        `Gain an extra max health and heal for 1.`,
    frenzy: 
        `Deal double damage while you only have 1 health.`,
    frugivore: 
        `50% chance to encounter a fruit tree on each floor. Eating the fruit will heal you `
        +`for 1, but might attract enemies.`,
    future_sight: 
        `You may look at the order of your deck.`,
    gruntwork: 
        `Gain 3 extra max health. Decrease your hand size by 1.`,
    hoarder: 
        `Encounter two chests in each area.`,
    larger_chests: 
        `All treasure chests contain 2 additional choices and are invulnerable.`,
    limitless: 
        `Remove your max health. Heal for 2. If you would be fully healed, heal `
        +`for 1 instead.`,
    manic_presence: 
        `Some types of enemies are prone to misfiring.`,
    pacifism: 
        `If you would attack an enemy, stun them twice instead (some terrain elements can still `
        +`be damaged). Fully heal at the start of each floor. All boss floor exits unlock.`,
    pain_reflexes: 
        `Take a turn whenever you are attacked.`,
    perfect_the_basics: 
        `Replace all your basic cards with better ones.`,
    picky_shopper: 
        `Recieve an extra card choice for adding and removing cards in the shop.`,
    practice_makes_perfect: 
        `Defeating a boss while at max health increases your max health by 1.`,
    pressure_points: 
        `When you stun an enemy, there is a 1/3 chance you also deal it 1 damage.`,
    quick_healing: 
        `After being dealt damage, you have a 1/4 chance to instantly heal it.`,
    rebirth: 
        `When you die, you are revived at full health and this boon is removed.`,
    repetition: 
        `Every 3rd turn, your cards happen twice.`,
    retaliate: 
        `When you are dealt damage, attack a nearby enemy.`,
    rift_touched: 
        `Two Darklings spawn on each non boss floor.`,
    roar_of_challenge: 
        `Gain 2 max health. Difficulty increases by 5 floors.`,
    safe_passage: 
        `Fully heal and travel to the next floor.`,
    shattered_glass: 
        `Enemies and Terrain explode on death damaging everything nearby other than you. Reduce your `
        +`max health by 2.`,
    skill_trading: 
        `You may both add a card and remove a card at each shop.`,
    slime_trail: 
        `Every time you move, there is a 1/2 chance of leaving a trail of corrosive slime.`,
    sniper: 
        `Attacks deal extra damage to enemies at a distance based on how far away they are.`,
    spiked_shoes: 
        `Attempting to move onto enemies damages them. Reduces your max health by 1.`,
    spontaneous: 
        `After using a non instant card, discard your whole hand. Minimum deck size `
        +`increased by 5.`,
    stable_mind: 
        `You gain a 50% chance to resist confusion.`,
    stealthy: 
        `Enemies are stunned for two turns at the start of each floor. Bosses are immune.`,
    stubborn: 
        `You can skip shops.`,
    thick_soles: 
        `You are immune to damage on your turn.`,
    vicious_cycle: 
        `At the start of each floor, fully heal and then add 2 temporary Lash Out cards to your deck.`,
}
Object.freeze(boon_descriptions);

const boon_prereq_descriptions = {
    none: 
        `Prerequisites: None.`,
    blood_alchemy:
        `Prerequisites: You must have at least 3 health and not have Limitless.`,
    clean_mind:
        `Prerequisites: You must be at least 2 cards above your minimum deck size.`,
    creative:
        `Prerequisites: You must have at least 10 cards in your deck.`,
    expend_vitality:
        `Prerequisites: You must have at least 2 max health and not have Limitless.`,
    fortitude: 
        `Prerequisites: You must not have Limitless.`,
    gruntwork:
        `Prerequisites: You must not have Limitless.`,
    hoarder:
        `Prerequisites: You must be less than 15 floors deep.`,
    perfect_the_basics:
        `Prerequisites: You must have at least 2 basic cards in your deck.`,
    practice_makes_perfect:
        `Prerequisites: You must be less than 15 floors deep and not have Limitless.`,
    roar_of_challenge:
        `Prerequisites: You must not have Limitless.`,
    safe_passage:
        `Prerequisites: You must have health less than your max health or have Limitless.`,
    shattered_glass:
        `Prerequisites: You must have at least 3 max health and not have Limitless.`,
    spiked_shoes:
        `Prerequisites: You must have at least 2 max health and not have Limitless.`,
    spontaneous:
        `Prerequisites: You must have at least 10 cards in your deck.`,
}
Object.freeze(boon_prereq_descriptions);

const boon_messages = {
    section_header: `Boons`,
    max: `Max`,
    no_max: `Unlimited`,
    number_picked: `Times Picked`,

    clean_mind: [`Choose a card to remove (`, `/2 remaining)`],
    duplicate: `Choose a card to copy:`,
    practice_makes_perfect: `Your maximum health has increased.`,
    rebirth: `You died, but were brought back to life.`,
}
Object.freeze(boon_messages);
const action_types = {
    move: `Move`,
    attack: `Attack`,
    teleport: `Teleport`,
    stun: `Stun`,
    move_until: `Move Until`,
    attack_until: `Attack Until`,
    heal: `Heal`,
}
Object.freeze(action_types);
const card_names = {
    symbol_add_card: `Add`,
    symbol_deck_at_minimum: `Minimum`,
    symbol_locked: `Locked`,
    symbol_not_encountered_card: `Not Encountered`,
    symbol_remove_card: `Remove`,

    advance: `Advance`,
    back_stab_1: `Back Stab 1`,
    back_stab_2: `Back Stab 2`,
    basic_diagonal: `Basic Diagonal`,
    basic_orthogonal: `Basic Orthogonal`,
    basic_slice: `Basic Slice`,
    beam_diagonal: `Beam Diagonal`,
    beam_ne: `Beam NE`,
    beam_nw: `Beam NW`,
    beam_orthogonal: `Beam Orthogonal`,
    beam_se: `Beam SE`,
    beam_sw: `Beam SW`,
    bite: `Bite`,
    blink_1: `Blink 1`,
    blink_2: `Blink 2`,
    bounding_retreat: `Bounding Retreat`,
    branch_strike: `Branch Strike`,
    breakthrough_horizontal: `Breakthrough Horizontal`,
    breakthrough_vertical: `Breakthrough Vertical`,
    butterfly: `Butterfly`,
    charge_horizontal: `Charge Horizontal`,
    charge_vertical: `Charge Vertical`,
    chomp: `Chomp`,
    clear_behind: `Clear Behind`,
    clear_in_front: `Clear in Front`,
    combat_diagonal: `Combat Diagonal`,
    combat_orthogonal: `Combat Orthogonal`,
    dash_ne: `Dash NE`,
    dash_nw: `Dash NW`,
    debilitating_confusion: `Debilitating Confusion`,
    diamond_attack: `Diamond Attack`,
    diamond_slice: `Diamond Slice`,
    execution_1: `Execution 1`,
    execution_2: `Execution 2`,
    execution_3: `Execution 3`,
    explosion: `Explosion`,
    fangs: `Fangs`,
    firebreathing_horizontal: `Firebreathing Horizontal`,
    firebreathing_ne: `Firebreathing NE`,
    firebreathing_nw: `Firebreathing NW`,
    firebreathing_vertical: `Firebreathing Vertical`,
    flanking_diagonal: `Flanking Diagonal`,
    flanking_horizontal: `Flanking Horizontal`,
    flanking_vertical: `Flanking Vertical`,
    force_horizontal: `Force Horizontal`,
    force_vertical: `Force Vertical`,
    fork: `Fork`,
    freeze_up: `Freeze Up`,
    glide: `Glide`,
    hit_and_run: `Hit and Run`,
    horsemanship: ``,
    instant_teleport: `Instant Teleport`,
    jab_diagonal: `Jab Diagonal`,
    jab_orthogonal: `Jab Orthogonal`,
    jump: `Jump`,
    lash_out: `Lash Out`,
    leap_left: `Leap Left`,
    leap_right: `Leap Right`,
    lightheaded: `Lightheaded`,
    lost_maneuver: `Lost Maneuver`,
    lost_technique: `Lost Technique`,
    lunge_left: `Lunge Left`,
    lunge_right: `Lunge_right`,
    maneuver_1: `Maneuver 1`,
    maneuver_2: `Maneuver 2`,
    maneuver_3: `Maneuver 3`,
    overcome_horizontal: `Overcome Horizontal`,
    overcome_vertical: `Overcome Vertical`,
    pike: `Pike`,
    punch_diagonal: `Punch Diagonal`,
    punch_orthogonal: `Punch Orthogonal`,
    push_back: `Push Back`,
    reckless_attack_left: `Reckless Attack Left`,
    reckless_attack_right: `Reckless Attack Right`,
    reckless_leap_forwards: `Reckless Leap Forwards`,
    reckless_leap_left: `Reckless Leap Left`,
    reckless_leap_right: `Reckless Leap Right`,
    reckless_sidestep_diagonal: `Reckless Sidestep Diagonal`,
    reckless_sidestep_orthogonal: `Reckless Sidestep Orthogonal`,
    reckless_spin: `Reckless Spin`,
    reckless_sprint: `Reckless Sprint`,
    reckless_teleport: `Reckless Teleport`,
    regenerate: `Regenerate`,
    roll_horizontal: `Roll Horizontal`,
    roll_ne: `Roll NE`,
    roll_nw: `Roll NW`,
    saw_strike: `Saw Strike`,
    short_charge_diagonal: `Short Charge Diagonal`,
    short_charge_orthogonal: `Short Charge Orthogonal`,
    sidestep_e: `Sidestep E`,
    sidestep_n: `Sidestep N`,
    sidestep_ne: `Sidestep NE`,
    sidestep_nw: `Sidestep NW`,
    sidestep_s: `Sidestep S`,
    sidestep_se: `Sidestep SE`,
    sidestep_sw: `Sidestep SW`,
    sidestep_w: `Sidestep W`,
    skitter: `Skitter`,
    slash_step_forwards: `Slash Step Forwards`,
    slash_step_left: `Slash Step Left`,
    slash_step_right: `Slash step Right`,
    slice_twice: `Slice Twice`,
    slip_through_ne: `Slip Through NE`,
    slip_through_nw: `Slice Through NW`,
    slither: `Slither`,
    snack: `Snack`,
    soar: `Soar`,
    spearhead: `Spearhead`,
    spin_attack: `Spin Attack`,
    split_second_1: `Split Second 1`,
    split_second_2: `Split Second 2`,
    sprint_horizontal: `Sprint Horizontal`,
    sprint_vertical: `Sprint Vertical`,
    step_left: `Step Left`,
    step_right: `Step Right`,
    stumble_e: `Stumble E`,
    stumble_n: `Stumble N`,
    stumble_ne: `Stumble NE`,
    stumble_nw: `Stumble NW`,
    stumble_s: `Stumble S`,
    stumble_se: `Stumble SE`,
    stumble_sw: `Stumble SW`,
    stumble_w: `Stumble W`,
    stunning_leap_horizontal: `Stunning Leap Horizontal`,
    stunning_leap_vertical: `Stunning Leap Vertical`,
    stunning_punch_diagonal: `Stunning Punch Diagonal`,
    stunning_punch_orthogonal: `Stunning Punch Orthogonal`,
    stunning_retreat: `Stunning Retreat`,
    stunning_slice: `Stunning Slice`,
    stunning_tread_diagonal: `Stunning Tread Diagonal`,
    stunning_tread_orthogonal: `Stunning Tread Orthogonal`,
    superweapon_1: `Superweapon 1`,
    superweapon_2: `Superweapon 2`,
    t_strike_horizontal: `T Strike Horizontal`,
    t_strike_vertical: `T Strike Vertical`,
    teleport: `Teleport`,
    thwack: `Thwack`,
    trample: `Trample`,
    trident: `Trident`,
    vine_snare: `Vine Snare`,
    y_leap: `Y Leap`,
    y_strike_ne: `Y Strike NE`,
    y_strike_nw: `Y Strike NW`,
}
Object.freeze(card_names);
// Button Options.
const null_move_button = `--`;
const NW = `NW`;
const N = `N`;
const NE = `NE`;
const E = `E`;
const SE = `SE`;
const S = `S`;
const SW = `SW`;
const W = `W`;
const C = `C`;

// Unicode symbols.
const usymbol = {
    // Unicode arrows
    left:   `\u2B9C`,
    up:     `\u2B9D`,
    right:  `\u2B9E`,
    down:   `\u2B9F`,
    // Bullet point
    bullet: `\u2022`,
}
Object.freeze(usymbol);

// Move types.
const move_types = {
    alt: `Shift click on a button to show actions on the map.`,
    evolutions: 
        `Dust and paint seems to be covering part of this card obscuring some of the options. `
        +`Maybe you can find some way to remove it?`,
    intro: `Move Options (actions will be performed in order):\n`,

    attack: `Attack`,
    move: `Move`,
    teleport: `Teleport to a random space`,
    stun: `Stun`,
    confuse: `Confuse: you`,
    move_until: `Move continuously`,
    attack_until: `Attack continuously`,
    heal: `Heal`,
    you: `You`,
    nothing: `Do nothing`,
    
    per_floor: `Once Per Floor: Can only be drawn one time per floor.`,
    temp: `Temporary: Removed from your deck when put into your discard, or at the end of the floor.`,
    instant: `Instant: Play another card this turn.`,
    
    locked: `This card has not been unlocked yet.`,
    not_found: `This card has never been added to your deck.`,
    number_picked: `Times Added`,
    number_removed: `Times Removed`,
}
Object.freeze(move_types);
const boss_names = {
    arcane_sentry: `Arcane Sentry`,
    arcane_sentry_node: `Arcane Sentry Node`,
    forest_heart: `Forest Heart`,
    lich: `Lich`,
    lord_of_shadow_and_flame: `Lord of Shadow and Flame`,
    spider_queen: `Spider Queen`,
    two_headed_serpent: `Two Headed Serpent`,
    two_headed_serpent_body: `Two Headed Serpent Body`,
    velociphile: `Velociphile`,
    young_dragon: `Young Dragon`,
}
Object.freeze(boss_names);

const boss_descriptions = {
    arcane_sentry: 
        `Arcane Sentry (Boss): An automated defense station. Changes modes in response to damage.`,
    arcane_sentry_node: 
        `Arcane Sentry Node: A transformable node controlled by the Arcane Sentry. Cannot be stunned.`,
    forest_heart: 
        `Forest Heart (Boss): An ancient tree warped by dark magic. Cannot take more than 1 damage `
        +`each turn and cannot be stunned. Reacts to damage by calling for aid from the forest.`,
    lich: 
        `Lich (Boss): An undead wielder of dark magic. Alternates between moving `
        +`one space away from you and casting a spell.`,
    lich_announcement: 
        `The Lich is preparing to cast:`,
    lich_change_announcement: 
        `The Lich changed it's spell to:`,
    lord_of_shadow_and_flame:
        `Lord of Shadow and Flame (Final Boss): Ruler from beyond the veil of reality. Summons `
        +`altars from which to cast it's spells. When next to the player it will prepare to attack `
        +`all nearby spaces on it's next turn. Moves at double speed while under half health.`,
    spider_queen: 
        `Spider Queen (Boss): Her back crawls with her young. Behaves like a normal spider. Taking `
        +`damage will stun her, but will also spawn a spider.`,
    two_headed_serpent_awake: 
        `Two Headed Serpent (Boss): Moves 1 square orthogonally, then attacks 1 square orthogonally. `
        +`When damaged, the neck will instantly grow into a new head.`,
    two_headed_serpent_asleep: 
        `Two Headed Serpent (Boss): This head is sleeping. When damaged, the neck will grow a new `
        +`head, which will spend it's turn waking up. The other head will then fall asleep.`,
    two_headed_serpent_body: 
        `Two Headed Serpent (Boss): The scales on the body are too tough to pierce.`,
    velociphile: 
        `Velociphile (Boss): A rolling ball of mouths and hate. Moves in one direction until it hits `
        +`something, then attacks in that direction. Cannot attack the squares next to it.`,
    young_dragon: [
        `Young Dragon (Boss): Be glad it's still young. Alternates between gliding and breathing fire.\n`
        +`The Dragon is currently `, 
        `preparing to fly a short distance.`, 
        `preparing to aim it's fire breath.`, 
        `preparing to breath fire in a 3 long cone.`
    ],
}
Object.freeze(boss_descriptions);

const boss_floor_message = {
    arcane_sentry: 
        `An alarm begins to blare.\n`
        +`INTRUDER DETECTED!`,
    forest_heart: `In the center of the floor stands a massive tree trunk spanning from floor to ceiling.`,
    lich: `Dust and dark magic swirl in the air.`,
    lord_of_shadow_and_flame: `Reality swirls and unravels around a solitary figure.`,
    lord_pacifism: `There is no escape. Despite your pacifism, you must find a way to fight.`,
    spider_queen: `The floor is thick with webs.`,
    two_headed_serpent: `The discarded skin of a massive creature litters the floor.`,
    velociphile: `You hear a deafening shriek.`,
    young_dragon: `The air burns in your lungs.`,
}
Object.freeze(boss_floor_message);

const boss_death_message = {
    general: 
        `The exit opens.\n`
        +`You feel your wounds begin to heal.`,
    arcane_sentry: 
        `MAIN SYSTEMS FAILING!\n`
        +`The ringing alarm subsides.`,
    arcane_sentry_node: `NODE OFFLINE!`,
    forest_heart: `Branches rain from above as the ancient tree is felled.`,
    lich: `The Lich's body crumbles to dust.`,
    lord_of_shadow_and_flame: 
        `As the ruler of this space fades from reality, the room begins to quake. Better leave quickly.`,
    spider_queen: `As the Spider Queen falls to the floor, the last of her children emerge.`,
    two_headed_serpent: 
        `It's body too small to regenerate any further, all four of the serpent's eyes close for the `
        +`final time`,
    velociphile: `The wailing falls silent as the Velociphile is defeated.`,
    young_dragon: `Scales so soft are easily pierced. The Young Dragon's fire goes out.`,
}
Object.freeze(boss_death_message);

// Individual Boss Descriptions

const lich_spell_descriptions = {
    confusion: `Confusion - Creates a cloud of confusion gas to pollute your deck.`,
    earthquake: `Earthquake - Causes chunks of the ceiling to rain down.`,
    flame_wave: `Flame Wave - Shoots 3 explosive fireballs towards the target.`,
    lava_moat: `Lava Moat - Creates pools of molten lava to shield the user.`,
    piercing_beam: `Piercing Beam - Fires a piercing beam in the direction closest to the target.`,
    rest: `Nothing.`,
    summon: `Summon - Summons 2 random enemies.`,
    teleport: `Teleport - The user moves to a random square on the map.`,
}
Object.freeze(lich_spell_descriptions);

const heart_spell_descriptions = {
    rest: `Currently, the Forest Heart is resting.`,
    growth: `Currently, the Forest Heart is preparing to grow plants.`,
    summon: `Currently, the Forest Heart is preparing to summon forest creatures.`,
}
Object.freeze(heart_spell_descriptions);

const sentry_mode_descriptions = {
    core: {
        turret: 
            `Currently the nodes are set to act as turrets.\n`
            +`While in this mode, the sentry will continuously create paper constructs.`,
        saw: 
            `Spinning saws will damage everything around it or touching it, then it will move 1 space `
            +`orthogonally.\n`
            +`After 3 turns, it will revert.`,
        cannon: 
            `Currently preparing to shoot volleys of fireballs.\n`
            +`After 2 volleys, it will revert.`,
    },
    node: {
        turret: `Fires beams orthogonally that hit the first thing in their path.`,
        saw: `Spinning saws will damage everything around it or touching it.`,
        cannon: `Shoots a fireball in the direction it is aimed.`,
        double_cannon: `Shoots 2 fireballs in the direction it is aimed.`,
    }
}
Object.freeze(sentry_mode_descriptions);
const enemy_descriptions = {
    acid_bug: 
        `Acid bug: Moves 1 space towards the player. Has no normal attack, but will spray acid `
        +`upon death hurting everything next to it.`,
    animated_boulder: 
        `Animated Boulder: Wakes up when something damages or moves onto it. Each turn it will `
        +`damage everything next to it, then move 1 space closer to the player. After 3 turns, `
        +`it will go back to sleep.`,
    blood_crescent:
        `Blood Crescent: Will move 3 spaces diagonally towards the player damaging them if it `
        +`hits them or passes next to them. Moves every other turn.`,
    brightling: 
        `Brightling: Is not aggressive. Will occasionally teleport the player close to it before `
        +`teleporting away the next turn.`,
    captive_void: 
        `Captive Void: Creatures within two spaces will be drawn towards it. Damaging it turns it `
        +`off for 2 turns.`,
    carrion_flies: 
        `Carrion Flies: Will attack the player if they are nearby. Otherwise wanders aimlessly. `
        +`Over time they will multiply.`,
    claustropede:
        `Claustropede: Will attack the player if it is next to them. Otherwise it will move `
        +`1 space closer. When hit it will spend it's next turn dividing and teleporting away `
        +`with both halves being stunned twice.`,
    clay_golem: 
        `Clay Golem: Will attack the player if it is next to them. Otherwise it will move 1 space `
        +`closer. Taking damage will stun it. Cannot move two turns in a row.`,
    corrosive_caterpillar: 
        `Corrosive Caterpillar: Is not aggressive. Leaves a trail of corrosive slime behind it `
        +`when it moves or dies.`,
    darkling: 
        `Darkling: Creates rifts that allow it to teleport. Hurts everything next to the location `
        +`it arrives at. Blocking it's rift will destroy it.`,
    gem_crawler: 
        `Gem Crawler: Every other turn it will move 1 space closer to the player, then attack them if `
        +`it is next to them.`,
    igneous_crab: 
        `Igneous Crab: Will attack the player if it is next to them. Otherwise it will move 1 space `
        +`closer. When damaged, it will spend the next 2 turns fleeing.`,
    living_tree: 
        `Living Tree: Will attack the player if they are exactly 2 spaces away in any direction. `
        +`Otherwise, moves one square towards the player if they are far from it, or away if they `
        +`are next to it.`,
    living_tree_rooted: 
        `Living Tree: Will attack the player if they are exactly 2 spaces away in any direction. `
        +`This one has put down roots making it unable to move.`,
    magma_spewer: 
        `Magma Spewer: Alternates between firing magma into the air and retreating if the player `
        +`is next to it.`,
    maw:
        `Maw: Attacks the player 3 times if they are 1 space away orthogonally. Otherwise moves 1 `
        +`space orthogonally towards them. Taking damage stuns it twice.`,
    noxious_toad: 
        `Noxious Toad: Every other turn it will hop over a space orthogonally. If it lands next to `
        +`the player, it will damage everything next to it.`,
    orb_of_insanity: 
        `Orb of Insanity: Does not move or attack. If the player is within 2 spaces of it, it will `
        +`confuse them, polluting their deck with a bad temporary card.`,
    paper_construct: 
        `Paper Construct: Can fire a beam at the player from up to 2 spaces away orthogonally `
        +`which hits the first thing in it's path. Otherwise, moves up to two spaces diagonally.`,
    pheonix: 
        `Pheonix: Flies to an empty spot 2 or 3 spaces away in a single direction. Everything it `
        +`flies over will be damaged and set on fire. When it dies, it drops a pile of ashes from `
        +`which it will eventually be reborn.`,
    porcuslime_large: 
        `Large Porcuslime: Moves 1 space towards the player then attacks in that direction. When `
        +`hit it will spend it's next turn shrinking.`,
    porcuslime_medium: 
        `Medium Porcuslime: Moves 1 space towards the player then attacks in that direction. `
        +`Alternates between orthoganal and diagonal movement. When hit it will spend it's `
        +`next turn splitting in two.`,
    porcuslime_small_d: 
        `Small Porcuslime: Moves 1 space diagonally towards the player then attacks in that direction.`,
    porcuslime_small_o: 
        `Small Porcuslime: Moves 1 space orthogonally towards the player then attacks in that direction.`,
    ram: 
        `Ram: Moves orthogonally. When it sees the player, it will prepare to charge towards `
        +`them and ram them.`,
    rat: 
        `Rat: Will attack the player if it is next to them. Otherwise it will move 2 spaces closer. `
        +`After attacking, it will flee.`,
    scorpion: 
        `Scorpion: Will attack the player if it is next to them. Otherwise, moves 2 spaces closer `
        +`every other turn.`,
    scythe: 
        `Scythe: Will move 3 spaces diagonally towards the player damaging them if it passes `
        +`next to them.`,
    shadow_knight: 
        `Shadow Knight: Attacks and moves in an L shape. If it tramples the player, it will move again.`,
    shadow_knight_elite: 
        `Shadow Knight Elite: Attacks and moves in an L shape. If it tramples the player, it will `
        +`move again. Smarter than normal shadow knights`,
    shadow_scout: 
        `Shadow Scout: Will attack the player if it is next to them. Otherwise it will move 1 space `
        +`closer. Can go invisible every other turn.`,
    specter: 
        `Specter: Can travel up to 3 spaces orthogonally. While doing so, it can pass through tiles `
        +`without costing movement. Damages tiles it passes through as well as stunning or `
        +`confusing them.`,
    spider_web: 
        `Spider Web: Does not move or attack. Spawns a spider every 3 turns. Slows over time.`,
    spider: 
        `Spider: Will attack the player if it is next to them. Otherwise it will move 1 space closer.`,
    starcaller:
        `Starcaller: Every 3 turns it will summon an object from another realm targeting the player's `
        +`location.`,
    strider: 
        `Strider: Can attack and move to squares 2 spaces away in one direction.`,
    swaying_nettle: 
        `Swaying Nettle: Alternates between attacking the squares orthogonal and diagonal to it. `
        +`Won't hurt other nettles.`,
    thorn_bush: 
        `Thorn Bush: Trying to move here hurts. Spreads it's brambles over time.`,
    turret_d: 
        `Turret: Does not move. Fires beams diagonally that hit the first thing in their path.`,
    turret_h: 
        `Turret: Does not move. Fires beams orthogonally that hit the first thing in their path.`,
    turret_m:
        `Moving Turret: Fires beams in two directions that hit the first thing in their path. `
        +`Moves in the same direction until it hits something, then reverses.`,
    turret_r: 
        `Turret: Does not move. Fires beams in two directions hitting the first thing in their `
        +`path. Rotates every turn.`,
    unspeakable:
        `Unspeakable: Moves 1 space closer to the player. Does not attack. On death, creates a `
        +`cloud of confusion gas to pollute your deck.`,
    unstable_wisp: 
        `Unstable Wisp: Moves randomly and occasionally leaves behind a fireball. Explodes into a `
        +`ring of fireballs on death.`,
    vampire: 
        `Vampire: Moves 1 space orthogonally then will attempt to attack diagonally. When it hits `
        +`the player, it will heal itself. Damaging it stuns it and causes it to teleport away.`,
    vinesnare_bush: 
        `Vinesnare Bush: Does not move. Can drag the player towards it using it's vines from up to 3 `
        +`spaces away. It can then prepare to lash out at the player if they are still nearby next turn.`,
    walking_prism: [
        `Walking Prism: Has no normal attack, but when damaged it will fire beams in 4 directions `
        +`which hit the first thing in their path. Changes firing direction aftewards.\n`, 
        `Currently aiming orthogonally.`,
        `Currently aiming diagonally.`
    ],
    wheel_of_fire:
        `Wheel of Fire: Can shoot a jet of fire in any direction that hits the first thing in it's `
        +`path. Retreats if the player is next to it. If no target is sighted, it will instead move `
        +`1 space randomly.`,
}
Object.freeze(enemy_descriptions);

const enemy_names = {
    acid_bug: `Acid Bug`, 
    animated_boulder: `Animated Boulder`, 
    blood_crescent: `Blood Crescent`,
    brightling: `Brightling`, 
    captive_void: `Captive Void`, 
    carrion_flies: `Carrion Flies`, 
    claustropede_1: `Claustropede x1`,
    claustropede_2: `Claustropede x2`,
    claustropede_3: `Claustropede x4`,
    clay_golem: `Clay Golem`, 
    corrosive_caterpillar: `Corrosive Caterpillar`, 
    darkling: `Darkling`, 
    gem_crawler: `Gem Crawler`, 
    igneous_crab: `Igneous Crab`, 
    living_tree: `Living Tree`, 
    magma_spewer: `Magma Spewer`, 
    maw: `Maw`,
    noxious_toad: `Noxious Toad`, 
    orb_of_insanity: `Orb of Insanity`, 
    paper_construct: `Paper Construct`, 
    pheonix: `Pheonix`, 
    porcuslime_large: `Large Porcuslime`, 
    porcuslime_medium: `Medium Porcuslime`, 
    porcuslime_small: `Small Porcuslime`, 
    ram: `Ram`, 
    rat: `Rat`, 
    scorpion: `Scorpion`, 
    scythe: `Scythe`, 
    shadow_knight: `Shadow Knight`, 
    shadow_knight_elite: `Shadow Knight Elite`, 
    shadow_scout: `Shadow Scout`, 
    specter: `Specter`, 
    spider_web: `Spider Web`, 
    spider: `Spider`, 
    starcaller: `Starcaller`,
    strider: `Strider`, 
    swaying_nettle: `Swaying Nettle`, 
    thorn_bush: `Thorn Bush`, 
    turret: `Turret`, 
    turret_m: `Moving Turret`, 
    turret_r: `Rotary Turret`, 
    unspeakable: `Unspeakable`,
    unstable_wisp: `Unstable Wisp`, 
    vampire: `Vampire`, 
    vinesnare_bush: `Vinesnare Bush`, 
    walking_prism: `Walking Prism`,
    wheel_of_fire: `Wheel of Fire`,
}
Object.freeze(enemy_names);

const enemy_flavor = {
    acid_bug: 
        `The explosive defenses these bugs have has left them without any natural predators. Their `
        +`resulting lack of fear is probably what lead to their curious nature. These are best `
        +`dispatched at range if possible. If they do manage to get close, be careful where you `
        +`swing your weapon.`,
    animated_boulder: 
        `The magnetic fields present in these caverns have interacted with the natural magic of the `
        +`area to create powerful elementals with a desire to be left alone. While their rocky makeup `
        +`makes them all but invulnerable and completely indistinguishable from stationary parts of `
        +`the terrain, they tend to tire quickly making fleeing a viable option.`,
    blood_crescent:
        ``,
    brightling: 
        `Beings from a higher plane of existance who have been attracted to the natural magic of the `
        +`area. Both curious and cautious, they warp space to bring creatures closer to be studied `
        +`before fleeing via the same method. They are entirely unaggressive and may help or hinder `
        +`in equal parts through their unexpected teleportations.`,
    captive_void: 
        `Either the result of some strange experiment or perhaps another part of the library's expansive `
        +`security system. Either way, these devices bend space around them to draw in everything `
        +`nearby. Thankfully they can be temporarily disabled through the use of blunt force.`,
    carrion_flies: 
        `Swarms move about at random attracted by the ample food sources available down here. They `
        +`tend to multiply quickly making it important to get rid of them as soon as possible.`,
    claustropede:
        ``,
    clay_golem: 
        `These golems are built to last with their tough skin showing countless scars. That makes it `
        +`likely that their construction wasn't recent. Thankfully they are incredibly slow moving `
        +`and seem to malfunction slightly when recieving damage. As long as you avoid being `
        +`surrounded it will be possible to wear them out eventually, or just run past them.`,
    corrosive_caterpillar: 
        ``,
    darkling: 
        `It is unclear whether this relative of the brightling exibits less control over their spacial `
        +`powers, or if they simply enjoy the whiplash of their constant relocations. Either way their `
        +`method of transportation is far more dangerous to both them and anything nearby. Blocking `
        +`rift often presents an easier way of dispatching them than tracking them down, but the `
        +`chaos caused by their jumps can also be helpful for taking out large groups of foes.`,
    gem_crawler: 
        ``,
    igneous_crab: 
        `These creatures have shielded themselves in rocky shells which makes them much more difficult `
        +`to kill than the giant spiders, however the cautious nature that led them to exhibit this `
        +`behaviour has also led them to flee at the first sign of danger often showing less awareness `
        +`of their surroundings as they do.`,
    living_tree: 
        `The magical energy permeating this forest which allows it to thrive far beneath the sight of `
        +`the sun has also had an unexpected effect on some of the plant life. While their wandering `
        +`nature could be an attempt to reach areas with fresh nutrients, it is unclear what led these `
        +`trees to be so aggressive. Thankfully their control over their branches isn't very fine `
        +`making their attacks easy to evade at close range.`,
    magma_spewer: 
        `These strange creatures possess a unique digestive tract. Rather than eating organic matter, `
        +`they get most of their energy through drinking magma. In addition to acting as a thermal `
        +`power source, it also allows them to fire rocks at high speeds through pressurized jets `
        +`on their head. This gives them a powerful natural defense mechanism that can take out targets `
        +`at great distances.`,
    maw:
        ``,
    noxious_toad: 
        `Capable of leaping great distances to navigate the difficcult terrain of the sewers, these `
        +`toads have also developed a natural defense mechanism which sets them apart from their `
        +`surface dwelling bretheren. They can release a toxic gas as they leap capable of harming `
        +`anything near the sight of their landing. It takes them a short time to recharge it however `
        +`leaving them open to attack immediatly after the gas has dispelled.`,
    orb_of_insanity: 
        `Some sort of malevolent force is encased in these spheres of glass. It does not seem to `
        +`belong in this world. Even looking at it for too long has a terrible effect on the psyche. `
        +`Thankfully it isn't able to survive outside the orb so simply shattering the glass is `
        +`enough to cause it to disperse.`,
    paper_construct: 
        `These small magical creatures are made of folded sheets of multicolored paper. Given the `
        +`fragile nature of their bodies, it is hard to imagine that they last very long. That lends `
        +`credence to the theory that something in the library is creating them, though what I do not `
        +`know.`,
    pheonix: 
        `This mythical bird makes a home in places of high temperature and large amounts of natural `
        +`magic. They are difficult to kill due to their fast speed and their ability to reconstitute `
        +`themselves from the ashes they leave behind on death. Scattering the ashes provides the most `
        +`certain way to ensure they do not return.`,
    porcuslime: 
        `While sharing the distributed nervous system and mitotic reproduction method common to many `
        +`slimes, these ones have developed spines coated with toxins they find while feeding from `
        +`the sewer floor. While they can shrug off damage by shedding mass, the smaller they become, `
        +`the less developed their nervous system becomes leading to less control over their movements. `
        +` As a last ditch effort to avoid death, they can split into two smaller slimes both capable `
        +`of regaining their former size through several weeks of feeding.`,
    ram: 
        `While herbivorous, these creatures are fiercely territorial. They can run at high speeds, but `
        +`find it difficult to change directions making them easy to dodge.`,
    rat: 
        ``,
    scorpion: 
        `The species of scorpion that can be found here is capable of quickly sprinting short `
        +`distances to hunt prey. They don't have great stamina however which gives them a need `
        +`for frequent stops to rest. It is often best to wait for them to come to you while taking `
        +`care not to become surrounded.`,
    scythe: 
        `One of the more dangerous species of giant insect encountered here, the Scythe is adorned by `
        +`a sharp bladelike protrusion on either side of it's head. Using it's many legs to move at `
        +`high speeds, it is even capable of slicing through steel. The position of the blades make it `
        +`easy to stop if you are directly in front of it however.`,
    shadow_knight: 
        ``,
    shadow_knight_elite: 
        ``,
    shadow_scout: 
        ``,
    specter: 
        `It is unclear if these are actually the ghosts of the departed or simply some sort of `
        +`magically created creature of pure shadow. Either way they are capable of phasing through `
        +`solid objects as though they were not there and have a chilling effect on anything they move `
        +`through.`,
    spider_web: 
        `Since the spiders here tend to hunt rather than lying in wait, these webs serve more as a `
        +`place for them to rest and to protect their young. Since it's hard to tell how many may be `
        +`waiting inside, it is recomended that these be destroyed to keep their population in check.`,
    spider: 
        `The spiders here reach sizes unseen anywhere else. They tend to hunt for their prey rather `
        +`than lying in wait in a web. Thankfully their large size hasn't made them very tough so they `
        +`are easily dispatched.`,
    starcaller:
        `Starcaller: Every 3 turns it will summon an object from another realm targeting `
        +`the player's location creating a small explosion.`,
    strider: 
        `These long legged creatures navigate the trecherous terrain of the magmatic caves with ease.`
        +`The strength of their barbed feet seems to mostly be used for defense as they can be seen `
        +`feeding off the sparse vegitation that grows on some of the boulders here.`,
    swaying_nettle: 
        `This plant uses stinging spines to ward off both curious herbivores and other plants that `
        +`encroach upon them. They can be seen swaying to extend their reach despite the lack of any `
        +`breeze to move them.`,
    thorn_bush: 
        `These bushes grow rapidly choking out many other kinds of vegitation and occasionally `
        +`trapping unwary creatures that end up as fertilizer. Thankfully despite the wide reach of `
        +`their brambles, they still only have a single stem which when severed will prevent `
        +`further growth.`,
    turret: 
        `Placed here when this area was abandoned, these automated turrets present a clear `
        +`warning: Don't come any further. While they are capable of sensing you through solid `
        +`objects, they may be an advantage as it means they will fire even if another enemy is `
        +`in the way.`,
    turret_m:
        `These turrets seem to be more advanced than their earlier counterparts. They are capable of `
        +`both levitating and moving, though they are limited in their direction of fire.`,
    turret_r: 
        `While it can't fire in as many directions at once, this turret can keep watch over more `
        +`directions overall. Thankfully it rotates at a fixed speed so it's movement can be predicted.`,
    unspeakable:
        ``,
    unstable_wisp: 
        `Beings of elemental fire that naturally spawn from the extreme heat. They are very unstable `
        +`and can explode violently if disrupted. They are not aggressive however so as long as you `
        +`destroy them from afar and avoid the fires left in their wake they are not very dangerous.`,
    vampire: 
        ``,
    vinesnare_bush: 
        `These carnivourous weeds are not unique to this area, but provide a danger to travelers `
        +`wherever they reside. Their vines spread out along the ground and wrap themselves around `
        +`the feet of whoever steps on them dragging them in range of the plant's thorny whips. `
        +`A careful traveller may be able to make use of their roots to move around faster.`,
    walking_prism: 
        ``,
    wheel_of_fire:
        ``,
}
Object.freeze(enemy_descriptions);
const entity_types = {
    chest: `Chest`,
    empty: `Empty`,
    enemy: `Enemy`,
    exit: `Exit`,
    final_exit: `Final Exit`,
    player: `Player`,
    terrain: `Terrain`,
}
Object.freeze(entity_types);
const event_descriptions = {
    black_hole:
        `A Black Hole is beginning to form here damaging anything standing here.`,
    confusion_cloud:
        `A cloud of mind melting magic will confuse or stun everything inside. Lasts 3 turns.`,
    darkling_rift: 
        `If this space isn't blocked, a darkling will teleport here next turn damaging everything `
        +`next to it.`,
    falling_rubble: 
        `Watch out, something is about to fall here damaging anything standing here.`,
    nettle_root: 
        `Watch out, swaying nettles are about to sprout damaging anything standing here.`,
    starfall:
        `Watch out, something is about to be pulled into existence damaging anything standing here.`,
    sunlight:
        `Watch out, this space is about to light on fire damaging anything standing here.`,
    thorn_root: 
        `Watch out, brambles are about to sprout damaging anything standing here.`,
}
Object.freeze(event_descriptions);

const event_names = {
    black_hole: `Black Hole`,
    bramble_shield: `Bramble Shield`,
    confusion_cloud: `Confusion Cloud`,
    darkling_rift: `Darkling Rift`,
    delay: `Delay`,
    earthquake: `Earthquake`,
    falling_magma: `Falling Magma`,
    falling_rubble: `Falling Rubble`,
    nettle_shield: `Nettle Shield`,
    spell_announcement: `Spell Announcement`,
    starfall: `Starfall`,
    unstun: `Unstun`,
    wake_up: `Wake Up`,
    warp: `Spacial Warp`
}
Object.freeze(event_names);
const other_tile_descriptions = {
    altar_of_scouring:
        `Altar of Scouring: Activate by moving here. When activated, creates a wall of fireballs along `
        +`the furthest wall to wipe the screen clean.`,
    altar_of_shadow:
        `Altar of Shadow: Activate by moving here. When activated, the Lord of Shadow and Flame will `
        +`become invisible until another altar is activated.`,
    altar_of_singularity:
        `Altar of Singularity: Activate by moving here. When activated, create a Black Hole in this space.`,
    altar_of_space:
        `Altar of Space: Activate by moving here. When activated, rearrange everything on the floor.`,
    altar_of_stars:
        `Altar of Stars: Activate by moving here. When activated, for the next 3 turns it will `
        +`summon an object from another realm targeting the player's location.`,
    altar_of_stasis:
        `Altar of Stasis: Activate by moving here. When activated, rewinds time healing the Lord `
        +`of Shadow and Flame by 3 and all altars by 1.`,
    altar_of_sunlight:
        `Altar of Sunlight: Activate by moving here. When activated, create an expanding fire centered `
        +`on the player's location.`,
    black_hole: 
        `Black Hole: Draws everything on screen closer to it. The Lord of Shadow and Flame is immune. `
        +`Decays every turn and cannot be stunned.`,
    bookshelf: 
        `Bookshelf: When damaged, adds a random temporary card to your deck. Cannot give healing cards.`,
    coffin: 
        `Coffin: There is no telling whether whatever is inside is still alive or not. On the other `
        +`hand there could be treasure inside. Disturb it at your own risk.`,
    corrosive_slime: 
        `Corrosive Slime: Stepping into this will hurt. Clear it out by attacking.`,
    fireball: 
        `Fireball: Moves forwards until it comes into contact with something, then damages it. Cannot `
        +`be stunned.`,
    fruit_tree_enticing: 
        `Enticing Fruit Tree: Moving here will heal you, but other creatures may be attracted by the `
        +`smell of the fruit.`,
    fruit_tree_rotting: 
        `Rotting Fruit Tree: None of the remaining fruit is edible, but the smell could still attract `
        +`creatures if it is disturbed.`,
    lava_pool: 
        `Lava Pool: Attempting to move here will hurt.`,
    magmatic_boulder: 
        `Magmatic Boulder: The light reflecting off of it gives you the feeling of being watched.`,
    moon_rock:
        `Moon Rock: A chunk of fragile rock from somewhere else.`,
    raging_fire: 
        `Raging Fire: The very ground here is burning. Attempting to move here will hurt. Decays every `
        +`turn and cannot be stunned`,
    repulsor: 
        `Repulsor: Pushes nearby creatures away by 2 spaces on it's turn or if touched. Takes 3 turns `
        +`to recharge afterwards.`,
    sewer_grate: 
        `Sewer Grate: It's clogged. Corrosive slime is oozing out.`,
    shatter_sphere_d:
        `Shatter Sphere: Explodes when damaged harming everything diagonal to it.`,
    shatter_sphere_o:
        `Shatter Sphere: Explodes when damaged harming everything orthogonal to it.`,
    smoldering_ashes: [
        `Smoldering Ashes: A pheonix will be reborn here in `, 
        ` turns unless you scatter the ashes by attacking or moving onto them.`
    ],
    thorn_bramble: 
        `Thorn Bramble: Attempting to move here hurts. Allows the thorn bush to spread further.`,
    wall: 
        `Wall: It seems sturdy.`,
    wall_damaged: 
        `Damaged Wall: Something might live inside.`,
}
Object.freeze(other_tile_descriptions);

const other_tile_names = {
    altar_of_scouring: `Altar of Scouring`,
    altar_of_shadow: `Altar of Shadow`,
    altar_of_singularity: `Altar of Singularity`,
    altar_of_space: `Altar of Space`,
    altar_of_stars: `Altar of Stars`,
    altar_of_stasis: `Altar of Stasis`,
    altar_of_sunlight: `Altar of Sunlight`,
    black_hole: `Black Hole`,
    bookshelf: `Bookshelf`,
    coffin: `Coffin`,
    corrosive_slime: `Corrosive Slime`,
    fireball: `Fireball`,
    fruit_tree_enticing: `Enticing Fruit Tree`,
    fruit_tree_rotting: `Rotting Fruit Tree`,
    lava_pool: `Lava Pool`,
    magmatic_boulder: `Magmatic Boulder`,
    moon_rock: `Moon Rock`,
    raging_fire: `Raging Fire`,
    repulsor: `Repulsor`,
    sewer_grate: `Sewer Grate`,
    shatter_sphere: `Shatter Sphere`,
    smoldering_ashes: `Smoldering Ashes`,
    thorn_bramble: `Thorn Brambles`,
    wall: `Wall`,
    wall_damaged: `Damaged Wall`,
}
Object.freeze(other_tile_names);
const special_tile_descriptions = {
    chest: `Chest: Has something useful inside. Breaking it will destroy the contents. Moving here `
    +`grants you another turn.`,
    chest_armored: `Armored Chest: Has something useful inside. It is larger than a normal chest and `
    +`is armored to protect it's contents. Moving here grants you another turn.`,
    empty: `There is nothing here.`,
    exit: `Exit: Stairs to the next floor.`,
    final_exit: `Return Portal: Move here to leave the dungeon and win the game.`,
    lock: `Locked Exit: Defeat the boss to continue.`,
    player: `You: Click a card to move.`,
}
Object.freeze(special_tile_descriptions);

const special_tile_names = {
    chest: `Chest`,
    chest_armored: `Armored Chest`,
    empty: `Empty`,
    exit: `Exit`,
    final_exit: `Return Portal`,
    lock: `Locked Exit`,
    you: `You`,
    player: `Player`,
}
Object.freeze(special_tile_names);

const chest_text = {
    header: `Choose up to one reward:`,
    take: `Take`,
    abandon: `Abandon`,
    add_card: `Add this card to your deck.`,
}
Object.freeze(chest_text);
const achievement_text = {
    title: `Achievements`,
    reset: `Reset`,
    confirm_reset: `Confirm?`,
    unlocked: `Achievement Unlocked:`,
    repeated: `Achievement Repeated:`,
    unlocks_boon: `New Boon`,
    unlocks_cards: `New Cards`,
}
Object.freeze(achievement_text);

const achievement_names = {
    // Boss
    velociphile: `Only A Speedbump`,
    spider_queen: `Arachno-Regicide`,
    two_headed_serpent: `One Head Is Better Than Two`,
    lich: `End To Unlife`,
    young_dragon: `Novice Dragonslayer`,
    forest_heart: `Expert Lumberjack`,
    arcane_sentry: `Security Bypass`,
    lord_of_shadow_and_flame: `Deeper and Deeper`,
    victory: `Victory`,

    // Normal
    ancient_knowledge: `Ancient Knowledge`,
    beyond_the_basics: `Beyond The Basics`,
    blessed: `Blessed`,
    clumsy: `Clumsy`,
    collector: `Collector`,
    common_sense: `Common Sense`,
    jack_of_all_trades: `Jack Of All Trades`,
    manic_vandal: `Manic Vandal`,
    minimalist: `Minimalist`,
    monster_hunter: `Monster Hunter`,
    non_violent: `Non Violent`,
    not_my_fault: `Not My Fault`,
    one_hit_wonder: `One Hit Wonder`,
    one_life: `One Is All You Need`,
    peerless_sprinter: `Peerless Sprinter`,
    shrug_it_off: `Shrug It Off`,
    speed_runner: `Speed Runner`,
    triple: `Three Of A Kind`,
    without_a_scratch: `Without A Scratch`,
}
Object.freeze(achievement_names);

const achievement_description = {
    // Boss
    velociphile: `Defeat the boss of the ${area_names.ruins}.`,
    spider_queen: `Defeat the boss of the ${area_names.basement}.`,
    two_headed_serpent: `Defeat the boss of the ${area_names.sewers}.`,
    lich: `Defeat the boss of the ${area_names.crypt}.`,
    young_dragon: `Defeat the boss of the ${area_names.magma}.`,
    forest_heart: `Defeat the boss of the ${area_names.forest}.`,
    arcane_sentry: `Defeat the boss of the ${area_names.library}.`,
    lord_of_shadow_and_flame: `Defeat the final boss of the ${area_names.court}.`,
    victory: `Escape victorious.`,

    // Normal
    ancient_knowledge: `Restore an ancient card to full power.`,
    beyond_the_basics: `Remove all basic cards from your deck.`,
    blessed: `Obtain 35 unique boons at least once.`,
    clumsy: `Take 5 or more damage during your turn without dying in 1 run.`,
    collector: `Open 6 or more treasure chests in 1 run.`,
    common_sense: `Obtain every common card at least once.`,
    jack_of_all_trades: `Have 25 or more non temporary cards in your deck.`,
    manic_vandal: `Destroy 7 or more treasure chests yourself in 1 run.`,
    minimalist: `Reach floor 15 with only 5 cards in your deck.`,
    monster_hunter: `Kill 5 total unique bosses.`,
    non_violent: `Reach the first boss without killing anything.`,
    not_my_fault: `Let a boss die without dealing any damage to it yourself.`,
    one_hit_wonder: `Defeat a boss in a single turn.`,
    one_life: `Defeat any boss while having exactly 1 max health.`,
    peerless_sprinter: `Speed through a floor in 3 turns or less.`,
    shrug_it_off: `Take 10 or more damage without dying in 1 run.`,
    speed_runner: `Leave floor 10 in 100 turns or less.`,
    triple: `Have 3 or more of the same non temporary card in your deck.`,
    without_a_scratch: `Leave floor 10 without ever taking damage.`,
}
Object.freeze(achievement_description);

const boss_achievements = [
    achievement_names.velociphile,
    achievement_names.spider_queen,
    achievement_names.two_headed_serpent,
    achievement_names.lich,
    achievement_names.young_dragon,
    achievement_names.forest_heart,
    achievement_names.arcane_sentry,
    achievement_names.lord_of_shadow_and_flame,
]
const control_screen_text = {
    default: `Default`,
    edit: `Edit`,
    save: `Save`,
    undo: `Undo`,
}
Object.freeze(control_screen_text);

const CONTROLS_TEXT = {
    header: `Controls`,
    stage: {
        header: `Stage Controls`,
        card: `Choose card`,
        direction: `Make move`,
        toggle: `Preview move (hold key down)`,
        info: `View card info`,
        retry: `Retry`
    },
    shop: {
        header: `Shop Controls`,
        add: `Choose card to add`,
        remove: `Choose card to remove`,
        confirm: `Confirm choice`
    },
    chest: {
        header: `Chest Controls`,
        choose: `Choose item`,
        confirm: `Confirm choice`,
        reject: `Abandon chest`
    }
}
Object.freeze(CONTROLS_TEXT);

const KEYBOARD_SYMBOL_MAP = new Map();
KEYBOARD_SYMBOL_MAP.set(` `, `space`);
const stat_image_labels = {
    deck: `Cards in deck`,
    floor: `Floor number`,
    turns: `Turn count`,
    kills: `Enemies killed`,
    dealt: `Damage dealt`,
    taken: `Damage taken`,
    chests: `Chests opened`,
    destroyed: `Chests destroyed`,
    health: `Health`,
    added: `Total Cards Added`,
    removed: `Total Cards Removed`,
}
Object.freeze(stat_image_labels);
const shop_text = {
    header: `Choose one card to add or remove:`,
    add: `Add a card to your deck.`,
    remove: `Remove a card from your deck.`,
    min: `Your deck is at the minimum size.`,
    invalid: `Please choose a card to add or remove.`,
    confirm: `Confirm >`,
    current: `Current Deck (minimum `,
}
Object.freeze(shop_text);
const SIDEBAR_BUTTONS = {
    text_log: `Messages`, 
    boon_list: `Boons`, 
    discard_pile: `Discard`, 
    full_deck: `Full Deck`, 
    initiative: `Initiative`, 
    deck_order: `Deck`,
    sidebar: `Sidebar`
}
Object.freeze(SIDEBAR_BUTTONS);

const record_types = {
    achievement: `achievement`,
    repeated_achievement: `repeated achievement`,
    normal: `normal`,
}
Object.freeze(record_types);
const gameplay_labels = {
    title: `Maneuver`,
    hand: `Hand of Cards`,
    move: `Moves`,
    retry: `Retry?`,
    hp: `hp`,
}
Object.freeze(gameplay_labels);

const gameplay_text = {
    welcome: 
        `Use cards to move (blue) and attack (red).\n` 
        +`Click on things to learn more about them.\n`
        +`Refer to the guidebook in the top right if you need more information.`,
    floor: 
        `Welcome to floor `,
    new_area:
        `You have entered the `,
    game_over: 
        `Game Over. You were killed by a `,
    stunned:
        `Stunned x`,
    divider: 
        `\n--------------------\n`,
    select_card: 
        `Before choosing what move to make, you must first select a card to use.`,
    victory:
        `You have emerged from the dungeon victorious! Click on the board to begin again.`,
}
Object.freeze(gameplay_text);
// ----------------GuideText.js----------------
// This file contains the headers and text for the guide / tutorial section.

const GUIDE_HEADERS = {
    basics: `The Basics`,
    cards: `Using Cards`,
    enemies: `Handling Enemies`,
    shop: `The Shop`,
    bosses: `Bosses`,
    chests: `Chests`,
    sidebar: `Sidebar`,
    confusion: `Confusion`,
    about: `About`,
}
Object.freeze(GUIDE_HEADERS);

const GUIDE_TEXT = {
    basics: [
        `Welcome to Maneuver!\n\n`
        +`The goal of the game is to progress as deep into the dungeon as possible by completing each floor. `
        +`To finish a floor, you need to reach the stairs that lead down to the next one. Enemies will spawn `
        +`on each floor which will try to stop you from continuing. You do not need to defeat everything on `
        +`the current floor to continue, but may need to fight most of them to survive.\n\n`
        +`Exit the dungeon by defeating the final boss on floor 25 to win.\n\n`
        +`Read more about controlling your character in the next section.\n`
        +`Good luck!\n\n`
    ],

    cards: [
        `To control your character's actions, you have a deck of cards. Each card gives you several `
        +`options for a set of actions to take. The actions on the card will be performed relative to `
        +`your current location (the black dot). Clicking on a card will bring up a grid of buttons which `
        +`will let you decide which of the card's options to use.\n\n`
        +`When you finish using a card, it will be discarded and replaced with another from your deck, then `
        +`everything else on the floor will get a chance to act before you get another turn.\n\n`
        +`When your deck runs out, your discard pile will be shuffled back into it. The amount of cards `
        +`remaining in your deck is shown next to your health bar.\n`
        +`\n`
        +`Colors and symbols that make up a card:\n\n`,
            ` Your relative starting location.\n`,
            ` You will attack this space.\n`,
            ` You will move to this space.\n`,
            ` If applied to an enemy, it will stun them. If applied to the player, it will instead add a `
            +`temporary debuff card to your deck (see these in Confusion).\n`,
            ` You will heal the creature on this space if it's health is less than it's max health.\n`,
            ` Each action the line goes through will be performed.\n`,
            ` Multiple actions will be performed in a specific order.\n`,
            ` Multiple moves will be performed until you hit something.\n`,
            ` Multiple attacks will be performed until you hit the edge of the floor.\n`,
            ` You will be teleported to a random unoccupied location.\n`,
            `  `,    ` Multiple actions will be performed on the same space. Moves will be performed last.\n`,
            ` A card with a purple grid will be performed instantly.\n`,
            ` A card with a tan background is temporary. It will be removed from your deck when you use it or when the floor ends.\n`,
            ` A card with a brown grid can only be used once per floor. When drawn it will show up as temporary.\n`
        +`\n`
        +`You can use the (?) button next to your move options to learn exactly what a selected card does, `
        +`or shift click to display what the card does on the map.\n\n`
    ],

    enemies: [
        `As you travel through the dungeon, you will encounter various other creatures, many of whom want `
        +`to kill you. Each creature has different patterns of attack and movement. Many of them also have `
        +`other unique abilities.\n\n`
        +`Click on a tile to learn more about creatures and terrain there. Clicking will show you a `
        +`description of everything on the tile, and which squares they might be able to attack next `
        +`turn. Also pay attention to how much health they have since some enemies might take several `
        +`hits to kill.\n\n`
        +`Remember that you do not need to kill everything to go to the next stage. Sometimes it's better `
        +`to run past an enemy than to fight it and risk getting surrounded or cornered. There may also be `
        +`some creatures you encounter that are more helpful than harmful.\n\n`
        +`Some enemies also have the ability to forcibly move you. When that happens, you will `
        +`immediately get another turn.\n\n`
        +`Some effects will cause an enemy to become stunned. They will be hightlighted in yellow. Stunned `
        +`enemies will skip their next turn. Multiple instances of stun will cause multiple turns to get `
        +`skipped.\n\n`
    ],

    shop: [
        `When you complete a floor, you will enter a shop where you must either add or remove a card from `
        +`your deck. You will get ${ADD_CHOICE_COUNT} options of random cards to add, and `
        +`${REMOVE_CHOICE_COUNT} options of random cards from your deck to remove. The current contents of `
        +`your deck will be shown to help you choose. You cannot go below your minimum deck size.\n\n`
        +`In addition to the shop, there are several other ways to get cards. You can find them from `
        +`defeating certain bosses or aquiring certain boons. Some enemies or effects may also add `
        +`temporary cards to your deck. They will go away after you play them or go to the next floor.\n\n`
    ],

    bosses: [
        `Every ${AREA_SIZE} floors, you will encounter a boss floor. The stairs out of this floor will be `
        +`locked until you defeat it's occupant. When you defeat the boss, the stairs will be `
        +`unlocked, you will be fully healed, and it will drop a chest containing a powerful new card as a `
        +`reward.\n\n`
        +`When leaving the floor, you will enter a new area of the dungeon with a different set of `
        +`inhabitants and a new boss at the end.\n\n`
    ],

    chests: [
        `On floor ${CHEST_LOCATION} of every area, you will find a treasure chest. Moving onto this chest `
        +`will allow you to pick a boon. Boons are powerful abilities that can give your character a unique `
        +`edge when it comes to surviving.\n\n`
        +`Chests will also be dropped after a boss is defeated. Rather than boons, these ones will contain `
        +`a card that lets you imitate one of the boss's abilities.\n\n`
        +`Be careful. Breaking a chest will destroy it's contents.\n\n`
    ],

    sidebar: [
        `The sidebar contains several tabs which keep track of useful information so you don't need to `
        +`remember it.\n\n`
        +`${usymbol.bullet} The Messages tab keeps track of messages the game tells you. Ones you bring up yourself like `
        +`the descriptions given by clicking on a tile will not be tracked.\n\n`
        +`${usymbol.bullet} The Discard tab will keep track of which cards in your deck have been used so far to help you `
        +`figure out what might be left to draw. It resets after shuffling.\n\n`
        +`${usymbol.bullet} The Initiative tab will keep track of the health and turn order of enemies. Pay attention to it `
        +`when trying to use one enemy to block the attack of another. It will not track hidden enemies.\n\n`
        +`More tabs might become available as you play.\n\n`
    ],

    confusion: [
        `Certain enemies and cards will confuse you. Confusion adds a temporary bad card to your deck which `
        +`will go away after it goes to your discard pile, or when you go to the next floor. Cards will do `
        +`this if they highlight your current square in yellow.\n\n`
        +`Here is a list of the possible confusion cards:\n\n`
    ],

    about: [
        `Maneuver is a game created by Sean Dunbar. It began in 2023. If you would like to view the `
        +`changelog or look at the source code, you can go to the `, 
        `.\n\n`
    ],
}
Object.freeze(GUIDE_TEXT);

const CARD_SYMBOLS = [
    {src: `${IMG_FOLDER.symbols}you.png`,               name: `you`,                x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}attack.png`,            name: `attack`,             x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}move.png`,              name: `move`,               x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}stun.png`,              name: `stun`,               x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}heal.png`,              name: `heal`,               x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}multiple.png`,          name: `multiple actions`,   x: 3, y: 1},
    {src: `${IMG_FOLDER.symbols}multiple_ordered.png`,  name: `actions in order`,   x: 3, y: 1},
    {src: `${IMG_FOLDER.symbols}move_until.png`,        name: `move until`,         x: 4, y: 1},
    {src: `${IMG_FOLDER.symbols}attack_until.png`,      name: `attack until`,       x: 4, y: 1},
    {src: `${IMG_FOLDER.symbols}teleport.png`,          name: `teleport`,           x: 3, y: 1},
    {src: `${IMG_FOLDER.symbols}attack_move.png`,       name: `attack then move`,   x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}triple_attack.png`,     name: `triple attack`,     x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}instant.png`,           name: `instant`,            x: 2, y: 2},
    {src: `${IMG_FOLDER.symbols}temporary.png`,         name: `temporary`,          x: 2, y: 2},
    {src: `${IMG_FOLDER.symbols}per_floor.png`,         name: `once per floor`,     x: 2, y: 2},
];

const about_page_text = {
    git_link: `https://github.com/seanmd8/Maneuver`,
    git_text: `Github Page`,
};
Object.freeze(about_page_text);
const journal_area_messages = {
    visited: `Times Visited`,
    cleared: `Times Cleared`
}
Object.freeze(journal_area_messages);
const journal_card_headers = {
    basic: `Basic Cards`,
    common: `Common Cards`,
    achievement: `Achievement Cards`,
    boon: `Boon Cards`,
    confusion: `Confusion Cards`,
    boss: `Boss Cards`,
}
Object.freeze(journal_card_headers);
const journal_navbar_labels = {
    cards: `Cards`,
    boons: `Boons`,
    areas: `Areas`,
}
Object.freeze(journal_navbar_labels);
const screen_names = {
    gameplay: `Gameplay`,
    guide: `Guidebook`,
    achievements: `Achievements`,
    journal: `Journal`,
    controls: `Controls`,
}
Object.freeze(screen_names);
// ----------------UIID.js----------------
// File containing a library of ids used to retrieve elements of the ui.

/**
 * Function to get a set of uiids (Identifiers that can be used to retrieve the appropriate ui element) for the appropriate language.
 * Throws an error if an invalid language is provided.
 * @param {string} language The language to get uiids for.
 * @returns {uiid_library} The library of uiids for that language.
 */
function get_uiids(language){
    // Factory function for the display classes (currently only html).
    switch(language){
        case `html`:
            return HTML_UIIDS;
        default:
            throw new Error(ERRORS.invalid_value);
    }
}

/**
 * @typedef {Object} uiid_library
 * @property {string} title Displays the title of the game.
 * @property {string} game_screen Controls the visibility of the game itself.
 *      @property {string} stats Displays the current stats.
 *      @property {string} stage Controls the visibility of the current floor.
 *          @property {string} map_display Displays the map of the floor.
 *          @property {string} health_display Displays the player's health.
 *          @property {string} remaining_deck Shows how many cards are left in the player's deck.
 *              @property {string} deck_image Deck icon in the background.
 *              @property {string} deck_count # of cards in the foreground.
 *          @property {string} hand_box The box around the hand of cards.
 *              @property {string} hand_label Labels the hand box.
 *              @property {string} hand_display Displays the player's hand of cards.
 *          @property {string} move_box The box around the move buttons.
 *              @property {string} move_label Labels the move button box.
 *              @property {string} move_info Info icon for move buttons.
 *              @property {string} move_buttons Displays the buttons for the last card clicked on.
 *          @property {string} display_message Displays messages.
 *          @property {string} retry_button: A button to allow them to reset after they die.
 *      @property {string} shop Controls the visibility of the shop.
 *          @property {string} shop_instructions Lets the player know they can add or remove a card.
 *          @property {string} add_card Displays which cards that could be added to their deck.
 *          @property {string} remove_card Displays which cards that could be removed from their deck.
 *          @property {string} shop_confirm Clicking this confirms their picks and moves to next floor.
 *          @property {string} shop_message Gives information about the last card clicked on.
 *          @property {string} current_deck Tells them the next element is their current deck.
 *          @property {string} display_deck Displays their entire deck.
 *      @property {string} chest Controls the visibility of the chest contents.
 *          @property {string} chest_lid: Creates the lid of the chest.
 *              @property {string} chest_instructions: A description of the contents of the chest.
 *          @property {string} chest_body: Created the body of the chest.
 *              @property {string} contents The images associated with the contents.
 *              @property {string} chest_confirm_row: Buttons allowing you to confirm your pick or skip the reward.
 *              @property {string} content_description: A description of whichever one of the contents you last clicked on.
 * @property {string} guide Controls the visibility of the guide screen.
 *      @property {string} guide_navbar Controls the visibility of each guidebook section.
 * @property {string} controls Controls the visibility of the controls section.
 *      @property {string} stage_controls Contains the controls for the stage.
 *      @property {string} shop_control Contains the controls for the shop.
 *      @property {string} chest_control Contains the controls for the chest.
 */

/** @type {uiid_library} The uiid library for HTML.*/
const HTML_UIIDS = {
    header_bar: `headerBar`,
        header_box: `headerBox`,
            title: `title`,
    game_screen: `gameScreen`,
        stage: `stage`,
            stage_stats: `stageStats`,
            map_display: `mapDisplay`,
            sidebar: `sidebar`,
                sidebar_header: `sidebarHeader`,
                initiative: `initiative`,
                boon_list: `boonList`,
                    boon_list_table: `boonListTable`,
                    removed_boon_table: `removedBoonTable`,
                discard_pile: `discardPile`,
                    discard_pile_table: `discardPileTable`,
                full_deck: `fullDeck`,
                    full_deck_table: `fullDeckTable`,
                text_log: `textLog`,
                    text_scroll: `textScroll`,
                deck_order: `deckOrder`,
                    deck_order_table: `deckOrderTable`,
            health_display: `healthDisplay`,
            remaining_deck: `remainingDeck`,
                deck_image: `deckImage`,
                deck_count: `deckCount`,
            hand_box: `handBox`,
                hand_label: `handLabel`,
                hand_display: `handDisplay`,
            move_box: `moveBox`,
                move_label: `moveLabel`,
                move_info: `moveInfo`,
                move_buttons: `moveButtons`,
            display_message: `displayMessage`,
            retry_box: `retryBox`,
            retry_button: `retryButton`,
        shop: `shop`,
            shop_stats: `shopStats`,
            shop_instructions: `shopInstructions`,
            add_card: `addCard`,
            remove_card: `removeCard`,
            shop_confirm: `shopConfirm`,
            shop_message: `shopMessage`,
            current_deck: `currentDeck`,
            display_deck: `displayDeck`,
        chest: `chest`,
            chest_stats: `chestStats`,
            chest_lid: `chestLid`,
                chest_instructions: `chestInstructions`,
            chest_body: `chestBody`,
                contents: `contents`,
                chest_confirm_row: `chestConfirmRow`,
                content_description: `contentDescription`,
        deck_select: `deckSelect`,
            deck_select_stats: `deckSelectStats`,
            deck_select_message: `deckSelectMessage`,
            deck_select_table: `deckSelectTable`,
            deck_select_card_info: `deckSelectCardInfo`,
            deck_select_confirm: `deckSelectConfirm`,
    guide: `guide`,
        guide_box: `guide-box`,
            guide_navbar: `guideNavbar`,
    achievements: `achievements`,
        achievement_list: `achievement-list`,
    journal: `journal`,
        journal_navbar: `journalNavbar`,
        journal_cards: `journalCards`,
            journal_card_info: `journalCardInfo`, // Generated
        journal_boons: `journalBoons`,
            journal_boon_info: `journalBoonInfo`, // Generated
        journal_areas: `journalAreas`,
    controls: `controls`,
        stage_controls: `stageControls`,
        shop_controls: `shopControls`,
        chest_controls: `chestControls`,
}
Object.freeze(HTML_UIIDS);

const UIIDS = get_uiids(MARKUP_LANGUAGE);
function explain_boon(boon){
    return `${boon.name}: ${boon.description}`;
}
function explain_boon_with_picked(boon){
    var description = explain_boon(boon);
    var picked = ``;
    var node = GS.data.boons.get_node(boon.name);
    if(node !== undefined){
        picked = `${boon_messages.number_picked}: ${node.data.picked}.`
    }
    return `${description}\n\n${picked}`;
}
function explain_boon_with_stats(boon){
    var description = explain_boon(boon);
    var prereq = boon.prereq_description;
    var max = `${boon_messages.max}: ${boon.max ? boon.max : boon_messages.no_max}.`;
    var picked = ``;
    var node = GS.data.boons.get_node(boon.name);
    if(node !== undefined){
        picked = `${boon_messages.number_picked}: ${node.data.picked}.`
    }
    return `${description}\n\n${max}\n\n${prereq}\n\n${picked}`;
}
function explain_card(card){
    var text = ``;
    text += card.evolutions !== undefined ? `${move_types.evolutions}\n\n` : ``;
    text += `${card.options.explain_buttons()}`;
    if(card.per_floor !== undefined){
        text += `${move_types.per_floor}\n`;
    }
    else if(card.temp){
        text += `${move_types.temp}\n`;
    }
    if(card.options.is_instant()){
        text += `${move_types.instant}\n`;
    }
    return text.trimEnd();
}
function explain_card_w_stats(card){
    var explanation = explain_card(card);
    var picked = ``;
    var removed = ``;
    var node = GS.data.cards.get_node(card.name);
    if(node !== undefined){
        picked = `${move_types.number_picked}: ${node.data.picked}.`
        removed = `${move_types.number_removed}: ${node.data.removed}.`
    }
    return `${explanation}\n\n${picked}\n${removed}`;
}
/**
 * Function to create the combined description of everything happening on a space of the game map.
 * @param {GridSpace} space The space to get a description of.
 * @returns {string} The properly formatted description.
 */
function grid_space_description(space){
    var tile = space.tile.look === undefined ? space.tile : space.tile.look;
    tile = tile_description(tile);
    var foreground = space.foreground.filter((fg) => fg.description !== undefined);
    foreground = foreground.map((fg) => `${gameplay_text.divider}${fg.description}`);
    var background = space.background.filter((bg) => bg.description !== undefined);
    background = background.map((bg) => `${gameplay_text.divider}${bg.description}`);
    var descriptions = [tile, ...foreground, ...background];
    return descriptions.reduce((res, str) => `${res}${str}`);
}
function hp_description(tile){
    var hp = hp_ratio(tile);
    if(hp !== ``){
        hp = `(${hp} ${gameplay_labels.hp}) `;
    }
    var stunned = ``;
    if(tile.stun !== undefined && tile.stun > 0){
        stunned = `*${gameplay_text.stunned}${tile.stun}* `;
    }
    return `${hp}${stunned}`;
}
function hp_ratio(tile){
    if(tile.max_health !== undefined && tile.health !== undefined){
        return `${tile.health}/${tile.max_health}`;
    }
    if(tile.health !== undefined){
        return `${tile.health}`;
    }
    return ``;
}
/**
 * Function to create the full description including
 *      -stun amount
 *      -health
 *      -max health
 * when appropriate.
 * @param {Tile} tile Tile to make the description for.
 * @returns {string} The formatted description.
 */
function tile_description(tile){
    if(tile.description === undefined){
        throw new Error(ERRORS.missing_property);
    }
    return `${hp_description(tile)}${tile.description}`;
}
// ----------------Display.js----------------
// File containing the display class which interacts with wherever the game is being displayed. 
// Currently the only way to display is via HTML, but if I wanted to port the game, this should
// make it easier to do without too much editing outside of this file and the uiid file. This also
// standardizes how information is displayed making it easier to create new display elements.

/**
 * @typedef {Object} CellInfo The info required to create a table cell with an image.
 * @property {string} pic The image to be displayed in the cell.
 * @property {string=} name If name is provided, it will be used as mouseover text.
 * @property {number=} rotate If rotate is provided (in 90 degree increments) the image will be rotated by that amount.
 * @property {boolean=} flip If flip is provided, the image will be flipped horizontally.
 */

/**
 * @typedef {Object} ButtonInfo The info required to create a button table cell.
 * @property {string} description The text to be displayed in the button.
 * @property {OnClickFunction=} on_click The function to be called when the button is clicked.
 */

/**
 * @callback OnClickFunction A function to be called when an element is clicked.
 * @param {CellInfo} tile The object used to create this element.
 * @param {Point} position The row and column of the element.
 */

/**
 * @callback NormalCallback A function with no args or returns.
 * @returns {void}
 */

/**
 * @typedef {Object} DropdownOption
 * @property {string} label The label that should be displayed in the dropdown menu.
 * @property {NormalCallback} on_change The function executed when this option is chosen.
 */

/**
 * @callback add_tb_row A function to add a row of images to a table.
 * @param {string} location The ID of the table to be added to.
 * @param {CellInfo[]} row_contents The objects used to construct the row's contents.
 * @param {number} scale The size of the images.
 */

/**
 * @callback add_button_row A function to add a row of buttons to a table.
 * @param {string} location The ID of the table to be added to.
 * @param {ButtonInfo[]} row_contents The objects used to construct the row's contents.
 */

/**
 * @callback display_message A function to display a message to an element.
 * @param {string} location The ID of the element to display the message to.
 * @param {string} message The message to be displayed.
 */

/**
 * @callback remove_children A function to remove all rows from a table.
 * @param {string} location The ID of the table to remove rows from.
 */

/**
 * @callback swap_screen A function to swap which div from a group is visible
 * @param {string[]} divisions An array of div names to set to invisible.
 * @param {string} [screen = undefined] Optional parameter for the ID of a div to set to visible.
 */

/**
 * @callback select A function to outline one image from a row of images in a table.
 * @param {string} location The ID of the table.
 * @param {number} row_num The row number of the image.
 * @param {number} column_num The column number of the image.
 */

/**
 * @callback press A function to handle keyboard controls.
 * @param {KeyboardEvent} key_press The keystroke to handle.
 */

/**
 * @callback create_visibility_toggle A function to create a section of text that can be minimized with the press of a button.location, header, body
 * @param {string} location Where to create the section.
 * @param {string} header What the section is called.
 * @param {HTMLElement} body_elemnt The text to display in the section.
 */

/**
 * @callback create_dropdown A function to create a dropdown menu where the user can select an option.
 * @param {string} location Where the dropdown menu should be added to.
 * @param {DropdownOption[]} options_arr An array of each label and associated function that make up the dropdown menu.
 */

/**
 * @callback create_alternating_text_section A function to create a section of interspersed text with images and other elements.
 * @param {string} location The id of the div element to put the section in.
 * @param {string} header The header to give the section. The div id will be of the form `${header} section`.
 * @param {string[]} par_arr An array of the strings which other elements should be placed between.
 * @param {HTMLElement[]} inline_arr An array of other elements to be added inline inbetween the strings. 
 *                                  It's length should be 1 or 0 less than par_arr's.
 * @returns {string} The div id.
 */

/**
 * @callback create_button Creates and returns a button element.
 * @param {string} label The button text.
 * @param {string} id The element id.
 * @param {NormalCallback=} on_click If provided, called when it is clicked.
 * @returns {HTMLInputElement} The created button.
 */

/**
 * @callback create_image Creates and returns an image eleemnt.
 * @param {string} src The pic to display.
 * @param {string} id The element id
 * @param {number | Point} size How largethe pic should be.
 * @returns {HTMLImageElement} The created image.
 */

/**
 * @callback add_on_click Adds an on_click function to an element.
 * @param {string} location The id of the element to add an on_click to.
 * @param {function} on_click The function to call when the element is clicked on.
 */

/**
 * @typedef {Object} DisplayLibrary The library of functions used to handle displaying things in a specific language.
 * @property {add_tb_row} add_tb_row
 * @property {add_button_row} add_button_row
 * @property {display_message} display_message
 * @property {remove_children} remove_children
 * @property {swap_screen} swap_screen
 * @property {select} select
 * @property {press} press
 * @property {create_visibility_toggle} create_visibility_toggle
 * @property {create_dropdown} create_dropdown
 * @property {create_alternating_text_section} create_alternating_text_section
 * @property {create_button} create_button
 * @property {create_image} create_image
 * @property {add_on_click} add_on_click
 */

/**
 * A function to get the display library for a given language.
 * @param {string} language The language to get the library for.
 * @returns {DisplayLibrary}
 */
function get_display(language){
    // Factory function for the display classes (currently only html).
    switch(language){
        case `html`:
            return DisplayHTML;
        default:
            throw new Error(ERRORS.invalid_value);
    }
}

/**
 * @callback get_transformation A helper function to format all css transformation properties detailed by an object into a single string.
 * @param {CellInfo} to_display The object that contains which transformations to perform.
 * @returns {string} String that can be used to apply the appropriate transformations.
 */

/**
 * @callback html_constructor Typedef for a HTMLElement constructor
 * @returns {*}
 * 
 * @overload 
 * @param {string} location
 * @returns {HTMLElement}
 * 
 * @overload
 * @param {string} location
 * @param {html_constructor} type
 * @returns {HTMLElement}
 * 
 * @callback get_element Function to get a html element, make sure it's not void, and optionally make sure it is the correct type.
 * @param {string} location The ID of the element to get.
 * @param {function} [type = undefined] Optional constructor of the type of element it should be.
 * @returns {*} Returns the element which is optionally guarenteed to be the right type.
 */

/**
 * @typedef {Object} HTML_Helpers A collection of the helper functions used by the DisplayHTML library.
 * @property {get_transformation} get_transformation
 * @property {get_element} get_element
 */

/**
 * Library containing functions used to diplay things in HTML.
 * Implements DisplayLibrary.
 * @type {DisplayLibrary & HTML_Helpers}
 */
const DisplayHTML = {
    // Required functions.
    add_tb_row: function(location, row_contents, scale){
        var table = DisplayHTML.get_element(location, HTMLTableElement);
        var row_num = table.rows.length;
        var row = document.createElement(`tr`);
        row.id = `${location} row ${row_num}`;
        row.style.height = `auto`;
        row.style.minHeight= `${scale}px`; 
        for(var i = 0; i < row_contents.length; ++i){
            var to_display = row_contents[i];
            // Make table cell
            var cell = document.createElement(`td`);
            cell.id = `${location} ${row_num} ${i}`;
            cell.style.height = `${scale}px`;
            cell.style.width = `${scale}px`;
            cell.classList.add(`relative`);
            if(to_display.on_click !== undefined){
                cell.onclick = to_display.on_click;
            }
            if(to_display.name !== undefined){
                cell.title = to_display.name;
            }
            if(to_display.selected === true){
                cell.classList.add(`selected-element`);
            }
            var layers = [];
            var image;
            // Foreground images
            if(to_display.foreground !== undefined){
                for(let pic of to_display.foreground){
                    image = document.createElement(`img`);
                    image.src = `${IMG_FOLDER.src}${pic}`;
                    layers.push(image);
                }
            }
            // Main image
            image = document.createElement(`img`);
            image.src = `${IMG_FOLDER.src}${to_display.pic}`;
            if(to_display.name !== undefined){
                image.alt = to_display.name;
            }
            image.style.transform = DisplayHTML.get_transformation(to_display);
            layers.push(image);
            // Background images
            if(to_display.background !== undefined){
                for(let pic of to_display.background){
                    image = document.createElement(`img`);
                    image.src = `${IMG_FOLDER.src}${pic}`;
                    layers.push(image);
                }
            }
            // Style/size images
            layers = layers.reverse();
            for(let layer of layers){
                layer.height = scale;
                layer.width = scale;
                layer.classList.add(`absolute`);
                cell.append(layer);
            }
            row.append(cell);
        }
        table.append(row);
    },
    add_button_row: function(location, row_contents){
        var table = DisplayHTML.get_element(location, HTMLTableElement);
        var row_num = table.rows.length;
        var row = document.createElement(`tr`);
        row.id = `${location} row ${row_num}`;
        for(var i = 0; i < row_contents.length; ++i){
            var button = row_contents[i];
            row.append(DisplayHTML.create_button(button.description, `${location} ${row_num} ${i}`, button.on_click));
        }
        table.append(row);
    },
    display_message: function(location, message){
        DisplayHTML.get_element(location).innerText = message;
    },
    remove_children: function(location){
        var element = DisplayHTML.get_element(location);
        while(element.firstChild){
            element.removeChild(element.lastChild);
        }
    },
    swap_screen: function(divisions, screen = undefined){
        for(var i = 0; i < divisions.length; ++i){
            DisplayHTML.get_element(divisions[i], HTMLDivElement);
            display.remove_class(divisions[i], `visible-section`);
            display.add_class(divisions[i], `hidden-section`);
        }
        if(screen !== undefined){
            DisplayHTML.get_element(screen, HTMLDivElement);
            display.remove_class(screen, `hidden-section`);
            display.add_class(screen, `visible-section`);
        }
    },
    select: function(location, row_num, column_num){
        var row = DisplayHTML.get_element(`${location} row ${row_num}`, HTMLTableRowElement);
        var column_count = row.cells.length;
        for(var i = 0; i < column_count; ++i){
            DisplayHTML.get_element(`${location} ${row_num} ${i}`, HTMLTableCellElement).classList.remove(`selected-element`);
        }
        DisplayHTML.get_element(`${location} ${row_num} ${column_num}`, HTMLTableCellElement).classList.add(`selected-element`);
    },
    press: function(key_press){
        var key = key_press.key.toLowerCase();
        GS.data.controls.toggle_press(key);
        if(DISPLAY_DIVISIONS.is(UIIDS.game_screen)){
            if(GAME_SCREEN_DIVISIONS.is(UIIDS.stage)){
                GS.data.controls.stage(key);
            }
            else if(GAME_SCREEN_DIVISIONS.is(UIIDS.shop)){
                GS.data.controls.shop(key);
            }
            else if(GAME_SCREEN_DIVISIONS.is(UIIDS.chest)){
                GS.data.controls.chest(key);
            }
        }
        else if(DISPLAY_DIVISIONS.is(UIIDS.controls) && display.set_control !== undefined){
            display.set_control(key);
        }
    },
    unpress: function(key_press){
        var key = key_press.key.toLowerCase();
        GS.data.controls.toggle_unpress(key);
    },
    click: function(location){
        try{
            var element = DisplayHTML.get_element(location);
            if(element !== undefined && element.onclick !== undefined){
                element.click();
            }
        }
        catch(error){
            if(error.message !== ERRORS.value_not_found){
                throw error;
            }
        }
    },
    create_visibility_toggle: function(location, header, on_click){
        var section = DisplayHTML.get_element(location);
        var element = document.createElement(`input`);
        element.type = `button`;

        element.value = header;
        element.onclick = on_click;
        section.append(element);
    },
    create_dropdown: function(location, options_arr){
        var doc_location = this.get_element(location);
        var select_button = document.createElement(`select`);
        var select_id = `${location} select`
        select_button.id = select_id;
        var select_func = function(options, select_id){
            var option_func_map = new Map();
            for(var option of options){
                option_func_map.set(option.label, option.on_change);
            }
            return function(){
                var select_element = DisplayHTML.get_element(select_id, HTMLSelectElement);
                var label = select_element.value;
                var chosen_option = option_func_map.get(label);
                if(chosen_option === undefined){
                    throw new Error(`unrecognized value in select element`);
                }
                chosen_option();
            }
        }
        var f = select_func(options_arr, select_id);
        select_button.onchange = () => {
            f();
            select_button.blur();
        };
        for(var option_data of options_arr){
            var option = document.createElement(`option`);
            option.value = option_data.label;
            option.innerText = option_data.label;
            select_button.append(option);
        }
        doc_location.append(select_button);
    },
    create_alternating_text_section: function(location, header, par_arr, inline_arr){
        if(par_arr.length !== inline_arr.length && par_arr.length !== inline_arr.length + 1){
            throw new Error(ERRORS.array_size);
        }
        var body_div = document.createElement(`div`);
        var body_div_id = `${header} section`;
        body_div.id = body_div_id;
        body_div.classList.add(`guidebook-section`);

        var body_header = document.createElement(`h2`);
        body_header.id = `${body_div_id} header`;
        body_header.innerText = `${header}:`;
        body_div.append(body_header);

        for(var i = 0; i < par_arr.length; ++i){
            var body_text = document.createElement(`p`);
            body_text.id = `${body_div_id} text ${i}`;
            body_text.innerText = par_arr[i];
            body_text.style.display = `inline`;
            body_div.append(body_text);
            if(i < inline_arr.length){
                inline_arr[i].id = `${body_div_id} non-text ${i}`
                inline_arr[i].style.display = `inline`;
                body_div.append(inline_arr[i]);
            }
        }
        var destination = DisplayHTML.get_element(location, HTMLDivElement);
        destination.append(body_div);
        return body_div_id;
    },
    create_button: function(label, id = undefined, on_click = undefined){
        var button = document.createElement(`input`);
        button.type = `button`;
        button.id = id;
        if(on_click !== undefined){
            button.onclick = on_click;
        }
        button.value = label;
        return button;
    },
    set_button: function(location, text, on_click, clickable){
        var button = DisplayHTML.get_element(location, HTMLInputElement);
        button.onclick = on_click;
        button.value = text;
        if(clickable){
            button.classList.remove(`greyed-out`);
        }
        else{
            button.classList.add(`greyed-out`);
        }
    },
    create_image: function(src, id, size){
        var image = document.createElement(`img`);
        image.src = `${IMG_FOLDER.src}${src}`;
        image.id = id;
        if(typeof size === `number`){
            image.width = size;
            image.height = size;
        }
        else{
            image.width = size.x;
            image.height = size.y;
        }
        return image;
    },
    add_on_click: function(location, on_click){
        var element = DisplayHTML.get_element(location);
        element.onclick = on_click;
    },
    add_class: function(location, css_class){
        var element = DisplayHTML.get_element(location);
        element.classList.add(css_class);
    },
    remove_class: function(location, css_class){
        var element = DisplayHTML.get_element(location);
        element.classList.remove(css_class);
    },
    create_stacked_p: function(location, content){
        var element = DisplayHTML.get_element(location);
        for(var message of content){
            var p = document.createElement(`p`);
            p.innerText = message.str;
            p.classList.add(`log-text`);
            switch(message.type){
                case record_types.achievement:
                    p.classList.add(`achievement-log-text`);
                    break;
                case record_types.repeated_achievement:
                    p.classList.add(`repeated-achievement-log-text`);
                    break;
                default:
                    p.classList.add(`normal-log-text`);
                    break;
            }
            element.append(p);
            var hr = document.createElement(`hr`);
            element.append(hr);
        }
    },
    detect_keys: function(){
        document.onkeydown = display.press;
        document.onkeyup = display.unpress;
    },
    create_initiative: function(location, contents, size){
        location = DisplayHTML.get_element(location);
        for(let element of contents){
            let container = document.createElement(`div`);
            let picbox = document.createElement(`div`);
            let pic = document.createElement(`img`);
            let parbox = document.createElement(`div`);
            let par = document.createElement(`p`);

            container.classList.add(`initiative-element`);
            if(element.on_click !== undefined){
                container.onclick = element.on_click;
            }
            pic.src = `${IMG_FOLDER.src}${element.pic}`;
            pic.alt = element.name;
            pic.title = element.name;
            pic.style.height = `${size}px`;
            pic.style.width = `${size}px`;
            pic.style.transform = DisplayHTML.get_transformation(element);
            if(element.stun){
                pic.classList.add(`stun-background`);
            }
            par.innerText = element.str;

            picbox.append(pic);
            parbox.append(par);
            container.append(picbox);
            container.append(parbox);
            location.append(container);
        }
    },
    add_controls_header: function(location, description, edit_function){
        var div = document.createElement(`div`);
        div.classList.add(`control-header`);
        var header = document.createElement(`h2`);
        header.innerText = description;
        var edit_mode = function(controls){
            return () => {
                setup_controls_page();
                DisplayHTML.remove_children(location);
                edit_function(controls);
            }
        }
        var edit_button = DisplayHTML.create_button(control_screen_text.edit, undefined, edit_mode(GS.data.controls.get()));
        var default_button = DisplayHTML.create_button(control_screen_text.default, undefined, edit_mode(new KeyBind().get()));
        div.append(header);
        div.append(edit_button);
        div.append(default_button);
        var place = DisplayHTML.get_element(location);
        place.append(div);
    },
    add_edit_controls_header: function(location, description, view_function, controls){
        var div = document.createElement(`div`);
        div.classList.add(`control-header`);
        var header = document.createElement(`h2`);
        header.innerText = description;
        var save_button = DisplayHTML.create_button(control_screen_text.save, undefined, () => {
            if(KeyBind.is_valid(controls)){
                GS.data.set_controls(controls);
                DisplayHTML.remove_children(location);
                view_function();
            }
        });
        var undo_edit_button = DisplayHTML.create_button(control_screen_text.undo, undefined, () => {
            DisplayHTML.remove_children(location);
            view_function();
        });
        div.append(header);
        div.append(save_button);
        div.append(undo_edit_button);
        var place = DisplayHTML.get_element(location);
        place.append(div);
    },

    control_box: function(location, controls, description){
        var div = document.createElement(`div`);
        div.classList.add(`control-box`);
        var tb = document.createElement(`table`);
        for(var r = 0; r < Math.ceil(controls.length / 3); ++r){
            var start = r * 3;
            var row = document.createElement(`tr`);
            for(var c = 0; c < 3 && c + start < controls.length; ++c){
                var button_text = controls[start + c];
                if(KEYBOARD_SYMBOL_MAP.has(button_text)){
                    button_text = KEYBOARD_SYMBOL_MAP.get(button_text);
                }
                row.append(DisplayHTML.create_button(button_text));
            }
            tb.append(row);
        }
        var table_div = document.createElement(`div`);
        table_div.append(tb);
        div.append(table_div);
        var p = document.createElement(`p`);
        p.innerText = description;
        div.append(p);
        var place = DisplayHTML.get_element(location);
        place.append(div);
    },
    control_edit_box: function(location, controls, description){
        var edit = (display, button, controls, i) => {
            return () => {
                var unclicked = button.classList.contains(`edit-control`);
                var boxes = document.querySelectorAll(`#${location} .control-edit-box div input`);
                for(var box of boxes){
                    box.classList.remove(`edit-control`);
                }
                display.set_control = undefined;
                if(!unclicked){
                    button.classList.add(`edit-control`);
                    display.set_control = (key) => {
                        controls[i] = key;
                        button.value = KEYBOARD_SYMBOL_MAP.has(key) ? KEYBOARD_SYMBOL_MAP.get(key) : key;
                        button.classList.remove(`edit-control`);
                        display.set_control = undefined;
                    }
                }
            }
        }
        for(var i = 0; i < controls.length; ++i){
            var div = document.createElement(`div`);
            div.classList.add(`control-edit-box`);
            var button_div = document.createElement(`div`);
            var button_text = controls[i];
            if(KEYBOARD_SYMBOL_MAP.has(button_text)){
                button_text = KEYBOARD_SYMBOL_MAP.get(button_text);
            }
            var button = DisplayHTML.create_button(button_text);
            button.onclick = edit(this, button, controls, i);
            button_div.append(button);
            div.append(button_div);
            var p = document.createElement(`p`);
            p.innerText = (controls.length === 1 ? description : `${description} ${i + 1}`);
            div.append(p);
            var place = DisplayHTML.get_element(location);
            place.append(div);
        }
    },
    show_achievements: function(location, achievements){
        var place = DisplayHTML.get_element(location);

        var toprow = document.createElement(`div`);
        toprow.classList.add(`opposite-sides`);
        // Header
        var header = document.createElement(`div`);
        header.classList.add(`achievement-header`);
        var title = document.createElement(`h2`);
        var complete = achievements.filter((a) => {return a.has}).length;
        title.innerText = `${achievement_text.title}  (${complete} / ${achievements.length})`;
        header.append(title);
        toprow.append(header);
        
        var reset = document.createElement(`button`);
        reset.classList.add(`achievement-button`);
        var set_reset_button = () => {
            reset.innerText = achievement_text.reset;
            reset.classList.add(`achievement-reset`);
            reset.classList.remove(`achievement-confirm-reset`);
            reset.onclick = set_confirm_reset_button;
        }
        var set_confirm_reset_button = () => {
            reset.innerText = achievement_text.confirm_reset;
            reset.classList.add(`achievement-confirm-reset`);
            reset.classList.remove(`achievement-reset`);
            reset.onclick = reset_achievements;
            setTimeout(() => {set_reset_button();}, 4000);
        }
        set_reset_button();
        toprow.append(reset);
        place.append(toprow);

        for(var a of achievements){
            var div = document.createElement(`div`);
            div.classList.add(`achievement-box`);
            if(a.has){
                div.classList.add(`achievement-box-unlocked`);
            }

            // Achievement image
            var img_box = document.createElement(`div`);
            img_box.classList.add(`achievement-img-box`);
            div.append(img_box);

            var img_name = a.has ? a.image : `${IMG_FOLDER.other}locked.png`;
            var img = document.createElement(`img`);
            img.src = `${IMG_FOLDER.src}${img_name}`;
            img.alt = a.has? `unlocked` : `locked`;
            img.title = img.alt;
            img_box.append(img);

            // Achievement description
            var text_box = document.createElement(`div`);
            text_box.classList.add(`achievement-text-box`);
            div.append(text_box);

            if(a.has){
                img_box.classList.add(`achievement-unlocked-image`);
                text_box.classList.add(`achievement-unlocked-text`);
            }
            else{
                text_box.classList.add(`achievement-locked-text`);
            }

            var h3 = document.createElement(`h3`);
            h3.innerText = `${a.name}:`
            text_box.append(h3);

            var p = document.createElement(`p`);
            p.innerText = a.description;
            text_box.append(p);

            // Unlocks
            var unlocks = document.createElement(`div`);
            unlocks.classList.add(`achievement-dropdown`);

            // New Boons
            if(a.boons!== undefined && a.boons.length > 0){
                var unlock_boons_header = document.createElement(`h3`);
                unlock_boons_header.innerText = `--- ${achievement_text.unlocks_boon} ---`
                unlocks.append(unlock_boons_header);
                
                for(var boon of a.boons){
                    boon = boon();
                    img = document.createElement(`img`);
                    img.src = `${IMG_FOLDER.src}${boon.pic}`;
                    img.alt = boon.name;
                    img.title = boon.name;
                    unlocks.append(img);
                }
            }

            // New cards
            if(a.cards !== undefined && a.cards.length > 0){
                var unlock_cards_header = document.createElement(`h3`);
                unlock_cards_header.innerText = `--- ${achievement_text.unlocks_cards} ---`;
                unlocks.append(unlock_cards_header);

                for(var card of a.cards){
                    card = card();
                    img = document.createElement(`img`);
                    img.src = `${IMG_FOLDER.src}${card.pic}`;
                    img.alt = card.name;
                    img.title = card.name;
                    unlocks.append(img);
                }
            }

            div.append(unlocks);
            place.append(div);
        }
    },
    stop_space_scrolling: function(){
        window.addEventListener(`keydown`, (e) => {
            if (e.key === ` ` && e.target === document.body) {
              e.preventDefault();
            }
        });
    },
    set_local_storage(key, data){
        window.localStorage.setItem(key, data);
    },
    get_local_storage(key){
        return window.localStorage.getItem(key);
    },
    make_anchor(destination, text){
        var a = document.createElement(`a`);
        a.href = destination;
        a.innerText = text;
        return a;
    },
    toggle_visibility(destination, is_visible){
        var element = DisplayHTML.get_element(destination);
        if(!is_visible){
            element.classList.add(`hidden-section`);
        }
        else{
            element.classList.remove(`hidden-section`);
        }
    },
    journal_card_section(destination, header, cards){
        var place = DisplayHTML.get_element(destination);

        var box = document.createElement(`fieldset`);
        var legend = document.createElement(`legend`);
        var table = document.createElement(`table`);

        box.classList.add(`shop-section-box`);
        box.classList.add(`journal-card-box`);
        legend.innerText = header;
        var table_id = `${destination} ${header} table`;
        table.id = table_id;

        place.append(box);
        box.append(legend);
        box.append(table);
        
        for(var i = 0; i < Math.ceil(cards.length / JOURNAL_DISPLAY_WIDTH); ++i){
            var slice_start = i * JOURNAL_DISPLAY_WIDTH;
            var slice = cards.slice(slice_start, slice_start + JOURNAL_DISPLAY_WIDTH);
            display.add_tb_row(table_id, slice, CARD_SCALE);
        }
    },
    create_fixed_box(destination, id){
        var place = DisplayHTML.get_element(destination);
        var box = document.createElement(`p`);
        box.id = id;
        box.classList.add(`no-margins`);
        box.classList.add(`scrollable-text`);
        box.classList.add(`journal-info`);
        place.append(box);
    },
    journal_boon_section(destination, header, boons){
        var place = DisplayHTML.get_element(destination);

        var box = document.createElement(`fieldset`);
        var legend = document.createElement(`legend`);
        var table = document.createElement(`table`);

        box.classList.add(`shop-section-box`);
        box.classList.add(`journal-card-box`);
        legend.innerText = header;
        var table_id = `${destination} ${header} table`;
        table.id = table_id;

        place.append(box);
        box.append(legend);
        box.append(table);
        
        for(var i = 0; i < Math.ceil(boons.length / JOURNAL_DISPLAY_WIDTH); ++i){
            var slice_start = i * JOURNAL_DISPLAY_WIDTH;
            var slice = boons.slice(slice_start, slice_start + JOURNAL_DISPLAY_WIDTH);
            display.add_tb_row(table_id, slice, CARD_SCALE);
        }
    },
    journal_area_section(destination, info){
        var place = DisplayHTML.get_element(destination);
        var box = document.createElement(`div`);
        box.classList.add(`journal-area-box`);
        place.append(box);
        var count_fun = (pic, alt, count) => {
            var div = document.createElement(`div`);
            div.classList.add(`journal-area-counter`);
            var img = document.createElement(`img`);
            img.src = `${IMG_FOLDER.src}${pic}`;
            img.alt = alt;
            img.title = alt;
            div.title = alt;
            var text = document.createElement(`p`);
            text.innerText = count;
            div.append(img);
            div.append(text);
            return div;
        }
        var header = document.createElement(`div`);
        header.classList.add(`journal-area-box-header`);
        if(info.visit_count === undefined && info.clear_count === undefined){
            header.classList.add(`centered`);
        }
        if(info.visit_count !== undefined){
            header.append(count_fun(
                `${IMG_FOLDER.tiles}stairs.png`, 
                journal_area_messages.visited, 
                info.visit_count
            ));
        }
        var h = document.createElement(`h2`);
        h.innerText = info.name;
        header.append(h);
        if(info.clear_count !== undefined){
            header.append(count_fun(
                `${IMG_FOLDER.tiles}lock.png`, 
                journal_area_messages.cleared, 
                info.clear_count
            ));
        }
        box.append(header);
        
        var boss = document.createElement(`table`);
        boss.classList.add(`journal-area-boss`);
        var boss_id = `${destination} ${info.true_name} boss`;
        boss.id = boss_id;
        box.append(boss);
        display.add_tb_row(boss_id, [info.boss], JOURNAL_BOSS_SCALE);

        var tiles = document.createElement(`table`);
        tiles.classList.add(`journal-area-tiles`);
        var tiles_id = `${destination} ${info.true_name} tiles`;
        tiles.id = tiles_id;
        box.append(tiles);
        for(var i = 0; i < Math.ceil(info.tiles.length / JOURNAL_AREA_WIDTH); ++i){
            var slice_start = i * JOURNAL_AREA_WIDTH;
            var slice = info.tiles.slice(slice_start, slice_start + JOURNAL_AREA_WIDTH);
            display.add_tb_row(tiles_id, slice, JOURNAL_TILE_SCALE);
        }
    },
    label_image(destination, label){
        var place = DisplayHTML.get_element(destination);
        place.title = label;
        place.alt = label;
    },
    make_stat_pair(destination, pic, stat, label){
        var place = DisplayHTML.get_element(destination);

        var div = document.createElement(`div`);
        div.classList.add(`stat-pair`);
        div.title = label;

        var img = document.createElement(`img`);
        img.src = pic;
        img.alt = label;

        var p = document.createElement(`p`);
        p.classList.add(`no-margins`);
        p.innerText = stat;

        div.append(img);
        div.append(p);
        place.append(div);
    },

    // Non Required helper functions.
    get_transformation: function(to_display){
        var transformation = ``;
        if(to_display.rotate !== undefined){
            transformation += `rotate(${to_display.rotate}deg) `;
        }
        if(to_display.flip){
            transformation += `scaleX(-1) `;
        }
        return transformation;
    },
    get_element: function(location, type = undefined){
        var element = document.getElementById(location);
        if(element === null){
            throw new Error(ERRORS.value_not_found);
        }
        if(type !== undefined && !(element instanceof type)){
            throw new Error(ERRORS.invalid_type);
        }
        return element
    }
}

// Set up the display library and the onkeydown function.
const display = get_display(MARKUP_LANGUAGE);

const NBS = `\u00a0`; // non-breaking space used for inserting multiple html spaces.
function update_achievements(){
    var achievements = GS.data.achievements.all();
    display.remove_children(UIIDS.achievement_list);
    display.show_achievements(UIIDS.achievement_list, achievements);
}

function reset_achievements(){
    GS.data.reset_achievements();
    update_achievements();
}
function controls_chest_section(){
    var controls = GS.data.controls.get();
    display.add_controls_header(UIIDS.chest_controls, CONTROLS_TEXT.chest.header, edit_chest_controls);
    display.control_box(UIIDS.chest_controls, controls.chest.choose.slice(0, 3), CONTROLS_TEXT.chest.choose);
    display.control_box(UIIDS.chest_controls, controls.chest.confirm, CONTROLS_TEXT.chest.confirm);
    display.control_box(UIIDS.chest_controls, controls.chest.reject, CONTROLS_TEXT.chest.reject);
}

function edit_chest_controls(controls){
    display.add_edit_controls_header(UIIDS.chest_controls, CONTROLS_TEXT.chest.header, controls_chest_section, controls);
    display.control_edit_box(UIIDS.chest_controls, controls.chest.choose, CONTROLS_TEXT.chest.choose);
    display.control_edit_box(UIIDS.chest_controls, controls.chest.confirm, CONTROLS_TEXT.chest.confirm);
    display.control_edit_box(UIIDS.chest_controls, controls.chest.reject, CONTROLS_TEXT.chest.reject);
}
function setup_controls_page(){
    display.remove_children(UIIDS.stage_controls);
    controls_stage_section();
    display.remove_children(UIIDS.shop_controls);
    controls_shop_section();
    display.remove_children(UIIDS.chest_controls);
    controls_chest_section();
}
function controls_shop_section(){
    var controls = GS.data.controls.get();
    display.add_controls_header(UIIDS.shop_controls, CONTROLS_TEXT.shop.header, edit_shop_controls);
    display.control_box(UIIDS.shop_controls, controls.shop.add.slice(0, 3), CONTROLS_TEXT.shop.add);
    display.control_box(UIIDS.shop_controls, controls.shop.remove.slice(0, 3), CONTROLS_TEXT.shop.remove);
    display.control_box(UIIDS.shop_controls, controls.shop.confirm, CONTROLS_TEXT.shop.confirm);
}

function edit_shop_controls(controls){
    display.add_edit_controls_header(UIIDS.shop_controls, CONTROLS_TEXT.shop.header, controls_shop_section, controls);
    display.control_edit_box(UIIDS.shop_controls, controls.shop.add, CONTROLS_TEXT.shop.add);
    display.control_edit_box(UIIDS.shop_controls, controls.shop.remove, CONTROLS_TEXT.shop.remove);
    display.control_edit_box(UIIDS.shop_controls, controls.shop.confirm, CONTROLS_TEXT.shop.confirm);
}
function controls_stage_section(){
    var controls = GS.data.controls.get();
    display.add_controls_header(UIIDS.stage_controls, CONTROLS_TEXT.stage.header, edit_stage_controls);
    display.control_box(UIIDS.stage_controls, controls.stage.card.slice(0, 3), CONTROLS_TEXT.stage.card);
    display.control_box(UIIDS.stage_controls, controls.stage.direction, CONTROLS_TEXT.stage.direction);
    display.control_box(UIIDS.stage_controls, controls.toggle.alt, CONTROLS_TEXT.stage.toggle);
    display.control_box(UIIDS.stage_controls, controls.stage.info, CONTROLS_TEXT.stage.info);
    display.control_box(UIIDS.stage_controls, controls.stage.retry, CONTROLS_TEXT.stage.retry);
}

function edit_stage_controls(controls){
    display.add_edit_controls_header(UIIDS.stage_controls, CONTROLS_TEXT.stage.header, controls_stage_section, controls);
    display.control_edit_box(UIIDS.stage_controls, controls.stage.card, CONTROLS_TEXT.stage.card);
    display.control_edit_box(UIIDS.stage_controls, controls.stage.direction, CONTROLS_TEXT.stage.direction);
    display.control_edit_box(UIIDS.stage_controls, controls.toggle.alt, CONTROLS_TEXT.stage.toggle);
    display.control_edit_box(UIIDS.stage_controls, controls.stage.info, CONTROLS_TEXT.stage.info);
    display.control_edit_box(UIIDS.stage_controls, controls.stage.retry, CONTROLS_TEXT.stage.retry);
}
function display_deck_to_duplicate(){
    display.display_message(UIIDS.deck_select_message, boon_messages.duplicate);
    var finish = (card, deck) => {
        deck.add(copy_card(card));
        GAME_SCREEN_DIVISIONS.swap(UIIDS.stage);
    }
    var selector = new DeckSelector(GS.deck, finish);
    refresh_deck_select_screen(selector);
}
function refresh_deck_select_screen(selector){
    var cards = selector.get_display_info();
    cards.map((card) => {
        var prev_on_click = card.on_click;
        card.on_click = () => {
            prev_on_click();
            display.display_message(UIIDS.deck_select_card_info, explain_card_w_stats(card.card));
            refresh_deck_select_screen(selector);
        }
        return card;
    });
    display.remove_children(UIIDS.deck_select_table);
    for(var i = 0; i < Math.ceil(cards.length / DECK_DISPLAY_WIDTH); ++i){
        var slice_start = i * DECK_DISPLAY_WIDTH;
        var slice = cards.slice(slice_start, slice_start + DECK_DISPLAY_WIDTH);
        display.add_tb_row(UIIDS.deck_select_table, slice, CARD_SCALE);
    }
    display.set_button(
        UIIDS.deck_select_confirm, 
        shop_text.confirm, 
        () => {selector.confirm();}, 
        selector.check_valid()
    );
}
function display_deck_to_remove(remaining){
    var message = `${boon_messages.clean_mind[0]}${remaining}${boon_messages.clean_mind[1]}`;
    display.display_message(UIIDS.deck_select_message, message);
    var finish = (card, deck) => {
        deck.remove(card.id);
        if(remaining > 1){
            display_deck_to_remove(remaining - 1);
        }
        else{
            GS.deck.deal();
            GS.refresh_deck_display();
            GAME_SCREEN_DIVISIONS.swap(UIIDS.stage);
        }
    }
    var selector = new DeckSelector(GS.deck, finish);
    refresh_deck_select_screen(selector);
}
function label_images(){
    display.label_image(UIIDS.remaining_deck, stat_image_labels.deck);
}
function display_entire_deck(deck){
    // Display section header.
    var min_deck_size = deck.deck_min();
    display.display_message(UIIDS.current_deck, `${shop_text.current}${min_deck_size}):`);
    // Display deck with limited cards per line.
    var decklist = deck.get_deck_info();
    var card_explanation = (card) => {
        return () => {
            display.display_message(UIIDS.shop_message, explain_card(card));
        }
    };
    for(var card of decklist){
            card.on_click = card_explanation(card);
    }
    for(var i = 0; i < Math.ceil(decklist.length / DECK_DISPLAY_WIDTH); ++i){
        var row = decklist.slice(i * DECK_DISPLAY_WIDTH, (i + 1) * DECK_DISPLAY_WIDTH);
        display.add_tb_row(UIIDS.display_deck, row, CARD_SCALE);
    }
}
function refresh_shop_display(shop){
    var refresh = (f, card) => {
        return () => {
            f();
            display.display_message(UIIDS.shop_message, explain_card_w_stats(card));
            refresh_shop_display(shop);
        }
    };
    display.remove_children(UIIDS.add_card);
    display.remove_children(UIIDS.remove_card);

    var add_row = shop.get_add_row();
    for(var a of add_row){
        if(a.on_click !== undefined){
            a.on_click = refresh(a.on_click, a.card);
        }
        else{
            a.on_click = () => {display.display_message(UIIDS.shop_message, shop_text.add)};
        }
    }
    display.add_tb_row(UIIDS.add_card, add_row, CARD_SCALE);

    var remove_row = shop.get_remove_row();
    for(var r of remove_row){
        if(r.on_click !== undefined){
            r.on_click = refresh(r.on_click, r.card);
        }
        else if(r.name === card_names.symbol_remove_card){
            r.on_click = () => {display.display_message(UIIDS.shop_message, shop_text.remove)};
        }
        else{
            r.on_click = () => {display.display_message(UIIDS.shop_message, shop_text.min)};
        }
    }
    display.add_tb_row(UIIDS.remove_card, remove_row, CARD_SCALE);
    
    var confirm = () => {
        if(shop.is_valid_selection()){
            shop.confirm();
            GS.new_floor();
        }
        else{
            display.display_message(UIIDS.shop_message, shop_text.invalid);
        }
    }
    display.set_button(UIIDS.shop_confirm, shop_text.confirm, confirm, shop.is_valid_selection());
}
function display_boons(boon_list){
    // Updates the list of boons they have.
    display.remove_children(UIIDS.boon_list_table);
    var gained = boon_list.get_gained();
    display.add_tb_row(UIIDS.boon_list_table, gained, SMALL_CARD_SCALE);

    // Updates the list of used up boons.
    display.remove_children(UIIDS.removed_boon_table);
    var lost = boon_list.get_lost();
    display.add_tb_row(UIIDS.removed_boon_table, lost, SMALL_CARD_SCALE);
}
/**
 * Displays the library to it's proper location.
 */
function refresh_deck_order_display(deck){
    var library = deck.get_library_info();
    display.remove_children(UIIDS.deck_order_table);
    display.add_tb_row(UIIDS.deck_order_table, [future_sight(), ...library], SMALL_CARD_SCALE);
}
/**
 * Displays the discard pile to it's proper location.
 */
function refresh_discard_display(deck){
    var discard = deck.get_discard_info();
    display.remove_children(UIIDS.discard_pile_table);
    display.add_tb_row(UIIDS.discard_pile_table, discard, SMALL_CARD_SCALE);
}
/**
 * Displays the full deck to it's proper location.
 */
function refresh_full_deck_display(deck){
    var full = deck.get_deck_info();
    display.remove_children(UIIDS.full_deck_table);
    display.add_tb_row(UIIDS.full_deck_table, full, SMALL_CARD_SCALE);
}
/**
 * Function to create and add the buttons for the sidebar.
 */
function create_sidebar(){
    var location = UIIDS.sidebar_header;
    var swap_visibility = function(id_list, id){
        return function(){
            id_list.swap(id);
        }
    }
    display.remove_children(location);
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.text_log, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.text_log));
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.discard_pile, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.discard_pile));
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.initiative, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.initiative));
    SIDEBAR_DIVISIONS.swap(UIIDS.text_log);
}
function update_initiative(map){
    var info = map.get_initiative().map(e => {
        let str = `${e.name}\n` + hp_description(e);
        let on_click = function(){
            display.click(`${UIIDS.map_display} ${e.location.y} ${e.location.x}`);
        }
        return {
            pic: e.pic,
            rotate: e.rotate,
            flip: e.flip,
            stun: e.stun !== undefined && e.stun > 0,
            name: e.name,
            str,
            on_click,
        }
    });
    display.remove_children(UIIDS.initiative);
    display.create_initiative(UIIDS.initiative, info, INITIATIVE_SCALE);
}
/**
 * Function to give a message to the user.
 * @param {string} msg message text.
 */
function say(msg){
    display.display_message(UIIDS.display_message, msg);
}

function say_record(msg, type = record_types.normal){
    say(msg);
    GS.record_message(msg, type);
}
function display_victory(){
    display.toggle_visibility(UIIDS.hand_box, false);
    display.toggle_visibility(UIIDS.move_box, false);
    display.toggle_visibility(UIIDS.retry_box, false);
    display.remove_children(UIIDS.map_display);
    display.add_tb_row(UIIDS.map_display, [{
        name: achievement_names.victory,
        //foreground: [`${image_folder.other}border.png`],
        pic: `${IMG_FOLDER.achievements}victory.png`,
        on_click: () => {
            display.toggle_visibility(UIIDS.hand_box, true);
            display.toggle_visibility(UIIDS.move_box, true);
            display.toggle_visibility(UIIDS.retry_box, true);
            player_hand_greyed(false);
            GS.setup();
        },
    }], VICTORY_IMG_SCALE);
}
/**
 * Displays the hand to it's proper location.
 */
function refresh_hand_display(deck){
    // Updates the hand.
    var card_row = deck.get_hand_info();
    display.remove_children(UIIDS.hand_display);
    display.add_tb_row(UIIDS.hand_display, card_row, CARD_SCALE);

    // Shows how many cards are left in your deck.
    var remaining = deck.get_deck_count();
    display.display_message(UIIDS.deck_count, `${remaining}`);

    // Makes sure the card info button shows that no card is selected.
    var explain_blank_moves = function(){
        say(gameplay_text.select_card);
    }
    display.add_on_click(UIIDS.move_info, explain_blank_moves);
}

function player_hand_greyed(is_greyed){
    var toggle = is_greyed ? display.add_class : display.remove_class;
    toggle(UIIDS.hand_display, `greyed-out`);
}
function display_move_buttons(card, hand_position){
    display.select(UIIDS.hand_display, 0, hand_position);
    display.remove_children(UIIDS.move_buttons);
    var button_data = card.options.show_buttons(hand_position);
    for(let row of button_data){
        let button_row = row.map(button => {return {
            description: button.description,
            on_click: function(){
                GS.data.controls.alternate_is_pressed ? button.alt_click() : button.on_click();
            }
        }});
        display.add_button_row(UIIDS.move_buttons, button_row);
    }
    var explanation = move_types.alt + `\n` + explain_card(card);
    display.add_on_click(UIIDS.move_info, function(){say(explanation)});
}
function telegraph_repetition_boon(repeat){
    display.remove_class(UIIDS.hand_box, `telegraph-repetition`);
    display.remove_class(UIIDS.move_box, `telegraph-repetition`);
    display.remove_class(UIIDS.hand_box, `no-repetition`);
    display.remove_class(UIIDS.move_box, `no-repetition`);
    var class_name = repeat > 1 ? `telegraph-repetition` : `no-repetition`;
    display.add_class(UIIDS.hand_box, class_name);
    display.add_class(UIIDS.move_box, class_name);
}
/**
 * Function to display the player's current and max health.
 * @param {Tile} player The player to get health from.
 * @param {number} scale The size of the display images.
 */
function display_health(player, scale){
    if(player.health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var health = [];
    for(var i = 0; i < player.health; ++i){
        health.push({
            pic: `${IMG_FOLDER.other}heart.png`, 
            name: `heart`
        });
    }
    if(player.max_health !== undefined){
        for(var i = 0; i < (player.max_health - player.health); ++i){
            health.push({
                pic: `${IMG_FOLDER.other}heart_broken.png`, 
                name: `broken heart`
            });
        }
    }
    display.add_tb_row(UIIDS.health_display, health, scale);
}
function display_map(map){
    // Updates the GameMap display.
    display.remove_children(UIIDS.map_display);
    var grid = map.display();
    for(var row of grid){
        display.add_tb_row(UIIDS.map_display, row, TILE_SCALE);
    }
    map.clear_telegraphs();
    // Updates the health bar display.
    display.remove_children(UIIDS.health_display);
    display_health(map.get_player(), TILE_SCALE);
    // Updates the initiative tracker display.
    update_initiative(map);
}
function refresh_stage_stats(stats, location){
    display.remove_children(location);
    display.make_stat_pair(
        location,
        `${IMG_FOLDER.src}${IMG_FOLDER.stats}stairs.png`, 
        stats.floor, 
        stat_image_labels.floor
    );
    display.make_stat_pair(
        location,
        `${IMG_FOLDER.src}${IMG_FOLDER.stats}stopwatch.png`, 
        stats.turn, 
        stat_image_labels.turns
    );
    display.make_stat_pair(
        location,
        `${IMG_FOLDER.src}${IMG_FOLDER.stats}kills.png`, 
        stats.kills, 
        stat_image_labels.kills
    );
    display.make_stat_pair(
        location,
        `${IMG_FOLDER.src}${IMG_FOLDER.stats}damage_dealt.png`, 
        stats.dealt, 
        stat_image_labels.dealt
    );
    display.make_stat_pair(
        location,
        `${IMG_FOLDER.src}${IMG_FOLDER.stats}half_heart.png`, 
        stats.taken, 
        stat_image_labels.taken
    );
    display.make_stat_pair(
        location,
        `${IMG_FOLDER.src}${IMG_FOLDER.stats}mini_chest.png`, 
        stats.chests, 
        stat_image_labels.chests
    );
    display.make_stat_pair(
        location,
        `${IMG_FOLDER.src}${IMG_FOLDER.stats}mini_broken_chest.png`, 
        stats.destroyed, 
        stat_image_labels.destroyed
    );
}
function refresh_other_stats(stats, location){
    display.remove_children(location);
    display.make_stat_pair(
        location,
        `${IMG_FOLDER.src}${IMG_FOLDER.stats}stairs.png`, 
        stats.floor, 
        stat_image_labels.floor
    );
    display.make_stat_pair(
        location,
        `${IMG_FOLDER.src}${IMG_FOLDER.stats}stopwatch.png`, 
        stats.turn, 
        stat_image_labels.turns
    );
    display.make_stat_pair(
        location,
        `${IMG_FOLDER.src}${IMG_FOLDER.stats}mini_heart.png`, 
        stats.health, 
        stat_image_labels.health
    );
    display.make_stat_pair(
        location,
        `${IMG_FOLDER.src}${IMG_FOLDER.stats}card_added.png`, 
        stats.added, 
        stat_image_labels.added
    );
    display.make_stat_pair(
        location,
        `${IMG_FOLDER.src}${IMG_FOLDER.stats}card_removed.png`, 
        stats.removed, 
        stat_image_labels.removed
    );
}
/**
 * Function to create a dropdown menu capable of switching between the game and guide screens.
 * @param {string} location Where to create it.
 */
function create_main_dropdown(location){
    var options = [
        {
            label: screen_names.gameplay,
            on_change: () => {DISPLAY_DIVISIONS.swap(UIIDS.game_screen)}
        }, 
        {
            label: screen_names.guide,
            on_change: () => {DISPLAY_DIVISIONS.swap(UIIDS.guide)}
        },
        {
            label: screen_names.achievements,
            on_change: () => {
                update_achievements();
                DISPLAY_DIVISIONS.swap(UIIDS.achievements);
            }
        },
        {
            label: screen_names.journal,
            on_change: () => {
                update_journal();
                DISPLAY_DIVISIONS.swap(UIIDS.journal);
            }
        },
        {
            label: screen_names.controls,
            on_change: () => {
                setup_controls_page();
                DISPLAY_DIVISIONS.swap(UIIDS.controls);
            }
        },

    ];
    display.create_dropdown(location, options);
}
/**
 * Function to get an array of buttons with the keys used for controls as the value to use when displaying the guide.
 * @returns {HTMLElement[]} The array of buttons.
 */
function get_control_symbols(){
    var current_controls = GS.data.controls.get();
    var button_symbols = [...current_controls.stage.card, ...current_controls.stage.direction];
    var buttons = [];
    for(var symbol of button_symbols){
        buttons.push(display.create_button(symbol, `${symbol} key`));
    }
    return buttons;
}
/**
 * Function to display the guide.
 */
function display_guide(){
    var section_location = UIIDS.guide_box;
    var navbar_location = UIIDS.guide_navbar;

    // Create the image arrays for the sections with images.
    var cards_symbol_arr = make_guidebook_images(CARD_SYMBOLS);
    var confusion_inline_arr = make_guidebook_images(CONFUSION_CARDS.map(card => {
        card = card();
        return {
            src: card.pic,
            name: card.name,
            x: 5,
            y: 5
        }
    }));
    var confusion_text = [
        ...GUIDE_TEXT.confusion, ...CONFUSION_CARDS.map((card, i) => {
        // Adds the space for confusion card images.
        if(i % 4 !== 3){
            return NBS;
        }
        return `\n`;
    })];
    
    var about_links = [
        display.make_anchor(about_page_text.git_link, about_page_text.git_text)
    ];

    // Create guidebook text sections.
    var basics_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.basics, GUIDE_TEXT.basics, []);
    var cards_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.cards, GUIDE_TEXT.cards, cards_symbol_arr);
    var enemies_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.enemies, GUIDE_TEXT.enemies, []);
    var shop_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.shop, GUIDE_TEXT.shop, []);
    var bosses_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.bosses, GUIDE_TEXT.bosses, []);
    var chests_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.chests, GUIDE_TEXT.chests, []);
    var sidebar_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.sidebar, GUIDE_TEXT.sidebar, []);
    var confusion_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.confusion, confusion_text, confusion_inline_arr);
    var about_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.about, GUIDE_TEXT.about, about_links);

    var section_id_list = [
        basics_section, 
        cards_section, 
        enemies_section, 
        shop_section, 
        bosses_section, 
        chests_section, 
        sidebar_section,
        confusion_section,
        about_section
    ];

    var swap_visibility = function(id_list, id){
        return function(){
            display.swap_screen(id_list, id);
        }
    }

    // Create guidebook navbar.
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.basics, swap_visibility(section_id_list, basics_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.cards, swap_visibility(section_id_list, cards_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.enemies, swap_visibility(section_id_list, enemies_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.shop, swap_visibility(section_id_list, shop_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.bosses, swap_visibility(section_id_list, bosses_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.chests, swap_visibility(section_id_list, chests_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.sidebar, swap_visibility(section_id_list, sidebar_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.confusion, swap_visibility(section_id_list, confusion_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.about, swap_visibility(section_id_list, about_section));

    display.swap_screen(section_id_list, basics_section);
}
/**
 * Function to get an array of images for the card symbols to use when displaying the guide..
 * @returns {HTMLElement[]} The array of images.
 */
function make_guidebook_images(arr){
    var images = [];
    for(var img of arr){
        images.push(display.create_image(img.src, `${img.name} symbol`, new Point(img.x, img.y).times(CARD_SYMBOL_SCALE)));
    }
    return images;
}
function assorted_tiles_display_info(){
    var area = generate_ruins_area();
    return {
        name: area_names.assorted,
        background: area.background,
        boss: player_tile,
        tiles: [
            armored_chest_tile,
            chest_tile,
            exit_tile,
            final_exit_tile,
            lock_tile,
        ],
    }
}
function basement_display_info(){
    var area = generate_basement_area();
    return {
        name: area.name,
        background: area.background,
        boss: spider_queen_tile,
        tiles: [
            ...area.enemy_list, 
            wall_tile, 
            damaged_wall_tile
        ],
    }
}
function court_display_info(){
    var area = generate_court_area();
    return {
        name: area.name,
        background: area.background,
        boss: lord_of_shadow_and_flame_tile,
        tiles: [
            ...area.enemy_list, 
            claustropede_1_tile,
            starcaller_tile, 
            moon_rock_tile, 
            shatter_sphere_d_tile, 
            shatter_sphere_o_tile,
            raging_fire_tile,
            carrion_flies_tile
        ],
    }
}
function crypt_display_info(){
    var area = generate_crypt_area();
    return {
        name: area.name,
        background: area.background,
        boss: lich_tile,
        tiles: [
            ...area.enemy_list, 
            coffin_tile
        ],
    }
}
function forest_display_info(){
    var area = generate_forest_area();
    return {
        name: area.name,
        background: area.background,
        boss: forest_heart_tile,
        tiles: [
            ...area.enemy_list, 
            enticing_fruit_tree_tile,
            thorn_bramble_tile,
        ],
    }
}
function library_display_info(){
    var area = generate_library_area();
    return {
        name: area.name,
        background: area.background,
        boss: arcane_sentry_tile,
        tiles: [
            ...area.enemy_list, 
            bookshelf_tile,
            fireball_tile,
        ],
    }
}
function magma_display_info(){
    var area = generate_magma_area();
    return {
        name: area.name,
        background: area.background,
        boss: young_dragon_tile,
        tiles: [
            ...area.enemy_list, 
            animated_boulder_tile, 
            repulsor_tile, 
            lava_pool_tile, 
            magmatic_boulder_tile,
            smoldering_ashes_tile,
            raging_fire_tile,
            fireball_tile,
        ],
    }
}
function ruins_display_info(){
    var area = generate_ruins_area();
    return {
        name: area.name,
        background: area.background,
        boss: velociphile_tile,
        tiles: [
            ...area.enemy_list
        ],
    }
}
function sewers_display_info(){
    var area = generate_sewers_area();
    return {
        name: area.name,
        background: area.background,
        boss: two_headed_serpent_tile,
        tiles: [
            ...area.enemy_list, 
            corrosive_slime_tile, 
            sewer_grate_tile,
            small_d_porcuslime_tile,
            small_o_porcuslime_tile,
        ],
    }
}
function update_journal_areas(){
    for(var i = 0; i < 6; ++i){
        display.remove_children(`${UIIDS.journal_areas}${i}`);
    }
    show_area(assorted_tiles_display_info(), 0, true);
    show_area(ruins_display_info(), 1);
    show_area(basement_display_info(), 2);
    show_area(sewers_display_info(), 2);
    show_area(crypt_display_info(), 3);
    show_area(magma_display_info(), 3);
    show_area(forest_display_info(), 4);
    show_area(library_display_info(), 4);
    show_area(court_display_info(), 5);
}

function show_area(info, depth, force_visited = false){
    var visited = force_visited || GS.data.areas.has(info.name);
    if(visited && !force_visited){
        var node = GS.data.areas.get_node(info.name);
        info.visit_count = node.data.visited;
        info.clear_count = node.data.cleared;
    }
    info.true_name = info.name;
    if(!visited){
        info.name = area_names.unknown;
    }
    var check_encountered = (t) => {
        t = t();
        if(!visited){
            return {
                name: boon_names.locked,
                pic: `${IMG_FOLDER.other}locked.png`,
                background: [info.background],
                description: boon_descriptions.locked,
            }
        }
        if(GS.data.tiles.has(t.name)){
            return {
                name: t.name,
                true_name: t.name,
                pic: t.display_pic ? t.display_pic : t.pic,
                background: [info.background],
                description: t.description,
            }
        }
        return {
            name: boon_names.not_encountered,
            pic: `${IMG_FOLDER.other}not_encountered.png`,
            background: [info.background],
            description: boon_descriptions.not_encountered,
        }
    };
    info.boss = check_encountered(info.boss);
    info.tiles = info.tiles.map(check_encountered).sort((a, b) => {
        if(a.true_name < b.true_name){
            return -1;
        }
        if(a.true_name > b.true_name){
            return 1;
        }
        return 0;
    });
    display.journal_area_section(`${UIIDS.journal_areas}${depth}`, info);
}
function update_journal_boons(){
    display.remove_children(UIIDS.journal_boons);
    display.create_fixed_box(UIIDS.journal_boons, UIIDS.journal_boon_info);
    var boons = boons_encountered(BOON_LIST, GS.data.boons);
    display.journal_boon_section(UIIDS.journal_boons, boon_messages.section_header, boons);
}
function boons_encountered(boons, encountered){
    var locked = get_locked_boons();
    return boons.map((b) => {
        var boon = b();
        if(locked.find((l) => {return l().name === boon.name;})){
            boon = symbol_locked_boon();
        }
        else if(!encountered.has(boon.name)){
            boon = symbol_not_encountered_boon();
        }
        else{
            boon.description = explain_boon_with_stats(boon);
        }
        boon.on_click = () => {
            display.display_message(UIIDS.journal_boon_info, boon.description);
        }
        return boon;
    });
}
function update_journal_cards(){
    display.remove_children(UIIDS.journal_cards);
    display.create_fixed_box(UIIDS.journal_cards, UIIDS.journal_card_info);
    display_basic_cards();
    display_common_cards();
    display_achievement_cards();
    display_boon_cards();
    display_confusion_cards();
    display_boss_cards();
}

function display_basic_cards(){
    var cards = cards_encountered(BASIC_CARDS, GS.data.cards);
    display.journal_card_section(UIIDS.journal_cards, journal_card_headers.basic, cards);
}
function display_common_cards(){
    var cards = cards_encountered(COMMON_CARDS, GS.data.cards);
    display.journal_card_section(UIIDS.journal_cards, journal_card_headers.common, cards);
}
function display_achievement_cards(){
    var cards = cards_locked(get_all_achievement_cards(), get_locked_achievement_cards());
    var cards = cards_encountered(cards, GS.data.cards);
    display.journal_card_section(UIIDS.journal_cards, journal_card_headers.achievement, cards);
}
function display_boon_cards(){
    var cards = cards_encountered(BOON_CARDS, GS.data.cards);
    display.journal_card_section(UIIDS.journal_cards, journal_card_headers.boon, cards);
}
function display_confusion_cards(){
    var cards = cards_encountered(CONFUSION_CARDS, GS.data.cards);
    display.journal_card_section(UIIDS.journal_cards, journal_card_headers.confusion, cards);
}
function display_boss_cards(){
    var cards = cards_encountered(get_boss_cards(), GS.data.cards);
    display.journal_card_section(UIIDS.journal_cards, journal_card_headers.boss, cards);
}

function cards_encountered(cards, encountered){
    return cards.map((c) => {
        var card = c();
        if(card.name === card_names.symbol_locked){
            card.on_click = () => {
                display.display_message(UIIDS.journal_card_info, move_types.locked);
            }
            return card;
        }
        if(encountered.has(card.name)){
            card.on_click = () => {
                display.display_message(UIIDS.journal_card_info, explain_card_w_stats(card));
            }
            return card;
        }
        var card = symbol_not_encountered_card();
        card.on_click = () => {
            display.display_message(UIIDS.journal_card_info, move_types.not_found);
        }
        return card;
    });
}
function cards_locked(cards, locked){
    return cards.map((c) => {
        var card = c();
        if(locked.find((l) => {
            return l().name === card.name;
        })){
            return symbol_locked_card;
        }
        return c;
    });
}
function update_journal(){
    update_journal_cards();
    update_journal_boons();
    update_journal_areas();
}

function setup_journal_navbar(){
    var id = UIIDS.journal_navbar;

    var section_id_list = [
        UIIDS.journal_cards,
        UIIDS.journal_boons,
        UIIDS.journal_areas,
    ];

    var swap_visibility = function(id_list, id){
        return function(){
            display.swap_screen(id_list, id);
        }
    }

    display.create_visibility_toggle(id, journal_navbar_labels.cards, swap_visibility(section_id_list, UIIDS.journal_cards));
    display.create_visibility_toggle(id, journal_navbar_labels.boons, swap_visibility(section_id_list, UIIDS.journal_boons));
    display.create_visibility_toggle(id, journal_navbar_labels.areas, swap_visibility(section_id_list, UIIDS.journal_areas));

    display.swap_screen(section_id_list, UIIDS.journal_cards);
}
const SENTRY_MODES = {
    saw: `Saw`,
    cannon: `Cannon`,
    turret: `Turret`
};
Object.freeze(SENTRY_MODES);

const SENTRY_MAX_SAW_CYCLE = 4;
const SENTRY_MAX_CANNON_CYCLE = 3;

/** @type {TileGenerator} */
function arcane_sentry_tile(){
    return{
        type: entity_types.enemy,
        name: boss_names.arcane_sentry,
        pic: `${IMG_FOLDER.tiles}arcane_sentry_core.png`,
        description: boss_descriptions.arcane_sentry,
        tags: new TagList([TAGS.boss, TAGS.arcane_sentry]),
        health: 7,
        death_message: boss_death_message.arcane_sentry,
        death_achievement: achievement_names.arcane_sentry,
        behavior: sentry_core_ai,
        on_hit: sentry_core_on_hit,
        on_death: arcane_sentry_death,
        cycle: 0,
        spawn_timer: 4,
        card_drops: BOSS_CARDS.arcane_sentry
    }
}

function arcane_node_tile(){
    return{
        type: entity_types.enemy,
        name: boss_names.arcane_sentry_node,
        pic: `${IMG_FOLDER.tiles}arcane_sentry_node_turret`,
        description: boss_descriptions.arcane_sentry_node,
        tags: new TagList([TAGS.boss, TAGS.arcane_sentry, TAGS.controlled, TAGS.unstunnable]),
        health: 5,
        death_message: boss_death_message.arcane_sentry_node,
        on_hit: node_on_hit,
        on_death: node_on_death,
    }
}

function sentry_core_ai(self, target, map){
    var nodes = get_sentry_nodes(self, target, map);
    switch(self.tile.mode){
        case SENTRY_MODES.saw:
            if(self.tile.cycle === SENTRY_MAX_SAW_CYCLE){
                sentry_transform_saw(self, target, map);
            }
            else{
                for(var node of nodes){
                    node.self.tile.behavior(node.self, node.target, node.map);
                }
                node_saw_behavior(self, target, map);
                sentry_move(self, target, map);
            }
            decrement_sentry_cycle(self, target, map);
            break;
        case SENTRY_MODES.cannon:
            switch(self.tile.cycle){
                case SENTRY_MAX_CANNON_CYCLE:
                    sentry_transform_cannon(self, target, map);
                    break;
                default:
                    for(var node of nodes){
                        node.self.tile.behavior(node.self, node.target, node.map);
                    }
                    if(self.tile.direction !== undefined){
                        node_cannon_behavior(self, target, map);
                    }
                    break;
            }
            decrement_sentry_cycle(self, target, map);
            break;
        case SENTRY_MODES.turret:
            for(var node of nodes){
                node.self.tile.behavior(node.self, node.target, node.map);
            }
            ++self.tile.cycle;
            if(self.tile.cycle >= self.tile.spawn_timer){
                spawn_nearby(map, paper_construct_tile(), self.location);
                self.tile.cycle = 0;
            }
            break;
        default:
            throw Error(ERRORS.invalid_value);
    }
}

function arcane_sentry_death(self, target, map){
    var nodes = get_sentry_nodes(self, target, map);
    for(var node of nodes){
        node.self.tile.health = 1;
        node.self.tile.on_hit = undefined;
        node.self.tile.on_death = undefined;
        map.attack(node.self.location);
    }
    boss_death(self, target, map);
}
function node_on_death(self, target, map){
    say_record(self.tile.death_message);
}

function sentry_core_on_hit(self, target, map){
    if(self.tile.mode === SENTRY_MODES.turret){
        self.tile.mode = SENTRY_MODES.saw;
        self.tile.cycle = SENTRY_MAX_SAW_CYCLE;
    }
}
function node_on_hit(self, target, map){
    var core = sentry_get_core(self.location, map);
    if(core.mode === SENTRY_MODES.turret){
        core.mode = SENTRY_MODES.cannon;
        core.cycle = SENTRY_MAX_CANNON_CYCLE;
    }
}

function sentry_move(self, target, map){
    var locations = get_sentry_nodes(self, target, map).map((node) => {
        return node.self.location;
    });
    locations.push(self.location);
    var can_move = move_check(locations, self.tile.direction, map);
    if(can_move){
        for(var location of locations){
            map.move(location, location.plus(self.tile.direction));
        }
        self.location.plus_equals(self.tile.direction);
    }
}
function move_check(locations, direction, map){
    for(var position of locations){
        if(!map.check_empty(position.plus(direction))){
            return false;
        }
    }
    return true;
}

function decrement_sentry_cycle(self, target, map){
    if(--self.tile.cycle === 0){
        self.tile.mode = SENTRY_MODES.turret;
        sentry_transform_turret(self, target, map);
        self.tile.cycle = self.tile.spawn_timer - 1;
    }
}

function get_sentry_nodes(self, target, map){
    return DIAGONAL_DIRECTIONS.filter((direction) => {
        // Only includes the remaining nodes.
        var location = self.location.plus(direction);
        return map.is_in_bounds(location) && map.get_tile(location).tags.has(TAGS.arcane_sentry);
    }).map((direction) => {
        // Returns a list of objects with the info required to call their ai functions.
        var location = self.location.plus(direction);
        return {
            self: {
                tile: map.get_tile(location),
                location
            },
            target: {
                tile: target.tile,
                difference: target.difference.minus(direction)
            },
            map: map
        }
    });
}
function sentry_get_core(location, map){
    for(var direction of DIAGONAL_DIRECTIONS){
        var space = direction.plus(location);
        if(map.is_in_bounds(space)){
            var tile = map.get_tile(space);
            if(tile.tags.has(TAGS.arcane_sentry)){
                return tile;
            }
        }
    }
}
/** @type {TileGenerator} */
function forest_heart_tile(){
    var pic_arr = [
        `${IMG_FOLDER.tiles}forest_heart.png`,
        `${IMG_FOLDER.tiles}forest_heart_invincible.png`
    ];
    var spells = [
        // Index + 1 corresponds with the health it's triggered at.
        /*1*/greater_thorn_bush_spell_generator(),
        /*3*/swaying_nettle_spell_generator(),
        /*2*/forest_heart_rest_spell_generator(),
        /*4*/living_tree_spell_generator(),
        /*5*/thorn_bush_spell_generator(),
        /*6*/rotting_fruit_spell_generator(),
        /*7*/scorpion_spell_generator(),
        /*8*/forest_heart_rest_spell_generator(),
        /*9*/thorn_bush_spell_generator(),
        /*10*/vinesnare_bush_spell_generator(),
        /*11*/forest_heart_rest_spell_generator(),
    ];
    var health = 12
    var tile = {
        type: entity_types.enemy,
        name: boss_names.forest_heart,
        pic: pic_arr[0],
        display_pic: `${IMG_FOLDER.tiles}forest_heart.png`,
        description: `${boss_descriptions.forest_heart} ${heart_spell_descriptions.rest}`,
        tags: new TagList([TAGS.boss, TAGS.unmovable, TAGS.unstunnable, TAGS.nettle_immune]),
        health,
        death_message: boss_death_message.forest_heart,
        death_achievement: achievement_names.forest_heart,
        behavior: forest_heart_ai,
        on_hit: forest_heart_on_hit,
        on_death: forest_heart_death,
        telegraph_other: rest_spell_telegraph,
        pic_arr,
        cycle: health,
        segment_list: [undefined, undefined],
        spells,
        card_drops: BOSS_CARDS.forest_heart
    }
    return tile;
}

/** @type {AIFunction} */
function forest_heart_ai(self, target, map){
    if( self.tile.cycle === undefined || // Make sure it checks for correct fields
        self.tile.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.health === undefined){
        // Performs the action corresponding to the current health.
        self.tile.spells[self.tile.cycle - 1].behavior(self, target, map);
        if(self.tile.cycle === 0){
            return;
        }
        // Makes it vulnerable again
        var sections = get_forest_heart_sections(self, map);
        var health = self.tile.cycle;
        var next_spell = self.tile.spells[health - 2];
        if(health > 1){
            map.add_event({name: event_names.spell_announcement, behavior: () => {say_record(next_spell.description)}});
        }
        for(var section of sections){
            var tile = section.tile;
            tile.health = health;
            tile.pic = tile.pic_arr[0];
            if(tile.health > 1){
                tile.description = `${boss_descriptions.forest_heart} ${next_spell.description}`;
                tile.pic = next_spell.pic;
                tile.telegraph_other = next_spell.telegraph_other;
            }
        }
    }
    else{
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {AIFunction} */
function forest_heart_on_hit(self, target, map){
    // Removes health so it can't be damaged again this turn.
    if(self.tile.health !== undefined && self.tile.health > 0){
        var sections = get_forest_heart_sections(self, map);
        var health = self.tile.health;
        for(var section of sections){
            var tile = section.tile;
            // cycle stores the health value so it can be restored.
            tile.cycle = health;
            tile.health = undefined;
            tile.pic = tile.pic_arr[1];
        }
    }
}

/**
 * Function to get an array of each tile in a Forest Heart.
 * @param {AISelfParam} self The tile and location of one section.
 * @param {GameMap} map The map used to locate the sections.
 * @returns {AISelfParam[]} An array with each tile and location in the Forest Heart.
 */
function get_forest_heart_sections(self, map){
    if(self.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var tiles = [self];
    // Goes one direction
    var current = self.tile.segment_list[0];
    var next_location = self.location;
    while(current != undefined){
        next_location = next_location.plus(current);
        var next_tile = map.get_tile(next_location);
        if(next_tile.segment_list === undefined){
            throw new Error(ERRORS.missing_property);
        }
        tiles.push({
            tile: next_tile,
            location: next_location
        });
        current = next_tile.segment_list[0];
    }
    // Goes the other
    current = self.tile.segment_list[1];
    next_location = self.location;
    while(current != undefined){
        next_location = next_location.plus(current);
        var next_tile = map.get_tile(next_location);
        if(next_tile.segment_list === undefined){
            throw new Error(ERRORS.missing_property);
        }
        tiles.push({
            tile: next_tile,
            location: next_location
        });
        current = next_tile.segment_list[1];
    }
    return tiles;
}

/** @type {AIFunction} */
function forest_heart_death(self, target, map){
    var sections = get_forest_heart_sections(self, map);
    for(var section of sections){
        section.tile.on_hit = undefined;
        section.tile.on_death = undefined;
        section.tile.health = 1;
        map.attack(section.location);
    }
    boss_death(self, target, map);
}
const LICH_SPELLS = [
    summon_spell_generator(), 
    earthquake_spell_generator(), 
    flame_wave_spell_generator(),
    confusion_spell_generator(),
    lava_moat_spell_generator(),
    piercing_beam_spell_generator(),
];
const LICH_UTIL_SPELLS = [
    rest_spell_generator(),
    teleport_spell_generator(), 
];
/** @type {TileGenerator} */
function lich_tile(){
    var summons = [
        clay_golem_tile,
        darkling_tile,
        maw_tile,
        shadow_knight_tile,
        shadow_scout_tile,
        specter_tile,
        vampire_tile,
    ];
    var tile = {
        type: entity_types.enemy,
        name: boss_names.lich,
        display_pic: `${IMG_FOLDER.tiles}lich_rest.png`,
        tags: new TagList([TAGS.boss]),
        health: 4,
        death_message: boss_death_message.lich,
        death_achievement: achievement_names.lich,
        behavior: lich_ai,
        telegraph: lich_telegraph,
        telegraph_other: lich_telegraph_other,
        on_hit: lich_hit,
        on_death: boss_death,
        spells: [...LICH_SPELLS],
        summons,
        card_drops: BOSS_CARDS.lich
    }
    lich_prep(tile, -2);
    return tile;
}

/** @type {AIFunction} AI used by the Lich.*/
function lich_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === -2){
        // Move away and prepare the next spell.
        var directions = reverse_arr(order_nearby(target.difference));
        var moved = move_careful(self, target, map, directions);
        if(moved === undefined){
            // If stuck, prep teleport.
            say_record(lich_prep(self.tile, -1));
        }
        else{
            say_record(lich_prep(self.tile, random_num(self.tile.spells.length)));
        }
    }
    else if(self.tile.cycle === -1){
        // Cast teleport.
        LICH_UTIL_SPELLS[1].behavior(self, target, map);
        say_record(lich_prep(self.tile, -2));
    }
    else{
        // Cast the current spell.
        self.tile.spells[self.tile.cycle].behavior(self, target, map);
        self.tile.spells.splice(self.tile.cycle, 1);
        if(self.tile.spells.length === 0){
            self.tile.spells = [...LICH_SPELLS];
        }
        say_record(lich_prep(self.tile, -2));
    }
}

/** @type {TelegraphFunction} */
function lich_telegraph(location, map, self){
    if( self.cycle === undefined || 
        self.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spell = self.cycle < 0 ? LICH_UTIL_SPELLS[self.cycle + 2] : self.spells[self.cycle];
    if(spell.telegraph !== undefined){
        return spell.telegraph(location, map, self);
    }
    return rest_spell_telegraph(location, map, self);
}

/** @type {TelegraphFunction} */
function lich_telegraph_other(location, map, self){
    if( self.cycle === undefined || 
        self.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spell = self.cycle < 0 ? LICH_UTIL_SPELLS[self.cycle + 2] : self.spells[self.cycle];
    if(spell.telegraph_other !== undefined){
        return spell.telegraph_other(location, map, self);
    }
    return rest_spell_telegraph(location, map, self);
}

/** @type {AIFunction} Function used when the lich is hit to have it prep teleport.*/
function lich_hit(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spells === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle !== -1){
        if(self.tile.cycle >= 0){
            self.tile.spells.splice(self.tile.cycle, 1);
            if(self.tile.spells.length === 0){
                self.tile.spells = [...LICH_SPELLS];
            }
        }
        say_record(lich_prep(self.tile, -1, true));
    }
}

// Function to prep a new spell.
function lich_prep(tile, cycle, change = false){
    var spell = cycle < 0 ? LICH_UTIL_SPELLS[cycle + 2] : tile.spells[cycle];
    tile.cycle = cycle;
    tile.description = 
        `${boss_descriptions.lich}\n`
        +`${boss_descriptions.lich_announcement}\n`
        +`${spell.description}`;
    tile.pic = spell.pic;
    var announcement = 
        (change ? 
            `${boss_descriptions.lich_change_announcement}\n` : 
            `${boss_descriptions.lich_announcement}\n`)
        +`${spell.description}`;
    return announcement;
}
/** @type {TileGenerator} */
function lord_of_shadow_and_flame_tile(){
    var pic_arr = [
    `${IMG_FOLDER.tiles}lord_move.png`,
    `${IMG_FOLDER.tiles}lord_attack.png`,
    `${IMG_FOLDER.tiles}lord_summon.png`,
    ];

    var health = 13;
    var summons = [
        altar_of_sunlight_tile,
        altar_of_stars_tile,
        altar_of_scouring_tile,
        altar_of_shadow_tile,
        altar_of_space_tile,
        altar_of_stasis_tile,
        altar_of_singularity_tile,
    ];
    return {
        type: entity_types.enemy,
        name: boss_names.lord_of_shadow_and_flame,
        pic: pic_arr[0],
        display_pic: pic_arr[0],
        description: boss_descriptions.lord_of_shadow_and_flame,
        tags: new TagList([TAGS.boss]),
        health,
        max_health: health,
        death_message: boss_death_message.lord_of_shadow_and_flame,
        death_achievement: achievement_names.lord_of_shadow_and_flame,
        behavior: lord_of_shadow_and_flame_ai,
        telegraph: lord_of_shadow_and_flame_telegraph,
        on_death: lord_of_shadow_and_flame_on_death,
        pic_arr,
        cycle: 0,
        summons,
        card_drops: BOSS_CARDS.lord_of_shadow_and_flame
    }
}

/** @type {AIFunction} AI used by the Lord of Shadow and Flame.*/
function lord_of_shadow_and_flame_ai(self, target, map){
    var lord_slow_pics = [
        `${IMG_FOLDER.tiles}lord_move.png`,
        `${IMG_FOLDER.tiles}lord_attack.png`,
        `${IMG_FOLDER.tiles}lord_summon.png`
    ];
    var lord_fast_pics = [
        `${IMG_FOLDER.tiles}lord_fast_move.png`,
        `${IMG_FOLDER.tiles}lord_fast_attack.png`,
        `${IMG_FOLDER.tiles}lord_fast_summon.png`
    ];

    self.tile.pic_arr = self.tile.health < self.tile.max_health / 2 ? lord_fast_pics : lord_slow_pics;
    switch(self.tile.cycle){
        case 2: // Summon Mode
            // Do nothing since the actual summon should be an event that is already in motion.
            break;
        case 1: // Attack Mode
            var attacks = randomize_arr(ALL_DIRECTIONS).map((p) => {
                return self.location.plus(p);
            }).filter((p) => {
                return map.is_in_bounds(p);
            });
            for(var attack of attacks){
                var tile = map.get_tile(attack);
                if(!tile.tags.has(TAGS.altar)){
                    map.attack(attack);
                }
            }
            break;
        case 0: // Movement Mode
            if(!target.difference.within_radius(1)){
                var speed = self.tile.health < self.tile.max_health / 2 ? 2 : 1;
                for(var i = 0; i < speed; ++i){
                    var nearest = get_nearest_altar(map, self.location);
                    if(nearest !== undefined){
                        var dir = self.location.minus(nearest);
                        var choices = reverse_arr(order_nearby(sign(dir)).filter((p) => {
                            return map.is_in_bounds(p.plus(self.location));
                        }));
                        for(var choice of choices){
                            var destination = self.location.plus(choice);
                            var is_altar = map.get_tile(destination).tags.has(TAGS.altar);
                            var is_empty = map.check_empty(destination);
                            var is_fireball_target = check_fireball_target(map, destination);
                            if(is_altar || (is_empty && !is_fireball_target)){
                                if(map.move(self.location, destination)){
                                    self.location.plus_equals(choice);
                                }
                                break;
                            }
                        }
                    }
                }
            }
            break;
        default:
            throw new Error(ERRORS.invalid_value);
    }
    if(target.difference.within_radius(1)){
        // Prep attack
        self.tile.pic = self.tile.pic_arr[1];
        self.tile.cycle = 1;
    }
    else if(self.tile.cycle === 2 || get_nearest_altar(map, self.location) !== undefined){
        // Prep move
        self.tile.pic = self.tile.pic_arr[0];
        self.tile.cycle = 0;
    }
    else{
        // Prep summon
        self.tile.pic = self.tile.pic_arr[2];
        self.tile.cycle = 2;
        var make = rand_no_repeats(self.tile.summons, 4);
        var xs = rand_no_repeats(range(0, FLOOR_WIDTH), make.length);
        var ys = rand_no_repeats(range(0, FLOOR_HEIGHT), make.length);
        for(var i = 0; i < make.length; ++i){
            var destination = new Point(xs[i], ys[i]);
            if(!point_equals(destination, self.location)){
                map.add_event({
                    name: event_names.altarfall, 
                    behavior: altar_event(destination, make[i]),
                });
            }
        }
    }
}

/** @type {TelegraphFunction} */
function lord_of_shadow_and_flame_telegraph(location, map, self){
    if(self.cycle === 1){
        return spider_telegraph(location, map, self);
    }
    return [];
}

function get_nearest_altar(map, location){
    return get_nearest_where(map, location, (t, p) => {return t.tags.has(TAGS.altar)});
}

function check_fireball_target(map, location){
    var fireballs = point_rectangle(location.plus(1, 1), location.plus(-1, -1)).filter((p) => {
        // Is there a fireball at p?
        return map.is_in_bounds(p) && map.get_tile(p).tags.has(TAGS.fireball);
    }).filter((p) => {
        // Is the fireball at p headed to location?
        return point_equals(map.get_tile(p).direction.plus(p), location);
    });
    return fireballs.length > 0;
}

function lord_of_shadow_and_flame_on_death(self, target, map){
    map.add_tile(final_exit_tile());
    map.add_event({name: event_names.earthquake, behavior: eternal_earthquake_event(8)});
    boss_death(self, target, map);
}
/** @type {TileGenerator} */
function spider_queen_tile(){
    return{
        type: entity_types.enemy,
        name: boss_names.spider_queen,
        pic: `${IMG_FOLDER.tiles}spider_queen.png`,
        description: boss_descriptions.spider_queen,
        tags: new TagList([TAGS.boss]),
        health: 3,
        death_message: boss_death_message.spider_queen,
        death_achievement: achievement_names.spider_queen,
        behavior: spider_ai,
        telegraph: spider_telegraph,
        on_hit: spider_queen_hit,
        on_death: boss_death,
        card_drops: BOSS_CARDS.spider_queen
    }
}

/** @type {AIFunction} Function used when the spider queen is hit to stun her and spawn a spider.*/
function spider_queen_hit(self, target, map){
    // Spawns a new spider nearby. Stuns it so it won't move right away.
    stun(self.tile);
    var new_spider = spider_tile();
    stun(new_spider);
    spawn_nearby(map, new_spider, self.location);
}
/** @type {TileGenerator} */
function two_headed_serpent_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}serpent_head_sleep.png`, `${IMG_FOLDER.tiles}serpent_head.png`];
    return{
        type: entity_types.enemy,
        name: boss_names.two_headed_serpent,
        pic: pic_arr[1],
        display_pic: pic_arr[1],
        description: boss_descriptions.two_headed_serpent_awake,
        tags: new TagList([TAGS.boss, TAGS.unmovable]),
        health: 1,
        death_message: boss_death_message.two_headed_serpent,
        death_achievement: achievement_names.two_headed_serpent,
        behavior: two_headed_serpent_ai,
        telegraph: two_headed_serpent_telegraph,
        on_death: two_headed_serpent_hurt,
        pic_arr,
        cycle: 1,
        segment_list: [undefined, undefined],
        card_drops: BOSS_CARDS.two_headed_serpent
    }
}
/** @type {TileGenerator} */
function two_headed_serpent_body_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}serpent_body_straight.png`, `${IMG_FOLDER.tiles}serpent_body_bend.png`];
    return{
        type: entity_types.terrain,
        name: boss_names.two_headed_serpent_body,
        pic: pic_arr[0],
        description: boss_descriptions.two_headed_serpent_body,
        tags: new TagList([TAGS.boss, TAGS.unmovable]),
        pic_arr,
        segment_list: [undefined, undefined],
    }
}
/** @type {AIFunction} */
function two_headed_serpent_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle !== 1){
        throw new Error(ERRORS.skip_animation);
    }
    var moved = false;
    var index = serpent_get_direction(self.tile);
    if(!(target.difference.within_radius(1) && target.difference.on_axis())){
        var dir = order_nearby(target.difference);
        for(var i = 0; i < dir.length && !moved; ++i){
            if(dir[i].on_axis()){
                moved = map.move(self.location, self.location.plus(dir[i]));
                if(moved){
                    // Create segment where the head was.
                    var neck = two_headed_serpent_body_tile();
                    if(neck.segment_list === undefined){
                        throw new Error(ERRORS.missing_property);
                    }
                    neck.segment_list[1 - index] = dir[i];
                    neck.segment_list[index] = self.tile.segment_list[index];
                    serpent_rotate(neck);
                    map.add_tile(neck, self.location);
                    // Update head
                    self.location.plus_equals(dir[i]);
                    target.difference.plus_equals(dir[i].times(-1));
                    self.tile.segment_list[index] = dir[i].times(-1);
                    serpent_rotate(self.tile);
                    // Drag tail
                    var tail = serpent_other_end(self, index, map);
                    if(tail.tile.segment_list === undefined){
                        throw new Error(ERRORS.missing_property);
                    }
                    var last_segment_location = tail.location.plus(ifexists(tail.tile.segment_list[1 - index]));
                    var last_segment = map.get_tile(last_segment_location);
                    if(last_segment.segment_list === undefined){
                        throw new Error(ERRORS.missing_property);
                    }
                    tail.tile.segment_list[1 - index] = last_segment.segment_list[1 - index];
                    last_segment.health = 1;
                    map.attack(last_segment_location);
                    map.clear_telegraphs();
                    map.move(tail.location, last_segment_location);
                    serpent_rotate(tail.tile);
                }
            }
        } 
    }
    if(target.difference.within_radius(1) && target.difference.on_axis()){
        map.attack(self.location.plus(target.difference));
    }
    else if(!moved){
        // If stuck, switch heads.
        var tail = serpent_other_end(self, index, map);
        var wake_up = function(map_to_use){
            serpent_wake(tail, map_to_use);
        }
        map.add_event({name: event_names.wake_up, behavior: wake_up});
    }
}
/**
 * Recursively finds the other head of the snake.
 * @param {AISelfParam} self The current segment and it's location.
 * @param {Number} index The index to find the next segment using the current one's segment_list.
 * @param {GameMap} map The game map the snake is on.
 * @returns {AISelfParam} The other head and it's location..
 */
function serpent_other_end(self, index, map){
    if(self.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var p = self.tile.segment_list[index];
    if(p === undefined){
        return self;
    }
    var next_location = self.location.plus(p);
    var next = {
        location: next_location,
        tile: map.get_tile(next_location),
    }
    return serpent_other_end(next, index, map);
}
/**
 * Finds the index of the provided head's segment list that is being used.
 * @param {Tile} tile The current head.
 * @returns {number} The index.
 */
function serpent_get_direction(tile){
    if(tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    return 1 - tile.segment_list.findIndex((element) => element === undefined);
}
/** 
 * Gives the provided segment the correct picture and correct amount of rotation.
 * @param {Tile} tile The tile to rotate.
 */
function serpent_rotate(tile){
    if( tile.pic_arr === undefined || 
        tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var index = serpent_get_direction(tile);
    if(index === 0 || index === 1){
        var p = ifexists(tile.segment_list[index]);
        tile.rotate = 1 - p.x + p.y;
        if(p.y === 0){
            ++tile.rotate;
        }
        tile.rotate *= 90;
    }
    else if(index === 2){
        var p0 = ifexists(tile.segment_list[0]);
        var p1 = ifexists(tile.segment_list[1]);
        if(p0.x === p1.x){
            tile.pic = tile.pic_arr[0];
            tile.rotate = 0;
        }
        else if(p0.y === p1.y){
            tile.pic = tile.pic_arr[0];
            tile.rotate = 90;
        }
        else{
            tile.pic = tile.pic_arr[1];
            var x = p0.x + p1.x;
            var y = p0.y + p1.y;
            tile.rotate = (x + y + 2) / 2;
            if(x < 0 && y > 0){
                tile.rotate = 3;
            }
            tile.rotate = (tile.rotate + 2) % 4;
            tile.rotate *= 90;
        }
    }
}
/**
 * Wakes up the provided head and puts the other to sleep.
 * @param {AISelfParam} self The head to wake up.
 * @param {GameMap} map The map the snake is on.
 */
function serpent_wake(self, map){
    serpent_toggle(self.tile, 1);
    var index = serpent_get_direction(self.tile);
    var tail = serpent_other_end(self, index, map);
    serpent_toggle(tail.tile, 0);
}
/**
 * Wakes a head up or puts it to sleep.
 * @param {Tile} tile The head to alter.
 * @param {number} cycle The cycle to set it to. 1 is awake, 0 is asleep.
 */
function serpent_toggle(tile, cycle){
    if( tile.cycle === undefined || 
        tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    tile.cycle = cycle;
    tile.pic = tile.pic_arr[tile.cycle];
    if(tile.cycle === 1){
        tile.description = boss_descriptions.two_headed_serpent_awake;
    }
    else{
        tile.description = boss_descriptions.two_headed_serpent_asleep;
    }
}
/**
 * @type {AIFunction} Regrows destroyed heads and causes them to wake up. If the snake has no more body segments,
 * it will then be destroyed.
 */
function two_headed_serpent_hurt(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    // New head replaces neck segment
    var index = serpent_get_direction(self.tile);
    var neck_location = self.location.plus(ifexists(self.tile.segment_list[index]));
    var neck = map.get_tile(neck_location);
    if(neck.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var regrow = {
        tile: two_headed_serpent_tile(),
        location: neck_location
    }
    if(regrow.tile.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    regrow.tile.segment_list[index] = neck.segment_list[index];
    serpent_rotate(regrow.tile);
    neck.health = 1;
    map.attack(neck_location);
    map.add_tile(regrow.tile, neck_location);
    if(self.tile.cycle != 1){
        stun(regrow.tile);
    }
    serpent_wake(regrow, map);
    // If no segments remain, it dies.
    neck_location = regrow.location.plus(ifexists(regrow.tile.segment_list[index]));
    neck = map.get_tile(neck_location);
    if(neck.name === boss_names.two_headed_serpent){
        neck.on_death = undefined;
        regrow.tile.on_death = undefined;
        map.attack(neck_location);
        map.attack(regrow.location);
        boss_death(regrow, target, map);
    }
}
/** @type {TelegraphFunction} */
function two_headed_serpent_telegraph(location, map, self){
    if( self.cycle === undefined || 
        self.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var attacks = [];
    if(self.cycle === 0){
        return attacks;
    }
    for(var direction of ORTHOGONAL_DIRECTIONS){
        attacks.push(location.plus(direction));
    }
    for(var move of ORTHOGONAL_DIRECTIONS){
        if(map.looks_empty(location.plus(move))){
            for(var direction of ORTHOGONAL_DIRECTIONS){
                attacks.push(location.plus(move).plus(direction));
            }
        }
    }
    return attacks;
}
/** @type {TileGenerator} */
function velociphile_tile(){
    return{
        type: entity_types.enemy,
        name: boss_names.velociphile,
        pic: `${IMG_FOLDER.tiles}velociphile.png`,
        description: boss_descriptions.velociphile,
        tags: new TagList([TAGS.boss]),
        health: 3,
        death_message: boss_death_message.velociphile,
        death_achievement: achievement_names.velociphile,
        behavior: velociphile_ai,
        telegraph: velociphile_telegraph,
        on_death: boss_death,
        card_drops: BOSS_CARDS.velociphile
    }
}

/** @type {AIFunction} AI used by the Velociphile.*/
function velociphile_ai(self, target, map){
    var directions = order_nearby(target.difference);
    if(chance(1, 3)){
        // 1/3 of the time, moves randomly.
        directions = randomize_arr(directions);
    }
    // Direction is reselected until an unobstructed one is found.
    var direction = get_empty_nearby(self.location, directions, map);
    if(!(direction === undefined)){
        // Moves in the chosen direction until it hits something, which it then attacks.
        while(map.move(self.location, self.location.plus(direction))){
            self.location.plus_equals(direction);
        }
        map.attack(self.location.plus(direction));
    }
}

/** @type {TelegraphFunction} */
function velociphile_telegraph(location, map, self){
    var attacks = [];
    for(var direction of ALL_DIRECTIONS){
        if(map.looks_empty(location.plus(direction))){
            attacks.push(...look_at_points_in_direction(location.plus(direction), direction, map));
        }
    }
    return attacks;
}
/** @type {TileGenerator} */
function young_dragon_tile(){
    var pic_arr = [
        `${IMG_FOLDER.tiles}young_dragon_flight.png`, 
        `${IMG_FOLDER.tiles}young_dragon_diagonal_flight.png`,
        `${IMG_FOLDER.tiles}young_dragon_walk.png`,
        `${IMG_FOLDER.tiles}young_dragon_diagonal_walk.png`,
        `${IMG_FOLDER.tiles}young_dragon_breath.png`,
        `${IMG_FOLDER.tiles}young_dragon_diagonal_breath.png`
    ];
    return {
        type: entity_types.enemy,
        name: boss_names.young_dragon,
        pic: pic_arr[0],
        display_pic: pic_arr[0],
        description: `${boss_descriptions.young_dragon[0]}${boss_descriptions.young_dragon[1]}`,
        tags: new TagList([TAGS.boss]),
        health: 5,
        death_message: boss_death_message.young_dragon,
        death_achievement: achievement_names.young_dragon,
        behavior: yound_dragon_ai,
        telegraph: young_dragon_telegraph,
        on_death: boss_death,
        pic_arr,
        description_arr: boss_descriptions.young_dragon,
        rotate: 180,
        cycle: 0,
        range: 3,
        direction: new Point(0, 1),
        card_drops: BOSS_CARDS.young_dragon
    }
}

/** @type {AIFunction} AI used by the Young Dragon.*/
function yound_dragon_ai(self, target, map){
    if( self.tile.pic_arr === undefined ||
        self.tile.description_arr === undefined ||
        self.tile.rotate === undefined ||
        self.tile.cycle === undefined ||
        self.tile.range === undefined ||
        self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        // Flight
        var spaces = [new Point(3, 0), new Point(3, 1), new Point(3, -1), new Point(2, 2),]; 
        spaces.push(...spaces.map((p) => p.rotate(90)));
        spaces.push(...spaces.map((p) => p.rotate(180))); // All rotations of the original are included.
        spaces = randomize_arr(spaces);
        var moved = false;
        var prefered_distance = [4, 3, 5];
        for(let radius of prefered_distance){
            for(let space of spaces){
                if(moved){
                    break;
                }
                // Tries to move to a space the appropriate taxicab distance away from the player.
                var taxi = target.difference.minus(space).taxicab_distance();
                var destination = self.location.plus(space);
                if(!moved && taxi === radius && map.check_empty(destination)){
                    moved = map.move(self.location, destination);
                    self.tile.direction = sign(space);
                }
            }
        }
        for(let space of spaces){
            if(moved){
                break;
            }
            // Instead tries to move to a space that isn't next to the player.
            var next_to = target.difference.minus(space).within_radius(1);
            var destination = self.location.plus(space);
            if(!moved && !(next_to) && map.check_empty(destination)){
                moved = map.move(self.location, destination);
                self.tile.direction = sign(space);
            }
        }
        if(moved){
            ++self.tile.cycle;
            self.tile.pic = self.tile.pic_arr[2 * self.tile.cycle + set_rotation(self.tile)];
            self.tile.description = `${self.tile.description_arr[0]}${self.tile.description_arr[self.tile.cycle + 1]}`;
        }
        return;
    }
    if(self.tile.cycle === 1 && target.difference.taxicab_distance() <= self.tile.range + 1){
        // Aims it's breath.
        self.tile.direction =  order_nearby(target.difference)[0];
        ++self.tile.cycle;
        self.tile.pic = self.tile.pic_arr[2 * self.tile.cycle + set_rotation(self.tile)];
        self.tile.description = `${self.tile.description_arr[0]}${self.tile.description_arr[self.tile.cycle + 1]}`;
        return;
    }
    if(self.tile.cycle === 2){
        // Breathe fire.
        var orthogonal_cone = [];
        for(var i = 1; i <= self.tile.range; ++i){
            for(var j = -(i - 1); j < i; ++j){
                // Creates the orthogonal cone pattern pointing North.
                orthogonal_cone.push(new Point(j, -1 * i));
            }
        }
        var diagonal_cone = [];
        for(let i = 1; i <= self.tile.range; ++i){
            for(let j = 0; j < i; ++j){
                // Creates the diagonal cone pattern ponting North West.
                diagonal_cone.push(new Point(j - i, -1 - j));
            }
        }
        // Choose breath cone for the direction we are facing.
        var cone = [];
        if(self.tile.direction.on_axis()){
            cone = create_orthogonal_cone(self.tile.rotate, self.tile.range);
        }
        else if(self.tile.direction.on_diagonal()){
            cone = create_diagonal_cone(self.tile.rotate, self.tile.range);
        }
        // Breath attack.
        for(let space of cone){
            var target_space = self.location.plus(space);
            map.attack(target_space);
            if(map.check_empty(target_space)){
                var fire = raging_fire_tile();
                map.add_tile(fire, target_space);
            }
        }
    }
    // Prep Flight.
    // Happens when it fails to aim fire breath or after it uses it. 
    var nearby = order_nearby(target.difference);
    if(target.difference.within_radius(2)){
        nearby = nearby.reverse();
    }
    self.tile.direction = nearby[0];
    self.tile.cycle = 0;
    self.tile.pic = self.tile.pic_arr[2 * self.tile.cycle + set_rotation(self.tile)];
    self.tile.description = `${self.tile.description_arr[0]}${self.tile.description_arr[self.tile.cycle + 1]}`;
    return;
}

/** @type {TelegraphFunction} */
function young_dragon_telegraph(location, map, self){
    if( self.rotate === undefined ||
        self.cycle === undefined ||
        self.range === undefined ||
        self.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle !== 2){
        return [];
    }
    var cone = [];
    if(self.direction.on_axis()){
        cone = create_orthogonal_cone(self.rotate, self.range);
    }
    else if(self.direction.on_diagonal()){
        cone = create_diagonal_cone(self.rotate, self.range);
    }
    cone = cone.map((p) => p.plus(location));
    return cone;
}
/**
 * Function to create a orthogonal cone of points potruding from the origin.
 * @param {number} rotation A multiple of 90 degrees indicating how much the cone should be rotated from North.
 * @param {number} range The height of the cone.
 * @returns {Point[]} The resulting cone.
 */
function create_orthogonal_cone(rotation, range){
    var cone = [];
    for(var i = 1; i <= range; ++i){
        for(var j = -(i - 1); j < i; ++j){
            cone.push((new Point(j, -1 * i)).rotate(rotation));
        }
    }
    return cone;
}
/**
 * Function to create a diagonal cone of points potruding from the origin.
 * @param {number} rotation A multiple of 90 degrees indicating how much the cone should be rotated from North West.
 * @param {number} range The height of the cone.
 * @returns {Point[]} The resulting cone.
 */
function create_diagonal_cone(rotation, range){
    var cone = [];
    for(var i = 1; i <= range; ++i){
        for(var j = 0; j < i; ++j){
            cone.push((new Point(j - i, -1 - j)).rotate(rotation));
        }
    }
    return cone;
}
/** @type {TileGenerator} */
function acid_bug_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.acid_bug,
        pic: `${IMG_FOLDER.tiles}acid_bug.png`,
        description: enemy_descriptions.acid_bug,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: move_closer_ai,
        telegraph_other: spider_telegraph,
        on_death: acid_bug_death,
    }
}

/** @type {AIFunction} Function used when acid bugs die to explode and harm everything around them.*/
function acid_bug_death(self, target, map){
    // On death, attacks each space next to it.
    var attacks = random_nearby();
    for(var attack of attacks){
        map.attack(self.location.plus(attack));
    }
}
/** @type {TileGenerator} Generates an uncamoflauged animated boulder. */
function animated_boulder_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.animated_boulder,
        pic: `${IMG_FOLDER.tiles}animated_boulder.png`,
        description: enemy_descriptions.animated_boulder,
        tags: new TagList([TAGS.unmovable, TAGS.hidden]),
        behavior: animated_boulder_ai,
        telegraph: spider_telegraph,
        on_enter: animated_boulder_wake_up,
        on_hit: animated_boulder_wake_up,
        cycle: 0,
        look: magmatic_boulder_tile(),
    }
}

/** @type {AIFunction} AI used by animated boulders.*/
function animated_boulder_ai(self, target, map){
    if( self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        // Asleep.
        throw new Error(ERRORS.skip_animation);
    }
    if(self.tile.cycle < 0){
        // Asleep and resting.
        ++self.tile.cycle;
        throw new Error(ERRORS.skip_animation);
    }
    var nearby = order_nearby(target.difference);
    var hit = false;
    for(let space of nearby){
        // Attacks everything nearby that's not another elemental.
        var target_space = self.location.plus(space);
        if(map.is_in_bounds(target_space) && !map.get_tile(target_space).tags.has(TAGS.hidden)){
            hit = map.attack(target_space) || hit;
        }
    }
    // Gets sleepier
    --self.tile.cycle;
    if(self.tile.cycle <= 0){
        // Falls asleep.
        self.tile.look = magmatic_boulder_tile();
        self.tile.tags.add(TAGS.hidden);
        // Stays asleep for a turn before it can wake up.
        self.tile.cycle = -1;
    }
    else if(!target.difference.within_radius(1)){
        // If not asleep, moves towards the player.
        move_closer_ai(self, target, map);
    }
}
/** @type {AIFunction} animated boulder wakes up when touched.*/
function animated_boulder_wake_up(self, target, map){
    if( self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        stun(self.tile);
        self.tile.cycle = 3;
        self.tile.look = undefined;
        self.tile.tags.remove(TAGS.hidden);
    }
}
/** @type {TileGenerator} */
function blood_crescent_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}blood_crescent_wait.png`, `${IMG_FOLDER.tiles}blood_crescent.png`];
    var starting_cycle = random_num(pic_arr.length);
    return{
        type: entity_types.enemy,
        name: enemy_names.blood_crescent,
        pic: pic_arr[starting_cycle],
        display_pic: pic_arr[1],
        description: enemy_descriptions.blood_crescent,
        tags: new TagList(),
        health: 1,
        difficulty: 5,
        behavior: blood_crescent_ai,
        telegraph: blood_crescent_telegraph,
        pic_arr,
        cycle: starting_cycle,
        rotate: 90 * random_num(4),
    }
}

/** @type {AIFunction} AI used by Blood Crescents.*/
function blood_crescent_ai(self, target, map){
    if(self.tile.rotate === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 1){
        var distance = 3;
        self.tile.direction = order_nearby(target.difference).filter((p) => {
            return p.on_diagonal();
        })[0];
        // Rotate image based on direction.
        var direction = self.tile.direction;
        set_rotation(self.tile);
        var ahead = self.location.plus(direction);
        if(point_equals(self.location.plus(target.difference), ahead)){
            map.attack(ahead);
        }
        for(var i = 0; i < distance && map.move(self.location, self.location.plus(direction)) ; ++i){
            // moves <distance> spaces attacking each space it passes next to. Stops when blocked.
            self.location.plus_equals(direction);
            target.difference.minus_equals(direction);
            var passed = [new Point(direction.x, 0), new Point(0, direction.y)];
            for(var p of passed){
                if(
                    point_equals(target.difference, p.times(-1)) || 
                    map.check_empty(self.location.minus(p)) ||
                    (GS.boons.has(boon_names.manic_presence) && chance(1, 2))
                ){
                    map.attack(self.location.minus(p));
                }
            }
            if(i + 1 < distance){
                ahead = self.location.plus(direction);
                if(
                    point_equals(self.location.plus(target.difference), ahead) ||
                    (GS.boons.has(boon_names.manic_presence) && chance(1, 2))
                ){
                    map.attack(ahead);
                }
            }
        }
    }
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}

/** @type {TelegraphFunction} */
function blood_crescent_telegraph(location, map, self){
    var attacks = [];
    if(self.cycle === 0){
        return attacks;
    }
    for(var direction of DIAGONAL_DIRECTIONS){
        var current = location.copy();
        for(var i = 0; i < 2 && map.looks_empty(current.plus_equals(direction)); ++i){
            attacks.push(current.copy());
            attacks.push(current.plus(direction.times(new Point(-1, 0))));
            attacks.push(current.plus(direction.times(new Point(0, -1))));
        }
    }
    return attacks;
}
/** @type {TileGenerator} */
function brightling_tile(){
    var starting_cycle = 0;
    return{
        type: entity_types.enemy,
        name: enemy_names.brightling,
        pic: `${IMG_FOLDER.tiles}brightling.png`,
        description: enemy_descriptions.brightling,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: brightling_ai,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by brightlings.*/
function brightling_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === -1){
        // teleports to a random empty space, then cycle goes to 0.
        teleport_spell(self, target, map);
        ++self.tile.cycle;
        return;
    }
    var near_points = random_nearby();
    if(chance(self.tile.cycle, 4) && !target.tile.tags.has(TAGS.unmovable)){
        // Attempts to teleport the player next to it, then cycle goes to -1 to prepare to teleport next turn.
        for(var near of near_points){
            if(map.check_empty(self.location.plus(near))){
                map.move(self.location.plus(target.difference), self.location.plus(near));
                self.tile.cycle = -1;
                // Since player has been moved, it returns to their turn.
                throw new Error(ERRORS.pass_turn);
            }
        }
    }
    // Moves 2 spaces randomly and increments cycle.
    for(var i = 0; i < 2; ++i){
        move_careful(self, target, map, random_nearby());
    }
    ++self.tile.cycle;
}
/** @type {TileGenerator} */
function captive_void_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}captive_void_on.png`, `${IMG_FOLDER.tiles}captive_void_off.png`];
    var starting_cycle = 0;
    return {
        type: entity_types.enemy,
        name: enemy_names.captive_void,
        pic: pic_arr[starting_cycle],
        display_pic: pic_arr[0],
        description: enemy_descriptions.captive_void,
        tags: new TagList([TAGS.unmovable, TAGS.obstruction]),
        difficulty: 2,
        behavior: captive_void_ai,
        on_hit: captive_void_on_hit,
        telegraph_other: captive_void_telegraph_other,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction}.*/
function captive_void_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        var moved_player = false;
        var spaces = point_rectangle(new Point(-2, -2), new Point(2, 2));
        for(var space of spaces){
            var start = self.location.plus(space);
            var end = self.location.plus(sign(space));
            if(map.is_in_bounds(start) && !map.check_empty(start) && !map.get_tile(start).tags.has(TAGS.unmovable)){
                var moved = map.move(start, end);
                if(moved && map.get_tile(end).type === entity_types.player){
                    moved_player = true;
                }
            }
        }
        if(moved_player){
            throw new Error(ERRORS.pass_turn);
        }
    }
    else{
        --self.tile.cycle;
        if(self.tile.cycle === 0){
            self.tile.pic = self.tile.pic_arr[0];
        }
    }
}

/** @type {AIFunction}.*/
function captive_void_on_hit(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    self.tile.cycle = 2;
    self.tile.pic = self.tile.pic_arr[1];
}

/** @type {TelegraphFunction} */
function captive_void_telegraph_other(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spaces = [];
    if(self.cycle === 0){
        spaces = point_rectangle(new Point(-2, -2), new Point(2, 2)).map((p) => {
            return location.plus(p);
        });
    }
    return spaces;
}
/** @type {TileGenerator} */
function carrion_flies_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.carrion_flies,
        pic: `${IMG_FOLDER.tiles}carrion_flies.png`,
        description: enemy_descriptions.carrion_flies,
        tags: new TagList(),
        health: 1,
        difficulty: 6,
        behavior: carrion_flies_ai,
        telegraph: spider_telegraph,
        cycle: random_num(2),
        spawn_timer: 3
    }
}

/** @type {AIFunction} AI used by shadow scouts.*/
function carrion_flies_ai(self, target, map){
    if( self.tile.cycle === undefined ||
        self.tile.spawn_timer === undefined){
        throw new Error(ERRORS.missing_property);
    }
    ++self.tile.cycle;
    if(self.tile.cycle === self.tile.spawn_timer){
        // When the cycle reaches the spawn timer, spawn and reset it while increasing the time until the next one.
        self.tile.spawn_timer += 2;
        self.tile.cycle = 0;
        var new_tile = carrion_flies_tile();
        new_tile.spawn_timer = self.tile.spawn_timer;
        spawn_nearby(map, new_tile, self.location);
    }
    if(target.difference.within_radius(1)){
        // Attack the player if they are close.
        map.attack(self.location.plus(target.difference));
    }
    else{
        // Move randomly.
        var near_points = random_nearby();
        move_reckless(self, target, map, near_points);
    }
}
/** @type {TileGenerator} */
function claustropede_1_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.claustropede_1,
        pic: `${IMG_FOLDER.tiles}claustropede_1.png`,
        description: enemy_descriptions.claustropede,
        tags: new TagList(),
        health: 1,
        difficulty: 1,
        behavior: claustropede_ai,
        on_hit: claustropede_hit,
        telegraph: claustropede_telegraph,
        cycle: 0,
    }
}
/** @type {TileGenerator} */
function claustropede_2_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.claustropede_2,
        pic: `${IMG_FOLDER.tiles}claustropede_2.png`,
        description: enemy_descriptions.claustropede,
        tags: new TagList(),
        health: 2,
        difficulty: 7,
        behavior: claustropede_ai,
        on_hit: claustropede_hit,
        telegraph: claustropede_telegraph,
        cycle: 0,
    }
}
/** @type {TileGenerator} */
function claustropede_3_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.claustropede_3,
        pic: `${IMG_FOLDER.tiles}claustropede_3.png`,
        description: enemy_descriptions.claustropede,
        tags: new TagList(),
        health: 3,
        difficulty: 12,
        behavior: claustropede_ai,
        on_hit: claustropede_hit,
        telegraph: claustropede_telegraph,
        cycle: 0,
    }
}
/** @type {AIFunction} AI used by claustropedes.*/
function claustropede_ai(self, target, map){
    if(self.tile.cycle === 1){
        var copy_fun;
        switch(self.tile.health){
            case 1:
                copy_fun = claustropede_1_tile;
                break;
            case 2:
                copy_fun = claustropede_2_tile;
                break;
            default:
                throw new Error(ERRORS.invalid_value);
        }
        for(var i = 0; i < 2; ++i){
            map.attack(self.location);
            var copy = copy_fun();
            stun(copy);
            stun(copy);
            map.spawn_safely(copy, SAFE_SPAWN_ATTEMPTS, true);
        }
    }
    else{
        spider_ai(self, target, map);
    }
}

/** @type {AIFunction}*/
function claustropede_hit(self, target, map){
    self.tile.cycle = 1;
}

/** @type {TelegraphFunction} */
function claustropede_telegraph(location, map, self){
    if(self.cycle === 0){
        return spider_telegraph(location, map, self);
    }
    return [];
}
/** @type {TileGenerator} */
function clay_golem_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.clay_golem,
        pic: `${IMG_FOLDER.tiles}clay_golem.png`,
        description: enemy_descriptions.clay_golem,
        tags: new TagList(),
        health: 3,
        difficulty: 4,
        behavior: clay_golem_ai,
        telegraph: spider_telegraph,
        on_hit: clay_golem_hit,
        cycle: 1
    }
}

/** @type {AIFunction} AI used by clay golems.*/
function clay_golem_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference));
        self.tile.cycle = 1;
    }
    else if(self.tile.cycle === 1){
        // Otherwise, move closer if it didn't move last turn.
        move_closer_ai(self, target, map);
        self.tile.cycle = 0;
    }
    else{
        // Otherwise, it moved last turn so don't move.
        self.tile.cycle = 1;
    }
}
/** @type {AIFunction} Function used when clay golems are hit to stun them.*/
function clay_golem_hit(self, target, map){
    stun(self.tile);
}
/** @type {TileGenerator} */
function corrosive_caterpillar_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.corrosive_caterpillar,
        pic: `${IMG_FOLDER.tiles}corrosive_caterpillar.png`,
        description: enemy_descriptions.corrosive_caterpillar,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: corrosive_caterpillar_ai,
        on_death: corrosive_caterpillar_death
    }
}

/** @type {AIFunction} AI used by corrosive catterpillars.*/
function corrosive_caterpillar_ai(self, target, map){
    for(var i = 0; i < 2; ++i){
        var old_location = self.location.copy();
        var moved = move_careful(self, target, map, random_nearby());
        if(moved !== undefined){
            map.add_tile(corrosive_slime_tile(), old_location);
        }
    }
}
/** @type {AIFunction} Function used on corrosive catterpillar death to slime where they were.*/
function corrosive_caterpillar_death(self, target, map){
    map.add_tile(corrosive_slime_tile(), self.location);
}
/** @type {TileGenerator} */
function darkling_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.darkling,
        pic: `${IMG_FOLDER.tiles}darkling.png`,
        description: enemy_descriptions.darkling,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: darkling_ai,
        telegraph: darkling_telegraph
    }
}

/** @type {AIFunction} AI used by darklings.*/
function darkling_ai(self, target, map){
    if(self.tile.direction !== undefined){
        // Teleport to it's rift.
        var moved = map.move(self.location, self.tile.direction);
        if(moved){
            // If moved, attack around it.
            attack_around(self.tile.direction, map);
        }
        else{
            // If something is blocking the rift, it dies.
            map.attack(self.location);
            return;
        }
    }
    // Create a new rift for next turn.
    self.tile.direction = map.random_empty();
    var darkling_rift = function(map_to_use){
        if(self.tile.health === undefined || self.tile.health > 0){
            var rift = {
                pic: `${IMG_FOLDER.tiles}darkling_rift.png`,
                description: event_descriptions.darkling_rift,
                telegraph: spider_telegraph
            }
            map_to_use.mark_event(self.tile.direction, rift, false);
        }
    }
    map.add_event({name: event_names.darkling_rift, behavior: darkling_rift});
}

/** @type {TelegraphFunction} */
function darkling_telegraph(location, map, self){
    if(self.direction === undefined){
        return [];
    }
    return spider_telegraph(self.direction, map, self);
}
/** @type {TileGenerator}*/
function gem_crawler_tile(){
    var cycle = random_num(2);
    var pic_arr = [`${IMG_FOLDER.tiles}gem_crawler_recharging.png`, `${IMG_FOLDER.tiles}gem_crawler.png`];
    return {
        type: entity_types.enemy,
        name: enemy_names.gem_crawler,
        pic: pic_arr[cycle],
        display_pic: pic_arr[1],
        description: enemy_descriptions.gem_crawler,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        pic_arr,
        cycle,
        behavior: gem_crawler_ai,
        telegraph: gem_crawler_telegraph
    }
}

/** @type {AIFunction}*/
function gem_crawler_ai(self, target, map){
    if(self.tile.cycle === 1){
        move_closer_ai(self, target, map);
        if(target.difference.within_radius(1)){
            map.attack(self.location.plus(target.difference));
        }
    }
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}

/** @type {TelegraphFunction} */
function gem_crawler_telegraph(location, map, self){
    var attacks = [];
    if(self.cycle === 1){
        for(var direction of ALL_DIRECTIONS){
            var space = direction.plus(location);
            if(map.looks_empty(space)){
                // Shows all the spaces it can attack by moving other than the one it's in.
                attacks.push(
                    ...ALL_DIRECTIONS.map((p) => {
                        return p.plus(space);
                    }).filter((p) => {
                        return !point_equals(p, location);
                    })
                );
            }
        }
    }
    return attacks;
}
/** @type {TileGenerator} A crab which flees when hit. */
function igneous_crab_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.igneous_crab,
        pic: `${IMG_FOLDER.tiles}igneous_crab.png`,
        description: enemy_descriptions.igneous_crab,
        tags: new TagList(),
        health: 2,
        difficulty: 3,
        behavior: igneous_crab_ai,
        telegraph: igneous_crab_telegraph,
        on_hit: igneous_crab_hit,
        cycle: 0
    }
}

/** @type {AIFunction} AI used by igneous crabs.*/
function igneous_crab_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle > 0){
        var directions = reverse_arr(order_nearby(target.difference));
        move_reckless(self, target, map, directions);
        --self.tile.cycle;
    }
    else{
        if(target.difference.within_radius(1)){
            map.attack(self.location.plus(target.difference));
        }
        else{
            var directions = order_nearby(target.difference);
            move_careful(self, target, map, directions);
        }
    }
}
/** @type {AIFunction} Used to cause igneous crabs to flee when damaged.*/
function igneous_crab_hit(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    self.tile.cycle += 2;
}
/** @type {TelegraphFunction} Function to telegraph igneous crab attacks.*/
function igneous_crab_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle > 0){
        return [];
    }
    return spider_telegraph(location, map, self);
}
/** @type {TileGenerator} */
function living_tree_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.living_tree,
        pic: `${IMG_FOLDER.tiles}living_tree.png`,
        description: enemy_descriptions.living_tree,
        tags: new TagList(),
        health: 2,
        difficulty: 7,
        behavior: living_tree_ai,
        telegraph: living_tree_telegraph,
        cycle: random_num(2),
    }
}

/** @type {AIFunction} AI used by living trees.*/
function living_tree_ai(self, target, map){
    if(self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    // Checks if it can attack the player.
    var hits = point_rectangle(new Point(-2, -2), new Point(2, 2)).filter((p) => {
        return point_equals(p, target.difference);
    });
    if(hits.length > 0){
        map.attack(self.location.plus(target.difference));
        return;
    }
    if(self.tile.cycle === 0){
        self.tile.cycle = 1 - self.tile.cycle;
        throw new Error(ERRORS.skip_animation);
    }
    // Orders the places it could move.
    var directions = order_nearby(target.difference);
    if(target.difference.within_radius(1)){
        directions = reverse_arr(directions);
    }
    move_careful(self, target, map, directions);
    self.tile.cycle = 1 - self.tile.cycle;
}
/** @type {TelegraphFunction} Function to telegraph living tree attacks.*/
function living_tree_telegraph(location, map, self){
    var spaces = point_rectangle(new Point(-2, -2), new Point(2, 2));
    return spaces.map(p => {
        return p.plus(location);
    });
}
/** @type {TileGenerator} */
function living_tree_rooted_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.living_tree,
        pic: `${IMG_FOLDER.tiles}living_tree_rooted.png`,
        description: enemy_descriptions.living_tree_rooted,
        tags: new TagList(),
        health: 2,
        behavior: living_tree_rooted_ai,
        telegraph: living_tree_telegraph
    }
}

/** @type {AIFunction} AI used by living trees that are rooted.*/
function living_tree_rooted_ai(self, target, map){
    // Checks if it can attack the player.
    var hits = point_rectangle(new Point(-2, -2), new Point(2, 2)).filter((p) => {
        return point_equals(p, target.difference);
    });
    if(hits.length > 0){
        map.attack(self.location.plus(target.difference));
    }
    else{
        throw new Error(ERRORS.skip_animation);
    }
}
/** @type {TileGenerator} */
function magma_spewer_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}magma_spewer.png`, `${IMG_FOLDER.tiles}magma_spewer_firing.png`];
    var starting_cycle = random_num(pic_arr.length);
    return {
        type: entity_types.enemy,
        name: enemy_names.magma_spewer,
        pic: `${IMG_FOLDER.tiles}magma_spewer.png`,
        display_pic: pic_arr[1],
        description: enemy_descriptions.magma_spewer,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: magma_spewer_ai,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by magma spewers.*/
function magma_spewer_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        // Move away if the player gets close.
        if(target.difference.within_radius(2)){
            var directions = order_nearby(target.difference.times(-1));
            move_careful(self, target, map, directions);
        }
    }
    else{
        // Spew Magma.
        var locations = [];
        var center = self.location.plus(target.difference);
        if(GS.boons.has(boon_names.manic_presence) && chance(1, 2)){
            var miss = get_nearest_where(map, center, (t, p) => {
                return t.type === entity_types.enemy && !point_equals(p, self.location);
            });
            center = miss ? miss : center;
        }
        for(var i = -2; i <= 2; ++i){
            for(var j = -2; j <= 2; ++j){
                locations.push(center.plus(new Point(i, j)));
            }
        }
        map.add_event({
            name: event_names.falling_magma, 
            behavior: earthquake_event(random_num(4) + random_num(4) + 4, locations),
        });
        if(chance(1, 4)){
            map.add_event({name: event_names.falling_magma, behavior: targeted_earthquake_event([center])});
        }
    }
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}
/** @type {TileGenerator} */
function maw_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.maw,
        pic: `${IMG_FOLDER.tiles}maw.png`,
        description: enemy_descriptions.maw,
        tags: new TagList(),
        health: 4,
        difficulty: 3,
        behavior: maw_ai,
        telegraph: maw_telegraph,
        on_hit: maw_hit,
    }
}

/** @type {AIFunction} AI used by maws.*/
function maw_ai(self, target, map){
    if(target.difference.on_axis() && target.difference.within_radius(1)){
        map.attack(self.location.plus(target.difference));
        map.attack(self.location.plus(target.difference));
        map.attack(self.location.plus(target.difference));
    }
    else{
        var moves = order_nearby(target.difference).filter((p) => {
            return p.on_axis();
        });
        move_reckless(self, target, map, moves);
    }
}
/** @type {AIFunction}.*/
function maw_hit(self, target, map){
    stun(self.tile);
    stun(self.tile);
}
/** @type {TelegraphFunction} */
function maw_telegraph(location, map, self){
    return ORTHOGONAL_DIRECTIONS.map((p) => {
        return location.plus(p);
    });
}
/** @type {TileGenerator} */
function noxious_toad_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}noxious_toad_leaping.png`, `${IMG_FOLDER.tiles}noxious_toad.png`];
    var starting_cycle = random_num(pic_arr.length);
    return {
        type: entity_types.enemy,
        name: enemy_names.noxious_toad,
        pic: pic_arr[starting_cycle],
        display_pic: pic_arr[0],
        description: enemy_descriptions.noxious_toad, 
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: noxious_toad_ai,
        telegraph: noxious_toad_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by noxious toads.*/
function noxious_toad_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        var moves = order_nearby(target.difference).filter((p) => {
            return p.on_axis();
        }).map((p) => {
            return p.times(2);
        });
        var moved = move_reckless(self, target, map, moves);
        if(moved !== undefined){
            self.tile.cycle = 1;
            if(
                target.difference.within_radius(1) || 
                (GS.boons.has(boon_names.manic_presence) && chance(1, 2))
            ){
                // If it landed near the player, attack everything nearby.
                attack_around(self.location, map);
            }
        }
    }
    else{
        // Prepare to leap.
        self.tile.cycle = 0;
    }
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}

/** @type {TelegraphFunction} */
function noxious_toad_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var attacks = [];
    if(self.cycle === 1){
        return attacks;
    }
    for(var direction of ORTHOGONAL_DIRECTIONS){
        var move = location.plus(direction.times(2));
        if(map.looks_empty(move)){
            attacks.push(...spider_telegraph(move, map, self));
        }
    }
    return attacks;
}
/** @type {TileGenerator} */
function orb_of_insanity_tile(){
    var range = 2;
    var pic_arr = [`${IMG_FOLDER.tiles}orb_of_insanity_off.png`, `${IMG_FOLDER.tiles}orb_of_insanity_on.png`];
    return {
        type: entity_types.enemy,
        name: enemy_names.orb_of_insanity,
        pic: pic_arr[0],
        display_pic: pic_arr[1],
        description: enemy_descriptions.orb_of_insanity,
        tags:  new TagList([TAGS.unmovable]),
        health: 1,
        difficulty: 3,
        behavior: orb_of_insanity_ai,
        telegraph_other: orb_of_insanity_telegraph_other,
        pic_arr,
        range
    }
}

/** @type {AIFunction} AI used by Orbs of Insanity.*/
function orb_of_insanity_ai(self, target, map){
    if( self.tile.range === undefined ||
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var area = [
        ...point_rectangle(self.location.plus(-2, -2), self.location.plus(2, 2)),
        ...point_rectangle(self.location.plus(-1, -1), self.location.plus(1, 1)),
    ];
    var used = false;
    self.tile.pic = self.tile.pic_arr[1];
    for(var space of area){
        if(point_equals(space, self.location.plus(target.difference))){
            map.stun_tile(space);
            used = true;
        }
        else if(GS.boons.has(boon_names.manic_presence) && chance(1, 2)){
            used = used || map.stun_tile(space);
        }
    }
    if(!used){
        self.tile.pic = self.tile.pic_arr[0];
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {TelegraphFunction} */
function orb_of_insanity_telegraph_other(location, map, self){
    if(self.range === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var area = [];
    for(var i = -1 * self.range; i <= self.range; ++i){
        for(var j = -1 * self.range; j <= self.range; ++j){
            if(i !== 0 || j !== 0){
                area.push(location.plus(new Point(i, j)));
            }
        }
    }
    return area;
}
/** @type {TileGenerator} */
function paper_construct_tile(){
    return{
        type: entity_types.enemy,
        name: enemy_names.paper_construct,
        pic: `${IMG_FOLDER.tiles}paper_construct.png`,
        description: enemy_descriptions.paper_construct,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: paper_construct_ai,
        telegraph: porcuslime_orthogonal_telegraph,
        rotate: 90 * random_num(4),
    }
}

/** @type {AIFunction} AI used by scythes.*/
function paper_construct_ai(self, target, map){
    if(self.tile.rotate === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.difference.within_radius(2) && target.difference.on_axis()){
        // If the player is within range, attacks.
        var direction = sign(target.difference);
        var space = self.location.plus(direction);
        for(var i = 0; i < 2 && !map.attack(space) && map.check_empty(space); ++i){
            space.plus_equals(direction);
        }
    }
    else{
        // Choose a open direction nearest to towards the player.
        var directions = order_nearby(target.difference);
        var dir = undefined;
        for(var i = 0; i < directions.length && !dir; ++i){
            if(directions[i].on_diagonal() && map.check_empty(self.location.plus(directions[i]))){
                dir = directions[i];
            }
        }
        if(dir){
            // Move up to 2 spaces in that direction.
            var could_move = true;
            for(var i = 0; i < 2 && !(target.difference.on_axis() && target.difference.within_radius(2)) && could_move; ++i){
                var destination = self.location.plus(dir);
                could_move = map.check_empty(destination);
                if(could_move){
                    map.move(self.location, destination);
                    self.location.plus_equals(dir);
                    target.difference.minus_equals(dir);
                }
            }
        }
    }
    // Face it towards the player;
    self.tile.direction = order_nearby(target.difference).filter(p => {
        return p.on_axis();
    })[0];
    set_rotation(self.tile);
}
/** @type {TileGenerator}*/
function pheonix_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.pheonix,
        pic: `${IMG_FOLDER.tiles}pheonix.png`,
        description: enemy_descriptions.pheonix,
        tags: new TagList(),
        health: 1,
        difficulty: 5,
        behavior: pheonix_ai,
        telegraph: pheonix_telegraph,
        on_death: pheonix_death
    }
}

/** @type {AIFunction} AI used by pheonixes.*/
function pheonix_ai(self, target, map){
    var direction = new Point(0, 0);
    var distance = 0;
    if((target.difference.on_axis() || target.difference.on_diagonal()) && target.difference.within_radius(2)){
        // Sees the player and tries to attack them.
        var direction = sign(target.difference);
        if(map.check_empty(self.location.plus(direction.times(3)))){
            distance = 3;
        }
        else if(map.check_empty(self.location.plus(direction.times(2)))){
            distance = 2;
        }
    }
    var directions = order_nearby(target.difference);
    for(var i = 0; i < directions.length && distance === 0; ++i){
        // otherwise it flies towards them.
        direction = directions[i];
        for(var j = 3; j > 1 && distance === 0; --j){
            if(map.check_empty(self.location.plus(direction.times(j)))){
                distance = j;
            }
        }
    }
    if(distance > 0){
        map.move(self.location, self.location.plus(direction.times(distance)));
        for(var i = 0; i < distance; ++i){
            var space = self.location.plus(direction.times(i));
            map.attack(space);
            if(map.check_empty(space)){
                map.add_tile(raging_fire_tile(), space);
            }
        }
        self.location.plus_equals(direction.times(distance));
    }
}
/** @type {AIFunction} Spawns smoldering ashes on death.*/
function pheonix_death(self, target, map){
    map.add_tile(smoldering_ashes_tile(), self.location);
}
/** @type {TelegraphFunction} Function to telegraph pheonix attacks.*/
function pheonix_telegraph(location, map, self){
    var nearby = random_nearby();
    var telegraph = [];
    for(var direction of nearby){
        var distance = 0
        for(var j = 3; j > 1 && distance === 0; --j){
            if(map.looks_empty(location.plus(direction.times(j)))){
                distance = j;
            }
        }
        for(var i = 0; i < distance; ++i){
            telegraph.push(location.plus(direction.times(i)));
        }
    }
    return telegraph;
}
/** @type {TileGenerator} */
function large_porcuslime_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.porcuslime_large,
        pic: `${IMG_FOLDER.tiles}large_porcuslime.png`,
        description: enemy_descriptions.porcuslime_large,
        tags: new TagList(),
        health: 3,
        difficulty: 8,
        behavior: large_porcuslime_ai,
        telegraph: large_porcuslime_telegraph
    }
}

/** @type {AIFunction} AI used by large porcuslimes.*/
function large_porcuslime_ai(self, target, map){
    if(self.tile.health !== undefined && self.tile.health === 2){
        // If health is 2, turns into the medium version.
        map.attack(self.location);
        map.attack(self.location);
        map.clear_telegraphs();
        map.add_tile(medium_porcuslime_tile(), self.location);
        return;
    }
    if(self.tile.health !== undefined && self.tile.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(self.location);
        map.clear_telegraphs();
        spawn_nearby(map, small_d_porcuslime_tile(), self.location);
        spawn_nearby(map, small_o_porcuslime_tile(), self.location);
        return;
    }
    var direction = sign(target.difference);
    move_attack_ai(self, {tile: target.tile, difference: direction}, map);
}

/** @type {TelegraphFunction} */
function large_porcuslime_telegraph(location, map, self){
    return [
        ...porcuslime_diagonal_telegraph(location, map, self),
        ...porcuslime_orthogonal_telegraph(location, map, self),
    ];
}
/** @type {TileGenerator} */
function medium_porcuslime_tile(){
    var starting_cycle = random_num(2);
    var pic_arr = [`${IMG_FOLDER.tiles}medium_o_porcuslime.png`, `${IMG_FOLDER.tiles}medium_d_porcuslime.png`];
    return {
        type: entity_types.enemy,
        name: enemy_names.porcuslime_medium,
        pic: pic_arr[starting_cycle],
        display_pic: pic_arr[0],
        description: enemy_descriptions.porcuslime_medium,
        tags: new TagList(),
        health: 2,
        difficulty: 5,
        behavior: medium_porcuslime_ai,
        telegraph: medium_porcuslime_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by medium porcuslimes.*/
function medium_porcuslime_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.health !== undefined && self.tile.health === 1){
        // If health is 1, splits into one of each small version which spawn next to it.
        map.attack(self.location);
        map.clear_telegraphs();
        spawn_nearby(map, small_d_porcuslime_tile(), self.location);
        spawn_nearby(map, small_o_porcuslime_tile(), self.location);
        return;
    }
    if(self.tile.cycle === 0){
        // If cycle is at 0, direction will be orthogonally towards the player.
        porcuslime_orthogonal_ai(self, target, map);
    }
    else{
        // If cycle is at 1, direction will be diagonally towards the player.
        porcuslime_diagonal_ai(self, target, map);
    }
    // Swaps cycle and picture between the two.
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}

/** @type {TelegraphFunction} */
function medium_porcuslime_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle === 0){
        return porcuslime_orthogonal_telegraph(location, map, self);
    }
    return porcuslime_diagonal_telegraph(location, map, self);
}
/** @type {AIFunction} AI used by small and medium porcuslimes when moving diagonally.*/
function porcuslime_diagonal_ai(self, target, map){
    // Small version which moves then attacks diagonally.
    var directions = order_nearby(target.difference);
    var direction = undefined;
    for(var i = 0; i < directions.length && direction === undefined; ++i){
        // Finds the first diagonal direction.
        if(directions[i].on_diagonal()){
            direction = directions[i];
        }
    }
    move_attack_ai(self, {tile: target.tile, difference: direction}, map);
}
/** @type {AIFunction} AI used by small and medium porcuslimes when moving orthogonally.*/
function porcuslime_orthogonal_ai(self, target, map){
    var directions = order_nearby(target.difference);
    var direction = undefined;
    for(var i = 0; i < directions.length && direction === undefined; ++i){
        // Finds the first orthogonal direction.
        if(directions[i].on_axis()){
            direction = directions[i];
        }
    }
    move_attack_ai(self, {tile: target.tile, difference: direction}, map);
}

/** @type {TelegraphFunction} */
function porcuslime_diagonal_telegraph(location, map, self){
    return move_attack_telegraph(location, map, DIAGONAL_DIRECTIONS);
}
/** @type {TelegraphFunction} */
function porcuslime_orthogonal_telegraph(location, map, self){
    return move_attack_telegraph(location, map, ORTHOGONAL_DIRECTIONS);
}
/** @type {TileGenerator} */
function small_d_porcuslime_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.porcuslime_small,
        pic: `${IMG_FOLDER.tiles}small_d_porcuslime.png`,
        description: enemy_descriptions.porcuslime_small_d,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: porcuslime_diagonal_ai,
        telegraph: porcuslime_diagonal_telegraph,
    }
}
/** @type {TileGenerator} */
function small_o_porcuslime_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.porcuslime_small,
        pic: `${IMG_FOLDER.tiles}small_o_porcuslime.png`,
        description: enemy_descriptions.porcuslime_small_o,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: porcuslime_orthogonal_ai,
        telegraph: porcuslime_orthogonal_telegraph,
        }
}
/** @type {TileGenerator} */
function ram_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}ram.png`, `${IMG_FOLDER.tiles}ram_charge.png`];
    var starting_cycle = 0;
    return{
        type: entity_types.enemy,
        name: enemy_names.ram,
        pic: pic_arr[starting_cycle],
        display_pic: pic_arr[1],
        description: enemy_descriptions.ram,
        tags: new TagList(),
        health: 2,
        difficulty: 5,
        behavior: ram_ai,
        telegraph: ram_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by rams.*/
function ram_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var direction = sign(target.difference);
    var other_direction = sign(target.difference);
    var wander_speed = 2;
    var moved = true;
    var amount_moved = 0;
    if(self.tile.cycle === 0){
        // moves <wander_speed> closer to a row or column that the player is in.
        if(Math.abs(target.difference.x) <= Math.abs(target.difference.y)){
            direction.y = 0;
            other_direction.x = 0;
        }
        else{
            direction.x = 0;
            other_direction.y = 0;
        }
        for(var i = 0; i < wander_speed && !target.difference.on_axis() && moved; ++i){
            // Attempts to move towards the closest row or column that they are in.
            moved = map.move(self.location, self.location.plus(direction));
            if(moved){
                self.location.plus_equals(direction);
                target.difference.minus_equals(direction);
                ++amount_moved;
            }
        }
        if(amount_moved === 0){
            // Moves towards them instead.
            direction = other_direction;
            moved = true;
            for(var i = 0; i < wander_speed && !target.difference.on_axis() && moved; ++i){
                // Attempts to move towards the closest row or column that they are in.
                moved = map.move(self.location, self.location.plus(direction));
                if(moved){
                    self.location.plus_equals(direction);
                    target.difference.minus_equals(direction);
                    ++amount_moved;
                }
            }
        }

        if(target.difference.on_axis() || (GS.boons.has(boon_names.manic_presence) && chance(1, 2))){
            // If it sees them, prepares to charge.
            self.tile.cycle = 1;
            self.tile.pic = self.tile.pic_arr[self.tile.cycle];
        }
    }
    else{
        // Charges orthogonally until it hits something and rams it.
        // Reverts to wandering after.
        if(Math.abs(target.difference.x) > Math.abs(target.difference.y)){
            direction.y = 0;
        }
        else{
            direction.x = 0;
        }
        while(moved){
            moved = map.move(self.location, self.location.plus(direction));
            self.location.plus_equals(direction);
        }
        map.attack(self.location);
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[self.tile.cycle];
    }
}

/** @type {TelegraphFunction} */
function ram_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle === 0){
        return [];
    }
    return turret_o_telegraph(location, map, self);
}
/** @type {TileGenerator} */
function rat_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.rat,
        pic: `${IMG_FOLDER.tiles}rat.png`,
        description: enemy_descriptions.rat,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: rat_ai,
        telegraph: rat_telegraph,
        flip: chance(1, 2),
        cycle: 1
    }
}

/** @type {AIFunction} AI used by rats.*/
function rat_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.flip === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle >= 1 && target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference));
        self.tile.cycle = -1;
    }
    // Move 2 spaces.
    for(var i = 0; i < 2; ++i){
        var directions = order_nearby(target.difference);
        if(self.tile.cycle <= 0){
            // If they bit the player within 2 turns, move away. Otherwise move closer.
            directions = reverse_arr(directions);
        }
        var moved = move_reckless(self, target, map, directions);
        if(moved !== undefined){
            if(moved.x < 0){
                self.tile.flip = false;
            }
            if(moved.x > 0){
                self.tile.flip = true;
            }
        }
    }
    ++self.tile.cycle;
}

/** @type {TelegraphFunction} Function to telegraph rat attacks.*/
function rat_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle >= 1){
        return spider_telegraph(location, map, self);
    }
    return [];
}
/** @type {TileGenerator} */
function scorpion_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.scorpion,
        pic: `${IMG_FOLDER.tiles}scorpion.png`,
        description: enemy_descriptions.scorpion,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: scorpion_ai,
        telegraph: spider_telegraph,
        flip: chance(1, 2),
        cycle: random_num(2),
    }
}

/** @type {AIFunction} AI used by scorpion.*/
function scorpion_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.flip === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference));
        self.tile.cycle = 0;
        return;
    }
    // Move 2 spaces.
    if(self.tile.cycle === 1){
        for(var i = 0; i < 2; ++i){
            var directions = order_nearby(target.difference);
            var moved = move_careful(self, target, map, directions);
            if(moved !== undefined){
                if(moved.x < 0){
                    self.tile.flip = false;
                }
                if(moved.x > 0){
                    self.tile.flip = true;
                }
            }
        }
    }
    self.tile.cycle = 1 - self.tile.cycle;
    if(self.tile.cycle === 1){
        throw new Error(ERRORS.skip_animation);
    }
}
/** @type {TileGenerator} */
function scythe_tile(){
    return{
        type: entity_types.enemy,
        name: enemy_names.scythe,
        pic: `${IMG_FOLDER.tiles}scythe.png`,
        description: enemy_descriptions.scythe,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: scythe_ai,
        telegraph: scythe_telegraph,
        rotate: 90 * random_num(4),
    }
}

/** @type {AIFunction} AI used by scythes.*/
function scythe_ai(self, target, map){
    if(self.tile.rotate === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var distance = 3;
    self.tile.direction = sign(target.difference);
    if(self.tile.direction.on_axis()){
        // If the player is orthogonal, moves randomly.
        self.tile.direction = new Point(random_sign(), random_sign());
    }
    // Rotate image based on direction.
    var direction = self.tile.direction;
    set_rotation(self.tile);
    for(var i = 0; i < distance && map.move(self.location, self.location.plus(direction)) ; ++i){
        // moves <distance> spaces attacking each space it passes next to. Stops when blocked.
        self.location.plus_equals(direction);
        target.difference.minus_equals(direction);
        var passed = [new Point(direction.x, 0), new Point(0, direction.y)];
        for(var p of passed){
            if(
                point_equals(target.difference, p.times(-1)) || map.check_empty(self.location.minus(p)) ||
                (GS.boons.has(boon_names.manic_presence) && chance(1, 2))
            ){
                map.attack(self.location.minus(p));
            }
        }
    }
}

/** @type {TelegraphFunction} */
function scythe_telegraph(location, map, self){
    var attacks = [];
    for(var direction of DIAGONAL_DIRECTIONS){
        var current = location.copy();
        for(var i = 0; i < 3 && map.looks_empty(current.plus_equals(direction)); ++i){
            attacks.push(current.plus(direction.times(new Point(-1, 0))));
            attacks.push(current.plus(direction.times(new Point(0, -1))));
        }
    }
    return attacks;
}
/** @type {TileGenerator} */
function shadow_knight_tile(){
    return{
        type: entity_types.enemy,
        name: enemy_names.shadow_knight,
        pic: `${IMG_FOLDER.tiles}shadow_knight.png`,
        description: enemy_descriptions.shadow_knight,
        tags: new TagList(),
        health: 2,
        difficulty: 4,
        behavior: shadow_knight_ai,
        telegraph: shadow_knight_telegraph
    }
}

/** @type {AIFunction} AI used by shadow knights.*/
function shadow_knight_ai(self, target, map){
    // Moves in an L.
    if(target.difference.on_diagonal() && target.difference.within_radius(1)){
        // If the player is next to it diagonally, attempty to reposition to attack them next turn.
        if(map.move(self.location, self.location.plus(sign(target.difference).times(new Point(2, -1)))) ||
           map.move(self.location, self.location.plus(sign(target.difference).times(new Point(-1, 2))))){
            return;
        }
    }
    if(target.difference.taxicab_distance() === 3 && !target.difference.on_axis()){
        // If the player is a L away, attack them then move from their location.
        map.attack(self.location.plus(target.difference));
        var possible_moves = randomize_arr(L_SHAPES.map((p) => {
            return target.difference.plus(p);
        }));
        move_careful(self, target, map, possible_moves);
        return;
    }
    // Otherwise, attempt to move closer
    if(Math.abs(target.difference.x) >= Math.abs(target.difference.y)){
        var new_dir = new Point(2, 1);
    }
    else{
        var new_dir = new Point(1, 2);
    }
    if(target.difference.x < 0){
        new_dir.x *= -1;
    }
    if(target.difference.y < 0){
        new_dir.y *= -1;
    }
    if(!map.move(self.location, self.location.plus(new_dir))){
        var directions = randomize_arr(L_SHAPES);
        for(var i = 0; i < directions.length && (self.tile.health === undefined || self.tile.health > 0); ++i){
            if(map.move(self.location, self.location.plus(directions[i]))){
                self.location.plus_equals(directions[i]);
                return;
            }
        }
    }
}

/** @type {TelegraphFunction} */
function shadow_knight_telegraph(location, map, self){
    var attacks = [];
    var Ls = [new Point(1, 2), new Point(2, 1)];
    for(var L of  Ls){
        for(var transformation of DIAGONAL_DIRECTIONS){
            attacks.push(L.times(transformation).plus(location));
        }
    }
    return attacks;
}
const L_SHAPES = [new Point(1, 2), new Point(-1, 2), new Point(1, -2), new Point(-1, -2),
                  new Point(2, 1), new Point(-2, 1), new Point(2, -1), new Point(-2, -1)];

/** @type {TelegraphFunction} */
function shadow_knight_telegraph(location, map, self){
    var attacks = [];
    var Ls = [new Point(1, 2), new Point(2, 1)];
    for(var L of  Ls){
        for(var transformation of DIAGONAL_DIRECTIONS){
            attacks.push(L.times(transformation).plus(location));
        }
    }
    return attacks;
}
/** @type {TileGenerator} */
function shadow_knight_elite_tile(){
    return{
        type: entity_types.enemy,
        name: enemy_names.shadow_knight_elite,
        pic: `${IMG_FOLDER.tiles}shadow_knight_elite.png`,
        description: enemy_descriptions.shadow_knight_elite,
        tags: new TagList(),
        health: 2,
        difficulty: 6,
        behavior: shadow_knight_elite_ai,
        telegraph: shadow_knight_telegraph
    }
}

/** @type {AIFunction} AI used by shadow knights.*/
function shadow_knight_elite_ai(self, target, map){
    var player_location = self.location.plus(target.difference);
    var possible_moves = L_SHAPES.map((p) => {
        return self.location.plus(p);
    });

    // If player can be attacked, attack then move to a random space an L away from them.
    var attack = possible_moves.filter((p) => {
        return point_equals(p, player_location);
    });
    if(attack.length > 0){
        map.attack(player_location);
        var possible_moves = randomize_arr(L_SHAPES.map((p) => {
            return target.difference.plus(p);
        }));
        move_careful(self, target, map, possible_moves);
        return;
    }
    // If it can move to a square that can attack the player next turn, do so.
    var setup_attack = possible_moves.filter((p) => {
        if(p.minus(player_location).taxicab_distance() === 3){
            var hits = L_SHAPES.filter((p2) => {
                return point_equals(p2.plus(p), player_location);
            });
            if(hits.length > 0 && map.check_empty(p)){
                return true;
            }
        }
        return false;
    });
    if(setup_attack.length > 0){
        map.move(self.location, setup_attack[0]);
        return;
    }
    // Order moves based off of proximity to player.
    var ordered_moves = possible_moves.filter((p) => {
        return map.check_empty(p);
    }).toSorted((p1, p2) => {
        var distance_1 = p1.minus(player_location).taxicab_distance();
        var distance_2 = p2.minus(player_location).taxicab_distance();
        return distance_1 - distance_2;
    });
    // If there are no legal moves, don't move.
    if(ordered_moves.length === 0){
        return;
    }
    // If next to the player, move away.
    if(target.difference.within_radius(1)){
        map.move(self.location, ordered_moves[ordered_moves.length - 1]);
        return;
    }
    // Oterwise, move closer
    map.move(self.location, ordered_moves[0]);
}
/** @type {TileGenerator} */
function shadow_scout_tile(){
    var starting_cycle = random_num(2);
    return {
        type: entity_types.enemy,
        name: enemy_names.shadow_scout,
        pic: `${IMG_FOLDER.tiles}shadow_scout.png`,
        description: enemy_descriptions.shadow_scout,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: shadow_scout_ai,
        telegraph: spider_telegraph,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by shadow scouts.*/
function shadow_scout_ai(self, target, map){
    if( self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    self.tile.cycle = 1 - self.tile.cycle;
    // Goes invisible on alternate turns.
    self.tile.look = self.tile.cycle === 1 ? empty_tile() : undefined;
    self.tile.cycle === 1 ? self.tile.tags.add(TAGS.hidden) : self.tile.tags.remove(TAGS.hidden);
    spider_ai(self, target, map);
}
/** @type {TileGenerator}*/
function specter_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.specter,
        pic: `${IMG_FOLDER.tiles}specter.png`,
        description: enemy_descriptions.specter,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: specter_ai,
        telegraph: specter_telegraph
    }
}

/** @type {AIFunction} AI used by specters.*/
function specter_ai(self, target, map){
    if(target.difference.on_axis()){
        // If orthogonal, move towards player.
        var locations = get_specter_moves(self.location, sign(target.difference), map);
        var moved = specter_move(self.location, locations, map);
        if(moved){
            return;
        }
    }
    var dir1 = sign(new Point(target.difference.x, 0));
    var dir2 = sign(new Point(0, target.difference.y));
    var direction = random_from([dir1, dir2]);
    var target_location = self.location.plus(target.difference);
    var locations = get_specter_moves(self.location, direction, map);
    for(var i = 0; i < locations.length; ++i){
        // If it can move to the same axis as the player, and the destination is not next
        //  to them do so.
        if(
            map.check_empty(locations[i]) && 
            target_location.minus(locations[i]).on_axis() &&
            !target_location.minus(locations[i]).within_radius(1)
        ){
            specter_move(self.location, locations.slice(0, i + 1), map);
            return;
        }
    }
    if(
        locations.length > 0 &&
        point_equals(sign(target.difference), sign(target_location.minus(locations[locations.length - 1]))) &&
        !target_location.minus(locations[locations.length - 1]).within_radius(1)
    ){
        // If it can move towards the player's axis at full speed without ending next to them, 
        // or passing them do so.
        specter_move(self.location, locations, map);
        return;
    }
    var directions = order_nearby(target.difference).reverse().filter((p) => {return p.on_axis()});
    for(var direction of directions){
        var locations = get_specter_moves(self.location, direction, map);
        if(locations.length > 0){
            // Try to move away from the player.
            specter_move(self.location, locations, map);
            return;
        }
    }
}

function get_specter_moves(current, direction, map){
    var locations = [];
    var last_open = 0;
    for(var i = 0; i < 3; ++i){
        current = current.plus(direction);
        if(map.is_in_bounds(current)){
            locations.push(current);
            if(map.check_empty(current)){
                last_open = locations.length;
            }
            else{
                i -= 1;
            }
        }
    }
    return locations.splice(0, last_open);
}

function specter_move(current, passing, map){
    if(passing.length === 0){
        return false;
    }
    var destination = passing.pop();
    map.move(current, destination);
    current.set(destination);
    for(var location of passing){
        map.stun_tile(location);
        map.attack(location);
    }
    return true;
}

/** @type {TelegraphFunction} Telegraph can see hidden onjects cause I don't want to redo the get moves function*/
function specter_telegraph(location, map, self){
    var attacks = [];
    for(var direction of ORTHOGONAL_DIRECTIONS){
        attacks.push(...get_specter_moves(location, direction, map));
    }
    return attacks;
}
/** @type {TileGenerator} */
function spider_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.spider,
        pic: `${IMG_FOLDER.tiles}spider.png`,
        description: enemy_descriptions.spider,
        tags: new TagList(),
        health: 1,
        difficulty: 1,
        behavior: spider_ai,
        telegraph: spider_telegraph
    }
}

/** @type {AIFunction} AI used by spiders and the Spider Queen.*/
function spider_ai(self, target, map){
    if(target.difference.within_radius(1)){
        // If the player is next to it, attack.
        map.attack(self.location.plus(target.difference));
    }
    else{
        // Otherwise, move closer.
        move_closer_ai(self, target, map);
    }
}

/** @type {TelegraphFunction} */
function spider_telegraph(location, map, self){
    return ALL_DIRECTIONS.map(a => a.plus(location));
}
/** @type {TileGenerator} */
function spider_web_tile(){
    return{
        type: entity_types.enemy,
        name: enemy_names.spider_web,
        pic: `${IMG_FOLDER.tiles}spider_web.png`,
        description: enemy_descriptions.spider_web,
        tags:  new TagList([TAGS.unmovable]),
        health: 1,
        difficulty: 4,
        behavior: spider_web_ai,
        cycle: 0,
        spawn_timer: 2,
    }
}

/** @type {AIFunction} AI used by spider webs.*/
function spider_web_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spawn_timer === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle < self.tile.spawn_timer){
        // If the cycle hasn't reached the spawn timer, increments it.
        ++self.tile.cycle;
        throw new Error(ERRORS.skip_animation);
    }
    else{
        // Attempts to spawn a spider nearby and resets cycle.
        spawn_nearby(map, spider_tile(), self.location);
        self.tile.cycle = 0;
        ++self.tile.spawn_timer;
    }
}
const STARCALLER_TIMER = 4;

/** @type {TileGenerator} */
function starcaller_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}starcaller_off.png`, `${IMG_FOLDER.tiles}starcaller_on.png`];
    var starting_cycle = random_num(STARCALLER_TIMER) + 1;
    var summons = [
        carrion_flies_tile,
        shatter_sphere_d_tile,
        shatter_sphere_o_tile,
        moon_rock_tile,
    ];
    return {
        type: entity_types.enemy,
        name: enemy_names.starcaller,
        pic: `${IMG_FOLDER.tiles}starcaller_off.png`,
        display_pic: pic_arr[1],
        description: enemy_descriptions.starcaller,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: starcaller_ai,
        pic_arr,
        cycle: starting_cycle,
        summons
    }
}

/** @type {AIFunction} AI used by starcallers.*/
function starcaller_ai(self, target, map){
    if(self.tile.cycle === 0){
        // Shoot
        map.attack(self.tile.direction);
        if(map.check_empty(self.tile.direction)){
            var spawn = random_from(self.tile.summons)();
            map.add_tile(spawn, self.tile.direction);
        }
        self.tile.cycle = STARCALLER_TIMER;
        self.tile.pic = self.tile.pic_arr[0];
    }
    else if(self.tile.cycle === 1){
        // Prep to shoot next turn.
        self.tile.pic = self.tile.pic_arr[1];
        self.tile.direction = self.location.plus(target.difference);
        if(GS.boons.has(boon_names.manic_presence) && chance(1, 2)){
            var miss = get_nearest_where(map, self.tile.direction, (t, p) => {
                return t.type === entity_types.enemy && !point_equals(p, self.location);
            });
            self.tile.direction = miss ? miss : self.tile.direction;
        }
        var starfall = function(map_to_use){
            if(self.tile.health === undefined || self.tile.health > 0){
                var destination = {
                    pic: `${IMG_FOLDER.tiles}starcaller_rift.png`,
                    description: event_descriptions.starfall,
                    telegraph: hazard_telegraph
                }
                map_to_use.mark_event(self.tile.direction, destination, false);
            }
        }
        map.add_event({name: event_names.starfall, behavior: starfall});
    }
    --self.tile.cycle;
    if(self.tile.cycle !== 0 && self.tile.cycle !== STARCALLER_TIMER){
        throw new Error(ERRORS.skip_animation);
    }
}
/** @type {TileGenerator} */
function strider_tile(){
    return{
        type: entity_types.enemy,
        name: enemy_names.strider,
        pic: `${IMG_FOLDER.tiles}strider.png`,
        description: enemy_descriptions.strider,
        tags: new TagList(),
        health: 2,
        difficulty: 4,
        behavior: strider_ai,
        telegraph: strider_telegraph
    }
}

/** @type {AIFunction} AI used by strider.*/
function strider_ai(self, target, map){
    if(chance(1, 2)){
        var moves = random_nearby();
    }
    else{
        var moves = order_nearby(target.difference);
    }
    moves = moves.map(move => move.times(2));
    for(let move of moves){
        if(point_equals(move, target.difference)){
            map.attack(self.location.plus(target.difference));
        }
    }
    move_careful(self, target, map, moves);
}

/** @type {TelegraphFunction} */
function strider_telegraph(location, map, self){
    var attacks = random_nearby();
    return attacks.map(attack => location.plus(attack.times(2)));
}
/** @type {TileGenerator} */
function swaying_nettle_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}swaying_nettle_x.png`, `${IMG_FOLDER.tiles}swaying_nettle_+.png`];
    var starting_cycle = random_num(2);
    return{
        type: entity_types.enemy,
        name: enemy_names.swaying_nettle,
        pic: pic_arr[starting_cycle],
        display_pic: pic_arr[0],
        description: enemy_descriptions.swaying_nettle,
        tags: new TagList([TAGS.unmovable, TAGS.nettle_immune]),
        health: 1,
        difficulty: 1,
        behavior: swaying_nettle_ai,
        telegraph: swaying_nettle_telegraph,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction} AI used by swaying nettles.*/
function swaying_nettle_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var attacks = self.tile.cycle === 0 ? DIAGONAL_DIRECTIONS : ORTHOGONAL_DIRECTIONS;
    for(var attack of attacks){
        var target_space = self.location.plus(attack);
        if(
            (map.is_in_bounds(target_space) && !map.get_tile(target_space).tags.has(TAGS.nettle_immune)) ||
            (GS.boons.has(boon_names.manic_presence) && chance(1, 2))
        ){
            map.attack(target_space);
        }
    }
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
}

/** @type {TelegraphFunction} */
function swaying_nettle_telegraph(location, map, self){
    if( self.cycle === undefined || 
        self.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var targets = self.cycle === 0 ? DIAGONAL_DIRECTIONS : ORTHOGONAL_DIRECTIONS;
    return targets.map(target => {
        return target.plus(location);
    });
}
/** @type {TileGenerator} */
function thorn_bush_tile(){
    return{
        type: entity_types.enemy,
        name: enemy_names.thorn_bush,
        pic: `${IMG_FOLDER.tiles}thorn_bush.png`,
        description: enemy_descriptions.thorn_bush,
        tags: new TagList([TAGS.unmovable, TAGS.thorn_bush_roots]),
        health: 2,
        difficulty: 5,
        behavior: thorn_bush_ai,
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}

/** @type {AIFunction} AI used by thorn bushes.*/
function thorn_bush_ai(self, target, map){
    var current = self.location;
    for(var i = 0; i < 30 && !map.check_empty(current); ++i){
        var next = current.plus(random_nearby()[0]);
        if(map.is_in_bounds(next)){
            var space = map.get_tile(next);
            if(
                space.tags.has(TAGS.thorn_bush_roots) || 
                (space.type === entity_types.empty && chance(1, 4))
            ){
                current = next;
            }
        }
    }
    if(map.check_empty(current)){
        map.add_tile(thorn_bramble_tile(), current);
    }
}
/** @type {TileGenerator} */
function moving_turret_d_tile(){
    var direction = random_from(DIAGONAL_DIRECTIONS).copy();
    var tile = {
        type: entity_types.enemy,
        name: enemy_names.turret_m,
        pic: `${IMG_FOLDER.tiles}moving_turret_d.png`,
        description: enemy_descriptions.turret_m,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: moving_turret_d_ai,
        telegraph: moving_turret_d_telegraph,
        rotate: 0,
        direction
    }
    set_rotation(tile);
    return tile;
}

/** @type {AIFunction} AI used by moving turrets that shoot diagonally.*/
function moving_turret_d_ai(self, target, map){
    if( self.tile.rotate === undefined || 
        self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    // If the player is on the diagonal and not in the direction of travel, fire.
    if( 
        target.difference.on_diagonal() && 
        !point_equals(sign(target.difference), self.tile.direction) &&
        !point_equals(sign(target.difference), self.tile.direction.times(-1))
    ){
        turret_fire_ai(self, target, map);
    }
    else if(GS.boons.has(boon_names.manic_presence)){
        var dirs = [
            self.tile.direction.rotate(90),
            self.tile.direction.rotate(270),
        ];
        for(var p of dirs){
            if(chance(1, 2)){
                turret_fire_ai(self, {difference: p}, map);
            }
        }
    }

    // Try to move. Change direction if it hits something.
    if(!map.move(self.location, self.location.plus(self.tile.direction))){
        self.tile.direction.times_equals(-1);
        set_rotation(self.tile);
    }
}

/** @type {TelegraphFunction} */
function moving_turret_d_telegraph(location, map, self){
    var attacks = [];
    for(var direction of [self.direction.rotate(90), self.direction.rotate(-90)]){
        attacks.push(...look_at_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {TileGenerator} */
function moving_turret_o_tile(){
    var direction = random_from(ORTHOGONAL_DIRECTIONS).copy();
    var tile = {
        type: entity_types.enemy,
        name: enemy_names.turret_m,
        pic: `${IMG_FOLDER.tiles}moving_turret_o.png`,
        description: enemy_descriptions.turret_m,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: moving_turret_o_ai,
        telegraph: moving_turret_o_telegraph,
        rotate: 0,
        direction
    }
    set_rotation(tile);
    return tile;
}

/** @type {AIFunction} AI used by moving turrets that shoot orthogonally.*/
function moving_turret_o_ai(self, target, map){
    if( self.tile.rotate === undefined || 
        self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    // If the player is on the axis and not in the direction of travel, fire.
    if( 
        target.difference.on_axis() && 
        !point_equals(sign(target.difference), self.tile.direction) &&
        !point_equals(sign(target.difference), self.tile.direction.times(-1))
    ){
        turret_fire_ai(self, target, map);
    }
    else if(GS.boons.has(boon_names.manic_presence)){
        var dirs = [
            self.tile.direction.rotate(90),
            self.tile.direction.rotate(270),
        ];
        for(var p of dirs){
            if(chance(1, 2)){
                turret_fire_ai(self, {difference: p}, map);
            }
        }
    }

    // Try to move. Change direction if it hits something.
    if(!map.move(self.location, self.location.plus(self.tile.direction))){
        self.tile.direction.times_equals(-1);
        set_rotation(self.tile);
    }
}

/** @type {TelegraphFunction} */
function moving_turret_o_telegraph(location, map, self){
    var attacks = [];
    for(var direction of [self.direction.rotate(90), self.direction.rotate(-90)]){
        attacks.push(...look_at_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {AIFunction} AI used by all turrets to fire towards the player.*/
function turret_fire_ai(self, target, map){
    // Fires a shot in the direction of the player.
    var direction = sign(target.difference);
    for(var space = self.location.plus(direction); !map.attack(space) && map.check_empty(space); space.plus_equals(direction)){}
}
/** @type {TileGenerator} */
function turret_d_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.turret,
        pic: `${IMG_FOLDER.tiles}turret_d.png`,
        description: enemy_descriptions.turret_d,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: turret_d_ai,
        telegraph: turret_d_telegraph
    }
}

/** @type {AIFunction} AI used by turrets that shoot diagonally.*/
function turret_d_ai(self, target, map){
    // Turret version that shoots diagonally.
    if(target.difference.on_diagonal()){
        turret_fire_ai(self, target, map);
    }
    else if(GS.boons.has(boon_names.manic_presence)){
        for(var p of DIAGONAL_DIRECTIONS){
            if(chance(1, 2)){
                turret_fire_ai(self, {difference: p}, map);
            }
        }
    }
    else{
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {TelegraphFunction} */
function turret_d_telegraph(location, map, self){
    var attacks = [];
    for(var direction of DIAGONAL_DIRECTIONS){
        attacks.push(...look_at_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {TileGenerator} */
function turret_o_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.turret,
        pic: `${IMG_FOLDER.tiles}turret_o.png`,
        description: enemy_descriptions.turret_h,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: turret_o_ai,
        telegraph: turret_o_telegraph
    }
}

/** @type {AIFunction} AI used by turrets that shoot orthogonally.*/
function turret_o_ai(self, target, map){
    // Turret version that shoots orthogonally.
    if(target.difference.on_axis()){
        turret_fire_ai(self, target, map);
    }
    else if(GS.boons.has(boon_names.manic_presence)){
        for(var p of ORTHOGONAL_DIRECTIONS){
            if(chance(1, 2)){
                turret_fire_ai(self, {difference: p}, map);
            }
        }
    }
    else{
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {TelegraphFunction} */
function turret_o_telegraph(location, map, self){
    var attacks = [];
    for(var direction of ORTHOGONAL_DIRECTIONS){
        attacks.push(...look_at_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {TileGenerator} */
function turret_r_tile(){
    var pic_arr = [
        `${IMG_FOLDER.tiles}turret_r_N_S_counterclockwise.png`,
        `${IMG_FOLDER.tiles}turret_r_NW_SE_counterclockwise.png`,
        `${IMG_FOLDER.tiles}turret_r_N_S.png`, 
        `${IMG_FOLDER.tiles}turret_r_NW_SE.png`
    ];
    var tile = {
        type: entity_types.enemy,
        name: enemy_names.turret_r,
        pic: pic_arr[0],
        display_pic: pic_arr[0],
        description: enemy_descriptions.turret_r,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: turret_r_ai,
        telegraph: turret_r_telegraph,
        pic_arr,
        rotate: 0,
        direction: random_nearby()[0],
        spin_direction: random_sign(),
    }
    tile.pic = pic_arr[1 + tile.spin_direction + set_rotation(tile)];
    return tile;
}

/** @type {AIFunction} AI used by turrets that rotate.*/
function turret_r_ai(self, target, map){
    if( self.tile.rotate === undefined || 
        self.tile.pic_arr === undefined || 
        self.tile.direction === undefined || 
        self.tile.spin_direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var fired = false;
    if((target.difference.on_axis() || target.difference.on_diagonal())){
        // Shoot if player is along the line of the current direction or it's opposite.
        if(point_equals(self.tile.direction, sign(target.difference))){
            turret_fire_ai(self, target, map);
            fired = true;
        }
        else if(point_equals(self.tile.direction.times(-1), sign(target.difference))){
            turret_fire_ai(self, {difference: self.tile.direction.times(-1)}, map);
            fired = true;
        }
    }
    if(!fired && GS.boons.has(boon_names.manic_presence)){
        var dirs = [
            self.tile.direction,
            self.tile.direction.times(-1),
        ];
        for(var p of dirs){
            if(chance(1, 2)){
                turret_fire_ai(self, {difference: p}, map);
            }
        }
    }
    // Rotate 45 degrees in the correct direction.
    self.tile.direction = sign(self.tile.direction.plus(self.tile.direction.rotate(90 * self.tile.spin_direction)));
    self.tile.pic = self.tile.pic_arr[1 + self.tile.spin_direction + set_rotation(self.tile)];
}

/** @type {TelegraphFunction} */
function turret_r_telegraph(location, map, self){
    if(self.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    return [
        ...look_at_points_in_direction(location, self.direction, map),
        ...look_at_points_in_direction(location, self.direction.times(-1), map),
    ];
}
/** @type {TileGenerator} */
function unspeakable_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.unspeakable,
        pic: `${IMG_FOLDER.tiles}unspeakable.png`,
        description: enemy_descriptions.unspeakable,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: move_closer_ai,
        telegraph_other: unspeakable_telegraph,
        on_death: unspeakable_death,
    }
}

/** @type {AIFunction} Function used when unspeakableas die to confuse the player.*/
function unspeakable_death(self, target, map){
    confusion_spell(self, {difference: new Point(0, 0)}, map)
}

/** @type {TelegraphFunction} */
function unspeakable_telegraph(location, map, self){
    return [new Point(0, 0), ...ALL_DIRECTIONS].map((p) => {return p.plus(location)});
}
/** @type {TileGenerator} */
function unstable_wisp_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.unstable_wisp,
        pic: `${IMG_FOLDER.tiles}unstable_wisp.png`, 
        description: enemy_descriptions.unstable_wisp,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: unstable_wisp_ai,
        telegraph_other: spider_telegraph,
        on_death: unstable_wisp_death,
    }
}

/** @type {AIFunction}*/
function unstable_wisp_ai(self, target, map){
    var start = self.location.copy();
    var directions = random_nearby();
    var moved = move_careful(self, target, map, directions);
    if(moved !== undefined && chance(1, 2)){
        // Chance to shoot a fireball after moving.
        moved.times_equals(-1);
        var fireball = shoot_fireball(moved);
        map.add_tile(fireball, start);
    }
}

/** @type {AIFunction} Function used when unstable wisps die to explode and send out fireballs.*/
function unstable_wisp_death(self, target, map){
    var attacks = random_nearby();
    var fireballs = [];
    for(var dir of attacks){
        var spawnpoint = self.location.plus(dir);
        if(!map.attack(spawnpoint)){
            var fireball = shoot_fireball(dir);
            fireball.stun = 1; // Gets around unstunnable.
            stun(fireball);
            map.add_tile(fireball, spawnpoint);
            fireballs.push(fireball);
        }
    }
    var unstun = (map_to_use) => {
        for(var fireball of fireballs){
            fireball.stun = undefined;
        }
    }
    map.add_event({name: event_names.unstun, behavior: unstun});
}
/** @type {TileGenerator} */
function vampire_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.vampire,
        pic: `${IMG_FOLDER.tiles}vampire.png`,
        description: enemy_descriptions.vampire,
        tags: new TagList(),
        health: 2,
        max_health: 2,
        difficulty: 5,
        behavior: vampire_ai,
        telegraph: vampire_telegraph,
        on_hit: vampire_hit
    }
}

/** @type {AIFunction} AI used by vampires.*/
function vampire_ai(self, target, map){
    if( self.tile.health === undefined || 
        self.tile.max_health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var player_pos = self.location.plus(target.difference);
    var target_spaces = [new Point(player_pos.x + 1, player_pos.y + 1), 
                        new Point(player_pos.x - 1, player_pos.y + 1), 
                        new Point(player_pos.x + 1, player_pos.y - 1), 
                        new Point(player_pos.x - 1, player_pos.y - 1)];
    target_spaces = randomize_arr(target_spaces);
    var moved = false;
    var health = self.tile.health;
    for(var i = 0; i < target_spaces.length && !moved && health === self.tile.health; ++i){
        // Tries to move to a nearby space from which it can attack the player.
        var space = target_spaces[i];
        var target_distance = space.minus(self.location);
        if(target_distance.taxicab_distance() === 1){
            moved = map.move(self.location, space);
        }
    }
    // If you moved into range, attack and heal.
    if(moved && map.attack(self.location.plus(target.difference))){
        map.heal(space, 1);
    } 
    if(!moved && health === self.tile.health){
        // If it hasn't moved yet, just moves closer to the player.
        var directions = order_nearby(target.difference);
        for(var i = 0; i < directions.length && !moved  && health === self.tile.health; ++i){
            var direction = directions[i];
            if(direction.on_axis()){
                moved = map.move(self.location, self.location.plus(direction));
            }
        }
    }
}
/** @type {AIFunction} Function used when a vampire is hit to teleport it away.*/
function vampire_hit(self, target, map){
    if(self.tile.health !== undefined && self.tile.health > 0){
        stun(self.tile);
        teleport_spell(self, target, map);
    }
}

/** @type {TelegraphFunction} */
function vampire_telegraph(location, map, self){
    var attacks = [];
    for(var move_direction of ORTHOGONAL_DIRECTIONS){
        var move = location.plus(move_direction);
        if(map.looks_empty(move)){
            for(var attack_direction of DIAGONAL_DIRECTIONS){
                attacks.push(move.plus(attack_direction));
            }
        }
    }
    return attacks;
}
/** @type {TileGenerator} */
function vinesnare_bush_tile(){
    var range = 3;
    var pic_arr = [`${IMG_FOLDER.tiles}vinesnare_bush_lashing.png`, `${IMG_FOLDER.tiles}vinesnare_bush_rooted.png`];
    var starting_cycle = 1;
    return {
        type: entity_types.enemy,
        name: enemy_names.vinesnare_bush,
        pic: pic_arr[starting_cycle],
        display_pic: pic_arr[0],
        description: enemy_descriptions.vinesnare_bush,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        difficulty: 2,
        behavior: vinesnare_bush_ai,
        telegraph: vinesnare_bush_telegraph,
        telegraph_other: vinesnare_bush_telegraph_other,
        pic_arr,
        cycle: starting_cycle,
        range
    }
}

/** @type {AIFunction} AI used by vinesnare bushes.*/
function vinesnare_bush_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined ||
        self.tile.range === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.difference.within_radius(1)){
        // If 1 away, attack if not rooted, otherwise uproot.
        if(self.tile.cycle === 0){
            map.attack(self.location.plus(target.difference));
            return;
        }
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[0];
        return;
    }
    var moved = false;
    if(self.tile.cycle > 0 && target.difference.within_radius(self.tile.range) && !target.tile.tags.has(TAGS.unmovable)){
        var direction = sign(target.difference);
        if(target.difference.on_axis() || target.difference.on_diagonal()){
            // If the player is orthogonal or diagonal and within range, drag them closer.
            for(
                var i = Math.max(Math.abs(target.difference.x), Math.abs(target.difference.y));
                i > 1 && map.move(self.location.plus(direction.times(i)), self.location.plus(direction.times(i - 1)));
                --i
            ){
                moved = true;
            }
        }
    }
    if(moved){
        // If the player was moved, uproot and pass the turn to them.
        self.tile.cycle = 0;
        self.tile.pic = self.tile.pic_arr[0];
        throw new Error(ERRORS.pass_turn);
    }
    if(++self.tile.cycle > 0){
        // Otherwise, root.
        self.tile.pic = self.tile.pic_arr[1];
        throw new Error(ERRORS.skip_animation);
    }
}

/** @type {TelegraphFunction} */
function vinesnare_bush_telegraph(location, map, self){
    if( self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle === 0){
        return spider_telegraph(location, map, self);
    }
    return [];
}
/** @type {TelegraphFunction} */
function vinesnare_bush_telegraph_other(location, map, self){
    if( self.cycle === undefined ||
        self.range === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var vines = [];
    if(self.cycle === 0){
        return vines;
    }
    for(var direction of ALL_DIRECTIONS){
        for(var i = 2; i <= self.range; ++i){
            vines.push(location.plus(direction.times(i)));
        }
    }
    return vines;
}
/** @type {TileGenerator} */
function walking_prism_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}walking_prism_o.png`, `${IMG_FOLDER.tiles}walking_prism_d.png`];
    var description_arr = enemy_descriptions.walking_prism;
    var starting_cycle = random_num(pic_arr.length);
    return {
        type: entity_types.enemy,
        name: enemy_names.walking_prism,
        pic: pic_arr[starting_cycle],
        display_pic: pic_arr[1],
        description: `${description_arr[0]}${description_arr[1 + starting_cycle]}`, 
        tags: new TagList(),
        health: 2,
        difficulty: 3,
        behavior: walking_prism_ai,
        on_hit: walking_prism_on_hit,
        telegraph_other: walking_prism_telegraph,
        pic_arr,
        description_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction}.*/
function walking_prism_ai(self, target, map){
    if( self.tile.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(!target.difference.within_radius(1)){
        // If not next to player, moves towards them.
        move_closer_ai(self, target, map);
    }
    else{
        // If near the player, moves randomly.
        var near_points = random_nearby();
        for(var i = 0; i < near_points.length && !map.move(self.location, self.location.plus(near_points[i])); ++i){}
    }
}

/** @type {AIFunction}.*/
function walking_prism_on_hit(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        var directions = ORTHOGONAL_DIRECTIONS;
    }
    else{
        var directions = DIAGONAL_DIRECTIONS;
    }
    // Changes cycle.
    self.tile.cycle = 1 - self.tile.cycle;
    self.tile.pic = self.tile.pic_arr[self.tile.cycle];
    self.tile.description = `${self.tile.description_arr[0]}${self.tile.description_arr[1 + self.tile.cycle]}`

    // Attacks in a + or x depending on the old cycle.
    for(var direction of directions){
        for(var space = self.location.plus(direction); !map.attack(space) && map.check_empty(space); space.plus_equals(direction)){}
    }
}

/** @type {TelegraphFunction} */
function walking_prism_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.cycle === 0){
        return turret_o_telegraph(location, map, self);
    }
    return turret_d_telegraph(location, map, self);
}
/** @type {TileGenerator} */
function wheel_of_fire_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.wheel_of_fire,
        pic: `${IMG_FOLDER.tiles}wheel_of_fire.png`,
        description: enemy_descriptions.wheel_of_fire,
        tags: new TagList(),
        health: 1,
        difficulty: 6,
        behavior: wheel_of_fire_ai,
        telegraph: wheel_of_fire_telegraph
    }
}

/** @type {AIFunction} AI used by Wheels of Fire.*/
function wheel_of_fire_ai(self, target, map){
    if(target.difference.within_radius(1)){
        // Player is nearby.
        var moves = reverse_arr(order_nearby(target.difference));
        move_careful(self, target, map, moves);
    }
    else if((target.difference.on_axis() || target.difference.on_diagonal())){
        // Aiming at player.
        var direction = sign(target.difference);
        var hit = false;
        for(var space = self.location.plus(direction); !hit; space.plus_equals(direction)){
            hit = map.attack(space);
            if(map.check_empty(space)){
                var fire = raging_fire_tile();
                map.add_tile(fire, space);
            }
            else{
                hit = true;
            }
        }
    }
    else if(GS.boons.has(boon_names.manic_presence) && chance(1, 2)){
        // Misfire.
        var direction = sign(random_from(ALL_DIRECTIONS));
        var hit = false;
        for(var space = self.location.plus(direction); !hit; space.plus_equals(direction)){
            hit = map.attack(space);
            if(map.check_empty(space)){
                var fire = raging_fire_tile();
                map.add_tile(fire, space);
            }
            else{
                hit = true;
            }
        }
    }
    else{
        move_careful(self, target, map, random_nearby());
    }
}

/** @type {TelegraphFunction} */
function wheel_of_fire_telegraph(location, map, self){
    var dir_arrs = ALL_DIRECTIONS.map((p) => {
        return look_at_points_in_direction(location, p, map);
    });
    var attacks = [];
    for(var arr of dir_arrs){
        attacks.push(...arr);
    }
    attacks = attacks.filter((p) => {
        var nearby = p.minus(location).within_radius(1);
        var full = !map.looks_empty(p);
        var player = point_equals(p, map.get_player_location());
        return !nearby || (full && !player);
    });
    return attacks;
}
function altar_on_enter(f){
    return (self, target, map) => {
        if(target.tile.type === entity_types.player || target.tile.tags.has(TAGS.boss)){
            self.tile.health = 1;
            map.attack(self.location);
            var boss_tile = get_boss(map);
            if(boss_tile !== undefined){
                boss_tile.tags.remove(TAGS.hidden);
                boss_tile.look = undefined;
            }
            f(self, target, map);
        }
    }
}

function get_boss(map){
    var locations = [];
    cross(range(0, FLOOR_WIDTH), range(0, FLOOR_HEIGHT), (x, y) => {
        locations.push(new Point(x, y));
    });
    locations = locations.filter((p) => {
        return map.get_tile(p).tags.has(TAGS.boss);
    });
    return locations.length > 0 ? map.get_tile(locations[0]) : undefined;
}
/** @type {TileGenerator}*/
function altar_of_scouring_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_scouring,
        pic: `${IMG_FOLDER.tiles}altar_of_scouring.png`,
        description: other_tile_descriptions.altar_of_scouring,
        tags: new TagList([TAGS.altar, TAGS.obstruction]),
        health: 1,
        on_enter: altar_on_enter(altar_of_scouring_on_enter),
    }
}

function altar_of_scouring_on_enter(self, target, map){
    var left = self.location.x;
    var right = FLOOR_WIDTH - left;
    var top = self.location.y;
    var bottom = FLOOR_HEIGHT - top;
    var max = Math.max(left, right, top, bottom);
    switch(max){
        case left:
            for(var i = 0; i < FLOOR_HEIGHT; ++i){
                var spawnpoint = new Point(0, i);
                map.attack(spawnpoint);
                if(map.check_empty(spawnpoint)){
                    map.add_tile(shoot_fireball(new Point(1, 0)), spawnpoint);
                }
            }
            break;
        case right:
            for(var i = 0; i < FLOOR_HEIGHT; ++i){
                var spawnpoint = new Point(FLOOR_WIDTH - 1, i);
                map.attack(spawnpoint);
                if(map.check_empty(spawnpoint)){
                    map.add_tile(shoot_fireball(new Point(-1, 0)), spawnpoint);
                }
            }
            break;
        case bottom:
            for(var i = 0; i < FLOOR_WIDTH; ++i){
                var spawnpoint = new Point(i, FLOOR_HEIGHT- 1);
                map.attack(spawnpoint);
                if(map.check_empty(spawnpoint)){
                    map.add_tile(shoot_fireball(new Point(0, -1)), spawnpoint);
                }
            }
            break;
        case top:
            for(var i = 0; i < FLOOR_WIDTH; ++i){
                var spawnpoint = new Point(i, 0);
                map.attack(spawnpoint);
                if(map.check_empty(spawnpoint)){
                    map.add_tile(shoot_fireball(new Point(0, 1)), spawnpoint);
                }
            }
            break;
    }
}
/** @type {TileGenerator}*/
function altar_of_shadow_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_shadow,
        pic: `${IMG_FOLDER.tiles}altar_of_shadow.png`,
        description: other_tile_descriptions.altar_of_shadow,
        tags: new TagList([TAGS.altar, TAGS.obstruction]),
        health: 1,
        on_enter: altar_on_enter(altar_of_shadow_on_enter),
    }
}

function altar_of_shadow_on_enter(self, target, map){
    var boss_tile = get_boss(map);
    if(boss_tile !== undefined){
        boss_tile.tags.add(TAGS.hidden);
        boss_tile.look = empty_tile();
    }
}

/** @type {TileGenerator}*/
function altar_of_singularity_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_singularity,
        pic: `${IMG_FOLDER.tiles}altar_of_singularity.png`,
        description: other_tile_descriptions.altar_of_singularity,
        tags: new TagList([TAGS.altar, TAGS.obstruction]),
        health: 1,
        on_enter: altar_on_enter(altar_of_singularity_on_enter),
    }
}

function altar_of_singularity_on_enter(self, target, map){
    var mark = {
        pic: `${IMG_FOLDER.tiles}black_hole_beginning.png`,
        description: event_descriptions.black_hole,
        telegraph: hazard_telegraph
    }
    var fall = function(location){
        return function(map_to_use){
            map_to_use.attack(location);
            if(map_to_use.check_empty(location)){
                map_to_use.add_tile(black_hole_tile(), location);
            }
        }
    }
    var delay = (map_to_use) => {
        var destination = self.location;
        map_to_use.mark_event(destination, mark);
        map_to_use.add_event({name: event_names.black_hole, behavior: fall(destination)});
    }
    // If this is the last altar, wait an extra turn so the lord can summon then move.
    var wait = get_nearest_altar(map, self.location) === undefined ? 2 : 1;
    map.add_event({name: event_names.black_hole, behavior: delay_event(wait, delay)});
}
/** @type {TileGenerator}*/
function altar_of_space_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_space,
        pic: `${IMG_FOLDER.tiles}altar_of_space.png`,
        description: other_tile_descriptions.altar_of_space,
        tags: new TagList([TAGS.altar, TAGS.obstruction]),
        health: 1,
        on_enter: altar_on_enter(altar_of_space_on_enter),
    }
}

function altar_of_space_on_enter(self, target, map){
    var warp = (map_to_use) => {
        var to_move = [];
        cross(range(0, FLOOR_WIDTH), range(0, FLOOR_HEIGHT), (x, y) => {
            to_move.push(new Point(x, y));
        });
        to_move = to_move.filter((p) => {
            return !map_to_use.get_tile(p).tags.has(TAGS.unmovable);
        });
        for(var p of to_move){
            teleport_spell({location: p}, undefined, map_to_use);
        }
    }
    map.add_event({name: event_names.warp , behavior: warp});
}
/** @type {TileGenerator}*/
function altar_of_stars_tile(){
    var summons = [
        carrion_flies_tile,
        shatter_sphere_d_tile,
        shatter_sphere_o_tile,
        moon_rock_tile,
    ];
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_stars,
        pic: `${IMG_FOLDER.tiles}altar_of_stars.png`,
        description: other_tile_descriptions.altar_of_stars,
        tags: new TagList([TAGS.altar, TAGS.obstruction]),
        health: 1,
        on_enter: altar_on_enter(altar_of_stars_on_enter),
        summons
    }
}

function altar_of_stars_on_enter(self, target, map){
    var mark = {
        pic: `${IMG_FOLDER.tiles}starcaller_rift.png`,
        description: event_descriptions.starfall,
        telegraph: hazard_telegraph
    }
    var fall = function(location){
        return function(map_to_use){
            map_to_use.attack(location);
            if(map_to_use.check_empty(location)){
                map_to_use.add_tile(random_from(self.tile.summons)(), location);
            }
        }
    }
    var delay = (map_to_use) => {
        var destination = map_to_use.get_player_location();
        if(GS.boons.has(boon_names.manic_presence) && chance(1, 2)){
            var miss = get_nearest_where(map, destination, (t, p) => {
                return t.type === entity_types.enemy && !point_equals(p, self.location);
            });
            destination = miss ? miss : destination;
        }
        map_to_use.mark_event(destination, mark);
        map_to_use.add_event({name: event_names.starfall, behavior: fall(destination)});
    }
    for(var i = 0; i < 3; ++i){
        map.add_event({name: event_names.starfall, behavior: delay_event(i + 1, delay)});
    }
}
/** @type {TileGenerator}*/
function altar_of_stasis_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_stasis,
        pic: `${IMG_FOLDER.tiles}altar_of_stasis.png`,
        description: other_tile_descriptions.altar_of_stasis,
        tags: new TagList([TAGS.altar, TAGS.obstruction]),
        health: 1,
        on_enter: altar_on_enter(altar_of_stasis_on_enter),
    }
}

function altar_of_stasis_on_enter(self, target, map){
    cross(range(0, FLOOR_WIDTH), range(0, FLOOR_HEIGHT), (x, y) => {
        var space = new Point(x, y);
        var tile = map.get_tile(space);
        if(tile.tags.has(TAGS.boss)){
            map.heal(space, 3);
        }
        if(tile.tags.has(TAGS.altar)){
            map.heal(space, 1);
        }
    });
}
/** @type {TileGenerator}*/
function altar_of_sunlight_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_sunlight,
        pic: `${IMG_FOLDER.tiles}altar_of_sunlight.png`,
        description: other_tile_descriptions.altar_of_sunlight,
        tags: new TagList([TAGS.altar, TAGS.obstruction]),
        health: 1,
        on_enter: altar_on_enter(altar_of_sunlight_on_enter),
    }
}

function altar_of_sunlight_on_enter(self, target, map){
    var mark = {
        pic: `${IMG_FOLDER.tiles}sunlight.png`,
        description: event_descriptions.sunlight,
        telegraph: hazard_telegraph
    }
    var fire = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
                if(map_to_use.check_empty(location)){
                    map_to_use.add_tile(raging_fire_tile(), location);
                }
            }
        }
    }
    var delay = (points) => {
        return (map_to_use) => {
            for(var point of points){
                map_to_use.mark_event(point, mark);
            }
            map_to_use.add_event({name: other_tile_names.raging_fire, behavior: fire(points)});
        }
    } 
    var target = map.get_player_location();
    if(GS.boons.has(boon_names.manic_presence) && chance(1, 2)){
        var miss = get_nearest_where(map, target, (t, p) => {
            return t.type === entity_types.enemy && !point_equals(p, self.location);
        });
        target = miss ? miss : target;
    }
    for(var i = 0; i < 3; ++i){
        var rectangle = point_rectangle(target.plus(new Point(i, i)), target.plus(new Point(-i, -i)));
        rectangle = rectangle.filter((p) => {
            return map.is_in_bounds(p);
        });
        map.add_event({name: event_names.delay, behavior: delay_event(i + 1, delay(rectangle))});
    }
}
/** @type {TileGenerator} */
function black_hole_tile(){
    return {
        type: entity_types.enemy,
        name: other_tile_names.black_hole,
        pic: `${IMG_FOLDER.tiles}black_hole.png`,
        description: other_tile_descriptions.black_hole,
        health: 6,
        tags: new TagList([TAGS.unmovable, TAGS.obstruction, TAGS.unstunnable]),
        behavior: black_hole_ai,
        telegraph_other: black_hole_telegraph_other,
    }
}

/** @type {AIFunction}.*/
function black_hole_ai(self, target, map){
    var moved_player = false;
    var spaces = [];
    for(var i = 2; i < Math.max(FLOOR_HEIGHT, FLOOR_WIDTH); ++i){
        var rectangle = point_rectangle(new Point(i, i), new Point(-i, -i)).map((p) => {
            return self.location.plus(p);
        }).filter((p) => {
            return map.is_in_bounds(p);
        });
        spaces.push(...rectangle);
    }
    for(var start of spaces){
        var end = start.plus(sign(self.location.minus(start)));
        if(!map.get_tile(start).tags.has(TAGS.unmovable) && !map.get_tile(start).tags.has(TAGS.boss)){
            var moved = map.move(start, end);
            if(moved && map.get_tile(end).type === entity_types.player){
                moved_player = true;
            }
        }
    }
    map.attack(self.location);
    if(moved_player){
        throw new Error(ERRORS.pass_turn);
    }
}

/** @type {TelegraphFunction} */
function black_hole_telegraph_other(location, map, self){
    spaces = [];
    for(var i = 2; i < Math.max(FLOOR_HEIGHT, FLOOR_WIDTH); ++i){
        spaces.push(...point_rectangle(
            location.plus(new Point(i, i)), 
            location.plus(new Point(-i, -i))
        ));
    }
    return spaces;
}
/** @type {TileGenerator}.*/
function bookshelf_tile(){
    var health = random_num(2) + 2;
    var pic_arr = [
        `${IMG_FOLDER.tiles}bookshelf_empty.png`, 
        `${IMG_FOLDER.tiles}bookshelf_half.png`, 
        `${IMG_FOLDER.tiles}bookshelf_full.png`
    ];
    return {
        type: entity_types.terrain,
        name: other_tile_names.bookshelf,
        pic: pic_arr[health - 1],
        description: other_tile_descriptions.bookshelf,
        tags: new TagList([TAGS.unmovable, TAGS.obstruction]),
        health,
        on_hit: bookshelf_on_hit,
        pic_arr
    }
}

/** @type {AIFunction} Function used when a wall is damaged to update it's image.*/
function bookshelf_on_hit(self, target, map){
    if(self.tile.pic_arr === undefined ||
        self.tile.health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.health > 0){
        self.tile.pic = self.tile.pic_arr[Math.min(2, self.tile.health - 1)];
    }
    var boss_cards = get_boss_cards();
    var card_list = [
        ...BASIC_CARDS, 
        ...CONFUSION_CARDS, 
        ...COMMON_CARDS, 
        ...get_all_achievement_cards(), 
        ...boss_cards.filter((c) => {return !c().options.has_action_type(action_types.heal)})
    ];
    var card = randomize_arr(card_list)[0]();
    GS.give_temp_card(card);
    GS.refresh_deck_display();
}
/** @type {TileGenerator} A damaged wall that might spawn something on death.*/
function coffin_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.coffin,
        pic: `${IMG_FOLDER.tiles}coffin.png`,
        description: other_tile_descriptions.coffin,
        tags: new TagList([TAGS.unmovable, TAGS.obstruction]),
        health: 1,
        on_enter: decay_ai,
        on_death: coffin_tile_death,
        summons: [rat_tile, carrion_flies_tile, vampire_tile, appropriate_chest_tile],
        card_drops: get_all_achievement_cards(),
    }
}

/** @type {AIFunction} Function used when a coffin is disturbed to potentially spawn something.*/
function coffin_tile_death(self, target, map){
    if( self.tile.summons === undefined ||
        self.tile.card_drops === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var new_enemy = random_from(self.tile.summons)();
    if(new_enemy.type === entity_types.chest){
        var cards = rand_no_repeats(self.tile.card_drops, 1 + 2 * GS.boons.has(boon_names.larger_chests));
        for(let card of cards){
            add_card_to_chest(new_enemy, card());
        }
    }
    else{
        stun(new_enemy);
    }
    map.add_tile(new_enemy, self.location);
}
/** @type {TileGenerator} A hazardous pool of slime that can be cleared by attacking.*/
function corrosive_slime_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.corrosive_slime,
        pic: `${IMG_FOLDER.tiles}corrosive_slime.png`,
        description: other_tile_descriptions.corrosive_slime,
        tags: new TagList([TAGS.unmovable, TAGS.obstruction]),
        health: 1,
        telegraph: hazard_telegraph,
        on_enter: corrosive_slime_on_enter
    }
}

/** @type {AIFunction} AI used by spider webs.*/
function corrosive_slime_on_enter(self, target, map){
    hazard(self, target, map);
    decay_ai(self, target, map);
}
/** @type {TileGenerator} A fireball that travels in a straight line until it hits something. Direction is not yet set.*/
function fireball_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}fireball_n.png`, `${IMG_FOLDER.tiles}fireball_nw.png`];
    return {
        type: entity_types.enemy,
        name: other_tile_names.fireball,
        pic: pic_arr[0],
        display_pic: pic_arr[0],
        description: other_tile_descriptions.fireball,
        tags: new TagList([TAGS.fireball, TAGS.unstunnable]),
        behavior: fireball_ai,
        telegraph: fireball_telegraph,
        on_enter: fireball_on_enter,
        pic_arr,
        rotate: 0,
        direction: undefined
    }
}

/** @type {AIFunction}  AI used by fireballs.*/
function fireball_ai(self, target, map){
    if(self.tile.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(!map.move(self.location, self.location.plus(self.tile.direction))){
        // When it hits something, explodes and damages it.
        map.attack(self.location.plus(self.tile.direction));
        self.tile.health = 1;
        map.attack(self.location);
    }
}
/** @type {AIFunction} Function used by fireballs to blow up when soemthing tries to move onto them.*/
function fireball_on_enter(self, target, map){
    hazard(self, target, map);
    self.tile.health = 1;
    map.attack(self.location);
}

/** @type {TelegraphFunction} */
function fireball_telegraph(location, map, self){
    if(self.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    return [location.plus(self.direction), ...hazard_telegraph(location, map, self)];
}

/**
 * Function to create a fireball and point it in the right direction.
 * @param {Point} direction Where it's headed.
 * @returns {Tile} The new fireball.
 */
function shoot_fireball(direction){
    var fireball = fireball_tile();
    fireball.direction = direction;
    fireball.pic = ifexists(fireball.pic_arr)[set_rotation(fireball)];
    return fireball;
}
/** @type {TileGenerator} A healing fruit that spawns enemies.*/
function enticing_fruit_tree_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.fruit_tree_enticing,
        pic: `${IMG_FOLDER.tiles}enticing_fruit_tree.png`,
        description: other_tile_descriptions.fruit_tree_enticing,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        on_enter: enticing_fruit_tree_on_enter,
        summons: FRUIT_TREE_SUMMONS
    }
}

/** @type {AIFunction} AI used when the player moves onto the fruit tree.*/
function enticing_fruit_tree_on_enter(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.tile.type !== entity_types.player){
        return;
    }
    map.heal(self.location.plus(target.difference), 1);
    var spawns = random_num(2) + random_num(2);
    for(var i = 0; i < spawns; ++i){
        var new_spawn = random_from(self.tile.summons)();
        stun(new_spawn);
        spawn_nearby(map, new_spawn, self.location);
    }
    decay_ai(self, target, map);
}
const FRUIT_TREE_SUMMONS = [
    carrion_flies_tile, 
    ram_tile, 
    living_tree_tile, 
    scythe_tile, 
    scorpion_tile, 
    spider_tile
];
/** @type {TileGenerator} A healing fruit that spawns enemies.*/
function rotting_fruit_tree_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.fruit_tree_rotting,
        pic: `${IMG_FOLDER.tiles}rotting_fruit_tree.png`,
        description: other_tile_descriptions.fruit_tree_rotting,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        on_enter: decay_ai,
        on_death: rotting_fruit_tree_on_death,
        summons: FRUIT_TREE_SUMMONS
    }
}

/** @type {AIFunction} AI used when the fruit tree is moved on or destroyed.*/
function rotting_fruit_tree_on_death(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(chance(2, 5)){
        var new_spawn = random_from(self.tile.summons)();
        stun(new_spawn);
        spawn_nearby(map, new_spawn, self.location);
    }
}
/** @type {TileGenerator} A hazardous pool of lava.*/
function lava_pool_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.lava_pool,
        pic: `${IMG_FOLDER.tiles}lava_pool.png`,
        description: other_tile_descriptions.lava_pool,
        tags: new TagList([TAGS.unmovable]),
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}
/** @type {TileGenerator} A sturdy wall.*/
function magmatic_boulder_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.magmatic_boulder,
        pic: `${IMG_FOLDER.tiles}magmatic_boulder.png`,
        description: other_tile_descriptions.magmatic_boulder,
        tags: new TagList([TAGS.unmovable]),
    }
}
/** @type {TileGenerator} */
function moon_rock_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.moon_rock,
        pic: `${IMG_FOLDER.tiles}moon_rock.png`,
        description: other_tile_descriptions.moon_rock,
        tags: new TagList([TAGS.obstruction]),
        health: 1,
    }
}
/** @type {TileGenerator} A fire which goes away over time. */
function raging_fire_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}raging_fire_weak.png`, `${IMG_FOLDER.tiles}raging_fire.png`];
    var health = 2;
    return {
        type: entity_types.enemy,
        name: other_tile_names.raging_fire,
        pic: pic_arr[health - 1],
        display_pic: pic_arr[1],
        description: other_tile_descriptions.raging_fire,
        tags: new TagList([TAGS.unmovable, TAGS.unstunnable, TAGS.obstruction]),
        health,
        behavior: decay_ai,
        telegraph: hazard_telegraph,
        on_enter: hazard,
        on_hit: raging_fire_hit,
        pic_arr
    }
}

/** @type {AIFunction}  AI used by fireballs.*/
function raging_fire_hit(self, target, map){
    if( self.tile.health === undefined ||
        self.tile.pic_arr === undefined
    ){
        throw new Error(ERRORS.missing_property);
    }
    var intensity = Math.min(self.tile.health - 1, self.tile.pic_arr.length);
    if(intensity >= 0){
        self.tile.pic = self.tile.pic_arr[intensity];
    }
}
/** @type {TileGenerator} Pushes things away.*/
function repulsor_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}repulsor.png`, `${IMG_FOLDER.tiles}repulsor_reloading.png`];
    var starting_cycle = 0;
    return {
        type: entity_types.enemy,
        name: other_tile_names.repulsor,
        pic: pic_arr[starting_cycle],
        description: other_tile_descriptions.repulsor,
        tags: new TagList([TAGS.unmovable, TAGS.obstruction]),
        behavior: repulsor_ai,
        telegraph_other: repulsor_telegraph_other,
        on_enter: repulsor_push_ai,
        on_hit: repulsor_push_ai,
        pic_arr,
        cycle: starting_cycle,
    }
}

/** @type {AIFunction} Pushes nearby creatures away.*/
function repulsor_push_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle > 0){
        return;
    }
    var player_was_moved = false;
    var activated = false;
    var spaces = random_nearby();
    for(var space of spaces){
        var target_space = self.location.plus(space);
        if(map.is_in_bounds(target_space)){
            var target_tile = map.get_tile(target_space);
            if(!target_tile.tags.has(TAGS.unmovable)){
                if(target_tile.type === entity_types.player){
                    player_was_moved = true;
                }
                activated = true;
                self.tile.cycle = 3;
                self.tile.pic = self.tile.pic_arr[1];
                try {
                    // Push the creature away.
                    for(var i = 0; i < 2 && map.move(target_space, target_space.plus(space)); ++i){
                        target_space.plus_equals(space);
                    }
                } catch (error) {
                    // Catches ERRORS.pass_turn errors to prevent ping pong between 2.
                    // Catches ERRORS.creature_died errors in case it moves a enemy into lava.
                    if(error.message !== ERRORS.pass_turn && error.message !== ERRORS.creature_died){
                        throw error;
                    }
                }
            }
        }
    }
    if(player_was_moved){
        throw new Error(ERRORS.pass_turn);
    }
}

/** @type {AIFunction} AI used by repulsor.*/
function repulsor_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle > 0){
        --self.tile.cycle;
        if(self.tile.cycle === 0){
            self.tile.pic = self.tile.pic_arr[0];
        }
        return;
    }
    repulsor_push_ai(self, target, map);
}
/** @type {TelegraphFunction} */
function repulsor_telegraph_other(location, map, self){
    if( self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spaces = [];
    if(self.cycle === 0){
        spaces = random_nearby();
        spaces = spaces.map((space) => space.plus(location));
        spaces.push(location);
    }
    return spaces;
}
/** @type {TileGenerator} Spawns corrosive slime nearby.*/
function sewer_grate_tile(){
    return{
        type: entity_types.enemy,
        name: other_tile_names.sewer_grate,
        pic: `${IMG_FOLDER.tiles}sewer_grate.png`,
        description: other_tile_descriptions.sewer_grate,
        tags: new TagList([TAGS.unmovable, TAGS.unstunnable]),
        behavior: sewer_grate_ai,
    }
}

/** @type {AIFunction} AI used by spider webs.*/
function sewer_grate_ai(self, target, map){
    var spawned = spawn_nearby(map, corrosive_slime_tile(), self.location);
    if(spawned === undefined){
        throw new Error(ERRORS.skip_animation);
    }
}
/** @type {TileGenerator} */
function shatter_sphere_tile(){
    return random_from([shatter_sphere_d_tile, shatter_sphere_o_tile])();
}
/** @type {TileGenerator} */
function shatter_sphere_d_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.shatter_sphere,
        pic: `${IMG_FOLDER.tiles}shatter_sphere_d.png`,
        description: other_tile_descriptions.shatter_sphere_d,
        tags: new TagList([TAGS.obstruction]),
        health: 1,
        telegraph_other: shatter_sphere_d_telegraph,
        on_death: shatter_sphere_d_death,
    }
}

/** @type {AIFunction}*/
function shatter_sphere_d_death(self, target, map){
    var attacks = randomize_arr(DIAGONAL_DIRECTIONS);
    for(var attack of attacks){
        map.attack(self.location.plus(attack));
    }
}

/** @type {TelegraphFunction} */
function shatter_sphere_d_telegraph(location, map, self){
    return DIAGONAL_DIRECTIONS.map(a => a.plus(location));
}
/** @type {TileGenerator} */
function shatter_sphere_o_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.shatter_sphere,
        pic: `${IMG_FOLDER.tiles}shatter_sphere_o.png`,
        description: other_tile_descriptions.shatter_sphere_o,
        tags: new TagList([TAGS.obstruction]),
        health: 1,
        telegraph_other: shatter_sphere_o_telegraph,
        on_death: shatter_sphere_o_death,
    }
}

/** @type {AIFunction}*/
function shatter_sphere_o_death(self, target, map){
    var attacks = randomize_arr(ORTHOGONAL_DIRECTIONS);
    for(var attack of attacks){
        map.attack(self.location.plus(attack));
    }
}

/** @type {TelegraphFunction} */
function shatter_sphere_o_telegraph(location, map, self){
    return ORTHOGONAL_DIRECTIONS.map(a => a.plus(location));
}
/** @type {TileGenerator} Dropped by Pheonixes to respawn them. */
function smoldering_ashes_tile(){
    var spawn_timer = 2;
    var desc = other_tile_descriptions.smoldering_ashes;
    return {
        type: entity_types.enemy,
        name: other_tile_names.smoldering_ashes,
        pic: `${IMG_FOLDER.tiles}smoldering_ashes.png`,
        description: `${desc[0]}${spawn_timer}${desc[1]}`,
        tags: new TagList([TAGS.obstruction]),
        health: 1,
        behavior: smoldering_ashes_ai,
        on_enter: decay_ai,
        description_arr: desc,
        cycle: 0,
        spawn_timer
    }
}

/** @type {AIFunction} AI used by smoldering ashes.*/
function smoldering_ashes_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.spawn_timer === undefined ||
        self.tile.description_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle < self.tile.spawn_timer){
        // If the cycle hasn't reached the spawn timer, increments it.
        ++self.tile.cycle;
        self.tile.description = `${self.tile.description_arr[0]}${self.tile.spawn_timer - self.tile.cycle}${self.tile.description_arr[1]}`
        throw new Error(ERRORS.skip_animation);
    }
    else{
        // Dies and spawns a pheonix.
        map.attack(self.location);
        map.add_tile(pheonix_tile(), self.location);
    }
}
/** @type {TileGenerator} */
function thorn_bramble_tile(){
    return{
        type: entity_types.terrain,
        name: other_tile_names.thorn_bramble,
        pic: `${IMG_FOLDER.tiles}thorn_bramble.png`,
        description: other_tile_descriptions.thorn_bramble,
        tags: new TagList([TAGS.unmovable, TAGS.thorn_bush_roots, TAGS.obstruction]),
        health: 1,
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}
/** @type {TileGenerator} A damaged wall that might spawn something on death.*/
function damaged_wall_tile(){
    var health = random_num(2) + 1;
    var pic_arr = [`${IMG_FOLDER.tiles}very_damaged_wall.png`, `${IMG_FOLDER.tiles}damaged_wall.png`];
    return {
        type: entity_types.terrain,
        name: other_tile_names.wall_damaged,
        pic: pic_arr[health - 1],
        description: other_tile_descriptions.wall_damaged,
        tags: new TagList([TAGS.unmovable, TAGS.obstruction]),
        health,
        on_hit: damaged_wall_on_hit,
        on_death: damaged_wall_death,
        pic_arr,
        summons: [spider_tile, acid_bug_tile, spider_web_tile, rat_tile, scythe_tile],
    }
}

/** @type {AIFunction} Function used when a wall is damaged to update it's image.*/
function damaged_wall_on_hit(self, target, map){
    if(self.tile.pic_arr === undefined ||
        self.tile.health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.health > 0){
        self.tile.pic = self.tile.pic_arr[Math.min(1, self.tile.health - 1)];
    }}

/** @type {AIFunction} Function used when a damaged wall is destroyed to potentially spawn something.*/
function damaged_wall_death(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(chance(3, 4)){
        var ran = random_num(self.tile.summons.length);
        var new_enemy = self.tile.summons[ran]();
        stun(new_enemy);
        map.add_tile(new_enemy, self.location);
    }
}
/** @type {TileGenerator} A sturdy wall.*/
function wall_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.wall,
        pic: `${IMG_FOLDER.tiles}wall.png`,
        description: other_tile_descriptions.wall,
        tags: new TagList([TAGS.unmovable]),
    }
}
/** @type {TileGenerator} Like the normal chest, but it is invulnerable.*/
function armored_chest_tile(){
    return {
        type: entity_types.chest,
        name: special_tile_names.chest_armored,
        pic: `${IMG_FOLDER.tiles}armored_chest.png`,
        description: special_tile_descriptions.chest_armored,
        tags: new TagList([TAGS.unmovable]),
        on_enter: chest_on_enter,
        contents: [],
    }
}
/** @type {TileGenerator} A chest letting the user choose a reward. Currently empty.*/
function chest_tile(){
    return {
        type: entity_types.chest,
        name: special_tile_names.chest,
        pic: `${IMG_FOLDER.tiles}chest.png`,
        description: special_tile_descriptions.chest,
        tags: new TagList([TAGS.unmovable, TAGS.obstruction]),
        health: 1,
        on_enter: chest_on_enter,
        contents: [],
    }
}
/** @type {TileGenerator} Makes the correct type of chest*/
function appropriate_chest_tile(){
    if(GS.boons.has(boon_names.larger_chests)){
        return armored_chest_tile();
    }
    return chest_tile();
}

/** @type {AIFunction} Function to open a chest when the player moves onto it.*/
function chest_on_enter(self, target, map){
    if(self.tile.contents === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.tile.type !== entity_types.player){
        return;
    }
    self.tile.health = 1;
    map.attack(self.location);
    map.stats.increment_chests();
    var leave_chest = function(go_back){
        if(go_back){
            GAME_SCREEN_DIVISIONS.swap(UIIDS.stage);
        }
        display.display_message(UIIDS.chest_instructions, ``);
        display.remove_children(UIIDS.chest_confirm_row);
        display.remove_children(UIIDS.contents);
        display.display_message(UIIDS.content_description, ``);
        GS.refresh_deck_display();
        display_map(map);
        if(GS.boons.has(boon_names.safe_passage)){
            GS.boons.lose(boon_names.safe_passage);
            GS.refresh_boon_display();
            GS.map.heal(GS.map.get_player_location());
            GS.map.display_stats();
            GS.enter_shop();
        }
    }
    var abandon_button = {
        description: chest_text.abandon,
        on_click: leave_chest
    };
    var pick = function(on_choose, name){
        return function(){
            try{
                var go_back = true;
                if(on_choose !== undefined){
                    go_back = on_choose();
                }
                leave_chest(go_back);
            }
            catch(error){
                if(error.message === ERRORS.game_over){
                    GS.refresh_boon_display();
                    leave_chest(true);
                    error = new Error(ERRORS.game_over, {cause: new Error(name)});
                    GS.game_over(error.cause.message);
                }
                else{
                    throw error;
                }
            }
        }
    }
    var content_row = [];
    for(var i = 0; i < self.tile.contents.length; ++i){
        let item = self.tile.contents[i];
        let make_on_click = function(position){
            return function(){
                let confirm_button = {
                    description: chest_text.take,
                    on_click: pick(item.on_choose, item.name),
                };
                display.display_message(UIIDS.content_description, item.description);
                display.remove_children(UIIDS.chest_confirm_row);
                display.add_button_row(UIIDS.chest_confirm_row, [abandon_button, confirm_button]);
                display.select(UIIDS.contents, 0, position);
            };
        }
        content_row.push({
            pic: item.pic,
            name: item.name,
            on_click: make_on_click(i),
        });
    }

    display.display_message(UIIDS.chest_instructions, chest_text.header);
    display.add_tb_row(UIIDS.contents, content_row, CHEST_CONTENTS_SIZE);
    display.add_button_row(UIIDS.chest_confirm_row, [abandon_button]);
    GAME_SCREEN_DIVISIONS.swap(UIIDS.chest);
    throw new Error(ERRORS.pass_turn);
}

/**
 * @typedef {Object} Content
 * @property {string} pic
 * @property {function} on_choose
 * @property {string} description
 */

/**
 * @param {Tile} chest 
 * @param {Card} card 
 */
function add_card_to_chest(chest, card){
    if(chest.contents === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var description = chest_text.add_card + `\n` + explain_card_w_stats(card);
    var content = {
        pic: card.pic,
        name: card.name,
        on_choose: function(){
            GS.deck.add(card);
            return true;
        },
        description
    }
    chest.contents.push(content);
}

function add_boon_to_chest(chest, boon){
    if(chest.contents === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var content = {
        pic: boon.pic,
        name: boon.name,
        on_choose: function(){
            if(GS.boons.total === 0){
                display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.boon_list, function(){
                    SIDEBAR_DIVISIONS.swap(UIIDS.boon_list);
                });
                SIDEBAR_DIVISIONS.swap(UIIDS.boon_list);
            }
            var go_back = GS.boons.pick(boon.name);
            GS.refresh_boon_display();
            return go_back
        },
        description: explain_boon_with_picked(boon),
    }
    chest.contents.push(content);
}
/** @type {TileGenerator} Empty space.*/
function empty_tile(){
    return {
        type: entity_types.empty,
        name: special_tile_names.empty,
        pic: `${IMG_FOLDER.tiles}empty.png`,
        description: special_tile_descriptions.empty,
        tags: new TagList([TAGS.unmovable]),
    }
}
/** @type {TileGenerator} The player must move here to complete the floor.*/
function exit_tile(){
    return {
        type: entity_types.exit,
        name: special_tile_names.exit,
        pic: `${IMG_FOLDER.tiles}stairs.png`,
        description: special_tile_descriptions.exit,
        tags: new TagList([TAGS.unmovable]),
    }
}
/** @type {TileGenerator} The player must move here to complete the game.*/
function final_exit_tile(){
    return {
        type: entity_types.final_exit,
        name: special_tile_names.final_exit,
        pic: `${IMG_FOLDER.tiles}final_exit.png`,
        description: special_tile_descriptions.final_exit,
        tags: new TagList([TAGS.unmovable]),
    }
}
/** @type {TileGenerator} Must be unlocked to reveal the exit.*/
function lock_tile(){
    return {
        type: entity_types.terrain,
        name: special_tile_names.lock,
        pic: `${IMG_FOLDER.tiles}lock.png`,
        description: special_tile_descriptions.lock,
        tags: new TagList([TAGS.unmovable]),
    }
}
/** @type {TileGenerator} The starting player.*/
function player_tile(){
    return {
        type: entity_types.player,
        name: special_tile_names.you,
        pic: `${IMG_FOLDER.tiles}helmet.png`,
        description: special_tile_descriptions.player,
        tags: new TagList(),
        health: PLAYER_STARTING_HEALTH,
        max_health: PLAYER_STARTING_HEALTH,
        on_hit: player_hit
    }
}

function player_hit(self, target, map){
    if(GS.boons.has(boon_names.retaliate)){
        retaliate_behavior(self, target, map);
    }
    if(GS.boons.has(boon_names.escape_artist)){
        escape_artist_behavior(self, target, map);
    }
}
// ----------------AIUtil.js----------------
// File for AI utility functions functions and jsdoc typedefs used by ai functions.

/**
 * @typedef {Object} AISelfParam Information passed into an ai function about the entity calling it.
 * @property {Tile} tile The tile of the entity.
 * @property {Point} location The location of the tile on the grid.
 */

/**
 * @typedef {Object} AITargetParam Information passed into an ai function about the entity it is targeting.
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
    throw new Error(ERRORS.skip_animation);
}
/** @type {AIFunction} Attempts to move 1 space closer to the user until it succesfully moves or it dies.*/
function move_closer_ai(self, target, map){
    var directions = order_nearby(target.difference);
    return move_reckless(self, target, map, directions);
}
/** @type {AIFunction} AI used when a entity should move and attack in a direction (the target's difference field).*/
function move_attack_ai(self, target, map){
    if(target.difference.is_origin()){
        throw new Error(ERRORS.invalid_value);
    }
    if(map.move(self.location, self.location.plus(target.difference))){
        self.location.plus_equals(target.difference);
    }
    map.attack(self.location.plus(target.difference));
}
/** @type {AIFunction} Function used on boss death to display the correct death message, unlock the floor, and by doing so heal the player.*/
function boss_death(self, target, map){
    if(
        self.tile.death_message === undefined ||
        self.tile.death_achievement === undefined
    ){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.card_drops !== undefined && self.tile.card_drops.length > 0){
        // Create a chest containing a random card from it's loot table.
        var chest = appropriate_chest_tile();
        var drops = self.tile.card_drops.map((c) => {return c()});
        var contents = rand_no_repeats(drops, 1 + 2 * GS.boons.has(boon_names.larger_chests));
        if(chance(1, 2) && filter_new_cards(contents).length === 0){
            var replace_list = filter_new_cards(drops);
            if(replace_list.length > 0){
                contents[0] = random_from(replace_list);
            }
        }
        for(var card of contents){
            add_card_to_chest(chest, card);
        }
        map.add_tile(chest, self.location);
    }
    map.unlock();
    var death_message = `${self.tile.death_message}\n${boss_death_message.general}`;
    var player_tile = map.get_player();
    if(player_tile.max_health === 1){
        GS.achieve(achievement_names.one_life);
    }
    var stats = map.stats.get_stats();
    if(stats.player_boss_damage === 0){
        GS.achieve(achievement_names.not_my_fault);
    }
    if(stats.boss_kill_start === stats.turn_number){
        GS.achieve(achievement_names.one_hit_wonder);
    }
    if( // Practice makes perfect
        GS.boons.has(boon_names.practice_makes_perfect) && 
        player_tile.max_health !== undefined && 
        player_tile.max_health === player_tile.health
    ){
        ++player_tile.max_health;
        death_message = `${death_message}\n${boon_messages.practice_makes_perfect}`
    }
    map.player_heal(new Point(0, 0));
    var new_boss_kill = GS.achieve(self.tile.death_achievement);
    if(new_boss_kill && GS.data.achievements.count_bosses() === 5){
        GS.achieve(achievement_names.monster_hunter);
    }
    
    say_record(death_message);
}
/**
 * Function to summon altars at specific positions.
 * @param {Point} destination A grid of locations to summon at.
 * @returns {MapEventFunction} The event.
 */
function altar_event(destination, altar){
    var mark = {
        pic: `${IMG_FOLDER.tiles}starcaller_rift.png`,
        description: event_descriptions.starfall,
        telegraph: hazard_telegraph
    }

    var summon = function(location){
        return function(map_to_use){
            map_to_use.attack(location);
            if(map_to_use.check_empty(location)){
                map_to_use.add_tile(altar(), location);
            }
        }
    }
    var rift = function(location){
        return function(map_to_use){
            map_to_use.mark_event(location, mark);
            map_to_use.add_event({name: altar().name, behavior: summon(location)});
        }
    }
    return rift(destination);
}
/**
 * Function to create a function that delays an event function for a specified number of turns.
 * @param {number} turn_count How many turns to delay it.
 * @param {function} delayed_function The event to fire after the delay.
 * @returns {MapEventFunction} The event.
 */
function delay_event(turn_count, delayed_function){
    var delay_function = function(){
        return function(map_to_use){
            if(turn_count > 1){
                map_to_use.add_event({name: event_names.delay, behavior: delay_event(turn_count - 1, delayed_function)});
            }
            else{
                delayed_function(map_to_use);
            }
        }
    }
    return delay_function();
}
/**
 * Function to create an event function representing an earthquake.
 * @param {number} amount The amount of falling debris that should be created.
 * @param {Point[]=} locations An optional grid of locations to pick from.
 * @returns {MapEventFunction} The event.
 */
function earthquake_event(amount, locations = undefined){
    var falling_rubble = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
            }
        }
    }
    var earthquake = function(amount){
        var falling_rubble_layer = {
            pic: `${IMG_FOLDER.tiles}falling_rubble.png`,
            description: event_descriptions.falling_rubble,
            telegraph: hazard_telegraph
        }
        return function(map_to_use){
            var rubble = [];
            var space;
            if(locations === undefined){
                for(var j = 0; j < amount; ++j){
                    space = map_to_use.random_empty();
                    map_to_use.mark_event(space, falling_rubble_layer);
                    rubble.push(space);
                }
            }
            else{
                var spaces = rand_no_repeats(locations, amount);
                for(var i = 0; i < amount; ++i){
                    space = spaces[i];
                    if(map_to_use.check_empty(space)){
                        map_to_use.mark_event(space, falling_rubble_layer);
                        rubble.push(space);
                    }
                }
            }
            map_to_use.add_event({name: event_names.falling_rubble, behavior: falling_rubble(rubble)});
        }
    }
    return earthquake(amount);
}
/**
 * Function to create an event function representing an earthquake that gets stronger over time.
 * @param {number} amount The amount of falling debris that should be created.
 * @returns {MapEventFunction} The event.
 */
function eternal_earthquake_event(amount){
    var falling_rubble = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
            }
        }
    }
    var earthquake = function(amount){
        amount = Math.min(amount, FLOOR_HEIGHT * FLOOR_WIDTH * 4/5);
        var falling_rubble_layer = {
            pic: `${IMG_FOLDER.tiles}falling_rubble.png`,
            description: event_descriptions.falling_rubble,
            telegraph: hazard_telegraph
        }
        return function(map_to_use){
            var rubble = [];
            while(rubble.length < amount){
                var space = map_to_use.random_space();
                if(rubble.find((p) => {
                    return point_equals(p, space);
                }) === undefined){
                    map_to_use.mark_event(space, falling_rubble_layer);
                    rubble.push(space);
                }
            }
            map_to_use.add_event({name: event_names.falling_rubble, behavior: falling_rubble(rubble)});
            var next_wave = eternal_earthquake_event(rubble.length + 5);
            map_to_use.add_event({name: event_names.earthquake, behavior: next_wave});
        }
    }
    return earthquake(amount);
}
/**
 * Function to create an event function representing hazardous growth.
 * @param {Point[]} points A grid of locations to grow things at.
 * @returns {MapEventFunction} The event.
 */
function growth_event(points, root, grown){
    var grow = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
                if(map_to_use.check_empty(location)){
                    map_to_use.add_tile(grown(), location);
                }
            }
        }
    }
    var plant = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.mark_event(location, root);
            }
            map_to_use.add_event({name: grown().name, behavior: grow(locations)});
        }
    }
    return plant(points);
}
/**
 * @param {Point[]} locations A grid of locations to use.
 * @returns {MapEventFunction} The event.
 */
function targeted_earthquake_event(locations){
    var falling_rubble = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
            }
        }
    }
    var earthquake = function(){
        var falling_rubble_layer = {
            pic: `${IMG_FOLDER.tiles}falling_rubble.png`,
            description: event_descriptions.falling_rubble,
            telegraph: hazard_telegraph
        }
        return function(map_to_use){
            var rubble = [];
            for(var space of locations){
                map_to_use.mark_event(space, falling_rubble_layer);
                rubble.push(space);
            }
            map_to_use.add_event({name: event_names.falling_rubble, behavior: falling_rubble(rubble)});
        }
    }
    return earthquake();
}
// ----------------GeneralEnemyUtil.js----------------
// File for utility functions and jsdoc typedefs used by ai functions.

/**
 * @typedef {Object} Tile Information about the contents of a single square of a floor of the dungeon.
 * 
 * // Required properties //
 * @property {string} type The type of thing this tile is (player, enemy, exit, etc).
 * @property {string} name More specific than type. Used for mousover text.
 * @property {string} pic The picture of the tile's contents.
 * @property {string} description A description given when the tile is clicked on.
 * @property {TagList} tags Tags that group enemies together
 * 
 * // Misc //
 * @property {number=} health The amount of damage it can take before dying.
 * @property {number=} max_health It can never be healed above this.
 * @property {number=} difficulty Used to determine how many things can be spawned.
 * @property {string=} death_message Displayed on death.
 * @property {string=} death_achievement Name of the achievement granted on boss death.
 * 
 * // Functions controlling behavior. //
 * @property {AIFunction=} behavior What it does on it's turn. Targets the player.
 * @property {TelegraphFunction=} telegraph Used to show which squares it can attack on it's next turn.
 * @property {TelegraphFunction=} telegraph_other Used to show squares that can be affected by something other than an attack.
 * @property {AIFunction=} on_enter What it does when something tries to move onto it. Targets whatever touched it.
 * @property {AIFunction=} on_hit What it does when attacked. Targets what attacked it.
 * @property {AIFunction=} on_death What it does when killed. Targets the player.
 * 
 * // Properties used to determing aesthetics //
 * @property {string[]=} pic_arr Used when the tile sometimes changes images.
 * @property {string[]=} description_arr Used when the tile sometimes changes descriptions.
 * @property {number=} rotate How much to rotate the image when displaying it. Must be in 90 degree increments.
 * @property {boolean=} flip If the image should be horizontally flipped.
 * 
 * // Properties used by AI functions to determine behavior. //
 * @property {number=} cycle Used when a tile's state must persist between turns.
 * @property {number=} spawn_timer How many turns between spawning things.
 * @property {number=} range How far away can it attack.
 * @property {Point=} direction The relative direction is it moving.
 * @property {(Point | undefined)[]=} segment_list A 2 element array with the relative positions of the two adjacent segments of this entity.
 * @property {number=} spin_direction The direction it is spinning.
 * @property {Spell[]=} spells A array of behavior functions it can call along with their own descriptions and pictures.
 * @property {TileGenerator[]=} summons A array of tiles it can spawn.
 * @property {Content[]=} contents The contents of a chest.
 * @property {CardGenerator[]=} card_drops The cards a boss can drop on death.
 * @property {string=} mode The current behavior mode.
 * 
 * // Properties added later //
 * @property {number=} stun When the tile is stunned, it's turn will be skipped.
 * @property {number=} id Given a unique one when added to a EntityList.
 * @property {Tile=} look Used when tiles disguise themselves as something else.
 */

/**
 * @callback TileGenerator Function used to create a tile.
 * @returns {Tile}
 */

// This is a array of all the enemies that can be spawned on a normal floor.
const ENEMY_LIST = [
    spider_tile, turret_d_tile, turret_o_tile, turret_r_tile, shadow_knight_tile, 
    scythe_tile, spider_web_tile, ram_tile, large_porcuslime_tile, medium_porcuslime_tile, 
    acid_bug_tile, brightling_tile, corrosive_caterpillar_tile, noxious_toad_tile, vampire_tile,
    clay_golem_tile, vinesnare_bush_tile, rat_tile, shadow_scout_tile, darkling_tile,
    orb_of_insanity_tile, carrion_flies_tile, magma_spewer_tile, igneous_crab_tile, animated_boulder_tile,
    pheonix_tile, strider_tile, swaying_nettle_tile, thorn_bush_tile, living_tree_tile,
    moving_turret_d_tile, moving_turret_o_tile, walking_prism_tile, unstable_wisp_tile, captive_void_tile,
    paper_construct_tile, specter_tile, gem_crawler_tile, claustropede_2_tile, claustropede_3_tile, 
    wheel_of_fire_tile, blood_crescent_tile, unspeakable_tile, shadow_knight_elite_tile, maw_tile
];

// This is an array of all bosses.
const BOSS_LIST = [
    lich_tile, spider_queen_tile, two_headed_serpent_tile, velociphile_tile, young_dragon_tile, 
    forest_heart_tile, arcane_sentry_tile
];

/**
 * Stuns a stunnable tile by incrementing it's stun property. Adds the property first if necessary.
 * @param {Tile} tile The tile to stun.
 * @param {number} [amount = 1] Optional parameter for the amount of stun to add. Default is 1.
 */
function stun(tile, amount = 1){
    if(tile.tags !== undefined && tile.tags.has(TAGS.unstunnable)){
        return;
    }
    // Increases a tile's stun.
    if(tile.stun === undefined){
        tile.stun = 0;
    }
    tile.stun += amount;
}
/**
 * @returns {Point[]} Returns a randomized array of points around (0, 0).
 */
function random_nearby(){
    // Returns an array of each point next to [0, 0] with it's order randomized.
    var cords = [
        new Point(-1, -1),
        new Point(-1, 0),
        new Point(-1, 1),
        new Point(0, -1),
        new Point(0, 1),
        new Point(1, -1),
        new Point(1, 0),
        new Point(1, 1)];
    return randomize_arr(cords);
}
/**
 * Gets a randomized array of points around (0, 0) ordered by how close they are to the given point.
 * @param {Point} direction The point to sort by.
 * @returns {Point[]} The resulting array.
 */
function order_nearby(direction){
    // Returns an array with points ordered from the nearest to the furthest from the given direction. 
    // Equal distance points are randomly ordered.
    var sign_dir = sign(direction);
    var ordering = [];
    ordering.push(sign_dir);
    if(sign_dir.x === 0){
        // Target is along the vertical line.
        var pair = randomize_arr([new Point(1, sign_dir.y), new Point(-1, sign_dir.y)]);
        ordering.push(...pair);
        pair = randomize_arr([new Point(1, 0), new Point(-1, 0)]);
        ordering.push(...pair);
        pair = randomize_arr([new Point(1, -1 * sign_dir.y), new Point(-1, -1 * sign_dir.y)]);
        ordering.push(...pair);
    }
    else if(sign_dir.y === 0){
        // Target is along the horizontal line.
        var pair = randomize_arr([new Point(sign_dir.x, 1), new Point(sign_dir.x, -1)]);
        ordering.push(...pair);
        pair = randomize_arr([new Point(0, 1), new Point(0, -1)]);
        ordering.push(...pair);
        pair = randomize_arr([new Point(-1 * sign_dir.x, 1), new Point(-1 * sign_dir.x, -1)]);
        ordering.push(...pair);
    }
    else if(Math.abs(direction.x) > Math.abs(direction.y)){
        // Target is closer to the horizontal line than the vertical one.
        ordering.push(new Point(sign_dir.x, 0));
        ordering.push(new Point(0, sign_dir.y));
        ordering.push(new Point(sign_dir.x, -1 * sign_dir.y));
        ordering.push(new Point(-1 * sign_dir.x, sign_dir.y));
        ordering.push(new Point(0, -1 * sign_dir.y));
        ordering.push(new Point(-1 * sign_dir.x, 0));
    }
    else if(Math.abs(direction.x) < Math.abs(direction.y)){
        // Target is closer to the vertical line than the horizontal one one.
        ordering.push(new Point(0, sign_dir.y));
        ordering.push(new Point(sign_dir.x, 0));
        ordering.push(new Point(-1 * sign_dir.x, sign_dir.y));
        ordering.push(new Point(sign_dir.x, -1 * sign_dir.y));
        ordering.push(new Point(-1 * sign_dir.x, 0));
        ordering.push(new Point(0, -1 * sign_dir.y));
    }
    else{
        // Target is along the diagonal.
        var pair = randomize_arr([new Point(sign_dir.x, 0), new Point(0, sign_dir.y)]);
        ordering.push(...pair);
        pair = randomize_arr([new Point(-1 * sign_dir.x, sign_dir.y), new Point(sign_dir.x, -1 * sign_dir.y)]);
        ordering.push(...pair);
        pair = randomize_arr([new Point(-1 * sign_dir.x, 0), new Point(0, -1 * sign_dir.y)]);
        ordering.push(...pair);
    }
    ordering.push(new Point(-1 * sign_dir.x, -1 * sign_dir.y));
    return ordering;
}
/**
 * Function to get the first non empty location near a given location.
 * @param {Point} location The point to search around.
 * @param {Point[]} nearby_arr The array of relative locations to search.
 * @param {GameMap} map The map to search on.
 * @returns {Point | undefined} Returns an empty location if one is found and undefined otherwise.
 */
function get_empty_nearby(location, nearby_arr, map){
    for(var near of nearby_arr){
        if(map.check_empty(location.plus(near))){
            return near;
        }
    }
    return undefined;
}
/**
 * Counts how many locations next to the given one are not empty.
 * @param {Point} location The point to search around.
 * @param {GameMap} map The map to search.
 * @returns {number} The number of nearby occupied locations.
 */
function count_nearby(location, map){
    var count = 0;
    var nearby = random_nearby();
    for(var near of nearby){
        if(!map.check_empty(location.plus(near))){
            ++count;
        }
    }
    return count;
}
/**
 * A function to add a Tile to the game map at a position next to this one.
 * @param {GameMap} map The map to add the tile to.
 * @param {Tile} tile The tile to add.
 * @param {Point} location The point to spawn near.
 * @param {Point[]=} nearby Array of relative locations to spawn from randomly.
 *                            If not provided, it will choose from a randomized array of locations next to the given one.
 * @returns {Point | undefined} Returns the location of the new tile if it was successfully added, or undefined if no spaces were available.
 */
function spawn_nearby(map, tile, location, nearby = random_nearby()){
    // Attempts to spawn a <tile> at a space next to to the given cords.
    // If it succeeds, returns the location, otherwise returns false.
    for(var near of nearby){
        if(map.add_tile(tile, location.plus(near))){
            return near;
        }
    }
    return undefined;
}
/**
 * Function to attack all spaces around the current location.
 * @param {Point} location The square to attack around.
 * @param {GameMap} map The map to make attacks using.
 */
function attack_around(location, map){
    for(var direction of ALL_DIRECTIONS){
        map.attack(location.plus(direction));
    }
}
/**
 * Function to let a tile disguise itself as another one.
 * @param {Tile} tile The tile to disguise.
 * @param {TileGenerator} tile_generator The generator for a default version of the tile to disguise as. 
 */
function shapeshift(tile, tile_generator){
    var look = tile_generator();
    tile.name = look.name;
    tile.description = look.description;
    tile.telegraph = look.telegraph;
    tile.pic = look.pic;
}

/**
 * Sets the rotation of a tile based on it's direction.
 * @param {Tile} tile The tile to set the direction of.
 * @returns {number} Returns 1 if the direction is diagonal, 0 if it's orthogonal.
 */
function set_rotation(tile){
    /*
        NW = (-1, -1) -> 0
        N  = ( 0, -1) -> 0
        NE = ( 1, -1) -> 90
        E  = ( 1,  0) -> 90
        SE = ( 1,  1) -> 180
        S  = ( 0,  1) -> 180
        SW = (-1,  1) -> 270
        W  = (-1,  0) -> 270 
    */
    if(tile.direction === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var direction = tile.direction;
    if(direction.on_axis()){
        tile.rotate = 0;
        if(direction.x < 0 || direction.y > 0){
            tile.rotate = 2*90;
        }
        if(direction.y === 0){
            tile.rotate += 90;
        }
        var diagonal = 0;
    }
    else{
        tile.rotate= 90 * ((direction.x + direction.y) / 2 + 1);
        if(direction.x === -1 && direction.y === 1){
            tile.rotate = 90 * 3;
        }
        var diagonal = 1;
    }
    return diagonal;
}

/**
 * Creates an array of points around the edge of the rectangle created using the given points as corners.
 * @param {Point} p1 One corner of the rectangle.
 * @param {Point} p2 The opposite corner.
 * @returns {Point[]} An array of the points around the edge.
 */
function point_rectangle(p1, p2){
    if(p1.x === p2.x && p1.y === p2.y){
        // 1x1
        return [p1.copy()];
    }
    if(p1.x === p2.x){
        // 1xn
        var y_min = Math.min(p1.y, p2.y);
        var y_max = Math.max(p1.y, p2.y);
        return range(y_min, y_max).map((y) => {
            return new Point(p1.x, y);
        });
    }
    if(p1.y === p2.y){
        // nx1
        var x_min = Math.min(p1.x, p2.x);
        var x_max = Math.max(p1.x, p2.x);
        return range(x_min, x_max).map((x) => {
            return new Point(x, p1.y);
        });
    }

    var rectangle = [
        p1.copy(),
        p2.copy(),
        new Point(p1.x, p2.y),
        new Point(p2.x, p1.y),
    ];
    var x_min = Math.min(p1.x, p2.x);
    var x_max = Math.max(p1.x, p2.x);
    var y_min = Math.min(p1.y, p2.y);
    var y_max = Math.max(p1.y, p2.y);
    for(var x = x_min + 1; x < x_max; ++x){
        rectangle.push(new Point(x, y_min));
        rectangle.push(new Point(x, y_max));
    }
    for(var y = y_min + 1; y < y_max; ++y){
        rectangle.push(new Point(x_min, y));
        rectangle.push(new Point(x_max, y));
    }
    return rectangle;
}

function get_nearest_where(map, location, f){
    for(var i = 1; i < Math.max(FLOOR_HEIGHT, FLOOR_WIDTH); ++i){
        var corner_1 = location.plus(new Point(1, 1).times(i));
        var corner_2 = location.plus(new Point(-1, -1).times(i));
        var rectangle = point_rectangle(corner_1, corner_2);
        for(var p of rectangle){
            if(map.is_in_bounds(p) && f(map.get_tile(p), p)){
                return p;
            }
        }
    }
    return undefined;
}

function move_careful(self, target, map, directions){
    // Looks ahead in each direction until it finds one that is safe to move in.
    // Returns the direction it moved or undefined.
    for(var i = 0; i < directions.length && !map.check_empty(self.location.plus(directions[i])); ++i){}
    if(i < directions.length){
        if(map.move(self.location, self.location.plus(directions[i]))){
            self.location.plus_equals(directions[i]);
            target.difference.minus_equals(directions[i]);
            return directions[i];
        }
    }
    return undefined;
}

function move_reckless(self, target, map, directions){
    // Tries to move in each direction until it does so or takes damage.
    // Returns the direction it moved or undefined.
    var start = self.tile.health;
    for(var i = 0; i < directions.length && (self.tile.health === undefined || self.tile.health >= start); ++i){
        if(map.move(self.location, self.location.plus(directions[i]))){
            self.location.plus_equals(directions[i]);
            target.difference.minus_equals(directions[i]);
            return directions[i];
        }
    }
    return undefined;
}

/** @type {TileGenerator} Function to act as a starting point for making new enemies. */
function generic_tile(){
    return {
        // Required properties //
        type: ``,
        name: ``,
        pic: ``,
        description: ``,

        // Misc //
        health: 1,
        max_health: 1,
        difficulty: 1,
        death_message: ``,

        // Functions controlling behavior. //
        behavior: undefined,
        telegraph: undefined,
        telegraph_other: undefined,
        on_enter: undefined,
        on_hit: undefined,
        on_death: undefined,

        // Properties used to determing aesthetics //
        pic_arr: [],
        description_arr: [],
        rotate: 0,
        flip: false,

        // Properties used by AI functions to determine behavior. //
        cycle: 0,
        spawn_timer: 0,
        range: 1,
        direction: new Point(0, 0),
        segment_list: [],
        spin_direction: 1,
        spells: [],
        summons: [],
        contents: [],
        card_drops: [],

        // Properties added later //
        stun: undefined,
        id: undefined,
        is_hit: undefined,
        event_happening: undefined
    }
}
function node_cannon_behavior(self, target, map){
    var spawnpoint = self.location.plus(self.tile.direction);
    var fireball = shoot_fireball(self.tile.direction);
    if(map.is_in_bounds(spawnpoint) && !map.get_tile(spawnpoint).tags.has(TAGS.arcane_sentry)){
        map.attack(spawnpoint);
        map.add_tile(fireball, spawnpoint);
    }
}
function node_cannon_telegraph(location, map, self){
    return [location.plus(self.direction)];
}

function sentry_transform_cannon(self, target, map){
    var nodes = get_sentry_nodes(self, target, map);
    var direction = sentry_cannon_direction(target.difference);
    if(direction.on_axis()){
        for(var node of nodes){
            var tile = node.self.tile;
            tile.direction = direction;
            set_rotation(tile);
            var node_difference = target.difference.minus(node.target.difference);
            if(node_difference.plus(direction).on_axis()){
                // Node is behind the core so should be double cannon.
                tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_double_cannon_o.png`;
                tile.behavior = node_double_cannon_behavior;
                tile.telegraph = node_double_cannon_telegraph;
                tile.description = 
                    `${boss_descriptions.arcane_sentry_node}\n`
                    +`${sentry_mode_descriptions.node.double_cannon}`;
            }
            else{
                // Single cannon.
                tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_cannon_o.png`;
                tile.behavior = node_cannon_behavior;
                tile.telegraph = node_cannon_telegraph;
                tile.description = 
                    `${boss_descriptions.arcane_sentry_node}\n`
                    +`${sentry_mode_descriptions.node.cannon}`;
            }
        }
        // Core is single cannon.
        self.tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_core_cannon_o.png`;
        self.tile.direction = direction;
        set_rotation(self.tile);
        self.tile.telegraph = node_cannon_telegraph;
        self.tile.description = 
            `${boss_descriptions.arcane_sentry}\n`
            +`${sentry_mode_descriptions.core.cannon}`;
    }
    else{
        for(var node of nodes){
            var tile = node.self.tile;
            tile.direction = direction;
            set_rotation(tile);
            var node_difference = target.difference.minus(node.target.difference);
            if(node_difference.plus(direction).is_origin()){
                // Node is behind core so should be double cannon.
                tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_double_cannon_d.png`;
                tile.behavior = node_double_cannon_behavior;
                tile.telegraph = node_double_cannon_telegraph;
                tile.description = 
                    `${boss_descriptions.arcane_sentry_node}\n`
                    +`${sentry_mode_descriptions.node.double_cannon}`;
            }
            else{
                // Single cannon.
                tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_cannon_d.png`;
                tile.behavior = node_cannon_behavior;
                tile.telegraph = node_cannon_telegraph;
                tile.description = 
                    `${boss_descriptions.arcane_sentry_node}\n`
                    +`${sentry_mode_descriptions.node.cannon}`;
            }
        }
        self.tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_core_cannon_d.png`;
        self.tile.telegraph = undefined;
        self.tile.direction = undefined;
        self.tile.description = 
            `${boss_descriptions.arcane_sentry}\n`
            +`${sentry_mode_descriptions.core.cannon}`;
    }
}

function sentry_cannon_direction(difference){
    if(difference.on_diagonal() || difference.on_axis()){
        return sign(difference);
    }
    if(-1 <= difference.x && difference.x <= 1){
        return new Point(0, sign(difference.y));
    }
    if(-1 <= difference.y && difference.y <= 1){
        return new Point(sign(difference.x), 0);
    }
    return sign(difference);
}
function node_double_cannon_behavior(self, target, map){
    if(self.tile.direction.on_axis()){
        node_o_double_cannon_ai(self, target, map);
    }
    else{
        node_d_double_cannon_ai(self, target, map);
    }
}
function node_o_double_cannon_ai(self, target, map){
    var dir = self.tile.direction;
    var spawnpoints = [
        self.location.plus(dir.plus(dir.rotate(90))), 
        self.location.plus(dir.plus(dir.rotate(-90))),
    ];
    for(var spawnpoint of spawnpoints){
        var fireball = shoot_fireball(self.tile.direction);
        if(map.is_in_bounds(spawnpoint) && !map.get_tile(spawnpoint).tags.has(TAGS.arcane_sentry)){
            map.attack(spawnpoint);
            map.add_tile(fireball, spawnpoint);
        }
    }
}
function node_d_double_cannon_ai(self, target, map){
    var dir = self.tile.direction;
    var spawnpoints = [
        self.location.plus(dir.times(new Point(1, 0))), 
        self.location.plus(dir.times(new Point(0, 1))),
    ];
    for(var spawnpoint of spawnpoints){
        var fireball = shoot_fireball(self.tile.direction);
        if(map.is_in_bounds(spawnpoint) && !map.get_tile(spawnpoint).tags.has(TAGS.arcane_sentry)){
            map.attack(spawnpoint);
            map.add_tile(fireball, spawnpoint);
        }
    }
}

function node_double_cannon_telegraph(location, map, self){
    var dir = self.direction;
    if(dir.on_axis()){
        var locations = [
            location.plus(dir.plus(dir.rotate(90))), 
            location.plus(dir.plus(dir.rotate(-90))),
        ];
    }
    else{
        var locations = [
            location.plus(dir.times(new Point(1, 0))), 
            location.plus(dir.times(new Point(0, 1))),
        ];
    }
    return locations.filter((p) => {
        return map.is_in_bounds(p) && !map.get_tile(p).tags.has(TAGS.arcane_sentry);
    });
}
function node_saw_behavior(self, target, map){
    for(var direction of ORTHOGONAL_DIRECTIONS){
        map.attack(self.location.plus(direction));
    }
}

function node_saw_telegraph(location, map, self){
    return [
        ...ORTHOGONAL_DIRECTIONS.map((p) => {return p.plus(location)}), 
        ...hazard_telegraph(location, map, self),
    ];
}

function sentry_transform_saw(self, target, map){
    var nodes = get_sentry_nodes(self, target, map);
    for(var node of nodes){
        var tile = node.self.tile;
        tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_saw.png`;
        tile.behavior = node_saw_behavior;
        tile.on_enter = hazard;
        tile.telegraph = node_saw_telegraph;
        tile.description = 
            `${boss_descriptions.arcane_sentry_node}\n`
            +`${sentry_mode_descriptions.node.saw}`;
    }
    self.tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_core_saw.png`;
    self.tile.direction = sentry_saw_direction(target.difference);
    self.tile.on_enter = hazard;
    self.tile.telegraph = node_saw_telegraph;
    self.tile.description = 
        `${boss_descriptions.arcane_sentry}\n`
        +`${sentry_mode_descriptions.core.saw}`;
}

function sentry_saw_direction(difference){
    return order_nearby(difference).filter((dir) => {
        return dir.on_axis();
    })[0];
}
function node_turret_behavior(self, target, map){
    var sign_dif = sign(target.difference);
    var sign_dir = sign(self.tile.direction);
    var same_x_dir = sign_dif.x === sign_dir.x;
    var same_y_dir = sign_dif.y === sign_dir.y;
    if(target.difference.on_axis() && (same_x_dir || same_y_dir)){
        turret_fire_ai(self, target, map);
    }
    else if(GS.boons.has(boon_names.manic_presence)){
        var dirs = [
            self.tile.direction.times(new Point(1, 0)),
            self.tile.direction.times(new Point(0, 1)),
        ];
        for(var p of dirs){
            if(chance(1, 2)){
                turret_fire_ai(self, {difference: p}, map);
            }
        }
    }
}
function node_turret_telegraph(location, map, self){
    var x_points = look_at_points_in_direction(location, new Point(self.direction.x, 0), map);
    var y_points = look_at_points_in_direction(location, new Point(0, self.direction.y), map);
    return [...x_points, ...y_points];
}

function sentry_transform_turret(self, target, map){
    var nodes = get_sentry_nodes(self, target, map);
    for(var node of nodes){
        var tile = node.self.tile;
        tile.direction = node.self.location.minus(self.location);
        set_rotation(tile);
        tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_node_turret.png`;
        tile.behavior = node_turret_behavior;
        tile.on_enter = undefined;
        tile.telegraph = node_turret_telegraph;
        tile.description = 
            `${boss_descriptions.arcane_sentry_node}\n`
            +`${sentry_mode_descriptions.node.turret}`;
    }
    self.tile.pic = `${IMG_FOLDER.tiles}arcane_sentry_core.png`;
    self.tile.on_enter = undefined;
    self.tile.telegraph = undefined;
    self.tile.direction = undefined;
    self.tile.rotate = undefined;
    self.tile.description = 
        `${boss_descriptions.arcane_sentry}\n`
        +`${sentry_mode_descriptions.core.turret}`;
}
/** @type {SpellGenerator} */
function forest_heart_rest_spell_generator(){
    return {
        behavior: rest_spell,
        telegraph_other: rest_spell_telegraph,
        description: heart_spell_descriptions.rest,
        pic: `${IMG_FOLDER.tiles}forest_heart.png`
    }
}
/** @type {SpellGenerator} */
function greater_thorn_bush_spell_generator(){
    return {
        behavior: greater_thorn_bush_spell,
        telegraph_other: thorn_bush_spell_telegraph,
        description: heart_spell_descriptions.growth,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns Thorn Brambles around the tree in two rings.*/
function greater_thorn_bush_spell(self, target, map){
    thorn_bush_spell(self, target, map);
    var points = point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 3, FLOOR_HEIGHT / 2 - 3), 
        new Point(FLOOR_WIDTH / 2 + 2, FLOOR_HEIGHT / 2 + 2)
    );
    var root_layer = {
        pic: `${IMG_FOLDER.tiles}thorn_roots.png`,
        description: event_descriptions.thorn_root,
        telegraph: hazard_telegraph
    }
    var delayed_func = function(map_to_use){
        map_to_use.add_event({name: event_names.bramble_shield, behavior: growth_event(points, root_layer, thorn_bramble_tile)});
    };
    map.add_event({name: event_names.bramble_shield, behavior: delay_event(1, delayed_func)});
}
/** @type {SpellGenerator} */
function living_tree_spell_generator(){
    return {
        behavior: living_tree_spell,
        telegraph_other: living_tree_spell_telegraph,
        description: heart_spell_descriptions.summon,
        pic: `${IMG_FOLDER.tiles}forest_heart_summon.png`
    }
}

/** @type {AIFunction} Spawns a living tree along the diagonal of each corner.*/
function living_tree_spell(self, target, map){
    var nw = [];
    var ne = [];
    var se = [];
    var sw = [];
    for(var i = 0; i < Math.floor(FLOOR_HEIGHT / 2) && i < Math.floor(FLOOR_WIDTH / 2); ++i){
        nw.push(new Point(0 + i, 0 + i));
        ne.push(new Point(FLOOR_WIDTH - 1 - i, 0 + i));
        se.push(new Point(FLOOR_WIDTH - 1 - i, FLOOR_HEIGHT - 1 - i));
        sw.push(new Point(0 + i, FLOOR_HEIGHT - 1 - i));
    }
    for(var diagonal of [nw, ne, se, sw]){
        var spawned = false;
        for(var i = 0; i < diagonal.length && !spawned; ++i){
            if(map.check_empty(diagonal[i])){
                map.add_tile(living_tree_tile(), diagonal[i]);
                spawned = true;
            }
        }
    }
}

/** @type {TelegraphFunction} */
function living_tree_spell_telegraph(location, map, self){
    var nw = [];
    var ne = [];
    var se = [];
    var sw = [];
    var points = [];
    for(var i = 0; i < Math.floor(FLOOR_HEIGHT / 2) && i < Math.floor(FLOOR_WIDTH / 2); ++i){
        nw.push(new Point(0 + i, 0 + i));
        ne.push(new Point(FLOOR_WIDTH - 1 - i, 0 + i));
        se.push(new Point(FLOOR_WIDTH - 1 - i, FLOOR_HEIGHT - 1 - i));
        sw.push(new Point(0 + i, FLOOR_HEIGHT - 1 - i));
    }
    for(var diagonal of [nw, ne, se, sw]){
        var added = false;
        for(var i = 0; i < diagonal.length && !added; ++i){
            if(map.check_empty(diagonal[i])){
                points.push(diagonal[i]);
                added = true;
            }
        }
    }
    return points;
}
/** @type {SpellGenerator} */
function rotting_fruit_spell_generator(){
    return {
        behavior: rotting_fruit_spell,
        telegraph_other: rotting_fruit_spell_telegraph,
        description: heart_spell_descriptions.growth,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns Thorn Brambles around the tree.*/
function rotting_fruit_spell(self, target, map){
    var points = point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
    for(var point of points){
        if(map.get_tile(point).tags.has(TAGS.thorn_bush_roots)){
            map.attack(point);
        }
        if(map.check_empty(point)){
            map.add_tile(rotting_fruit_tree_tile(), point);
        }
    }
}

/** @type {TelegraphFunction} */
function rotting_fruit_spell_telegraph(location, map, self){
    return point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
}
/** @type {SpellGenerator} */
function scorpion_spell_generator(){
    return {
        behavior: scorpion_spell,
        telegraph_other: scorpion_spell_telegraph,
        description: heart_spell_descriptions.summon,
        pic: `${IMG_FOLDER.tiles}forest_heart_summon.png`
    }
}

/** @type {AIFunction} Spawns a scorpion on each side.*/
function scorpion_spell(self, target, map){
    var width = [];
    for(var x = 0; x < FLOOR_WIDTH; ++x){
        width.push(x);
    }
    var height = [];
    for(var y = 0; y < FLOOR_HEIGHT; ++y){
        height.push(y);
    }
    var top = randomize_arr(width).map(x => {return new Point(x, 0)});
    var bottom = randomize_arr(width).map(x => {return new Point(x, FLOOR_HEIGHT - 1)});
    var left = randomize_arr(height).map(y => {return new Point(0, y)});
    var right = randomize_arr(height).map(y => {return new Point(FLOOR_WIDTH - 1, y)});
    for(var side of [top, bottom, left, right]){
        var spawned = false;
        for(var i = 0; i < side.length && !spawned; ++i){
            if(map.check_empty(side[i])){
                map.add_tile(scorpion_tile(), side[i]);
                spawned = true;
            }
        }
    }
}

/** @type {TelegraphFunction} */
function scorpion_spell_telegraph(location, map, self){
    return point_rectangle(
        new Point(0, 0), 
        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 1)
    );
}
/** @type {SpellGenerator} */
function swaying_nettle_spell_generator(){
    return {
        behavior: swaying_nettle_spell,
        telegraph_other: swaying_nettle_spell_telegraph,
        description: heart_spell_descriptions.growth,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns Swaying Nettles around the tree.*/
function swaying_nettle_spell(self, target, map){
    var points = point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
    var root_layer = {
        pic: `${IMG_FOLDER.tiles}swaying_nettle_roots.png`,
        description: event_descriptions.nettle_root,
        telegraph: hazard_telegraph
    }
    map.add_event({name: event_names.nettle_shield, behavior: growth_event(points, root_layer, swaying_nettle_tile)});
}

/** @type {TelegraphFunction} */
function swaying_nettle_spell_telegraph(location, map, self){
    return point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
}
/** @type {SpellGenerator} */
function thorn_bush_spell_generator(){
    return {
        behavior: thorn_bush_spell,
        telegraph_other: thorn_bush_spell_telegraph,
        description: heart_spell_descriptions.growth,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns Thorn Brambles around the tree.*/
function thorn_bush_spell(self, target, map){
    var points = point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
    var root_layer = {
        pic: `${IMG_FOLDER.tiles}thorn_roots.png`,
        description: event_descriptions.thorn_root,
        telegraph: hazard_telegraph
    }
    map.add_event({name: event_names.bramble_shield, behavior: growth_event(points, root_layer, thorn_bramble_tile)});
}

/** @type {TelegraphFunction} */
function thorn_bush_spell_telegraph(location, map, self){
    return point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
}
/** @type {SpellGenerator} */
function vinesnare_bush_spell_generator(){
    return {
        behavior: vinesnare_bush_spell,
        telegraph_other: vinesnare_bush_spell_telegraph,
        description: heart_spell_descriptions.growth,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns 3 vinesnare bushes in each corner.*/
function vinesnare_bush_spell(self, target, map){
    var points = [
        new Point(0, 0),
        new Point(1, 0),
        new Point(0, 1),

        new Point(FLOOR_WIDTH - 1, 0),
        new Point(FLOOR_WIDTH - 2, 0),
        new Point(FLOOR_WIDTH - 1, 1),

        new Point(0, FLOOR_HEIGHT - 1),
        new Point(1, FLOOR_HEIGHT - 1),
        new Point(0, FLOOR_HEIGHT - 2),

        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 1),
        new Point(FLOOR_WIDTH - 2, FLOOR_HEIGHT - 1),
        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 2),
    ];
    for(var space of points){
        if(map.check_empty(space)){
            map.add_tile(vinesnare_bush_tile(), space);
        }
    }
}

/** @type {TelegraphFunction} */
function vinesnare_bush_spell_telegraph(location, map, self){
    return [
        new Point(0, 0),
        new Point(1, 0),
        new Point(0, 1),

        new Point(FLOOR_WIDTH - 1, 0),
        new Point(FLOOR_WIDTH - 2, 0),
        new Point(FLOOR_WIDTH - 1, 1),

        new Point(0, FLOOR_HEIGHT - 1),
        new Point(1, FLOOR_HEIGHT - 1),
        new Point(0, FLOOR_HEIGHT - 2),

        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 1),
        new Point(FLOOR_WIDTH - 2, FLOOR_HEIGHT - 1),
        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 2),
    ];
}
/** @type {SpellGenerator} */
function confusion_spell_generator(){
    return {
        behavior: confusion_spell,
        telegraph_other: confusion_spell_telegraph,
        description: lich_spell_descriptions.confusion,
        pic: `${IMG_FOLDER.tiles}lich_confusion.png`
    }
}

/** @type {AIFunction} Spell which creates a cloud of confusion gas around the target which lasts for 3 turns.*/
function confusion_spell(self, target, map){
    var mark = {
        pic: `${IMG_FOLDER.tiles}confusion_cloud.png`,
        description: event_descriptions.confusion_cloud,
        telegraph_other: hazard_telegraph
    }
    var cloud = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.stun_tile(location);
            }
        }
    }
    var delay = (points) => {
        return (map_to_use) => {
            for(var point of points){
                map_to_use.mark_event(point, mark);
            }
            map_to_use.add_event({name: event_names.confusion_cloud, behavior: cloud(points)});
        }
    } 
    var center = self.location.plus(target.difference);
    if(GS.boons.has(boon_names.manic_presence) && chance(1, 2)){
        var miss = get_nearest_where(map, center, (t, p) => {
            return t.type === entity_types.enemy && !point_equals(p, self.location);
        });
        center = miss ? miss : center;
    }
    for(var i = 0; i < 3; ++i){
        var rectangle = point_rectangle(center.plus(new Point(1, 1)), center.plus(new Point(-1, -1)));
        rectangle = [...rectangle, center.copy()];
        rectangle = rectangle.filter((p) => {
            return map.is_in_bounds(p);
        });
        map.add_event({name: event_names.delay, behavior: delay_event(i + 1, delay(rectangle))});
    }
}

/** @type {TelegraphFunction} Shows that the player will be confused.*/
function confusion_spell_telegraph(location, map, self){
    var target = map.get_player_location();
    var rectangle = point_rectangle(target.plus(new Point(1, 1)), target.plus(new Point(-1, -1)));
    rectangle = [...rectangle, target.copy()];
    rectangle = rectangle.filter((p) => {
        return map.is_in_bounds(p);
    });
    return rectangle;
}
/** @type {SpellGenerator} */
function earthquake_spell_generator(){
    return {
        behavior: earthquake_spell,
        description: lich_spell_descriptions.earthquake,
        pic: `${IMG_FOLDER.tiles}lich_earthquake.png`
    }
}

/** @type {AIFunction} Spell which causes an earthquake causing debris to rain from the ceiling.*/
function earthquake_spell(self, target, map){
    var amount = random_num(9) + random_num(9) + random_num(9) + random_num(9);
    var points = [];
    for(var i = 0; i < FLOOR_WIDTH; ++i){
        for(var j = 0; j < FLOOR_HEIGHT; ++j){
            var p = new Point(i, j);
            if(map.check_empty(p) && !p.minus(self.location).within_radius(1)){
                points.push(p);
            }
        }
    }
    map.add_event({name: event_names.earthquake, behavior: earthquake_event(amount, points)});
    var player = map.get_player_location();
    map.add_event({name: event_names.earthquake, behavior: targeted_earthquake_event([player])});
}
/** @type {SpellGenerator} */
function flame_wave_spell_generator(){
    return {
        behavior: flame_wave_spell,
        telegraph: flame_wave_spell_telegraph,
        description: lich_spell_descriptions.flame_wave,
        pic: `${IMG_FOLDER.tiles}lich_flame_wave.png`
    }
}

/** @type {AIFunction} Spell which creates a wave of fireballs aimed at the target.*/
function flame_wave_spell(self, target, map){
    var direction = get_empty_nearby(self.location, order_nearby(target.difference), map);
    if(direction === undefined){
        return;
    }
    var spawnpoints = [];
    var wave = [-1, 0, 1];
    if(direction.x === 0){
        // Shooting vertically.
        spawnpoints = wave.map(x => new Point(x, direction.y));
    }
    else if(direction.y === 0){
        // Shooting horizontally.
        spawnpoints = wave.map(y => new Point(direction.x, y));
    }
    else{
        // Shooting diagonally.
        spawnpoints.push(new Point(direction.x, direction.y));
        spawnpoints.push(new Point(direction.x, 0));
        spawnpoints.push(new Point(0, direction.y));
    }
    spawnpoints = spawnpoints.map(s => self.location.plus(s));
    for(var spawnpoint of spawnpoints){
        var fireball = shoot_fireball(direction);
        map.attack(spawnpoint);
        map.add_tile(fireball, spawnpoint);
    }
}

/** @type {TelegraphFunction} */
function flame_wave_spell_telegraph(location, map, self){
    return random_nearby().map(p => p.plus(location));
}
/** @type {SpellGenerator} */
function lava_moat_spell_generator(){
    return {
        behavior: lava_moat_spell,
        description: lich_spell_descriptions.lava_moat,
        pic: `${IMG_FOLDER.tiles}lich_lava_moat.png`
    }
}

/** @type {AIFunction} Spell which creates several lava pools between the user and their target.*/
function lava_moat_spell(self, target, map){
    var nearby = order_nearby(target.difference);
    var amount = random_num(2) + 2;
    for(var i = 0; i < amount; ++i){
        var tile = lava_pool_tile();
        spawn_nearby(map, tile, self.location, nearby);
    }
}
/** @type {SpellGenerator} */
function piercing_beam_spell_generator(){
    return {
        behavior: piercing_beam_spell,
        telegraph: piercing_beam_spell_telegraph,
        description: lich_spell_descriptions.piercing_beam,
        pic: `${IMG_FOLDER.tiles}lich_piercing_beam.png`
    }
}

/** @type {AIFunction} Spell which damages each tile in a single direction.*/
function piercing_beam_spell(self, target, map){
    var aim_direction = order_nearby(target.difference)[0];
    var beam_location = self.location.plus(aim_direction);
    while(map.is_in_bounds(beam_location)){
        map.attack(beam_location);
        beam_location.plus_equals(aim_direction);
    }
}

/** @type {TelegraphFunction} */
function piercing_beam_spell_telegraph(location, map, self){
    var attacks = [];
    var nearby = random_nearby();
    for(var direction of nearby){
        var beam_location = location.plus(direction);
        while(map.is_in_bounds(beam_location)){
            attacks.push(beam_location.copy());
            beam_location.plus_equals(direction);
        }
    }
    return attacks;
}
/** @type {SpellGenerator} */
function rest_spell_generator(){
    return {
        behavior: rest_spell,
        telegraph: rest_spell_telegraph,
        description: lich_spell_descriptions.rest,
        pic: `${IMG_FOLDER.tiles}lich_rest.png`
    }
}

/** @type {AIFunction} Spell which does nothing.*/
function rest_spell(self, target, map){}

/** @type {TelegraphFunction} */
function rest_spell_telegraph(location, map, self){
    return [];
}
/** @type {SpellGenerator} */
function summon_spell_generator(){
    return {
        behavior: summon_spell,
        description: lich_spell_descriptions.summon,
        pic: `${IMG_FOLDER.tiles}lich_summon.png`
    }
}

/** @type {AIFunction} Spell which summons a random thing from the user's summon array.*/
function summon_spell(self, target, map){
    if(self.tile.summons === undefined){
        throw new Error(ERRORS.missing_property);
    }
    for(var i = 0; i < 2; ++i){
        var tile = random_from(self.tile.summons)();
        spawn_nearby(map, tile, self.location);
    }
}
/** @type {SpellGenerator} */
function teleport_spell_generator(){
    return {
        behavior: teleport_spell,
        description: lich_spell_descriptions.teleport,
        pic: `${IMG_FOLDER.tiles}lich_teleport.png`
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
// ----------------Spells.js----------------
// File for spell ai functions.

/**
 * @typedef {Object} Spell A set a behavior, description and pic used by the lich.
 * @property {AIFunction} behavior Function performing the spell.
 * @property {TelegraphFunction=} telegraph Function telegraphing the damaging effects of the spell.
 * @property {TelegraphFunction=} telegraph_other Function telegraphing the non damaging effects of the spell.
 * @property {string} description A description of what the spell does.
 * @property {string} pic A picture to help telegraph the spell.
 */

/**
 * @callback SpellGenerator
 * @returns {Spell}
 */
// ----------------TelegraphUtils.js----------------
// File for utility functions and jsdoc typedefs used to telegraph enemy attacks and abilities.

/**
 * @callback TelegraphFunction Function to get the points that a entity can attack on it's next turn.
 * @param {Point} location Where the entity currently is.
 * @param {GameMap} map The map it's in.
 * @param {Tile} self Info about the entity.
 * @returns {Point[]} An array of the points on the map it could currently attack.
 */

const ORTHOGONAL_DIRECTIONS = [new Point(1, 0), new Point(-1, 0), new Point(0, -1), new Point(0, 1)];
const DIAGONAL_DIRECTIONS = [new Point(1, 1), new Point(-1, 1), new Point(1, -1), new Point(-1, -1)];
const ALL_DIRECTIONS = [...ORTHOGONAL_DIRECTIONS, ...DIAGONAL_DIRECTIONS];

/** @type {TelegraphFunction} */
function hazard_telegraph(location, map, self){
    return [location];
}
/**
 * Function to get all points from a location to and including the closest occupied space in a direction.
 * @param {Point} location The starting location which should not be included.
 * @param {Point} direction The relative direction to look from the starting location.
 * @param {GameMap} map The gamemap to look on.
 * @returns {Point[]} An array of the points in that direction up to the first occupied one.
 */
function get_points_in_direction(location, direction, map){
    location = location.copy();
    var points = [];
    while(map.check_empty(location.plus_equals(direction))){
        points.push(location.copy());
    }
    points.push(location);
    return points;
}
function look_at_points_in_direction(location, direction, map){
    location = location.copy();
    var points = [];
    while(map.looks_empty(location.plus_equals(direction))){
        points.push(location.copy());
    }
    points.push(location);
    return points;
}
/**
 * Function that for an array of directions, attempts to move in a direction if possible, then attack in that direction.
 * @param {Point} location The starting location
 * @param {GameMap} map The map to look on.
 * @param {Point[]} directions The directions to attempt to move and attack in.
 * @returns {Point[]} Where moving then attacking in each of the chosen directions would hit.
 */
function move_attack_telegraph(location, map, directions){
    var attacks = [];
    for(var direction of directions){
        if(map.looks_empty(location.plus(direction))){
            attacks.push(location.plus(direction.times(2)));
        }
        attacks.push(location.plus(direction));
    }
    return attacks;
}
class AchievementList{
    #list
    constructor(){
        this.#list = get_achievements();
    }
    achieve(name){
        // Achieves the achievement with the given name.
        var match = this.#list.find((e) => {
            return e.name === name;
        });
        if(match === undefined){
            throw new Error(ERRORS.value_not_found);
        }
        var achieved = !match.has;
        match.has = true;
        return achieved;
    }
    completed(){
        // Returns a list of the achievements that they have achieved.
        return this.#list.filter((e) => {
            return e.has;
        });
    }
    unfinished(){
        // Returns a list of the unfinished achievements.
        return this.#list.filter((e) => {
            return !e.has;
        });
    }
    all(){
        // Returns all achievements.
        return [...this.#list];
    }
    has(name){
        // Checks if they have the achievement with the chosen name.
        var match = this.#list.find((e) => {
            return e.name === name;
        });
        if(match === undefined){
            throw new Error(ERRORS.value_not_found);
        }
        return match.has;
    }
    get(){
        // Returns a list with the names of all the achiements they have earned.
        return this.completed().map((e) => {
            return e.name;
        });
    }
    set(list){
        // Updates has values to match a list of JSONS that are passed in from the save data.
        if(list === undefined){
            return;
        }
        for(var element of list){
            this.achieve(element);
        }
    }
    count_bosses(){
        // Counts how many unique boss killing achievements have been earned
        var filtered = this.#list.filter((a) => {
            return boss_achievements.find((n) => {return a.name === n &&  a.has}) !== undefined;
        });
        return filtered.length;
    }
}
class BoonTracker{
    #choices;
    #boons;
    #lost_boons;
    total;
    constructor(initial_choices){
        this.#choices = [...initial_choices];
        this.#boons = [];
        this.#lost_boons = [];
        this.total = 0;
    }
    get_choices(amount = this.#choices.length){
        var choice_list = randomize_arr(this.#choices);
        var locked = [];
        GS.data.achievements.unfinished().map((a) => {
            if(a.boons !== undefined){
                locked.push(...a.boons);
            }
        });
        var picks = [];
        while(picks.length < amount && choice_list.length > 0){
            var boon = choice_list.pop()();
            if(boon.prereq === undefined || boon.prereq()){
                if(locked.find((b) => {return b().name === boon.name}) === undefined){
                    picks.push(boon);
                }
            }
        }
        return picks;
    }
    has(name){
        var count = 0;
        for(var boon of this.#boons){
            if(boon.name === name){
                ++count;
            }
        }
        return count;
    }
    pick(name){
        for(var i = 0; i < this.#choices.length; ++i){
            var boon_fun = this.#choices[i];
            var boon = boon_fun();
            if(boon.name === name){
                this.#choices.splice(i, 1);
                this.#boons.push(boon);
                ++this.total;
                GS.data.add_boon(boon.name);
                if(boon.unlocks !== undefined){
                    this.#choices.push(...boon.unlocks);
                }
                if(boon.max === undefined || this.has(boon.name) < boon.max){
                    this.#choices.push(boon_fun);
                }
                if(boon.on_pick !== undefined){
                    boon.on_pick();
                }
                if(boon.after_pick !== undefined){
                    boon.after_pick();
                    return false;
                }
                return true;
            }
        }
        return false;
    }
    lose(name){
        for(var i = 0; i < this.#boons.length; ++i){
            var boon = this.#boons[i];
            if(boon.name === name){
                this.#boons.splice(i, 1);
                this.#lost_boons.push(boon);
                return true;
            }
        }
        return false;
    }
    get_gained(){
        return this.#boons.map(b => {return {
            name: b.name,
            pic: b.pic,
            on_click: function(){say(b.description)}
        }});
    }
    get_lost(){
        return this.#lost_boons.map(b => {return {
            name: b.name,
            foreground: [`${IMG_FOLDER.other}lost.png`],
            pic: b.pic,
            on_click: function(){say(b.description)}
        }});
    }
}
// ----------------ButtonGrid.js----------------
// The ButtonGrid class is used to keep track of the possible moves a card has.

class ButtonGrid{
    #buttons; // A 3x3 2d array used to store the options.
    #instant;
    constructor(){
        this.#instant = false;
        var initial = {
            description: null_move_button
        }
        this.#buttons = [
            [initial, initial, initial],
            [initial, initial, initial], 
            [initial, initial, initial]
        ];
    }
    /**
     * A function to add behavior to a button.
     * @param {string} description Text that should appear on the button.
     * @param {PlayerCommand[]} behavior An array of commands for the player to follow when the button is clicked.
     * @param {number} [number = -1] Which spot on the 3x3 grid (numbered 1-9) the button should appear on. 
     *                                  If it is blank or -1, the position will be infered from the description.
     */
    add_button(description, behavior, number = -1){
        // Adds a description and a list of commands to one of the buttons.
        // Throws error of the button number is out of range.
        if(number === -1){
            // If the button that should be edited is not provided, it will be infered from the description if possible.
            number = this.#convert_direction(description);
        }
        if(number < 1 || number > 9){
            throw new Error(ERRORS.invalid_value);
        }
        var button = {
            description,
            behavior
        }
        this.#buttons[Math.floor((number - 1) / 3)][(number - 1) % 3] = button;
    }
    /**
     * A function to return the information required to display the buttons.
     * @param {number} hand_position The position of the card in hand that these buttons belong to.
     */
    show_buttons(hand_position){
        var grid = [];
        var telegraph = function(behavior){
            return function(){
                var t = telegraph_card(behavior, GS.map, GS.map.get_player_location());
                GS.map.clear_telegraphs();
                GS.map.mark_telegraph(t.moves, `${IMG_FOLDER.actions}move_telegraph.png`);
                GS.map.mark_telegraph(t.attacks, `${IMG_FOLDER.actions}hit_telegraph.png`);
                GS.map.mark_telegraph(t.stun, `${IMG_FOLDER.actions}confuse.png`);
                GS.map.mark_telegraph(t.healing, `${IMG_FOLDER.actions}heal.png`);
                GS.map.mark_telegraph(t.teleport, `${IMG_FOLDER.actions}teleport_telegraph.png`);
                display_map(GS.map);
            }
        }
        var click = function(behavior){
            return function(){
                if(behavior != undefined){
                    GS.player_turn(behavior, hand_position);
                }
            }
        }
        var repeat = repeat_amount();
        for(var row of this.#buttons){
            grid.push(row.map(button => {
                var str = ``;
                for(var i = 0; i < repeat; ++i){
                    str += `${button.description}`;
                }
                return {
                    description: str,
                    alt_click: telegraph(button.behavior),
                    on_click: click(button.behavior),
                }
            }));
        }
        return grid;
    }
    /**
     * Creates an explanation of what each button does.
     * @returns {String} The explanation.
     */
    explain_buttons(){
        var explanation = move_types.intro;
        for(let row of this.#buttons){
            for(let button of row){
                if(button.description !== null_move_button){
                    var commands = button.behavior.map((b) => `(${explain_action(b)})`);
                    if(commands.length === 0){
                        commands = [`(${move_types.nothing})`];
                    }
                    var command_str = commands.join(`, ${NBS}`); // Non breaking spaces used so they won't be collapsed.
                    explanation = explanation.concat(`${NBS}${NBS}${NBS}${NBS}${usymbol.bullet} ${button.description}: ${command_str}\n`);
                }
            }
        }
        return explanation;
    }
    /**
     * A helper function to infer the number (1-9) on the 3x3 button grid where a new button should go.
     * @param {string} direction String used to make the inference.
     * @returns {number} Returns the number (1-9) if it can be infered and -1 if it can't.
     */
    #convert_direction(direction){
        var direction_list = [NW, N, NE, W, C, E, SW, S, SE];
        var index = direction_list.indexOf(direction);
        if(index >= 0){
            return index + 1;
        }
        return -1;
    }
    /**
     * Function to convert a card into an instant.
     */
    make_instant(){
        this.#instant = true;
    }
    /**
     * Function to check to see if it is an instant.
     * @returns {boolean} If it is an instant.
     */
    is_instant(){
        return this.#instant;
    }
    has_action_type(type){
        for(var row of this.#buttons){
            for(var button of row){
                if(button.behavior !== undefined){
                    var match = button.behavior.find((b) => {
                        return b.type === type;
                    });
                    if(match !== undefined){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    get_behavior(num){
        if(num < 1 || 9 < num){
            throw new Error(ERRORS.invalid_value);
        }
        --num;
        return this.#buttons[Math.floor(num / 3)][num % 3].behavior;
    }
}
class DeckSelector{
    #deck;
    #cards;
    #selected;
    #action;
    constructor(deck, action){
        this.#deck = deck;
        this.#cards = deck.get_deck_info();
        this.#selected = undefined;
        this.#action = action;
    }
    select(index){
        if(index >= 0 && index < this.#deck.deck_size()){
            this.#selected = index;
            return true;
        }
        return false;
    }
    check_valid(){
        return this.#selected !== undefined;
    }
    confirm(){
        if(this.check_valid()){
            this.#action(this.#cards[this.#selected], this.#deck);
        }
    }
    get_display_info(){
        return this.#cards.map((card, i) => {
            return {
                name: card.name,
                pic: card.pic,
                card,
                on_click: () => {this.select(i)},
                selected: this.#selected === i
            }
        });
    }
}
// ----------------EntityList.js----------------
// EntityList class is used by the GameMap class to keep track of entities without having to search through the map each time.

/**
 * @typedef {Object} Tile_W_Pos An object containing a Tile and it's current position.
 * @property {Tile} enemy The tile.
 * @property {Point} location It's current location.
 */

class EntityList{
    /** @type {number} The number of nun empty tiles on the floor.*/
    count_non_empty;
    /** @type {Point | undefined} The position of the player, or undefined if they haven't been added yet.*/
    #player_pos;
    /** @type {Tile_W_Pos[]} An array of each entity on the floor with a behavior as well as their location.*/
    #enemy_list;
    /** @type {number} Used to give a unique ID to each tile that is added.*/
    #id_count;

    constructor(){
        this.count_non_empty = 1;
        this.#id_count = 0;
        this.#enemy_list = [];
    }
    /**
     * Gets a unique id and increments the count.
     * @returns {number} The id.
     */
    next_id(){
        return ++this.#id_count;
    }
    /**
     * @param {Point} location Where the player's location should be set to.
     */
    set_player_pos(location){
        this.#player_pos = location;
    }
    /**
     * Returns the player's location. Throws an error if it's undefined.
     * @returns {Point} The player's location.
     */
    get_player_pos(){
        if(this.#player_pos === undefined){
            throw new Error(ERRORS.value_not_found);
        }
        return this.#player_pos.copy();
    }
     /**
     * Adds a new enemy and it's location to the array of enemies.
     * @param {Point} location The location of the enemy.
     * @param {Tile} enemy The tile.
     */
    add_enemy(location, enemy){
        enemy.id = this.next_id();
        var to_add = {location: location.copy(), enemy};
        if(enemy.tags.has(TAGS.fireball)){
            // Fireballs move before everything else and in the order they are created to avoid collisions.
            var index = this.#enemy_list.findIndex((e) =>{
                return !e.enemy.tags.has(TAGS.fireball);
            });
            this.#enemy_list.splice(index, 0, to_add);
        }
        else{
            this.#enemy_list.push(to_add);
        }
        ++this.count_non_empty;
    }
    /**
     * Changes an enemy's location.
     * @param {Point} location The new location.
     * @param {number} id The id of the enemy whose location should be moved. Throws an error if none match.
     */
    move_enemy(location, id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(ERRORS.missing_id);
        }
        this.#enemy_list[index].location = location;
    }
    /**
     * Removes an enemy.
     * @param {number} id The id of the enemy to be removed. Throws an error if none match.
     */
    remove_enemy(id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(ERRORS.missing_id);
        }
        this.#enemy_list.splice(index, 1);
        --this.count_non_empty;
    }
    /**
     * Helper function to determine the location of an entity in the entity_list.
     * @param {number} id ID to search for.
     * @returns {number} Returns the index if found and -1 if not.
     */
    #find_by_id(id){
        for(var i = 0; i < this.#enemy_list.length; ++i){
            if(this.#enemy_list[i].enemy.id === id){
                return i;
            }
        }
        return -1;
    }
    /**
     * Moves a enemy or a player. Throws an error if the type is something else or the entity is not in the entity_list.
     * @param {Point} location The new location.
     * @param {Tile} entity The Tile to be moved
     */
    move_any(location, entity){
        if(entity.type === entity_types.player){
            this.set_player_pos(location);
        }
        else if(entity.type === entity_types.enemy){
            if(entity.id === undefined){
                throw new Error(ERRORS.missing_id);
            }
            this.move_enemy(location, entity.id);
        }
        else if(entity.tags.has(TAGS.unmovable)){
            throw new Error(ERRORS.invalid_type);
        }
    }
    /**
     * Each enemy takes a turn in order.
     * Throws an error if the player dies or is moved.
     * @param {GameMap} map The map object which their actions will be performed on.
     */
    async enemy_turn(map){
        // Triggers each enemy's behavior.
        // Displays the game map between each.
        var turn = [...this.#enemy_list];
        for(var e of turn){
            if(e.enemy.id === undefined){
                throw new Error(ERRORS.missing_id);
            }
            if(!(this.#find_by_id(e.enemy.id) === -1)){
                try{
                    var initial_health = GS.map.get_player().health;
                    if(e.enemy.stun !== undefined && e.enemy.stun > 0){
                        --e.enemy.stun;
                    }
                    else{
                        var do_delay = true;
                        try{
                            if(e.enemy.tags.has(TAGS.controlled)){
                                throw Error(ERRORS.skip_animation);
                            }
                            if(e.enemy.behavior !== undefined){
                                var self = {
                                    tile: e.enemy,
                                    location: e.location.copy(),
                                }
                                var target = {
                                    tile: map.get_player(),
                                    difference: this.get_player_pos().minus(e.location),
                                }
                                await e.enemy.behavior(self, target, map);
                                proc_chilly_presence(e.enemy);
                            }
                        }
                        catch(error){
                            if(error.message === ERRORS.skip_animation){
                                do_delay = false;
                                proc_chilly_presence(e.enemy);
                            }
                            else if(!(error.message === ERRORS.creature_died)){
                                throw error
                            }
                        }
                        display_map(map);
                        if(do_delay){
                            await delay(ANIMATION_DELAY);
                        }
                    }
                    if(GS.boons.has(boon_names.pain_reflexes) && GS.map.get_player().health < initial_health){
                        throw new Error(ERRORS.pass_turn);
                    }
                }
                catch(error){
                    if(error.message === ERRORS.game_over){
                        throw new Error(ERRORS.game_over, {cause: new Error(e.enemy.name)});
                    }
                    throw error;
                }
            } 
        }
    }
    get_initiative(){
        var visible = this.#enemy_list.filter(e => !e.enemy.tags.has(TAGS.hidden));
        return visible.map(e => {
            return {
                name: e.enemy.name,
                pic: e.enemy.pic,
                health: e.enemy.health,
                max_health: e.enemy.max_health,
                stun: e.enemy.stun,
                location: e.location,
                rotate: e.enemy.rotate,
                flip: e.enemy.flip
            }
        });
    }
}
// ----------------GameMap.js----------------
// GameMap class holds the information on the current floor and everything on it.

/**
 * @callback MapEventFunction Function to execute an event on the map at the end of the enemies' turn.
 * @param {GameMap} map Function controlling behavior of the event.
 */
/**
 * @typedef {Object} MapEvent An object representing an event that will happen at the end of the enemies' turn.
 * @property {String} name The name of the event.
 * @property {MapEventFunction} behavior The event's behavior.
 */
/**
 * @typedef {Object} GridSpace
 * @property {GridSpaceLayer[]} foreground
 * @property {Tile} tile
 * @property {GridSpaceLayer[]} background
 * @property {GridSpaceLayer=} action
 * @property {GridSpaceLayer=} stunned
 * @property {GridSpaceLayer} floor
 */
/**
 * @typedef {Object} GridSpaceLayer
 * @property {string} pic
 * @property {string=} description
 * @property {TelegraphFunction=} telegraph
 * @property {TelegraphFunction=} telegraph_other
 */

class GameMap{
    /** @type {number} Size of the grid's x axis.*/
    #x_max;
    /** @type {number} Size of the grid's y axis.*/
    #y_max;
    /** @type {EntityList} Used to keep track of non player entity locations and perform their turns.*/
    #entity_list;
    /** @type {Tile[][]} Grid representing the floor layout.*/
    #grid;
    /** @type {number} Which number floor this is.*/
    #floor_num;
    /** @type {StatTracker} Tracks various statistics about the game.*/
    stats;
    /** @type {MapEvent[]} Events that will happen at the end of the turn.*/
    #events;
    /** @type {Area} The current area of the dungeon they are in.*/
    #area;
    /**@type {boolean} Keeps track of if it is currently the player's turn or not.*/
    #is_player_turn;
    /**@type {Point[]} Keeps track of the current position of the exit(s)*/
    #exit_pos;
    /**
     * @param {number} x_max The x size of floors in this dungeon.
     * @param {number} y_max The y size of floors in this dungeon.
     * @param {Area} starting_area The starting area.
     */
    constructor(x_max, y_max, starting_area){
        this.#x_max = x_max;
        this.#y_max = y_max;
        this.#entity_list = new EntityList();
        this.#floor_num = 0;
        this.stats = new StatTracker();
        this.#events = [];
        this.#area = starting_area;
        this.#is_player_turn = true;
        this.#exit_pos = [];
        this.erase();
    }
    /**
     * Function to reset the floor so the next one can be generated,
     * @returns {number} The updated floor number.
     */
    erase(){
        try{
            // Grabs the player tile from the current floor.
            var player = this.get_player();
        }
        catch(error){
            if(error.message === ERRORS.value_not_found){
                var player = player_tile();
            }
            else{
                throw error;
            }
        }
        this.#entity_list = new EntityList();
        this.#grid = [];
        this.#exit_pos = [];
        ++this.#floor_num;
        // Fill the grid with blank spaces.
        for(var i = 0; i < this.#y_max; ++i){
            this.#grid.push([]);
            for(var j = 0; j < this.#x_max; ++j){
                this.#grid[i].push(grid_space(this.#area));
            }
        }
        // Add the player and the exit.
        if(this.#floor_num % init_settings().area_size === 0){
            var areas = randomize_arr(this.#area.next_area_list);
            for(var i = 0; i < GS.boons.has(boon_names.choose_your_path) + 1 && i < areas.length; ++i){
                this.set_exit(undefined, areas[i]());
            }
        }
        else{
            this.set_exit();
        }
        var player_location = new Point(random_num(this.#y_max), this.#x_max - 1);
        this.set_player(player_location, player);
        this.#events = [];
        return this.#floor_num;
    }
    /**
     * @returns {Point} A random space on the floor.
     */
    random_space(){
        return new Point(random_num(this.#x_max), random_num(this.#y_max));
    }
    /**
     * @returns {Point} A random empty space on the floor.
     */
    random_empty(){
        var num_empty = this.#x_max * this.#y_max - this.#entity_list.count_non_empty;
        var rand = random_num(num_empty);
        if(num_empty === 0){
            throw new Error(ERRORS.map_full);
        }
        for(var x = 0; x < this.#x_max; ++x){
            for(var y = 0; y < this.#y_max; ++y){
                var pos = new Point(x, y);
                if(this.get_tile(pos).type === entity_types.empty){
                    if(rand === 0){
                        return pos;
                    }
                    --rand;
                }
            }
        }
        throw new Error(ERRORS.map_full);
    }
    /**
     * Thows an error if the provided point is out of bounds.
     * @param {Point} location The point to check.
     */
    check_bounds(location){
        if(location.x < 0 || location.x >= this.#x_max){
            throw new Error(ERRORS.out_of_bounds);
        }
        if(location.y < 0 || location.y >= this.#y_max){
            throw new Error(ERRORS.out_of_bounds);
        }
    }
    /**
     * Checks if a point is within bounds.
     * @param {Point} location The point to check.
     * @returns {boolean} If the point is in bounds.
     */
    is_in_bounds(location){
        if(location.x < 0 || location.x >= this.#x_max){
            return false;
        }
        if(location.y < 0 || location.y >= this.#y_max){
            return false;
        }
        return true;
    }
    /**
     * Checks if a location is in bounds and empty.
     * @param {Point} location The point to check.
     * @returns {boolean} Returns true if the location is both in bounds and empty and false otherwise.
     */
    check_empty(location){
        return this.is_in_bounds(location) && this.get_tile(location).type === entity_types.empty;
    }
    /**
     * Checks if a location is in bounds and looks empty (could be something invisible).
     * @param {Point} location The point to check.
     * @returns {boolean} Returns true if the location is both in bounds and looks empty and false otherwise.
     */
    looks_empty(location){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var tile = this.get_tile(location);
        var looks_empty = tile.look !== undefined && tile.look.type === entity_types.empty;
        return this.check_empty(location) || looks_empty;
    }
    /**
     * Places an exit tile at the given location
     * Throws an error if the location is out of bounds, the space is not empty or there is already an exit tile.
     * @param {Point} location The location to set the exit at.
     */
    set_exit(location = undefined, next_area = undefined){
        if(location === undefined){
            var top_row = range(this.#y_max);
            var points = top_row.map((y) => {
                return new Point(y, 0);
            }).filter((p) => {
                return this.check_empty(p);
            });
            location = random_from(points);
        }
        this.check_bounds(location);
        if(!this.check_empty(location)){
            throw new Error(ERRORS.space_full);
        }
        var exit = exit_tile();
        if(next_area !== undefined){
            exit.next_area = next_area;
            this.get_grid(location).floor = next_area.background;
        }
        this.#exit_pos.push(location);
        this.add_tile(exit, location);
    }
    /**
     * Places the player at the given location.
     * Throws an error if player is not a player, the location is out of bounds, the space is not empty or there is already a player tile.
     * @param {Point} player_location The location to set the player at.
     * @param {Tile} player The player tile to be placed,
     */
    set_player(player_location, player){
        if(player.type !== entity_types.player){
            throw new Error(ERRORS.invalid_value);
        }
        this.check_bounds(player_location);
        if(!this.check_empty(player_location)){
            throw new Error(ERRORS.space_full);
        }
        try{
            // If player isn't undefined, throws error.
            this.#entity_list.get_player_pos();
            throw new Error(ERRORS.already_exists);
        }
        catch(error) {
            if(error.message !== ERRORS.value_not_found){
                throw error;
            }
            // otherwise continues.
        }
        this.#entity_list.set_player_pos(player_location);
        this.#set_tile(player_location, player);
    }
    /**
     * Function to add a tile to the map.
     * @param {Tile} tile The tile to be added.
     * @param {Point} [location = undefined] Optional location to place the tile. If the location is not empty, an error will be thrown.
     *                                          If not provided, the location will be a random unoccupied one.
     * @returns {Point | void} If it successfully adds the tile, returns the location. Otherwise, returns void.
     */
    add_tile(tile, location = undefined){
        try{
            // Makes sure the location is valid and empty
            if(location === undefined){
                location = this.random_empty();
            }
            this.check_bounds(location);
            if(!this.check_empty(location)){
                throw new Error(ERRORS.space_full);
            }
        }
        catch(error){
            return;
        }
        this.#set_tile(location, tile);
        if(tile.type === entity_types.enemy){
            this.#entity_list.add_enemy(location, tile);
        }
        else if(!(tile.type === entity_types.empty)){
            ++this.#entity_list.count_non_empty;
        }
        return location.copy();
    }
    /**
     * Makes a number of attempts to spawn the given enemy at a location where it can't immediately attack the player.
     * @param {Tile} tile The tile to be added.
     * @param {number} tries The number of attempts
     * @param {boolean} force If true, the enemy will be spawned randomly using add_tile after all tries are exhausted. 
     * @returns {Point | void} If the tile is added, it returns the location. Otherwise it returns void.
     */
    spawn_safely(tile, tries, force){
        var attacks = [];
        var player_location = this.#entity_list.get_player_pos();
        if(!player_location){
            throw new Error(ERRORS.value_not_found);
        }
        for(var i = 0; i < tries; ++i){
            var location = this.random_empty();
            if(tile.telegraph){
                attacks = tile.telegraph(location, this, tile);
            }
            if(!attacks.find((element) => point_equals(element, player_location))){
                return this.add_tile(tile, location);
            }
        }
        if(force){
            return this.add_tile(tile);
        }
        return undefined;
    }
    /**
     * Function to display the gamemap and the player's health.
     * Clicking on a tile will give info about it.
     * Resets tiles marked as hit afterwards.
     */
    display(){
        var make_on_click = function(space, location, gameMap){
            return function(){
                var description = grid_space_description(space);
                var tile = space.tile;
                if(tile.look !== undefined){
                    tile = tile.look;
                }
                say(description);
                GS.data.add_tile(tile.name);
                gameMap.clear_telegraphs();
                var telegraph_spaces = [];
                var telegraph_other_spaces = [];
                for(var element of [...space.foreground, ...space.background]){
                    // Checks for upcoming attacks from the things in the foreground and background.
                    if(element.telegraph !== undefined){
                        telegraph_spaces.push(...element.telegraph(location, gameMap, element));
                    }
                    if(element.telegraph_other !== undefined){
                        telegraph_other_spaces.push(...element.telegraph_other(location, gameMap, element));
                    }
                }
                // Checks for upcoming attacks from the tile itself.
                if(tile.telegraph !== undefined && !tile.stun){
                    telegraph_spaces.push(...tile.telegraph(location, gameMap, tile));
                }
                if(tile.telegraph_other !== undefined && !tile.stun){
                    telegraph_other_spaces.push(...tile.telegraph_other(location, gameMap, tile));
                }
                // Telegraphs possible upcoming attacks and other things.
                gameMap.mark_telegraph(telegraph_spaces);
                gameMap.mark_telegraph(telegraph_other_spaces, `${IMG_FOLDER.actions}telegraph_other.png`);
                display_map(gameMap);
                display.add_class(`${UIIDS.map_display} ${location.y} ${location.x}`, `selected-tile`);
            }
        }
        var grid = [];
        for(var y = 0; y < this.#y_max; ++y){
            var row = this.#grid[y];
            var table_row = [];
            for(var x = 0; x < this.#x_max; ++x){
                let space = row[x];
                let stunned = [];
                if(space.tile.stun !== undefined && space.tile.stun > 0){
                    stunned.push(`${IMG_FOLDER.actions}confuse.png`);
                }
                var tile = space.tile.look === undefined ? space.tile : space.tile.look;
                let foreground_pics = space.foreground.map((fg) => fg.pic);
                let background_pics = space.background.map((fg) => fg.pic);
                table_row.push({
                    name: tile.name,
                    foreground: foreground_pics,
                    pic: tile.pic,
                    rotate: tile.rotate,
                    flip: tile.flip,
                    background: [...background_pics, space.action, ...stunned, space.floor],
                    on_click: make_on_click(space, new Point(x, y), this),
                });
            };
            grid.push(table_row);
        }
        return grid;
	}
    /**
     * Moves a tile.
     * Throws errors if the player reaches the end of the floor or if the tile (player or not) dies.
     * @param {Point} start_point The current location of the tile to be moved.
     * @param {Point} end_point Where you want to move the tile to.
     * @returns {boolean} Returns true if the tile is moved succesfully, false if it is not.
     */
    move(start_point, end_point){
        this.check_bounds(start_point);
        if(!this.is_in_bounds(end_point)){
            return false;
        }
        var start = this.get_tile(start_point);
        var end = this.get_tile(end_point);
        if(start.type === entity_types.player && end.type === entity_types.exit){
            this.stats.increment_turn();
            var floor_turns = this.stats.finish_floor();
            if(floor_turns <= 3){
                GS.achieve(achievement_names.peerless_sprinter);
            }
            if(end.next_area !== undefined){
                this.#area.next_area_list = [end.next_area];
            }
            throw new Error(ERRORS.floor_complete);
        }
        if(start.type === entity_types.player && end.type === entity_types.final_exit){
            this.stats.increment_turn();
            GS.data.clear_area(this.#area.name);
            throw new Error(ERRORS.victory);
        }
        if(end.on_enter !== undefined){
            // If the destination does something if moved onto, call it.
            try{
                var entity_entered = {
                    tile: end,
                    location: end_point
                }
                var mover_info = {
                    tile: start,
                    difference: start_point.minus(end_point),
                }
                end.on_enter(entity_entered, mover_info, this);
            }
            catch(error){
                if(error.message === ERRORS.game_over){
                    throw new Error(ERRORS.game_over, {cause: new Error(end.name)});
                }
                if(error.message === ERRORS.skip_animation){
                    // Do nothing
                }
                else{
                    throw error;
                }
            }
            if(start.health !== undefined && start.health <= 0){
                throw new Error(ERRORS.creature_died);
            }
        }
        end = this.get_tile(end_point);
        if(end.type === entity_types.empty && this.get_tile(start_point) === start){
            // Move.
            this.#entity_list.move_any(end_point, start);
            this.#set_tile(end_point, start);
            this.#set_tile(start_point, empty_tile());
            return true;
        }
        return false;
    }
    /**
     * Moves the player relative to their current location.
     * @param {Point} direction Relative movement.
     * @returns {boolean} Returns true if the player is moved, false otherwise.
     */
    player_move(direction){
        // Moves the player the given relative distance.
        var player_pos = this.#entity_list.get_player_pos();
        return this.move(player_pos, player_pos.plus(direction));
    }
    /**
     * Teleports something at a space relative to the player to a random location.
     * @param {Point} target Relative location.
     * @returns {boolean} Returns true if something was teleported, false otherwise.
     */
    player_teleport(target){
        var player_pos = this.#entity_list.get_player_pos();
        var destination = this.random_empty();
        return this.move(player_pos.plus(target), destination);
    }
    /**
     * Returns the player tile. Throws an error if there isn't one.
     * @returns {Tile} The player tile.
     */
    get_player(){
        var pos = this.#entity_list.get_player_pos();
        return this.get_tile(pos);
    }
    /**
     * Returns the player's location. Throws an error if there isn't one.
     * @returns {Point} The player's location.
     */
    get_player_location(){
        return this.#entity_list.get_player_pos();
    }
    /**
     * Attacks a point on the grid.
     * @param {Point} location Where to attack.
     * @returns {boolean} Returns true if the attack hit.
     */
    attack(location, source = undefined){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var space = this.get_grid(location);
        space.action = `${IMG_FOLDER.actions}hit.png`;
        var target = space.tile;
        if(target.health === 0){
            return false;
        }
        if(target.health !== undefined && !target.tags.has(TAGS.invulnerable)){
            target.health -= 1;
            if(source !== undefined && source.tile.type === entity_types.player){
                this.stats.increment_damage_dealt();
            }
            if(target.tags.has(TAGS.boss)){
                this.stats.damage_boss();
                if(source !== undefined && source.tile.type === entity_types.player){
                    this.stats.player_damage_boss();
                }
            }
            if(target.type === entity_types.player){
                if(this.#is_player_turn){
                    this.stats.increment_turn_damage();
                }
                else{
                    this.stats.increment_damage();
                }
                if(chance(GS.boons.has(boon_names.quick_healing), 4)){
                    this.player_heal(new Point(0, 0), 1);
                }
            }
            var current_health = target.health;
            if(target.on_hit !== undefined){
                // Trigger on_hit.
                var player_pos = this.#entity_list.get_player_pos();
                var hit_entity = {
                    tile: target,
                    location: location
                }
                var aggressor_info = { // TODO: when damage source is implemented, use that instead.
                    tile: this.get_player(),
                    difference: player_pos.minus(location),
                }
                target.on_hit(hit_entity, aggressor_info, this);
            }
            if(current_health <= 0){
                // Player death.
                if(target.type === entity_types.player){
                    if(GS.boons.has(boon_names.rebirth)){
                        this.player_heal(new Point(0, 0));
                        GS.boons.lose(boon_names.rebirth);
                        GS.refresh_boon_display();
                        say_record(boon_messages.rebirth);
                        return true;
                    }
                    throw new Error(ERRORS.game_over);
                }
                // Non player death.
                this.#set_tile(location, empty_tile());
                if(target.type === entity_types.enemy){
                    if(target.id === undefined){
                        throw new Error(ERRORS.missing_id);
                    }
                    this.#entity_list.remove_enemy(target.id);
                }
                else{
                    --this.#entity_list.count_non_empty;
                    if(target.type === entity_types.chest && source !== undefined && source.tile.type === entity_types.player){
                        this.stats.increment_chest_kills();
                    }
                }
                if(source !== undefined && source.tile.type === entity_types.player){
                    if(!target.tags.has(TAGS.obstruction)){
                        this.stats.increment_kills();
                    }
                    this.stats.increment_destroyed();
                }
                if(target.on_death !== undefined){
                    // Trigger on_death
                    var player_pos = this.#entity_list.get_player_pos();
                    var dying_entity = {
                        tile: target,
                        location: location
                    }
                    var player_info = {
                        tile: this.get_player(),
                        difference: player_pos.minus(location),
                    }
                    target.on_death(dying_entity, player_info, this);
                }
            }
            return true;
        }
        if((target.health === undefined || !target.tags.has(TAGS.invulnerable)) && target.on_hit !== undefined){
            // Trigger on_hit
            var player_pos = this.#entity_list.get_player_pos();
            var hit_entity = {
                tile: target,
                location: location,
            }
            var aggressor_info = { // TODO: when damage source is implemented, use that instead.
                tile: this.get_player(),
                difference: player_pos.minus(location),
            }
            target.on_hit(hit_entity, aggressor_info, this);
            return true;
        }
        return false;
    }
    /**
     * Attacks relative to the player's location.
     * @param {Point} direction Relative direction of attack.
     * @returns {boolean} Returns true if the attack hits and false otherwise.
     */
    player_attack(direction){
        var player_pos = this.#entity_list.get_player_pos();
        var pos = player_pos.plus(direction);
        var current_kills = this.stats.get_stats().destroyed;
        try{
            if(
                chance(GS.boons.has(boon_names.flame_strike), 2) && 
                direction.within_radius(1) && !direction.is_origin() &&
                this.check_empty(pos)
            ){
                var fireball = shoot_fireball(direction);
                this.add_tile(fireball, pos);
            }
            var hit = this.attack(pos, {tile: this.get_player(), location: player_pos});
            if(current_kills < this.stats.get_stats().destroyed && GS.boons.has(boon_names.shattered_glass)){
                for(var offset of ALL_DIRECTIONS){
                    var p_offset = pos.plus(offset);
                    if(
                        this.is_in_bounds(p_offset) && 
                        this.get_tile(p_offset).type !== entity_types.player &&
                        this.get_tile(p_offset).type !== entity_types.chest
                    ){
                        this.player_attack(direction.plus(offset));
                    }
                }
            }
            return hit;
        }
        catch (error){
            if(error.message !== ERRORS.game_over){
                throw error;
            }
            throw new Error(ERRORS.game_over, {cause: new Error(special_tile_names.player)});
        }
    }
    /**
     * Each enemy takes their turn.
     * Throws an error if the player dies or is moved.
     * @returns {Promise<undefined>} Resolves when their turn is done.
     */
    async enemy_turn(){
        // Causes each enemy to execute their behavior.
        this.stats.increment_turn();
        this.#is_player_turn = false;
        this.clear_marked();
        await this.#entity_list.enemy_turn(this);
        this.#is_player_turn = true;
    }
    display_stats(){
        var stats = this.stats.get_stats();
        var to_display = {
            floor: this.#floor_num,
            turn: stats.turn_number,
            kills: stats.kills,
            dealt: stats.damage_dealt,
            taken: stats.damage,
            chests: stats.chests,
            destroyed: stats.chest_kills,
            health: hp_ratio(this.get_player()),
            added: GS.deck.total_added,
            removed: GS.deck.total_removed,
        }
        refresh_stage_stats(to_display, UIIDS.stage_stats);
        refresh_other_stats(to_display, UIIDS.shop_stats);
        refresh_other_stats(to_display, UIIDS.chest_stats);
        refresh_other_stats(to_display, UIIDS.deck_select_stats);
    }
    /**
     * Replaces the exit tile with a lock tile.
     * @returns {void}
     */
    lock(){
        for(var pos of this.#exit_pos){
            var lock = lock_tile();
            lock.next_area = this.get_tile(pos).next_area;
            this.#set_tile(pos, lock);
        }
    }
    /**
     * Replaces the lock tile with an exit one.
     * @returns {void}
     */
    unlock(){
        for(var pos of this.#exit_pos){
            var exit = exit_tile();
            exit.next_area = this.get_tile(pos).next_area;
            this.#set_tile(pos, exit);
        }
    }
    remove_exit(){
        for(var pos of this.#exit_pos){
            this.#set_tile(pos, empty_tile());
            this.get_grid(pos).floor = this.#area.background;
        }
        this.#exit_pos = [];
    }
    /**
     * Schedules an event to happen at end of turn.
     * @param {MapEvent} event The even to be added.
     */
    add_event(event){
        this.#events.push(event);
    }
    /**
     * Executes and removes each scheduled event.
     * Throws an error if one that isn't handled tries to happen or the player dies.
     * @returns {void}
     */
    resolve_events(){
        var current_events = this.#events;
        this.#events = [];
        for(var event of current_events){
            try{
                event.behavior(this);
            }
            catch(error){
                if(error.message === ERRORS.game_over){
                    throw new Error(ERRORS.game_over, {cause: new Error(event.name)});
                }
                throw error;
            }
        }
    }
    /**
     * Clears the current floor and goes to the next one then generates it based on the current area.
     * @returns {void}
     */
    next_floor(){
        this.erase();
        var player = this.get_player();
        var area_size = init_settings().area_size
        if(this.#floor_num === 5 && this.stats.get_stats().damage_dealt === 0){
            GS.achieve(achievement_names.non_violent);
        }
        if(this.#floor_num === 15 && GS.deck.deck_size() === 5){
            GS.achieve(achievement_names.minimalist);
        }
        var bitter_determination_amount = GS.boons.has(boon_names.bitter_determination);
        if(player.health === 1 && bitter_determination_amount > 0){
            // Bitter determination heals you if you are at exactly 1.
            this.player_heal(new Point(0, 0), bitter_determination_amount);
        }
        if(GS.boons.has(boon_names.expend_vitality) > 0){
            // Expend Vitality always heals you.
            this.player_heal(new Point(0, 0), 1);
        }
        if(GS.boons.has(boon_names.pacifism) > 0){
            // Pacifism always fully heals you.
            this.player_heal(new Point(0, 0));
        }
        if(GS.boons.has(boon_names.vicious_cycle) > 0){
            // Vicious Cycle always fully heals you.
            this.player_heal(new Point(0, 0));
        }
        var floor_description = `${gameplay_text.floor}${this.#floor_num}.`;
        if(this.#floor_num % area_size === 1){
            // Reached the next area.
            var next_list = this.#area.next_area_list;
            GS.data.clear_area(this.#area.name);
            this.#area = random_from(next_list);
            floor_description += `\n${gameplay_text.new_area}${this.#area.name}.`;
            GS.data.add_area(this.#area.name);
            GS.data.visit_area(this.#area.name);
            for(var list of this.#grid){
                for(var point of list){
                    point.floor = this.#area.background;
                }
            }
        }
        if(this.#floor_num === 2){
            // Visit area 1.
            GS.data.visit_area(this.#area.name);
        }
        if(this.#floor_num % area_size === 0 && this.#area.boss_floor_list.length > 0){
            // Reached the boss.
            var boss_floor = random_from(this.#area.boss_floor_list);
            boss_floor_common(this.#floor_num, this.#area, this); 
            var boss_message = boss_floor(this.#floor_num, this.#area, this);
            floor_description += `\n${boss_message}`;
        }
        else{
            // Normal floor.
            var extra_difficulty = 5 * GS.boons.has(boon_names.roar_of_challenge);
            extra_difficulty -= 3 * GS.boons.has(boon_names.empty_rooms);
            this.#area.generate_floor(this.#floor_num + extra_difficulty, this.#area, this);
        }
        if(floor_has_chest(this.#floor_num % area_size)){
            var chest = appropriate_chest_tile();
            var choices = GS.boons.get_choices(BOON_CHOICES + (2 * GS.boons.has(boon_names.larger_chests)));
            if(chance(1, 2) && filter_new_boons(choices).length === 0){
                var replacement_list = filter_new_boons(GS.boons.get_choices());
                if(replacement_list.length > 0){
                    choices[0] = random_from(replacement_list);
                }
            }
            for(var boon of choices){
                add_boon_to_chest(chest, boon);
            }
            this.spawn_safely(chest, SAFE_SPAWN_ATTEMPTS, true);
        }
        say_record(floor_description);
    }
    /**
     * Gets a GridSpace from a location on the grid.
     * Throws an error if the location is out of bounds.
     * @param {Point} location The location of the tile.
     * @returns {Tile} The tile at that location
     */
    get_grid(location){
        this.check_bounds(location);
        return this.#grid[location.y][location.x];
    }
    /**
     * Gets a tile from a location on the grid.
     * Throws an error if the location is out of bounds.
     * @param {Point} location The location of the tile.
     * @returns {Tile} The tile at that location
     */
    get_tile(location){
        var space = this.get_grid(location);
        return space.tile;
    }
    /**
     * Puts a tile at the given location.
     * Throws an error if the location is out of bounds.
     * @param {Point} location Where to put the tile.
     * @param {Tile} value The tile to place.
     */
    #set_tile(location, value){
        this.check_bounds(location);
        this.#grid[location.y][location.x].tile = value;
    }
    /**
     * Marks which positions an entity can attack during it's next turn.
     * @param {Point[]} positions A list of positions to mark.
     * @param {string=} pic If provided, it will telegraph that rather than a hit.
     */
    mark_telegraph(positions, pic = `${IMG_FOLDER.actions}hit_telegraph.png`){
        for(var position of positions){
            if(this.is_in_bounds(position)){
                this.get_grid(position).action = pic;
            }
        }
    }
    /**
     * Clears all hits and other alternate pics from empty tiles in the grid.
     * @returns {void}
     */
    clear_telegraphs(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                this.get_grid(new Point(x, y)).action = `${IMG_FOLDER.tiles}empty.png`;
            }
        }
    }
    /**
     * Function to mark a tile with a specific name, description and background.
     * @param {Point} location The location of the tile to mark.
     * @param {TileGenerator} mark Contains the fields to use.
     * @param {boolean} foreground Controls if the image will be in the foreground or background. Defaults to foregroung.
     */
    mark_event(location, mark, foreground = true){
        var space = this.get_grid(location);
        if(foreground){
            space.foreground.push(mark);
        }
        else{
            space.background.push(mark);
        }
    }
    /**
     * Function to clear all marked empty tiles.
     * @returns {void}
     */
    clear_marked(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                var space = this.get_grid(new Point(x, y));
                space.foreground = [];
                space.background = [];
            }
        }
    }
    /**
     * Function to stun the enemy at a given location.
     * @param {Point} location The location of the tile to stun.
     * @returns {boolean} If something was stunned.
     */
    stun_tile(location){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var space = this.get_grid(location);
        space.action = `${IMG_FOLDER.actions}confuse.png`;
        var tile = space.tile;
        if(tile.type === entity_types.enemy){
            stun(tile);
            return true;
        }
        if(tile.type === entity_types.player){
            confuse_player();
            return true;
        }
        return false;
    }
    /**
     * Function to stun the enemy at a place releative to the player.
     * @param {Point} direction The location of the tile to stun relative to the player.
     * @returns {boolean} If something was stunned.
     */
    player_stun(direction){
        var pos = this.#entity_list.get_player_pos();
        var stunned = this.stun_tile(pos.plus(direction));
        if( // Pressure points boon
            stunned && 
            chance(GS.boons.has(boon_names.pressure_points), 3) && 
            !direction.is_origin()
        ){
            this.player_attack(direction);
        }
        return stunned;
    }
    /**
     * Function to heal the tile at the given location.
     * @param {Point} location The location of the tile to heal.
     * @param {number=} amount Provides the amount to heal for. If not given, instead heals to max.
     * @returns {boolean} if healing was performed.
     */
    heal(location, amount=undefined){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var space = this.get_grid(location);
        space.action = `${IMG_FOLDER.actions}heal.png`;
        var tile = space.tile;
        if(tile.health === undefined){
            // No health to heal.
            return false;
        }
        if(amount === undefined){
            // If no amount is specified, sets health to max.
            if(tile.max_health === undefined){
                throw new Error(ERRORS.value_not_found);
            }
            var healed = tile.health < tile.max_health;
            tile.health = tile.max_health;
            return healed;
        }
        if(tile.max_health === undefined){
            // If no max health is specified, heals by the given amount.
            tile.health += amount;
            return true;
        }
        if(tile.health === tile.max_health){
            // Otherwise, only heals up to the max.
            return false;
        }
        if(amount > 0){
            ++tile.health;
            this.heal(location, amount - 1);
            return true;
        }
        return false;
    }
    /**
     * Function to heal a tile at a location relative to the player.
     * @param {Point} difference The relative location of the tile to heal.
     * @param {number=} amount Provides the amount to heal for. If not given, instead heals to max.
     * @returns {boolean} if healing was performed.
     */
    player_heal(difference, amount=undefined){
        if(amount === undefined && this.get_player().max_health === undefined){
            amount = 1;
        }
        var pos = this.#entity_list.get_player_pos();
        return this.heal(pos.plus(difference), amount);
    }
    /**
     * @returns {number} The number of turns that have elapsed.
     */
    get_turn_count(){
        var stats = this.stats.get_stats();
        return stats.turn_number;
    }
    /**
     * Checks if a location is in bounds and looks empty, or has a on_enter function.
     * @param {Point} location The point to check.
     * @returns {boolean} Returns true if the tile fits the criteria, false otherwise.
     */
    looks_movable(location){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var tile = this.get_tile(location);
        return (
            tile.name === entity_types.empty || 
            tile.type === entity_types.exit ||
            tile.on_enter !== undefined || 
            tile.tags.has(TAGS.hidden)
        );
    }
    get_initiative(){
        return this.#entity_list.get_initiative();
    }
    get_floor_num(){
        return this.#floor_num;
    }
}

function grid_space(area){
    return {
        foreground: [],
        tile: empty_tile(),
        background: [],
        floor: area.background,
        action: `${IMG_FOLDER.tiles}empty.png`
    }
}
// ----------------GameState.js----------------
// File containing a class to control the general flow of the game.
class GameState{
    map;
    deck;
    boons;
    data;
    #player_turn_lock;
    #text_log;
    constructor(){
        // Starts the game on load.
        var init = init_settings();
        this.data = new SaveData(init.load, init.save);
    }
    /** 
     * Function to set up or reset the game.
     * @returns {void} 
     */
    setup(){
        var init = init_settings();
        // Function ran on page load or on restart to set up the game.
        this.#text_log = [];
        this.boons = new BoonTracker(BOON_LIST);
        var start = randomize_arr(init.area)[0]();
        this.map = new GameMap(FLOOR_WIDTH, FLOOR_HEIGHT, start);
        this.deck = init.make_deck();

        var starting_text = `${gameplay_text.new_area}${start.name}.\n${gameplay_text.welcome}`;
        this.data.add_area(start.name);
        say_record(starting_text);
        display.display_message(UIIDS.hand_label, `${gameplay_labels.hand}`);
        display.display_message(UIIDS.move_label, `${gameplay_labels.move}`);
        create_sidebar();
        
        // Starting achievements
        for(var a of init.achievements){
            this.achieve(a);
        }
        // Auto identify these boons
        for(var b of init.identify_boons){
            this.data.boons.add(b().name);
        }
        this.data.save();

        // Prep map
        for(var i = 0; i < init.enemies.length; ++i){
            var enemy = init.enemies[i]();
            if(init.spawnpoints === undefined || init.spawnpoints.length <= i){
                this.map.spawn_safely(enemy, SAFE_SPAWN_ATTEMPTS, true);
            }
            else{
                this.map.add_tile(enemy, init.spawnpoints[i]);
            }
        }
        for(var boon of init.chests){
            var chest = chest_tile();
            add_boon_to_chest(chest, boon());
            this.map.spawn_safely(chest, SAFE_SPAWN_ATTEMPTS, true);
        }
        display_map(this.map);
        this.map.display_stats();

        this.refresh_deck_display();
        display.display_message(UIIDS.shop_instructions, shop_text.header);
        DISPLAY_DIVISIONS.swap(UIIDS.game_screen);
        GAME_SCREEN_DIVISIONS.swap(UIIDS.stage);
        this.#player_turn_lock = true;
    }
    /** 
     * Handles the effects of using a card, then passes to the enemies' turn.
     * Takes the appropriate actions if
     *      -The floor is completed
     *      -The player dies
     *      -The enemies' turn ends early
     * @param {PlayerCommand[]} behavior A set of commands to be executed one by one.
     * @param {number} hand_pos The position of the card that the player used in their hand.
     */
    async player_turn(behavior, hand_pos){
        // Function to execute the outcome of the player's turn.
        if(!this.lock_player_turn()){
            return;
        }
        display.remove_children(UIIDS.move_buttons);
        say(``);
        if(GS.boons.has(boon_names.thick_soles)){
            GS.map.get_player().tags.add(TAGS.invulnerable);
        }
        try{
            // The repetition boon will double movements 1 in every 3 turns.
            var repeat = repeat_amount();
            for(var i = 0; i < repeat; ++i){
                for(var action of behavior){
                    // Does each valid command in the behavior array.
                    this.player_action(action);
                }
            }
            var is_instant = this.deck.is_instant(hand_pos);
            if(this.boons.has(boon_names.spontaneous) > 0 && !is_instant){
                this.deck.discard_all();
            }
            else{
                this.deck.discard(hand_pos);
            }
            if(GS.boons.has(boon_names.thick_soles)){
                GS.map.get_player().tags.remove(TAGS.invulnerable);
            }
            display_map(this.map);
            await delay(ANIMATION_DELAY);
            if(is_instant){
                this.refresh_deck_display();
                this.unlock_player_turn();
                this.map.display_stats();
                display_map(this.map);
                this.unlock_player_turn();
                return;
            }
            await this.map.enemy_turn();
            await this.prep_turn();
        }
        catch (error){
            this.handle_errors(error);
        }
    }
    handle_errors(e){
        var m = e.message
        switch(m){
            case ERRORS.floor_complete:
                this.map.display_stats();
                this.enter_shop();
                break;
            case ERRORS.game_over:
                this.game_over(e.cause.message);
                break;
            case ERRORS.pass_turn:
                try{
                    this.prep_turn();
                }
                catch(error){
                    this.handle_errors(error);
                }
                break;
            case ERRORS.victory:
                this.victory();
                break;
            default:
                throw e;
        }
    }
    /**
     * Handles an individual action of the player.
     * Throws an error if a command of the wrong type is sent in.
     * @param {PlayerCommand} action The command to be followed.
     * @returns {boolean} returns true if the action was instant, false otherwise.
     */
    player_action(action){
        switch(action.type){
            case action_types.attack:
                var attack_count = 1;
                var stun_count = 0;
                var target = this.map.get_player_location().plus(action.change);
                if(this.boons.has(boon_names.sniper)){
                    var distance = Math.max(Math.abs(action.change.x), Math.abs(action.change.y));
                    attack_count += Math.max(0, distance - 1);
                }
                if(this.boons.has(boon_names.frenzy) && this.map.get_player().health === 1){
                    attack_count *= 2;
                }
                if( // Dazing Blows
                    this.boons.has(boon_names.dazing_blows) && 
                    !action.change.is_origin() &&
                    this.map.is_in_bounds(target) &&
                    !this.map.get_tile(target).tags.has(TAGS.boss)
                ){
                    stun_count += 1
                }
                if( // Pacifism
                    this.boons.has(boon_names.pacifism) > 0 && 
                    !action.change.is_origin() &&
                    this.map.is_in_bounds(target) &&
                    !this.map.get_tile(target).tags.has(TAGS.obstruction)
                ){
                    stun_count += 2 * attack_count;
                    attack_count = 0;
                }
                for(var i = 0; i < attack_count; ++i){
                    var target = this.map.get_player_location().plus(action.change);
                    if(
                        i === 0 ||
                        (this.map.is_in_bounds(target) && 
                        this.map.get_tile(target).type !== entity_types.chest)
                    ){
                        this.map.player_attack(action.change);
                    }
                }
                for(var i = 0; i < stun_count; ++i){
                    this.player_action(pstun(action.change.x, action.change.y));
                }
                break;
            case action_types.move:
                var previous_location = this.map.get_player_location();
                var moved = this.map.player_move(action.change);
                if(!moved && GS.boons.has(boon_names.spiked_shoes)){
                    this.player_action(pattack(action.change.x, action.change.y));
                }
                if(moved && chance(GS.boons.has(boon_names.slime_trail), 2)){
                    this.map.add_tile(corrosive_slime_tile(), previous_location);
                }
                break;
            case action_types.teleport:
                try{
                    this.map.player_teleport(action.change);
                }
                catch(error){
                    if(error.message !== ERRORS.map_full){
                        throw error;
                    }
                }
                break;
            case action_types.stun:
                this.map.player_stun(action.change);
                break;
            case action_types.move_until:
                var spiked_shoes = GS.boons.has(boon_names.spiked_shoes);
                var previous_location = this.map.get_player_location();
                while(this.map.player_move(action.change)){
                    if(chance(GS.boons.has(boon_names.slime_trail), 2)){
                        this.map.add_tile(corrosive_slime_tile(), previous_location);
                    }
                    previous_location = this.map.get_player_location();
                };
                if(spiked_shoes){
                    this.player_action(pattack(action.change.x, action.change.y));
                }
                break;
            case action_types.attack_until:
                var i = 0;
                do{
                    i += 1;
                    var p_location = this.map.get_player_location();
                    var target = action.change.times(i);
                    this.player_action(pattack(target.x, target.y));
                }while(this.map.is_in_bounds(p_location.plus(target)));
                break;
            case action_types.heal:
                this.map.player_heal(action.change, 1);
                break;
            default:
                throw new Error(ERRORS.invalid_value);
        }
        return false;
    }
    /** 
     * Sets up the next floor then leaves the shop.
     */
    async new_floor(){
        // Creates the next floor.
        this.map.next_floor();
        this.map.display_stats();
        display_map(this.map);
        this.deck.deal();
            if(GS.boons.has(boon_names.vicious_cycle) > 0){
            apply_vicious_cycle(this.deck);
        }
        this.refresh_deck_display();
        GAME_SCREEN_DIVISIONS.swap(UIIDS.stage);
        await delay(ANIMATION_DELAY);
        display_map(this.map);
        this.unlock_player_turn();
    }
    /** 
     * Preps and swaps to the shop screen.
     * @returns {void} 
     */
    enter_shop(){
        // Gives the player the option to add or remove a card from their deck.
        // Their deck contents are also displayed.
        // Options to remove cards will not be displayed if the deck is at the minimum size already.
        display.remove_children(UIIDS.move_buttons);
        display.remove_children(UIIDS.display_deck);
        display.display_message(UIIDS.shop_message, ``);
        var shop = new Shop(this.deck);
        display_entire_deck(this.deck);
        refresh_shop_display(shop);
        GAME_SCREEN_DIVISIONS.swap(UIIDS.shop);
    }
    /**
     * Called when the player dies. Gives the option to restart.
     * @param {string} cause Cause of death.
     */
    game_over(cause){
        // Tells the user the game is over, prevents them from continuing, tells them the cause
        // and gives them the chance to retry.
        display_map(this.map);
        display.remove_children(UIIDS.hand_display);
        display.remove_children(UIIDS.move_buttons);
        say_record(`${gameplay_text.game_over}${cause.toLowerCase()}.`);
        var restart = function(game){
            return function(message, position){
                display.remove_children(UIIDS.retry_button);
                player_hand_greyed(false);
                display.remove_class(UIIDS.chest,`large-chest`);
                game.setup();
            };
        }
        var restart_message = [{
            description: gameplay_labels.retry,
            on_click: restart(this),
        }];
        display.add_button_row(UIIDS.retry_button, restart_message);
        refresh_full_deck_display(this.deck);
        var swap_visibility = function(id_list, id){
            return function(){
                id_list.swap(id);
            }
        }
        display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.full_deck, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.full_deck));
    }
    victory(){
        display_map(this.map);
        display_victory();
        this.achieve(achievement_names.victory);
        say_record(gameplay_text.victory);
        refresh_full_deck_display(this.deck);
        var swap_visibility = function(id_list, id){
            return function(){
                id_list.swap(id);
            }
        }
        display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.full_deck, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.full_deck));
    }
    /**
     * Adds a temporary card to the player's deck.
     * @param {Card} card The card to be added.
     */
    give_temp_card(card){
        if(GS.boons.has(boon_names.fleeting_thoughts)){
            card.options.make_instant();
        }
        this.deck.add_temp(card);
    }
    /** 
     * Sets up the player's turn.
     * @returns {Promise<void>}
     */
    async prep_turn(){
        this.map.resolve_events();
        display_map(this.map);
        await delay(ANIMATION_DELAY);
        display_map(this.map);
        this.refresh_deck_display();
        this.map.display_stats();
        this.unlock_player_turn();
    }
    /** 
     * Ensures the player can't make moves during the enemies' turn using a lock.
     * @returns {Boolean} True if the lock hasn't been used yet, false otherwise.
     */
    lock_player_turn(){
        if(this.#player_turn_lock){
            this.#player_turn_lock = false;
            player_hand_greyed(true);
            return true;
        }
        return false;
    }
    /** 
     * Returns the lock so the player can take their turn.
     */
    unlock_player_turn(){
        this.#player_turn_lock = true;
        player_hand_greyed(false);
    }
    /** 
     * Ensures the player can't make moves during the enemies' turn.
     * @returns {Boolean} True if the lock hasn't been used yet, false otherwise.
     */
    check_lock_player_turn(){
        return this.#player_turn_lock;
    }
    /**
     * Records a message in the text log, then displays the text log.
     */
    record_message(str, type){
        this.#text_log.push({
            str, 
            type
        });
        this.display_messages(UIIDS.text_scroll);
    }
    /**
     * Displays all messages in the text log.
     * @param {string} location Where to display to.
     */
    display_messages(location){
        display.remove_children(location);
        display.create_stacked_p(location, reverse_arr(this.#text_log));
    }
    /**
     * Displays the hand, discard pile, and deck to their proper locations.
     */
    refresh_deck_display(){
        refresh_hand_display(this.deck);
        refresh_discard_display(this.deck);
        refresh_deck_order_display(this.deck);
        if(this.boons !== undefined){
            telegraph_repetition_boon(repeat_amount());
        }
    }
    /**
     * Displays the boons to their proper location.
     */
    refresh_boon_display(){
        display_boons(this.boons);
    }
    achieve(name){
        var gained = this.data.achieve(name);
        if(gained){
            say_record(`${achievement_text.unlocked} ${name}`, record_types.achievement);
            SIDEBAR_DIVISIONS.swap(UIIDS.text_log);
            return true;
        }
        say_record(`${achievement_text.repeated} ${name}`, record_types.repeated_achievement);
        return false;
    }
}
class KeyBind{
    #controls
    alternate_is_pressed
    constructor(){
        if(!KeyBind.is_valid(DEFAULT_CONTROLS)){
            throw new Error(ERRORS.invalid_value);
        }
        this.#controls = DEFAULT_CONTROLS;
        this.alternate_is_pressed = false;
    }
    stage(key){
        var stage = this.#controls.stage;
        var key_num = stage.direction.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.move_buttons} ${Math.floor(key_num / 3)} ${key_num % 3}`);
            return true;
        }
        key_num = stage.card.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.hand_display} 0 ${key_num}`);
            return true;
        }
        key_num = stage.info.indexOf(key);
        if(key_num >= 0){
            display.click(UIIDS.move_info);
            return true;
        }
        key_num = stage.retry.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.retry_button} 0 0`);
            return true;
        }
        return false;
    }
    shop(key){
        var shop = this.#controls.shop;
        var key_num = shop.add.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.add_card} 0 ${key_num + 1}`);
            return true;
        }
        var key_num = shop.remove.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.remove_card} 0 ${key_num + 1}`);
            return true;
        }
        var key_num = shop.confirm.indexOf(key);
        if(key_num >= 0){
            display.click(UIIDS.shop_confirm);
            return true;
        }
        return false;
    }
    chest(key){
        var chest = this.#controls.chest;
        var key_num = chest.choose.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.contents} 0 ${key_num}`);
            return true;
        }
        var key_num = chest.confirm.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.chest_confirm_row} 0 ${1}`);
            return true;
        }
        var key_num = chest.reject.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.chest_confirm_row} 0 ${0}`);
            return true;
        }
        return false;
    }
    toggle_press(key){
        if(this.#controls.toggle.alt.indexOf(key) >= 0){
            this.alternate_is_pressed = true;
            return true;
        }
        return false;
    }
    toggle_unpress(key){
        if(this.#controls.toggle.alt.indexOf(key) >= 0){
            this.alternate_is_pressed = false;
            return true;
        }
        return false;
    }
    static is_valid(controls){
        if(!same_structure(DEFAULT_CONTROLS, controls)){
            throw new Error(ERRORS.missing_property);
        }
        var toggle = KeyBind.#join_all(controls.toggle);
        var stage = [
            ...toggle,
            this.#join_all(controls.stage),
        ];
        var shop = [
            ...toggle,
            this.#join_all(controls.shop),
        ];
        var chest = [
            ...toggle,
            this.#join_all(controls.chest),
        ];
        for(var list of [toggle, stage, shop, chest]){
            var unique = new Set(list);
            if(unique.size !== list.length){
                return false;
            }
        }
        return true;
    }
    set(controls){
        this.#controls = controls;
        this.alternate_is_pressed = false;
    }
    get(){
        return {
            stage: {
                direction: [...this.#controls.stage.direction],
                card: [...this.#controls.stage.card],
                info: [...this.#controls.stage.info],
                retry: [...this.#controls.stage.retry],
            },
            shop: {
                add: [...this.#controls.shop.add],
                remove: [...this.#controls.shop.remove],
                confirm: [...this.#controls.shop.confirm],
            },
            chest: {
                choose: [...this.#controls.chest.choose],
                confirm: [...this.#controls.chest.confirm],
                reject: [...this.#controls.chest.reject],
            },
            toggle: {
                alt: [...this.#controls.toggle.alt],
            }
        }
    }
    static #join_all(obj){
        var list = [];
        for(var prop in obj){
            if(Array.isArray(prop)){
                list.concat(prop);
            }
        }
        return list;
    }
}
// ----------------MoveDeck.js----------------
// The MoveDeck class contains the player's current deck of move cards.

class MoveDeck{
    /** @type {Card[]} The array of all cards they have.*/
    #decklist; // .
    /** @type {Card[]} The array of cards in their draw pile.*/
    #library; // 
    /** @type {Card[]} The array of cards curently usable.*/
    #hand; // 
    /** @type {Card[]} The array of cards they have used since they reshuffled.*/
    #discard_pile;
    /** @type {number} Used to give each card a unique id.*/
    #id_count;
    #hand_size;
    #min_deck_size;
    total_added;
    total_removed;
    constructor(hand_size, minimum, cards = []){
        this.#decklist = [];
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        this.#id_count = 0;
        this.#hand_size = hand_size;
        this.#min_deck_size = minimum;
        this.total_added = 0;
        this.total_removed = 0;
        for(var card of cards){
            this.#add_card(card());
        }
    }
    /**
     * Resets the deck to the decklist then deals a new hand.
     * @returns {void}
     */
    deal(){
        // Shuffles all cards together then deals a new hand.
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        for(var card of this.#decklist){
            if(card.per_floor !== undefined){
                card = card.per_floor();
                this.add_temp(card);
            }
            else{
                this.#library.push(card);
            }
        }
        this.#library = randomize_arr(this.#library);
        for(var i = 0; i < this.#hand_size; ++i){
            var top_card = this.#library.pop();
            if(top_card !== undefined){
                this.#hand.push(top_card);
            }
        }
    }
    /**
     * Discards the card at the given position in the hand, then draws a new one.
     * @param {number} hand_pos The position of the card which should be discarded.
     */
    discard(hand_pos){
        // Makes player discard the card at position x from their hand and draw a new one. 
        // If the library is empty, it will first shuffle in the discard. 
        // Throws an error if x doens't correspond to a card in hand.
        if(hand_pos >= this.#hand.length || hand_pos < 0){
            throw new Error(ERRORS.invalid_value);
        }
        if(this.#hand[hand_pos].temp === undefined || this.#hand[hand_pos].temp === false){
            this.#discard_pile.push(this.#hand[hand_pos]);
        }
        if(this.#library.length === 0){
            var top_discard = this.#discard_pile.pop();
            while(top_discard !== undefined){
                this.#library.push(top_discard);
                top_discard = this.#discard_pile.pop();
            }
            this.#library = randomize_arr(this.#library);
        }
        var top_card = this.#library.pop();
        if(top_card !== undefined){
            this.#hand[hand_pos] = top_card;
        }
    }
    /**
     * Discards all cards then draws up to max hand size.
     */
    discard_all(){
        for(var card of this.#hand){
            if(card.temp === undefined || card.temp === false){
                this.#discard_pile.push(card);
            }
        }
        this.#hand = [];
        while(this.#hand.length < this.#hand_size){
            if(this.#library.length === 0){
                var top_discard = this.#discard_pile.pop();
                while(top_discard !== undefined){
                    this.#library.push(top_discard);
                    top_discard = this.#discard_pile.pop();
                }
                this.#library = randomize_arr(this.#library);
            }
            var top_card = this.#library.pop();
            if(top_card !== undefined){
                this.#hand.push(top_card);
            }
        }
    }
    /**
     * Adds a new card to the decklist.
     * @param {Card} new_card Card to add.
     */
    add(new_card){
        this.#add_card(new_card);
        this.#check_three_kind_achievement(new_card.name);
        this.#check_jack_of_all_trades_achievement();
        GS.data.pick_card(new_card.name);
        ++this.total_added;
    }
    #add_card(new_card){
        new_card.id = this.#id_count;
        this.#id_count++;
        this.#decklist.push(new_card);
        if(new_card.per_floor !== undefined){
            // If the card can only be used once per floor, add a temp copy instead.
            var temp_card = new_card.per_floor();
            this.add_temp(temp_card);
        }
        else{
            this.#library.push(new_card);
        }
        this.#library = randomize_arr(this.#library);
        this.#check_three_kind_achievement(new_card.name);
        this.#check_jack_of_all_trades_achievement();
        GS.data.add_card(new_card.name);
    }
    /**
     * Adds a new card to the library after giving it a temp tag.
     * Temp cards are removed when deal is called (at the end of the floor) or when used.
     * @param {Card} new_card Card to add.
     */
    add_temp(new_card){
        new_card.id = this.#id_count++;
        new_card.temp = true;
        this.#library.push(new_card);
        this.#library = randomize_arr(this.#library);
        GS.data.add_card(new_card.name);
    }
    get_hand_info(){
        var make_prep_move = function(card, hand_pos){
            return function(){
                if(!GS.check_lock_player_turn()){
                    return;
                }
                say(``);
                display_move_buttons(card, hand_pos);
            }
        }
        var card_row = [];
        for(var i = 0; i < this.#hand.length; ++i){
            let card = this.#hand[i];
            let background = [];
            if(card.temp){
                background.push(`${IMG_FOLDER.other}temporary_background.png`);
            }
            else{
                background.push(`${IMG_FOLDER.other}default_card_background.png`);
            }
            card_row.push({
                pic: card.pic,
                name: card.name,
                background,
                card: card,
                on_click: make_prep_move(card, i),
            });
        }
        return card_row;
    }
    /**
     * Function to count the number of cards remaining in your library.
     * @returns {number} cards remaining.
     */
    get_deck_count(){
        return this.#library.length;
    }
    /**
     * Returns the whole decklist.
     */
    get_deck_info(){
        return this.#decklist.map((card) => {
            return Object.assign({}, card);
        });
    }
    /**
     * Displays the whole discard pile.
     */
    get_discard_info(table){
        return [...this.#discard_pile];
    }
    /**
     * Displays the cards in your draw pile in order.
     */
    get_library_info(table){
        return reverse_arr(this.#library);
    }
    /**
     * Gets a random array of cards from the decklist with no repeats.
     * If the decklist is at minimum size, returns an empty array instead.
     * @param {number} size number of cards to get.
     * @returns {Card[]} The array of random cards.
     */
    get_rand_cards(size){
        if(this.#decklist.length <= this.#min_deck_size){
            return [];
        }
        return rand_no_repeats(this.#decklist, size);
    }
    /**
     * Removes a card from the decklist.
     * @param {number} id The ID of the card to remove.
     * @returns {boolean} Returns true if the card was removed and false otherwise.
     */
    remove(id){
        // Removes the card with the given id from the deck.
        // Returns false if it could not be found.
        for(var i = 0; i < this.#decklist.length; ++i){
            if(this.#decklist[i].id === id){
                var card = this.#decklist[i];
                this.#decklist.splice(i, 1);
                if(card.evolutions !== undefined){
                    var next = randomize_arr(card.evolutions)[0]() ;
                    if(chance(1, 2) && filter_new_cards([next]).length === 0){
                        var replace_list = filter_new_cards(card.evolutions.map((c) => {return c()}));
                        if(replace_list.length > 0){
                            next = random_from(replace_list);
                        }
                    }
                    this.add(next);
                    if(next.evolutions === undefined){
                        GS.achieve(achievement_names.ancient_knowledge);
                    }
                }
                if(card.basic === true){
                    this.#check_remaining_basics_achievement();
                }
                GS.data.remove_card(card.name);
                ++this.total_removed
                return true;
            }
        }
        return false;
    }
    /**
     * @returns {number} The number of cards in the deck.
     */
    deck_size(){
        return this.#decklist.length;
    }
    /**
     * @returns {number} The minimum number of cards allowed in your deck.
     */
    deck_min(){
        return this.#min_deck_size;
    }
    /**
     * @param {number} change How much to add or remove from the minimum deck size.
     */
    alter_min(change){
        this.#min_deck_size += change;
    }
    /**
     *  @param {number} change How much to add or remove from the hand size.
     */
    alter_hand_size(change){
        this.#hand_size += change;
    }
    /**
     * Function to check if a card in the hand is an instant.
     * @param {number} hand_position The position of the card to check.
     * @returns {boolean} If it is an instant. 
     */
    is_instant(hand_position){
        if(this.#hand.length <= hand_position || hand_position < 0){
            throw new Error(ERRORS.invalid_value);
        }
        return this.#hand[hand_position].options.is_instant();
    }
    copy(){
        var new_deck = this.constructor(this.#hand_size, this.#min_deck_size);
        new_deck.#id_count = this.#id_count;
        new_deck.#decklist = this.#decklist;
        return new_deck;
    }
    #check_three_kind_achievement(name){
        var repeats = this.#decklist.filter((e) => {return e.name === name});
        if(GS !== undefined && repeats.length === 3){
            GS.achieve(achievement_names.triple);
        }
    }
    #check_remaining_basics_achievement(){
        var remaining = this.#decklist.filter((card) => {
            return card.basic === true;
        });
        if(remaining.length === 0){
            GS.achieve(achievement_names.beyond_the_basics);
        }
    }
    #check_jack_of_all_trades_achievement(){
        if(this.#decklist.length === 25){
            GS.achieve(achievement_names.jack_of_all_trades);
        }
    }
}
/*
 * Class to save and load data to and from files and localstorage.
 * If you want to add new fields:
 *      - Add new default JSON fields in the default_data.
 *      - Change the load function to move the data from a JSON to a Class object.
 *      - Change the save function to move the data to JSON format.
*/

class SaveData{
    controls;
    achievements;
    cards;
    boons;
    tiles;
    areas;
    
    #load_function;
    #save_function;
    constructor(load, save){
        this.#load_function = load;
        this.#save_function = save;
        this.load();
    }
    load(){
        var data = this.#load_function();
        data = SaveData.#load_missing(data);
        this.controls = new KeyBind();
        this.controls.set(data.controls);
        this.achievements = new AchievementList();
        this.achievements.set(data.achievements);
        this.cards = new SearchTree(data.cards, CardTreeNode);
        this.boons = new SearchTree(data.boons, BoonTreeNode);
        this.tiles = new SearchTree(data.tiles, TileTreeNode);
        this.areas = new SearchTree(data.areas, AreaTreeNode);
    }
    save(){
        var data = {
            controls: this.controls.get(),
            achievements: this.achievements.get(),
            cards: this.cards.to_list(),
            boons: this.boons.to_list(),
            tiles: this.tiles.to_list(),
            areas: this.areas.to_list(),
        }
        this.#save_function(data);
    }
    set_controls(new_controls){
        this.controls.set(new_controls);
        this.save();
    }
    achieve(name){
        var gained = this.achievements.achieve(name);
        if(gained){
            this.save();
        }
        return gained;
    }
    reset_achievements(){
        this.achievements = new AchievementList();
        this.save();
    }
    add_card(name){
        var added = this.cards.add(name);
        if(added){
            this.save();
        }
    }
    pick_card(name){
        this.cards.get_node(name).pick();
        this.save();
        if(!GS.data.achievements.has(achievement_names.common_sense)){
            var has_all = true;
            for(var i = 0; i < COMMON_CARDS.length && has_all; ++i){
                has_all = this.cards.has(COMMON_CARDS[i]().name);
            }
            if(has_all){
                GS.achieve(achievement_names.common_sense);
            }
        }
    }
    remove_card(name){
        this.cards.get_node(name).remove();
        this.save();
    }
    add_boon(name){
        this.boons.add(name);
        this.boons.get_node(name).pick();
        this.save();
        if(!GS.data.achievements.has(achievement_names.blessed)){
            var has = BOON_LIST.filter((b) => {
                return this.boons.has(b().name);
            });
            if(has.length >= 35){
                GS.achieve(achievement_names.blessed);
            }
        }
    }
    add_tile(name){
        var added = this.tiles.add(name);
        if(added){
            this.save();
        }
    }
    add_area(name){
        var added = this.areas.add(name);
        if(added){
            this.save();
        }
    }
    visit_area(name){
        var area = this.areas.get_node(name);
        if(area !== undefined){
            area.visit();
            this.save();
        }
    }
    clear_area(name){
        var area = this.areas.get_node(name);
        area.clear();
        this.save();
    }

    // Static functions
    static load_file_function(save_name){
        return () => {
            const fs = require(`fs`);
            try{
                var data = fs.readFileSync(`./saves/${save_name}.txt`, `utf8`);
                data = JSON.parse(data);
            }
            catch(err){
                var data = undefined;
            }
            return data;
        }
    }
    static load_local_function(save_name){
        return () => {
            const data = display.get_local_storage(`Maneuver.saves.${save_name}`);
            return data ? JSON.parse(data) : undefined;
        }
    }
    static load_blank(){
        return () => {
            return undefined;
        }
    }
    static save_file_function(save_name){
        return (data) => {
            const fs = require(`fs`);
            fs.writeFile(`./saves/${save_name}.txt`, JSON.stringify(data), (err) => {
                if(err){
                    throw err;
                }
            });
        }
    }
    static save_local_function(save_name){
        return (data) => {
            display.set_local_storage(`Maneuver.saves.${save_name}`, JSON.stringify(data));
        }
    }
    static save_blank(){
        return (data) => {}
    }
    static #load_missing(data){
        var blank = SaveData.default_data();
        if(data === undefined){
            return blank;
        }
        SaveData.#load_missing_recursive(data, blank);
        return data;
    }
    static #load_missing_recursive(data, default_data){
        if( // Base case: current field is not an object.
            typeof default_data !== `object` || 
            Array.isArray(default_data) || 
            default_data === null
        ){
            return;
        }
        for(var prop in default_data){
            if(data[prop] === undefined){
                data[prop] = default_data[prop];
            }
            else{
                this.#load_missing_recursive(data[prop], default_data[prop]);
            }
        }
    }
    static default_data(){
        return {
            controls: new KeyBind().get()
        }
    }
}
class ScreenTracker{
    div;
    current;
    constructor(divisions){
        this.div = divisions;
    }
    swap(division){
        if(division !== undefined && this.div.find((d) => {d === division}) === -1){
            throw new Error(ERRORS.value_not_found);
        }
        display.swap_screen(this.div, division);
        this.current = division;
    }
    is(division){
        return division === this.current;
    }
}

const DISPLAY_DIVISIONS = new ScreenTracker([UIIDS.game_screen, UIIDS.guide, UIIDS.achievements, UIIDS.journal, UIIDS.controls, ]);
const GAME_SCREEN_DIVISIONS = new ScreenTracker([UIIDS.stage, UIIDS.shop, UIIDS.chest, UIIDS.deck_select]);
const SIDEBAR_DIVISIONS = new ScreenTracker([UIIDS.text_log, UIIDS.boon_list, UIIDS.discard_pile, UIIDS.full_deck, UIIDS.initiative, UIIDS.deck_order]);
class AreaTreeNode{
    data;
    left;
    right;
    constructor(data){
        switch(typeof data){
            case `string`:
                this.data = {
                    name: data,
                    visited: 0,
                    cleared: 0,
                }
                break;
            case `object`:
                if(data.name === undefined){
                    throw Error(ERRORS.missing_property);
                }
                data.visited = data.visited ? data.visited : 0;
                data.cleared = data.cleared ? data.cleared : 0;
                this.data = data;
                break;
            default:
                throw Error(ERRORS.invalid_type);
        }
    }
    compare(node){
        var other = node instanceof AreaTreeNode ? node.data : node;
        other = typeof other === `object` ? other.name : other;
        if(this.data.name < other){
            return -1;
        }
        if(this.data.name > other){
            return 1;
        }
        return 0;
    }
    visit(){
        ++this.data.visited;
    }
    clear(){
        ++this.data.cleared;
    }
}
class BoonTreeNode{
    data;
    left;
    right;
    constructor(data){
        switch(typeof data){
            case `string`:
                this.data = {
                    name: data,
                    picked: 0
                }
                break;
            case `object`:
                if(data.name === undefined){
                    throw Error(ERRORS.missing_property);
                }
                data.picked = data.picked ? data.picked : 0;
                this.data = data;
                break;
            default:
                throw Error(ERRORS.invalid_type);
        }
    }
    compare(node){
        var other = node instanceof BoonTreeNode ? node.data : node;
        other = typeof other === `object` ? other.name : other;
        if(this.data.name < other){
            return -1;
        }
        if(this.data.name > other){
            return 1;
        }
        return 0;
    }
    pick(){
        ++this.data.picked;
    }
}
class CardTreeNode{
    data;
    left;
    right;
    constructor(data){
        switch(typeof data){
            case `string`:
                this.data = {
                    name: data,
                    picked: 0,
                    removed: 0,
                }
                break;
            case `object`:
                if(data.name === undefined){
                    throw Error(ERRORS.missing_property);
                }
                data.picked = data.picked ? data.picked : 0;
                data.removed = data.removed ? data.removed : 0;
                this.data = data;
                break;
            default:
                throw Error(ERRORS.invalid_type);
        }
    }
    compare(node){
        var other = node instanceof CardTreeNode ? node.data : node;
        other = typeof other === `object` ? other.name : other;
        if(this.data.name < other){
            return -1;
        }
        if(this.data.name > other){
            return 1;
        }
        return 0;
    }
    pick(){
        ++this.data.picked;
    }
    remove(){
        ++this.data.removed;
    }
}
class SearchTree{
    // Singleton BST that can convert to and from a sorted list.
    #root
    #node
    constructor(list = [], node = SearchTreeNode){
        this.#root = undefined;
        this.#node = node;
        this.add_all(list);
    }
    add(str){
        var to_add = new this.#node(str);
        if(this.#root === undefined){
            this.#root = to_add;
            return true;
        }
        var current = this.#root;
        while(current !== undefined){
            switch(current.compare(to_add)){
                case -1:
                    if(current.left === undefined){
                        current.left = to_add;
                        current = undefined;
                    }
                    else{
                        current = current.left;
                    }
                    break;
                case 0:
                    return false;
                case 1:
                    if(current.right === undefined){
                        current.right = to_add;
                        current = undefined;
                    }
                    else{
                        current = current.right;
                    }
                    break;
            }
        }
        return true;
    }
    has(str){
        var current = this.#root;
        while(current !== undefined){
            switch(current.compare(str)){
                case -1:
                    current = current.left;
                    break;
                case 0:
                    return true;
                case 1:
                    current = current.right;
                    break;
            }
        }
        return false;
    }
    to_list(){
        return this.#recursive_to_list(this.#root);
    }
    #recursive_to_list(current){
        if(current === undefined){
            return [];
        }
        return [
            ...this.#recursive_to_list(current.left), 
            current.data, 
            ...this.#recursive_to_list(current.right),
        ];
    }
    remove_all(){
        this.#root = undefined;
    }
    add_all(list){
        if(list.length > 0){
            var half = Math.floor(list.length / 2);
            this.add(list[half]);
            this.add_all(list.slice(0, half));
            this.add_all(list.slice(half + 1, list.length));
        }
    }
    get_node(str){
        var current = this.#root;
        while(current !== undefined){
            switch(current.compare(str)){
                case -1:
                    current = current.left;
                    break;
                case 0:
                    return current;
                case 1:
                    current = current.right;
                    break;
            }
        }
        return undefined;
    }
}
class SearchTreeNode{
    data;
    left;
    right;
    constructor(data){
        this.data = data;
    }
    compare(node){
        var other = node instanceof SearchTreeNode ? node.data : node;
        if(this.data < other){
            return -1;
        }
        if(this.data > other){
            return 1;
        }
        return 0;
    }
}
class TileTreeNode{
    data;
    left;
    right;
    constructor(data){
        switch(typeof data){
            case `string`:
                this.data = {
                    name: data,
                    killed: 0,
                    killed_by: 0,
                }
                break;
            case `object`:
                if(data.name === undefined){
                    throw Error(ERRORS.missing_property);
                }
                data.killed = data.killed ? data.killed : 0;
                data.killed_by = data.killed_by ? data.killed_by : 0;
                this.data = data;
                break;
            default:
                throw Error(ERRORS.invalid_type);
        }
    }
    compare(node){
        var other = node instanceof TileTreeNode ? node.data : node;
        other = typeof other === `object` ? other.name : other;
        if(this.data.name < other){
            return -1;
        }
        if(this.data.name > other){
            return 1;
        }
        return 0;
    }
    kill(){
        ++this.data.killed;
    }
    die_to(){
        ++this.data.killed_by;
    }
}
class Shop{
    #deck;
    #has_skill_trading;
    #has_stubborn;
    #add_row;
    #add_index;
    #remove_row;
    #remove_index;

    constructor(deck){
        this.#deck = deck;
        this.#has_skill_trading = GS.boons.has(boon_names.skill_trading) > 0;
        this.#has_stubborn = GS.boons.has(boon_names.stubborn) > 0;
        this.#generate_add_row();
        this.#generate_remove_row();
    }
    #generate_add_row(){
        var amount = ADD_CHOICE_COUNT + GS.boons.has(boon_names.picky_shopper);
        var add_list_generators = rand_no_repeats(COMMON_CARDS, amount);
        var index_of_rare = random_num(4);
        var rares = get_achievement_cards();
        if(index_of_rare < add_list_generators.length && rares.length > 0){
            var rare = rand_no_repeats(rares, 1);
            add_list_generators[index_of_rare] = rare[0];
        }
        this.#add_row = add_list_generators.map((g) => {return g()});
        if(chance(1, 2) && filter_new_cards(this.#add_row).length === 0){
            // Chance to force the appearance of a card in the shop that has never been picked.
            var to_replace = 0;
            var replace_list = filter_new_cards(COMMON_CARDS.map((c) => {return c()}));
            if(chance(1, 2) && index_of_rare < this.#add_row.length && rares.length > 0){
                to_replace = index_of_rare;
                replace_list = filter_new_cards(rares.map((c) => {return c()}));
            }
            if(replace_list.length > 0){
                this.#add_row[to_replace] = random_from(replace_list);
            }
        }
    }
    #generate_remove_row(){
        var amount = ADD_CHOICE_COUNT + GS.boons.has(boon_names.picky_shopper);
        this.#remove_row = this.#deck.get_rand_cards(amount);
    }
    select_add_row(index){
        if(!this.#has_skill_trading){
            this.#remove_index = undefined;
        }
        if(this.#add_index === index){
            this.#add_index = undefined;
        }
        else{
            this.#add_index = index;
        }
    }
    select_remove_row(index){
        if(!this.#has_skill_trading){
            this.#add_index = undefined;
        }
        if(this.#remove_index === index){
            this.#remove_index = undefined;
        }
        else{
            this.#remove_index = index;
        }
    }
    get_add_row(){
        var s = this;
        var make_add_card = function(position){
            return function(){
                s.select_add_row(position);
            }
        }
        var row = this.#add_row.map((card, i) => {
            return {
                name: card.name,
                pic: card.pic,
                card,
                on_click: make_add_card(i),
                selected: s.#add_index === i,
            }
        });
        row.unshift(symbol_add_card());
        return row;
    }
    get_remove_row(){
        var s = this;
        var make_remove_card = function(position){
            return function(){
                s.select_remove_row(position);
            }
        }
        var row = this.#remove_row.map((card, i) => {
            return {
                name: card.name,
                pic: card.pic,
                card,
                on_click: make_remove_card(i),
                selected: s.#remove_index === i
            }
        });
        var symbol = this.#remove_row.length > 0 ? symbol_remove_card() : symbol_deck_at_minimum();
        row.unshift(symbol);
        return row;
    }
    confirm(){
        if(this.#add_index !== undefined){
            this.#deck.add(this.#add_row[this.#add_index]);
        }
        if(this.#remove_index !== undefined){
            this.#deck.remove(this.#remove_row[this.#remove_index].id);
        }
    }
    is_valid_selection(){
        var adding = this.#add_index !== undefined;
        var removing = this.#remove_index !== undefined;
        var valid =
            (adding || removing && !(adding && removing)) ||            // Normal
            (this.#has_skill_trading ? adding || removing : false) ||   // Skill Trading
            (this.#has_stubborn ? !adding && !removing : false)         // Stubborn
        return valid;
    }
}
class StatTracker{
    #turn_number;
    #turns_per_floor;
    #damage;
    #turn_damage;
    #chests;
    #damage_dealt;
    #boss_kill_start;
    #total_damage_per_floor;
    #player_boss_damage;
    #kills;
    #destroyed;
    #chest_kills;
    #total_kills_per_floor;

    constructor(){
        this.#turn_number = 0;
        this.#turns_per_floor = [0];
        this.#damage = 0;
        this.#turn_damage = 0;
        this.#chests = 0;
        this.#damage_dealt = 0;
        this.#boss_kill_start = 0;
        this.#total_damage_per_floor = [0];
        this.#player_boss_damage = 0;
        this.#kills = 0;
        this.#destroyed = 0;
        this.#chest_kills = 0;
        this.#total_kills_per_floor = [0];
    }
    increment_turn(){
        ++this.#turn_number;
    }
    finish_floor(){
        this.#turns_per_floor.push(this.#turn_number);
        this.#total_damage_per_floor.push(this.#damage_dealt);
        this.#total_kills_per_floor.push(this.#kills);
        var floor_count = this.#turns_per_floor.length;
        if(floor_count === 11){
            if(this.#turn_number <= 100){
                GS.achieve(achievement_names.speed_runner);
            }
            if(this.#damage === 0){
                GS.achieve(achievement_names.without_a_scratch);
            }
        }
        var last_two = this.#turns_per_floor.slice(-2);
        return last_two[1] - last_two[0];
    }
    increment_damage(){
        ++this.#damage;
        if(this.#damage === 10){
            GS.achieve(achievement_names.shrug_it_off);
        }
    }
    increment_turn_damage(){
        this.increment_damage();
        ++this.#turn_damage;
        if(this.#turn_damage === 5){
            GS.achieve(achievement_names.clumsy);
        }
    }
    increment_chests(){
        ++this.#chests
        if(this.#chests === 6){
            GS.achieve(achievement_names.collector);
        }
    }
    increment_damage_dealt(){
        ++this.#damage_dealt;
    }
    damage_boss(){
        if(this.#boss_kill_start === undefined){
            this.#boss_kill_start = this.#turn_number;
            return;
        }
        this.#boss_kill_start = Math.min(this.#boss_kill_start, this.#turn_number);
    }
    player_damage_boss(){
        ++this.#player_boss_damage;
    }
    reset_boss_damage(){
        this.#boss_kill_start = undefined;
        this.#player_boss_damage = 0;
    }
    increment_kills(){
        ++this.#kills;
    }
    increment_destroyed(){
        ++this.#destroyed;
    }
    increment_chest_kills(){
        ++this.#chest_kills;
        if(this.#chest_kills === 7){
            GS.achieve(achievement_names.manic_vandal);
        }
    }
    get_stats(){
        return {
            turn_number: this.#turn_number,
            turns_per_floor: this.#turns_per_floor,
            damage: this.#damage,
            turn_damage: this.#turn_damage,
            chests: this.#chests,
            damage_dealt: this.#damage_dealt,
            boss_kill_start: this.#boss_kill_start,
            total_damage_per_floor: this.#total_damage_per_floor,
            player_boss_damage: this.#player_boss_damage,
            kills: this.#kills,
            destroyed: this.#destroyed,
            chest_kills: this.#chest_kills,
            total_kills_per_floor: this.#total_kills_per_floor
        }
    }
}
// ----------------TagList.js----------------
// Class to contain a list of tags for true or false questions about a tile.
class TagList{
    #tags;
    constructor(list=[]){
        for(var element of list){
            if(typeof element !== `string`){
                throw new Error(ERRORS.invalid_type);
            }
        }
        this.#tags = [...list];
    }
    add(tag){
        if(!this.has(tag)){
            this.#tags.push(tag);
        }
    }
    remove(tag){
        if(typeof tag !== `string`){
            throw new Error(ERRORS.invalid_type);
        }
        var start_len = this.#tags.length;
        this.#tags = this.#tags.filter(t => t !== tag);
        return start_len > this.#tags.length;
    }
    has(tag){
        if(typeof tag !== `string`){
            throw new Error(ERRORS.invalid_type);
        }
        return this.#tags.indexOf(tag) !== -1;
    }
}
/** @type {AreaGenerator}*/
function generate_basement_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}basement.png`,
        generate_floor: generate_basement_floor,
        enemy_list: [spider_tile, turret_o_tile, turret_d_tile, turret_r_tile, scythe_tile, 
                    spider_web_tile, clay_golem_tile, rat_tile, shadow_knight_tile, brightling_tile],
        boss_floor_list: [spider_queen_floor],
        next_area_list: area3,
        name: area_names.basement,
    }
}

/** @type {FloorGenerator}*/
function generate_basement_floor(floor_num, area, map){
    if(chance(1, 6)){
        many_walls_terrain(floor_num, area, map);
    }
    else{
        wall_terrain(floor_num, area, map);
    }
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function wall_terrain(floor_num, area, map){
    var wall_amount = Math.min(random_num(8), random_num(8));
    for(var i = 0; i < wall_amount; ++i){
        map.spawn_safely(damaged_wall_tile(), SAFE_SPAWN_ATTEMPTS, false);
        map.spawn_safely(wall_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {FloorGenerator}*/
function many_walls_terrain(floor_num, area, map){
    var wall_amount = 10 + random_num(5);
    for(var i = 0; i < wall_amount; ++i){
        map.spawn_safely(damaged_wall_tile(), SAFE_SPAWN_ATTEMPTS, false);
        map.spawn_safely(wall_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {AreaGenerator}*/
function generate_court_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}court.png`,
        generate_floor: generate_court_floor,
        enemy_list: [
            shadow_scout_tile, claustropede_2_tile, claustropede_3_tile, unspeakable_tile, wheel_of_fire_tile, 
            blood_crescent_tile, shadow_knight_elite_tile, maw_tile
        ],
        boss_floor_list: [lord_of_shadow_and_flame_floor],
        next_area_list: [generate_default_area],
        name: area_names.court,
    }
}

/** @type {FloorGenerator}*/
function generate_court_floor(floor_num, area, map){
    var reduction = 0;
    if(chance(1, 2)){
        starcaller_terrain(floor_num, area, map);
        reduction += 3;
    }
    for(var i = 0; i < 4; ++i){
        if(chance(1, 4)){
            shatter_sphere_terrain(floor_num, area, map);
            reduction += 1;
        }
    }
    generate_normal_floor(floor_num - reduction, area, map);
}

function starcaller_terrain(floor_num, area, map){
    var amount = random_num(2) + 1;
    var offsets = rand_no_repeats(range(0, 4), amount);
    for(var offset of offsets){
        var tile = starcaller_tile();
        tile.cycle = offset + 1;
        map.spawn_safely(tile, SAFE_SPAWN_ATTEMPTS, true);
    }
}

function shatter_sphere_terrain(floor_num, area, map){
    var amount = random_num(4) + random_num(4);
    var summons = [
        shatter_sphere_tile,
        moon_rock_tile
    ];
    for(var i = 0; i < amount; ++i){
        map.spawn_safely(random_from(summons)(), SAFE_SPAWN_ATTEMPTS, true);
    }
}
/** @type {AreaGenerator}*/
function generate_crypt_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}crypt.png`,
        generate_floor: generate_crypt_floor,
        enemy_list: [shadow_knight_tile, vampire_tile, clay_golem_tile, turret_r_tile, shadow_scout_tile, 
                    darkling_tile, orb_of_insanity_tile],
        boss_floor_list: [lich_floor],
        next_area_list: area4,
        name: area_names.crypt,
    }
}

/** @type {FloorGenerator}*/
function generate_crypt_floor(floor_num, area, map){
    coffin_terrain(floor_num, area, map);
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function coffin_terrain(floor_num, area, map){
    var coffin_amount = Math.min(random_num(4), random_num(4));
    for(var i = 0; i < coffin_amount; ++i){
        map.spawn_safely(coffin_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {AreaGenerator}*/
function generate_forest_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}forest.png`,
        generate_floor: generate_forest_floor,
        enemy_list: [vinesnare_bush_tile, carrion_flies_tile, ram_tile, swaying_nettle_tile, living_tree_tile, 
                    scythe_tile, scorpion_tile, thorn_bush_tile],
        boss_floor_list: [forest_heart_floor],
        next_area_list: area5,
        name: area_names.forest,
    }
}

/** @type {FloorGenerator}*/
function generate_forest_floor(floor_num, area, map){
    if(chance(1, 9) && !floor_has_chest(floor_num % init_settings().area_size)){
        swaying_nettle_terrain(floor_num, area, map);
        generate_normal_floor(floor_num / 2, area, map);
    }
    else{
        enticing_fruit_tree_terrain(floor_num, area, map);
        generate_normal_floor(floor_num, area, map);
    }
}
/** @type {FloorGenerator}*/
function enticing_fruit_tree_terrain(floor_num, area, map){
    if(chance(2, 5)){
        map.spawn_safely(enticing_fruit_tree_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}

/** @type {FloorGenerator}*/
function swaying_nettle_terrain(floor_num, area, map){
    var amount = 15 + random_num(8);
    for(var i = 0; i < amount; ++i){
        map.spawn_safely(swaying_nettle_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {AreaGenerator}*/
function generate_library_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}library.png`,
        generate_floor: generate_library_floor,
        enemy_list: [
            moving_turret_o_tile, moving_turret_d_tile, brightling_tile, captive_void_tile, paper_construct_tile,
            unstable_wisp_tile, walking_prism_tile, specter_tile, clay_golem_tile, gem_crawler_tile
        ],
        boss_floor_list: [arcane_sentry_floor],
        next_area_list: area5,
        name: area_names.library,
    }
}

/** @type {FloorGenerator}*/
function generate_library_floor(floor_num, area, map){
    if(chance(1, 7)){
        book_row_terrain(floor_num, area, map);
        generate_normal_floor(floor_num - 4, area, map);
        return;
    }
    if(chance(2, 3)){
        bookshelf_terrain(floor_num, area, map);
    }
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function book_row_terrain(floor_num, area, map){
    var rotate = chance(1, 2);
    var x_max = rotate ? FLOOR_HEIGHT : FLOOR_WIDTH;
    var y_max = rotate ? FLOOR_WIDTH : FLOOR_HEIGHT;
    var xs = [];
    for(var i = 0; i < x_max; i += 2){
        xs.push(i + random_num(2));
    }
    var ys = rotate ? range(0, y_max) : range(1, y_max - 1);
    for(var x of xs){
        var less_ys = rand_no_repeats(ys, y_max - 3);
        for(var y of less_ys){
            var p = rotate ? new Point(y, x) : new Point(x, y);
            if(map.check_empty(p)){
                map.add_tile(bookshelf_tile(), p);
            }
        }
    }
}

/** @type {FloorGenerator}*/
function bookshelf_terrain(floor_num, area, map){
    var bookshelf_amount = random_num(10);
    for(var i = 0; i < bookshelf_amount; ++i){
        map.spawn_safely(bookshelf_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {AreaGenerator}*/
function generate_magma_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}magma.png`,
        generate_floor: generate_magma_floor,
        enemy_list: [magma_spewer_tile, turret_r_tile, brightling_tile, igneous_crab_tile, strider_tile,
                    pheonix_tile, unstable_wisp_tile],
        boss_floor_list: [young_dragon_floor],
        next_area_list: area4,
        name: area_names.magma,
    }
}
/** @type {FloorGenerator}*/
function generate_magma_floor(floor_num, area, map){
    if(chance(1, 6)){
        magma_lake_terrain(floor_num, area, map);
        magma_lake_terrain(floor_num, area, map);
        boulder_terrain(floor_num, area, map);
        generate_normal_floor(floor_num, area, map);
        return;
    }
    else if (chance(1, 12)){
        boulder_field_terrain(floor_num, area, map);
        repulsor_terrain(floor_num, area, map);
        generate_normal_floor(floor_num - 5, area, map);
        return;
    }
    else if(chance(1, 4)){
        magma_border_terrain(floor_num, area, map);
    }
    else{
        magma_terrain(floor_num, area, map);
    }
    repulsor_terrain(floor_num, area, map);
    boulder_terrain(floor_num, area, map);
    generate_normal_floor(floor_num - 3, area, map);
}
/** @type {FloorGenerator}*/
function magma_border_terrain(floor_num, area, map){
    for(var x = 0; x < FLOOR_WIDTH; ++x){
        try{map.add_tile(lava_pool_tile(), new Point(x, 0))}
        catch{}
    }
    for(var y = 0; y < FLOOR_HEIGHT; ++y){
        try{map.add_tile(lava_pool_tile(), new Point(0, y))}
        catch{}
        try{map.add_tile(lava_pool_tile(), new Point(FLOOR_WIDTH - 1, y))}
        catch{}
    }
}
/** @type {FloorGenerator}*/
function magma_terrain(floor_num, area, map){
    var magma_amount = random_num(20) + 5;
    for(var i = 0; i < magma_amount; ++i){
        map.spawn_safely(lava_pool_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {FloorGenerator}*/
function repulsor_terrain(floor_num, area, map){
    var repulsor_amount = 0;
    for(var i = 0; i < 3; ++i){
        if(chance(1, 4)){
            ++repulsor_amount;
        }
    }
    for(var i = 0; i < repulsor_amount; ++i){
        map.spawn_safely(repulsor_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {FloorGenerator}*/
function boulder_terrain(floor_num, area, map){
    var boulder_amount = random_num(6) - 2;
    for(var i = 0; i < boulder_amount; ++i){
        map.spawn_safely(magmatic_boulder_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
    boulder_amount = random_num(6) - 2;
    for(var i = 0; i < boulder_amount; ++i){
        map.spawn_safely(animated_boulder_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}

/** @type {FloorGenerator}*/
function magma_lake_terrain(floor_num, area, map){
    var x_start = random_num(FLOOR_WIDTH - 5) + 1;
    var x_end = x_start + 3;
    var y_start = random_num(FLOOR_HEIGHT - 5) + 1;
    var y_end = y_start + 3;
    cross(
        range(x_start, x_end + 1),
        range(y_start, y_end + 1),
        (x, y) => {
            if(!(x === x_start || x === x_end) || !(y === y_start || y === y_end)){
                try{map.add_tile(lava_pool_tile(), new Point(x, y))}
                catch{}
            }
        }
    );
}

function boulder_field_terrain(floor_num, area, map){
    var boulder_amount = random_num(6) + 4;
    for(var i = 0; i < boulder_amount; ++i){
        map.spawn_safely(magmatic_boulder_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
    boulder_amount = random_num(7) + random_num(7) + 8;
    for(var i = 0; i < boulder_amount; ++i){
        map.spawn_safely(animated_boulder_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {AreaGenerator}*/
function generate_ruins_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}ruins.png`,
        generate_floor: generate_ruins_floor,
        enemy_list: [spider_tile, turret_o_tile, turret_d_tile, scythe_tile, vinesnare_bush_tile, 
                    ram_tile, rat_tile, shadow_knight_tile],
        boss_floor_list: [velociphile_floor],
        next_area_list: area2,
        name: area_names.ruins,
    }
}

/** @type {FloorGenerator}*/
function generate_ruins_floor(floor_num, area, map){
    // gives a little extra difficulty since it's the first area and there isn't any terrain.
    generate_normal_floor(floor_num + 1, area, map);
}
/** @type {AreaGenerator}*/
function generate_sewers_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}sewers.png`,
        generate_floor: generate_sewers_floor,
        enemy_list: [rat_tile, turret_o_tile, turret_d_tile, large_porcuslime_tile, medium_porcuslime_tile, 
                    corrosive_caterpillar_tile, noxious_toad_tile, acid_bug_tile, carrion_flies_tile],
        boss_floor_list: [two_headed_serpent_floor],
        next_area_list: area3,
        name: area_names.sewers,
    }
}

/** @type {FloorGenerator}*/
function generate_sewers_floor(floor_num, area, map){
    if(chance(1, 8)){
        river_terrain(floor_num, area, map);
    }
    else{
        var terrains = [slime_terrain, grate_terrain];
        random_from(terrains)(floor_num, area, map);
    }
    generate_normal_floor(floor_num, area, map);
}

/** @type {FloorGenerator}*/
function slime_terrain(floor_num, area, map){
    var slime_amount = random_num(4);
    for(var i = 0; i < slime_amount; ++i){
        map.spawn_safely(corrosive_slime_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {FloorGenerator}*/
function grate_terrain(floor_num, area, map){
    var grate_amount = random_num(3);
    for(var i = 0; i < grate_amount; ++i){
        map.spawn_safely(sewer_grate_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}

function river_terrain(floor_num, area, map){
    var left = random_num(FLOOR_WIDTH / 2 - 1) + 1;
    var right = (FLOOR_WIDTH / 2) - left;
    var x_vals = [...range(0, left), ...range(FLOOR_WIDTH - right, FLOOR_WIDTH)];
    var y = random_num(FLOOR_HEIGHT - 4) + 2;
    for(var x of x_vals){
        map.add_tile(sewer_grate_tile(), new Point(x, y));
        map.add_tile(corrosive_slime_tile(), new Point(x, y + 1));
        map.add_tile(corrosive_slime_tile(), new Point(x, y - 1));
    }
    cross(
        [left, FLOOR_WIDTH - (right + 1)], 
        [1, 0, -1],
        (e1, e2) => {
            map.add_tile(corrosive_slime_tile(), new Point(e1, y + e2));
        }
    );
}
// ----------------Areas.js----------------
// File containing functions used by areas.

// The structure of the dungeon. Each area can lead to a random one in the next numbered array.
const area_end = [generate_default_area]; // Once they have finished the completed areas, they go here.
const area1 = [generate_ruins_area];
const area2 = [generate_sewers_area, generate_basement_area];
const area3 = [generate_magma_area, generate_crypt_area];
const area4 = [generate_forest_area, generate_library_area];
const area5 = [generate_court_area];

/**
 * @typedef {Object} Area A section of the dungeon that ends with a boss fight.
 * @property {string} background The picture used as a background for this area.
 * @property {FloorGenerator} generate_floor A function to generate a normal floor of the dungeon.
 * @property {TileGenerator[]} enemy_list An array of which enemies can spawn here.
 * @property {FloorGenerator[]} boss_floor_list An array of functions that can create a boss floor at the end of the area.
 * @property {AreaGenerator[]} next_area_list An array of the areas that can follow this one.
 * @property {string} description A description given when entering this area.
 */

/**
 * @callback AreaGenerator A function to create 
 * @returns {Area}         and return an area object.
 */

// ---Unfinished Areas---

/** @type {AreaGenerator}*/
function generate_default_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}default.png`,
        generate_floor: floor_generator,
        enemy_list: ENEMY_LIST,
        boss_floor_list: [],
        next_area_list: [generate_default_area],
        name: area_names.default,
    }
}
/** @type {FloorGenerator} Generates the floor where the Arcane Sentry appears.*/
function arcane_sentry_floor(floor_num,  area, map){
    // Randomly select a point where the player is not in range.
    var offset = 2;
    var x_range = randomize_arr(range(offset, FLOOR_WIDTH - offset));
    var y_range = randomize_arr(range(offset, FLOOR_HEIGHT - offset));
    var player_x = map.get_player_location().x;
    var x_range = x_range.filter((x) => {
        return x !== player_x + 1 && x !== player_x - 1;
    });

    // Spawn the core.
    var core_pos = new Point(x_range[0], y_range[0]);
    var core = arcane_sentry_tile();
    if(GS.boons.has(boon_names.boss_slayer)){
        core.health -= 2;
    }
    map.add_tile(core, core_pos);

    // Spawn the nodes.
    for(var direction of DIAGONAL_DIRECTIONS){
        var node = arcane_node_tile();
        if(GS.boons.has(boon_names.boss_slayer)){
            node.health -= 2;
        }
        map.add_tile(node, core_pos.plus(direction));
    }
    
    // Swap to turret mode for setup.
    var self = {
        tile: core,
        location: core_pos
    }
    var target = {
        tile: map.get_player(),
        difference: map.get_player_location().minus(core_pos)
    }
    core.mode = SENTRY_MODES.turret
    sentry_transform_turret(self, target, map);
    return boss_floor_message.arcane_sentry;
}
/** @type {FloorGenerator} Generates the floor where the Forest Heart appears.*/
function forest_heart_floor(floor_num,  area, map){
    var mid_width = Math.floor(FLOOR_WIDTH / 2) - 1;
    var mid_height = Math.floor(FLOOR_HEIGHT / 2) - 1;

    var locations = [
        new Point(mid_width, mid_height),
        new Point(mid_width + 1, mid_height),
        new Point(mid_width + 1, mid_height + 1),
        new Point(mid_width, mid_height + 1),
    ];
    var sections = [
        [undefined, new Point(1, 0)],
        [new Point(-1, 0), new Point(0, 1)],
        [new Point(0, -1), new Point(-1, 0)],
        [new Point(1, 0), undefined],
    ];
    for(var i = 0; i < locations.length; ++i){
        var section = forest_heart_tile();
        if(GS.boons.has(boon_names.boss_slayer)){
            section.health -= 2;
            var next_spell = section.spells[section.health - 2];
            section.description = boss_descriptions.forest_heart + next_spell.description;
            section.pic = next_spell.pic;
            section.telegraph_other = next_spell.telegraph_other;
        }
        if(i !== 0){
            section.behavior = undefined;
            section.tags.add(TAGS.hidden);
        }
        section.rotate = 90 * i;
        section.segment_list = sections[i];
        map.add_tile(section, locations[i]);
    }
    map.add_tile(living_tree_rooted_tile(), new Point(mid_width - 1, mid_height));
    map.add_tile(living_tree_rooted_tile(), new Point(mid_width + 2, mid_height));
    map.add_tile(vinesnare_bush_tile(), new Point(mid_width - 2, mid_height));
    map.add_tile(vinesnare_bush_tile(), new Point(mid_width + 3, mid_height));
    return boss_floor_message.forest_heart;
}
/** @type {FloorGenerator} Generates the floor where the Lich appears.*/
function lich_floor(floor_num,  area, map){
    var locations = [
        new Point(FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2),
        new Point(1, FLOOR_HEIGHT - 2),
        new Point(FLOOR_WIDTH - 2, 1),
        new Point(1, 1),
    ];
    for(var location of locations){
        map.add_tile(damaged_wall_tile(), location);
    }
    var boss = lich_tile();
    if(GS.boons.has(boon_names.boss_slayer)){
        boss.health -= 2;
    }
    map.spawn_safely(boss, SAFE_SPAWN_ATTEMPTS, true);
    return boss_floor_message.lich;
}
/** @type {FloorGenerator} Generates the floor where the Lord of Shadow and Flame appears.*/
function lord_of_shadow_and_flame_floor(floor_num,  area, map){
    map.remove_exit();
    var mid_width = Math.floor(FLOOR_WIDTH / 2) - 1;
    var mid_height = Math.floor(FLOOR_HEIGHT / 2) - 1;
    var locations = [
        new Point(mid_width, mid_height),
        new Point(mid_width + 1, mid_height),
        new Point(mid_width + 1, mid_height + 1),
        new Point(mid_width, mid_height + 1),
    ];
    var spawnpoint = random_from(locations);
    var boss = lord_of_shadow_and_flame_tile();
    if(GS.boons.has(boon_names.boss_slayer)){
        boss.health -= 2;
    }
    map.add_tile(boss, spawnpoint);
    var message = boss_floor_message.lord_of_shadow_and_flame;
    var pacifism_message = GS.boons.has(boon_names.pacifism) > 0
        ? `\n${boss_floor_message.lord_pacifism}`
        : ``;
    return `${message}${pacifism_message}`;
}
/** @type {FloorGenerator} Generates the floor where the Spider Queen appears.*/
function spider_queen_floor(floor_num, area, map){
    var boss = spider_queen_tile();
    if(GS.boons.has(boon_names.boss_slayer)){
        boss.health -= 2;
    }
    map.spawn_safely(boss, SAFE_SPAWN_ATTEMPTS, true);
    for(var i = 0; i < 4; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    for(var i = 0; i < 2; ++i){
        map.add_tile(spider_web_tile());
    }
    return boss_floor_message.spider_queen;
}
/** @type {FloorGenerator} Generates the floor where the Two Headed Serpent appears.*/
function two_headed_serpent_floor(floor_num, area, map){
    var serpent_length = 8;
    if(GS.boons.has(boon_names.boss_slayer)){
        serpent_length -= 2;
    }
    var finished = false;
    // Finds enough adjacent empty spaces to spawn the serpent in.
    do{
        finished = true;
        var locations = [];
        var current = map.random_empty();
        if(current.y >= 2){
            finished = false;
        }
        var position = current.copy();
        var dirs = [new Point(random_sign(), 0), new Point(0, random_sign())];
        for(var i = 1; i < serpent_length; ++i){
            var next = random_from(dirs);
            position.plus_equals(next);
            if(map.check_empty(position)){
                locations.push(next);
            }
            else{
                finished = false;
            }
        }
    }while(!finished)
    // Add sleeping head.
    var head = two_headed_serpent_tile();
    if(head.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    head.segment_list[0] = locations[0].copy();
    serpent_rotate(head);
    map.add_tile(head, current);
    var start = current.copy();
    // Add body segments.
    for(var i = 0; i < locations.length - 1; ++i){
        var segment = two_headed_serpent_body_tile();
        if(segment.segment_list === undefined){
            throw new Error(ERRORS.missing_property);
        }
        segment.segment_list[0] = locations[i + 1];
        segment.segment_list[1] = locations[i].times(-1);
        serpent_rotate(segment);
        current.plus_equals(locations[i]);
        map.add_tile(segment, current);
    }
    // Add awake head.
    var tail = two_headed_serpent_tile();
    if(tail.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    tail.segment_list[1] = locations[locations.length - 1].times(-1);
    serpent_rotate(tail);
    current.plus_equals(locations[locations.length - 1]);
    map.add_tile(tail, current);
    serpent_wake({tile: head, location: start}, map);
    // Add terrain.
    for(var i = 0; i < 8; ++i){
        var position = map.random_empty();
        map.add_tile(wall_tile(), position);
        map.add_tile(damaged_wall_tile(), position.plus(random_from(ALL_DIRECTIONS)));
    }
    return boss_floor_message.two_headed_serpent;
}
/** @type {FloorGenerator} Generates the floor where the Velociphile appears.*/
function velociphile_floor(floor_num,  area, map){
    var boss = velociphile_tile();
    if(GS.boons.has(boon_names.boss_slayer)){
        boss.health -= 2;
    }
    map.spawn_safely(boss, SAFE_SPAWN_ATTEMPTS, true);
    for(var i = 0; i < 8; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    return boss_floor_message.velociphile;
}
/** @type {FloorGenerator} Generates the floor where the Young Dragon appears.*/
function young_dragon_floor(floor_num,  area, map){
    var boss = young_dragon_tile();
    if(GS.boons.has(boon_names.boss_slayer)){
        boss.health -= 2;
    }
    map.spawn_safely(boss, SAFE_SPAWN_ATTEMPTS, true);
    for(var i = 0; i < 22; ++i){
        map.add_tile(lava_pool_tile());
    }
    return boss_floor_message.young_dragon;
}
// ----------------Floors.js----------------
// File containing the functions for generating new floors.

const BOSS_FLOOR = [velociphile_floor, spider_queen_floor, lich_floor];

/**
 * @callback FloorGenerator Function to populate a floor.
 * @param {number} floor_number How many floors have they entered. Used to determine the combined difficulty of spawned enemies.
 * @param {Area} area Which area of the dungeon are we in.
 * @param {GameMap} map The gamemap which holds the floor.
 */
/** @type {FloorGenerator} The generator ONLY used by the default area if they have finished all the content.*/
function floor_generator(floor_num, area, map){
    area_size = init_settings().area_size;
    if(!(floor_num % area_size == 0) || Math.floor(floor_num / area_size) - 1 >= BOSS_FLOOR.length){
        generate_normal_floor(floor_num, area, map);
    }
    else{
        BOSS_FLOOR[Math.floor(floor_num / area_size) - 1](floor_num, area, map);
    }
}
/** @type {FloorGenerator} The standard generator to add random enemies from the area whose combined difficulty scales based on the floor number.*/
function generate_normal_floor(floor_num, area, map){
    if(GS.boons.has(boon_names.rift_touched)){
        for(var i = 0; i < 2; ++i){
            map.spawn_safely(darkling_tile(), SAFE_SPAWN_ATTEMPTS, true);
        }
    }
    if(GS.boons.has(boon_names.flame_worship)){
        map.spawn_safely(altar_of_scouring_tile(), SAFE_SPAWN_ATTEMPTS, true);
    }
    var enemy_list = area.enemy_list;
    for(var i = floor_num * 2; i > 0;){
        var choice = random_num(enemy_list.length);
        var new_enemy = enemy_list[choice]();
        if(new_enemy.difficulty !== undefined){
            var spawned = map.spawn_safely(new_enemy, SAFE_SPAWN_ATTEMPTS, false);
            if(spawned !== undefined){
                i -= new_enemy.difficulty;
                for(var j = 0; j < 2 * GS.boons.has(boon_names.stealthy); ++j){
                    map.stun_tile(spawned);
                }
            }
            else{
                --i;
            }
        }
    }
    if(chance(GS.boons.has(boon_names.frugivore), 2)){
        map.spawn_safely(enticing_fruit_tree_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}

function boss_floor_common(floor_num,  area, map){
    if(GS.boons.has(boon_names.pacifism) === 0){
        map.lock();
    }
    GS.map.stats.reset_boss_damage();
    if(chance(GS.boons.has(boon_names.frugivore), 2)){
        map.spawn_safely(enticing_fruit_tree_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}

/** @type {CardGenerator}*/
function basic_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: card_names.basic_diagonal,
        pic: `${IMG_FOLDER.cards}basic_diagonal.png`,
        options,
        basic: true
    }
}
/** @type {CardGenerator}*/
function basic_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: card_names.basic_orthogonal,
        pic: `${IMG_FOLDER.cards}basic_orthogonal.png`,
        options,
        basic: true
    }
}
/** @type {CardGenerator}*/
function basic_slice(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1)]);
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(1, -1)]);
    options.add_button(S,[pattack(1, 1), pattack(0, 1), pattack(-1, 1)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-1, -1)]);
    return{
        name: card_names.basic_slice,
        pic: `${IMG_FOLDER.cards}basic_slice.png`,
        options,
        basic: true
    }
}
/** @type {CardGenerator}*/
function execution_1(){
    var options = new ButtonGrid();
    var spin = [
        pattack(1, 1), 
        pattack(1, 0),
        pattack(1, -1),
        pattack(0, 1),
        pattack(0, -1),
        pattack(-1, 1),
        pattack(-1, 0),
        pattack(-1, -1),
    ];
    options.add_button(C, spin);
    return{
        name: card_names.execution_1,
        pic: `${IMG_FOLDER.cards}execution_1.png`,
        options,
        evolutions: [execution_2],
    }
}

/** @type {CardGenerator}*/
function execution_2(){
    var options = new ButtonGrid();
    var spin = [
        pattack(1, 1),
        pattack(1, 0),
        pattack(1, -1),
        pattack(0, 1),
        pattack(0, -1),
        pattack(-1, 1),
        pattack(-1, 0),
        pattack(-1, -1),
    ];
    spin = [...spin, ...spin];
    options.add_button(C, spin);
    return{
        name: card_names.execution_2,
        pic: `${IMG_FOLDER.cards}execution_2.png`,
        options,
        evolutions: [execution_3],
    }
}

/** @type {CardGenerator}*/
function execution_3(){
    var options = new ButtonGrid();
    var spin = [
        pattack(1, 1),
        pattack(1, 0),
        pattack(1, -1),
        pattack(0, 1),
        pattack(0, -1),
        pattack(-1, 1),
        pattack(-1, 0),
        pattack(-1, -1),
    ];
    spin = [...spin, ...spin, ...spin];
    options.add_button(C, spin);
    return{
        name: card_names.execution_3,
        pic: `${IMG_FOLDER.cards}execution_3.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lost_maneuver(){
    var options = new ButtonGrid();
    options.add_button(C, [], 5);
    return{
        name: card_names.lost_maneuver,
        pic: `${IMG_FOLDER.cards}lost_maneuver.png`,
        options,
        evolutions: [maneuver_1, blink_1, back_stab_1],
    }
}
/** @type {CardGenerator}*/
function split_second_1(){
    var options = new ButtonGrid();
    var spin = [
        pattack(1, 1),
        pattack(1, 0),
        pattack(1, -1),
        pattack(0, 1),
        pattack(0, -1),
        pattack(-1, 1),
        pattack(-1, 0),
        pattack(-1, -1),
    ];
    options.add_button(C, spin);
    return{
        name: card_names.split_second_1,
        pic: `${IMG_FOLDER.cards}split_second_1.png`,
        options,
        evolutions: [split_second_2],
    }
}

/** @type {CardGenerator}*/
function split_second_2(){
    var options = new ButtonGrid();
    var spin = [
        pattack(1, 1),
        pattack(1, 0),
        pattack(1, -1),
        pattack(0, 1),
        pattack(0, -1),
        pattack(-1, 1),
        pattack(-1, 0),
        pattack(-1, -1),
    ];
    options.add_button(C, spin);
    options.make_instant();
    return{
        name: card_names.split_second_2,
        pic: `${IMG_FOLDER.cards}split_second_2.png`,
        options
    }
}
/** @type {CardGenerator}*/
function superweapon_1(){
    var options = new ButtonGrid();
    var spin = [
        pattack(1, 1),
        pattack(1, 0),
        pattack(1, -1),
        pattack(0, 1),
        pattack(0, -1),
        pattack(-1, 1),
        pattack(-1, 0),
        pattack(-1, -1),
    ];
    options.add_button(C, spin);
    return{
        name: card_names.superweapon_1,
        pic: `${IMG_FOLDER.cards}superweapon_1.png`,
        options,
        evolutions: [superweapon_2]
    }
}

/** @type {CardGenerator}*/
function superweapon_2(){
    var options = new ButtonGrid();
    var area = [];
    var radius = 2;
    for(var i = -1 * radius; i <= radius; ++i){
        for(var j = -1 * radius; j <= radius; ++j){
            if(i !== 0 || j !== 0){
                area.push(pattack(i, j));
            }
        }
    }
    options.add_button(C, area);
    return{
        name: card_names.superweapon_2,
        pic: `${IMG_FOLDER.cards}superweapon_2.png`,
        options
    }
}
/** @type {CardGenerator}*/
function back_stab_1(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: card_names.back_stab_1,
        pic: `${IMG_FOLDER.cards}back_stab_1.png`,
        options,
        evolutions: [back_stab_2]
    }
}

/** @type {CardGenerator}*/
function back_stab_2(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2), pattack(-1, 1), pattack(-1, 0), pattack(0, 1)]);
    options.add_button(SE, [pmove(2, 2), pattack(-1, -1), pattack(-1, 0), pattack(0, -1)]);
    options.add_button(SW, [pmove(-2, 2), pattack(1, -1), pattack(1, 0), pattack(0, -1)]);
    options.add_button(NW, [pmove(-2, -2), pattack(1, 1), pattack(1, 0), pattack(0, 1)]);
    return{
        name: card_names.back_stab_2,
        pic: `${IMG_FOLDER.cards}back_stab_2.png`,
        options,
    }
}
/** @type {CardGenerator}*/
function blink_1(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: card_names.blink_1,
        pic: `${IMG_FOLDER.cards}blink_1.png`,
        options,
        evolutions: [blink_2]
    }
}

/** @type {CardGenerator}*/
function blink_2(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    options.make_instant();
    return{
        name: card_names.blink_2,
        pic: `${IMG_FOLDER.cards}blink_2.png`,
        options,
    }
}
/** @type {CardGenerator}*/
function lost_technique(){
    var options = new ButtonGrid();
    options.add_button(C, [], 5);
    return{
        name: card_names.lost_technique,
        pic: `${IMG_FOLDER.cards}lost_technique.png`,
        options,
        evolutions: [split_second_1, execution_1, superweapon_1]
    }
}
/** @type {CardGenerator}*/
function maneuver_1(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: card_names.maneuver_1,
        pic: `${IMG_FOLDER.cards}maneuver_1.png`,
        options,
        evolutions: [maneuver_2]
    }
}

/** @type {CardGenerator}*/
function maneuver_2(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    options.add_button(N, [pmove(0, -2)]);
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(S, [pmove(0, 2)]);
    options.add_button(W, [pmove(-2, 0)]);
    return{
        name: card_names.maneuver_2,
        pic: `${IMG_FOLDER.cards}maneuver_2.png`,
        options,
        evolutions: [maneuver_3]
    }
}

/** @type {CardGenerator}*/
function maneuver_3(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    options.add_button(N, [pmove(0, -2)]);
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(S, [pmove(0, 2)]);
    options.add_button(W, [pmove(-2, 0)]);
    var spin = [
        pstun(1, 1),
        pstun(1, 0),
        pstun(1, -1),
        pstun(0, 1),
        pstun(0, -1),
        pstun(-1, 1),
        pstun(-1, 0),
        pstun(-1, -1),
    ];
    options.add_button(C, spin);
    return{
        name: card_names.maneuver_3,
        pic: `${IMG_FOLDER.cards}maneuver_3.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the Arcane Sentry*/
function beam_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack_until(0, -1), pattack_until(1, 0)]);
    options.add_button(SW, [pmove(-1, 1), pattack(-1, -1), pattack(1, 1), pattack(-1, 1)]);
    return{
        name: card_names.beam_ne,
        pic: `${IMG_FOLDER.cards}beam_ne.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the Arcane Sentry*/
function beam_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pattack_until(0, -1), pattack_until(-1, 0)]);
    options.add_button(SE, [pmove(1, 1), pattack(-1, 1), pattack(1, -1), pattack(1, 1)]);
    return{
        name: card_names.beam_nw,
        pic: `${IMG_FOLDER.cards}beam_nw.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the Arcane Sentry*/
function beam_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [pattack_until(0, 1), pattack_until(1, 0)]);
    options.add_button(NW, [pmove(-1, -1), pattack(1, -1), pattack(-1, 1), pattack(-1, -1)]);
    return{
        name: card_names.beam_se,
        pic: `${IMG_FOLDER.cards}beam_se.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the Arcane Sentry*/
function beam_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [pattack_until(0, 1), pattack_until(-1, 0)]);
    options.add_button(NE, [pmove(1, -1), pattack(-1, -1), pattack(1, 1), pattack(1, -1)]);
    return{
        name: card_names.beam_sw,
        pic: `${IMG_FOLDER.cards}beam_sw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function saw_strike(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(0, -1), pattack(-1, 0), pattack(0, 1), pattack(1, 0), ]);
    options.add_button(SE, [pmove(1, 1), pattack(0, -1), pattack(-1, 0), pattack(0, 1), pattack(1, 0), ]);
    options.add_button(NW, [pmove(-1, -1), pattack(0, -1), pattack(-1, 0), pattack(0, 1), pattack(1, 0), ]);
    options.add_button(SW, [pmove(-1, 1), pattack(0, -1), pattack(-1, 0), pattack(0, 1), pattack(1, 0), ]);
    return{
        name: card_names.saw_strike,
        pic: `${IMG_FOLDER.cards}saw_strike.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the forest heart*/
function branch_strike(){
    var options = new ButtonGrid();
    var targets = point_rectangle(new Point(-2, -2), new Point(2, 2)).map(p => {
        return pattack(p.x, p.y);
    });
    options.add_button(C, targets);
    return{
        name: card_names.branch_strike,
        pic: `${IMG_FOLDER.cards}branch_strike.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the forest heart*/
function snack(){
    var options = new ButtonGrid();
    options.add_button(C, [pheal(0, 0), pstun(0, 0)]);
    options.make_instant();
    return{
        name: card_names.snack,
        pic: `${IMG_FOLDER.cards}snack.png`,
        options,
        per_floor: snack
    }
}
/** @type {CardGenerator} Dropped by the forest heart*/
function vine_snare(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(2, 2), pmove(1, 1)]);
    options.add_button(SW, [pmove(-2, 2), pmove(-1, 1)]);
    options.add_button(NE, [pmove(2, -2), pmove(1, -1)]);
    options.add_button(NW, [pmove(-2, -2), pmove(-1, -1)]);
    return{
        name: card_names.vine_snare,
        pic: `${IMG_FOLDER.cards}vine_snare.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the lich*/
function beam_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack_until(1, -1)]);
    options.add_button(SE, [pattack_until(1, 1)]);
    options.add_button(SW, [pattack_until(-1, 1)]);
    options.add_button(NW, [pattack_until(-1, -1)]);
    return{
        name: card_names.beam_diagonal,
        pic: `${IMG_FOLDER.cards}beam_diagonal.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the lich*/
function beam_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack_until(0, -1)]);
    options.add_button(E, [pattack_until(1, 0)]);
    options.add_button(S, [pattack_until(0, 1)]);
    options.add_button(W, [pattack_until(-1, 0)]);
    return{
        name: card_names.beam_orthogonal,
        pic: `${IMG_FOLDER.cards}beam_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the lich*/
function debilitating_confusion(){
    var options = new ButtonGrid();
    var spin = [pstun(1, 1),
                pstun(1, 0),
                pstun(1, -1),
                pstun(0, 1),
                pstun(0, -1),
                pstun(-1, 1),
                pstun(-1, 0),
                pstun(-1, -1)];
    options.add_button(C, [...spin, ...spin, ...spin]);
    return{
        name: card_names.debilitating_confusion,
        pic: `${IMG_FOLDER.cards}debilitating_confusion.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the lich*/
function instant_teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pteleport(0, 0)]);
    options.make_instant();
    return{
        name: card_names.instant_teleport,
        pic: `${IMG_FOLDER.cards}instant_teleport.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the spider queen*/
function bite(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1)]);
    options.add_button(E, [pattack(1, 0)]);
    options.add_button(S, [pattack(0, 1)]);
    options.add_button(W, [pattack(-1, 0)]);
    options.add_button(NE, [pattack(1, -1)]);
    options.add_button(SE, [pattack(1, 1)]);
    options.add_button(SW, [pattack(-1, 1)]);
    options.add_button(NW, [pattack(-1, -1)]);
    options.make_instant();
    return{
        name: card_names.bite,
        pic: `${IMG_FOLDER.cards}bite.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the spider queen*/
function chomp(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -1)]);
    options.add_button(E, [pattack(1, 0), pattack(1, 0)]);
    options.add_button(S, [pattack(0, 1), pattack(0, 1)]);
    options.add_button(W, [pattack(-1, 0), pattack(-1, 0)]);
    options.add_button(NE, [pattack(1, -1), pattack(1, -1)]);
    options.add_button(SE, [pattack(1, 1), pattack(1, 1)]);
    options.add_button(SW, [pattack(-1, 1), pattack(-1, 1)]);
    options.add_button(NW, [pattack(-1, -1), pattack(-1, -1)]);
    return{
        name: card_names.chomp,
        pic: `${IMG_FOLDER.cards}chomp.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the spider queen*/
function skitter(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: card_names.skitter,
        pic: `${IMG_FOLDER.cards}skitter.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the two headed serpent.*/
function fangs(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(1, 0), pattack(-1, 0), pattack(0, -1)]);
    options.add_button(E, [pmove(1, 0), pattack(1, 0), pattack(0, 1), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pattack(1, 0), pattack(-1, 0), pattack(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0), pattack(0, 1), pattack(0, -1)]);
    return{
        name: card_names.fangs,
        pic: `${IMG_FOLDER.cards}fangs.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the two headed serpent*/
function regenerate(){
    var options = new ButtonGrid();
    options.add_button(C, [pheal(0, 0)]);
    return{
        name: card_names.regenerate,
        pic: `${IMG_FOLDER.cards}regenerate.png`,
        options,
        per_floor: regenerate
    }
}
/** @type {CardGenerator} Dropped by the two headed serpent.*/
function slither(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, 0), pmove(0, -1), pmove(0, -1)]);
    options.add_button(E, [pstun(0, 0), pmove(1, 0), pmove(1, 0)]);
    options.add_button(S, [pstun(0, 0), pmove(0, 1), pmove(0, 1)]);
    options.add_button(W, [pstun(0, 0), pmove(-1, 0), pmove(-1, 0)]);
    options.make_instant();
    return{
        name: card_names.slither,
        pic: `${IMG_FOLDER.cards}slither.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the velociphile*/
function roll_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove_until(1, 0), pattack(1, 0)]);
    options.add_button(W, [pmove_until(-1, 0), pattack(-1, 0)]);
    return{
        name: card_names.roll_horizontal,
        pic: `${IMG_FOLDER.cards}roll_horizontal.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the velociphile*/
function roll_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove_until(1, -1), pattack(1, -1)]);
    options.add_button(SW, [pmove_until(-1, 1), pattack(-1, 1)]);
    return{
        name: card_names.roll_ne,
        pic: `${IMG_FOLDER.cards}roll_ne.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the velociphile*/
function roll_nw(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove_until(1, 1), pattack(1, 1)]);
    options.add_button(NW, [pmove_until(-1, -1), pattack(-1, -1)]);
    return{
        name: card_names.roll_nw,
        pic: `${IMG_FOLDER.cards}roll_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function firebreathing_horizontal(){
    var options = new ButtonGrid();

    var e_cone_points = create_orthogonal_cone(90, 3);
    var e_cone = e_cone_points.map((p) => pattack(p.x, p.y));
    var w_cone_points = create_orthogonal_cone(270, 3);
    var w_cone = w_cone_points.map((p) => pattack(p.x, p.y));

    options.add_button(E, e_cone);
    options.add_button(W, w_cone);
    return{
        name: card_names.firebreathing_horizontal,
        pic: `${IMG_FOLDER.cards}firebreathing_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function firebreathing_ne(){
    var options = new ButtonGrid();

    var ne_cone_points = create_diagonal_cone(90, 3);
    var ne_cone = ne_cone_points.map((p) => pattack(p.x, p.y));
    var sw_cone_points = create_diagonal_cone(270, 3);
    var sw_cone = sw_cone_points.map((p) => pattack(p.x, p.y));

    options.add_button(NE, ne_cone);
    options.add_button(SW, sw_cone);
    return{
        name: card_names.firebreathing_ne,
        pic: `${IMG_FOLDER.cards}firebreathing_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function firebreathing_nw(){
    var options = new ButtonGrid();

    var nw_cone_points = create_diagonal_cone(0, 3);
    var nw_cone = nw_cone_points.map((p) => pattack(p.x, p.y));
    var se_cone_points = create_diagonal_cone(180, 3);
    var se_cone = se_cone_points.map((p) => pattack(p.x, p.y));

    options.add_button(NW, nw_cone);
    options.add_button(SE, se_cone);
    return{
        name: card_names.firebreathing_nw,
        pic: `${IMG_FOLDER.cards}firebreathing_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function firebreathing_vertical(){
    var options = new ButtonGrid();

    var n_cone_points = create_orthogonal_cone(0, 3);
    var n_cone = n_cone_points.map((p) => pattack(p.x, p.y));
    var s_cone_points = create_orthogonal_cone(180, 3);
    var s_cone = s_cone_points.map((p) => pattack(p.x, p.y));

    options.add_button(N, n_cone);
    options.add_button(S, s_cone);
    return{
        name: card_names.firebreathing_vertical,
        pic: `${IMG_FOLDER.cards}firebreathing_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function glide(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -1)]);
    options.add_button(E, [pmove(3, 0)]);
    options.add_button(SE, [pmove(2, 1)]);
    options.add_button(NW, [pmove(-2, -1)]);
    options.add_button(W, [pmove(-3, 0)]);
    options.add_button(SW, [pmove(-2, 1)]);
    return{
        name: card_names.glide,
        pic: `${IMG_FOLDER.cards}glide.png`,
        options
    }
}
/** @type {CardGenerator}*/
function soar(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(3, -1)]);
    options.add_button(SE, [pmove(3, 1)]);
    options.add_button(NW, [pmove(-3, -1)]);
    options.add_button(SW, [pmove(-3, 1)]);
    return{
        name: card_names.soar,
        pic: `${IMG_FOLDER.cards}soar.png`,
        options
    }
}
/** @type {CardGenerator}*/
function advance(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1)]);
    options.add_button(NE, [pmove(1, -1), pmove(1, -1)]);
    options.add_button(NW, [pmove(-1, -1), pmove(-1, -1)]);
    return{
        name: card_names.advance,
        pic: `${IMG_FOLDER.cards}advance.png`,
        options
    }
}
/** @type {CardGenerator}*/
function bounding_retreat(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(SE, [pmove(2, 2), pmove(1, 1)]);
    options.add_button(SW, [pmove(-2, 2), pmove(-1, 1)]);
    return{
        name: card_names.bounding_retreat,
        pic: `${IMG_FOLDER.cards}bounding_retreat.png`,
        options
    }
}
/** @type {CardGenerator}*/
function breakthrough_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pattack(1, 0), pattack(0, 1), pattack(0, -1)]);
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0), pattack(0, 1), pattack(0, -1)]);
    return{
        name: card_names.breakthrough_horizontal,
        pic: `${IMG_FOLDER.cards}breakthrough_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function breakthrough_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(1, 0), pattack(-1, 0), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pattack(1, 0), pattack(-1, 0), pattack(0, 1)]);
    return{
        name: card_names.breakthrough_vertical,
        pic: `${IMG_FOLDER.cards}breakthrough_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function butterfly(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: card_names.butterfly,
        pic: `${IMG_FOLDER.cards}butterfly.png`,
        options
    }
}
/** @type {CardGenerator}*/
function charge_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pmove(1, 0), pattack(1, 0)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0), pattack(-1, 0)]);
    return{
        name: card_names.charge_horizontal,
        pic: `${IMG_FOLDER.cards}charge_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function charge_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pattack(0, 1)]);
    return{
        name: card_names.charge_vertical,
        pic: `${IMG_FOLDER.cards}charge_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function clear_behind(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1)]);
    options.add_button(S, [pattack(2, 1), pattack(1, 1), pattack(0, 1), pattack(-1, 1), pattack(-2, 1), 
                           pattack(2, 2), pattack(1, 2), pattack(0, 2), pattack(-1, 2), pattack(-2, 2)]);
    return{
        name: card_names.clear_behind,
        pic: `${IMG_FOLDER.cards}clear_behind.png`,
        options
    }
}
/** @type {CardGenerator}*/
function clear_in_front(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), 
                           pattack(1, -2), pattack(0, -2), pattack(-1, -2)]);
    options.add_button(S,[pattack(1, 1), pattack(0, 1), pattack(-1, 1)]);
    return{
        name: card_names.clear_in_front,
        pic: `${IMG_FOLDER.cards}clear_in_front.png`,
        options
    }
}
/** @type {CardGenerator}*/
function combat_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1), pmove(1, -1)]);
    options.add_button(SE, [pattack(1, 1), pmove(1, 1)]);
    options.add_button(SW, [pattack(-1, 1), pmove(-1, 1)]);
    options.add_button(NW, [pattack(-1, -1), pmove(-1, -1)]);
    return{
        name: card_names.combat_diagonal,
        pic: `${IMG_FOLDER.cards}combat_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function combat_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pmove(0, -1)]);
    options.add_button(E, [pattack(1, 0), pmove(1, 0)]);
    options.add_button(S, [pattack(0, 1), pmove(0, 1)]);
    options.add_button(W, [pattack(-1, 0), pmove(-1, 0)]);
    return{
        name: card_names.combat_orthogonal,
        pic: `${IMG_FOLDER.cards}combat_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function dash_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pmove(1, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, -0)]);
    return{
        name: card_names.dash_ne,
        pic: `${IMG_FOLDER.cards}dash_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function dash_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-1, -1), pmove(-1, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1)]);
    options.add_button(E, [pmove(1, 0), pmove(1, -0)]);
    return{
        name: card_names.dash_nw,
        pic: `${IMG_FOLDER.cards}dash_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function diamond_attack(){
    var options = new ButtonGrid();
    options.add_button(C, [pattack(0, -1), pattack(1, 0), pattack(0, 1), pattack(-1, 0)]);
    options.add_button(SE, [pmove(2, 1)]);
    options.add_button(SW, [pmove(-2, 1)]);
    return{
        name: card_names.diamond_attack,
        pic: `${IMG_FOLDER.cards}diamond_attack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function diamond_slice(){
    var options = new ButtonGrid();
    var spin = [
        pattack(1, 1),
        pattack(2, 0),
        pattack(1, -1),
        pattack(0, 2),
        pattack(0, -2),
        pattack(-1, 1),
        pattack(-2, 0),
        pattack(-1, -1)
    ];
    options.add_button(C, spin);
    return{
        name: card_names.diamond_slice,
        pic: `${IMG_FOLDER.cards}diamond_slice.png`,
        options
    }
}
/** @type {CardGenerator}*/
function explosion(){
    var area = [];
    var radius = 2;
    for(var i = -1 * radius; i <= radius; ++i){
        for(var j = -1 * radius; j <= radius; ++j){
            area.push(pattack(i, j));
        }
    }
    var options = new ButtonGrid();
    options.add_button(C, area, 5);
    return{
        name: card_names.explosion,
        pic: `${IMG_FOLDER.cards}explosion.png`,
        options
    }
}
/** @type {CardGenerator}*/
function flanking_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(0, 1), pattack(-1, 0), pmove(1, -1), pattack(0, 1), pattack(-1, 0)]);
    options.add_button(NW, [pmove(-1, -1), pattack(0, 1), pattack(1, 0), pmove(-1, -1), pattack(0, 1), pattack(1, 0)]);
    return{
        name: card_names.flanking_diagonal,
        pic: `${IMG_FOLDER.cards}flanking_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function flanking_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pattack(0, 1), pattack(0, -1), pmove(1, 0), pattack(0, 1), pattack(0, -1)]);
    options.add_button(W, [pmove(-1, 0), pattack(0, 1), pattack(0, -1), pmove(-1, 0), pattack(0, 1), pattack(0, -1)]);
    return{
        name: card_names.flanking_horizontal,
        pic: `${IMG_FOLDER.cards}flanking_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function flanking_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(1, 0), pattack(-1, 0), pmove(0, -1), pattack(1, 0), pattack(-1, 0)]);
    options.add_button(S, [pmove(0, 1), pattack(1, 0), pattack(-1, 0), pmove(0, 1), pattack(1, 0), pattack(-1, 0)]);
    return{
        name: card_names.flanking_vertical,
        pic: `${IMG_FOLDER.cards}flanking_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function force_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pattack(1, 0), pmove(1, 0), pattack(1, 0), pmove(1, 0)]);
    options.add_button(W, [pattack(-1, 0), pmove(-1, 0), pattack(-1, 0), pmove(-1, 0)]);
    return{
        name: card_names.force_horizontal,
        pic: `${IMG_FOLDER.cards}force_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function force_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pmove(0, -1), pattack(0, -1), pmove(0, -1)]);
    options.add_button(S, [pattack(0, 1), pmove(0, 1), pattack(0, 1), pmove(0, 1)]);
    return{
        name: card_names.force_vertical,
        pic: `${IMG_FOLDER.cards}force_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function fork(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(-1, -1), pattack(1, -2), pattack(-1, -2)]);
    options.add_button(E, [pattack(1, 1), pattack(1, -1), pattack(2, 1), pattack(2, -1)]);
    options.add_button(S, [pattack(1, 1), pattack(-1, 1), pattack(1, 2), pattack(-1, 2)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, -1), pattack(-2, 1), pattack(-2, -1)]);
    return{
        name: card_names.fork,
        pic: `${IMG_FOLDER.cards}fork.png`,
        options
    }
}
/** @type {CardGenerator}*/
function hit_and_run(){
    var options = new ButtonGrid();
    options.add_button(S, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), pattack(1, 0), pattack(-1, 0), pmove(0, 1)]);
    return{
        name: card_names.hit_and_run,
        pic: `${IMG_FOLDER.cards}hit_and_run.png`,
        options
    }
}
/** @type {CardGenerator}*/
function horsemanship(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -1)]);
    options.add_button(SE, [pmove(2, 1)]);
    options.add_button(SW, [pmove(-2, 1)]);
    options.add_button(NW, [pmove(-2, -1)]);
    return{
        name: card_names.horsemanship,
        pic: `${IMG_FOLDER.cards}horsemanship.png`,
        options
    }
}
/** @type {CardGenerator}*/
function jab_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1), pattack(2, -2), pattack(1, -1), pattack(2, -2)]);
    options.add_button(SE, [pattack(1, 1), pattack(2, 2), pattack(1, 1), pattack(2, 2)]);
    options.add_button(SW, [pattack(-1, 1), pattack(-2, 2), pattack(-1, 1), pattack(-2, 2)]);
    options.add_button(NW, [pattack(-1, -1), pattack(-2, -2), pattack(-1, -1), pattack(-2, -2)]);
    return{
        name: card_names.jab_diagonal,
        pic: `${IMG_FOLDER.cards}jab_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function jab_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -2), pattack(0, -1), pattack(0, -2)]);
    options.add_button(E, [pattack(1, 0), pattack(2, 0), pattack(1, 0), pattack(2, 0)]);
    options.add_button(S, [pattack(0, 1), pattack(0, 2), pattack(0, 1), pattack(0, 2)]);
    options.add_button(W, [pattack(-1, 0), pattack(-2, 0), pattack(-1, 0), pattack(-2, 0)]);
    return{
        name: card_names.jab_orthogonal,
        pic: `${IMG_FOLDER.cards}jab_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function jump(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -2)]);
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(S, [pmove(0, 2)]);
    options.add_button(W, [pmove(-2, 0)]);
    return{
        name: card_names.jump,
        pic: `${IMG_FOLDER.cards}jump.png`,
        options
    }
}
/** @type {CardGenerator}*/
function leap_left(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-2, -2)]);
    options.add_button(W, [pmove(-2, 0)]);
    options.add_button(SW, [pmove(-2, 2)]);

    return{
        name: card_names.leap_left,
        pic: `${IMG_FOLDER.cards}leap_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function leap_right(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(SE, [pmove(2, 2)]);
    return{
        name: card_names.leap_right,
        pic: `${IMG_FOLDER.cards}leap_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lunge_left(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1), pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(NW, [pmove(-1, -1), pmove(-1, -1), pattack(-1, -1)]);
    return{
        name: card_names.lunge_left,
        pic: `${IMG_FOLDER.cards}lunge_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lunge_right(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1), pmove(-1, 1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    options.add_button(NE, [pmove(1, -1), pmove(1, -1), pattack(1, -1)]);
    return{
        name: card_names.lunge_right,
        pic: `${IMG_FOLDER.cards}lunge_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function overcome_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(1, -1), pmove(2, 0)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-1, -1), pmove(-2, 0)]);
    return{
        name: card_names.overcome_horizontal,
        pic: `${IMG_FOLDER.cards}overcome_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function overcome_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), pmove(0, -2)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(-1, 1), pmove(0, 2)]);
    return{
        name: card_names.overcome_vertical,
        pic: `${IMG_FOLDER.cards}overcome_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function pike(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -2), pattack(1, -3), pattack(0, -3), pattack(-1, -3)]);
    options.add_button(E, [pattack(2, 0), pattack(3, 1), pattack(3, 0), pattack(3, -1)]);
    options.add_button(W, [pattack(-2, 0), pattack(-3, 1), pattack(-3, 0), pattack(-3, -1)]);
    options.add_button(S, [pattack(0, 2), pattack(1, 3), pattack(0, 3), pattack(-1, 3)]);

    return{
        name: card_names.pike,
        pic: `${IMG_FOLDER.cards}pike.png`,
        options
    }
}
/** @type {CardGenerator}*/
function push_back(){
    var options = new ButtonGrid();
    options.add_button(C, [pattack(1, 0), pattack(-1, 0)]);
    options.add_button(SE, [pattack(-1, -1), pmove(1, 1)]);
    options.add_button(S, [pattack(0, -1), pmove(0, 1)]);
    options.add_button(SW, [pattack(1, -1), pmove(-1, 1)]);
    return{
        name: card_names.push_back,
        pic: `${IMG_FOLDER.cards}push_back.png`,
        options
    }
}
/** @type {CardGenerator}*/
function short_charge_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(1, -1)]);
    options.add_button(SE, [pmove(1, 1), pattack(1, 1)]);
    options.add_button(SW, [pmove(-1, 1), pattack(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1), pattack(-1, -1)]);
    return{
        name: card_names.short_charge_diagonal,
        pic: `${IMG_FOLDER.cards}short_charge_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function short_charge_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(0, -1)]);
    options.add_button(E, [pmove(1, 0), pattack(1, 0)]);
    options.add_button(S, [pmove(0, 1), pattack(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0)]);
    return{
        name: card_names.short_charge_orthogonal,
        pic: `${IMG_FOLDER.cards}short_charge_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slash_step_forwards(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(0, -1), pattack(1, -1), pattack(-1, -1), pattack(1, 0), pattack(-1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: card_names.slash_step_forwards,
        pic: `${IMG_FOLDER.cards}slash_step_forwards.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slash_step_left(){
    var options = new ButtonGrid();
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0), pattack(-1, 1), pattack(-1, -1), pattack(0, 1), 
                           pattack(0, -1), pattack(1, 1), pattack(1, -1),]);
    return{
        name: card_names.slash_step_left,
        pic: `${IMG_FOLDER.cards}slash_step_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slash_step_right(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pattack(1, 0), pattack(1, 1), pattack(1, -1), pattack(0, 1), 
                           pattack(0, -1), pattack(-1, 1), pattack(-1, -1)]);
    return{
        name: card_names.slash_step_right,
        pic: `${IMG_FOLDER.cards}slash_step_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slice_twice(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(1, -1), pattack(0, -1), pattack(0, -1), pattack(-1, -1), pattack(-1, -1)]);
    options.add_button(SE, [pattack(1, 1), pattack(1, 1)]);
    options.add_button(SW, [pattack(-1, 1), pattack(-1, 1)]);
    return{
        name: card_names.slice_twice,
        pic: `${IMG_FOLDER.cards}slice_twice.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slip_through_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pattack(0, 1), pattack(1, 0), pmove(1, 1)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pattack(0, -1), pattack(-1, 0), pmove(-1, -1)]);
    return{
        name: card_names.slip_through_ne,
        pic: `${IMG_FOLDER.cards}slip_through_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function slip_through_nw(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(0, -1), pattack(1, 0), pmove(1, -1)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pattack(0, 1), pattack(-1, 0), pmove(-1, 1)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: card_names.slip_through_nw,
        pic: `${IMG_FOLDER.cards}slip_through_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function spearhead(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(1, -1), pattack(1, 0), pattack(0, -1)]);
    options.add_button(NW, [pmove(-1, -1), pattack(-1, -1), pattack(-1, 0), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: card_names.spearhead,
        pic: `${IMG_FOLDER.cards}spearhead.png`,
        options
    }
}
/** @type {CardGenerator}*/
function spin_attack(){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(C, spin);
    return{
        name: card_names.spin_attack,
        pic: `${IMG_FOLDER.cards}spin_attack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sprint_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pmove(1, 0), pmove(1, 0)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0), pmove(-1, 0)]);
    return{
        name: card_names.sprint_horizontal,
        pic: `${IMG_FOLDER.cards}sprint_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sprint_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1), pmove(0, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    return{
        name: card_names.sprint_vertical,
        pic: `${IMG_FOLDER.cards}sprint_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function step_left(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0)]);
    options.add_button(NW, [pmove(-1, -1)]);
    options.add_button(E, [pattack(2, 0), pmove(2, 0)]);
    return{
        name: card_names.step_left,
        pic: `${IMG_FOLDER.cards}step_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function step_right(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(E, [pmove(1, 0), pmove(1, 0)]);
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(W, [pattack(-2, 0), pmove(-2, 0)]);
    return{
        name: card_names.step_right,
        pic: `${IMG_FOLDER.cards}step_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_leap_horizontal(){
    var spin = ALL_DIRECTIONS.map(p => pstun(p.x, p.y));
    var options = new ButtonGrid();
    options.add_button(E, [pmove(2, 0), ...spin]);
    options.add_button(W, [pmove(-2, 0), ...spin]);
    return{
        name: card_names.stunning_leap_horizontal,
        pic: `${IMG_FOLDER.cards}stunning_leap_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_leap_vertical(){
    var spin = ALL_DIRECTIONS.map(p => pstun(p.x, p.y));
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -2), ...spin]);
    options.add_button(S, [pmove(0, 2), ...spin]);
    return{
        name: card_names.stunning_leap_vertical,
        pic: `${IMG_FOLDER.cards}stunning_leap_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_retreat(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, -1), pstun(1, -1), pstun(-1, -1), pstun(1, 0), pstun(-1, 0),]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: card_names.stunning_retreat,
        pic: `${IMG_FOLDER.cards}stunning_retreat.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_slice(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(1, -1), pattack(1, -1), pstun(0, -1), pattack(0, -1), pstun(-1, -1), pattack(-1, -1)]);
    options.add_button(E, [pstun(1, 1), pattack(1, 1), pstun(1, 0), pattack(1, 0), pstun(1, -1), pattack(1, -1)]);
    options.add_button(S, [pstun(1, 1), pattack(1, 1), pstun(0, 1), pattack(0, 1), pstun(-1, 1), pattack(-1, 1)]);
    options.add_button(W, [pstun(-1, 1), pattack(-1, 1), pstun(-1, 0), pattack(-1, 0), pstun(-1, -1), pattack(-1, -1)]);
    return{
        name: card_names.stunning_slice,
        pic: `${IMG_FOLDER.cards}stunning_slice.png`,
        options
    }
}
/** @type {CardGenerator}*/
function thwack(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -1), pattack(0, -1)]);
    options.add_button(S, [pattack(0, 1), pattack(0, 1), pattack(0, 1)]);
    return{
        name: card_names.thwack,
        pic: `${IMG_FOLDER.cards}thwack.png`,
        options
    }
}
/** @type {CardGenerator}*/
function trample(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -2), pmove(1, -2)]);
    options.add_button(NW, [pattack(-1, -2), pmove(-1, -2)]);
    options.add_button(S, [pattack(0, 2), pmove(0, 2)]);
    return{
        name: card_names.trample,
        pic: `${IMG_FOLDER.cards}trample.png`,
        options
    }
}
/** @type {CardGenerator}*/
function trident(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -2), pattack(0, -2), pattack(-1, -2)]);
    options.add_button(E, [pattack(2, 1), pattack(2, 0), pattack(2, -1)]);
    options.add_button(W, [pattack(-2, 1), pattack(-2, 0), pattack(-2, -1)]);
    options.add_button(S, [pattack(1, 2), pattack(0, 2), pattack(-1, 2)]);
    return{
        name: card_names.trident,
        pic: `${IMG_FOLDER.cards}trident.png`,
        options
    }
}
/** @type {CardGenerator}*/
function t_strike_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(2, 0), pattack(1, -1)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-2, 0), pattack(-1, -1)]);
    return{
        name: card_names.t_strike_horizontal,
        pic: `${IMG_FOLDER.cards}t_strike_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function t_strike_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(0, -2), pattack(-1, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(0, 2), pattack(-1, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: card_names.t_strike_vertical,
        pic: `${IMG_FOLDER.cards}t_strike_vertical.png`,
        options
    }
}
/** @type {CardGenerator}*/
function y_leap(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    options.add_button(S, [pmove(0, 2)]);
    return{
        name: card_names.y_leap,
        pic: `${IMG_FOLDER.cards}y_leap.png`,
        options
    }
}
/** @type {CardGenerator}*/
function y_strike_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, 0), pattack(1, -1), pattack(2, -2), pattack(0, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pattack(-1, 0), pattack(-1, 1), pattack(-2, 2), pattack(0, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: card_names.y_strike_ne,
        pic: `${IMG_FOLDER.cards}y_strike_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function y_strike_nw(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pattack(1, 0), pattack(1, 1), pattack(2, 2), pattack(0, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pattack(-1, 0), pattack(-1, -1), pattack(-2, -2), pattack(0, -1)]);
    return{
        name: card_names.y_strike_nw,
        pic: `${IMG_FOLDER.cards}y_strike_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function freeze_up(){
    var options = new ButtonGrid();
    options.add_button(C, [], 5);
    return{
        name: card_names.freeze_up,
        pic: `${IMG_FOLDER.cards}freeze_up.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lash_out(){
    var options = new ButtonGrid();
    var spin = [
        pattack(1, 1),
        pattack(1, 0),
        pattack(1, -1),
        pattack(0, 1),
        pattack(0, 0),
        pattack(0, -1),
        pattack(-1, 1),
        pattack(-1, 0),
        pattack(-1, -1)
    ];
    options.add_button(C, spin, 5);
    return{
        name: card_names.lash_out,
        pic: `${IMG_FOLDER.cards}lash_out.png`,
        options
    }
}
/** @type {CardGenerator}*/
function lightheaded(){
    var options = new ButtonGrid();
    options.add_button(C, [pstun(0, 0), pstun(0, 0)], 5);
    options.make_instant();
    return{
        name: card_names.lightheaded,
        pic: `${IMG_FOLDER.cards}lightheaded.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_e(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0)]);
    return{
        name: card_names.stumble_e,
        pic: `${IMG_FOLDER.cards}stumble_e.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_n(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    return{
        name: card_names.stumble_n,
        pic: `${IMG_FOLDER.cards}stumble_n.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    return{
        name: card_names.stumble_ne,
        pic: `${IMG_FOLDER.cards}stumble_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: card_names.stumble_nw,
        pic: `${IMG_FOLDER.cards}stumble_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_s(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: card_names.stumble_s,
        pic: `${IMG_FOLDER.cards}stumble_s.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    return{
        name: card_names.stumble_se,
        pic: `${IMG_FOLDER.cards}stumble_se.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: card_names.stumble_sw,
        pic: `${IMG_FOLDER.cards}stumble_sw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stumble_w(){
    var options = new ButtonGrid();
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: card_names.stumble_w,
        pic: `${IMG_FOLDER.cards}stumble_w.png`,
        options
    }
}
/** @type {CardGenerator}*/
function punch_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1)]);
    options.add_button(SE, [pattack(1, 1)]);
    options.add_button(SW, [pattack(-1, 1)]);
    options.add_button(NW, [pattack(-1, -1)]);
    options.make_instant();
    return{
        name: card_names.punch_diagonal,
        pic: `${IMG_FOLDER.cards}punch_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function punch_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1)]);
    options.add_button(E, [pattack(1, 0)]);
    options.add_button(S, [pattack(0, 1)]);
    options.add_button(W, [pattack(-1, 0)]);
    options.make_instant();
    return{
        name: card_names.punch_orthogonal,
        pic: `${IMG_FOLDER.cards}punch_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_attack_left(){
    var options = new ButtonGrid();
    options.add_button(W, [pstun(0, 0), pattack(0, 1), pattack(0, 1), pattack(0, -1), pattack(0, -1),
        pattack(-1, 0), pattack(-1, 0), pattack(-1, 1), pattack(-1, 1), pattack(-1, -1), pattack(-1, -1)]);
    return{
        name: card_names.reckless_attack_left,
        pic: `${IMG_FOLDER.cards}reckless_attack_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_attack_right(){
    var options = new ButtonGrid();
    options.add_button(E, [pstun(0, 0), pattack(0, 1), pattack(0, 1), pattack(0, -1), pattack(0, -1),
        pattack(1, 0), pattack(1, 0), pattack(1, 1), pattack(1, 1), pattack(1, -1), pattack(1, -1)]);
    return{
        name: card_names.reckless_attack_right,
        pic: `${IMG_FOLDER.cards}reckless_attack_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_leap_forwards (){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(N, [pstun(0, 0), pmove(0, -2), ...spin]);
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: card_names.reckless_leap_forwards,
        pic: `${IMG_FOLDER.cards}reckless_leap_forwards.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_leap_left(){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(W, [pstun(0, 0), pmove(-2, 0), ...spin]);
    options.add_button(E, [pmove(1, 0)]);
    return{
        name: card_names.reckless_leap_left,
        pic: `${IMG_FOLDER.cards}reckless_leap_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_leap_right(){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(E, [pstun(0, 0), pmove(2, 0), ...spin]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: card_names.reckless_leap_right,
        pic: `${IMG_FOLDER.cards}reckless_leap_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_sidestep_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pstun(0, 0), pmove(1, -1)]);
    options.add_button(SE, [pstun(0, 0), pmove(1, 1)]);
    options.add_button(SW, [pstun(0, 0), pmove(-1, 1)]);
    options.add_button(NW, [pstun(0, 0), pmove(-1, -1)]);
    options.make_instant();
    return{
        name: card_names.reckless_sidestep_diagonal,
        pic: `${IMG_FOLDER.cards}reckless_sidestep_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_sidestep_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, 0), pmove(0, -1)]);
    options.add_button(E, [pstun(0, 0), pmove(1, 0)]);
    options.add_button(S, [pstun(0, 0), pmove(0, 1)]);
    options.add_button(W, [pstun(0, 0), pmove(-1, 0)]);
    options.make_instant();
    return{
        name: card_names.reckless_sidestep_orthogonal,
        pic: `${IMG_FOLDER.cards}reckless_sidestep_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_spin(){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(C, [pstun(0, 0), pstun(0, 0), ...spin, ...spin]);
    return{
        name: card_names.reckless_spin,
        pic: `${IMG_FOLDER.cards}reckless_spin.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_sprint(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, 0), pstun(0, 0), pmove(0, -1), pmove(0, -1), pmove(0, -1)]);
    options.add_button(E, [pstun(0, 0), pstun(0, 0), pmove(1, 0), pmove(1, 0), pmove(1, 0)]);
    options.add_button(S, [pstun(0, 0), pstun(0, 0), pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    options.add_button(W, [pstun(0, 0), pstun(0, 0), pmove(-1, 0), pmove(-1, 0), pmove(-1, 0)]);
    return{
        name: card_names.reckless_sprint,
        pic: `${IMG_FOLDER.cards}reckless_sprint.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pstun(0, 0), pstun(0, 0), pteleport(0, 0)]);
    options.make_instant();
    return{
        name: card_names.reckless_teleport,
        pic: `${IMG_FOLDER.cards}reckless_teleport.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_e(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0)]);
    options.make_instant();
    return{
        name: card_names.sidestep_e,
        pic: `${IMG_FOLDER.cards}sidestep_e.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_n(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.make_instant();
    return{
        name: card_names.sidestep_n,
        pic: `${IMG_FOLDER.cards}sidestep_n.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.make_instant();
    return{
        name: card_names.sidestep_ne,
        pic: `${IMG_FOLDER.cards}sidestep_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-1, -1)]);
    options.make_instant();
    return{
        name: card_names.sidestep_nw,
        pic: `${IMG_FOLDER.cards}sidestep_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_s(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1)]);
    options.make_instant();
    return{
        name: card_names.sidestep_s,
        pic: `${IMG_FOLDER.cards}sidestep_s.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    options.make_instant();
    return{
        name: card_names.sidestep_se,
        pic: `${IMG_FOLDER.cards}sidestep_se.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    options.make_instant();
    return{
        name: card_names.sidestep_sw,
        pic: `${IMG_FOLDER.cards}sidestep_sw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_w(){
    var options = new ButtonGrid();
    options.add_button(W, [pmove(-1, 0)]);
    options.make_instant();
    return{
        name: card_names.sidestep_w,
        pic: `${IMG_FOLDER.cards}sidestep_w.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_punch_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pstun(1, -1), pstun(1, -1)]);
    options.add_button(SE, [pstun(1, 1), pstun(1, 1)]);
    options.add_button(SW, [pstun(-1, 1), pstun(-1, 1)]);
    options.add_button(NW, [pstun(-1, -1), pstun(-1, -1)]);
    options.make_instant();
    return{
        name: card_names.stunning_punch_diagonal,
        pic: `${IMG_FOLDER.cards}stunning_punch_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_punch_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, -1), pstun(0, -1)]);
    options.add_button(E, [pstun(1, 0), pstun(1, 0)]);
    options.add_button(S, [pstun(0, 1), pstun(0, 1)]);
    options.add_button(W, [pstun(-1, 0), pstun(-1, 0)]);
    options.make_instant();
    return{
        name: card_names.stunning_punch_orthogonal,
        pic: `${IMG_FOLDER.cards}stunning_punch_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_tread_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pstun(1, -1), pstun(1, -1), pstun(1, -1), pmove(1, -1)]);
    options.add_button(SE, [pstun(1, 1), pstun(1, 1), pstun(1, 1), pmove(1, 1)]);
    options.add_button(SW, [pstun(-1, 1), pstun(-1, 1), pstun(-1, 1), pmove(-1, 1)]);
    options.add_button(NW, [pstun(-1, -1), pstun(-1, -1), pstun(-1, -1), pmove(-1, -1)]);
    return{
        name: card_names.stunning_tread_diagonal,
        pic: `${IMG_FOLDER.cards}stunning_tread_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_tread_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, -1), pstun(0, -1), pstun(0, -1), pmove(0, -1)]);
    options.add_button(E, [pstun(1, 0), pstun(1, 0), pstun(1, 0), pmove(1, 0)]);
    options.add_button(S, [pstun(0, 1), pstun(0, 1), pstun(0, 1), pmove(0, 1)]);
    options.add_button(W, [pstun(-1, 0), pstun(-1, 0), pstun(-1, 0), pmove(-1, 0)]);
    return{
        name: card_names.stunning_tread_orthogonal,
        pic: `${IMG_FOLDER.cards}stunning_tread_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pteleport(0, 0)]);
    return{
        name: card_names.teleport,
        pic: `${IMG_FOLDER.cards}teleport.png`,
        options
    }
}
/** @type {CardGenerator} Shown in shop to denote adding a card to your deck.*/
function symbol_add_card(){
    return{
        name: card_names.symbol_add_card,
        pic: `${IMG_FOLDER.other}plus.png`,
        options: new ButtonGrid(),
    }
}
/** @type {CardGenerator} Shown in shop ind=stead of the remove symbol when your deck is at the minimum size.*/
function symbol_deck_at_minimum(){
    return{
        name: card_names.symbol_deck_at_minimum,
        pic: `${IMG_FOLDER.other}x.png`,
        options: new ButtonGrid(),
    }
}
/** @type {CardGenerator} Shown in the journal for cards you have not yet unlocked.*/
function symbol_locked_card(){
    return{
        name: card_names.symbol_locked,
        pic: `${IMG_FOLDER.other}locked.png`,
        options: new ButtonGrid(),
    }
}
/** @type {CardGenerator} Shown in the journal for cards you have not yet added to your deck.*/
function symbol_not_encountered_card(){
    return{
        name: card_names.symbol_not_encountered_card,
        pic: `${IMG_FOLDER.other}not_encountered.png`,
        options: new ButtonGrid(),
    }
}
/** @type {CardGenerator} Shown in show to denote removing a card from your deck.*/
function symbol_remove_card(){
    return{
        name: card_names.symbol_remove_card,
        pic: `${IMG_FOLDER.other}minus.png`,
        options: new ButtonGrid(),
    }
}
const ACHIEVEMENT_CARDS = {
    velociphile: [
        punch_orthogonal, 
        punch_diagonal, 
        sidestep_e, 
        sidestep_n, 
        sidestep_ne, 
        sidestep_nw, 
        sidestep_s, 
        sidestep_se, 
        sidestep_sw, 
        sidestep_w, 
        teleport,
    ],
    spider_queen: [
        stunning_leap_vertical, 
        stunning_leap_horizontal, 
        stunning_punch_diagonal, 
        stunning_punch_orthogonal, 
        stunning_retreat, 
        stunning_slice, 
        stunning_tread_diagonal, 
        stunning_tread_orthogonal, 
    ],
    two_headed_serpent: [
        reckless_attack_left, 
        reckless_attack_right, 
        reckless_leap_forwards, 
        reckless_leap_left, 
        reckless_leap_right, 
        reckless_sidestep_diagonal, 
        reckless_sidestep_orthogonal, 
        reckless_spin,
        reckless_sprint, 
        reckless_teleport, 
    ],
}
Object.freeze(ACHIEVEMENT_CARDS);

function get_achievement_cards(){
    var list = [];
    GS.data.achievements.completed().map((a) => {
        if(a.cards !== undefined){
            list.push(...a.cards);
        }
    });
    return list;
}
function get_locked_achievement_cards(){
    var list = [];
    GS.data.achievements.all().map((a) => {
        if(a.cards !== undefined && !a.has){
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
const BASIC_CARDS = [
    basic_diagonal, 
    basic_orthogonal, 
    basic_slice
];
const BOON_CARDS = [
    // Movements
    lost_maneuver,
    back_stab_1, back_stab_2,
    blink_1, blink_2,
    maneuver_1, maneuver_2, maneuver_3,
    // Attacks
    lost_technique,
    execution_1, execution_2, execution_3,
    split_second_1, split_second_2,
    superweapon_1, superweapon_2,
];
const BOSS_CARDS = {
    arcane_sentry: [
        beam_ne, 
        beam_nw, 
        beam_se, 
        beam_sw, 
        saw_strike
    ],
    forest_heart: [
        branch_strike, 
        snack, 
        vine_snare
    ],
    lich: [
        beam_diagonal, 
        beam_orthogonal, 
        debilitating_confusion, 
        instant_teleport
    ],
    spider_queen: [
        bite, 
        chomp, 
        skitter
    ],
    two_headed_serpent: [
        fangs, 
        regenerate, 
        slither
    ],
    velociphile: [
        roll_horizontal, 
        roll_ne, 
        roll_nw
    ],
    young_dragon: [
        firebreathing_horizontal, 
        firebreathing_ne, 
        firebreathing_nw, 
        firebreathing_vertical, 
        glide, 
        soar
    ],
}
Object.freeze(BOSS_CARDS);

function get_boss_cards(){
    // List of all boss cards in order encountered.
    return [
        ...BOSS_CARDS.velociphile,
        ...BOSS_CARDS.spider_queen,
        ...BOSS_CARDS.two_headed_serpent,
        ...BOSS_CARDS.lich,
        ...BOSS_CARDS.young_dragon,
        ...BOSS_CARDS.forest_heart,
        ...BOSS_CARDS.arcane_sentry,
    ];
}
const COMMON_CARDS = [
    advance, bounding_retreat, breakthrough_horizontal, breakthrough_vertical, butterfly, 
    charge_horizontal, charge_vertical, clear_behind, clear_in_front, combat_diagonal, 
    combat_orthogonal, dash_ne, dash_nw, diamond_attack, diamond_slice, 
    explosion, force_horizontal, force_vertical, fork, flanking_diagonal, flanking_horizontal, 
    flanking_vertical, hit_and_run, horsemanship, jab_diagonal, jab_orthogonal, 
    jump, leap_left, leap_right, lunge_left, lunge_right, 
    overcome_horizontal, overcome_vertical, pike, push_back, short_charge_orthogonal, 
    short_charge_diagonal, slash_step_forwards, slash_step_left, slash_step_right, slice_twice, 
    slip_through_ne, slip_through_nw, spearhead, spin_attack, sprint_horizontal, 
    sprint_vertical, step_left, step_right, t_strike_horizontal, t_strike_vertical, 
    thwack, trample, trident, y_leap, y_strike_ne, y_strike_nw,
];
const CONFUSION_CARDS = [
    freeze_up, 
    lash_out, 
    lightheaded, 
    stumble_e, 
    stumble_n, 
    stumble_ne, 
    stumble_nw, 
    stumble_s, 
    stumble_se, 
    stumble_sw, 
    stumble_w, 
];
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
 * @property {boolean} basic If it is a basic card.
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
    var vertical = [usymbol.up, undefined, usymbol.down][direction.y + 1];
    var horizontal = [usymbol.left, undefined, usymbol.right][direction.x + 1];
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
        teleport: [],
    }
    if(behavior === undefined){
        return telegraphs;
    }
    var repeat = repeat_amount();
    for(var i = 0; i < repeat; ++i){
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
                    else if(GS.boons.has(boon_names.spiked_shoes)){
                        telegraphs.attacks.push(next_position);
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
                    else if(GS.boons.has(boon_names.spiked_shoes)){
                        telegraphs.attacks.push(next_position);
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
    }
    if(GS.boons.has(boon_names.pacifism)){
        telegraphs.stun = [...telegraphs.stun, ...telegraphs.attacks];
        telegraphs.attacks = [];
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

function filter_new_cards(cards){
    return cards.filter((c) => {
        return !GS.data.cards.has(c.name);
    });
}
const BOON_LIST = [
    ancient_card, ancient_card_2, bitter_determination, blood_alchemy, boss_slayer, 
    brag_and_boast, chilly_presence, choose_your_path, clean_mind, creative, 
    dazing_blows, duplicate, empty_rooms, escape_artist, expend_vitality, 
    flame_strike, flame_worship, fleeting_thoughts, fortitude, frenzy, 
    frugivore, future_sight, gruntwork, hoarder, larger_chests, 
    limitless, manic_presence, pacifism, pain_reflexes, perfect_the_basics, 
    picky_shopper, practice_makes_perfect, pressure_points, quick_healing, rebirth, 
    repetition, retaliate, rift_touched, roar_of_challenge, safe_passage, 
    shattered_glass, skill_trading, slime_trail, sniper, spiked_shoes, 
    spontaneous, stable_mind, stealthy, stubborn, thick_soles, 
    vicious_cycle
];

function change_max_health(amount){
    if(GS.map.get_player().max_health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    GS.map.get_player().max_health += amount;
    GS.map.get_player().health = Math.min(GS.map.get_player().max_health, GS.map.get_player().health);
}

function max_health_at_least(amount){
    var max_health = GS.map.get_player().max_health;
    return max_health !== undefined && max_health > amount;
}

function get_locked_boons(){
    var list = [];
    GS.data.achievements.all().map((a) => {
        if(a.boons!== undefined && !a.has){
            list.push(...a.boons);
        }
    });
    return list;
}

function filter_new_boons(boons){
    return boons.filter((b) => {
        return !GS.data.boons.has(b.name);
    });
}
function symbol_locked_boon(){
    return {
        name: boon_names.locked,
        pic: `${IMG_FOLDER.other}locked.png`,
        description: boon_descriptions.locked,
    }
}
function symbol_not_encountered_boon(){
    return {
        name: boon_names.not_encountered,
        pic: `${IMG_FOLDER.other}not_encountered.png`,
        description: boon_descriptions.not_encountered,
    }
}
function ancient_card(){
    return {
        name: boon_names.ancient_card,
        pic: `${IMG_FOLDER.cards}lost_technique.png`,
        description: chest_text.add_card,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: pick_ancient_card,
    }
}

function pick_ancient_card(){
    GS.deck.add(lost_technique());
}

function ancient_card_2(){
    return {
        name: boon_names.ancient_card,
        pic: `${IMG_FOLDER.cards}lost_maneuver.png`,
        description: chest_text.add_card,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: pick_ancient_card_2,
    }
}

function pick_ancient_card_2(){
    GS.deck.add(lost_maneuver());
}
function bitter_determination(){
    return {
        name: boon_names.bitter_determination,
        pic: `${IMG_FOLDER.boons}bitter_determination.png`,
        description: boon_descriptions.bitter_determination,
        prereq_description: boon_prereq_descriptions.none,
    }
}
function blood_alchemy(){
    return {
        name: boon_names.blood_alchemy,
        pic: `${IMG_FOLDER.boons}blood_alchemy.png`,
        description: boon_descriptions.blood_alchemy,
        prereq_description: boon_prereq_descriptions.blood_alchemy,
        prereq: prereq_blood_alchemy,
        on_pick: pick_blood_alchemy,
    }
}

function prereq_blood_alchemy(){
    var player = GS.map.get_player();
    return player.max_health !== undefined && player.health > 2;
}

function pick_blood_alchemy(){
    change_max_health(2);
    for(var i = 0; i < 2; ++i){
        var location = GS.map.get_player_location();
        GS.map.attack(location);
    }
}
function boss_slayer(){
    return {
        name: boon_names.boss_slayer,
        pic: `${IMG_FOLDER.boons}boss_slayer.png`,
        description: boon_descriptions.boss_slayer,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function brag_and_boast(){
    return {
        name: boon_names.brag_and_boast,
        pic: `${IMG_FOLDER.boons}brag_and_boast.png`,
        description: boon_descriptions.brag_and_boast,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: pick_brag_and_boast,
    }
}

function pick_brag_and_boast(){
    for(var i = 0; i < 2; ++i){
        var boss = random_from(BOSS_LIST)();
        var card = random_from(boss.card_drops)();
        GS.deck.add(card);
        card = random_from(CONFUSION_CARDS)();
        GS.deck.add(card);
    }
}
function chilly_presence(){
    return {
        name: boon_names.chilly_presence,
        pic: `${IMG_FOLDER.boons}chilly_presence.png`,
        description: boon_descriptions.chilly_presence,
        prereq_description: boon_prereq_descriptions.none,
        max: 4
    }
}

function proc_chilly_presence(tile){
    if(
        !tile.tags.has(TAGS.boss) && 
        chance(GS.boons.has(boon_names.chilly_presence), 6)
    ){
        stun(tile);
    }
}
function choose_your_path(){
    return {
        name: boon_names.choose_your_path,
        pic: `${IMG_FOLDER.boons}choose_your_path.png`,
        description: boon_descriptions.choose_your_path,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function clean_mind(){
    return {
        name: boon_names.clean_mind,
        pic: `${IMG_FOLDER.boons}clean_mind.png`,
        description: boon_descriptions.clean_mind,
        prereq_description: boon_prereq_descriptions.clean_mind,
        prereq_clean_mind,
        after_pick: pick_clean_mind,
    }
}

function prereq_clean_mind(){
    // Since you are removing 2 cards, you need to have at least 2 cards above the minimum.
    return GS.deck.deck_size() >= GS.deck.deck_min() + 2;
}

function pick_clean_mind(){
    display_deck_to_remove(2);
    GAME_SCREEN_DIVISIONS.swap(UIIDS.deck_select);
}
function creative(){
    return {
        name: boon_names.creative,
        pic: `${IMG_FOLDER.boons}creative.png`,
        description: boon_descriptions.creative,
        prereq_description: boon_prereq_descriptions.creative,
        prereq: prereq_creative,
        on_pick: pick_creative,
        max: 1,
    }
}

function prereq_creative(){
    return GS.deck.deck_size() >= 10;
}

function pick_creative(){
    GS.deck.alter_min(5);
    GS.deck.alter_hand_size(1);
    GS.deck.deal();
    GS.refresh_deck_display();
}
function dazing_blows(){
    return {
        name: boon_names.dazing_blows,
        pic: `${IMG_FOLDER.boons}dazing_blows.png`,
        description: boon_descriptions.dazing_blows,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function duplicate(){
    return {
        name: boon_names.duplicate,
        pic: `${IMG_FOLDER.boons}duplicate.png`,
        description: boon_descriptions.duplicate,
        prereq_description: boon_prereq_descriptions.none,
        after_pick: pick_duplicate,
    }
}

function pick_duplicate(){
    display_deck_to_duplicate();
    GAME_SCREEN_DIVISIONS.swap(UIIDS.deck_select);
}
function empty_rooms(){
    return {
        name: boon_names.empty_rooms,
        pic: `${IMG_FOLDER.boons}empty_rooms.png`,
        description: boon_descriptions.empty_rooms,
        prereq_description: boon_prereq_descriptions.none,
    }
}
function escape_artist(){
    return {
        name: boon_names.escape_artist,
        pic: `${IMG_FOLDER.boons}escape_artist.png`,
        description: boon_descriptions.escape_artist,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}

/** @type {AIFunction}*/
function escape_artist_behavior(self, target, map){
    if(self.tile.health !== undefined && self.tile.health > 0){
        teleport_spell(self, target, map);
    }
}
function expend_vitality(){
    return {
        name: boon_names.expend_vitality,
        pic: `${IMG_FOLDER.boons}expend_vitality.png`,
        description: boon_descriptions.expend_vitality,
        prereq_description: boon_prereq_descriptions.expend_vitality,
        prereq: prereq_expend_vitality,
        on_pick: pick_expend_vitality,
        max: 1,
    }
}

function prereq_expend_vitality(){
    return max_health_at_least(1);
}

function pick_expend_vitality(){
    change_max_health(-1);
}
function flame_strike(){
    return {
        name: boon_names.flame_strike,
        pic: `${IMG_FOLDER.boons}flame_strike.png`,
        description: boon_descriptions.flame_strike,
        prereq_description: boon_prereq_descriptions.none,
        max: 2,
    }
}
function flame_worship(){
    return {
        name: boon_names.flame_worship,
        pic: `${IMG_FOLDER.boons}flame_worship.png`,
        description: boon_descriptions.flame_worship,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function fleeting_thoughts(){
    return {
        name: boon_names.fleeting_thoughts,
        pic: `${IMG_FOLDER.boons}fleeting_thoughts.png`,
        description: boon_descriptions.fleeting_thoughts,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function fortitude(){
    return {
        name: boon_names.fortitude,
        pic: `${IMG_FOLDER.boons}fortitude.png`,
        description: boon_descriptions.fortitude,
        prereq_description: boon_prereq_descriptions.fortitude,
        prereq: prereq_fortitude,
        on_pick: pick_fortitude,
    }
}

function prereq_fortitude(){
    return GS.map.get_player().max_health !== undefined;
}

function pick_fortitude(){
    change_max_health(1);
    GS.map.heal(GS.map.get_player_location(), 1);
}
function frenzy(){
    return {
        name: boon_names.frenzy,
        pic: `${IMG_FOLDER.boons}frenzy.png`,
        description: boon_descriptions.frenzy,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function frugivore(){
    return {
        name: boon_names.frugivore,
        pic: `${IMG_FOLDER.boons}frugivore.png`,
        description: boon_descriptions.frugivore,
        prereq_description: boon_prereq_descriptions.none,
        max: 2,
    }
}
function future_sight(){
    return {
        name: boon_names.future_sight,
        pic: `${IMG_FOLDER.boons}future_sight.png`,
        description: boon_descriptions.future_sight,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: pick_future_sight,
        max: 1,
    }
}

function pick_future_sight(){
    display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.deck_order, function(){
        SIDEBAR_DIVISIONS.swap(UIIDS.deck_order);
    });
    SIDEBAR_DIVISIONS.swap(UIIDS.deck_order);
}
function gruntwork(){
    return {
        name: boon_names.gruntwork,
        pic: `${IMG_FOLDER.boons}gruntwork.png`,
        description: boon_descriptions.gruntwork,
        prereq_description: boon_prereq_descriptions.gruntwork,
        prereq: prereq_gruntwork,
        on_pick: pick_gruntwork,
        max: 1,
    }
}

function prereq_gruntwork(){
    return GS.map.get_player().max_health !== undefined;
}

function pick_gruntwork(){
    change_max_health(3);
    GS.deck.alter_hand_size(-1);
    GS.deck.deal();
    GS.refresh_deck_display();
}
function hoarder(){
    return {
        name: boon_names.hoarder,
        pic: `${IMG_FOLDER.boons}hoarder.png`,
        description: boon_descriptions.hoarder,
        prereq_description: boon_prereq_descriptions.hoarder,
        prereq: prereq_hoarder,
        max: 1,
    }
}

function prereq_hoarder(){
    return GS.map.get_floor_num() < 15;
}
function larger_chests(){
    return {
        name: boon_names.larger_chests,
        pic: `${IMG_FOLDER.boons}larger_chests.png`,
        description: boon_descriptions.larger_chests,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: on_pick_larger_chests,
        max: 1,
    }
}

function on_pick_larger_chests(){
    display.add_class(UIIDS.chest,`large-chest`);
}
function limitless(){
    return {
        name: boon_names.limitless,
        pic: `${IMG_FOLDER.boons}limitless.png`,
        description: boon_descriptions.limitless,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: on_pick_limitless,
        max: 1,
    }
}

function on_pick_limitless(){
    GS.map.get_player().max_health = undefined;
    GS.map.player_heal(new Point(0, 0), 2);
}
function manic_presence(){
    return {
        name: boon_names.manic_presence,
        pic: `${IMG_FOLDER.boons}manic_presence.png`,
        description: boon_descriptions.manic_presence,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function pacifism(){
    return {
        name: boon_names.pacifism,
        pic: `${IMG_FOLDER.boons}pacifism.png`,
        description: boon_descriptions.pacifism,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function pain_reflexes(){
    return {
        name: boon_names.pain_reflexes,
        pic: `${IMG_FOLDER.boons}pain_reflexes.png`,
        description: boon_descriptions.pain_reflexes,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function perfect_the_basics(){
    return {
        name: boon_names.perfect_the_basics,
        pic: `${IMG_FOLDER.boons}perfect_the_basics.png`,
        description: boon_descriptions.perfect_the_basics,
        prereq_description: boon_prereq_descriptions.perfect_the_basics,
        prereq: prereq_perfect_the_basics,
        on_pick: pick_perfect_the_basics,
        max: 1,
    }
}

function prereq_perfect_the_basics(){
    var basic_count = get_card_matches(BASIC_CARDS).length;
    return basic_count >= 2;
}

function pick_perfect_the_basics(){
    var basics = get_card_matches(BASIC_CARDS);
    for(var basic of basics){
        GS.deck.remove(basic.id);
        switch(basic.name){
            case basic_orthogonal().name:
                GS.deck.add(short_charge_orthogonal());
                break;
            case basic_diagonal().name:
                GS.deck.add(short_charge_diagonal());
                break;
            case basic_slice().name:
                GS.deck.add(spin_attack());
                break;
            default:
                throw Error(ERRORS.value_not_found);
        }
    }
    GS.deck.deal();
    GS.refresh_deck_display();
}

function get_card_matches(card_list){
    var list = GS.deck.get_deck_info();
    var names = card_list.map(card => {
        return card().name;
    });
    return list.filter(card => {
        return names.includes(card.name);
    });
}
function picky_shopper(){
    return {
        name: boon_names.picky_shopper,
        pic: `${IMG_FOLDER.boons}picky_shopper.png`,
        description: boon_descriptions.picky_shopper,
        prereq_description: boon_prereq_descriptions.none,
    }
}
function practice_makes_perfect(){
    return {
        name: boon_names.practice_makes_perfect,
        pic: `${IMG_FOLDER.boons}practice_makes_perfect.png`,
        description: boon_descriptions.practice_makes_perfect,
        prereq_description: boon_prereq_descriptions.practice_makes_perfect,
        prereq: prereq_practice_makes_perfect,
        max: 1,
    }
}

function prereq_practice_makes_perfect(){
    var has_health = GS.map.get_player().max_health !== undefined;
    var not_deep = GS.map.get_floor_num() < 15;
    return has_health && not_deep;
}
function pressure_points(){
    return {
        name: boon_names.pressure_points,
        pic: `${IMG_FOLDER.boons}pressure_points.png`,
        description: boon_descriptions.pressure_points,
        prereq_description: boon_prereq_descriptions.none,
        max: 3,
    }
}
function quick_healing(){
    return {
        name: boon_names.quick_healing,
        pic: `${IMG_FOLDER.boons}quick_healing.png`,
        description: boon_descriptions.quick_healing,
        prereq_description: boon_prereq_descriptions.none,
        max: 3,
    }
}
function rebirth(){
    return {
        name: boon_names.rebirth,
        pic: `${IMG_FOLDER.boons}rebirth.png`,
        description: boon_descriptions.rebirth,
        prereq_description: boon_prereq_descriptions.none,
    }
}
function repetition(){
    return {
        name: boon_names.repetition,
        pic: `${IMG_FOLDER.boons}repetition.png`,
        description: boon_descriptions.repetition,
        prereq_description: boon_prereq_descriptions.none,
        max: 3,
    }
}

function repeat_amount(){
    var repetition_count = GS.boons.has(boon_names.repetition);
    var repeat = repetition_count > 0 && GS.map.get_turn_count() % 3 < repetition_count;
    return repeat ? 2 : 1;
}
function retaliate(){
    return {
        name: boon_names.retaliate,
        pic: `${IMG_FOLDER.boons}retaliate.png`,
        description: boon_descriptions.retaliate,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}

/** @type {AIFunction}*/
function retaliate_behavior(self, target, map){
    var hit = false;
    var spaces = random_nearby().map(p => {
        return p.plus(self.location);
    });
    for(var i = 0; i < spaces.length && !hit; ++i){
        if( map.is_in_bounds(spaces[i]) &&                   // Space is not edge.
            !map.check_empty(spaces[i]) &&                   // Space is not empty.
            (map.get_tile(spaces[i]).health !== undefined || // Space has health or
            map.get_tile(spaces[i]).on_hit !== undefined)    // Space has on_hit
        ){
            hit = map.attack(spaces[i]);
        }
    }
    if(!hit){
        map.player_attack(spaces[0].minus(self.location));
    }
}
function rift_touched(){
    return {
        name: boon_names.rift_touched,
        pic: `${IMG_FOLDER.boons}rift_touched.png`,
        description: boon_descriptions.rift_touched,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function roar_of_challenge(){
    return {
        name: boon_names.roar_of_challenge,
        pic: `${IMG_FOLDER.boons}roar_of_challenge.png`,
        description: boon_descriptions.roar_of_challenge,
        prereq_description: boon_prereq_descriptions.roar_of_challenge,
        prereq: prereq_roar_of_challenge,
        on_pick: pick_roar_of_challenge,
    }
}

function prereq_roar_of_challenge(){
    return GS.map.get_player().max_health !== undefined;
}

function pick_roar_of_challenge(){
    change_max_health(2);
}
function safe_passage(){
    return {
        name: boon_names.safe_passage,
        pic: `${IMG_FOLDER.boons}safe_passage.png`,
        description: boon_descriptions.safe_passage,
        prereq_description: boon_prereq_descriptions.safe_passage,
        prereq: prereq_safe_passage,
    }
}

function prereq_safe_passage(){
    var player = GS.map.get_player();
    return player.max_health === undefined || player.health < player.max_health;
}
function shattered_glass(){
    return {
        name: boon_names.shattered_glass,
        pic: `${IMG_FOLDER.boons}shattered_glass.png`,
        description: boon_descriptions.shattered_glass,
        prereq_description: boon_prereq_descriptions.shattered_glass,
        prereq: prereq_shattered_glass,
        on_pick: on_pick_shattered_glass,
        max: 1,
    }
}

function prereq_shattered_glass(){
    return max_health_at_least(2);
}

function on_pick_shattered_glass(){
    change_max_health(-2);
}
function skill_trading(){
    return {
        name: boon_names.skill_trading,
        pic: `${IMG_FOLDER.boons}skill_trading.png`,
        description: boon_descriptions.skill_trading,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function slime_trail(){
    return {
        name: boon_names.slime_trail,
        pic: `${IMG_FOLDER.boons}slime_trail.png`,
        description: boon_descriptions.slime_trail,
        prereq_description: boon_prereq_descriptions.none,
        max: 2,
    }
}
function sniper(){
    return {
        name: boon_names.sniper,
        pic: `${IMG_FOLDER.boons}sniper.png`,
        description: boon_descriptions.sniper,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function spiked_shoes(){
    return {
        name: boon_names.spiked_shoes,
        pic: `${IMG_FOLDER.boons}spiked_shoes.png`,
        description: boon_descriptions.spiked_shoes,
        prereq_description: boon_prereq_descriptions.spiked_shoes,
        prereq: prereq_spiked_shoes,
        on_pick: pick_spiked_shoes,
        max: 1,
    }
}

function prereq_spiked_shoes(){
    return max_health_at_least(1);
}

function pick_spiked_shoes(){
    change_max_health(-1);
}
function spontaneous(){
    return {
        name: boon_names.spontaneous,
        pic: `${IMG_FOLDER.boons}spontaneous.png`,
        description: boon_descriptions.spontaneous,
        prereq_description: boon_prereq_descriptions.spontaneous,
        prereq: prereq_spontaneous,
        on_pick: pick_spontaneous,
        max: 1,
    }
}

function prereq_spontaneous(){
    return GS.deck.deck_size() >= 10;
}

function pick_spontaneous(){
    GS.deck.alter_min(5);
}
function stable_mind(){
    return {
        name: boon_names.stable_mind,
        pic: `${IMG_FOLDER.boons}stable_mind.png`,
        description: boon_descriptions.stable_mind,
        prereq_description: boon_prereq_descriptions.none,
        max: 2,
    }
}
function stealthy(){
    return {
        name: boon_names.stealthy,
        pic: `${IMG_FOLDER.boons}stealthy.png`,
        description: boon_descriptions.stealthy,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function stubborn(){
    return {
        name: boon_names.stubborn,
        pic: `${IMG_FOLDER.boons}stubborn.png`,
        description: boon_descriptions.stubborn,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function thick_soles(){
    return {
        name: boon_names.thick_soles,
        pic: `${IMG_FOLDER.boons}thick_soles.png`,
        description: boon_descriptions.thick_soles,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}
function vicious_cycle(){
    return {
        name: boon_names.vicious_cycle,
        pic: `${IMG_FOLDER.boons}vicious_cycle.png`,
        description: boon_descriptions.vicious_cycle,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}

function apply_vicious_cycle(deck){
    for(var i = 0; i < 2; ++i){
        confuse_player([lash_out]);
    }
}
function get_achievements(){
    return [
        // Boss achievements
        velociphile_achievement(),
        spider_queen_achievement(),
        two_headed_serpent_achievement(),
        lich_achievement(),
        young_dragon_achievement(),
        forest_heart_achievement(),
        arcane_sentry_achievement(),
        lord_of_shadow_and_flame_achievement(),
        victory_achievement(),
        
        // Other 
        ancient_knowledge_achievement(),
        beyond_the_basics_achievement(),
        blessed_achievement(),
        clumsy_achievement(),
        collector_achievement(),
        common_sense_achievement(),
        jack_of_all_trades_achievement(),
        manic_vandal_achievement(),
        minimalist_achievement(),
        monster_hunter_achievement(),
        non_violent_achievement(),
        not_my_fault_achievement(),
        one_hit_wonder_achievement(),
        one_life_achievement(),
        peerless_sprinter_achievement(),
        shrug_it_off_achievement(),
        speed_runner_achievement(),
        triple_achievement(),
        without_a_scratch_achievement(),
    ];
}

function get_achievement_names(){
    return get_achievements().map((a) => {
        return a.name;
    });
}
function arcane_sentry_achievement(){
    return {
        name: achievement_names.arcane_sentry,
        description: achievement_description.arcane_sentry,
        image: `${IMG_FOLDER.tiles}arcane_sentry_core.png`,
        has: false,
        boons: [choose_your_path],
        cards: []
    }
}
function forest_heart_achievement(){
    return {
        name: achievement_names.forest_heart,
        description: achievement_description.forest_heart,
        image: `${IMG_FOLDER.tiles}forest_heart.png`,
        has: false,
        boons: [frugivore],
        cards: []
    }
}
function lich_achievement(){
    return {
        name: achievement_names.lich,
        description: achievement_description.lich,
        image: `${IMG_FOLDER.tiles}lich_rest.png`,
        has: false,
        boons: [rift_touched],
        cards: []
    }
}
function lord_of_shadow_and_flame_achievement(){
    return {
        name: achievement_names.lord_of_shadow_and_flame,
        description: achievement_description.lord_of_shadow_and_flame,
        image: `${IMG_FOLDER.tiles}lord_move.png`,
        has: false,
        boons: [flame_worship],
        cards: []
    }
}
function spider_queen_achievement(){
    return {
        name: achievement_names.spider_queen,
        description: achievement_description.spider_queen,
        image: `${IMG_FOLDER.tiles}spider_queen.png`,
        has: false,
        boons: [retaliate],
        cards: ACHIEVEMENT_CARDS.spider_queen,
    }
}
function two_headed_serpent_achievement(){
    return {
        name: achievement_names.two_headed_serpent,
        description: achievement_description.two_headed_serpent,
        image: `${IMG_FOLDER.tiles}serpent_head.png`,
        has: false,
        boons: [slime_trail],
        cards: ACHIEVEMENT_CARDS.two_headed_serpent,
    }
}
function velociphile_achievement(){
    return {
        name: achievement_names.velociphile,
        description: achievement_description.velociphile,
        image: `${IMG_FOLDER.tiles}velociphile.png`,
        has: false,
        boons: [roar_of_challenge],
        cards: ACHIEVEMENT_CARDS.velociphile,
    }
}
function victory_achievement(){
    return {
        name: achievement_names.victory,
        description: achievement_description.victory,
        image: `${IMG_FOLDER.achievements}victory.png`,
        has: false,
        boons: [vicious_cycle],
        cards: []
    }
}
function young_dragon_achievement(){
    return {
        name: achievement_names.young_dragon,
        description: achievement_description.young_dragon,
        image: `${IMG_FOLDER.tiles}young_dragon_flight.png`,
        has: false,
        boons: [flame_strike],
        cards: []
    }
}
function ancient_knowledge_achievement(){
    return {
        name: achievement_names.ancient_knowledge,
        description: achievement_description.ancient_knowledge,
        image: `${IMG_FOLDER.achievements}ancient_knowledge.png`,
        has: false,
        boons: [clean_mind],
    }
}
function beyond_the_basics_achievement(){
    return {
        name: achievement_names.beyond_the_basics,
        description: achievement_description.beyond_the_basics,
        image: `${IMG_FOLDER.achievements}beyond_the_basics.png`,
        has: false,
        boons: [perfect_the_basics],
    }
}
function blessed_achievement(){
    return {
        name: achievement_names.blessed,
        description: achievement_description.blessed,
        image: `${IMG_FOLDER.achievements}blessed.png`,
        has: false,
        boons: [larger_chests],
    }
}
function clumsy_achievement(){
    return {
        name: achievement_names.clumsy,
        description: achievement_description.clumsy,
        image: `${IMG_FOLDER.achievements}clumsy.png`,
        has: false,
        boons: [thick_soles],
    }
}
function collector_achievement(){
    return {
        name: achievement_names.collector,
        description: achievement_description.collector,
        image: `${IMG_FOLDER.achievements}collector.png`,
        has: false,
        boons: [hoarder],
    }
}
function common_sense_achievement(){
    return {
        name: achievement_names.common_sense,
        description: achievement_description.common_sense,
        image: `${IMG_FOLDER.achievements}common_sense.png`,
        has: false,
        boons: [picky_shopper],
    }
}
function jack_of_all_trades_achievement(){
    return {
        name: achievement_names.jack_of_all_trades,
        description: achievement_description.jack_of_all_trades,
        image: `${IMG_FOLDER.achievements}jack_of_all_trades.png`,
        has: false,
        boons: [spontaneous],
    }
}
function manic_vandal_achievement(){
    return {
        name: achievement_names.manic_vandal,
        description: achievement_description.manic_vandal,
        image: `${IMG_FOLDER.achievements}manic_vandal.png`,
        has: false,
        boons: [manic_presence],
    }
}
function minimalist_achievement(){
    return {
        name: achievement_names.minimalist,
        description: achievement_description.minimalist,
        image: `${IMG_FOLDER.achievements}minimalist.png`,
        has: false,
        boons: [stubborn],
    }
}
function monster_hunter_achievement(){
    return {
        name: achievement_names.monster_hunter,
        description: achievement_description.monster_hunter,
        image: `${IMG_FOLDER.achievements}monster_hunter.png`,
        has: false,
        boons: [brag_and_boast],
    }
}
function non_violent_achievement(){
    return {
        name: achievement_names.non_violent,
        description: achievement_description.non_violent,
        image: `${IMG_FOLDER.achievements}non_violent.png`,
        has: false,
        boons: [pacifism],
    }
}
function not_my_fault_achievement(){
    return {
        name: achievement_names.not_my_fault,
        description: achievement_description.not_my_fault,
        image: `${IMG_FOLDER.achievements}not_my_fault.png`,
        has: false,
        boons: [pressure_points],
    }
}
function one_hit_wonder_achievement(){
    return {
        name: achievement_names.one_hit_wonder,
        description: achievement_description.one_hit_wonder,
        image: `${IMG_FOLDER.achievements}one_hit_wonder.png`,
        has: false,
        boons: [boss_slayer],
    }
}
function one_life_achievement(){
    return {
        name: achievement_names.one_life,
        description: achievement_description.one_life,
        image: `${IMG_FOLDER.achievements}one_life.png`,
        has: false,
        boons: [frenzy],
    }
}
function peerless_sprinter_achievement(){
    return {
        name: achievement_names.peerless_sprinter,
        description: achievement_description.peerless_sprinter,
        image: `${IMG_FOLDER.achievements}peerless_sprinter.png`,
        has: false,
        boons: [stealthy],
    }
}
function shrug_it_off_achievement(){
    return {
        name: achievement_names.shrug_it_off,
        description: achievement_description.shrug_it_off,
        image: `${IMG_FOLDER.achievements}shrug_it_off.png`,
        has: false,
        boons: [quick_healing],
    }
}
function speed_runner_achievement(){
    return {
        name: achievement_names.speed_runner,
        description: achievement_description.speed_runner,
        image: `${IMG_FOLDER.achievements}speed_runner.png`,
        has: false,
        boons: [repetition],
    }
}
function triple_achievement(){
    return {
        name: achievement_names.triple,
        description: achievement_description.triple,
        image: `${IMG_FOLDER.achievements}triple.png`,
        has: false,
        boons: [duplicate],
    }
}
function without_a_scratch_achievement(){
    return {
        name: achievement_names.without_a_scratch,
        description: achievement_description.without_a_scratch,
        image: `${IMG_FOLDER.achievements}without_a_scratch.png`,
        has: false,
        boons: [practice_makes_perfect],
    }
}

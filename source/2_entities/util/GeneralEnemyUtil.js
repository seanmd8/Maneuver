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
 * @property {Tile || undefined} look Used when tiles disguise themselves as something else.
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
    paper_construct_tile, specter_tile, gem_crawler_tile, claustropede_tile, wheel_of_fire_tile,
    blood_crescent_tile,
];

// This is an array of all bosses.
const BOSS_LIST = [
    lich_tile, spider_queen_tile, two_headed_serpent_tile, velociphile_tile, young_dragon_tile, 
    forest_heart_tile, arcane_sentry_tile
]

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
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(1, 0), new Point(-1, 0)])
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(1, -1 * sign_dir.y), new Point(-1, -1 * sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
    }
    else if(sign_dir.y === 0){
        // Target is along the horizontal line.
        var pair = randomize_arr([new Point(sign_dir.x, 1), new Point(sign_dir.x, 1)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(0, 1), new Point(0, -1)])
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(-1 * sign_dir.x, 1), new Point(-1 * sign_dir.x, -1)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
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
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(-1 * sign_dir.x, sign_dir.y), new Point(sign_dir.x, -1 * sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
        pair = randomize_arr([new Point(-1 * sign_dir.x, 0), new Point(0, -1 * sign_dir.y)]);
        ordering.push(pair[0]);
        ordering.push(pair[1]);
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
    if(p1.x === p2.x || p1.y === p2.y){
        // The rectangle can't be 1 dimensional.
        throw new Error(ERRORS.invalid_value);
    }
    var rectangle = [
        p1.copy(),
        p2.copy(),
        new Point(p1.x, p2.y),
        new Point(p2.x, p1.y)
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


/**
 * Function to make a square of points with a side length 5 centered on the origin.
 * @returns {Point[]} the points.
 */
function get_2_away(){
    var points = [];
    for(var x = -2; x <= 2; ++x){
        for(var y = -2; y <= 2; ++y){
            var p = new Point(x, y);
            if(p.within_radius(2) && !p.within_radius(1)){
                points.push(p);
            }
        }
    }
    return points;
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
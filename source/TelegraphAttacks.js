// ----------------TelegraphAttacks.js----------------
// Contains functions to get the points that a enemy could attack on it's next turn.

const horizontal_directions = [new Point(1, 0), new Point(-1, 0), new Point(0, -1), new Point(0, 1)];
const diagonal_directions = [new Point(1, 1), new Point(-1, 1), new Point(1, -1), new Point(-1, -1)];
const all_directions = horizontal_directions.concat(diagonal_directions);

/**
 * @callback TelegraphFunction Function to get the points that a entity can attack on it's next turn.
 * @param {Point} location Where the entity currently is.
 * @param {GameMap} map The map it's in.
 * @param {Tile} self Info about the entity.
 * @returns {Point[]} An array of the points on the map it could currently attack.
 */

/** @type {TelegraphFunction} */
function fireball_telegraph(location, map, self){
    if(self.direction === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    return [location.plus(self.direction)].concat(hazard_telegraph(location, map, self));
}
/** @type {TelegraphFunction} */
function spider_telegraph(location, map, self){
    return add_to_point_arr(all_directions, location);
}
/** @type {TelegraphFunction} */
function turret_h_telegraph(location, map, self){
    var attacks = [];
    for(var direction of horizontal_directions){
        attacks = attacks.concat(get_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function turret_d_telegraph(location, map, self){
    var attacks = [];
    for(var direction of diagonal_directions){
        attacks = attacks.concat(get_points_in_direction(location, direction, map));
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function turret_r_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    var attacks = [];
    
    switch(self.cycle){
        case 0:
            // Adds N and S.
            attacks = attacks.concat(get_points_in_direction(location, new Point(0, -1), map));
            attacks = attacks.concat(get_points_in_direction(location, new Point(0, 1), map));
            break;
        case 1:
            // Adds NE and SW.
            attacks = attacks.concat(get_points_in_direction(location, new Point(1, -1), map));
            attacks = attacks.concat(get_points_in_direction(location, new Point(-1, 1), map));
            break;
        case 2:
            // Adds E and W.
            attacks = attacks.concat(get_points_in_direction(location, new Point(-1, 0), map));
            attacks = attacks.concat(get_points_in_direction(location, new Point(1, 0), map));
            break;
        case 3:
            // Adds SE and NW.
            attacks = attacks.concat(get_points_in_direction(location, new Point(1, 1), map));
            attacks = attacks.concat(get_points_in_direction(location, new Point(-1, -1), map));
            break;
        default:
            throw new Error(`Improper case for ${self.name}`);
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function scythe_telegraph(location, map, self){
    var attacks = [];
    for(var direction of diagonal_directions){
        var current = location.copy();
        for(var i = 0; i < 3 && map.check_empty(current.plus_equals(direction)); ++i){
            attacks.push(current.plus(direction.times(new Point(-1, 0))));
            attacks.push(current.plus(direction.times(new Point(0, -1))));
        }
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function shadow_knight_telegraph(location, map, self){
    var attacks = [];
    var Ls = [new Point(1, 2), new Point(2, 1)];
    for(var L of  Ls){
        for(var transformation of diagonal_directions){
            attacks.push(L.times(transformation).plus(location));
        }
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function ram_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    if(self.cycle === 0){
        return [];
    }
    return turret_h_telegraph(location, map, self);
}
/** @type {TelegraphFunction} */
function large_porcuslime_telegraph(location, map, self){
    return porcuslime_diagonal_telegraph(location, map, self).concat(porcuslime_horizontal_telegraph(location, map, self));
}
/** @type {TelegraphFunction} */
function medium_porcuslime_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    if(self.cycle === 0){
        return porcuslime_horizontal_telegraph(location, map, self);
    }
    return porcuslime_diagonal_telegraph(location, map, self);
}
/** @type {TelegraphFunction} */
function porcuslime_diagonal_telegraph(location, map, self){
    return move_attack_telegraph(location, map, diagonal_directions).concat(hazard_telegraph(location, map, self));
}
/** @type {TelegraphFunction} */
function porcuslime_horizontal_telegraph(location, map, self){
    return move_attack_telegraph(location, map, horizontal_directions).concat(hazard_telegraph(location, map, self));
}
/** @type {TelegraphFunction} */
function noxious_toad_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    var attacks = [];
    if(self.cycle === 1){
        return attacks;
    }
    for(var direction of horizontal_directions){
        var move = location.plus(direction.times(2));
        if(map.check_empty(move)){
            attacks = attacks.concat(spider_telegraph(move, map, self));
        }
        
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function vampire_telegraph(location, map, self){
    var attacks = [];
    for(var move_direction of horizontal_directions){
        var move = location.plus(move_direction);
        if(map.check_empty(move)){
            for(var attack_direction of diagonal_directions){
                attacks.push(move.plus(attack_direction));
            }
        }
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function vinesnare_bush_telegraph(location, map, self){
    if( self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
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
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    var vines = []
    if(self.cycle === 0){
        return vines;
    }
    for(var direction of all_directions){
        for(var i = 2; i <= self.range; ++i){
            vines.push(location.plus(direction.times(i)));
        }
    }
    return vines;
}
/** @type {TelegraphFunction} */
function rat_telegraph(location, map, self){
    if(self.cycle === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
    }
    if(self.cycle >= 1){
        return spider_telegraph(location, map, self);
    }
    return [];
}
/** @type {TelegraphFunction} */
function velociphile_telegraph(location, map, self){
    var attacks = [];
    for(var direction of all_directions){
        if(map.check_empty(location.plus(direction))){
            attacks = attacks.concat(get_points_in_direction(location.plus(direction), direction, map));
        }
    }
    return attacks;
}
/** @type {TelegraphFunction} */
function darkling_telegraph(location, map, self){
    if(self.direction === undefined){
        return [];
    }
    return spider_telegraph(self.direction, map, self);
}
/** @type {TelegraphFunction} */
function orb_of_insanity_telegraph_other(location, map, self){
    if(self.range === undefined){
        throw new Error(`tile missing properties used to telegraph it's attacks.`);
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
/** @type {TelegraphFunction} */
function hazard_telegraph(location, map, self){
    return [location];
}



// Telegraph utility functions

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
        if(map.check_empty(location.plus(direction))){
            attacks.push(location.plus(direction.times(2)));
        }
        attacks.push(location.plus(direction));
    }
    return attacks;
}
/**
 * Finction to let a tile disguise itself as another one.
 * @param {Tile} tile The tile to disguise.
 * @param {TileGenerator} tile_generator The generator for a default version of the tile to disguise as. 
 * @param {boolean=} just_background If true, changes the is_hit field rather than the main image.
 */
function shapeshift(tile, tile_generator, just_background){
    var look = tile_generator();
    tile.description = look.description;
    tile.telegraph = look.telegraph;
    if(just_background){
        tile.event_happening = look.pic;
    }
    else{
        tile.pic = look.pic;
    }
}


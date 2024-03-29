// ----------------BossFloors.js----------------
// File containing functions to generate boss floors.

/** @type {FloorGenerator} Generates the floor where the Velociphile appears.*/
function velociphile_floor(floor_num,  area, map){
    map.spawn_safely(velociphile_tile(), SAFE_SPAWN_ATTEMPTS, true);
    map.lock();
    for(var i = 0; i < 8; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    return velociphile_floor_message;
}
/** @type {FloorGenerator} Generates the floor where the Spider Queen appears.*/
function spider_queen_floor(floor_num, area, map){
    map.spawn_safely(spider_queen_tile(), SAFE_SPAWN_ATTEMPTS, true);
    map.lock();
    for(var i = 0; i < 4; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    for(var i = 0; i < 2; ++i){
        map.add_tile(spider_web_tile());
    }
    return spider_queen_floor_message;
}
/** @type {FloorGenerator} Generates the floor where the Lich appears.*/
function lich_floor(floor_num,  area, map){
    var locations = [
        new Point(FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2),
        new Point(1, FLOOR_HEIGHT - 2),
        new Point(FLOOR_WIDTH - 2, 1),
        new Point(1, 1)
    ]
    for(var i = 0; i < locations.length; ++i){
        map.add_tile(damaged_wall_tile(), locations[i]);
    }
    map.spawn_safely(lich_tile(), SAFE_SPAWN_ATTEMPTS, true);
    map.lock();
    return lich_floor_message;
}


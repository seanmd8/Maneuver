/** @type {FloorGenerator} Generates the floor where the Spider Queen appears.*/
function spider_queen_floor(floor_num, area, map){
    map.spawn_safely(spider_queen_tile(), SAFE_SPAWN_ATTEMPTS, true);
    for(var i = 0; i < 4; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    for(var i = 0; i < 2; ++i){
        map.add_tile(spider_web_tile());
    }
    return spider_queen_floor_message;
}
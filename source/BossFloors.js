function velociphile_floor(floor_num,  area, map){
    map.add_tile(velociphile_tile());
    map.lock();
    for(var i = 0; i < 8; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    return velociphile_floor_message;
}
function spider_queen_floor(floor_num, area, map){
    map.add_tile(spider_queen_tile());
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
function lich_floor(floor_num,  area, map){
    map.add_tile(damaged_wall_tile(), FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2);
    map.add_tile(damaged_wall_tile(), 1, FLOOR_HEIGHT - 2);
    map.add_tile(damaged_wall_tile(), FLOOR_WIDTH - 2, 1);
    map.add_tile(damaged_wall_tile(), 1, 1);
    map.add_tile(lich_tile());
    map.lock();
    return lich_floor_message;
}


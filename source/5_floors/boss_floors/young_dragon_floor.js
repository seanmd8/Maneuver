/** @type {FloorGenerator} Generates the floor where the Young Dragon appears.*/
function young_dragon_floor(floor_num,  area, map){
    map.spawn_safely(young_dragon_tile(), SAFE_SPAWN_ATTEMPTS, true);
    for(var i = 0; i < 22; ++i){
        map.add_tile(lava_pool_tile());
    }
    return boss_floor_message.young_dragon;
}
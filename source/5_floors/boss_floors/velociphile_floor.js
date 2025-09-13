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
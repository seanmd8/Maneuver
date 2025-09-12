/** @type {FloorGenerator} Generates the floor where the Lich appears.*/
function lich_floor(floor_num,  area, map){
    var locations = [
        new Point(FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2),
        new Point(1, FLOOR_HEIGHT - 2),
        new Point(FLOOR_WIDTH - 2, 1),
        new Point(1, 1)
    ]
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
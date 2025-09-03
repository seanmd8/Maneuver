/** @type {FloorGenerator} Generates the floor where the Lord of Shadow and Flame appears.*/
function lord_of_shadow_and_flame_floor(floor_num,  area, map){
    var mid_width = Math.floor(FLOOR_WIDTH / 2) - 1;
    var mid_height = Math.floor(FLOOR_HEIGHT / 2) - 1;
    var locations = [
        new Point(mid_width, mid_height),
        new Point(mid_width + 1, mid_height),
        new Point(mid_width + 1, mid_height + 1),
        new Point(mid_width, mid_height + 1),
    ]
    var spawnpoint = rand_from(locations);
    map.add_tile(lord_of_shadow_and_flame_tile(), spawnpoint);
    return boss_floor_message.lord_of_shadow_and_flame;
}
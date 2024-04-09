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
/** @type {FloorGenerator} Generates the floor where the Two Headed Serpent appears.*/
function two_headed_serpent_floor(floor_num, area, map){
    map.lock();
    var serpent_length = 8;
    var finished = false;
    // Finds enough adjacent empty spaces to spawn the serpent in.
    while(!finished){
        finished = true;
        var locations = [];
        var start = map.random_empty();
        if(start.y >= 2){
            finished = false;
        }
        var position = start.copy();
        var dirs = [new Point(random_sign(), 0), new Point(0, random_sign())];
        for(var i = 1; i < serpent_length; ++i){
            var next = rand_no_repeates(dirs, 1)[0];
            position.plus_equals(next);
            if(map.check_empty(position)){
                locations.push(next);
            }
            else{
                finished = false;
            }
        }
    }
    // Add sleeping head.
    var head = two_headed_serpent_tile();
    head.segment_list[0] = locations[0].copy();
    serpent_rotate(head);
    map.add_tile(head, start);
    // Add body segments.
    for(var i = 0; i < locations.length - 1; ++i){
        var segment = two_headed_serpent_body_tile();
        segment.segment_list[0] = locations[i + 1];
        segment.segment_list[1] = locations[i].times(-1);
        serpent_rotate(segment);
        start.plus_equals(locations[i]);
        map.add_tile(segment, start);
    }
    // Add awake head.
    var tail = two_headed_serpent_tile();
    tail.segment_list[1] = locations[locations.length - 1].times(-1);
    serpent_rotate(tail);
    start.plus_equals(locations[locations.length - 1]);
    map.add_tile(tail, start);
    serpent_wake({tile: tail, location: start}, map);
    // Add terrain.
    for(var i = 0; i < 8; ++i){
        var position = map.random_empty();
        map.add_tile(wall_tile(), position);
        map.add_tile(damaged_wall_tile(), position.plus(rand_no_repeates(all_directions, 1)[0]));
    }
    return two_headed_serpent_floor_message;
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


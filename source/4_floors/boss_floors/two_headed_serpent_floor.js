/** @type {FloorGenerator} Generates the floor where the Two Headed Serpent appears.*/
function two_headed_serpent_floor(floor_num, area, map){
    var serpent_length = 8;
    var finished = false;
    // Finds enough adjacent empty spaces to spawn the serpent in.
    do{
        finished = true;
        var locations = [];
        var current = map.random_empty();
        if(current.y >= 2){
            finished = false;
        }
        var position = current.copy();
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
    }while(!finished)
    // Add sleeping head.
    var head = two_headed_serpent_tile();
    if(head.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    head.segment_list[0] = locations[0].copy();
    serpent_rotate(head);
    map.add_tile(head, current);
    var start = current.copy();
    // Add body segments.
    for(var i = 0; i < locations.length - 1; ++i){
        var segment = two_headed_serpent_body_tile();
        if(segment.segment_list === undefined){
            throw new Error(ERRORS.missing_property);
        }
        segment.segment_list[0] = locations[i + 1];
        segment.segment_list[1] = locations[i].times(-1);
        serpent_rotate(segment);
        current.plus_equals(locations[i]);
        map.add_tile(segment, current);
    }
    // Add awake head.
    var tail = two_headed_serpent_tile();
    if(tail.segment_list === undefined){
        throw new Error(ERRORS.missing_property);
    }
    tail.segment_list[1] = locations[locations.length - 1].times(-1);
    serpent_rotate(tail);
    current.plus_equals(locations[locations.length - 1]);
    map.add_tile(tail, current);
    serpent_wake({tile: head, location: start}, map);
    // Add terrain.
    for(var i = 0; i < 8; ++i){
        var position = map.random_empty();
        map.add_tile(wall_tile(), position);
        map.add_tile(damaged_wall_tile(), position.plus(rand_no_repeates(ALL_DIRECTIONS, 1)[0]));
    }
    return two_headed_serpent_floor_message;
}
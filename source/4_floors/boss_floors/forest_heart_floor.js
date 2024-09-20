/** @type {FloorGenerator} Generates the floor where the Forest Heart appears.*/
function forest_heart_floor(floor_num,  area, map){
    var mid_width = Math.floor(FLOOR_WIDTH / 2) - 1;
    var mid_height = Math.floor(FLOOR_HEIGHT / 2) - 1;

    var locations = [
        new Point(mid_width, mid_height),
        new Point(mid_width + 1, mid_height),
        new Point(mid_width + 1, mid_height + 1),
        new Point(mid_width, mid_height + 1),
    ]
    var sections = [
        [undefined, new Point(1, 0)],
        [new Point(-1, 0), new Point(0, 1)],
        [new Point(0, -1), new Point(-1, 0)],
        [new Point(1, 0), undefined]
    ]
    for(var i = 0; i < locations.length; ++i){
        var section = forest_heart_tile();
        if(i !== 0){
            section.behavior = undefined;
            section.tags.add(TAGS.hidden);
        }
        section.rotate = 90 * i;
        section.segment_list = sections[i];
        map.add_tile(section, locations[i]);
    }
    map.add_tile(living_tree_rooted_tile(), new Point(mid_width - 1, mid_height));
    map.add_tile(living_tree_rooted_tile(), new Point(mid_width + 2, mid_height));
    map.add_tile(vinesnare_bush_tile(), new Point(mid_width - 2, mid_height));
    map.add_tile(vinesnare_bush_tile(), new Point(mid_width + 3, mid_height));
    return forest_heart_floor_message;
}
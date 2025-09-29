/** @type {TileGenerator} */
function black_hole_tile(){
    return {
        type: entity_types.enemy,
        name: other_tile_names.black_hole,
        pic: `${IMG_FOLDER.tiles}black_hole.png`,
        description: other_tile_descriptions.black_hole,
        health: 6,
        tags: new TagList([TAGS.unmovable]),
        behavior: black_hole_ai,
        telegraph_other: black_hole_telegraph_other,
    }
}

/** @type {AIFunction}.*/
function black_hole_ai(self, target, map){
    var moved_player = false;
    var spaces = [];
    for(var i = 2; i < Math.max(FLOOR_HEIGHT, FLOOR_WIDTH); ++i){
        var rectangle = point_rectangle(new Point(i, i), new Point(-i, -i)).map((p) => {
            return self.location.plus(p);
        }).filter((p) => {
            return map.is_in_bounds(p);
        })
        spaces.push(...rectangle);
    }
    for(var start of spaces){
        var end = start.plus(sign(self.location.minus(start)));
        if(!map.get_tile(start).tags.has(TAGS.unmovable) && !map.get_tile(start).tags.has(TAGS.boss)){
            var moved = map.move(start, end)
            if(moved && map.get_tile(end).type === entity_types.player){
                moved_player = true;
            }
        }
    }
    map.attack(self.location);
    if(moved_player){
        throw new Error(ERRORS.pass_turn);
    }
}

/** @type {TelegraphFunction} */
function black_hole_telegraph_other(location, map, self){
    spaces = [];
    for(var i = 2; i < Math.max(FLOOR_HEIGHT, FLOOR_WIDTH); ++i){
        spaces.push(...point_rectangle(
            location.plus(new Point(i, i)), 
            location.plus(new Point(-i, -i))
        ));
    }
    return spaces;
}
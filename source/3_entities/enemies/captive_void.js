/** @type {TileGenerator} */
function captive_void_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}captive_void_on.png`, `${IMG_FOLDER.tiles}captive_void_off.png`];
    var starting_cycle = 0;
    return {
        type: entity_types.enemy,
        name: enemy_names.captive_void,
        pic: pic_arr[starting_cycle],
        display_pic: pic_arr[0],
        description: enemy_descriptions.captive_void,
        tags: new TagList([TAGS.unmovable, TAGS.obstruction]),
        difficulty: 2,
        behavior: captive_void_ai,
        on_hit: captive_void_on_hit,
        telegraph_other: captive_void_telegraph_other,
        pic_arr,
        cycle: starting_cycle
    }
}

/** @type {AIFunction}.*/
function captive_void_ai(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.cycle === 0){
        var moved_player = false;
        var spaces = point_rectangle(new Point(-2, -2), new Point(2, 2));
        for(var space of spaces){
            var start = self.location.plus(space);
            var end = self.location.plus(sign(space));
            if(map.is_in_bounds(start) && !map.check_empty(start) && !map.get_tile(start).tags.has(TAGS.unmovable)){
                var moved = map.move(start, end);
                if(moved && map.get_tile(end).type === entity_types.player){
                    moved_player = true;
                }
            }
        }
        if(moved_player){
            throw new Error(ERRORS.pass_turn);
        }
    }
    else{
        --self.tile.cycle;
        if(self.tile.cycle === 0){
            self.tile.pic = self.tile.pic_arr[0];
        }
    }
}

/** @type {AIFunction}.*/
function captive_void_on_hit(self, target, map){
    if( self.tile.cycle === undefined || 
        self.tile.pic_arr === undefined){
        throw new Error(ERRORS.missing_property);
    }
    self.tile.cycle = 2;
    self.tile.pic = self.tile.pic_arr[1];
}

/** @type {TelegraphFunction} */
function captive_void_telegraph_other(location, map, self){
    if(self.cycle === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var spaces = [];
    if(self.cycle === 0){
        spaces = point_rectangle(new Point(-2, -2), new Point(2, 2)).map((p) => {
            return location.plus(p);
        });
    }
    return spaces;
}
/** @type {TileGenerator}*/
function altar_of_scouring_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_scouring,
        pic: `${IMG_FOLDER.tiles}altar_of_scouring.png`,
        description: other_tile_descriptions.altar_of_scouring,
        tags: new TagList([TAGS.altar, TAGS.obstruction]),
        health: 1,
        on_enter: altar_on_enter(altar_of_scouring_on_enter),
    }
}

function altar_of_scouring_on_enter(self, target, map){
    var left = self.location.x;
    var right = FLOOR_WIDTH - left;
    var top = self.location.y;
    var bottom = FLOOR_HEIGHT - top;
    var max = Math.max(left, right, top, bottom);
    switch(max){
        case left:
            for(var i = 0; i < FLOOR_HEIGHT; ++i){
                var spawnpoint = new Point(0, i);
                map.attack(spawnpoint);
                if(map.check_empty(spawnpoint)){
                    map.add_tile(shoot_fireball(new Point(1, 0)), spawnpoint);
                }
            }
            break;
        case right:
            for(var i = 0; i < FLOOR_HEIGHT; ++i){
                var spawnpoint = new Point(FLOOR_WIDTH - 1, i);
                map.attack(spawnpoint);
                if(map.check_empty(spawnpoint)){
                    map.add_tile(shoot_fireball(new Point(-1, 0)), spawnpoint);
                }
            }
            break;
        case bottom:
            for(var i = 0; i < FLOOR_WIDTH; ++i){
                var spawnpoint = new Point(i, FLOOR_HEIGHT- 1);
                map.attack(spawnpoint);
                if(map.check_empty(spawnpoint)){
                    map.add_tile(shoot_fireball(new Point(0, -1)), spawnpoint);
                }
            }
            break;
        case top:
            for(var i = 0; i < FLOOR_WIDTH; ++i){
                var spawnpoint = new Point(i, 0);
                map.attack(spawnpoint);
                if(map.check_empty(spawnpoint)){
                    map.add_tile(shoot_fireball(new Point(0, 1)), spawnpoint);
                }
            }
            break;
    }
}
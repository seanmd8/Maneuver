/** @type {TileGenerator}*/
function altar_of_scouring_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_scouring,
        pic: `${IMG_FOLDER.tiles}altar_of_scouring.png`,
        description: other_tile_descriptions.altar_of_scouring,
        flavor: other_flavor.altar_of_scouring,
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
                var fb = shoot_fireball(new Point(1, 0));
                var spawnpoint = new Point(0, i);
                attack_spawn(map, fb, spawnpoint);
            }
            break;
        case right:
            for(var i = 0; i < FLOOR_HEIGHT; ++i){
                var fb = shoot_fireball(new Point(-1, 0));
                var spawnpoint = new Point(FLOOR_WIDTH - 1, i);
                attack_spawn(map, fb, spawnpoint);
            }
            break;
        case bottom:
            for(var i = 0; i < FLOOR_WIDTH; ++i){
                var fb = shoot_fireball(new Point(0, -1));
                var spawnpoint = new Point(i, FLOOR_HEIGHT- 1);
                attack_spawn(map, fb, spawnpoint);
            }
            break;
        case top:
            for(var i = 0; i < FLOOR_WIDTH; ++i){
                var fb = shoot_fireball(new Point(0, 1));
                var spawnpoint = new Point(i, 0);
                attack_spawn(map, fb, spawnpoint);
            }
            break;
    }
}
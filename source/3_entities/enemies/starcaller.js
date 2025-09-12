const STARCALLER_TIMER = 4;

/** @type {TileGenerator} */
function starcaller_tile(){
    var pic_arr = [`${IMG_FOLDER.tiles}starcaller_off.png`, `${IMG_FOLDER.tiles}starcaller_on.png`];
    var starting_cycle = random_num(STARCALLER_TIMER) + 1;
    var summons = [
        carrion_flies_tile,
        shatter_sphere_d_tile,
        shatter_sphere_o_tile,
        moon_rock_tile,
    ]
    return {
        type: entity_types.enemy,
        name: enemy_names.starcaller,
        pic: `${IMG_FOLDER.tiles}starcaller_off.png`,
        display_pic: pic_arr[1],
        description: enemy_descriptions.starcaller,
        tags: new TagList(),
        health: 1,
        difficulty: 4,
        behavior: starcaller_ai,
        pic_arr,
        cycle: starting_cycle,
        summons
    }
}

/** @type {AIFunction} AI used by starcallers.*/
function starcaller_ai(self, target, map){
    if(self.tile.cycle === 0){
        // Shoot
        map.attack(self.tile.direction);
        if(map.check_empty(self.tile.direction)){
            var spawn = rand_from(self.tile.summons)();
            map.add_tile(spawn, self.tile.direction);
        }
        self.tile.cycle = STARCALLER_TIMER;
        self.tile.pic = self.tile.pic_arr[0];
    }
    else if(self.tile.cycle === 1){
        // Prep to shoot next turn.
        self.tile.pic = self.tile.pic_arr[1];
        self.tile.direction = self.location.plus(target.difference);
        var starfall = function(map_to_use){
            if(self.tile.health === undefined || self.tile.health > 0){
                var destination = {
                    pic: `${IMG_FOLDER.tiles}starcaller_rift.png`,
                    description: event_descriptions.starfall,
                    telegraph: hazard_telegraph
                }
                map_to_use.mark_event(self.tile.direction, destination, false);
            }
        }
        map.add_event({name: event_names.starfall, behavior: starfall});
    }
    --self.tile.cycle;
    if(self.tile.cycle !== 0 && self.tile.cycle !== STARCALLER_TIMER){
        throw new Error(ERRORS.skip_animation);
    }
}
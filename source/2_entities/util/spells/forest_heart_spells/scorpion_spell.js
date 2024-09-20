/** @type {SpellGenerator} */
function scorpion_spell_generator(){
    return {
        behavior: scorpion_spell,
        telegraph_other: scorpion_spell_telegraph,
        description: forest_heart_summon_description,
        pic: `${IMG_FOLDER.tiles}forest_heart_summon.png`
    }
}

/** @type {AIFunction} Spawns a scorpion on each side.*/
function scorpion_spell(self, target, map){
    var width = [];
    for(var x = 0; x < FLOOR_WIDTH; ++x){
        width.push(x);
    }
    var height = [];
    for(var y = 0; y < FLOOR_HEIGHT; ++y){
        height.push(y);
    }
    var top = randomize_arr(width).map(x => {return new Point(x, 0)});
    var bottom = randomize_arr(width).map(x => {return new Point(x, FLOOR_HEIGHT - 1)});
    var left = randomize_arr(height).map(y => {return new Point(0, y)});
    var right = randomize_arr(height).map(y => {return new Point(FLOOR_WIDTH - 1, y)});
    for(var side of [top, bottom, left, right]){
        var spawned = false;
        for(var i = 0; i < side.length && !spawned; ++i){
            if(map.check_empty(side[i])){
                map.add_tile(scorpion_tile(), side[i]);
                spawned = true;
            }
        }
    }
}

/** @type {TelegraphFunction} */
function scorpion_spell_telegraph(location, map, self){
    return point_rectangle(
        new Point(0, 0), 
        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 1)
    );
}
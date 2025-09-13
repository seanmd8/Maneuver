/** @type {SpellGenerator} */
function living_tree_spell_generator(){
    return {
        behavior: living_tree_spell,
        telegraph_other: living_tree_spell_telegraph,
        description: heart_spell_descriptions.summon,
        pic: `${IMG_FOLDER.tiles}forest_heart_summon.png`
    }
}

/** @type {AIFunction} Spawns a living tree along the diagonal of each corner.*/
function living_tree_spell(self, target, map){
    var nw = [];
    var ne = [];
    var se = [];
    var sw = [];
    for(var i = 0; i < Math.floor(FLOOR_HEIGHT / 2) && i < Math.floor(FLOOR_WIDTH / 2); ++i){
        nw.push(new Point(0 + i, 0 + i));
        ne.push(new Point(FLOOR_WIDTH - 1 - i, 0 + i));
        se.push(new Point(FLOOR_WIDTH - 1 - i, FLOOR_HEIGHT - 1 - i));
        sw.push(new Point(0 + i, FLOOR_HEIGHT - 1 - i));
    }
    for(var diagonal of [nw, ne, se, sw]){
        var spawned = false;
        for(var i = 0; i < diagonal.length && !spawned; ++i){
            if(map.check_empty(diagonal[i])){
                map.add_tile(living_tree_tile(), diagonal[i]);
                spawned = true;
            }
        }
    }
}

/** @type {TelegraphFunction} */
function living_tree_spell_telegraph(location, map, self){
    var nw = [];
    var ne = [];
    var se = [];
    var sw = [];
    var points = [];
    for(var i = 0; i < Math.floor(FLOOR_HEIGHT / 2) && i < Math.floor(FLOOR_WIDTH / 2); ++i){
        nw.push(new Point(0 + i, 0 + i));
        ne.push(new Point(FLOOR_WIDTH - 1 - i, 0 + i));
        se.push(new Point(FLOOR_WIDTH - 1 - i, FLOOR_HEIGHT - 1 - i));
        sw.push(new Point(0 + i, FLOOR_HEIGHT - 1 - i));
    }
    for(var diagonal of [nw, ne, se, sw]){
        var added = false;
        for(var i = 0; i < diagonal.length && !added; ++i){
            if(map.check_empty(diagonal[i])){
                points.push(diagonal[i]);
                added = true;
            }
        }
    }
    return points;
}
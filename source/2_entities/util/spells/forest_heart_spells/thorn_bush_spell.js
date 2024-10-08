/** @type {SpellGenerator} */
function thorn_bush_spell_generator(){
    return {
        behavior: thorn_bush_spell,
        telegraph_other: thorn_bush_spell_telegraph,
        description: forest_heart_growth_description,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns Thorn Brambles around the tree.*/
function thorn_bush_spell(self, target, map){
    var points = point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
    var root_layer = {
        pic: `${IMG_FOLDER.tiles}thorn_roots.png`,
        description: thorn_root_description,
        telegraph: hazard_telegraph
    }
    map.add_event({name: `Bramble Shield`, behavior: growth_event(points, root_layer, thorn_bramble_tile)});
}

/** @type {TelegraphFunction} */
function thorn_bush_spell_telegraph(location, map, self){
    return point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
}
/** @type {SpellGenerator} */
function greater_thorn_bush_spell_generator(){
    return {
        behavior: greater_thorn_bush_spell,
        telegraph_other: thorn_bush_spell_telegraph,
        description: forest_heart_growth_description,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns Thorn Brambles around the tree in two rings.*/
function greater_thorn_bush_spell(self, target, map){
    thorn_bush_spell(self, target, map);
    var points = point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 3, FLOOR_HEIGHT / 2 - 3), 
        new Point(FLOOR_WIDTH / 2 + 2, FLOOR_HEIGHT / 2 + 2)
    );
    var root_layer = {
        pic: `${IMG_FOLDER.tiles}thorn_roots.png`,
        description: thorn_root_description,
        telegraph: hazard_telegraph
    }
    var delayed_func = function(map_to_use){
        map_to_use.add_event({name: `Bramble Shield`, behavior: growth_event(points, root_layer, thorn_bramble_tile)});
    };
    map.add_event({name: `Delayed Bramble Shield`, behavior: delay_event(1, delayed_func)});
}
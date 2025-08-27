/** @type {SpellGenerator} */
function swaying_nettle_spell_generator(){
    return {
        behavior: swaying_nettle_spell,
        telegraph_other: swaying_nettle_spell_telegraph,
        description: heart_spell_descriptions.growth,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns Swaying Nettles around the tree.*/
function swaying_nettle_spell(self, target, map){
    var points = point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
    var root_layer = {
        pic: `${IMG_FOLDER.tiles}swaying_nettle_roots.png`,
        description: event_descriptions.nettle_root,
        telegraph: hazard_telegraph
    }
    map.add_event({name: event_names.nettle_shield, behavior: growth_event(points, root_layer, swaying_nettle_tile)});
}

/** @type {TelegraphFunction} */
function swaying_nettle_spell_telegraph(location, map, self){
    return point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
}

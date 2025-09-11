/** @type {SpellGenerator} */
function rotting_fruit_spell_generator(){
    return {
        behavior: rotting_fruit_spell,
        telegraph_other: rotting_fruit_spell_telegraph,
        description: heart_spell_descriptions.growth,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns Thorn Brambles around the tree.*/
function rotting_fruit_spell(self, target, map){
    var points = point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
    for(var point of points){
        if(map.get_tile(point).tags.has(TAGS.thorn_bush_roots)){
            map.attack(point);
        }
        if(map.check_empty(point)){
            map.add_tile(rotting_fruit_tree_tile(), point);
        }
    }
}

/** @type {TelegraphFunction} */
function rotting_fruit_spell_telegraph(location, map, self){
    return point_rectangle(
        new Point(FLOOR_WIDTH / 2 - 2, FLOOR_HEIGHT / 2 - 2), 
        new Point(FLOOR_WIDTH / 2 + 1, FLOOR_HEIGHT / 2 + 1)
    );
}
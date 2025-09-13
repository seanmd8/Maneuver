/** @type {SpellGenerator} */
function vinesnare_bush_spell_generator(){
    return {
        behavior: vinesnare_bush_spell,
        telegraph_other: vinesnare_bush_spell_telegraph,
        description: heart_spell_descriptions.growth,
        pic: `${IMG_FOLDER.tiles}forest_heart_grow.png`
    }
}

/** @type {AIFunction} Spawns 3 vinesnare bushes in each corner.*/
function vinesnare_bush_spell(self, target, map){
    var points = [
        new Point(0, 0),
        new Point(1, 0),
        new Point(0, 1),

        new Point(FLOOR_WIDTH - 1, 0),
        new Point(FLOOR_WIDTH - 2, 0),
        new Point(FLOOR_WIDTH - 1, 1),

        new Point(0, FLOOR_HEIGHT - 1),
        new Point(1, FLOOR_HEIGHT - 1),
        new Point(0, FLOOR_HEIGHT - 2),

        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 1),
        new Point(FLOOR_WIDTH - 2, FLOOR_HEIGHT - 1),
        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 2),
    ];
    for(var space of points){
        if(map.check_empty(space)){
            map.add_tile(vinesnare_bush_tile(), space);
        }
    }
}

/** @type {TelegraphFunction} */
function vinesnare_bush_spell_telegraph(location, map, self){
    return [
        new Point(0, 0),
        new Point(1, 0),
        new Point(0, 1),

        new Point(FLOOR_WIDTH - 1, 0),
        new Point(FLOOR_WIDTH - 2, 0),
        new Point(FLOOR_WIDTH - 1, 1),

        new Point(0, FLOOR_HEIGHT - 1),
        new Point(1, FLOOR_HEIGHT - 1),
        new Point(0, FLOOR_HEIGHT - 2),

        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 1),
        new Point(FLOOR_WIDTH - 2, FLOOR_HEIGHT - 1),
        new Point(FLOOR_WIDTH - 1, FLOOR_HEIGHT - 2),
    ];
}
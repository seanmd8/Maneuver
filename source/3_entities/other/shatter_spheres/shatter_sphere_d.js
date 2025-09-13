/** @type {TileGenerator} */
function shatter_sphere_d_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.shatter_sphere,
        pic: `${IMG_FOLDER.tiles}shatter_sphere_d.png`,
        description: other_tile_descriptions.shatter_sphere_d,
        tags: new TagList(),
        health: 1,
        telegraph_other: shatter_sphere_d_telegraph,
        on_death: shatter_sphere_d_death,
    }
}

/** @type {AIFunction}*/
function shatter_sphere_d_death(self, target, map){
    var attacks = randomize_arr(DIAGONAL_DIRECTIONS);
    for(var attack of attacks){
        map.attack(self.location.plus(attack));
    }
}

/** @type {TelegraphFunction} */
function shatter_sphere_d_telegraph(location, map, self){
    return DIAGONAL_DIRECTIONS.map(a => a.plus(location));
}
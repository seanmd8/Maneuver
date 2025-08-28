/** @type {TileGenerator} */
function corrosive_caterpillar_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.corrosive_caterpillar,
        pic: `${IMG_FOLDER.tiles}corrosive_caterpillar.png`,
        description: enemy_descriptions.corrosive_caterpillar,
        tags: new TagList(),
        health: 1,
        difficulty: 2,
        behavior: corrosive_caterpillar_ai,
        on_death: corrosive_caterpillar_death
    }
}

/** @type {AIFunction} AI used by corrosive catterpillars.*/
function corrosive_caterpillar_ai(self, target, map){
    for(var i = 0; i < 2; ++i){
        var direction = get_empty_nearby(self.location, random_nearby(), map);
        if(!(direction === undefined)){
            if(map.move(self.location, self.location.plus(direction))){
                map.add_tile(corrosive_slime_tile(), self.location);
            }
            self.location.plus_equals(direction);
        }
    }
}
/** @type {AIFunction} Function used on corrosive catterpillar death to slime where they were.*/
function corrosive_caterpillar_death(self, target, map){
    map.add_tile(corrosive_slime_tile(), self.location);
}
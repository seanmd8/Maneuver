/** @type {TileGenerator} A hazardous pool of slime that can be cleared by attacking.*/
function corrosive_slime_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.corrosive_slime,
        pic: `${IMG_FOLDER.tiles}corrosive_slime.png`,
        description: other_tile_descriptions.corrosive_slime,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        telegraph: hazard_telegraph,
        on_enter: corrosive_slime_on_enter
    }
}

/** @type {AIFunction} AI used by spider webs.*/
function corrosive_slime_on_enter(self, target, map){
    hazard(self, target, map);
    decay_ai(self, target, map);
}
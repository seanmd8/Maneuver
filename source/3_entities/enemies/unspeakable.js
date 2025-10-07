/** @type {TileGenerator} */
function unspeakable_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.unspeakable,
        pic: `${IMG_FOLDER.tiles}unspeakable.png`,
        description: enemy_descriptions.unspeakable,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: move_closer_ai,
        telegraph_other: unspeakable_telegraph,
        on_death: unspeakable_death,
    }
}

/** @type {AIFunction} Function used when unspeakableas die to confuse the player.*/
function unspeakable_death(self, target, map){
    confusion_spell(self, {difference: new Point(0, 0)}, map)
}

/** @type {TelegraphFunction} */
function unspeakable_telegraph(location, map, self){
    return [new Point(0, 0), ...ALL_DIRECTIONS].map((p) => {return p.plus(location)});
}
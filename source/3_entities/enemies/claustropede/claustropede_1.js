/** @type {TileGenerator} */
function claustropede_1_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.claustropede_1,
        pic: `${IMG_FOLDER.tiles}claustropede_1.png`,
        description: enemy_descriptions.claustropede,
        tags: new TagList(),
        health: 1,
        difficulty: 1,
        behavior: claustropede_ai,
        on_hit: claustropede_hit,
        telegraph: claustropede_telegraph,
        cycle: 0,
    }
}
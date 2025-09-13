/** @type {TileGenerator} */
function claustropede_3_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.claustropede_3,
        pic: `${IMG_FOLDER.tiles}claustropede_3.png`,
        description: enemy_descriptions.claustropede,
        tags: new TagList(),
        health: 3,
        difficulty: 10,
        behavior: claustropede_ai,
        on_hit: claustropede_hit,
        telegraph: claustropede_telegraph,
        cycle: 0,
    }
}
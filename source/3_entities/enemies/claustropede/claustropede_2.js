/** @type {TileGenerator} */
function claustropede_2_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.claustropede,
        pic: `${IMG_FOLDER.tiles}claustropede_2.png`,
        description: enemy_descriptions.claustropede,
        tags: new TagList(),
        health: 2,
        difficulty: 6,
        behavior: claustropede_ai,
        on_hit: claustropede_hit,
        telegraph: claustropede_telegraph,
        cycle: 0,
    }
}
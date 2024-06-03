/** @type {TileGenerator} A fire which goes away over time. */
function raging_fire_tile(){
    return {
        type: `enemy`,
        name: `raging fire`,
        pic: `${IMG_FOLDER.tiles}raging_fire.png`,
        description: raging_fire_description,
        health: 1,
        behavior: decay_ai,
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}



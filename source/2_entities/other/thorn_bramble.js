/** @type {TileGenerator} */
function thorn_bramble_tile(){
    return{
        type: `terrain`,
        name: `Thorn Bramble`,
        pic: `${IMG_FOLDER.tiles}thorn_bramble.png`,
        description: thorn_bramble_description,
        tags: new TagList([TAGS.unmovable, TAGS.thorn_bush_roots]),
        health: 1,
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}

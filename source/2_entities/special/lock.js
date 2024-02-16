/** @type {TileGenerator} Must be unlocked to reveal the exit.*/
function lock_tile(){
    return {
        type: `terrain`,
        name: `lock`,
        pic: `${IMG_FOLDER.tiles}lock.png`,
        description: lock_description
    }
}
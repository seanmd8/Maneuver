/** @type {TileGenerator} Spawns corrosive slime nearby.*/
function sewer_grate_tile(){
    return{
        type: `enemy`,
        name: `sewer grate`,
        pic: `${IMG_FOLDER.tiles}sewer_grate.png`,
        description: sewer_grate_description,
        behavior: sewer_grate_ai,
    }
}

/** @type {AIFunction} AI used by spider webs.*/
function sewer_grate_ai(self, target, map){
    spawn_nearby(map, corrosive_slime_tile(), self.location);
}
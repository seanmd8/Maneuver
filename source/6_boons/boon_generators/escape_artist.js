function escape_artist(){
    return {
        name: boon_names.escape_artist,
        pic: `${IMG_FOLDER.boons}escape_artist.png`,
        description: boon_descriptions.escape_artist,
    }
}

/** @type {AIFunction}*/
function escape_artist_behavior(self, target, map){
    if(self.tile.health !== undefined && self.tile.health > 0){
        teleport_spell(self, target, map);
    }
}
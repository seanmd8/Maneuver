
function escape_artist(){
    return {
        name: boon_names.escape_artist,
        pic: `${IMG_FOLDER.boons}escape_artist.png`,
        description: escape_artist_description,
        prereq: no_player_on_hit,
        on_pick: pick_escape_artist
    }
}

function pick_escape_artist(){
    GS.map.get_player().on_hit = escape_artist_behavior;
}

/** @type {AIFunction}*/
function escape_artist_behavior(self, target, map){
    if(self.tile.health !== undefined && self.tile.health > 0){
        teleport_spell(self, target, map);
    }
}
// Todo:
//  description
//  implement
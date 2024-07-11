
function pain_reflexes(){
    return {
        name: boon_names.pain_reflexes,
        pic: `${IMG_FOLDER.boons}pain_reflexes.png`,
        description: pain_reflexes_description,
        prereq: no_player_on_hit,
        on_pick: pick_pain_reflexes
    }
}

function pick_escape_artist(){
    GS.map.get_player().on_hit = pain_reflex_behavior;
}

/** @type {AIFunction}*/
function pain_reflex_behavior(self, target, map){
    if(self.tile.health !== undefined && self.tile.health > 0){
        throw new Error(ERRORS.pass_turn);
    }
}
// Not Finished
// Todo:
//  avoid enemy bookkeeping bugs
//      Put a check in the enemy turn one? would also need to make sure that it applies during the player's turn.

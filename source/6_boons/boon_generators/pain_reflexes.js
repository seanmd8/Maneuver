
function pain_reflexes(){
    return {
        name: boon_names.pain_reflexes,
        pic: `${IMG_FOLDER.boons}pain_reflexes.png`,
        description: pain_reflexes_description,
        prereq: no_player_on_hit,
    }
}
// Not Finished
// Todo:
//  avoid enemy bookkeeping bugs
//      Put a check in the enemy turn one? would also need to make sure that it applies during the player's turn.


function vicious_cycle(){
    return {
        name: boon_names.vicious_cycle,
        pic: `${IMG_FOLDER.boons}vicious_cycle.png`,
        description: vicious_cycle_description,
    }
}

function apply_vicious_cycle(deck){
    for(var i = 0; i < 2; ++i){
        if(!chance(GS.boons.has(boon_names.stable_mind), 2)){
            var card = lash_out();
            GS.give_temp_card(card);
        }
    }
}
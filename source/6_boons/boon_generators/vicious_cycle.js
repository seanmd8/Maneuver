
function vicious_cycle(){
    return {
        name: boon_names.vicious_cycle,
        pic: `${IMG_FOLDER.boons}vicious_cycle.png`,
        description: boon_descriptions.vicious_cycle,
    }
}

function apply_vicious_cycle(deck){
    for(var i = 0; i < 2; ++i){
        confuse_player([lash_out]);
    }
}
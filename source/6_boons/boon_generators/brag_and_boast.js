
function brag_and_boast(){
    return {
        name: boon_names.brag_and_boast,
        pic: `${IMG_FOLDER.boons}brag_and_boast.png`,
        description: brag_and_boast_description,
        on_pick: pick_brag_and_boast,
        unlocks: [brag_and_boast]
    }
}

function pick_brag_and_boast(){
    for(var i = 0; i < 2; ++i){
        var boss = rand_no_repeates(BOSS_LIST, 1)[0]();
        var card = rand_no_repeates(boss.card_drops, 1)[0]();
        GS.deck.add(card);
    }
    var card = rand_no_repeates(CONFUSION_CARDS, 1)[0]();
    GS.deck.add(card);
}

function brag_and_boast(){
    return {
        name: boon_names.brag_and_boast,
        pic: `${IMG_FOLDER.boons}brag_and_boast.png`,
        description: boon_descriptions.brag_and_boast,
        on_pick: pick_brag_and_boast,
        unlocks: [brag_and_boast]
    }
}

function pick_brag_and_boast(){
    for(var i = 0; i < 2; ++i){
        var boss = rand_from(BOSS_LIST)();
        var card = rand_from(boss.card_drops)();
        GS.deck.add(card);
        card = rand_from(CONFUSION_CARDS)();
        GS.deck.add(card);
    }
}
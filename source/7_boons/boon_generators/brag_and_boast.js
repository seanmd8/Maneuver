function brag_and_boast(){
    return {
        name: boon_names.brag_and_boast,
        pic: `${IMG_FOLDER.boons}brag_and_boast.png`,
        description: boon_descriptions.brag_and_boast,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: pick_brag_and_boast,
    }
}

function pick_brag_and_boast(){
    for(var i = 0; i < 2; ++i){
        var boss = random_from(BOSS_LIST)();
        var card = random_from(boss.card_drops)();
        GS.deck.add(card);
        card = random_from(CONFUSION_CARDS)();
        GS.deck.add(card);
    }
}
function perfect_the_basics(){
    return {
        name: boon_names.perfect_the_basics,
        pic: `${IMG_FOLDER.boons}perfect_the_basics.png`,
        description: boon_descriptions.perfect_the_basics,
        prereq_description: boon_prereq_descriptions.perfect_the_basics,
        prereq: prereq_perfect_the_basics,
        on_pick: pick_perfect_the_basics,
        max: 1,
    }
}

function prereq_perfect_the_basics(){
    var basic_count = get_card_matches(BASIC_CARDS).length;
    return basic_count >= 2;
}

function pick_perfect_the_basics(){
    var basics = get_card_matches(BASIC_CARDS);
    for(var basic of basics){
        GS.deck.remove(basic.id);
        switch(basic.name){
            case basic_orthogonal().name:
                GS.deck.add(short_charge_orthogonal());
                break;
            case basic_diagonal().name:
                GS.deck.add(short_charge_diagonal());
                break;
            case basic_slice().name:
                GS.deck.add(spin_attack());
                break;
            default:
                throw Error(ERRORS.value_not_found);
        }
    }
    GS.deck.deal();
    GS.refresh_deck_display();
}

function get_card_matches(card_list){
    var list = GS.deck.get_deck_info();
    var names = card_list.map(card => {
        return card().name;
    });
    return list.filter(card => {
        return names.includes(card.name);
    });
}
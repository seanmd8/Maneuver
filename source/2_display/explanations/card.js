function explain_card(card){
    var text = ``;
    text += card.evolutions !== undefined ? `${move_types.evolutions}\n\n` : ``;
    text += `${card.options.explain_buttons()}`;
    text += `\n`;
    if(card.per_floor !== undefined){
        text += `${move_types.per_floor}\n`;
    }
    else if(card.temp){
        text += `${move_types.temp}\n`;
    }
    if(card.options.is_instant()){
        text += `${move_types.instant}\n`;
    }
    return text.trimEnd();
}
function explain_card_w_stats(card){
    var explanation = explain_card(card);
    var picked = ``;
    var removed = ``;
    var node = GS.data.cards.get_node(card.name);
    if(node !== undefined){
        picked = `${move_types.number_picked}: ${node.data.picked}.`
        removed = `${move_types.number_removed}: ${node.data.removed}.`
    }
    return `${explanation}\n\n${picked}\n${removed}`;
}
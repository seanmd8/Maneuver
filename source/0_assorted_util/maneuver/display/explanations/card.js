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

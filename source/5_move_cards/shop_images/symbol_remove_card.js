
/** @type {CardGenerator} Shown in show to denote removing a card from your deck.*/
function symbol_remove_card(){
    return{
        name: card_names.symbol_remove_card,
        pic: `${IMG_FOLDER.other}minus.png`,
        options: new ButtonGrid()
    }
}
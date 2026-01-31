/** @type {CardGenerator} Shown in shop to denote adding a card to your deck.*/
function symbol_add_card(){
    return{
        name: card_names.symbol_add_card,
        pic: `${IMG_FOLDER.ui}plus.png`,
        options: new ButtonGrid(),
    }
}
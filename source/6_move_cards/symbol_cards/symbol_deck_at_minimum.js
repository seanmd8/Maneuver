/** @type {CardGenerator} Shown in shop ind=stead of the remove symbol when your deck is at the minimum size.*/
function symbol_deck_at_minimum(){
    return{
        name: card_names.symbol_deck_at_minimum,
        pic: `${IMG_FOLDER.other}x.png`,
        options: new ButtonGrid()
    }
}
/** @type {CardGenerator} Shown in the journal for cards you have not yet added to your deck.*/
function symbol_not_encountered_card(){
    return{
        name: card_names.symbol_not_encountered,
        pic: `${IMG_FOLDER.ui}not_encountered.png`,
        options: new ButtonGrid(),
    }
}
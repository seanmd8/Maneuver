/** @type {CardGenerator} Shown in the journal for cards you have not yet added to your deck.*/
function symbol_not_encountered_card(){
    return{
        name: card_names.symbol_not_encountered_card,
        pic: `${IMG_FOLDER.other}not_encountered.png`,
        options: new ButtonGrid(),
    }
}
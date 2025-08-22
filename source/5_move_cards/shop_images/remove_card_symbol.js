
/** @type {CardGenerator} Shown in show to denote removing a card from your deck.*/
function remove_card_symbol(){
    return{
        name: `Remove`,
        pic: `${IMG_FOLDER.other}minus.png`,
        options: new ButtonGrid()
    }
}
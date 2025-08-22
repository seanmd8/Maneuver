
/** @type {CardGenerator} Shown in shop to denote adding a card to your deck.*/
function add_card_symbol(){
    return{
        name: `Add`,
        pic: `${IMG_FOLDER.other}plus.png`,
        options: new ButtonGrid()
    }
}
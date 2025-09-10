/** @type {CardGenerator} Shown in the journal for cards you have not yet unlocked.*/
function symbol_locked_card(){
    return{
        name: card_names.symbol_locked,
        pic: `${IMG_FOLDER.other}locked.png`,
        options: new ButtonGrid()
    }
}
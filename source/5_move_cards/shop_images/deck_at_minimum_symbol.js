
/** @type {CardGenerator} Shown in shop ind=stead of the remove symbol when your deck is at the minimum size.*/
function deck_at_minimum_symbol(){
    return{
        name: `Minimum`,
        pic: `${IMG_FOLDER.other}x.png`,
        options: new ButtonGrid()
    }
}
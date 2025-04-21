// ----------------ShopImages.js----------------
// File containing cards used soley to display images in card rows of the shop.

/** @type {CardGenerator} Shown in shop to denote adding a card to your deck.*/
function add_card_symbol(){
    return{
        name: `Add`,
        pic: `${IMG_FOLDER.other}plus.png`,
        options: new ButtonGrid()
    }
}
/** @type {CardGenerator} Shown in show to denote removing a card from your deck.*/
function remove_card_symbol(){
    return{
        name: `Remove`,
        pic: `${IMG_FOLDER.other}minus.png`,
        options: new ButtonGrid()
    }
}
/** @type {CardGenerator} Shown in shop ind=stead of the remove symbol when your deck is at the minimum size.*/
function deck_at_minimum_symbol(){
    return{
        name: `Minimum`,
        pic: `${IMG_FOLDER.other}x.png`,
        options: new ButtonGrid()
    }
}
/** @type {TileGenerator} A chest letting the user choose a reward. Currently empty.*/
function chest_tile(){
    return {
        type: `chest`,
        name: `chest`,
        pic: `${IMG_FOLDER.tiles}chest.png`,
        description: chest_description,
        health: 1,
        on_enter: chest_on_enter,
        contents: []
    }
}

/** @type {AIFunction} Function to open a chest when the player moves onto it.*/
function chest_on_enter(self, target, map){
    if(self.tile.contents === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    if(target.tile.type !== `player`){
        return;
    }
    self.tile.health = 1;
    map.attack(self.location);
    var leave_chest = function(){
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.stage);
        display.display_message(UIIDS.chest_instructions, ``);
        display.clear_tb(UIIDS.chest_confirm_row);
        display.clear_tb(UIIDS.contents);
        display.display_message(UIIDS.content_description, ``);
    }
    var abandon_button = {
        description: abandon_chest
    };
    var take_or_leave =  function(button, position){
        if(button.on_choose !== undefined){
            button.on_choose();
        }
        leave_chest();
    }
    var click_content = function(content, position){
        var confirm_button = {
            description: take_from_chest,
            on_choose: content.on_choose
        };
        display.display_message(UIIDS.content_description, content.description);
        display.clear_tb(UIIDS.chest_confirm_row);
        display.add_button_row(UIIDS.chest_confirm_row, [abandon_button, confirm_button], take_or_leave);
        display.select(UIIDS.contents, position.y, position.x);
    }
    display.display_message(UIIDS.chest_instructions, chest_inner_discription);
    display.add_tb_row(UIIDS.contents, self.tile.contents, CHEST_CONTENTS_SIZE, click_content);
    display.add_button_row(UIIDS.chest_confirm_row, [abandon_button], take_or_leave);
    display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.chest);
}

/**
 * @typedef {Object} Content
 * @property {string} pic
 * @property {function} on_choose
 * @property {string} description
 */

/**
 * @param {Tile} chest 
 * @param {Card} card 
 */
function add_card_to_chest(chest, card){
    if(chest.contents === undefined){
        throw new Error(`tile missing properties used by it's ai.`);
    }
    var content = {
        pic: card.pic,
        on_choose: function(){
            GS.deck.add(card);
        },
        description: add_card_description
    }
    chest.contents.push(content);

}

/**
 * 
 * @param {string} language 
 * @returns {ui_id_library}
 */
function get_ui_ids(language){
    // Factory function for the display classes (currently only html)
    switch(language){
        case `html`:
            return HTML_UI_ID;
        default:
            throw new Error(`invalid display language`);
    }
}

/**
 * @typedef ui_id_library
 * @property {string} title
 * @property {string} stats
 * @property {string} game_screen
 * @property {string} stage
 * @property {string} map_display
 * @property {string} health_display
 * @property {string} hand_display
 * @property {string} move_buttons
 * @property {string} display_message
 * @property {string} shop
 * @property {string} shop_instructions
 * @property {string} add_card
 * @property {string} remove_card
 * @property {string} current_deck
 * @property {string} display_deck
 * @property {string} chest
 * @property {string} tutorial
 */


/** @type {ui_id_library}*/
const HTML_UI_ID = {
    title: `title`,
    stats: `stats`,
    game_screen: `gameScreen`,
    stage: `stage`,
    map_display: `mapDisplay`,
    health_display: `healthDisplay`,
    hand_display: `handDisplay`,
    move_buttons: `moveButtons`,
    display_message: `displayMessage`,
    shop: `shop`,
    shop_instructions: `shopInstructions`,
    add_card: `addCard`,
    remove_card: `removeCard`,
    current_deck: `currentDeck`,
    display_deck: `displayDeck`,
    chest: `chest`,
    tutorial: `tutorial`
}
Object.freeze(HTML_UI_ID);

const ui_id = get_ui_ids(MARKUP_LANGUAGE);
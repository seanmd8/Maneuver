// ----------------UIID.js----------------
// File containing a library of ids used to retrieve elements of the ui for displaying.

/**
 * Function to get a set of uiids (Identifiers that can be used to retrieve the appropriate ui element) for the appropriate language.
 * Throws an error if an invalid language is provided.
 * @param {string} language The language to get uiids for.
 * @returns {ui_id_library} The library of uiids for that language.
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
 * @property {string} title Displays the title of the game.
 * @property {string} stats Displays the current stats.
 * @property {string} game_screen Controls the visibility of the game itself.
 *      @property {string} stage Controls the visibility of the current floor.
 *          @property {string} map_display Displays the map of the floor.
 *          @property {string} health_display Displays the player's health.
 *          @property {string} hand_display Displays the player's hand of cards.
 *          @property {string} move_buttons Displays the buttons for the last card clicked on.
 *          @property {string} display_message Displays messages.
 *      @property {string} shop Controls the visibility of the shop.
 *          @property {string} shop_instructions Lets the player know they can add or remove a card.
 *          @property {string} add_card Displays which cards that could be added to their deck.
 *          @property {string} remove_card Displays which cards that could be removed from their deck.
 *          @property {string} current_deck Tells them the next element is their current deck.
 *          @property {string} display_deck Displays their entire deck.
 *      @property {string} chest Controls the visibility of the chest contents.
 * @property {string} tutorial Controls the visibility of the tutorial screen.
 */


/** @type {ui_id_library} The uiid library for HTML.*/
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

const GAME_SCREEN_DIVISIONS = [ui_id.stage, ui_id.shop, ui_id.chest];
const DISPLAY_DIVISIONS = [ui_id.game_screen, ui_id.tutorial];

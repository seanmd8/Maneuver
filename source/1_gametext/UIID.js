// ----------------UIID.js----------------
// File containing a library of ids used to retrieve elements of the ui.

/**
 * Function to get a set of uiids (Identifiers that can be used to retrieve the appropriate ui element) for the appropriate language.
 * Throws an error if an invalid language is provided.
 * @param {string} language The language to get uiids for.
 * @returns {uiid_library} The library of uiids for that language.
 */
function get_uiids(language){
    // Factory function for the display classes (currently only html).
    switch(language){
        case `html`:
            return HTML_UIIDS;
        default:
            throw new Error(ERRORS.invalid_value);
    }
}

/**
 * @typedef {Object} uiid_library
 * @property {string} title Displays the title of the game.
 * @property {string} game_screen Controls the visibility of the game itself.
 *      @property {string} stats Displays the current stats.
 *      @property {string} stage Controls the visibility of the current floor.
 *          @property {string} map_display Displays the map of the floor.
 *          @property {string} health_display Displays the player's health.
 *          @property {string} remaining_deck Shows how many cards are left in the player's deck.
 *              @property {string} deck_image Deck icon in the background.
 *              @property {string} deck_count # of cards in the foreground.
 *          @property {string} hand_box The box around the hand of cards.
 *              @property {string} hand_label Labels the hand box.
 *              @property {string} hand_display Displays the player's hand of cards.
 *          @property {string} move_box The box around the move buttons.
 *              @property {string} move_label Labels the move button box.
 *              @property {string} move_info Info icon for move buttons.
 *              @property {string} move_buttons Displays the buttons for the last card clicked on.
 *          @property {string} display_message Displays messages.
 *          @property {string} retry_button: A button to allow them to reset after they die.
 *      @property {string} shop Controls the visibility of the shop.
 *          @property {string} shop_instructions Lets the player know they can add or remove a card.
 *          @property {string} add_card Displays which cards that could be added to their deck.
 *          @property {string} remove_card Displays which cards that could be removed from their deck.
 *          @property {string} shop_confirm Clicking this confirms their picks and moves to next floor.
 *          @property {string} shop_message Gives information about the last card clicked on.
 *          @property {string} current_deck Tells them the next element is their current deck.
 *          @property {string} display_deck Displays their entire deck.
 *      @property {string} chest Controls the visibility of the chest contents.
 *          @property {string} chest_lid: Creates the lid of the chest.
 *              @property {string} chest_instructions: A description of the contents of the chest.
 *          @property {string} chest_body: Created the body of the chest.
 *              @property {string} contents The images associated with the contents.
 *              @property {string} chest_confirm_row: Buttons allowing you to confirm your pick or skip the reward.
 *              @property {string} content_description: A description of whichever one of the contents you last clicked on.
 * @property {string} guide Controls the visibility of the guide screen.
 *      @property {string} guide_navbar Controls the visibility of each guidebook section.
 * @property {string} controls Controls the visibility of the controls section.
 *      @property {string} stage_controls Contains the controls for the stage.
 *      @property {string} shop_control Contains the controls for the shop.
 *      @property {string} chest_control Contains the controls for the chest.
 */

/** @type {uiid_library} The uiid library for HTML.*/
const HTML_UIIDS = {
    header_bar: `headerBar`,
        header_box: `headerBox`,
            title: `title`,
    game_screen: `gameScreen`,
        stats: `stats`,
            floor_image: `floorImage`,
            stats_floor: `statsFloor`,
            turn_image: `turnImage`,
            stats_turn: `statsTurn`,
        stage: `stage`,
            map_display: `mapDisplay`,
            sidebar: `sidebar`,
                sidebar_header: `sidebarHeader`,
                initiative: `initiative`,
                boon_list: `boonList`,
                    boon_list_table: `boonListTable`,
                    removed_boon_table: `removedBoonTable`,
                discard_pile: `discardPile`,
                    discard_pile_table: `discardPileTable`,
                full_deck: `fullDeck`,
                    full_deck_table: `fullDeckTable`,
                text_log: `textLog`,
                    text_scroll: `textScroll`,
                deck_order: `deckOrder`,
                    deck_order_table: `deckOrderTable`,
            health_display: `healthDisplay`,
            remaining_deck: `remainingDeck`,
                deck_image: `deckImage`,
                deck_count: `deckCount`,
            hand_box: `handBox`,
                hand_label: `handLabel`,
                hand_display: `handDisplay`,
            move_box: `moveBox`,
                move_label: `moveLabel`,
                move_info: `moveInfo`,
                move_buttons: `moveButtons`,
            display_message: `displayMessage`,
            retry_box: `retryBox`,
            retry_button: `retryButton`,
        shop: `shop`,
            shop_instructions: `shopInstructions`,
            add_card: `addCard`,
            remove_card: `removeCard`,
            shop_confirm: `shopConfirm`,
            shop_message: `shopMessage`,
            current_deck: `currentDeck`,
            display_deck: `displayDeck`,
        chest: `chest`,
            chest_lid: `chestLid`,
                chest_instructions: `chestInstructions`,
            chest_body: `chestBody`,
                contents: `contents`,
                chest_confirm_row: `chestConfirmRow`,
                content_description: `contentDescription`,
        deck_select: `deckSelect`,
            deck_select_message: `deckSelectMessage`,
            deck_select_table: `deckSelectTable`,
            deck_select_card_info: `deckSelectCardInfo`,
            deck_select_confirm: `deckSelectConfirm`,
    guide: `guide`,
        guide_box: `guide-box`,
            guide_navbar: `guideNavbar`,
    achievements: `achievements`,
        achievement_list: `achievement-list`,
    journal: `journal`,
        journal_navbar: `journalNavbar`,
        journal_cards: `journalCards`,
            journal_card_info: `journalCardInfo`, // Generated
        journal_boons: `journalBoons`,
            journal_boon_info: `journalBoonInfo`, // Generated
        journal_areas: `journalAreas`,
    controls: `controls`,
        stage_controls: `stageControls`,
        shop_controls: `shopControls`,
        chest_controls: `chestControls`,
}
Object.freeze(HTML_UIIDS);

const UIIDS = get_uiids(MARKUP_LANGUAGE);
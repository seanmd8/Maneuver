// ----------------ManeuverUtil.js----------------
// File for utility functions used throughout the program.

/**
 * Initiates the game when the page is loaded.
 * @returns {void}
 */
function initiate_game(){
    display.display_message(UIIDS.title, `${game_title}    `);
    create_main_dropdown(UIIDS.title);
    display_guide(UIIDS.guide);
    GS = new GameState();
}


// Deck Creation
/** @returns {MoveDeck} Returns a normal starting deck.*/
function make_starting_deck(){
    var deck = new MoveDeck();

    deck.add(basic_horizontal());
    deck.add(basic_horizontal());
    deck.add(basic_diagonal());
    deck.add(basic_diagonal());
    deck.add(slice());
    deck.add(slice());
    deck.add(short_charge());
    deck.add(jump());

    deck.deal();
    return deck;
}
// Makes a deck for testing new cards.
/** @returns {MoveDeck} Returns a custom deck for testing.*/
function make_test_deck(){
    var deck = new MoveDeck();
    for(var card of CARDS_TO_TEST){
        deck.add(card());
    }
    var size = CARDS_TO_TEST.length;
    for(var i = 0; i < Math.max(4 - size, 1); ++i){
        deck.add(basic_horizontal());
    }
    deck.add(slice());
    deck.deal();
    return deck;
}


// misc display functions
/**
 * Function to create the full description including
 *      -stun amount
 *      -health
 *      -max health
 * when appropriate.
 * @param {Tile} tile Tile to make the description for.
 * @returns {string} The formatted description.
 */
function tile_description(tile){
    if(tile.description === undefined){
        throw new Error(`tile missing description`);
    }
    var hp = ``
    var stunned = ``;
    if(tile.max_health !== undefined && tile.health !== undefined){
        hp = `(${tile.health}/${tile.max_health} hp) `;
    }
    else if(tile.health !== undefined){
        hp = `(${tile.health} hp) `;
    }
    if(tile.stun !== undefined && tile.stun > 0){
        stunned = `*${stunned_msg}${tile.stun}* `;
    }
    return `${hp}${stunned}${tile.description}`;
}
/**
 * Function to display the player's current and max health.
 * @param {Tile} player The player to get health from.
 * @param {number} scale The size of the display images.
 */
function display_health(player, scale){
    if(player.health === undefined || player.max_health === undefined){
        throw new Error(`player missing health`);
    }
    var health = [];
    for(var i = 0; i < player.health; ++i){
        health.push({
            pic: `${IMG_FOLDER.other}heart.png`, 
            name: `heart`
        });
    }
    for(var i = 0; i < (player.max_health - player.health); ++i){
        health.push({
            pic: `${IMG_FOLDER.other}heart_broken.png`, 
            name: `broken heart`
        });
    }
    display.add_tb_row(UIIDS.health_display, health, scale);
}
/**
 * Function to create a dropdown menu capable of switching between the game and guide screens.
 * @param {string} location Where to create it.
 */
function create_main_dropdown(location){
    var options = [];
    var make_on_change = function(screens, screen){
        return function(){
            display.swap_screen(screens, screen);
        }
    }
    if(DISPLAY_DIVISION_NAMES.length !== DISPLAY_DIVISIONS.length){
        throw new Error("list length mismatch");
    }
    for(var i = 0; i < DISPLAY_DIVISIONS.length; ++i){
        var option = {
            label: DISPLAY_DIVISION_NAMES[i],
            on_change: make_on_change(DISPLAY_DIVISIONS, DISPLAY_DIVISIONS[i])
        }
        options.push(option);
    }
    display.create_dropdown(location, options);
}
/**
 * Function to display the guide.
 * @param {string} location Where to display it to.
 */
function display_guide(location){
    var cards_symbol_arr = get_card_symbols();
    var ctrl_symbol_arr = get_control_symbols();
    var cards_inline_arr = cards_symbol_arr.concat(ctrl_symbol_arr)

    var basics_section = display.create_alternating_text_section(GUIDE_HEADERS.basics, GUIDE_TEXT.basics, []);
    var cards_section = display.create_alternating_text_section(GUIDE_HEADERS.cards, GUIDE_TEXT.cards, cards_inline_arr);
    var enemies_section = display.create_alternating_text_section(GUIDE_HEADERS.enemies, GUIDE_TEXT.enemies, []);
    var shop_section = display.create_alternating_text_section(GUIDE_HEADERS.shop, GUIDE_TEXT.shop, []);
    var bosses_section = display.create_alternating_text_section(GUIDE_HEADERS.bosses, GUIDE_TEXT.bosses, []);

    display.create_visibility_toggle(location, GUIDE_HEADERS.basics, basics_section);
    display.create_visibility_toggle(location, GUIDE_HEADERS.cards, cards_section);
    display.create_visibility_toggle(location, GUIDE_HEADERS.enemies, enemies_section);
    display.create_visibility_toggle(location, GUIDE_HEADERS.shop, shop_section);
    display.create_visibility_toggle(location, GUIDE_HEADERS.bosses, bosses_section);
}

/**
 * Function to get an array of images for the card symbols to use when displaying the guide..
 * @returns {HTMLElement[]} The array of images.
 */
function get_card_symbols(){
    var images = [];
    for(var img of CARD_SYMBOLS){
        images.push(display.create_image(img.src, `${img.src} symbol`, new Point(img.x, img.y).times(CARD_SYMBOL_SCALE)));
    }
    return images;
}
/**
 * Function to get an array of buttons with the keys used for controls as the value to use when displaying the guide.
 * @returns {HTMLElement[]} The array of buttons.
 */
function get_control_symbols(){
    var button_symbols = CONTROLS.card.concat(CONTROLS.directional);
    var buttons = [];
    for(var symbol of button_symbols){
        buttons.push(display.create_button(symbol, `${symbol} key`));
    }
    return buttons;
}
/**
 * Function to add a random temporary debuff card to the player's deck.
 */
function confuse_player(){
    var ran = random_num(CONFUSION_CARDS.length);
    GS.give_temp_card(CONFUSION_CARDS[ran]());
}
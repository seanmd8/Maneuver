// ----------------ManeuverUtil.js----------------
// File for utility functions used throughout the program.

/**
 * Initiates the game when the page is loaded.
 * @returns {void}
 */
function initiate_game(){
    display.detect_keys();
    display.stop_space_scrolling();
    DISPLAY_DIVISIONS.swap(UIIDS.game_screen);
    display.display_message(UIIDS.title, `${game_title}    `);
    create_main_dropdown(UIIDS.title);
    GS = new GameState();
    GS.setup();
    display_guide();
    setup_controls_page();
}


// Deck Creation
/** @returns {MoveDeck} Returns a normal starting deck.*/
function make_starting_deck(){
    var deck = new MoveDeck(HAND_SIZE, MIN_DECK_SIZE);

    deck.add(basic_horizontal());
    deck.add(basic_horizontal());
    deck.add(basic_diagonal());
    deck.add(basic_diagonal());
    deck.add(basic_slice());
    deck.add(basic_slice());
    deck.add(short_charge());
    deck.add(jump());

    deck.deal();
    return deck;
}
// Makes a deck for testing new cards.
/** @returns {MoveDeck} Returns a custom deck for testing.*/
function make_test_deck(test_cards){
    var deck = new MoveDeck(HAND_SIZE, MIN_DECK_SIZE);
    for(var card of test_cards){
        deck.add(card());
    }
    var size = test_cards.length;
    for(var i = 0; i < Math.max(4 - size, 1); ++i){
        deck.add(basic_horizontal());
    }
    deck.add(basic_slice());
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
        throw new Error(ERRORS.missing_property);
    }
    return `${hp_description(tile)}${tile.description}`;
}

function hp_description(tile){
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
    return `${hp}${stunned}`;
}

/**
 * Function to create the combined description of everything happening on a space of the game map.
 * @param {GridSpace} space The space to get a description of.
 * @returns {string} The properly formatted description.
 */
function grid_space_description(space){
    var tile = space.tile.look === undefined ? space.tile : space.tile.look;
    tile = tile_description(tile);
    var foreground = space.foreground.filter((fg) => fg.description !== undefined);
    foreground = foreground.map((fg) => `${tile_description_divider}${fg.description}`);
    var background = space.background.filter((bg) => bg.description !== undefined);
    background = background.map((bg) => `${tile_description_divider}${bg.description}`);
    var descriptions = [tile, ...foreground, ...background];
    return descriptions.reduce((res, str) => `${res}${str}`);
}
/**
 * Function to display the player's current and max health.
 * @param {Tile} player The player to get health from.
 * @param {number} scale The size of the display images.
 */
function display_health(player, scale){
    if(player.health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var health = [];
    for(var i = 0; i < player.health; ++i){
        health.push({
            pic: `${IMG_FOLDER.other}heart.png`, 
            name: `heart`
        });
    }
    if(player.max_health !== undefined){
        for(var i = 0; i < (player.max_health - player.health); ++i){
            health.push({
                pic: `${IMG_FOLDER.other}heart_broken.png`, 
                name: `broken heart`
            });
        }
    }
    display.add_tb_row(UIIDS.health_display, health, scale);
}
/**
 * Function to create a dropdown menu capable of switching between the game and guide screens.
 * @param {string} location Where to create it.
 */
function create_main_dropdown(location){
    var options = [
        {
            label: gameplay_screen_name,
            on_change: () => {DISPLAY_DIVISIONS.swap(UIIDS.game_screen)}
        }, 
        {
            label: guide_screen_name,
            on_change: () => {DISPLAY_DIVISIONS.swap(UIIDS.guide)}
        },
        {
            label: controls_screen_name,
            on_change: () => {
                setup_controls_page();
                DISPLAY_DIVISIONS.swap(UIIDS.controls);
            }
        },
        {
            label: achievements_screen_name,
            on_change: () => {
                update_achievements();
                DISPLAY_DIVISIONS.swap(UIIDS.achievements);
            }
        }
    ];
    display.create_dropdown(location, options);
}
/**
 * Function to display the guide.
 */
function display_guide(){
    var section_location = UIIDS.guide;
    var navbar_location = UIIDS.guide_navbar;

    // Create the image arrays for the sections with images.
    var cards_symbol_arr = make_guidebook_images(CARD_SYMBOLS);
    var confusion_inline_arr = make_guidebook_images(CONFUSION_CARDS.map(card => {
        card = card();
        return {
            src: card.pic,
            name: card.name,
            x: 5,
            y: 5
        }
    }));

    // Create guidebook text sections.
    var basics_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.basics, GUIDE_TEXT.basics, []);
    var cards_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.cards, GUIDE_TEXT.cards, cards_symbol_arr);
    var enemies_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.enemies, GUIDE_TEXT.enemies, []);
    var shop_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.shop, GUIDE_TEXT.shop, []);
    var bosses_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.bosses, GUIDE_TEXT.bosses, []);
    var chests_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.chests, GUIDE_TEXT.chests, []);
    var sidebar_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.sidebar, GUIDE_TEXT.sidebar, []);
    var confusion_section = display.create_alternating_text_section(section_location, GUIDE_HEADERS.confusion, 
        [...GUIDE_TEXT.confusion, ...CONFUSION_CARDS.map((card, i) => {
            // Adds the space for confusion card images.
            if(i % 4 !== 3){
                return NBS;
            }
            return `\n`;
        })],
        confusion_inline_arr);

    var section_id_list = [
        basics_section, 
        cards_section, 
        enemies_section, 
        shop_section, 
        bosses_section, 
        chests_section, 
        sidebar_section,
        confusion_section
    ];

    var swap_visibility = function(id_list, id){
        return function(){
            display.swap_screen(id_list, id);
        }
    }

    // Create guidebook navbar.
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.basics, swap_visibility(section_id_list, basics_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.cards, swap_visibility(section_id_list, cards_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.enemies, swap_visibility(section_id_list, enemies_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.shop, swap_visibility(section_id_list, shop_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.bosses, swap_visibility(section_id_list, bosses_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.chests, swap_visibility(section_id_list, chests_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.sidebar, swap_visibility(section_id_list, sidebar_section));
    display.create_visibility_toggle(navbar_location, GUIDE_HEADERS.confusion, swap_visibility(section_id_list, confusion_section));

    display.swap_screen(section_id_list, basics_section);
}

/**
 * Function to get an array of images for the card symbols to use when displaying the guide..
 * @returns {HTMLElement[]} The array of images.
 */
function make_guidebook_images(arr){
    var images = [];
    for(var img of arr){
        images.push(display.create_image(img.src, `${img.name} symbol`, new Point(img.x, img.y).times(CARD_SYMBOL_SCALE)));
    }
    return images;
}
/**
 * Function to get an array of buttons with the keys used for controls as the value to use when displaying the guide.
 * @returns {HTMLElement[]} The array of buttons.
 */
function get_control_symbols(){
    var current_controls = GS.data.controls.get();
    var button_symbols = [...current_controls.stage.card, ...current_controls.stage.direction];
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
    // Chance redused by 50% for each stable_mind boon.
    if(!chance(GS.boons.has(boon_names.stable_mind), 2)){
        var card = rand_from(CONFUSION_CARDS)();
        GS.give_temp_card(card);
        GS.refresh_deck_display();
    } 
}

/**
 * Function to create and add the buttons for the sidebar.
 */
function create_sidebar(){
    var location = UIIDS.sidebar_header;
    var swap_visibility = function(id_list, id){
        return function(){
            id_list.swap(id);
        }
    }
    display.remove_children(location);
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.text_log, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.text_log));
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.discard_pile, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.discard_pile));
    display.create_visibility_toggle(location, SIDEBAR_BUTTONS.initiative, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.initiative));
    SIDEBAR_DIVISIONS.swap(UIIDS.text_log);
}

function floor_has_chest(floor_of_area){
    if(floor_of_area === CHEST_LOCATION){
        return true;
    }
    if(GS.boons.has(boon_names.hoarder) && floor_of_area === SECOND_CHEST_LOCATION){
        return true;
    }
    return false;
}
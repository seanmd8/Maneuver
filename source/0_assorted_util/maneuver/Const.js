// ----------------Const.js----------------
// File containing global constants used throughout the program.


// Starting player stats.
const PLAYER_STARTING_HEALTH = 3;
const HAND_SIZE = 3;
const ADD_CHOICE_COUNT = 3;
const REMOVE_CHOICE_COUNT = 3;
const MIN_DECK_SIZE = 5;

// Settings just used for testing.
const SECOND_STARTING_ENEMY = spider_tile;
const SECOND_STARTING_ENEMY_AMOUNT = 0;
const STARTING_CHEST_CONTENTS = rebirth;
const STARTING_CHEST_AMOUNT = 0;
const CARDS_TO_TEST = [];

// Initialization settings.
const STARTING_ENEMY = spider_tile;
const STARTING_ENEMY_AMOUNT = 1;
const STARTING_DECK = CARDS_TO_TEST.length > 0 ? make_test_deck : make_starting_deck;
const STARTING_AREA = [generate_ruins_area];
var GS;

// Dungeon generation settings.
const FLOOR_WIDTH = 8;
const FLOOR_HEIGHT = 8;
const AREA_SIZE = 5;
const CHEST_LOCATION = 3;
const BOON_CHOICES = 3;
const SAFE_SPAWN_ATTEMPTS = 5;

// Visual and animation settings.
const CARD_SCALE = 90;
const SMALL_CARD_SCALE = 75;
const CHEST_CONTENTS_SIZE = 120;
const TILE_SCALE = 40;
const INITIATIVE_SCALE = 50;
const CARD_SYMBOL_SCALE = 20;
const ANIMATION_DELAY = 160;
const DECK_DISPLAY_WIDTH = 4;
const TEXT_WRAP_WIDTH = 90;
const MARKUP_LANGUAGE = `html`;




// Keyboard controls.
const CONTROLS = {
    directional: [`q`, `w`, `e`, `a`, `s`, `d`, `z`, `x`, `c`],
    card: [`h`, `j`, `k`, `l`],
    alt: [`shift`, `shiftleft`, `shiftright`]
}
Object.freeze(CONTROLS);

// Image folder file structure.
const IMG_FOLDER = {
    src: `images/`,
    actions: `actions/`,
    backgrounds: `backgrounds/`,
    cards: `cards/`,
    other: `other/`,
    symbols: `symbols/`,
    tiles: `tiles/`,
    boons: `boons/`
}
Object.freeze(IMG_FOLDER);

const TAGS = {
    boss: `Boss`,
    unmovable: `Unmovable`,
    unstunnable: `Unstunnable`,
    hidden: `Hidden`,
    thorn_bush_roots: `Thorn Bush Roots`,
    nettle_immune: `Nettle Immune`
}
Object.freeze(TAGS);
// ----------------Const.js----------------
// File containing global constants used throughout the program.


// Starting player stats.
const PLAYER_STARTING_HEALTH = 3;
const HAND_SIZE = 3;
const ADD_CHOICE_COUNT = 3;
const REMOVE_CHOICE_COUNT = 3;
const MIN_DECK_SIZE = 5;

// Initialization settings.
const STARTING_ENEMY = spider_tile;
const STARTING_ENEMY_AMOUNT = 1;
const STARTING_DECK = make_starting_deck;
const STARTING_AREA = [generate_ruins_area];
var GS;

// Settings just used for testing.
const SECOND_STARTING_ENEMY = lava_pool_tile;
const SECOND_STARTING_ENEMY_AMOUNT = 0;
const CARDS_TO_TEST = [];
const STARTING_CHEST_CONTENTS = repetition;
const STARTING_CHEST_AMOUNT = 0;

// Dungeon generation settings.
const FLOOR_WIDTH = 8;
const FLOOR_HEIGHT = 8;
const AREA_SIZE = 5;
const CHEST_LOCATION = 3;
const BOON_CHOICES = 2
const SAFE_SPAWN_ATTEMPTS = 5;

// Visual and animation settings.
const CARD_SCALE = 90;
const CHEST_CONTENTS_SIZE = 120;
const TILE_SCALE = 40;
const CARD_SYMBOL_SCALE = 20;
const ANIMATION_DELAY = 200;
const DECK_DISPLAY_WIDTH = 4;
const TEXT_WRAP_WIDTH = 90;
const MARKUP_LANGUAGE = `html`;




// Keyboard controls.
const CONTROLS = {
    directional: [`q`, `w`, `e`, `a`, `s`, `d`, `z`, `x`, `c`],
    card: [`h`, `j`, `k`, `l`],
    alt: [`Shift`, `ShiftLeft`, `ShiftRight`]
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
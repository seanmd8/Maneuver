// ----------------Cards.js----------------
// File containing global constants used throughout the program.


// Starting player stats.
const PLAYER_STARTING_HEALTH = 3;
const HAND_SIZE = 3;
const ADD_CHOICE_COUNT = 3;
const REMOVE_CHOICE_COUNT = 3;
const MIN_DECK_SIZE = 5;
const CHEST_CHANCE = 2;


// Initialization settings.
const STARTING_ENEMY = spider_tile;
const STARTING_ENEMY_AMOUNT = 1;
const STARTING_DECK = make_starting_deck;
const STARTING_AREA = generate_ruins_area;

// Dungeon generation settings.
const FLOOR_WIDTH = 8;
const FLOOR_HEIGHT = 8;
const AREA_SIZE = 5;
const SAFE_SPAWN_ATTEMPTS = 5;

// Visual and animation settings.
const CARD_SCALE = 90;
const CHEST_CONTENTS_SIZE = 120;
const TILE_SCALE = 35;
const CARD_SYMBOL_SCALE = 20;
const ANIMATION_DELAY = 300;
const DECK_DISPLAY_WIDTH = 4;
const TEXT_WRAP_WIDTH = 90;
const MARKUP_LANGUAGE = `html`;


// Keyboard controls.
const controls = {
    directional: [`q`, `w`, `e`, `a`, `s`, `d`, `z`, `x`, `c`],
    card: [`h`, `j`, `k`]
}
Object.freeze(controls);

// Image folder file structure.
const img_folder = {
    src: `images/`,
    backgrounds: `backgrounds/`,
    cards: `cards/`,
    other: `other/`,
    symbols: `symbols/`,
    tiles: `tiles/`
}
Object.freeze(img_folder);
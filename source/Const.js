
// Starting player stats
const PLAYER_STARTING_HEALTH = 3;
const HAND_SIZE = 3;
const ADD_CHOICE_COUNT = 3;
const REMOVE_CHOICE_COUNT = 3;
const MIN_DECK_SIZE = 5;
const BUFF_CHOICE_COUNT = 2;
const BUFF_SPAWN_DENOMINATOR = 4;


// Initialization settings
const STARTING_ENEMY = spider_tile;
const STARTING_DECK = make_starting_deck;
const STARTING_AREA = generate_ruins_area;

// Dungeon generation settings
const FLOOR_WIDTH = 8;
const FLOOR_HEIGHT = 8;
const AREA_SIZE = 3;

// Visual and animation settings
const CARD_SCALE = 90;
const TILE_SCALE = 30;
const ANIMATION_DELAY = 300;
const DECK_DISPLAY_WIDTH = 4;
const TEXT_WRAP_WIDTH = 45;
const MARKUP_LANGUAGE = `html`;


const controls = {
    directional: [`q`, `w`, `e`, `a`, `s`, `d`, `z`, `x`, `c`],
    card: [`h`, `j`, `k`]
}
Object.freeze(controls);

const img_folder = {
    src: `images/`,
    cards: `cards/`,
    other: `other/`,
    tiles: `tiles/`,
    backgrounds: `backgrounds/`
}
Object.freeze(img_folder);
// ----------------Const.js----------------
// File containing global constants used throughout the program.

// Settings just used for testing. Leave as undefined when not in use.
function init_settings(){
    const init = {
        enemies: undefined,
        chests: undefined,
        cards: undefined,
        area: undefined,
        area_size: undefined,
        save: undefined,
        load: undefined,
    }
    init.enemies = init.enemies ? init.enemies : [spider_tile];
    init.chests = init.chests ? init.chests : [];
    init.cards = init.cards ? make_test_deck(TEST_INIT.cards) : make_starting_deck();
    init.area = init.area? [init.area] : area1;
    init.area_size = init.area_size ? init.area_size : AREA_SIZE;
    init.save = init.save ? init.save : SaveData.save_local_function(`player1`);
    init.load = init.load ? init.load: SaveData.load_local_function(`player1`);
    return init;
}

var GS;

// Starting player stats.
const PLAYER_STARTING_HEALTH = 3;
const HAND_SIZE = 3;
const ADD_CHOICE_COUNT = 3;
const REMOVE_CHOICE_COUNT = 3;
const MIN_DECK_SIZE = 5;

// Dungeon generation settings.
const FLOOR_WIDTH = 8;
const FLOOR_HEIGHT = 8;
const AREA_SIZE = 5;
const CHEST_LOCATION = 3;
const SECOND_CHEST_LOCATION = 2;
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
const DECK_DISPLAY_WIDTH = 5;
const TEXT_WRAP_WIDTH = 90;
const MARKUP_LANGUAGE = `html`;




// Keyboard controls.
const DEFAULT_CONTROLS = {
    stage: {
        direction: [`q`, `w`, `e`, `a`, `s`, `d`, `z`, `x`, `c`],
        card: [`h`, `j`, `k`, `l`],
        info: [`i`],
        retry: [`r`]
    },
    shop: {
        add: [`q`, `w`, `e`, `r`, `t`, `y`],
        remove: [`a`, `s`, `d`, `f`, `g`, `h`],
        confirm: [` `],
    },
    chest: {
        choose: [`h`, `j`, `k`, `l`, `;`],
        confirm: [` `],
        reject: [`escape`]
    },
    toggle: {
        alt: [`shift`]
    }
}
Object.freeze(DEFAULT_CONTROLS);

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
    invulnerable: `Invulnerable`,
    controlled: `Controlled`,
    thorn_bush_roots: `Thorn Bush Roots`,
    nettle_immune: `Nettle Immune`,
    arcane_sentry: `Arcane Sentry`,
    fireball: `Fireball`
}
Object.freeze(TAGS);
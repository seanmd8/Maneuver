// Initialization settings used for testing.
function init_settings(){
    const init = {
        enemies: undefined,
        spawnpoints: undefined,
        chests: undefined,
        cards: undefined,
        area: undefined,
        area_size: undefined,
        achieve: undefined,
        unlock_journal: undefined,
        save: undefined,
        load: undefined,
    }
    // Determines the starting enemies on the first floor.
    init.enemies = init.enemies !== undefined ? init.enemies : [spider_tile];
    // Determines the boons found in chests on the first floor.
    init.chests = init.chests !== undefined ? init.chests : [];
    // Determines the cards in the starting deck.
    init.make_deck = init.cards !== undefined ? () => {return make_test_deck(init.cards)} : () => {return make_starting_deck()};
    // Determines the area to start in.
    init.area = init.area !== undefined ? [init.area] : area1;
    // Determines the size of each area.
    // Set to a minimum of 2 since bosses cannot generate on the first floor.
    init.area_size = init.area_size !== undefined ? init.area_size : AREA_SIZE;
    // Automatically achieves the listed achievements.
    init.achieve = init.achieve !== undefined ? init.achieve : [];
    // Function to unlock parts of the journal automatically.
    init.unlock_journal = init.unlock_journal !== undefined ? init.unlock_journal : () => {};
    // Determines the way of saving and loading the game.
    init.save = init.save !== undefined ? init.save : SaveData.save_local_function(`player1`);
    init.load = init.load !== undefined ? init.load: SaveData.load_local_function(`player1`);
    return init;
}
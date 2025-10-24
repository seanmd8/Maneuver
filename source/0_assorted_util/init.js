// Initialization settings used for testing.
function init_settings(){
    const init = {
        enemies: undefined,
        spawnpoints: undefined,
        chests: undefined,
        cards: undefined,
        area: undefined,
        area_size: undefined,
        achievements: undefined,
        identify_boons: undefined,
        save: undefined,
        load: undefined,
    }
    // Determines the starting enemies on the first floor.
    init.enemies = init.enemies ? init.enemies : [spider_tile];
    // Determines the boons found in chests on the first floor.
    init.chests = init.chests ? init.chests : [];
    // Determines the cards in the starting deck.
    init.make_deck = init.cards ? () => {return make_test_deck(init.cards)} : () => {return make_starting_deck()};
    // Determines the area to start in.
    init.area = init.area? [init.area] : area1;
    // Determines the size of each area.
    // Set to a minimum of 2 since bosses cannot generate on the first floor.
    init.area_size = init.area_size ? init.area_size : AREA_SIZE;
    // Determines achievements that should be automatically gained upon starting the game.
    init.achievements = init.achievements ? init.achievements : [];
    // Determined boons that should be added to the journal unpon starting the game.
    init.identify_boons = init.identify_boons ? init.identify_boons : [];
    // Determines the way of saving and loading the game.
    init.save = init.save ? init.save : SaveData.save_local_function(`player1`);
    init.load = init.load ? init.load: SaveData.load_local_function(`player1`);
    return init;
}
const special_tile_descriptions = {
    chest: `Chest: Has something useful inside. Breaking it will destroy the contents.`,
    chest_armored: `Armored Chest: Has something useful inside. It is larger than a normal chest and `
    +`armored to protect it's contents.`,
    empty: `There is nothing here.`,
    exit: `Exit: Stairs to the next floor.`,
    final_exit: `Return Portal: Move here to leave the dungeon and win the game.`,
    lock: `Locked Exit: Defeat the boss to continue.`,
    player: `You: Click a card to move.`,
}
Object.freeze(special_tile_descriptions);

const special_tile_names = {
    chest: `Chest`,
    chest_armored: `Armored Chest`,
    empty: `Empty`,
    exit: `Exit`,
    final_exit: `Return Portal`,
    lock: `Locked Exit`,
    you: `You`,
    player: `Player`,
}
Object.freeze(special_tile_names);

const chest_text = {
    header: `Choose up to one reward:`,
    take: `Take`,
    abandon: `Abandon`,
    add_card: `Add this card to your deck.`,
}
Object.freeze(chest_text);
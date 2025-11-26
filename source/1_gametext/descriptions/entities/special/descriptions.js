const special_tile_descriptions = {
    chest: `Chest: Has something useful inside. Breaking it will destroy the contents. Moving here `
    +`grants you another turn.`,
    chest_armored: `Armored Chest: Has something useful inside. It is larger than a normal chest and `
    +`is armored to protect it's contents. Moving here grants you another turn.`,
    empty: `There is nothing here.`,
    exit: `Exit: Stairs to the next floor.`,
    final_exit: `Return Portal: Move here to leave the dungeon and win the game.`,
    lock: `Locked Exit: Defeat the boss to continue.`,
    player: `You: Click a card to move.`,
}
Object.freeze(special_tile_descriptions);
const gameplay_labels = {
    title: `Maneuver`,
    hand: `Hand of Cards`,
    move: `Moves`,
    retry: `Retry?`,
    hp: `hp`,
    
    heart: `Heart`,
    broken_heart: `Broken Heart`,
}
Object.freeze(gameplay_labels);

const gameplay_text = {
    welcome: 
        `Use cards to move (blue) and attack (red).\n` 
        +`Click on things to learn more about them.\n`
        +`Refer to the guidebook in the top right if you need more information.`,
    floor: 
        `Welcome to floor `,
    new_area:
        `You have entered the `,
    game_over: 
        `Game Over. You were killed by a `,
    stunned:
        `Stunned x`,
    divider: 
        `\n--------------------\n`,
    select_card: 
        `Before choosing what move to make, you must first select a card to use.`,
    victory:
        `You have emerged from the dungeon victorious! Click on the board to begin again.`,
}
Object.freeze(gameplay_text);
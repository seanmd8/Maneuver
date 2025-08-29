
const gameplay_labels = {
    title: `Maneuver`,
    hand: `Hand of Cards`,
    move: `Moves`,
    retry: `Retry?`,
    floor: `Floor`,
    turn: `Turn`,
}
Object.freeze(gameplay_labels);

const gameplay_text = {
    welcome: 
        `Use cards to move (blue) and attack (red).\n` 
        +`Click on things to learn more about them.\n`
        +`Refer to the guidebook if you need more information.`,
    floor: 
        `Welcome to floor `,
    game_over: 
        `Game Over. You were killed by a `,
    stunned:    
        `Stunned x`,
    divider: 
        `\n--------------------\n`,
    select_card: 
        `Before choosing what move to make, you must first select a card to use.`,
}
Object.freeze(gameplay_text);

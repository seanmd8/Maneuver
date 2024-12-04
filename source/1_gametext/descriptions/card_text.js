
// Button Options.
const null_move_button = `--`;
const NW = `NW`;
const N = `N`;
const NE = `NE`;
const E = `E`;
const SE = `SE`;
const S = `S`;
const SW = `SW`;
const W = `W`;
const C = `C`;
const SPIN = `Spin`;

// Directions.
const four_directions = {
    up: `Up`,
    down: `Down`,
    left: `Left`,
    right: `Right`
}

// Move types.
const move_types = {
    alt: `Shift click on a button to show what it will do on the map.`,
    evolutions: `Dust seems to be covering part of this card obscuring some of the options. `
                +`Maybe you can find some way to remove it?`,
    intro: `Move Options (actions will be performed in order):\n`,

    attack: `Attack`,
    move: `Move`,
    teleport: `Teleport you to a random space`,
    stun: `Stun`,
    confuse: `Confuse: you. Adds a bad temporary card to your deck.`,
    move_until: `Keep Moving`,
    heal: `Heal`,
    you: `you`,
    nothing: `Do nothing`,
    
    per_floor: `Once Per Floor: after being played, this card will disapear for the rest of the floor.`,
    temp: `Temporary: this card will be removed from your deck when used, or at the end of the floor.`,
    instant: `Instant: you will take an extra turn after playing this card.`
}
Object.freeze(move_types);
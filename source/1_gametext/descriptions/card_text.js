
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
    // Unicode arrows
    left:   `\u2B9C`,
    up:     `\u2B9D`,
    right:  `\u2B9E`,
    down:   `\u2B9F`
}

// Move types.
const move_types = {
    alt: `Shift click on a button to show actions on the map.`,
    evolutions: `Dust and paint seems to be covering part of this card obscuring some of the options. `
                +`Maybe you can find some way to remove it?`,
    intro: `Move Options (actions will be performed in order):\n`,

    attack: `Attack`,
    move: `Move`,
    teleport: `Teleport to a random space`,
    stun: `Stun`,
    confuse: `Confuse: you`,
    move_until: `Move continuously`,
    attack_until: `Attack continuously`,
    heal: `Heal`,
    you: `you`,
    nothing: `Do nothing`,
    
    per_floor: `Once Per Floor: Once used, disappears until the next floor.`,
    temp: `Temporary: Removed from your deck when used, or at the end of the floor.`,
    instant: `Instant: Take an extra turn.`
}
Object.freeze(move_types);
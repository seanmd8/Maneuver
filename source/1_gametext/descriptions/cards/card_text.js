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

// Unicode symbols.
const usymbol = {
    // Unicode arrows
    left:   `\u2B9C`,
    up:     `\u2B9D`,
    right:  `\u2B9E`,
    down:   `\u2B9F`,
    // Bullet point
    bullet: `\u2022`,
}
Object.freeze(usymbol);

// Move types.
const move_types = {
    alt: `Shift click on a button to show actions on the map.`,
    evolutions: 
        `Dust and paint seems to be covering part of this card obscuring some of the options. `
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
    you: `You`,
    nothing: `Do nothing`,
    
    per_floor: `Once Per Floor: Can only be drawn one time per floor.`,
    temp: `Temporary: Removed from your deck when put into your discard, or at the end of the floor.`,
    instant: `Instant: Play another card this turn.`,
    
    locked: `This card has not been unlocked yet.`,
    not_found: `This card has never been added to your deck.`,
    number_picked: `Times Added`,
    number_removed: `Times Removed`,
}
Object.freeze(move_types);
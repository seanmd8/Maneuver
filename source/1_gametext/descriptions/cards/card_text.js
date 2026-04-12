// Unicode symbols.
const usymbol = {
    // Arrows for card descriptions.
    left:   `\u2B9C`,
    up:     `\u2B9D`,
    right:  `\u2B9E`,
    down:   `\u2B9F`,

    // Bullet points.
    bullet: `\u2022`,
    
    // Arrows for move buttons.
    w:      `\uD83E\uDC78`,
    n:      `\uD83E\uDC79`,
    e:      `\uD83E\uDC7A`,
    s:      `\uD83E\uDC7B`,
    nw:     `\uD83E\uDC7C`,
    ne:     `\uD83E\uDC7D`,
    se:     `\uD83E\uDC7E`,
    sw:     `\uD83E\uDC7F`,
    c:      `\u25C9`,
}
Object.freeze(usymbol);

// Button Options.
const null_move_button = `--`;
const NW = usymbol.nw;
const N = usymbol.n;
const NE = usymbol.ne;
const E = usymbol.e;
const SE = usymbol.se;
const S = usymbol.s;
const SW = usymbol.sw;
const W = usymbol.w;
const C = usymbol.c;
const DIRECTION_LIST = [NW, N, NE, W, C, E, SW, S, SE];


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
    
    per_floor: `Once Per Floor: Only usable one time each floor.`,
    temp: `Temporary: Removed from your deck when put into your discard, or at the end of the floor.`,
    instant: `Instant: Play another card this turn.`,
    cycling: `Cycling: Using this card causes you to discard your hand.`,
    repeating: `Repeating: This card is only discarded when you play a different card.`,
    
    locked: `This card has not been unlocked yet.`,
    not_found: `This card has never been added to your deck.`,
    missing: `This card has been renamed or removed`,
    number_picked: `Times Added`,
    number_removed: `Times Removed`,
}
Object.freeze(move_types);
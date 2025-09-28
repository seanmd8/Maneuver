const BOSS_CARDS = {
    arcane_sentry: [
        beam_ne, 
        beam_nw, 
        beam_se, 
        beam_sw, 
        saw_strike
    ],
    forest_heart: [
        branch_strike, 
        snack, 
        vine_snare
    ],
    lich: [
        beam_diagonal, 
        beam_orthogonal, 
        debilitating_confusion, 
        instant_teleport
    ],
    spider_queen: [
        bite, 
        chomp, 
        skitter
    ],
    two_headed_serpent: [
        fangs, 
        regenerate, 
        slither
    ],
    velociphile: [
        roll_horizontal, 
        roll_ne, 
        roll_nw
    ],
    young_dragon: [
        firebreathing_horizontal, 
        firebreathing_ne, 
        firebreathing_nw, 
        firebreathing_vertical, 
        glide, 
        soar
    ],
}
Object.freeze(BOSS_CARDS);

function get_boss_cards(){
    // List of all boss cards in order encountered.
    return [
        ...BOSS_CARDS.velociphile,
        ...BOSS_CARDS.spider_queen,
        ...BOSS_CARDS.two_headed_serpent,
        ...BOSS_CARDS.lich,
        ...BOSS_CARDS.young_dragon,
        ...BOSS_CARDS.forest_heart,
        ...BOSS_CARDS.arcane_sentry,
    ];
}

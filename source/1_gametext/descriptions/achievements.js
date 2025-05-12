const achievement_names = {
    // Boss
    velociphile: `Only A Speedbump`,
    spider_queen: `Arachno-Regicide`,
    two_headed_serpent: `One Head Is Better Than Two`,
    lich: `End To Unlife`,
    young_dragon: `Novice Dragonslayer`,
    forest_heart: `Expert Lumberjack`,
    arcane_sentry: `Security Bypass`,

    // Normal
    non_violent: `Non Violent`,
    not_my_fault: `Not My Fault`,
    ancient_knowledge: `Ancient Knowledge`,
    very_confused: `Very Confused`,
    peerless_sprinter: `Peerless Sprinter`,
    speed_runner: `Speed Runner`,
    triple: `Three Of A Kind`,
    beyond_the_basics: `Beyond The Basics`,
    one_life: `One Is All You Need`,
    flawless_technique: `Flawless Technique`,
    clumsy: `Clumsy`,
    shrug_it_off: `Shrug It Off`,
    collector: `Collector`,
    jack_of_all_trades: `Jack Of All Trades`,
    monster_hunter: `Monster Hunter`,
}
function get_achievements(){
    return [
        // Boss achievements
        {
            name: achievement_names.velociphile,
            description: `Defeat the Velociphile.`,
            image: `${IMG_FOLDER.tiles}velociphile.png`,
            has: false,
            boons: [boss_slayer],
            cards: [
                teleport, sidestep_e, sidestep_n, sidestep_ne, sidestep_nw, 
                sidestep_s, sidestep_s, sidestep_se, sidestep_sw, sidestep_w,
                punch_orthogonal, punch_diagonal
            ]
        },
        {
            name: achievement_names.spider_queen,
            description: `Defeat the Spider Queen.`,
            image: `${IMG_FOLDER.tiles}spider_queen.png`,
            has: false,
            boons: [retaliate],
            cards: [
                stunning_leap, stunning_side_leap, stunning_punch_diagonal, stunning_punch_orthogonal, stunning_slice
            ]
        },
        {
            name: achievement_names.two_headed_serpent,
            description: `Defeat the Two Headed Serpent.`,
            image: `${IMG_FOLDER.tiles}serpent_head.png`,
            has: false,
            boons: [slime_trail],
            cards: [
                reckless_attack_left, reckless_attack_right, reckless_sprint, reckless_diagonal, reckless_horizontal, 
                reckless_teleport
            ]
        },
        {
            name: achievement_names.lich,
            description: `Defeat the Lich.`,
            image: `${IMG_FOLDER.tiles}lich_rest.png`,
            has: false,
            boons: [sniper],
            cards: []
        },
        {
            name: achievement_names.young_dragon,
            description: `Defeat the Young Dragon.`,
            image: `${IMG_FOLDER.tiles}young_dragon_flight.png`,
            has: false,
            boons: [flame_strike],
            cards: []
        },
        {
            name: achievement_names.forest_heart,
            description: `Defeat the Forest Heart.`,
            image: `${IMG_FOLDER.tiles}forest_heart.png`,
            has: false,
            boons: [frugivore],
            cards: []
        },
        {
            name: achievement_names.arcane_sentry,
            description: `Defeat the Arcane Sentry.`,
            image: `${IMG_FOLDER.tiles}arcane_sentry_core.png`,
            has: false,
            boons: [/*choose_your_path*/],
            cards: []
        },
        
        // Other 
        /*
        {
            name: achievement_names.non_violent,
            description: `Reach the first boss without killing anything.`,
            image: ``,
            has: false,
            boons: [pacifism],
        },
        {
            name: achievement_names.not_my_fault,
            description: `Let a boss die without dealing the final blow.`,
            has: false,
            boons: [pressure_points],
        },
        {
            name: achievement_names.ancient_knowledge,
            description: `Restore an ancient card to full power.`,
            has: false,
            boons: [/*learn_from_mistakes/],
        },
        {
            name: achievement_names.very_confused,
            description: `Have 6 or more temporary cards in your deck.`,
            has: false,
            boons: [stable_mind],
        },
        {
            name: achievement_names.peerless_sprinter,
            description: `Speed through a floor in 3 turns or less.`,
            has: false,
            boons: [repetition],
        },
        {
            name: achievement_names.speed_runner,
            description: `Leave floor 10 in __ turns or less.`,
            has: false,
            boons: [/*duplicate/],
        },
        {
            name: achievement_names.triple,
            description: `Have 3 or more of the same card in your deck.`,
            has: false,
            boons: [perfect_the_basics],
        },
        {
            name: achievement_names.beyond_the_basics,
            description: `Remove all basic cards from your deck.`,
            has: false,
            boons: [perfect_the_basics],
        },
        {
            name: achievement_names.one_life,
            description: `Defeat any boss with exactly 1 max health.`,
            has: false,
            boons: [frenzy],
        },
        {
            name: achievement_names.flawless_technique,
            description: `Defeat the second boss without ever taking damage.`,
            has: false,
            boons: [practice_makes_perfect],
        },
        {
            name: achievement_names.clumsy,
            description: `Take 5 or more damage from walking into hazards in 1 run.`,
            has: false,
            boons: [thick_soles],
        },
        {
            name: achievement_names.shrug_it_off,
            description: `Take 10 or more damage in 1 run.`,
            has: false,
            boons: [/*thick_skin/],
        },
        {
            name: achievement_names.collector,
            description: `Open 6 or more treasure chests in 1 run.`,
            has: false,
            boons: [hoarder],
        },
        {
            name: achievement_names.jack_of_all_trades,
            description: `Have 20 or more cards in your deck.`,
            has: false,
            boons: [spontaneous],
        },
        {
            name: achievement_names.monster_hunter,
            description: `Kill 5 unique bosses.`,
            has: false,
            boons: [brag_and_boast],
        },
    */
    ]
}
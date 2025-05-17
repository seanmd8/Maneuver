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
    //ancient_knowledge: `Ancient Knowledge`,
    peerless_sprinter: `Peerless Sprinter`,
    speed_runner: `Speed Runner`,
    triple: `Three Of A Kind`,
    beyond_the_basics: `Beyond The Basics`,
    one_life: `One Is All You Need`,
    without_a_scratch: `Without A Scratch`,
    clumsy: `Clumsy`,
    shrug_it_off: `Shrug It Off`,
    collector: `Collector`,
    jack_of_all_trades: `Jack Of All Trades`,
    //monster_hunter: `Monster Hunter`,
}
const achievement_description = {
    // Boss
    velociphile: `Defeat the Velociphile.`,
    spider_queen: `Defeat the Spider Queen.`,
    two_headed_serpent: `Defeat the Two Headed Serpent.`,
    lich: `Defeat the Lich.`,
    young_dragon: `Defeat the Young Dragon.`,
    forest_heart: `Defeat the Forest Heart.`,
    arcane_sentry: `Defeat the Arcane Sentry.`,

    // Normal
    non_violent: `Reach the first boss without killing anything.`,
    not_my_fault: `Let a boss die without dealing the final blow.`,
    //ancient_knowledge: `Restore an ancient card to full power.`,
    peerless_sprinter: `Speed through a floor in 3 turns or less.`,
    speed_runner: `Leave floor 10 in 90 turns or less.`,
    triple: `Have 3 or more of the same card in your deck.`,
    beyond_the_basics: `Remove all basic cards from your deck.`,
    one_life: `Defeat any boss with exactly 1 max health.`,
    without_a_scratch: `Leave floor 10 without taking any damage.`,
    clumsy: `Take 5 or more damage during your turn in 1 run.`,
    shrug_it_off: `Take 10 or more damage in 1 run.`,
    collector: `Open 6 or more treasure chests in 1 run.`,
    jack_of_all_trades: `Have 20 or more cards in your deck.`,
    //monster_hunter: `Kill 5 total unique bosses.`,
}

function get_achievements(){
    return [
        // Boss achievements
        {
            name: achievement_names.velociphile,
            description: achievement_description.velociphile,
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
            description: achievement_description.spider_queen,
            image: `${IMG_FOLDER.tiles}spider_queen.png`,
            has: false,
            boons: [retaliate],
            cards: [
                stunning_leap, stunning_side_leap, stunning_punch_diagonal, stunning_punch_orthogonal, stunning_slice
            ]
        },
        {
            name: achievement_names.two_headed_serpent,
            description: achievement_description.two_headed_serpent,
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
            description: achievement_description.lich,
            image: `${IMG_FOLDER.tiles}lich_rest.png`,
            has: false,
            boons: [sniper],
            cards: []
        },
        {
            name: achievement_names.young_dragon,
            description: achievement_description.young_dragon,
            image: `${IMG_FOLDER.tiles}young_dragon_flight.png`,
            has: false,
            boons: [flame_strike],
            cards: []
        },
        {
            name: achievement_names.forest_heart,
            description: achievement_description.forest_heart,
            image: `${IMG_FOLDER.tiles}forest_heart.png`,
            has: false,
            boons: [frugivore],
            cards: []
        },
        {
            name: achievement_names.arcane_sentry,
            description: achievement_description.arcane_sentry,
            image: `${IMG_FOLDER.tiles}arcane_sentry_core.png`,
            has: false,
            boons: [/*choose_your_path*/],
            cards: []
        },
        
        // Other 
        /*
        {
            name: achievement_names.non_violent,
            description: achievement_description.non_violent,
            image: ``,
            has: false,
            boons: [pacifism],
        },
        {
            name: achievement_names.not_my_fault,
            description: achievement_description.not_my_fault,
            has: false,
            boons: [pressure_points],
        },
        {
            name: achievement_names.ancient_knowledge,
            description: achievement_description.ancient_knowledge,
            has: false,
            boons: [/*learn_from_mistakes/],
        },
        */
        {
            name: achievement_names.peerless_sprinter,
            description: achievement_description.peerless_sprinter,
            image: `${IMG_FOLDER.achievements}peerless_sprinter.png`,
            has: false,
            boons: [stealthy],
        },
        {
            name: achievement_names.speed_runner,
            description: achievement_description.speed_runner,
            image: `${IMG_FOLDER.achievements}speed_runner.png`,
            has: false,
            boons: [repetition],
        },
        {
            name: achievement_names.triple,
            description: achievement_description.triple,
            image: `${IMG_FOLDER.achievements}triple.png`,
            has: false,
            boons: [/*duplicate*/],
        },
        {
            name: achievement_names.beyond_the_basics,
            description: achievement_description.beyond_the_basics,
            image: `${IMG_FOLDER.achievements}beyond_the_basics.png`,
            has: false,
            boons: [perfect_the_basics],
        },
        {
            name: achievement_names.one_life,
            description: achievement_description.one_life,
            image: `${IMG_FOLDER.achievements}one_life.png`,
            has: false,
            boons: [frenzy],
        },
        {
            name: achievement_names.without_a_scratch,
            description: achievement_description.without_a_scratch,
            image: `${IMG_FOLDER.achievements}without_a_scratch.png`,
            has: false,
            boons: [practice_makes_perfect],
        },
        /*
        {
            name: achievement_names.clumsy,
            description: achievement_description.clumsy,
            has: false,
            boons: [thick_soles],
        },
        {
            name: achievement_names.shrug_it_off,
            description: achievement_description.shrug_it_off,
            has: false,
            boons: [/*thick_skin/],
        },
        {
            name: achievement_names.collector,
            description: achievement_description.collector,
            has: false,
            boons: [hoarder],
        },
        {
            name: achievement_names.jack_of_all_trades,
            description: achievement_description.jack_of_all_trades,
            has: false,
            boons: [spontaneous],
        },
        {
            name: achievement_names.monster_hunter,
            description: achievement_description.monster_hunter,
            has: false,
            boons: [brag_and_boast],
        },
    */
    ]
}
const achievement_text = {
    title: `Achievements`,
    reset: `Reset`,
    confirm_reset: `Confirm?`,
    unlocked: `Achievement Unlocked:`,
    repeated: `Achievement Repeated:`,
    unlocks_boon: `New Boon`,
    unlocks_cards: `New Cards`,
}
Object.freeze(achievement_text);

const achievement_names = {
    // Boss
    velociphile: `Only A Speedbump`,
    spider_queen: `Arachno-Regicide`,
    two_headed_serpent: `One Head Is Better Than Two`,
    lich: `End To Unlife`,
    young_dragon: `Novice Dragonslayer`,
    forest_heart: `Expert Lumberjack`,
    arcane_sentry: `Security Bypass`,
    lord_of_shadow_and_flame: `Deeper and Deeper`,
    victory: `Victory`,

    // Normal
    ancient_knowledge: `Ancient Knowledge`,
    beyond_the_basics: `Beyond The Basics`,
    clumsy: `Clumsy`,
    collector: `Collector`,
    common_sense: `Common Sense`,
    jack_of_all_trades: `Jack Of All Trades`,
    manic_vandal: `Manic Vandal`,
    minimalist: `Minimalist`,
    monster_hunter: `Monster Hunter`,
    non_violent: `Non Violent`,
    not_my_fault: `Not My Fault`,
    one_hit_wonder: `One Hit Wonder`,
    one_life: `One Is All You Need`,
    peerless_sprinter: `Peerless Sprinter`,
    shrug_it_off: `Shrug It Off`,
    speed_runner: `Speed Runner`,
    triple: `Three Of A Kind`,
    without_a_scratch: `Without A Scratch`,
}
Object.freeze(achievement_names);

const achievement_description = {
    // Boss
    velociphile: `Defeat the Velociphile.`,
    spider_queen: `Defeat the Spider Queen.`,
    two_headed_serpent: `Defeat the Two Headed Serpent.`,
    lich: `Defeat the Lich.`,
    young_dragon: `Defeat the Young Dragon.`,
    forest_heart: `Defeat the Forest Heart.`,
    arcane_sentry: `Defeat the Arcane Sentry.`,
    lord_of_shadow_and_flame: `Defeat the Lord of Shadow and Flame.`,
    victory: `Escape victorious.`,

    // Normal
    ancient_knowledge: `Restore an ancient card to full power.`,
    beyond_the_basics: `Remove all basic cards from your deck.`,
    clumsy: `Take 5 or more damage during your turn without dying in 1 run.`,
    collector: `Open 6 or more treasure chests in 1 run.`,
    common_sense: `Obtain every common card at least once.`,
    jack_of_all_trades: `Have 25 or more non temporary cards in your deck.`,
    manic_vandal: `Destroy 7 or more treasure chests yourself in 1 run.`,
    minimalist: `Reach floor 15 with only 5 cards in your deck.`,
    monster_hunter: `Kill 5 total unique bosses.`,
    non_violent: `Reach the first boss without killing anything.`,
    not_my_fault: `Let a boss die without dealing any damage to it yourself.`,
    one_hit_wonder: `Defeat a boss in a single turn.`,
    one_life: `Defeat any boss with exactly 1 max health.`,
    peerless_sprinter: `Speed through a floor in 3 turns or less.`,
    shrug_it_off: `Take 10 or more damage without dying in 1 run.`,
    speed_runner: `Leave floor 10 in 100 turns or less.`,
    triple: `Have 3 or more of the same non temporary card in your deck.`,
    without_a_scratch: `Leave floor 10 without taking any damage.`,
}
Object.freeze(achievement_description);

const boss_achievements = [
    achievement_names.velociphile,
    achievement_names.spider_queen,
    achievement_names.two_headed_serpent,
    achievement_names.lich,
    achievement_names.young_dragon,
    achievement_names.forest_heart,
    achievement_names.arcane_sentry,
    achievement_names.lord_of_shadow_and_flame,
]
const boon_names = {
    locked: `Locked`,
    not_encountered: `Not Encountered`,

    ancient_card: `Ancient Card`,
    bitter_determination: `Bitter Determination`,
    blood_alchemy: `Blood Alchemy`,
    boss_slayer: `Boss Slayer`,
    brag_and_boast: `Brag & Boast`,
    chilly_presence: `Chilly Presence`,
    choose_your_path: `Choose Your Path`,
    clean_mind: `Clean Mind`,
    creative: `Creative`,
    dazing_blows: `Dazing Blows`,
    duplicate: `Duplicate`,
    empty_rooms: `Empty Rooms`,
    escape_artist: `Escape Artist`,
    expend_vitality: `Expend Vitality`,
    flame_strike: `Flame Strike`,
    flame_worship: `Flame Worship`,
    fleeting_thoughts: `Fleeting Thoughts`,
    fortitude: `Fortitude`,
    frenzy: `Frenzy`,
    frugivore: `Frugivore`,
    future_sight: `Future Sight`,
    gruntwork: `Gruntwork`,
    hoarder: `Hoarder`,
    larger_chests: `Larger Chests`,
    limitless: `Limitless`,
    manic_presence: `Manic Presence`,
    pacifism: `Pacifism`,
    pain_reflexes: `Pain Reflexes`,
    perfect_the_basics: `Perfect the Basics`,
    picky_shopper: `Picky Shopper`,
    practice_makes_perfect: `Practice Makes Perfect`,
    pressure_points: `Preassure Points`,
    quick_healing: `Quick Healing`,
    rebirth: `Rebirth`,
    repetition: `Repetition`,
    retaliate: `Retaliate`,
    rift_touched: `Rift Touched`,
    roar_of_challenge: `Roar of Challenge`,
    safe_passage: `Safe Passage`,
    shattered_glass: `Shattered Glass`,
    skill_trading: `Skill Trading`,
    slime_trail: `Slime Trail`,
    sniper: `Sniper`,
    spiked_shoes: `Spiked Shoes`,
    spontaneous: `Spontaneous`,
    stable_mind: `Stable Mind`,
    stealthy: `Stealthy`,
    stubborn: `Stubborn`,
    thick_soles: `Thick Soles`,
    vicious_cycle: `Vicious Cycle`,
}
Object.freeze(boon_names);

const boon_descriptions = {
    locked: `You have not unlocked this boon yet.`,
    not_encountered:
        `You have never taken this boon.`,

    bitter_determination: 
        `At the start of each floor, heal 1 if your health is exactly 1.`,
    blood_alchemy:
        `Take 2 damage, gain 2 max hp.`,
    boss_slayer: 
        `Bosses start with 2 less hp.`,
    brag_and_boast: 
        `Add 2 random boss cards and 2 random debuff cards to your deck.`,
    chilly_presence: 
        `Enemies have a 1/6 chance to become stunned at the end of their `
        +`turn. Bosses are not affected.`,
    choose_your_path: 
        `You get to decide which area to go to after each boss fight.`,
    clean_mind: 
        `Remove any 2 cards from your deck.`,
    creative: 
        `Increase your hand size by 1. Increases minimum deck size by 5.`,
    dazing_blows: 
        `Your attacks stun enemies. Bosses are unaffected.`,
    duplicate: 
        `Get a copy of any card in your deck.`,
    empty_rooms: 
        `Difficulty decreases by 3 floors`,
    escape_artist: 
        `Teleport away when attacked.`,
    expend_vitality: 
        `Heal 1 life at the start of each floor. Your max health is decreased by 1.`,
    flame_strike: 
        `Attacking an adjacent empty space has a 1/3 chance of shooting a fireball`,
    flame_worship:
        `An Altar of Scouring spawns on each non boss floor`,
    fleeting_thoughts: 
        `Temporary cards added to your deck will happen instantly.`,
    fortitude: 
        `Gain an extra max health and heal for 1.`,
    frenzy: 
        `Deal double damage while you only have 1 health.`,
    frugivore: 
        `50% chance to encounter a fruit tree on each floor. Eating the fruit will heal you `
        +`for 1, but might attract enemies.`,
    future_sight: 
        `You may look at the order of your deck.`,
    gruntwork: 
        `Gain 3 extra max health. Decrease your hand size by 1.`,
    hoarder: 
        `Encounter two chests in each area.`,
    larger_chests: 
        `All treasure chests contain 2 additional choices and are invulnerable.`,
    limitless: 
        `Remove your max health. Heal for 2. If you would be fully healed, heal `
        +`for 1 instead.`,
    manic_presence: 
        `Some types of enemies are prone to misfiring.`,
    pacifism: 
        `If you would attack an enemy, stun them twice instead. Fully heal at `
        +`the start of each floor. All boss floor exits unlock.`,
    pain_reflexes: 
        `Take a turn whenever you are attacked.`,
    perfect_the_basics: 
        `Replace all your basic cards with better ones.`,
    picky_shopper: 
        `Recieve an extra card choice for adding and removing cards in the shop.`,
    practice_makes_perfect: 
        `Defeating a boss while at max health increases your max health by 1.`,
    pressure_points: 
        `When you stun an enemy, there is a 1/3 chance you also deal it 1 damage.`,
    quick_healing: 
        `After being dealt damage, you have a 1/4 chance to instantly heal it.`,
    rebirth: 
        `When you die, you are revived at full health and this boon is removed.`,
    repetition: 
        `Every 3rd turn, your cards happen twice.`,
    retaliate: 
        `When you are dealt damage, attack a nearby non boss enemy.`,
    rift_touched: 
        `Two Darklings spawn on each non boss floor.`,
    roar_of_challenge: 
        `Gain 2 max health. Difficulty increases by 5 floors.`,
    safe_passage: 
        `Fully heal and travel to the next floor.`,
    shattered_glass: 
        `Enemies explode on death damaging everything nearby other than you. Reduce your `
        +`max health by 2.`,
    skill_trading: 
        `You may both add a card and remove a card at each shop.`,
    slime_trail: 
        `Every time you move, there is a 1/2 chance of leaving a trail of corrosive slime.`,
    sniper: 
        `Attacks deal extra damage to enemies at a distance based on how far away they are.`,
    spiked_shoes: 
        `Attempting to move onto enemies damages them. Reduces your max health by 1.`,
    spontaneous: 
        `After using a non instant card, discard your whole hand. Minimum deck size `
        +`increased by 5.`,
    stable_mind: 
        `You gain a 50% chance to resist confusion.`,
    stealthy: 
        `Enemies are stunned for two turns at the start of each floor. Bosses are immune.`,
    stubborn: 
        `You can skip shops.`,
    thick_soles: 
        `You are immune to damage on your turn.`,
    vicious_cycle: 
        `At the start of each floor, fully heal and then add 2 temporary Lash Out cards to your deck.`,
}
Object.freeze(boon_descriptions);

const boon_prereq_descriptions = {
    none: 
        `Prerequisites: None.`,
    blood_alchemy:
        `Prerequisites: You must have at least 3 health and not have Limitless.`,
    clean_mind:
        `Prerequisites: You must be at least 2 cards above your minimum deck size.`,
    creative:
        `Prerequisites: You must have at least 10 cards in your deck.`,
    expend_vitality:
        `Prerequisites: You must have at least 2 max health and not have Limitless.`,
    fortitude: 
        `Prerequisites: You must not have Limitless.`,
    gruntwork:
        `Prerequisites: You must not have Limitless.`,
    perfect_the_basics:
        `Prerequisites: You must have at least 2 basic cards in your deck.`,
    practice_makes_perfect:
        `Prerequisites: You must not have Limitless.`,
    roar_of_challenge:
        `Prerequisites: You must not have Limitless.`,
    safe_passage:
        `Prerequisites: You must have health less than your max health or have Limitless.`,
    shattered_glass:
        `Prerequisites: You must have at least 3 max health and not have Limitless.`,
    spiked_shoes:
        `Prerequisites: You must have at least 2 max health and not have Limitless.`,
    spontaneous:
        `Prerequisites: You must have at least 10 cards in your deck.`,
}
Object.freeze(boon_prereq_descriptions);

const boon_messages = {
    section_header: `Boons`,
    max: `Max:`,
    no_max: `Unlimited`,

    clean_mind: [`Choose a card to remove (`, `/2 remaining)`],
    duplicate: `Choose a card to copy:`,
    practice_makes_perfect: `Your maximum health has increased.`,
    rebirth: `You died, but were brought back to life.`,
}
Object.freeze(boon_messages);
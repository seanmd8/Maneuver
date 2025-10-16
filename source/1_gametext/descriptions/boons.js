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
    delayed_strike: `Delayed Strike`,
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
    greater_boon: `Greater Boon`,
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
    soul_voucher: `Soul Voucher`,
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
        `Gain 2 max hp.`,
    boss_slayer: 
        `Bosses start with 2 less hp.`,
    brag_and_boast: 
        `Add 2 random boss cards to your deck.`,
    chilly_presence: 
        `Enemies have a 1/6 chance to become stunned at the end of their `
        +`turn. Bosses are not affected.`,
    choose_your_path: 
        `You get to decide which area to go to after each boss fight.`,
    clean_mind: 
        `Remove any 2 cards from your deck.`,
    creative: 
        `Increase your hand size by 1.`,
    dazing_blows: 
        `Your attacks stun enemies. Bosses are unaffected.`,
    delayed_strike:
        `If you would attack or stun an empty space, delay that action until the end of `
        +`the next enemy turn. Actions delayed this way can't hit you.`,
    duplicate: 
        `Get a copy of any card in your deck.`,
    empty_rooms: 
        `Difficulty decreases by 3 floors`,
    escape_artist: 
        `Teleport away when attacked.`,
    expend_vitality: 
        `Heal 1 life at the start of each floor.`,
    flame_strike: 
        `Attacking an adjacent empty space has a 1/2 chance of shooting a fireball`,
    flame_worship:
        `Two Altars of Scouring spawn on each non boss floor`,
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
    greater_boon:
        `Choose to copy a boon you have which is not at it's max amount.`,
    gruntwork: 
        `Gain 3 extra max health.`,
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
        `If you would attack an enemy, stun them twice instead (some terrain elements can still `
        +`be damaged). Fully heal at the start of each floor. All boss floor exits unlock.`,
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
        `When you are dealt damage, attack a nearby enemy.`,
    rift_touched: 
        `Two Darklings spawn on each non boss floor.`,
    roar_of_challenge: 
        `Gain 2 max health.`,
    safe_passage: 
        `Fully heal and travel to the next floor.`,
    shattered_glass: 
        `Enemies and Terrain explode on death damaging everything nearby other than you.`,
    skill_trading: 
        `You may both add a card and remove a card at each shop.`,
    slime_trail: 
        `Every time you move, there is a 1/2 chance of leaving a trail of corrosive slime.`,
    sniper: 
        `Attacks deal extra damage to enemies at a distance based on how far away they are.`,
    soul_voucher:
        `Ignore any Cost to obtain new boons. Each boon chest is guaranteed to have at least 1 `
        +`boon with a cost in it.`,
    spiked_shoes: 
        `Attempting to move onto enemies damages them.`,
    spontaneous: 
        `After using a non instant card, discard your whole hand.`,
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

const boon_cost_descriptions = {
    blood_alchemy: `Cost: Take 2 damage.`,
    brag_and_boast: `Cost: Add 2 non temporary confusion cards to your deck.`,
    creative: `Cost: Increase your minimum deck size by 5.`,
    expend_vitality: `Cost: Decrease your maximum health by 1.`,
    gruntwork: `Cost: Decrease your hand size by 1.`,
    roar_of_challenge: `Cost: Increase difficulty by 5 floors.`,
    shattered_glass: `Cost: Decrease your maximum health by 2.`,
    spiked_shoes: `Cost: Decrease your maximum health by 1.`,
    spontaneous: `Cost: Increase your minimum deck size by 5.`,
}

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
    greater_boon:
        `Prerequisites: You must have at least one boon which is not at it's max amount.`,
    gruntwork:
        `Prerequisites: You must not have Limitless.`,
    hoarder:
        `Prerequisites: You must be less than 15 floors deep.`,
    perfect_the_basics:
        `Prerequisites: You must have at least 2 basic cards in your deck.`,
    practice_makes_perfect:
        `Prerequisites: You must be less than 15 floors deep and not have Limitless.`,
    roar_of_challenge:
        `Prerequisites: You must not have Limitless.`,
    safe_passage:
        `Prerequisites: You must have health less than your max health or have Limitless.`,
    shattered_glass:
        `Prerequisites: You must have at least 3 max health and not have Limitless.`,
    soul_voucher:
        `Prerequisites: You must be less than 15 floors deep.`,
    spiked_shoes:
        `Prerequisites: You must have at least 2 max health and not have Limitless.`,
    spontaneous:
        `Prerequisites: You must have at least 10 cards in your deck.`,
}
Object.freeze(boon_prereq_descriptions);

const boon_messages = {
    section_header: `Boons`,
    max: `Max`,
    no_max: `Unlimited`,
    number_picked: `Times Picked`,

    clean_mind: [`Choose a card to remove (`, `/2 remaining)`],
    duplicate: `Choose a card to copy:`,
    practice_makes_perfect: `Your maximum health has increased.`,
    rebirth: `You died, but were brought back to life.`,
    soul_voucher: `Your voucher will negate the cost.`
}
Object.freeze(boon_messages);
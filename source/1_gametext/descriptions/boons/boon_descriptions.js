const boon_descriptions = {
    locked: 
        `You have not unlocked this boon yet.`,
    not_encountered:
        `You have never taken this boon.`,
    missing:
        `This boon has been renamed or removed`,

    bitter_determination: 
        `At the start of each floor, heal 1 if your health is exactly 1.`,
    blood_alchemy:
        `Gain 2 empty max health.`,
    boss_slayer: 
        `Bosses start with 2 less health.`,
    brag_and_boast: 
        `Add 2 random boss cards to your deck.`,
    burn_bright:
        `Gain 3 max health and heal for 3. Whenever a boss is defeated, you lose 1 max health if `
        +`your max health is greater than 2.`,
    chilly_presence: 
        `Enemies have a 1/6 chance to become stunned at the end of their `
        +`turn. Bosses are not affected.`,
    choose_your_path: 
        `Choose where to travel after each boss fight.`,
    clairvoyance: 
        `You may look at the order of your deck and can sense hidden enemies.`,
    clean_mind: 
        `Remove any 2 cards from your deck.`,
    creative: 
        `Increase your hand size by 1.`,
    dazing_blows: 
        `Your attacks stun enemies. Bosses are unaffected.`,
    delayed_strike:
        `If you would attack or stun an empty space, delay that action until after enemies move. `
        +`Actions delayed this way can't hit you.`,
    duplicate: 
        `Get a copy of any card in your deck.`,
    empty_rooms: 
        `Difficulty decreases by 3 floors`,
    escape_artist: 
        `Teleport away whenever you take damage, then stun all nearby enemies.`,
    expend_vitality: 
        `Heal for 1 at the start of each floor.`,
    flame_strike: 
        `Attacking an adjacent empty space has a 1/2 chance of shooting a fireball`,
    flame_worship:
        `2 Altars of Scouring spawn on each non boss floor`,
    fleeting_thoughts: 
        `Temporary cards added to your deck will happen instantly.`,
    fortitude: 
        `Gain 1 max health and heal for 1.`,
    frenzy: 
        `Deal double damage while you only have 1 health.`,
    frugivore: 
        `50% chance to encounter a fruit tree on each floor. Eating the fruit will heal you `
        +`for 1, but might attract enemies.`,
    grab_bag:
        `Gain 2 random boons.`,
    gruntwork: 
        `Gain 3 empty max health.`,
    hoarder: 
        `Encounter two boon chests in each area.`,
    larger_chests: 
        `All chests contain 2 additional choices and are invulnerable.`,
    limitless: 
        `Fully heal, then remove your max health. If you would be fully healed, heal for 1 instead.`,
    malicious_greeting:
        `Prevents new enemies from being summoned 1/3 of the time.`,
    manic_presence: 
        `Some types of enemies are trigger happy.`,
    medical_investment: 
        `Gain 2 empty max health.`,
    pacifism: 
        `If you would attack an enemy, stun them twice instead. Fully heal at the start of each floor. `
        +`All boss floor exits unlock.`,
    pain_reflexes: 
        `Take another turn whenever you take damage.`,
    pandoras_box:
        `Reduce your max health to 1, then gain a number of random boons equal to your old max health.`,
    perfect_the_basics: 
        `Replace all your basic cards with better ones.`,
    picky_shopper: 
        `Recieve 1 extra card choice for adding and removing cards in the shop.`,
    practice_makes_perfect: 
        `Defeating a boss while at max health increases your max health by 1.`,
    pressure_points: 
        `When you stun an enemy, there is a 1/3 chance you also deal it 1 damage.`,
    rebirth: 
        `When you die, you are revived at full health and this boon is removed.`,
    reckless_speed:
        `Card actions that don't move happen instantly, but confuse you.`
        +`Cards that were already instants won't be affected.`,
    repetition: 
        `Every 3rd turn, your cards happen twice.`,
    retaliate: 
        `Whenever you take damage, attack a random nearby enemy.`,
    rift_touched: 
        `2 Darklings spawn on each non boss floor.`,
    roar_of_challenge: 
        `Gain 2 empty max health.`,
    safe_passage: 
        `Fully heal and travel to the next boss floor.`,
    shattered_glass: 
        `Enemies and Terrain explode on death damaging everything nearby other than you.`,
    skill_trading: 
        `You may both add a card and remove a card at each shop.`,
    slime_trail: 
        `Every time you move, there is a 1/2 chance you leave a trail of corrosive slime.`,
    sniper: 
        `Attacks deal extra damage to enemies at a distance. Damage is increased by 1 for every `
        +`tile beyond the first.`,
    soul_voucher:
        `Ignore any cost to obtain new boons. Each boon chest is guaranteed to have at least 1 `
        +`boon with a cost in it.`,
    spiked_shoes: 
        `Attempting to move onto enemies damages them.`,
    spontaneous: 
        `After using a non instant card, discard your whole hand.`,
    stable_mind: 
        `You gain a 1/2 chance to ignore confusion.`,
    stealthy: 
        `Enemies are stunned for 2 turns at the start of each non boss floor.`,
    stubborn: 
        `You can skip shops.`,
    thick_soles: 
        `You are immune to damage on your turn.`,
    vicious_cycle: 
        `At the start of each floor fully heal, then add 2 temporary Lash Out cards to your deck.`,
    world_shaper:
        `Break the unbreakable.`,
}
Object.freeze(boon_descriptions);
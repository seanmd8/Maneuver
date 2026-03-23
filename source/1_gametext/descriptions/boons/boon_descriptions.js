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
    gruntwork: 
        `Gain 3 extra max health.`,
    hoarder: 
        `Encounter two boon chests in each area.`,
    larger_chests: 
        `All chests contain 2 additional choices and are invulnerable.`,
    limitless: 
        `Fully heal, then remove your max health. If you would be fully healed, heal for 1 instead.`,
    malicious_greeting:
        `Prevents new enemies from spawning during a floor 1/3 of the time.`,
    manic_presence: 
        `Some types of enemies have poor trigger discipline.`,
    medical_investment: 
        `Gain 2 extra max health.`,
    pacifism: 
        `If you would attack an enemy, stun them twice instead (some terrain elements can still `
        +`be damaged). Fully heal at the start of each floor. All boss floor exits unlock.`,
    pain_reflexes: 
        `Take a turn whenever you are attacked.`,
    pandoras_box:
        `Gain a number of random boons equal to your current maximum hp. Reduce your maximum hp to 1.`,
    perfect_the_basics: 
        `Replace all your basic cards with better ones.`,
    picky_shopper: 
        `Recieve 1 extra card choice for adding and removing cards in the shop.`,
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
        `Fully heal and travel to the next boss floor.`,
    shattered_glass: 
        `Enemies and Terrain explode on death damaging everything nearby other than you.`,
    skill_trading: 
        `You may both add a card and remove a card at each shop.`,
    slime_trail: 
        `Every time you move, there is a 1/2 chance of leaving a trail of corrosive slime.`,
    sniper: 
        `Attacks deal extra damage to enemies at a distance based on how far away they are.`,
    soul_voucher:
        `Ignore any cost to obtain new boons. Each boon chest is guaranteed to have at least 1 `
        +`boon with a cost in it.`,
    spiked_shoes: 
        `Attempting to move onto enemies damages them.`,
    spontaneous: 
        `After using a non instant card, discard your whole hand.`,
    stable_mind: 
        `You gain a 50% chance to resist confusion.`,
    stealthy: 
        `Enemies are stunned for two turns at the start of each non boss floor.`,
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
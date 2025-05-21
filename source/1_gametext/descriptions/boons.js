

const boon_names = {
    adrenaline_rush: `Adrenaline Rush`,
    ancient_card: `Ancient Card`,
    bitter_determination: `Bitter Determination`,
    boss_slayer: `Boss Slayer`,
    brag_and_boast: `Brag & Boast`,
    chilly_presence: `Chilly Presence`,
    choose_your_path: `Choose Your Path`,
    creative: `Creative`,
    dazing_blows: `Dazing Blows`,
    deck_stacking: `Deck Stacking`,
    duplicate: `Duplicate`,
    empty_rooms: `Empty Rooms`,
    escape_artist: `Escape Artist`,
    expend_vitality: `Expend Vitality`,
    flame_strike: `Flame Strike`,
    fleeting_thoughts: `Fleeting Thoughts`,
    fortitude: `Fortitude`,
    frenzy: `Frenzy`,
    frugivore: `Frugivore`,
    future_sight: `Future Sight`,
    gruntwork: `Gruntwork`,
    hoarder: `Hoarder`,
    larger_chests: `Larger Chests`,
    learn_from_mistakes: `Learn From Mistakes`,
    limitless: `Limitless`,
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
    roar_of_challenge: `Roar of Challenge`,
    safe_passage: `Safe Passage`,
    serenity: `Serenity`,
    shattered_glass: `Shattered Glass`,
    skill_trading: `Skill Trading`,
    slayer: `Slayer`,
    slime_trail: `Slime Trail`,
    sniper: `Sniper`,
    spiked_shoes: `Spiked Shoes`,
    spontaneous: `Spontaneous`,
    stable_mind: `Stable Mind`,
    stealthy: `Stealthy`,
    stubborn: `Stubborn`,
    thick_soles: `Thick Soles`,
}
Object.freeze(boon_names);


// Boon Descriptions
const adrenaline_rush_description = 
    `Dealing at least 2 damage in 1 turn gives you an extra turn.`;
const bitter_determination_description = 
    `At the start of each floor, heal 1 if your health is exactly 1.`;
const boss_slayer_description = 
    `Bosses start with 2 less hp.`;
const brag_and_boast_description = 
    `Add 2 random boss cards and 2 random debuff cards to your deck.`;
const chilly_presence_description = 
    `Enemies have a 1/6 chance to become stunned at the end of their `
    +`turn. Bosses are not affected.`;
const choose_your_path_description =
    `You get to decide which area to go to after each boss fight.`;
const creative_description = 
    `Increase your hand size by 1. Increases minimum deck size by 5.`;
const dazing_blows_description = 
    `Your attacks stun enemies. Bosses are unaffected.`;
const deck_stacking_description =
    `You pick the order of your deck when it is refilled. Reduce your `
    +`maximum health by 1`;
const duplicate_description =
    `Get a copy of any card in your deck.`
const empty_rooms_description = 
    `Difficulty decreases by 3 floors`;
const escape_artist_description = 
    `Teleport away when attacked.`;
const expend_vitality_description =  
    `Heal 1 life at the start of each floor. Your max health is decreased `
    +`by 1.`;
const flame_strike_description = 
    `Attacking an adjacent empty space has a 1/3 chance of shooting a fireball`;
const fleeting_thoughts_description = 
    `Temporary cards added to your deck will happen instantly.`;
const fortitude_description = 
    `Gain an extra max health.`;
const frenzy_description = 
    `Deal double damage while you only have 1 health.`
const frugivore_description = 
    `50% chance to encounter a fruit tree on each floor. Eating the fruit will heal you `
    +`for 1, but might attract enemies.`;
const future_sight_description = 
    `You may look at the order of your deck.`;
const gruntwork_description =
    `Gain 3 extra max health. Decrease your hand size by 1.`;
const hoarder_description = 
    `Encounter two chests in each area.`;
const larger_chests_description = 
    `All treasure chests contain 2 additional choices and are invulnerable.`;
const learn_from_mistakes_description = 
    `Remove any 2 cards from your deck.`;
const limitless_description = 
    `Remove your max health. Heal for 2. If you would be fully healed, heal `
    +`for 1 instead.`;
const pacifism_description = 
    `If you would attack an enemy, stun them twice instead. Fully heal at `
    +`the start of each floor. All boss floor exits unlock.`;
const pain_reflexes_description = 
    `Take a turn whenever you are attacked.`;
const perfect_the_basics_description =
    `Replace all your basic cards with better ones.`;
const picky_shopper_description = 
    `Recieve an extra card choice for adding and removing cards in the shop.`;
const practice_makes_perfect_description = 
    `Defeating a boss while at max health increases your max health by 1.`;
const practice_makes_perfect_message =
    `Your maximum health has increased.`
const quick_healing_description =
    `After being dealt damage, you have a 1/4 chance to instantly heal it.`;
const pressure_points_description = 
    `When you stun an enemy, there is a 1/3 chance you also deal it 1 damage.`;
const rebirth_description = 
    `When you die, you are revived at full health and this boon is removed.`;
const rebirth_revival_message = 
    `You died, but were brought back to life.`;
const repetition_description = 
    `Every 3rd turn, your cards happen twice.`;
const retaliate_description = 
    `When you are dealt damage, attack a nearby non boss enemy.`;
const roar_of_challenge_description = 
    `Gain 2 max health. Difficulty increases by 5 floors.`;
const safe_passage_description = 
    `Fully heal and travel to the next floor.`;
const serenity_description = 
    `Reduce your minimum deck size to 4.`;
const shattered_glass_description = 
    `Enemies explode on death damaging everything nearby other than you. Reduce your `
    +`max health by 2.`;
const skill_trading_description = 
    `You may both add a card and remove a card at each shop.`;
const slime_trail_description = 
    `Every time you move, there is a 1/2 chance of leaving a trail of corrosive slime.`;
const sniper_description =
    `Attacks deal extra damage to enemies at a distance based on how far away they are.`;
const spiked_shoes_description = 
    `Attempting to move onto enemies damages them. Reduces your max health by 1.`;
const spontaneous_description = 
    `After using a non instant card, discard your whole hand. Minimum deck size `
    +`increased by 5.`;
const stable_mind_description = 
    `You gain a 50% chance to resist confusion.`;
const stealthy_description = 
    `Enemies are stunned for two turns at the start of each floor. Bosses are immune.`;
const stubborn_description = 
    `You can skip shops.`;
const thick_soles_description = 
    `You are immune to damage on your turn.`;

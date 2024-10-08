// ----------------Descriptions.js----------------
// Contains text that will be displayed.

// General.
const game_title = `Maneuver`;
const hand_label_text = `Hand of cards`;
const move_label_text = `Moves`;
const mod_deck = `Choose one card to add or remove:`;
const current_deck = `Current Deck (minimum `;
const welcome_message = `Use cards to move (blue) and attack (red).\n` 
                        + `Click on things to learn more about them.\n`
                        + `Refer to the guidebook if you need more information.`;
const blank_moves_message = `Before choosing what move to make, you must first select a card to use.`;
const floor_message = `Welcome to floor `;
const game_over_message = `Game Over. You were killed by a `;
const retry_message = `Retry?`;
const stunned_msg = `Stunned x`;
const gameplay_screen_name = `Gameplay`;
const guide_screen_name = `Guidebook`;
const tile_description_divider = `\n--------------------\n`;
const card_explanation_start = `Move Options (actions will be performed in order):\n`;
const card_explanation_end = `Shift click on a button to show what it will do on the map.\n`;



// Normal Enemy Descriptions.
const spider_description = `Spider: Will attack the player if it is next to them. Otherwise it will move 1 space closer.`;
const turret_h_description = `Turret: Does not move. Fires beams orthogonally that hit the first thing in their path.`;
const turret_d_description = `Turret: Does not move. Fires beams diagonally that hit the first thing in their path.`;
const turret_r_description = `Turret: Does not move. Fires beams in two directions hitting the first thing in their path. `
                            +`Rotates every turn.`;
const scythe_description = `Scythe: Will move 3 spaces diagonally towards the player damaging them if it passes next to them. `
                            +`Can only see diagonally.`;
const shadow_knight_description = `Shadow Knight: Moves in an L shape. If it tramples the player, it will move again.`;
const spider_web_description = [`Spider Web: Does not move or attack. Spawns a spider every `, ` turns. Slows over time.`];
const ram_description = `Ram: Moves orthogonally. When it sees the player, it will prepare to charge towards them and ram them.`;
const large_porcuslime_description = `Large Porcuslime: Moves towards the player 1 space and attacks in that direction. Weakens when `
                            +`hit.`;
const medium_porcuslime_description = `Medium Porcuslime: Moves towards the player 1 space and attacks in that direction. Alternates `
                            +`between orthoganal and diagonal movement. Splits when hit.`;
const small_h_porcuslime_description = `Small Porcuslime: Moves towards the player 1 space orthogonally and attacks in that direction.`;
const small_d_porcuslime_description = `Small Porcuslime: Moves towards the player 1 space diagonally and attacks in that direction.`;
const acid_bug_description = `Acid bug: Moves towards the player 1 space. Has no normal attack, but will spray acid upon death hurting `
                            +`everything next to it.`;
const brightling_description = `Brightling: Is not aggressive. Will occasionally teleport the player close to it before teleoprting `
                            +`away the next turn.`;
const corrosive_caterpillar_description = `Corrosive Caterpillar: Is not aggressive. Leaves a trail of corrosive slime behind it when `
                            +`it moves or dies.`;
const noxious_toad_description = `Noxious Toad: Every other turn it will hop over a space orthogonally. If it lands near the player, it `
                            +`will damage everything next to it.`;
const vampire_description = `Vampire: Moves orthogonally then will attempt to attack diagonally. When it hits the player, it will heal `
                            +`itself. Teleports away and is stunned when hit.`;
const clay_golem_description = `Clay Golem: Will attack the player if it is next to them. Otherwise it will move 1 space closer. Taking `
                            +`damage will stun it and it cannot move two turns in a row.`;
const vinesnare_bush_description = [`Vinesnare Bush: Does not move. Can drag the player towards it using it's vines from up to `,
                            ` spaces away. It can then lash out at the player if they are still nearby next turn.`];
const rat_description = `Rat: Will attack the player if it is next to them. Otherwise it will move 2 spaces closer. After attacking, `
                            +`it will flee.`;
const shadow_scout_description = `Shadow Scout: Will attack the player if it is next to them. Otherwise it will move 1 space closer. `
                            +`Can go invisible every other turn.`;
const darkling_description = `Darkling: Teleports around randomly hurting everything next to the location it arrives at. Blocking `
                            +`it's rift will destroy it.`;
const orb_of_insanity_description = [`Orb of Insanity: Does not move or attack. If the player is within `, ` spaces of it, it will `
                            +`confuse them, polluting their deck with a bad temporary card.`];
const carrion_flies_description = `Carrion Flies: Will attack the player if they are nearby. Otherwise wanders aimlessly. `
                            +`Over time they will multiply.`;
const magma_spewer_description = `Magma Spewer: Fires magma into the air every other turn. Retreats when you get close.`
const boulder_elemental_description = `Boulder Elemental: Wakes up stunned when something touches it. Each turn, it damages anyone `
                            +`close to it, then moves 1 space closer to the player. After 3 turns of failing to hit anything, it will go `
                            +`back to sleep.`;
const pheonix_description = `Pheonix: Flies to an empty spot 2 or 3 spaces away in a single direction. Everything it flies over will be `
                            +`damaged and set on fire. When it dies, it drops a pile of ashes from which it will eventually be reborn.`;
const igneous_crab_description = `Igneous Crab: Will attack the player if it is next to them. Otherwise it will move 1 space closer. `
                            +`When damaged, it will spend the next 2 turns fleeing.`;
const strider_description = `Strider: Attacks then moves 2 spaces away in one direction.`;
const swaying_nettle_description = `Swaying Nettle: Alternates between attacking the squares orthogonal and diagonal to it. Won't `
                            +`hurt each other`;
const nettle_root_description = `Watch out, swaying nettles are about to sprout damaging anything standing here.`
const thorn_bush_description = `Thorn Bush: Trying to move here hurts. Spreads it's brambles over time.`;
const living_tree_description = `Living Tree: Damages the player if they are exactly 2 spaces away in any direction. `
                            +`Moves one square in any direction every other turn if it didn't attack.`;
const living_tree_rooted_description = `Living Tree: Damages the player if they are exactly 2 spaces away in any direction. `
                            +`This one has put down roots making it unable to move.`
const scorpion_description = `Scorpion: Will attack the player if it is next to them. Otherwise, moves 2 spaces closer every other turn.`;


// Area Descriptions.
const ruins_description = `You have entered the ruins.`;
const sewers_description = `You have entered the sewers.`;
const basement_description = `You have entered the basement.`;
const magma_description = `You have entered the magmatic caves.`;
const crypt_description = `You have entered the crypt.`;
const forest_description = `You have entered the subteranean forest.`;
const library_description = `You have entered the library.`;
const sanctum_description = `You have entered the sanctum.`;
const default_area_description = `You have reached the end of the current content. Floors will continue to generate but there will `
                                +`be no more boss fights. Good luck.`;

// Boss Descriptions.
const boss_death_description = `The exit opens.\n`
                    +`You feel your wounds begin to heal.`;

const velociphile_floor_message = `You hear a deafening shriek.`;
const velociphile_description = `Velociphile (Boss): A rolling ball of mouths and hate. Moves in straight lines. Must build up speed `
                    +`to ram you.`;
const velociphile_death_message = `The wailing falls silent as the Velociphile is defeated.`;

const spider_queen_floor_message = `The floor is thick with webs.`;
const spider_queen_description = `Spider Queen (Boss): Her back crawls with her young. Moves like a normal spider. Taking damage `
                    +`will stun her, but will also spawn a spider.`;
const spider_queen_death_message = `As the Spider Queen falls to the floor, the last of her children emerge.`;

const two_headed_serpent_floor_message = `The discarded skin of a massive creature litters the floor.`;
const two_headed_serpent_awake_description = `Two Headed Serpent (Boss): Moves then attacks 1 square orthogonally. When damaged, the neck `
                    +`will instantly grow a new head.`;
const two_headed_serpent_asleep_description = `Two Headed Serpent (Boss): This head is sleeping. When damaged, the neck will grow a new head, `
                    +`which will spend it's turn waking up. The other head will then fall asleep.`;
const two_headed_serpent_body_description = `Two Headed Serpent (Boss): The scales on the body are too tough to pierce. `;
const two_headed_serpent_death_message = `It's body too small to regenerate any further, all four of the serpent's eyes close for `
                    +`the final time`;

const lich_floor_message = `Dust and dark magic swirl in the air.`;
const lich_description = `Lich (Boss): An undead wielder of dark magic. Alternates between moving one space away from you and casting a spell.\n`
                    +`The Lich is currently preparing to cast:\n`;
const lich_announcement = `The Lich is currently preparing to cast:\n`;
const lich_death_message = `The Lich's body crumbles to dust.`;

const young_dragon_floor_message = `The air burns in your lungs.`;
const young_dragon_description_arr = [
        `Young Dragon (Boss): Be glad it's still young. Alternates between gliding short distances and breathing fire.\n`
        +`The Dragon is currently `, 
        `preparing to fly a short distance.`, 
        `preparing to aim it's fire breath.`, 
        `preparing to breath fire in a cone of length `
    ];
const young_dragon_death_message = `Scales so soft are easily pierced. The Young Dragon's fire goes out.`;
const forest_heart_floor_message = `In the center of the floor stands a massive tree trunk spanning from floor to ceiling.`;
const forest_heart_description = `An ancient tree warped by dark magic. Cannot take more than 1 damage each turn. `;
const forest_heart_rest_description = `Currently, the Forest Heart is resting.`;
const forest_heart_growth_description = `Currently, the Forest Heart is preparing to grow plants.`;
const forest_heart_summon_description = `Currently, the Forest Heart is preparing to summon forest creatures.`;
const forest_heart_death_message = `Branches rain from above as the ancient tree is felled.`


// Lich Spell Descriptions.
const teleport_spell_description = `Teleport: The user moves to a random square on the map`;
const summon_spell_description = `Summon: Summons a random enemy`;
const earthquake_spell_description = `Earthquake: Causes chunks of the ceiling to rain down.`;
const flame_wave_spell_description = `Flame Wave: Shoots 3 explosive fireballs towards the target.`;
const confusion_spell_description = `Confusion: Pollutes your deck with 2 bad temporary cards.`;
const lava_moat_spell_description = `Lava Moat: Creates pools of molten lava to shield the user.`;
const piercing_beam_spell_description = `Piercing Beam: Fires a piercing beam in the direction closest to the target.`;
const rest_spell_description = `Nothing.`;


// Other Tile Descriptions.
const empty_description = `There is nothing here.`;
const exit_description = `Stairs: Takes you to the next floor.`;
const player_description = `You: Click a card to move.`;
const lava_pool_description = `Lava Pool: Attempting to move here will hurt.`;
const corrosive_slime_description = `Corrosive Slime: Stepping into this will hurt. Clear it out by attacking.`;
const wall_description = `Wall: It seems sturdy.`;
const damaged_wall_description = `Damaged Wall: Something might live inside.`;
const lock_description = `Locked Exit: Defeat the boss to continue.`;
const fireball_description = `Fireball: Moves forwards until it comes into contact with something, then damages it.`;
const falling_rubble_description = `Watch out, something is about to fall here.`;
const darkling_rift_description = `If this space isn't blocked, a darkling will teleport here next turn damaging everything nearby.`;
const chest_description = `Chest: It might have something useful inside. Breaking it will damage the contents.`;
const armored_chest_description = `Armored Chest: It might have something useful inside. It is larger than a normal chest and armored `
        +`to protect it's contents.`;
const magmatic_boulder_description = `Magmatic Boulder: The light reflecting off of it gives you the feeling of being watched.`;
const smoldering_ashes_description = [`Smoldering Ashes: A pheonix will be reborn here in `, ` turns unless you scatter the ashes `
        +`by attacking them or moving onto them.`];
const raging_fire_description = `Raging Fire: The very ground here is burning. It will grow weaker every turn, but it's not safe to `
        +`move through.`;
const coffin_description = `Coffin: There is no telling whether whatever is inside is still alive or not. Touch it at your own risk.`;
const sewer_grate_description = `Sewer Grate: It's clogged. Corrosive slime is oozing out.`;
const repulsor_description = `Repulsor: Pushes nearby creatures away by 2 spaces on it's turn or if touched. Takes 2 turns to `
        +`recharge afterwards.`;
const thorn_bramble_description = `Thorn Bramble: Trying to move here hurts. Allows the thorn bush to spread further.`;
const thorn_root_description = `Watch out, brambles are about to sprout damaging anything standing here.`
const enticing_fruit_tree_description = `Enticing Fruit Tree: Moving you here will heal you, but other creatures may be attracted by `
        +`the fruit.`;
const rotting_fruit_tree_description = `Rotting Fruit Tree: None of the remaining fruit is edible, but the smell could still attract `
        +`creatures if it is disturbed.`;

// Chest descriptions.
const chest_inner_discription = `Choose up to one reward:`;
const take_from_chest = `Take`;
const abandon_chest = `Abandon`;
const add_card_description = `Add this card to your deck.`


// Button Options.
const null_move_button = `--`;
const NW = `NW`;
const N = `N`;
const NE = `NE`;
const E = `E`;
const SE = `SE`;
const S = `S`;
const SW = `SW`;
const W = `W`;
const C = `C`;
const SPIN = `Spin`;

// Directions.
const four_directions = {
    up: `Up`,
    down: `Down`,
    left: `Left`,
    right: `Right`
}


// Move types.
const move_types = {
    alt: `Shift click on a button to show what it will do on the map.`,
    intro: `Move Options (actions will be performed in order):\n`,

    attack: `Attack`,
    move: `Move`,
    teleport: `Teleport you to a random space`,
    stun: `Stun`,
    confuse: `Confuse: you. Adds a bad temporary card to your deck.`,
    move_until: `Keep Moving`,
    heal: `Heal`,
    you: `you`,
    nothing: `Do nothing`,
    
    per_floor: `Once Per Floor: after being played, this card will disapear for the rest of the floor.`,
    temp: `Temporary: this card will be removed from your deck when used, or at the end of the floor.`,
    instant: `Instant: you will take an extra turn after playing this card.`
}
Object.freeze(move_types);

// Move types.
const boon_names = {
    adrenaline_rush: `Adrenaline Rush`,
    ancient_card: `Ancient Card`,
    bitter_determination: `Bitter Determination`,
    brag_and_boast: `Brag & Boast`,
    creative: `Creative`,
    dazing_blows: `Dazing Blows`,
    escape_artist: `Escape Artist`,
    expend_vitality: `Expend Vitality`,
    fleeting_thoughts: `Fleeting Thoughts`,
    fortitude: `Fortitude`,
    future_sight: `Future Sight`,
    hoarder: `Hoarder`,
    learn_from_mistakes: `Learn From Mistakes`,
    limitless: `Limitless`,
    pacifism: `Pacifism`,
    pain_reflexes: `Pain Reflexes`,
    picky_shopper: `Picky Shopper`,
    rebirth: `Rebirth`,
    repetition: `Repetition`,
    roar_of_challenge: `Roar of Challenge`,
    safe_passage: `Safe Passage`,
    serenity: `Serenity`,
    shattered_glass: `Shattere Glass`,
    skill_trading: `Skill Trading`,
    slayer: `Slayer`,
    spiked_shoes: `Spiked Shoes`,
    spined_armor: `Spined Armor`,
    spontaneous: `Spontaneous`,
    stable_mind: `Stable Mind`,
    stealthy: `Stealthy`,
    stubborn: `Stubborn`,
    thick_soles: `Thick Soles`,
}
Object.freeze(move_types);

const adrenaline_rush_description = `Dealing at least 2 damage in 1 turn gives you an extra turn.`;
const ancient_card_description = add_card_description;
const bitter_determination_description = `At the start of each floor, heal 1 if your health is exactly 1.`;
const brag_and_boast_description = `Add 2 random boss cards and 1 random debuff card to your deck.`;
const creative_description = `Increase your hand size by 1. Increases minimum deck size by 5.`;
const dazing_blows_description = `Your attacks stun enemies. Bosses are unaffected.`;
const escape_artist_description = `Teleport away when attacked.`;
const expend_vitality_description =  `Heal 1 life at the start of each floor. Your max health is decreased by 1.`;
const fleeting_thoughts_description = `Temporary cards added to your deck will happen instantly.`;
const fortitude_description = `Gain an extra max health.`;
const future_sight_description = `You may look at the order of your deck.`;
const hoarder_description = `All treasure chests contain 2 additional choices and are invulnerable.`;
const learn_from_mistakes_description = `Remove any 2 cards from your deck.`;
const limitless_description = `Remove your max health. Heal for 2. If you would be fully healed, heal for 1 instead.`;
const pacifism_description = `If you would attack an enemy, stun them twice instead. Fully heal at the start of each floor. `
                            +`All boss floor exits unlock.`;
const pain_reflexes_description = `Take a turn whenever you are attacked.`;
const picky_shopper_description = `Recieve an extra card choice for adding and removing cards in the shop.`;
const rebirth_description = `When you die, you are revived at full health and this boon is removed.`;
const rebirth_revival_message = `You died, but were brought back to life.`;
const repetition_description = `Every 3rd turn, your cards happen twice.`;
const roar_of_challenge_description = `Gain 2 max health. Difficulty increases by 5 floors.`;
const safe_passage_description = `Fully heal and travel to the next floor.`;
const serenity_description = `Reduce your minimum deck size to 4.`;
const shattered_glass_description = `Enemies explode on death damaging each other nearby enemy. Reduce your max health by 1.`;
const skill_trading_description = `You may both add a card and remove a card at each shop.`;
const slayer_description = `When you damage an enemy 3 turns in a row, heal for 1.`;
const spiked_shoes_description = `Attempting to move onto enemies damages them. Reduces your max health by 1.`;
const spined_armor_description = `Retaliate for 1 damage when attacked. Bosses are immune.`;
const spontaneous_description = `After using a non instant card, discard your whole hand. Minimum deck size increased by 5.`;
const stable_mind_description = `You gain a 50% chance to resist confusion.`;
const stealthy_description = `Enemies are stunned for two turns at the start of each floor. Bosses are immune.`;
const stubborn_description = `You can decide to skip shops.`;
const thick_soles_description = `You are immune to damage on your turn.`;


const SIDEBAR_BUTTONS = {
    text_log: `Messages`, 
    boon_list: `Boons`, 
    discard_pile: `Discard`, 
    initiative: `Initiative`, 
    deck_order: `Deck`,
    sidebar: `Sidebar`
}
Object.freeze(SIDEBAR_BUTTONS);

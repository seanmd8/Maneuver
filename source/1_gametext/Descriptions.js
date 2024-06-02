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
const floor_message = `Welcome to floor `;
const game_over_message = `Game Over. You were killed by a `;
const retry_message = `Retry?`;
const stunned_msg = `Stunned x`;
const gameplay_screen_name = `Gameplay`;
const guide_screen_name = `Guidebook`;


// Normal Enemy Descriptions.
const spider_description = `Spider: Will attack the player if it is next to them. Otherwise it will move 1 space closer.`;
const turret_h_description = `Turret: Does not move. Fires beams orthogonally that hit the first thing in their path.`;
const turret_d_description = `Turret: Does not move. Fires beams diagonally that hit the first thing in their path.`;
const turret_r_description = `Turret: Does not move. Fires beams in two directions hitting the first thing in their path. `
                            +`Rotates every turn.`;
const scythe_description = `Scythe: Will move 3 spaces diagonally towards the player damaging them if it passes next to them. `
                            +`Can only see diagonally.`;
const shadow_knight_description = `Shadow Knight: Moves in an L shape. If it tramples the player, it will move again.`;
const spider_web_description = [`Spider Web: Does not move or attack. Spawns a spider every `, ` turns.`];
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
                            +`Can go invisible every other turn.`
const darkling_description = `Darkling: Teleports around randomly hurting everything next to the location it arrives at. Blocking `
                            +`it's rift will destroy it.`;
const orb_of_insanity_description = [`Orb of Insanity: Does not move or attack. If the player is within `, ` spaces of it, it will `
                            +`pollute their deck with a bad temporary card.`]
const carrion_flies_description = `Carrion Flies: Will only attack if the player is nearby. Otherwise they will wander aimlessly. `
                            +`Over time they will multiply.`;
const magma_spewer_description = `Magma Spewer: Alternates between firing magma into the air and retreating.`


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
const lich_description = `Lich (Boss): An undead wielder of dark magic. Each turn it will move away 1 space and then cast a spell.\n`
                    +`The Lich is currently preparing to cast:\n`;
const lich_death_message = `The Lich's body crumbles to dust.`;

const young_dragon_floor_message = `The air burns in your lungs.`;
const young_dragon_description_arr = [`Young Dragon (Boss): Alternates between gliding short distances and breathing fire.\n`
                    + `The Dragon is currently `, `preparing to fly a short distance.`, `preparing to aim it's fire breath.`,
                      `preparing to breath fire in a cone of length `]; // Todo
const young_dragon_death_message = `Scales so soft are easily pierced. The Young Dragon's fire goes out.`;

// Lich Spell Descriptions.
const teleport_spell_description = `Teleport: The user moves to a random square on the map`;
const summon_spell_description = `Summon: Summons a random enemy`;
const earthquake_spell_description = `Earthquake: Causes chunks of the ceiling to rain down. Intensity increases at low health.`;
const flame_wave_spell_description = `Flame Wave: Creates 3 fireballs which will move forwards until they hit something.`;
const confusion_spell_description = `Confusion: Pollutes your deck with 2 bad temporary cards.`;
const lava_moat_spell_description = `Lava Moat: Creates pools of molten lava to shield the user. Creates more at high health.`;
const rest_description = `Nothing.`;


// Other Tile Descriptions.
const empty_description = `There is nothing here.`;
const exit_description = `Stairs to the next floor.`;
const player_description = `You.`;
const lava_pool_description = `Lava Pool: Attempting to move here will hurt.`;
const corrosive_slime_description = `Corrosive Slime: Trying to walk in this will hurt. Clear it out by attacking.`;
const wall_description = `A wall. It seems sturdy.`;
const damaged_wall_description = `A damaged wall. Something might live inside.`;
const lock_description = `The exit is locked. Defeat the boss to continue.`;
const fireball_description = `A fireball. Moves forwards until it comes into contact with something, then damages it.`;
const falling_rubble_description = `Watch out, something is about to fall here.`;
const darkling_rift_description = `If this space isn't blocked, a darkling will teleport here next turn damaging everything nearby.`;
const chest_description = `A chest. It might have something useful inside. Breaking it might damage the contents.`;


// Chest descriptions.
const chest_inner_discription = `Choose up to one reward:`;
const take_from_chest = `Take`;
const abandon_chest = `Abandon`;
const add_card_description = `Add this card to your deck.`


// Cardinal Directions.
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

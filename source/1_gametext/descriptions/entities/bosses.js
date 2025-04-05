// Boss Descriptions
const boss_death_description = 
    `The exit opens.\nYou feel your wounds begin to heal.`;

// Velociphile
const velociphile_floor_message = 
    `You hear a deafening shriek.`;
const velociphile_description = 
    `Velociphile (Boss): A rolling ball of mouths and hate. Moves `
    +`in straight lines. Must build up speed to ram you.`;
const velociphile_death_message = 
    `The wailing falls silent as the Velociphile is defeated.`;

// Spider Queen
const spider_queen_floor_message = 
    `The floor is thick with webs.`;
const spider_queen_description = 
    `Spider Queen (Boss): Her back crawls with her young. Moves like a `
    +`normal spider. Taking damage will stun her, but will also spawn a spider.`;
const spider_queen_death_message = 
    `As the Spider Queen falls to the floor, the last of her children emerge.`;

// Two Headed Serpent
const two_headed_serpent_floor_message = 
    `The discarded skin of a massive creature litters the floor.`;
const two_headed_serpent_awake_description = 
    `Two Headed Serpent (Boss): Moves then attacks 1 square orthogonally. `
    +`When damaged, the neck will instantly grow a new head.`;
const two_headed_serpent_asleep_description = 
    `Two Headed Serpent (Boss): This head is sleeping. When damaged, `
    +`the neck will grow a new head, which will spend it's turn waking up. `
    +`The other head will then fall asleep.`;
const two_headed_serpent_body_description = 
    `Two Headed Serpent (Boss): The scales on the body are too tough to pierce. `;
const two_headed_serpent_death_message = 
    `It's body too small to regenerate any further, all four of the serpent's `
    +`eyes close for the final time`;

// Lich
const lich_floor_message = 
    `Dust and dark magic swirl in the air.`;
const lich_description = 
    `Lich (Boss): An undead wielder of dark magic. Alternates between moving `
    +`one space away from you and casting a spell.\nThe Lich is currently preparing `
    +`to cast:\n`;
const lich_announcement = 
    `The Lich is currently preparing to cast:\n`;
const lich_death_message = 
    `The Lich's body crumbles to dust.`;

// Lich Spells
const teleport_spell_description = 
    `Teleport: The user moves to a random square on the map`;
const summon_spell_description = 
    `Summon: Summons a random enemy`;
const earthquake_spell_description = 
    `Earthquake: Causes chunks of the ceiling to rain down.`;
const flame_wave_spell_description = 
    `Flame Wave: Shoots 3 explosive fireballs towards the target.`;
const confusion_spell_description = 
    `Confusion: Pollutes your deck with 2 bad temporary cards.`;
const lava_moat_spell_description = 
    `Lava Moat: Creates pools of molten lava to shield the user.`;
const piercing_beam_spell_description = 
    `Piercing Beam: Fires a piercing beam in the direction closest to the target.`;
const rest_spell_description = 
    `Nothing.`;

// Young Dragon
const young_dragon_floor_message = 
    `The air burns in your lungs.`;
const young_dragon_description_arr = [
    `Young Dragon (Boss): Be glad it's still young. Alternates between `
    +`gliding short distances and breathing fire.\nThe Dragon is currently `, 
    `preparing to fly a short distance.`, 
    `preparing to aim it's fire breath.`, 
    `preparing to breath fire in a cone of length `
];
const young_dragon_death_message = 
    `Scales so soft are easily pierced. The Young Dragon's fire goes out.`;

// Forest Heart
const forest_heart_floor_message = 
    `In the center of the floor stands a massive tree trunk spanning from floor to ceiling.`;
const forest_heart_description = 
    `An ancient tree warped by dark magic. Cannot take more than 1 damage each turn. `;
const forest_heart_death_message = 
    `Branches rain from above as the ancient tree is felled.`

// Forest Heart Spells
const forest_heart_rest_description = 
    `Currently, the Forest Heart is resting.`;
const forest_heart_growth_description = 
    `Currently, the Forest Heart is preparing to grow plants.`;
const forest_heart_summon_description = 
    `Currently, the Forest Heart is preparing to summon forest creatures.`;

// Arcane Sentry
const arcane_sentry_floor_message =
    `An alarm begins to blare.\n`
    +`INTRUDER DETECTED!`
const arcane_sentry_description =
    `An automated defense station. Changes modes in response to damage.`;
const arcane_sentry_death_message =
    `MAIN SYSTEMS FAILING!\n`
    +`The wailing alarm falls silent.`;
const arcane_sentry_node_description =
    `A transformable node controlled by the Arcane Sentry.`
const arcane_sentry_node_death_message =
    `NODE OFFLINE!`;

// Arcane Sentry Modes
const sentry_core_turret_description =
    `Currently the nodes are set to act as turrets.\n`
    +`While in this mode, the sentry will continuously create paper constructs.`
const sentry_node_turret_description =
    `Fires beams orthogonally that hit the first thing in their path.`
const sentry_core_saw_description =
    `Spinning saws will damage everything around it or touching it, then it will move 1 space orthogonally.\n`
    +`After 3 turns, it will revert.`
const sentry_node_saw_description =
    `Spinning saws will damage everything around it or touching it.`
const sentry_core_cannon_description =
    `Currently preparing to shoot volleys of fireballs.\n`
    +`After 2 volleys, it will revert.`
const sentry_node_cannon_description =
    `Shoots a fireball in the direction it is aimed.`
const sentry_node_double_cannon_description =
    `Shoots 2 fireballs in the direction it is aimed.`

/**
// Shadow of Self
const shadow_of_self_floor_message = 
    `A familiar face watches you from the shadows.`;
const shadow_of_self_description = 
    `You?`;
const shadow_of_self_death_message = 
    `Shadows cannot hold a candle to the real thing.`
*/

const boss_names = {
    arcane_sentry: `Arcane Sentry`,
    arcane_sentry_node: `Arcane Sentry Node`,
    forest_heart: `Forest Heart`,
    lich: `Lich`,
    spider_queen: `Spider Queen`,
    two_headed_serpent: `Two Headed Serpent`,
    two_headed_serpent_body: `Two Headed Serpent Body`,
    velociphile: `Velociphile`,
    young_dragon: `Young Dragon`,
}
Object.freeze(boss_names);

const boss_descriptions = {
    arcane_sentry: 
        `Arcane Sentry (Boss): An automated defense station. Changes modes in response to damage.`,
    arcane_sentry_node: 
        `Arcane Sentry Node: A transformable node controlled by the Arcane Sentry. Cannot be stunned.`,
    forest_heart: 
        `Forest Heart (Boss): An ancient tree warped by dark magic. Cannot take more than 1 damage `
        +`each turn and cannot be stunned.`,
    lich: 
        `Lich (Boss): An undead wielder of dark magic. Alternates between moving `
        +`one space away from you and casting a spell.`,
    lich_announcement: 
        `The Lich is currently preparing to cast:`,
    spider_queen: 
        `Spider Queen (Boss): Her back crawls with her young. Moves like a `
        +`normal spider. Taking damage will stun her, but will also spawn a spider.`,
    two_headed_serpent_awake: 
        `Two Headed Serpent (Boss): Moves then attacks 1 square orthogonally. `
        +`When damaged, the neck will instantly grow a new head.`,
    two_headed_serpent_asleep: 
        `Two Headed Serpent (Boss): This head is sleeping. When damaged, `
        +`the neck will grow a new head, which will spend it's turn waking up. `
        +`The other head will then fall asleep.`,
    two_headed_serpent_body: 
        `Two Headed Serpent (Boss): The scales on the body are too tough to pierce.`,
    velociphile: 
        `Velociphile (Boss): A rolling ball of mouths and hate. Moves `
        +`in straight lines. Must build up speed to ram you.`,
    young_dragon: [
        `Young Dragon (Boss): Be glad it's still young. Alternates between gliding and breathing fire.\n`
        +`The Dragon is currently `, 
        `preparing to fly a short distance.`, 
        `preparing to aim it's fire breath.`, 
        `preparing to breath fire in a 3 long cone.`
    ],
}
Object.freeze(boss_descriptions);

const boss_floor_message = {
    arcane_sentry: 
        `An alarm begins to blare.\n`
        +`INTRUDER DETECTED!`,
    forest_heart: `In the center of the floor stands a massive tree trunk spanning from floor to ceiling.`,
    lich: `Dust and dark magic swirl in the air.`,
    spider_queen: `The floor is thick with webs.`,
    two_headed_serpent: `The discarded skin of a massive creature litters the floor.`,
    velociphile: `You hear a deafening shriek.`,
    young_dragon: `The air burns in your lungs.`,
}
Object.freeze(boss_floor_message);

const boss_death_message = {
    general: 
        `The exit opens.\n`
        +`You feel your wounds begin to heal.`,
    arcane_sentry: 
        `MAIN SYSTEMS FAILING!\n`
        +`The ringing alarm subsides.`,
    arcane_sentry_node: `NODE OFFLINE!`,
    forest_heart: `Branches rain from above as the ancient tree is felled.`,
    lich: `The Lich's body crumbles to dust.`,
    spider_queen: `As the Spider Queen falls to the floor, the last of her children emerge.`,
    two_headed_serpent: 
        `It's body too small to regenerate any further, all four of the serpent's `
        +`eyes close for the final time`,
    velociphile: `The wailing falls silent as the Velociphile is defeated.`,
    young_dragon: `Scales so soft are easily pierced. The Young Dragon's fire goes out.`,
}
Object.freeze(boss_death_message);

// Boss Specific Descriptions

const lich_spell_descriptions = {
    confusion: `Confusion: Pollutes your deck with 2 bad temporary cards.`,
    earthquake: `Earthquake: Causes chunks of the ceiling to rain down.`,
    flame_wave: `Flame Wave: Shoots 3 explosive fireballs towards the target.`,
    lava_moat: `Lava Moat: Creates pools of molten lava to shield the user.`,
    piercing_beam: `Piercing Beam: Fires a piercing beam in the direction closest to the target.`,
    rest: `Nothing.`,
    summon: `Summon: Summons a random enemy`,
    teleport: `Teleport: The user moves to a random square on the map`,
}
Object.freeze(lich_spell_descriptions);

const heart_spell_descriptions = {
    rest: `Currently, the Forest Heart is resting.`,
    growth: `Currently, the Forest Heart is preparing to grow plants.`,
    summon: `Currently, the Forest Heart is preparing to summon forest creatures.`,
}
Object.freeze(heart_spell_descriptions);

const sentry_mode_descriptions = {
    core: {
        turret: 
            `Currently the nodes are set to act as turrets.\n`
            +`While in this mode, the sentry will continuously create paper constructs.`,
        saw: 
            `Spinning saws will damage everything around it or touching it, then it will move 1 space `
            +`orthogonally.\n`
            +`After 3 turns, it will revert.`,
        cannon: 
            `Currently preparing to shoot volleys of fireballs.\n`
            +`After 2 volleys, it will revert.`,
    },
    node: {
        turret: `Fires beams orthogonally that hit the first thing in their path.`,
        saw: `Spinning saws will damage everything around it or touching it.`,
        cannon: `Shoots a fireball in the direction it is aimed.`,
        double_cannon: `Shoots 2 fireballs in the direction it is aimed.`,
    }
}
Object.freeze(sentry_mode_descriptions);
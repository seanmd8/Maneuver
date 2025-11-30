const boss_descriptions = {
    arcane_sentry: 
        `Arcane Sentry (Boss): An automated defense station. Changes modes in response to damage.`,
    arcane_sentry_node: 
        `Arcane Sentry Node: A transformable node controlled by the Arcane Sentry. Cannot be stunned.`,
    forest_heart: 
        `Forest Heart (Boss): An ancient tree warped by dark magic. Cannot take more than 1 damage `
        +`each turn and cannot be stunned. Reacts to damage by calling for aid from the forest.`,
    lich: 
        `Lich (Boss): An undead wielder of dark magic. Alternates between moving `
        +`one space away from you and casting a spell.`,
    lich_announcement: 
        `The Lich is preparing to cast:`,
    lich_change_announcement: 
        `The Lich changed it's spell to:`,
    lord_of_shadow_and_flame:
        `Lord of Shadow and Flame (Final Boss): Ruler from beyond the veil of reality. Summons `
        +`altars from which to cast it's spells. When next to the player it will prepare to attack `
        +`all nearby spaces on it's next turn. While under half health, it moves at double speed `
        +`and it's attacks cause shockwaves. Taking damage reduces stun by that much.`,
    spider_queen: 
        `Spider Queen (Boss): Her back crawls with her young. Behaves like a normal spider. Taking `
        +`damage will stun her, but will also spawn a spider.`,
    two_headed_serpent_awake: 
        `Two Headed Serpent (Boss): Moves 1 square orthogonally, then attacks 1 square orthogonally. `
        +`When damaged, the neck will instantly grow into a new head.`,
    two_headed_serpent_asleep: 
        `Two Headed Serpent (Boss): This head is sleeping. When damaged, the neck will grow a new `
        +`head, which will spend it's turn waking up. The other head will then fall asleep.`,
    two_headed_serpent_body: 
        `Two Headed Serpent (Boss): The scales on the body are too tough to pierce.`,
    velociphile: 
        `Velociphile (Boss): A rolling ball of mouths and hate. Moves in one direction until it hits `
        +`something, then attacks in that direction. Cannot attack the squares next to it.`,
    young_dragon: [
        `Young Dragon (Boss): Be glad it's still young. Alternates between gliding and breathing fire.\n`
        +`The Dragon is currently `, 
        `preparing to fly a short distance.`, 
        `preparing to aim it's fire breath.`, 
        `preparing to breath fire in a 3 long cone.`
    ],
}
Object.freeze(boss_descriptions);
const other_tile_descriptions = {
    altar_of_scouring:
        `Altar of Scouring: Activate by moving here. When activated, creates a wall of fireballs along `
        +`the furthest wall to wipe the screen clean.`,
    altar_of_shadow:
        `Altar of Shadow: Activate by moving here. When activated, the Lord of Shadow and Flame will `
        +`become invisible until another altar is activated.`,
    altar_of_singularity:
        `Altar of Singularity: Activate by moving here. When activated, create a Black Hole in this space.`,
    altar_of_space:
        `Altar of Space: Activate by moving here. When activated, rearrange everything on the floor.`,
    altar_of_stars:
        `Altar of Stars: Activate by moving here. When activated, for the next 3 turns it will `
        +`summon an object from another realm targeting the player's location.`,
    altar_of_stasis:
        `Altar of Stasis: Activate by moving here. When activated, rewinds time healing the Lord `
        +`of Shadow and Flame by 3 and all altars by 1.`,
    altar_of_sunlight:
        `Altar of Sunlight: Activate by moving here. When activated, create an expanding fire centered `
        +`on the player's location.`,
    black_hole: 
        `Black Hole: Draws everything on screen closer to it. The Lord of Shadow and Flame is immune. `
        +`Decays every turn and cannot be stunned.`,
    bookshelf: 
        `Bookshelf: When damaged, adds a random temporary card to your deck. Cannot give healing cards.`,
    coffin: 
        `Coffin: There is no telling whether whatever is inside is still alive or not. On the other `
        +`hand there could be treasure inside. Disturb it at your own risk.`,
    corrosive_slime: 
        `Corrosive Slime: Stepping into this will hurt. Clear it out by attacking.`,
    fireball: 
        `Fireball: Moves forwards until it comes into contact with something, then damages it. Cannot `
        +`be stunned.`,
    fruit_tree_enticing: 
        `Enticing Fruit Tree: Moving here will heal you, but other creatures may be attracted by the `
        +`smell of the fruit.`,
    fruit_tree_rotting: 
        `Rotting Fruit Tree: None of the remaining fruit is edible, but the smell could still attract `
        +`creatures if it is disturbed.`,
    lava_pool: 
        `Lava Pool: Attempting to move here will hurt.`,
    magmatic_boulder: 
        `Magmatic Boulder: The light reflecting off of it gives you the feeling of being watched.`,
    moon_rock:
        `Moon Rock: A chunk of fragile rock from somewhere else.`,
    raging_fire: 
        `Raging Fire: The very ground here is burning. Attempting to move here will hurt. Decays every `
        +`turn and cannot be stunned`,
    repulsor: 
        `Repulsor: Pushes nearby creatures away by 2 spaces on it's turn or if touched. Takes 3 turns `
        +`to recharge afterwards.`,
    sewer_grate: 
        `Sewer Grate: It's clogged. Corrosive slime is oozing out.`,
    shatter_sphere_d:
        `Shatter Sphere: Explodes when damaged harming everything diagonal to it.`,
    shatter_sphere_o:
        `Shatter Sphere: Explodes when damaged harming everything orthogonal to it.`,
    smoldering_ashes: [
        `Smoldering Ashes: A pheonix will be reborn here in `, 
        ` turns unless you scatter the ashes by attacking or moving onto them.`
    ],
    thorn_bramble: 
        `Thorn Bramble: Attempting to move here hurts. Allows the thorn bush to spread further.`,
    wall: 
        `Wall: It seems sturdy.`,
    wall_damaged: 
        `Damaged Wall: Something might live inside.`,
}
Object.freeze(other_tile_descriptions);

const other_tile_names = {
    altar_of_scouring: `Altar of Scouring`,
    altar_of_shadow: `Altar of Shadow`,
    altar_of_singularity: `Altar of Singularity`,
    altar_of_space: `Altar of Space`,
    altar_of_stars: `Altar of Stars`,
    altar_of_stasis: `Altar of Stasis`,
    altar_of_sunlight: `Altar of Sunlight`,
    black_hole: `Black Hole`,
    bookshelf: `Bookshelf`,
    coffin: `Coffin`,
    corrosive_slime: `Corrosive Slime`,
    fireball: `Fireball`,
    fruit_tree_enticing: `Enticing Fruit Tree`,
    fruit_tree_rotting: `Rotting Fruit Tree`,
    lava_pool: `Lava Pool`,
    magmatic_boulder: `Magmatic Boulder`,
    moon_rock: `Moon Rock`,
    raging_fire: `Raging Fire`,
    repulsor: `Repulsor`,
    sewer_grate: `Sewer Grate`,
    shatter_sphere: `Shatter Sphere`,
    smoldering_ashes: `Smoldering Ashes`,
    thorn_bramble: `Thorn Brambles`,
    wall: `Wall`,
    wall_damaged: `Damaged Wall`,
}
Object.freeze(other_tile_names);
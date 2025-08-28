// Normal Enemy Descriptions.

const enemy_descriptions = {
    acid_bug: 
        `Acid bug: Moves towards the player 1 space. Has no normal attack, `
        +`but will spray acid upon death hurting everything next to it.`,
    animated_boulder: 
        `Animated Boulder: Wakes up when something touches it. Each turn it will `
        +`damage everything close to it, then move 1 space closer to the player. `
        +`After 3 turns, it will go back to sleep.`,
    brightling: 
        `Brightling: Is not aggressive. Will occasionally teleport the player `
        +`close to it before teleoprting away the next turn.`,
    captive_void: 
        `Captive Void: Creatures within two spaces will be drawn towards it. Damaging it `
        +`turns it off for 2 turns.`,
    carrion_flies: 
        `Carrion Flies: Will attack the player if they are nearby. Otherwise wanders `
        +`aimlessly. Over time they will multiply.`,
    clay_golem: 
        `Clay Golem: Will attack the player if it is next to them. Otherwise `
        +`it will move 1 space closer. Taking damage will stun it and it cannot `
        +`move two turns in a row.`,
    corrosive_caterpillar: 
        `Corrosive Caterpillar: Is not aggressive. Leaves a trail of corrosive `
        +`slime behind it when it moves or dies.`,
    darkling: 
        `Darkling: Teleports around randomly hurting everything next to the location it `
        +`arrives at. Blocking it's rift will destroy it.`,
    gem_crawler: 
        `Gem Crawler: Every other turn it will move 1 space closer to the player, then attack them if `
        +`it is next to them.`,
    igneous_crab: 
        `Igneous Crab: Will attack the player if it is next to them. Otherwise it will `
        +`move 1 space closer. When damaged, it will spend the next 2 turns fleeing.`,
    living_tree: 
        `Living Tree: Damages the player if they are exactly 2 spaces away in any direction. `
        +`Moves one square in any direction every other turn if it didn't attack.`,
    living_tree_rooted: 
        `Living Tree: Damages the player if they are exactly 2 spaces away in any direction. `
        +`This one has put down roots making it unable to move.`,
    magma_spewer: 
        `Magma Spewer: Fires magma into the air every other turn. Retreats when you `
        +`get close.`,
    noxious_toad: 
        `Noxious Toad: Every other turn it will hop over a space orthogonally. `
        +`If it lands near the player, it will damage everything next to it.`,
    orb_of_insanity: 
        `Orb of Insanity: Does not move or attack. If the player is within `
        +`2 spaces of it, it will confuse them, polluting their deck with a bad temporary card.`,
    paper_construct: 
        `Paper Construct: Can shoot the player from up to 2 spaces away orthogonally. Otherwise, `
        +`moves up to two spaces diagonally.`,
    pheonix: 
        `Pheonix: Flies to an empty spot 2 or 3 spaces away in a single direction. `
        +`Everything it flies over will be damaged and set on fire. When it dies, `
        +`it drops a pile of ashes from which it will eventually be reborn.`,
    porcuslime_large: 
        `Large Porcuslime: Moves towards the player 1 space and attacks `
        +`in that direction. Weakens when hit.`,
    porcuslime_medium: 
        `Medium Porcuslime: Moves towards the player 1 space and attacks `
        +`in that direction. Alternates between orthoganal and diagonal `
        +`movement. Splits when hit.`,
    porcuslime_small_d: 
        `Small Porcuslime: Moves towards the player 1 space diagonally and `
        +`attacks in that direction.`,
    porcuslime_small_h: 
        `Small Porcuslime: Moves towards the player 1 space orthogonally `
        +`and attacks in that direction.`,
    ram: 
        `Ram: Moves orthogonally. When it sees the player, it will `
        +`prepare to charge towards them and ram them.`,
    rat: 
        `Rat: Will attack the player if it is next to them. Otherwise it will move `
        +`2 spaces closer. After attacking, it will flee.`,
    scorpion: 
        `Scorpion: Will attack the player if it is next to them. Otherwise, moves 2 spaces `
        +`closer every other turn.`,
    scythe: 
        `Scythe: Will move 3 spaces diagonally towards the player `
        +`damaging them if it passes next to them. Can only see diagonally.`,
    shadow_knight: 
        `Shadow Knight: Moves in an L shape. If it tramples the player, `
        +`it will move again.`,
    shadow_scout: 
        `Shadow Scout: Will attack the player if it is next to them. Otherwise it will `
        +`move 1 space closer. Can go invisible every other turn.`,
    specter: 
        `Specter: Can travel up to 3 spaces orthogonally. While doing so, it can pass through tiles `
        +`without costing movement. Passing through a tile damages and stuns/confuses it.`,
    spider_web: [
        `Spider Web: Does not move or attack. Spawns a spider every `, 
        ` turns. Slows over time.`
    ],
    spider: 
        `Spider: Will attack the player if it is next to them. `
        +`Otherwise it will move 1 space closer.`,
    strider: 
        `Strider: Attacks then moves 2 spaces away in one direction.`,
    swaying_nettle: 
        `Swaying Nettle: Alternates between attacking the squares orthogonal and diagonal `
        +`to it. Won't hurt each other`,
    thorn_bush: 
        `Thorn Bush: Trying to move here hurts. Spreads it's brambles over time.`,
    turret_d: 
        `Turret: Does not move. Fires beams diagonally that hit the `
        +`first thing in their path.`,
    turret_h: 
        `Turret: Does not move. Fires beams orthogonally that hit `
        +`the first thing in their path.`,
    turret_m:
        `Moving Turret: Fires beams in two directions that hit the first thing in their path. `
        +`Moves in the same direction until it hits something.`,
    turret_r: 
        `Turret: Does not move. Fires beams in two directions hitting `
        +`the first thing in their path. Rotates every turn.`,
    unstable_wisp: 
        `Unstable Wisp: Moves randomly and occasionally leaves behind a fireball. Explodes `
        +`into a ring of fireballs on death.`,
    vampire: 
        `Vampire: Moves orthogonally then will attempt to attack diagonally. `
        +`When it hits the player, it will heal itself. Teleports away and is `
        +`stunned when hit.`,
    vinesnare_bush: 
        `Vinesnare Bush: Does not move. Can drag the player towards it using it's vines from up to 3 `
        +`spaces away. It can then lash out at the player if they are still nearby next turn.`,
    walking_prism: [
        `Walking Prism: Has no normal attack, but will fire beams in 4 directions when damaged `
        +`which hit the first thing in their path. Changes firing direction aftewards.\n`, 
        `Currently aiming orthogonally.`,
        `Currently aiming diagonally.`
    ],
}
Object.freeze(enemy_descriptions);

const enemy_names = {
    acid_bug: `Acid Bug`, 
    animated_boulder: `Animated Boulder`, 
    brightling: `Brightling`, 
    captive_void: `Captive Void`, 
    carrion_flies: `Carrion Flies`, 
    clay_golem: `Clay Golem`, 
    corrosive_caterpillar: `Corrosive Caterpillar`, 
    darkling: `Darkling`, 
    gem_crawler: `Gem Crawler`, 
    igneous_crab: `Igneous Crab`, 
    living_tree: `Living Tree`, 
    magma_spewer: `Magma Spewer`, 
    noxious_toad: `Noxious Toad`, 
    orb_of_insanity: `Orb of Insanity`, 
    paper_construct: `Paper Construct`, 
    pheonix: `Pheonix`, 
    porcuslime_large: `Large Porcuslime`, 
    porcuslime_medium: `Medium Porcuslime`, 
    porcuslime_small: `Small Porcuslime`, 
    ram: `Ram`, 
    rat: `Rat`, 
    scorpion: `Scorpion`, 
    scythe: `Scythe`, 
    shadow_knight: `Shadow Knight`, 
    shadow_scout: `Shadow Scout`, 
    specter: `Specter`, 
    spider_web: `Spider Web`, 
    spider: `Spider`, 
    strider: `Strider`, 
    swaying_nettle: `Swaying Nettle`, 
    thorn_bush: `Thorn Bush`, 
    turret: `Turret`, 
    turret_m: `Moving Turret`, 
    turret_r: `Rotary Turret`, 
    unstable_wisp: `Unstable Wisp`, 
    vampire: `Vampire`, 
    vinesnare_bush: `Vinesnare Bush`, 
    walking_prism: `Walking Prism`,
}
Object.freeze(enemy_names);
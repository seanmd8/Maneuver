const enemy_descriptions = {
    acid_bug: 
        `Acid bug: Moves 1 space towards the player. Has no normal attack, but will spray acid `
        +`upon death hurting everything next to it.`,
    animated_boulder: 
        `Animated Boulder: Wakes up when something damages or moves onto it. Each turn it will `
        +`damage everything next to it, then move 1 space closer to the player. After 3 turns, `
        +`it will go back to sleep.`,
    blood_crescent:
        `Blood Crescent: Will move 3 spaces diagonally towards the player damaging them if it `
        +`hits them or passes next to them. Moves every other turn.`,
    brightling: 
        `Brightling: Is not aggressive. Will occasionally teleport the player close to it before `
        +`teleporting away the next turn. When you are moved this way, take another turn.`,
    captive_void: 
        `Captive Void: Creatures within two spaces will be drawn towards it. When you are moved `
        +`this way, take another turn. Damaging it turns it off for 2 turns.`,
    carrion_flies: 
        `Carrion Flies: Will attack the player if they are nearby. Otherwise wanders aimlessly. `
        +`Over time they will multiply.`,
    claustropede:
        `Claustropede: Will attack the player if it is next to them. Otherwise it will move `
        +`1 space closer. When hit it will spend it's next turn dividing and teleporting away `
        +`with both halves being stunned twice.`,
    clay_golem: 
        `Clay Golem: Will attack the player if it is next to them. Otherwise it will move 1 space `
        +`closer. Taking damage will stun it. Cannot move two turns in a row.`,
    corrosive_caterpillar: 
        `Corrosive Caterpillar: Is not aggressive. Leaves a trail of corrosive slime behind it `
        +`when it moves or dies.`,
    darkling: 
        `Darkling: Creates rifts that allow it to teleport. Hurts everything next to the location `
        +`it arrives at. Blocking it's rift will destroy it.`,
    gem_crawler: 
        `Gem Crawler: Every other turn it will move 1 space closer to the player, then attack them if `
        +`it is next to them.`,
    igneous_crab: 
        `Igneous Crab: Will attack the player if it is next to them. Otherwise it will move 1 space `
        +`closer. When damaged, it will spend the next 2 turns fleeing.`,
    living_tree: 
        `Living Tree: Will attack the player if they are exactly 2 spaces away in any direction. `
        +`Otherwise, moves one square towards the player if they are far from it, or away if they `
        +`are next to it.`,
    living_tree_rooted: 
        `Living Tree: Will attack the player if they are exactly 2 spaces away in any direction. `
        +`This one has put down roots making it unable to move.`,
    magma_spewer: 
        `Magma Spewer: Alternates between firing magma into the air and retreating if the player `
        +`is next to it.`,
    maw:
        `Maw: Attacks the player 3 times if they are 1 space away orthogonally. Otherwise moves 1 `
        +`space orthogonally towards them. Taking damage stuns it twice.`,
    noxious_toad: 
        `Noxious Toad: Every other turn it will hop over a space orthogonally. If it lands next to `
        +`the player, it will damage everything next to it.`,
    orb_of_insanity: 
        `Orb of Insanity: Does not move or attack. If the player is within 2 spaces of it, it will `
        +`confuse them, polluting their deck with a bad temporary card.`,
    paper_construct: 
        `Paper Construct: Can fire a beam at the player from up to 2 spaces away orthogonally `
        +`which hits the first thing in it's path. Otherwise, moves up to two spaces diagonally.`,
    pheonix: 
        `Pheonix: Flies to an empty spot 2 or 3 spaces away in a single direction. Everything it `
        +`flies over will be damaged and set on fire. When it dies, it drops a pile of ashes from `
        +`which it will eventually be reborn.`,
    porcuslime_large: 
        `Large Porcuslime: Moves 1 space towards the player then attacks in that direction. When `
        +`hit it will spend it's next turn shrinking.`,
    porcuslime_medium: 
        `Medium Porcuslime: Moves 1 space towards the player then attacks in that direction. `
        +`Alternates between orthoganal and diagonal movement. When hit it will spend it's `
        +`next turn splitting in two.`,
    porcuslime_small_d: 
        `Small Porcuslime: Moves 1 space diagonally towards the player then attacks in that direction.`,
    porcuslime_small_o: 
        `Small Porcuslime: Moves 1 space orthogonally towards the player then attacks in that direction.`,
    ram: 
        `Ram: Moves orthogonally. When it sees the player, it will prepare to charge towards `
        +`them and ram them.`,
    rat: 
        `Rat: Will attack the player if it is next to them. Otherwise it will move 2 spaces closer. `
        +`After attacking, it will flee.`,
    scorpion: 
        `Scorpion: Will attack the player if it is next to them. Otherwise, moves 2 spaces closer `
        +`every other turn.`,
    scythe: 
        `Scythe: Will move 3 spaces diagonally towards the player damaging them if it passes `
        +`next to them.`,
    shadow_knight: 
        `Shadow Knight: Attacks and moves in an L shape. If it tramples the player, it will move again.`,
    shadow_knight_elite: 
        `Shadow Knight Elite: Attacks and moves in an L shape. If it tramples the player, it will `
        +`move again. Smarter than normal shadow knights`,
    shadow_scout: 
        `Shadow Scout: Will attack the player if it is next to them. Otherwise it will move 1 space `
        +`closer. Can go invisible every other turn.`,
    specter: 
        `Specter: Can travel up to 3 spaces orthogonally. While doing so, it can pass through tiles `
        +`without costing movement. Damages tiles it passes through as well as stunning or `
        +`confusing them.`,
    spider_web: 
        `Spider Web: Does not move or attack. Spawns a spider every 3 turns. Slows over time.`,
    spider: 
        `Spider: Will attack the player if it is next to them. Otherwise it will move 1 space closer.`,
    starcaller:
        `Starcaller: Every 3 turns it will summon an object from another realm targeting the player's `
        +`location.`,
    strider: 
        `Strider: Can attack and move to squares 2 spaces away in one direction.`,
    swaying_nettle: 
        `Swaying Nettle: Alternates between attacking the squares orthogonal and diagonal to it. `
        +`Won't hurt other nettles.`,
    thorn_bush: 
        `Thorn Bush: Trying to move here hurts. Spreads it's brambles over time.`,
    turret_d: 
        `Turret: Does not move. Fires beams diagonally that hit the first thing in their path.`,
    turret_h: 
        `Turret: Does not move. Fires beams orthogonally that hit the first thing in their path.`,
    turret_m:
        `Moving Turret: Fires beams in two directions that hit the first thing in their path. `
        +`Moves in the same direction until it hits something, then reverses.`,
    turret_r: 
        `Turret: Does not move. Fires beams in two directions hitting the first thing in their `
        +`path. Rotates every turn.`,
    unspeakable:
        `Unspeakable: Moves 1 space closer to the player. Does not attack. On death, creates a `
        +`cloud of confusion gas to pollute your deck.`,
    unstable_wisp: 
        `Unstable Wisp: Moves randomly and occasionally leaves behind a fireball. Explodes into a `
        +`ring of fireballs on death.`,
    vampire: 
        `Vampire: Moves 1 space orthogonally then will attempt to attack diagonally. When it hits `
        +`the player, it will heal itself. Damaging it stuns it and causes it to teleport away.`,
    vinesnare_bush: 
        `Vinesnare Bush: Does not move. Can drag the player towards it from up to 3 spaces away. `
        +`When you are moved this way, take another turn. `
        +`When the player approaches it, it prepares to attack them next turn if they remain nearby.`,
    walking_prism: [
        `Walking Prism: Has no normal attack, but when damaged it will fire beams in 4 directions `
        +`which hit the first thing in their path. Changes firing direction aftewards.\n`, 
        `Currently aiming orthogonally.`,
        `Currently aiming diagonally.`
    ],
    wheel_of_fire:
        `Wheel of Fire: Can shoot a jet of fire in any direction that hits the first thing in it's `
        +`path. Retreats if the player is next to it. If no target is sighted, it will instead move `
        +`1 space randomly.`,
}
Object.freeze(enemy_descriptions);
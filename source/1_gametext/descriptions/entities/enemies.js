// Normal Enemy Descriptions.

const spider_description = 
    `Spider: Will attack the player if it is next to them. `
    +`Otherwise it will move 1 space closer.`;
const turret_h_description = 
    `Turret: Does not move. Fires beams orthogonally that hit `
    +`the first thing in their path.`;
const turret_d_description = 
    `Turret: Does not move. Fires beams diagonally that hit the `
    +`first thing in their path.`;
const turret_r_description = 
    `Turret: Does not move. Fires beams in two directions hitting `
    +`the first thing in their path. Rotates every turn.`;
const scythe_description = 
    `Scythe: Will move 3 spaces diagonally towards the player `
    +`damaging them if it passes next to them. Can only see diagonally.`;
const shadow_knight_description = 
    `Shadow Knight: Moves in an L shape. If it tramples the player, `
    +`it will move again.`;
const spider_web_description = [
    `Spider Web: Does not move or attack. Spawns a spider every `, 
    ` turns. Slows over time.`
];
const ram_description = 
    `Ram: Moves orthogonally. When it sees the player, it will `
    +`prepare to charge towards them and ram them.`;
const large_porcuslime_description = 
    `Large Porcuslime: Moves towards the player 1 space and attacks `
    +`in that direction. Weakens when hit.`;
const medium_porcuslime_description = 
    `Medium Porcuslime: Moves towards the player 1 space and attacks `
    +`in that direction. Alternates between orthoganal and diagonal `
    +`movement. Splits when hit.`;
const small_h_porcuslime_description = 
    `Small Porcuslime: Moves towards the player 1 space orthogonally `
    +`and attacks in that direction.`;
const small_d_porcuslime_description = 
    `Small Porcuslime: Moves towards the player 1 space diagonally and `
    +`attacks in that direction.`;
const acid_bug_description = 
    `Acid bug: Moves towards the player 1 space. Has no normal attack, `
    +`but will spray acid upon death hurting everything next to it.`;
const brightling_description = 
    `Brightling: Is not aggressive. Will occasionally teleport the player `
    +`close to it before teleoprting away the next turn.`;
const corrosive_caterpillar_description = 
    `Corrosive Caterpillar: Is not aggressive. Leaves a trail of corrosive `
    +`slime behind it when it moves or dies.`;
const noxious_toad_description = 
    `Noxious Toad: Every other turn it will hop over a space orthogonally. `
    +`If it lands near the player, it will damage everything next to it.`;
const vampire_description = 
    `Vampire: Moves orthogonally then will attempt to attack diagonally. `
    +`When it hits the player, it will heal itself. Teleports away and is `
    +`stunned when hit.`;
const clay_golem_description = 
    `Clay Golem: Will attack the player if it is next to them. Otherwise `
    +`it will move 1 space closer. Taking damage will stun it and it cannot `
    +`move two turns in a row.`;
const vinesnare_bush_description = [
    `Vinesnare Bush: Does not move. Can drag the player towards it using it's vines from up to `,
    ` spaces away. It can then lash out at the player if they are still nearby next turn.`
];
const rat_description = 
    `Rat: Will attack the player if it is next to them. Otherwise it will move `
    +`2 spaces closer. After attacking, it will flee.`;
const shadow_scout_description = 
`Shadow Scout: Will attack the player if it is next to them. Otherwise it will `
+`move 1 space closer. Can go invisible every other turn.`;
const darkling_description = 
`Darkling: Teleports around randomly hurting everything next to the location it `
+`arrives at. Blocking it's rift will destroy it.`;
const orb_of_insanity_description = [
    `Orb of Insanity: Does not move or attack. If the player is within `, 
    ` spaces of it, it will confuse them, polluting their deck with a bad temporary card.`
];
const carrion_flies_description = 
    `Carrion Flies: Will attack the player if they are nearby. Otherwise wanders `
    +`aimlessly. Over time they will multiply.`;
const magma_spewer_description = 
    `Magma Spewer: Fires magma into the air every other turn. Retreats when you `
    +`get close.`
const animated_boulder_description = 
    `Animated Boulder: Wakes up when something touches it. Each turn it will `
    +`damage everything close to it, then move 1 space closer to the player. `
    +`After 3 turns, it will go back to sleep.`;
const pheonix_description = 
    `Pheonix: Flies to an empty spot 2 or 3 spaces away in a single direction. `
    +`Everything it flies over will be damaged and set on fire. When it dies, `
    +`it drops a pile of ashes from which it will eventually be reborn.`;
const igneous_crab_description = 
    `Igneous Crab: Will attack the player if it is next to them. Otherwise it will `
    +`move 1 space closer. When damaged, it will spend the next 2 turns fleeing.`;
const strider_description = 
    `Strider: Attacks then moves 2 spaces away in one direction.`;
const swaying_nettle_description = 
    `Swaying Nettle: Alternates between attacking the squares orthogonal and diagonal `
    +`to it. Won't hurt each other`;
const nettle_root_description = 
    `Watch out, swaying nettles are about to sprout damaging anything standing here.`
const thorn_bush_description = 
    `Thorn Bush: Trying to move here hurts. Spreads it's brambles over time.`;
const living_tree_description = 
    `Living Tree: Damages the player if they are exactly 2 spaces away in any direction. `
    +`Moves one square in any direction every other turn if it didn't attack.`;
const living_tree_rooted_description = 
    `Living Tree: Damages the player if they are exactly 2 spaces away in any direction. `
    +`This one has put down roots making it unable to move.`
const scorpion_description = 
    `Scorpion: Will attack the player if it is next to them. Otherwise, moves 2 spaces `
    +`closer every other turn.`;
const moving_turret_description = 
    `Moving Turret: Fires beams in two directions that hit the first thing in their path. `
    +`Moves in the same direction until it hits something.`;
const walking_prism_description = [
    `Walking Prism: Has no normal attack, but will fire beams in 4 directions when damaged `
    +`which hit the first thing in their path. Changes firing direction aftewards.\n`, 
    `Currently aiming orthogonally.`,
    `Currently aiming diagonally.`
    ];
const unstable_wisp_description = 
    `Unstable Wisp: Moves randomly and occasionally leaves behind a fireball. Explodes `
    +`into a ring of fireballs on death.`;
const captive_void_description = 
    `Captive Void: Creatures within two spaces will be drawn towards it. Damaging it `
    +`turns it off for 2 turns.`;
const paper_construct_description = 
    `Paper Construct: Can shoot the player from up to 2 spaces away orthogonally. Otherwise, `
    +`moves up to two spaces diagonally.`;
const specter_description =
    `Specter: Can travel up to 3 spaces orthogonally. While doing so, it can pass through tiles `
    +`without costing movement. Passing through a tile damages and stuns/confuses it.`;
const gem_crawler_description =
    `Gem Crawler: Every other turn it will move 1 space closer to the player, then attack them if `
    +`it is next to them.`;

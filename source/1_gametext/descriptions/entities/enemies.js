const enemy_descriptions = {
    acid_bug: 
        `Acid bug: Moves towards the player 1 space. Has no normal attack, `
        +`but will spray acid upon death hurting everything next to it.`,
    animated_boulder: 
        `Animated Boulder: Wakes up when something touches it. Each turn it will `
        +`damage everything close to it, then move 1 space closer to the player. `
        +`After 3 turns, it will go back to sleep.`,
    blood_crescent:
        `Blood Crescent: Will move 3 spaces diagonally towards the player damaging them if it `
        +`hits them or passes next to them. Only moves every other turn.`,
    brightling: 
        `Brightling: Is not aggressive. Will occasionally teleport the player `
        +`close to it before teleoprting away the next turn.`,
    captive_void: 
        `Captive Void: Creatures within two spaces will be drawn towards it. Damaging it `
        +`turns it off for 2 turns.`,
    carrion_flies: 
        `Carrion Flies: Will attack the player if they are nearby. Otherwise wanders `
        +`aimlessly. Over time they will multiply.`,
    claustropede:
        `Claustropede: Will attack the player if they are nearby. Otherwise moves one space closer. `
        +`When hit it will spend it's next turn dividing and teleporting away.`,
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
    wheel_of_fire:
        `Wheel of Fire: Can shoot a jet of fire in any direction that hits the first thing in it's `
        +`path. If no target is sighted, it will instead move 1 space randomly.`,
}
Object.freeze(enemy_descriptions);

const enemy_names = {
    acid_bug: `Acid Bug`, 
    animated_boulder: `Animated Boulder`, 
    blood_crescent: `Blood Crescent`,
    brightling: `Brightling`, 
    captive_void: `Captive Void`, 
    carrion_flies: `Carrion Flies`, 
    claustropede: `Claustropede`,
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
    wheel_of_fire: `Wheel of Fire`,
}
Object.freeze(enemy_names);

const enemy_flavor = {
    acid_bug: 
        `The explosive defenses these bugs have has left them without any natural predators. Their `
        +`resulting lack of fear is probably what lead to their curious nature. These are best `
        +`dispatched at range if possible. If they do manage to get close, be careful where you `
        +`swing your weapon.`,
    animated_boulder: 
        `The magnetic fields present in these caverns have interacted with the natural magic of the `
        +`area to create powerful elementals with a desire to be left alone. While their rocky makeup `
        +`makes them all but invulnerable and completely indistinguishable from stationary parts of `
        +`the terrain, they tend to tire quickly making fleeing a viable option.`,
    blood_crescent:
        ``,
    brightling: 
        `Beings from a higher plane of existance who have been attracted to the natural magic of the `
        +`area. Both curious and cautious, they warp space to bring creatures closer to be studied `
        +`before fleeing via the same method. They are entirely unaggressive and may help or hinder `
        +`in equal parts through their unexpected teleportations.`,
    captive_void: 
        `Either the result of some strange experiment or perhaps another part of the library's expansive `
        +`security system. Either way, these devices bend space around them to draw in everything `
        +`nearby. Thankfully they can be temporarily disabled through the use of blunt force.`,
    carrion_flies: 
        `Swarms move about at random attracted by the ample food sources available down here. They `
        +`tend to multiply quickly making it important to get rid of them as soon as possible.`,
    claustropede:
        ``,
    clay_golem: 
        `These golems are built to last with their tough skin showing countless scars. That makes it `
        +`likely that their construction wasn't recent. Thankfully they are incredibly slow moving `
        +`and seem to malfunction slightly when recieving damage. As long as you avoid being `
        +`surrounded it will be possible to wear them out eventually, or just run past them.`,
    corrosive_caterpillar: 
        ``,
    darkling: 
        `It is unclear whether this relative of the brightling exibits less control over their spacial `
        +`powers, or if they simply enjoy the whiplash of their constant relocations. Either way their `
        +`method of transportation is far more dangerous to both them and anything nearby. Blocking `
        +`rift often presents an easier way of dispatching them than tracking them down, but the `
        +`chaos caused by their jumps can also be helpful for taking out large groups of foes.`,
    gem_crawler: 
        ``,
    igneous_crab: 
        `These creatures have shielded themselves in rocky shells which makes them much more difficult `
        +`to kill than the giant spiders, however the cautious nature that led them to exhibit this `
        +`behaviour has also led them to flee at the first sign of danger often showing less awareness `
        +`of their surroundings as they do.`,
    living_tree: 
        `The magical energy permeating this forest which allows it to thrive far beneath the sight of `
        +`the sun has also had an unexpected effect on some of the plant life. While their wandering `
        +`nature could be an attempt to reach areas with fresh nutrients, it is unclear what led these `
        +`trees to be so aggressive. Thankfully their control over their branches isn't very fine `
        +`making their attacks easy to evade at close range.`,
    magma_spewer: 
        `These strange creatures possess a unique digestive tract. Rather than eating organic matter, `
        +`they get most of their energy through drinking magma. In addition to acting as a thermal `
        +`power source, it also allows them to fire rocks at high speeds through pressurized jets `
        +`on their head. This gives them a powerful natural defense mechanism that can take out targets `
        +`at great distances.`,
    noxious_toad: 
        `Capable of leaping great distances to navigate the difficcult terrain of the sewers, these `
        +`toads have also developed a natural defense mechanism which sets them apart from their `
        +`surface dwelling bretheren. They can release a toxic gas as they leap capable of harming `
        +`anything near the sight of their landing. It takes them a short time to recharge it however `
        +`leaving them open to attack immediatly after the gas has dispelled.`,
    orb_of_insanity: 
        `Some sort of malevolent force is encased in these spheres of glass. It does not seem to `
        +`belong in this world. Even looking at it for too long has a terrible effect on the psyche. `
        +`Thankfully it isn't able to survive outside the orb so simply shattering the glass is `
        +`enough to cause it to disperse.`,
    paper_construct: 
        `These small magical creatures are made of folded sheets of multicolored paper. Given the `
        +`fragile nature of their bodies, it is hard to imagine that they last very long. That lends `
        +`credence to the theory that something in the library is creating them, though what I do not `
        +`know.`,
    pheonix: 
        `This mythical bird makes a home in places of high temperature and large amounts of natural `
        +`magic. They are difficult to kill due to their fast speed and their ability to reconstitute `
        +`themselves from the ashes they leave behind on death. Scattering the ashes provides the most `
        +`certain way to ensure they do not return.`,
    porcuslime: 
        `While sharing the distributed nervous system and mitotic reproduction method common to many `
        +`slimes, these ones have developed spines coated with toxins they find while feeding from `
        +`the sewer floor. While they can shrug off damage by shedding mass, the smaller they become, `
        +`the less developed their nervous system becomes leading to less control over their movements. `
        +` As a last ditch effort to avoid death, they can split into two smaller slimes both capable `
        +`of regaining their former size through several weeks of feeding.`,
    ram: 
        `While herbivorous, these creatures are fiercely territorial. They can run at high speeds, but `
        +`find it difficult to change directions making them easy to dodge.`,
    rat: 
        ``,
    scorpion: 
        `The species of scorpion that can be found here is capable of quickly sprinting short `
        +`distances to hunt prey. They don't have great stamina however which gives them a need `
        +`for frequent stops to rest. It is often best to wait for them to come to you while taking `
        +`care not to become surrounded.`,
    scythe: 
        `One of the more dangerous species of giant insect encountered here, the Scythe is adorned by `
        +`a sharp bladelike protrusion on either side of it's head. Using it's many legs to move at `
        +`high speeds, it is even capable of slicing through steel. The position of the blades make it `
        +`easy to stop if you are directly in front of it however.`,
    shadow_knight: 
        ``,
    shadow_scout: 
        ``,
    specter: 
        `It is unclear if these are actually the ghosts of the departed or simply some sort of `
        +`magically created creature of pure shadow. Either way they are capable of phasing through `
        +`solid objects as though they were not there and have a chilling effect on anything they move `
        +`through.`,
    spider_web: 
        `Since the spiders here tend to hunt rather than lying in wait, these webs serve more as a `
        +`place for them to rest and to protect their young. Since it's hard to tell how many may be `
        +`waiting inside, it is recomended that these be destroyed to keep their population in check.`,
    spider: 
        `The spiders here reach sizes unseen anywhere else. They tend to hunt for their prey rather `
        +`than lying in wait in a web. Thankfully their large size hasn't made them very tough so they `
        +`are easily dispatched.`,
    strider: 
        `These long legged creatures navigate the trecherous terrain of the magmatic caves with ease.`
        +`The strength of their barbed feet seems to mostly be used for defense as they can be seen `
        +`feeding off the sparse vegitation that grows on some of the boulders here.`,
    swaying_nettle: 
        `This plant uses stinging spines to ward off both curious herbivores and other plants that `
        +`encroach upon them. They can be seen swaying to extend their reach despite the lack of any `
        +`breeze to move them.`,
    thorn_bush: 
        `These bushes grow rapidly choking out many other kinds of vegitation and occasionally `
        +`trapping unwary creatures that end up as fertilizer. Thankfully despite the wide reach of `
        +`their brambles, they still only have a single stem which when severed will prevent `
        +`further growth.`,
    turret: 
        `Placed here when this area was abandoned, these automated turrets present a clear `
        +`warning: Don't come any further. While they are capable of sensing you through solid `
        +`objects, they may be an advantage as it means they will fire even if another enemy is `
        +`in the way.`,
    turret_m:
        `These turrets seem to be more advanced than their earlier counterparts. They are capable of `
        +`both levitating and moving, though they are limited in their direction of fire.`,
    turret_r: 
        `While it can't fire in as many directions at once, this turret can keep watch over more `
        +`directions overall. Thankfully it rotates at a fixed speed so it's movement can be predicted.`,
    unstable_wisp: 
        `Beings of elemental fire that naturally spawn from the extreme heat. They are very unstable `
        +`and can explode violently if disrupted. They are not aggressive however so as long as you `
        +`destroy them from afar and avoid the fires left in their wake they are not very dangerous.`,
    vampire: 
        ``,
    vinesnare_bush: 
        `These carnivourous weeds are not unique to this area, but provide a danger to travelers `
        +`wherever they reside. Their vines spread out along the ground and wrap themselves around `
        +`the feet of whoever steps on them dragging them in range of the plant's thorny whips. `
        +`A careful traveller may be able to make use of their roots to move around faster.`,
    walking_prism: 
        ``,
    wheel_of_fire:
        ``,
}
Object.freeze(enemy_descriptions);

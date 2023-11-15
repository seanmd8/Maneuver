// ----------------Descriptions.js----------------
// Contains text that will be displayed.

// General.
const welcome_message = "Welcome to the dungeon.\n"
                            + "Use cards to move (blue) and attack (red).\n" 
                            + "Click on things to learn more about them.";
const floor_message = "Welcome to floor ";

// Normal Enemy Descriptions.
const spider_description = "Spider: Will attack the player if it is next to them. Otherwise it will move 1 space closer.";
const turret_h_description = "Turret: Does not move. Fires beams orthogonally that hit the first thing in their path.";
const turret_d_description = "Turret: Does not move. Fires beams diagonally that hit the first thing in their path.";
const scythe_description = "Scythe: Will move 3 spaces diagonally towards the player damaging them if it passes next to them. Can only see diagonally.";
const knight_description = "Knight: Moves in an L shape. If it tramples the player, it will move again.";
const spider_web_description = ["Spider Web: Does not move. Spawns a spider every ", " turns."];
const ram_description = "Ram: Moves orthogonally. When it sees the player, it will prepare to charge towards them and ram them.";
const large_porcuslime_description = "Large Porcuslime: Moves towards the player 1 space and attacks in that direction. Weakens when hit.";
const medium_porcuslime_description = "Medium Porcuslime: Moves towards the player 1 space and attacks in that direction. Alternates between orthoganal and diagonal movement. Splits when hit.";
const small_h_porcuslime_description = "Small Porcuslime: Moves towards the player 1 space orthogonally and attacks in that direction.";
const small_d_porcuslime_description = "Small Porcuslime: Moves towards the player 1 space diagonally and attacks in that direction.";
const acid_bug_description = "Acid bug: Moves towards the player 1 space. Has no normal attack, but will spray acid upon death hurting everything next to it.";
const brightling_description = "Brightling: Will occasionally teleport the player close to it before teleoprting away the next turn.";

// Boss Descriptions.
const boss_death_description = "The exit opens.\n"
                                + "You feel your wounds begin to heal.";
const velociphile_floor_message = "You hear a deafening shriek.";
const velociphile_description = "Velociphile (Boss): A rolling ball of mouths and hate. Moves in straight lines. Must build up speed to ram you.";
const velociphile_death_message = "The wailing falls silent as the Velociphile is defeated.";
const spider_queen_floor_message = "The floor is thick with webs.";
const spider_queen_description = "Spider Queen (Boss): Moves like a normal spider. Taking damage will stun her, but will also spawn spiders.";
const spider_queen_death_message = "As the Spider Queen falls to the floor, the last of her children emerge.";


// Other Tile Descriptions.
const empty_description = "There is nothing here.";
const exit_description = "Stairs to the next floor.";
const player_description = "You.";
const lava_pool_description = "Lava Pool: Attempting to move through this will hurt.";
const wall_description = "A wall. It seems sturdy.";
const damaged_wall_description = "A damaged wall. Something might live inside.";
const lock_description = "The exit is locked. Defeat the boss to continue.";



// Cardinal Directions.
const NW = "NW";
const N = "N";
const NE = "NE";
const E = "E";
const SE = "SE";
const S = "S";
const SW = "SW";
const W = "W";
const C = "C";

// ----------------GuideText.js----------------
// This file contains the headers and text for the guide / tutorial section.

const GUIDE_HEADERS = {
    basics: `The Basics`,
    cards: `Playing Your Cards`,
    enemies: `Dealing With Enemies`,
    shop: `The Shop`,
    bosses: `Bosses`,
}
Object.freeze(GUIDE_HEADERS);

const GUIDE_TEXT = {
    basics: `Welcome to Maneuver. The goal of the game is to progress as deep into the dungeon as possible by completing each floor. `
            +`To finish a floor, you need to reach the stairs that lead down to the next one. Enemies will spawn on each floor which will `
            +`try to stop you from continuing. You do not need to defeat everything on the current floor to continue, but will often need to `
            +`fight most of them to survive. Read more about controlling your character in the next section. Good luck!\n`,

    cards: `To control your character's actions, you have a deck of cards. Each card gives you 1-4 options for a set of actions `
            +`to take. The actions on the card will be performed relative to your current location (the black dot). Clicking on a card will `
            +`bring up a grid of buttons which will let you use it. When you use a card, it will be discarded and replaced with another from your `
            +`deck. Then everything else on the floor will get a chance to act (read more in the next section). When your deck runs out, your `
            +`discard pile will be shuffled back into it.\n`
            +`\n`
            +`Colors and Symbols:\n`
            +`Red: You will attack this space.\n`
            +`Blue: You will move to this space.\n`
            +`Grey Line: Each action the line goes through will be performed. If it has an arrow, they will be performed in that order.\n`
            +`Black Slash: Multiple actions will be performed on this space. Attacks will be performed before moves.\n`
            +`\n`
            +`In addition to clicking on cards to use them, if you are on a computer you can use\n`
            +`\n`
            +`| h | j | k |\n`
            +`\n`
            +`to select a card and\n`
            +`\n`
            +`| q | w | e |\n`
            +`| a | s | d |\n`
            +`| z | x | c |\n`
            +`\n`
            +`to use it.\n`
            +`\n`
            +`Moving into a wall or an occupied space will generally have no effect unless one is specified in it's description, so it is a `
            +`great option if you want to skip your turn. If other actions are performed after a failed move, they will be performed where `
            +`you are rather than where you would have been.\n`,

    enemies: `As you travel through the dungeon, you will encounter various other creatures, many of whom want to kill you. Each creature has `
            +`different patterns of attack and movement and many of them have other unique abilities. Click on a tile to learn more about it. `
            +`Clicking will show you a description of it, how much health it has, and which squares it might be able to attack on it's next `
            +`turn. Some enemies also have the ability to move you during their turn. When this happens, you will get the chance to respond. `
            +`Remember that you do not need to kill everything to go to the next stage. Sometimes it's better to run past an enemy than to `
            +`fight it and risk getting surrounded or cornered. There may also be some creatures you encounter that are more helpful than `
            +`harmful.\n`,

    shop: `When you complete a floor, you will enter a shop where you must either add or remove a card from your deck. You will get `
            +`${ADD_CHOICE_COUNT} options of random cards to add, and ${REMOVE_CHOICE_COUNT} options of random cards from your deck to remove. `
            +`You will also be able to see the current contents of your deck to help you make your choice. There is a minimum deck size of `
            +`${MIN_DECK_SIZE}, so if you reach it you will not be able to remove more cards.\n`,

    bosses: `Every ${AREA_SIZE} floors, you will encounter a boss floor. The stairs out of this floor will be locked until you defeat it's `
            +`powerful occupant. When you defeat the boss, in addition to unlocking the stairs, you will be fully healed. When leaving the floor `
            +`you will enter a new area of the dungeon with a different pool of inhabitants and a new boss at the end.`,
}
Object.freeze(GUIDE_TEXT);



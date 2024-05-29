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
    basics: [`Welcome to Maneuver. The goal of the game is to progress as deep into the dungeon as possible by completing each floor. `
            +`To finish a floor, you need to reach the stairs that lead down to the next one. Enemies will spawn on each floor which will `
            +`try to stop you from continuing. You do not need to defeat everything on the current floor to continue, but will often need to `
            +`fight most of them to survive. Read more about controlling your character in the next section. Good luck!\n\n`],

    cards: [`To control your character's actions, you have a deck of cards. Each card gives you several options for a set of actions `
            +`to take. The actions on the card will be performed relative to your current location (the black dot). Clicking on a card will `
            +`bring up a grid of buttons which will let you use it. When you finish using a card, it will be discarded and replaced with another `
            +`from your deck, then everything else on the floor will get a chance to act (read more in the next section). When your deck runs out, `
            +`your discard pile will be shuffled back into it. The amount of cards remaining in your deck is shown next to your health bar.\n`
            +`\n`
            +`Colors and symbols that make up a card:\n`,
                ` Your relative starting location.\n`,
                ` You will attack this space.\n`,
                ` You will move to this space.\n`,
                ` If applied to an enemy, it will stun them. If applied to the player, it will instead add a temporary debuff card to your deck.\n`,
                ` Each action the line goes through will be performed.\n`,
                ` Multiple actions will be performed in a specific order.\n`,
                ` Multiple actions of the same stype will be performed until one fails.\n`,
                `  `,    ` Multiple actions will be performed on the same space. Moves will be performed last.\n`,
                ` A card with a purple grid will be performed instantly.\n`,
                ` A card with a tan background is temporary. It will be removed from your deck when you use it or when the floor ends.\n`,
                ` A card with a brown grid can only be used once per floor. When drawn it will show up as temporary.\n`
            +`\n`
            +`In addition to clicking on cards to use them, you can use the keys\n`,
                ` `, ` `, `\n`
            +`to select a card and\n`,
                ` `, ` `, `\n`,
                ` `, ` `, `\n`,
                ` `, ` `, `\n`
            +`to use it.\n`
            +`\n`
            +`Moving into a wall or an occupied space has no effect unless it is specified in the description of the destination space. `
            +`If other actions are performed after a failed move, they will be performed where you are rather than where you would have `
            +`been.\n\n`],

    enemies: [`As you travel through the dungeon, you will encounter various other creatures, many of whom want to kill you. Each creature has `
            +`different patterns of attack and movement and many of them have other unique abilities. Click on a tile to learn more about it. `
            +`Clicking will show you a description of it, how much health it has, and which squares it might be able to attack on it's next `
            +`turn. Some enemies also have the ability to move you during their turn. When this happens, you will get the chance to respond.\n`
            +`Remember that you do not need to kill everything to go to the next stage. Sometimes it's better to run past an enemy than to `
            +`fight it and risk getting surrounded or cornered. There may also be some creatures you encounter that are more helpful than `
            +`harmful.\n`
            +`Some effects will cause an enemy to become stunned. Stunned enemies will skip their next turn. Multiple instances of stun `
            +`will cause multiple turns to get skipped.\n\n`],

    shop: [`When you complete a floor, you will enter a shop where you must either add or remove a card from your deck. You will get `
            +`${ADD_CHOICE_COUNT} options of random cards to add, and ${REMOVE_CHOICE_COUNT} options of random cards from your deck to remove. `
            +`The current contents of your deck will be shown to help you choose. There is a minimum deck size of ${MIN_DECK_SIZE}, `
            +`so if you reach it you will not be able to remove more cards.\n`
            +`Some enemies or effects may add temporary cards to your deck. They will go away after you play them or go to the next `
            +`floor.\n\n`],

    bosses: [`Every ${AREA_SIZE} floors, you will encounter a boss floor. The stairs out of this floor will be locked until you defeat it's `
            +`powerful occupant. When you defeat the boss, the stairs will be unlocked, you will be fully healed, and it might drop a chest `
            +`containing a powerful new card as a reward.\n`
            +`When leaving the floor, you will enter a new area of the dungeon with a different set of inhabitants and a new boss at `
            +`the end.\n\n`],
}
Object.freeze(GUIDE_TEXT);

const CARD_SYMBOLS = [
    {src: `${IMG_FOLDER.symbols}you.png`,               x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}attack.png`,            x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}move.png`,              x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}stun.png`,              x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}multiple.png`,          x: 3, y: 1},
    {src: `${IMG_FOLDER.symbols}multiple_ordered.png`,  x: 3, y: 1},
    {src: `${IMG_FOLDER.symbols}move_until.png`,        x: 4, y: 1},
    {src: `${IMG_FOLDER.symbols}attack_move.png`,       x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}triple_attack.png`,     x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}instant.png`,           x: 2, y: 2},
    {src: `${IMG_FOLDER.symbols}temporary.png`,         x: 2, y: 2},
    {src: `${IMG_FOLDER.symbols}per_floor.png`,         x: 2, y: 2},
];



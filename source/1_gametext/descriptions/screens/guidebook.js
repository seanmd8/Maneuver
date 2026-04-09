// ----------------GuideText.js----------------
// This file contains the headers and text for the guide / tutorial section.

const GUIDE_HEADERS = {
    basics: `The Basics`,
    cards: `Using Cards`,
    enemies: `Handling Enemies`,
    shop: `The Shop`,
    bosses: `Bosses`,
    chests: `Chests`,
    sidebar: `Sidebar`,
    confusion: `Confusion`,
    about: `About`,
}
Object.freeze(GUIDE_HEADERS);

const GUIDE_TEXT = {
    basics: [
        `Welcome to Maneuver!\n\n`

        +`The goal of the game is to progress as deep into the dungeon as possible by completing each `
        +`floor. To finish a floor, you need to reach the stairs that lead to the next one. You will `
        +`also need to fight off or avoid various enemies which will try to stop you. You do not need `
        +`to defeat everything on the current floor to continue.\n\n`

        +`Defeat the final boss on floor 25 then exit the dungeon to win.\n\n`

        +`Good luck!\n\n`
    ],

    cards: [
        `Playing cards allows your character to perform actions like moving and attacking. Once `
        +`selected, each card contains several sets of actions to choose from. The actions a card can `
        +`perform are shown as colored squares on it's grid. The color of the square determines the `
        +`type of action, and the position determines where it will be performed relative to the `
        +`current position of your character, symbolized by the black dot in the center. If multiple `
        +`squares are connected by a grey line, they will all be performed.\n\n`
        
        +`More information about a card can be seen by clicking the question mark icon above the move `
        +`button box. You can also shift click a button to see a preview of what it would do.\n\n`
        
        +`When you use a card, it will be discarded and you will draw another from your deck. If your `
        +`deck is empty, your discard pile will be shuffled back in.\n\n`
        
        +`Colors and symbols that make up a card:\n\n`,
            ` Your current location.\n`,
            ` You will attack this space.\n`,
            ` You will move to this space.\n`,
            ` Stuns an enemy, or confuses the player.\n`,
            ` You will heal the tile on this space.\n`,
            ` Each action the line goes through will be performed.\n`,
            ` Multiple actions will be performed in a specific order.\n`,
            ` Multiple moves will be performed until you hit something.\n`,
            ` Multiple attacks will be performed until you hit the edge of the floor.\n`,
            ` teleport to a random unoccupied location.\n`,
            `  `,    ` Multiple actions will be performed on the same space. Moves will be performed last.\n`,
            ` A card with a purple grid will let you play another card immediately.\n`,
            ` A card with a tan background is temporary. It will be removed from your deck when played, or at the end of the floor.\n`,
            ` A card with a brown grid can only be used once per floor. When drawn it will show up as temporary.\n`
        +`\n`
    ],

    enemies: [
        `As you travel through the dungeon, you will encounter various other creatures, many of whom `
        +`want to kill you. Each one has it's own patterns of attack and movement, and may have `
        +`other abilities as well.\n\n`

        +`Click on a tile to learn more about creatures and terrain there. Clicking will show you a `
        +`description of everything on the tile, as well as which squares they will be able to attack `
        +`next turn, and their current health.\n\n`

        +`Remember that you do not need to kill everything to go to the next stage. Some enemies are `
        +`easier to run past than to fight, and others can even be used to your advantage.\n\n`
        
        +`Some effects can stun enemies, causing them to skip their next turn. While stunned they will `
        +`be highlighted in yellow and you will be able to see how long they are stunned for by clicking `
        +`on them.\n\n`

        +`Some enemies also have the ability to forcibly move you. When that happens, you will `
        +`immediately get another turn afterwards.\n\n`
    ],

    shop: [
        `After completing a floor, you will enter a shop where you must either add or remove a card from `
        +`your deck. You will see ${ADD_CHOICE_COUNT} options of random cards to add, and `
        +`${REMOVE_CHOICE_COUNT} options of random cards from your deck to remove. You will also be able `
        +`to view the current contents of your deck.\n\n`
        
        +`As you defeat certain bosses you will permanently unlock new, more complex cards which can `
        +`show up in future shops.\n\n`
        
        +`Try to keep a variety of different movement cards in your deck. Doing so means you will `
        +`generally have more options of where to move to on each turn. Having a balance of moves and `
        +`attacks is also important so that you can both fight off melee enemies and move out of the `
        +`way of ranged enemies.\n\n`

        +`Removing cards from your deck allows you to see your best cards more often while also raising `
        +`your deck's average power level since the cards you can get from the shop are usually better `
        +`than your basic cards. You won't be able to reduce your deck to less than 5 cards though.\n\n`
        
        +`In addition to the shop, there are several other ways to get cards. You can find them from `
        +`defeating certain bosses or aquiring certain boons. Some enemies or effects may also add `
        +`temporary cards to your deck. They will go away after you play them or go to the next floor.\n\n`
    ],

    bosses: [
        `Every ${AREA_SIZE} floors, you will encounter a boss floor. The stairs out of this floor will be `
        +`locked, forcing you to fight it's occupant.\n\n`
        
        +`Once you defeat the boss, the stairs will be unlocked, you will be fully healed, and it `
        +`will drop a chest containing a powerful card as a reward.\n\n`

        +`When leaving the floor, you will enter a new area of the dungeon with a different set of `
        +`inhabitants and a new boss at the end.\n\n`
    ],

    chests: [
        `On floor ${CHEST_LOCATION} of every area, you will find a treasure chest. Moving onto this `
        +`chest will allow you to pick a boon. Boons are powerful upgrades that can give your character `
        +`a unique edge when it comes to surviving.\n\n`

        +`Chests will also be dropped after a boss is defeated. Rather than boons, these ones will contain `
        +`a card that lets you imitate one of the boss's abilities.\n\n`

        +`Be careful. Breaking a chest will destroy it's contents.\n\n`
    ],

    sidebar: [
        `The sidebar contains several tabs which keep track of useful information.\n\n`

        +`${usymbol.bullet} The Messages tab keeps track of game messages.\n\n`

        +`${usymbol.bullet} The Discard tab keeps track of which cards in your deck have been used so `
        +`far to help you figure out what might be left to draw. It resets after shuffling.\n\n`

        +`${usymbol.bullet} The Initiative tab keeps track of the turn order of enemies. You can use `
        +`this to better predict enemy movements and how to get them to block each other's attacks. `
        +`It will not track hidden enemies.\n\n`

        +`More tabs will become available as you play.\n\n`
    ],

    confusion: [
        `Certain enemies and cards will confuse you. Confusion adds a temporary bad card to your deck `
        +`which will go away once it goes to your discard pile, or when you travel to the next floor.\n\n`

        +`Here is a list of the possible confusion cards:\n\n`
    ],

    about: [
        `Maneuver is a game created by Sean Dunbar. It began in 2023. If you would like to view the `
        +`changelog or look at the source code, you can go to the `, 
        `.\n\n`
    ],
}
Object.freeze(GUIDE_TEXT);

const CARD_SYMBOLS = [
    {src: `${IMG_FOLDER.symbols}you.png`,               name: `you`,                x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}attack.png`,            name: `attack`,             x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}move.png`,              name: `move`,               x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}stun.png`,              name: `stun`,               x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}heal.png`,              name: `heal`,               x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}multiple.png`,          name: `multiple actions`,   x: 3, y: 1},
    {src: `${IMG_FOLDER.symbols}multiple_ordered.png`,  name: `actions in order`,   x: 3, y: 1},
    {src: `${IMG_FOLDER.symbols}move_until.png`,        name: `move until`,         x: 4, y: 1},
    {src: `${IMG_FOLDER.symbols}attack_until.png`,      name: `attack until`,       x: 4, y: 1},
    {src: `${IMG_FOLDER.symbols}teleport.png`,          name: `teleport`,           x: 3, y: 1},
    {src: `${IMG_FOLDER.symbols}attack_move.png`,       name: `attack then move`,   x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}triple_attack.png`,     name: `triple attack`,     x: 1, y: 1},
    {src: `${IMG_FOLDER.symbols}instant.png`,           name: `instant`,            x: 2, y: 2},
    {src: `${IMG_FOLDER.symbols}temporary.png`,         name: `temporary`,          x: 2, y: 2},
    {src: `${IMG_FOLDER.symbols}per_floor.png`,         name: `once per floor`,     x: 2, y: 2},
];

const about_page_text = {
    git_link: `https://github.com/seanmd8/Maneuver`,
    git_text: `Github Page`,
};
Object.freeze(about_page_text);
/** @type {TileGenerator}.*/
function bookshelf_tile(){
    var health = random_num(2) + 2;
    var pic_arr = [
        `${IMG_FOLDER.tiles}bookshelf_empty.png`, 
        `${IMG_FOLDER.tiles}bookshelf_half.png`, 
        `${IMG_FOLDER.tiles}bookshelf_full.png`
    ];
    return {
        type: `terrain`,
        name: other_tile_names.bookshelf,
        pic: pic_arr[health - 1],
        description: other_tile_descriptions.bookshelf,
        tags: new TagList([TAGS.unmovable]),
        health,
        on_hit: bookshelf_on_hit,
        pic_arr
    }
}

/** @type {AIFunction} Function used when a wall is damaged to update it's image.*/
function bookshelf_on_hit(self, target, map){
    if(self.tile.pic_arr === undefined ||
        self.tile.health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(self.tile.health > 0){
        self.tile.pic = self.tile.pic_arr[Math.min(2, self.tile.health - 1)];
    }
    var boss_cards = get_boss_cards();
    var card_list = [
        ...BASIC_CARDS, 
        ...CONFUSION_CARDS, 
        ...COMMON_CARDS, 
        ...get_all_achievement_cards(), 
        ...boss_cards
    ];
    var card = randomize_arr(card_list)[0]();
    GS.give_temp_card(card);
    GS.refresh_deck_display();
}

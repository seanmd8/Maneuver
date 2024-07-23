/** @type {TileGenerator} A chest letting the user choose a reward. Currently empty.*/
function chest_tile(){
    return {
        type: `chest`,
        name: `Chest`,
        pic: `${IMG_FOLDER.tiles}chest.png`,
        description: chest_description,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        on_enter: chest_on_enter,
        contents: []
    }
}

/** @type {AIFunction} Function to open a chest when the player moves onto it.*/
function chest_on_enter(self, target, map){
    if(self.tile.contents === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.tile.type !== `player`){
        return;
    }
    self.tile.health = 1;
    map.attack(self.location);
    var leave_chest = function(){
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.stage);
        display.display_message(UIIDS.chest_instructions, ``);
        display.remove_children(UIIDS.chest_confirm_row);
        display.remove_children(UIIDS.contents);
        display.display_message(UIIDS.content_description, ``);
        GS.refresh_deck_display();
        map.display();
        if(GS.boons.has(boon_names.safe_passage)){
            GS.boons.lose(boon_names.safe_passage);
            GS.refresh_boon_display();
            GS.map.heal(GS.map.get_player_location());
            GS.map.display_stats(UIIDS.stats);
            GS.enter_shop();
        }
    }
    var abandon_button = {
        description: abandon_chest,
        on_click: leave_chest
    };
    var pick = function(on_choose){
        return function(){
            if(on_choose !== undefined){
                on_choose();
            }
            leave_chest();
        }
    }
    var content_row = [];
    for(var i = 0; i < self.tile.contents.length; ++i){
        let item = self.tile.contents[i];
        let make_on_click = function(position){
            return function(){
                let confirm_button = {
                    description: take_from_chest,
                    on_click: pick(item.on_choose)
                };
                display.display_message(UIIDS.content_description, item.description);
                display.remove_children(UIIDS.chest_confirm_row);
                display.add_button_row(UIIDS.chest_confirm_row, [abandon_button, confirm_button]);
                display.select(UIIDS.contents, 0, position);
            };
        }
        
        content_row.push({
            pic: item.pic,
            name: item.name,
            on_click: make_on_click(i)
        });
    }

    display.display_message(UIIDS.chest_instructions, chest_inner_discription);
    display.add_tb_row(UIIDS.contents, content_row, CHEST_CONTENTS_SIZE);
    display.add_button_row(UIIDS.chest_confirm_row, [abandon_button]);
    display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.chest);
    throw new Error(ERRORS.pass_turn);
}

/**
 * @typedef {Object} Content
 * @property {string} pic
 * @property {function} on_choose
 * @property {string} description
 */

/**
 * @param {Tile} chest 
 * @param {Card} card 
 */
function add_card_to_chest(chest, card){
    if(chest.contents === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var content = {
        pic: card.pic,
        name: card.name,
        on_choose: function(){
            GS.deck.add(card);
        },
        description: add_card_description
    }
    chest.contents.push(content);
}

/**
 * @param {Tile} chest 
 * @param {Card} card 
 */
function add_boon_to_chest(chest, boon){
    if(chest.contents === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var content = {
        pic: boon.pic,
        name: boon.name,
        on_choose: function(){
            GS.boons.pick(boon.name);
            if(GS.boons.total === 1){
                display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.boon_list, function(){
                    display.swap_screen(SIDEBAR_DIVISIONS, UIIDS.boon_list);
                });
                display.swap_screen(SIDEBAR_DIVISIONS, UIIDS.boon_list);
            }
            GS.refresh_boon_display();
        },
        description: `${boon.name}: ${boon.description}`
    }
    chest.contents.push(content);
}
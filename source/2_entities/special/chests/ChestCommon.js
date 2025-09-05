/** @type {TileGenerator} Makes the correct type of chest*/
function appropriate_chest_tile(){
    if(GS.boons.has(boon_names.larger_chests)){
        return armored_chest_tile();
    }
    return chest_tile();
}

/** @type {AIFunction} Function to open a chest when the player moves onto it.*/
function chest_on_enter(self, target, map){
    if(self.tile.contents === undefined){
        throw new Error(ERRORS.missing_property);
    }
    if(target.tile.type !== entity_types.player){
        return;
    }
    self.tile.health = 1;
    map.attack(self.location);
    map.stats.increment_chests();
    var leave_chest = function(go_back){
        if(go_back){
            GAME_SCREEN_DIVISIONS.swap(UIIDS.stage);
        }
        display.display_message(UIIDS.chest_instructions, ``);
        display.remove_children(UIIDS.chest_confirm_row);
        display.remove_children(UIIDS.contents);
        display.display_message(UIIDS.content_description, ``);
        GS.refresh_deck_display();
        display_map(map);
        if(GS.boons.has(boon_names.safe_passage)){
            GS.boons.lose(boon_names.safe_passage);
            GS.refresh_boon_display();
            GS.map.heal(GS.map.get_player_location());
            GS.map.display_stats(UIIDS.stats);
            GS.enter_shop();
        }
    }
    var abandon_button = {
        description: chest_text.abandon,
        on_click: leave_chest
    };
    var pick = function(on_choose){
        return function(){
            var go_back = true;
            if(on_choose !== undefined){
                go_back = on_choose();
            }
            leave_chest(go_back);
        }
    }
    var content_row = [];
    for(var i = 0; i < self.tile.contents.length; ++i){
        let item = self.tile.contents[i];
        let make_on_click = function(position){
            return function(){
                let confirm_button = {
                    description: chest_text.take,
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

    display.display_message(UIIDS.chest_instructions, chest_text.header);
    display.add_tb_row(UIIDS.contents, content_row, CHEST_CONTENTS_SIZE);
    display.add_button_row(UIIDS.chest_confirm_row, [abandon_button]);
    GAME_SCREEN_DIVISIONS.swap(UIIDS.chest);
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
    var description = chest_text.add_card + `\n` + explain_card(card);
    var content = {
        pic: card.pic,
        name: card.name,
        on_choose: function(){
            GS.deck.add(card);
            return true;
        },
        description
    }
    chest.contents.push(content);
}

function add_boon_to_chest(chest, boon){
    if(chest.contents === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var content = {
        pic: boon.pic,
        name: boon.name,
        on_choose: function(){
            if(GS.boons.total === 0){
                display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.boon_list, function(){
                    SIDEBAR_DIVISIONS.swap(UIIDS.boon_list);
                });
                SIDEBAR_DIVISIONS.swap(UIIDS.boon_list);
            }
            var go_back = GS.boons.pick(boon.name);
            GS.refresh_boon_display();
            return go_back
        },
        description: `${boon.name}: ${boon.description}`
    }
    chest.contents.push(content);
}
function refresh_shop_display(shop){
    var refresh = (f, card) => {
        return () => {
            f();
            display.display_message(UIIDS.shop_message, explain_card(card));
            refresh_shop_display(shop);
        }
    };
    display.remove_children(UIIDS.add_card);
    display.remove_children(UIIDS.remove_card);

    var add_row = shop.get_add_row();
    for(var a of add_row){
        if(a.on_click !== undefined){
            a.on_click = refresh(a.on_click, a.card);
        }
        else{
            a.on_click = () => {display.display_message(UIIDS.shop_message, shop_text.add)};
        }
    }
    display.add_tb_row(UIIDS.add_card, add_row, CARD_SCALE);

    var remove_row = shop.get_remove_row();
    for(var r of remove_row){
        if(r.on_click !== undefined){
            r.on_click = refresh(r.on_click, r.card);
        }
        else if(r.name === card_names.symbol_remove_card){
            r.on_click = () => {display.display_message(UIIDS.shop_message, shop_text.remove)};
        }
        else{
            r.on_click = () => {display.display_message(UIIDS.shop_message, shop_text.min)};
        }
    }
    display.add_tb_row(UIIDS.remove_card, remove_row, CARD_SCALE);
    
    var confirm = () => {
        if(shop.is_valid_selection()){
            shop.confirm();
            GS.new_floor();
        }
        else{
            display.display_message(UIIDS.shop_message, shop_text.invalid);
        }
    }
    display.set_button(UIIDS.shop_confirm, shop_text.confirm, confirm, shop.is_valid_selection());
}


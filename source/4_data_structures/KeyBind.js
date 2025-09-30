class KeyBind{
    #controls
    alternate_is_pressed
    constructor(){
        if(!KeyBind.is_valid(DEFAULT_CONTROLS)){
            throw new Error(ERRORS.invalid_value);
        }
        this.#controls = DEFAULT_CONTROLS;
        this.alternate_is_pressed = false;
    }
    stage(key){
        var stage = this.#controls.stage;
        var key_num = stage.direction.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.move_buttons} ${Math.floor(key_num / 3)} ${key_num % 3}`);
            return true;
        }
        key_num = stage.card.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.hand_display} 0 ${key_num}`);
            return true;
        }
        key_num = stage.info.indexOf(key);
        if(key_num >= 0){
            display.click(UIIDS.move_info);
            return true;
        }
        key_num = stage.retry.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.retry_button} 0 0`);
            return true;
        }
        return false;
    }
    shop(key){
        var shop = this.#controls.shop;
        var key_num = shop.add.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.add_card} 0 ${key_num + 1}`);
            return true;
        }
        var key_num = shop.remove.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.remove_card} 0 ${key_num + 1}`);
            return true;
        }
        var key_num = shop.confirm.indexOf(key);
        if(key_num >= 0){
            display.click(UIIDS.shop_confirm);
            return true;
        }
        return false;
    }
    chest(key){
        var chest = this.#controls.chest;
        var key_num = chest.choose.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.contents} 0 ${key_num}`);
            return true;
        }
        var key_num = chest.confirm.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.chest_confirm_row} 0 ${1}`);
            return true;
        }
        var key_num = chest.reject.indexOf(key);
        if(key_num >= 0){
            display.click(`${UIIDS.chest_confirm_row} 0 ${0}`);
            return true;
        }
        return false;
    }
    toggle_press(key){
        if(this.#controls.toggle.alt.indexOf(key) >= 0){
            this.alternate_is_pressed = true;
            return true;
        }
        return false;
    }
    toggle_unpress(key){
        if(this.#controls.toggle.alt.indexOf(key) >= 0){
            this.alternate_is_pressed = false;
            return true;
        }
        return false;
    }
    static is_valid(controls){
        if(!same_structure(DEFAULT_CONTROLS, controls)){
            throw new Error(ERRORS.missing_property);
        }
        var toggle = KeyBind.#join_all(controls.toggle);
        var stage = [
            ...toggle,
            this.#join_all(controls.stage),
        ];
        var shop = [
            ...toggle,
            this.#join_all(controls.shop),
        ];
        var chest = [
            ...toggle,
            this.#join_all(controls.chest),
        ];
        for(var list of [toggle, stage, shop, chest]){
            var unique = new Set(list);
            if(unique.size !== list.length){
                return false;
            }
        }
        return true;
    }
    set(controls){
        this.#controls = controls;
        this.alternate_is_pressed = false;
    }
    get(){
        return {
            stage: {
                direction: [...this.#controls.stage.direction],
                card: [...this.#controls.stage.card],
                info: [...this.#controls.stage.info],
                retry: [...this.#controls.stage.retry],
            },
            shop: {
                add: [...this.#controls.shop.add],
                remove: [...this.#controls.shop.remove],
                confirm: [...this.#controls.shop.confirm],
            },
            chest: {
                choose: [...this.#controls.chest.choose],
                confirm: [...this.#controls.chest.confirm],
                reject: [...this.#controls.chest.reject],
            },
            toggle: {
                alt: [...this.#controls.toggle.alt],
            }
        }
    }
    static #join_all(obj){
        var list = [];
        for(var prop in obj){
            if(Array.isArray(prop)){
                list.concat(prop);
            }
        }
        return list;
    }
}
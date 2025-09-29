class Shop{
    #deck;
    #has_skill_trading;
    #has_stubborn;
    #add_row;
    #add_index;
    #remove_row;
    #remove_index;

    constructor(deck){
        this.#deck = deck;
        this.#has_skill_trading = GS.boons.has(boon_names.skill_trading) > 0;
        this.#has_stubborn = GS.boons.has(boon_names.stubborn) > 0;
        this.#generate_add_row();
        this.#generate_remove_row();
    }
    #generate_add_row(){
        var amount = ADD_CHOICE_COUNT + GS.boons.has(boon_names.picky_shopper);
        var add_list_generators = rand_no_repeats(COMMON_CARDS, amount);
        var index_of_rare = random_num(4);
        var rares = get_achievement_cards();
        if(index_of_rare < add_list_generators.length && rares.length > 0){
            var rare = rand_no_repeats(rares, 1);
            add_list_generators[index_of_rare] = rare[0];
        }
        this.#add_row = add_list_generators.map((g) => {return g()});
    }
    #generate_remove_row(){
        var amount = ADD_CHOICE_COUNT + GS.boons.has(boon_names.picky_shopper);
        this.#remove_row = this.#deck.get_rand_cards(amount);
    }
    select_add_row(index){
        if(!this.#has_skill_trading){
            this.#remove_index = undefined;
        }
        if(this.#add_index === index){
            this.#add_index = undefined;
        }
        else{
            this.#add_index = index;
        }
    }
    select_remove_row(index){
        if(!this.#has_skill_trading){
            this.#add_index = undefined;
        }
        if(this.#remove_index === index){
            this.#remove_index = undefined;
        }
        else{
            this.#remove_index = index;
        }
    }
    get_add_row(){
        var s = this;
        var make_add_card = function(position){
            return function(){
                s.select_add_row(position);
            }
        }
        var row = this.#add_row.map((card, i) => {
            return {
                name: card.name,
                pic: card.pic,
                card,
                on_click: make_add_card(i),
                selected: s.#add_index === i
            }
        })
        row.unshift(symbol_add_card());
        return row;
    }
    get_remove_row(){
        var s = this;
        var make_remove_card = function(position){
            return function(){
                s.select_remove_row(position);
            }
        }
        var row = this.#remove_row.map((card, i) => {
            return {
                name: card.name,
                pic: card.pic,
                card,
                on_click: make_remove_card(i),
                selected: s.#remove_index === i
            }
        });
        var symbol = this.#remove_row.length > 0 ? symbol_remove_card() : symbol_deck_at_minimum();
        row.unshift(symbol);
        return row;
    }
    confirm(){
        if(this.#add_index !== undefined){
            this.#deck.add(this.#add_row[this.#add_index]);
        }
        if(this.#remove_index !== undefined){
            this.#deck.remove(this.#remove_row[this.#remove_index].id);
        }
    }
    is_valid_selection(){
        var adding = this.#add_index !== undefined;
        var removing = this.#remove_index !== undefined;
        var valid =
            (adding || removing && !(adding && removing)) ||            // Normal
            (this.#has_skill_trading ? adding || removing : false) ||   // Skill Trading
            (this.#has_stubborn ? !adding && !removing : false)         // Stubborn
        return valid;
    }
}
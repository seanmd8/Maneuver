
class DeckSelector{
    #deck;
    #cards;
    #selected;
    #action;
    constructor(deck, action){
        this.#deck = deck;
        this.#cards = deck.get_deck_info();
        this.#selected = undefined;
        this.#action = action;
    }
    select(index){
        if(index >= 0 && index < this.#deck.deck_size()){
            this.#selected = index;
            return true;
        }
        return false;
    }
    check_valid(){
        return this.#selected !== undefined;
    }
    confirm(){
        if(this.check_valid()){
            this.#action(this.#cards[this.#selected], this.#deck);
        }
    }
    get_display_info(){
        return this.#cards.map((card, i) => {
            return {
                name: card.name,
                pic: card.pic,
                card,
                on_click: () => {this.select(i)},
                selected: this.#selected === i
            }
        });
    }
}
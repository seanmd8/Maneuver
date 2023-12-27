// ----------------MoveDeck.js----------------
// The MoveDeck class contains the player's current deck of move cards.

class MoveDeck{
    #list; // The list of all cards they have.
    #library; // The list of cards in their draw pile.
    #hand; // The list of cards curently usable.
    #discard_pile; // The list of cards they have used since they reshuffled.
    #id_count; // Used to give each card a unique id.
    constructor(){
        this.#list = [];
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        this.#id_count = 0;
    }
    #shuffle(arr){
        // returns a new array which is a randomly ordered version of the previous one.
        var new_arr = [];
        while(arr.length != 0){
            var ran = random_num(arr.length);
            new_arr.push(arr[ran]);
            arr[ran] = arr[arr.length - 1];
            arr.pop();
        }
        return new_arr;
    }
    deal(){
        // Shuffles all cards together then deals a new hand.
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        for(var i = 0; i < this.#list.length; ++i){
            this.#library.push(this.#list[i]);
        }
        this.#library = this.#shuffle(this.#library);
        for(var i = 0; i < HAND_SIZE; ++i){
            this.#hand.push(this.#library.pop());
        }
    }
    discard(x){
        // Makes player discard the card at position x from their hand and draw a new one. 
        // If the library is empty, it will first shuffle in the discard. 
        // Throws an error if x doens't correspond to a card in hand.
        if(x >= this.#hand.length || x < 0){
            throw new Error(`hand out of bounds`);
        }
        if(this.#library.length === 0){
            while(this.#discard_pile.length != 0){
                this.#library.push(this.#discard_pile.pop());
            }
            this.#library = this.#shuffle(this.#library);
        }
        if(!(this.#hand[x].hasOwnProperty(`temp`) && this.#hand[x].temp === true)){
            this.#discard_pile.push(this.#hand[x]);
        }
        this.#hand[x] = this.#library.pop();
    }
    add(card){
        // Adds a new card to the list.
        card.id = this.#id_count;
        this.#id_count++;
        this.#list.push(card);
    }
    add_temp(card){
        // Adds a temp card which will be removed at the end of the floor by only adding it to the library, not the list
        card.id = this.#id_count;
        card.temp = true;
        this.#id_count++;
        this.#library.push(card);
        this.#library = this.#shuffle(this.#library);
    }
    display_hand(table){
        // Displays the hand to the given table.
        while(table.rows.length > 0){
            table.deleteRow(0);
        }
        var row = document.createElement(`tr`);
        row.id = `hand`;
        var prep_move = function(move, hand_pos){return function(){
            deck.select(hand_pos);
            move.options.show_buttons(`moveButtons`, hand_pos);
        }};
        for(var i = 0; i < this.#hand.length; ++i){
            var cell =  make_cell(`hand ${i}`, `images/cards/${this.#hand[i].pic}`, HAND_SCALE, prep_move, this.#hand[i], i);
			row.append(cell);
        }
        table.append(row);
    }
    display_all(table){
        // Displays the deck list to the given table.
        document.getElementById(`currentDeck`).innerText = `${current_deck}${DECK_MINIMUM}):`;
        for(var i = 0; i < Math.ceil(this.#list.length / DECK_DISPLAY_WIDTH); ++i){
            var row = document.createElement(`tr`);
            for(var j = 0; j < DECK_DISPLAY_WIDTH && j + i * DECK_DISPLAY_WIDTH < this.#list.length; ++j){
                var cell =  make_cell(`card ${i * DECK_DISPLAY_WIDTH + j}`, `images/cards/${this.#list[i * DECK_DISPLAY_WIDTH + j].pic}`, HAND_SCALE);
			    row.append(cell);
            }
            table.append(row);
        }
    }
    get_rand_arr(size){
        if(this.#list.length <= DECK_MINIMUM){
            return []
        }
        return rand_no_repeates(this.#list, size);
    }
    remove(id){
        // Removes the card with the given id from the deck.
        // Returns false if it could not be found.
        for(var i = 0; i < this.#list.length; ++i){
            if(this.#list[i].id === id){
                this.#list[i] = this.#list[this.#list.length - 1];
                this.#list.pop();
                return true;
            }
        }
        return false;
    }
    select(hand_pos){
        for(var i = 0; i < this.#hand.length; ++i){
            document.getElementById(`hand ${i} img`).border = ``;
        }
        document.getElementById(`hand ${hand_pos} img`).border = `3px solid #555`;
    }
}
const HAND_SIZE = 3;
const HAND_SCALE = 100;

class MoveDeck{
    #list;
    #library;
    #hand;
    #discard_pile;
    constructor(){
        this.#list = [];
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
    }
    #shuffle(arr){
        var new_arr = [];
        while(arr.length != 0){
            var ran = Math.floor(Math.random() * arr.length);
            new_arr.push(arr[ran]);
            arr[ran] = arr[arr.length - 1];
            arr.pop();
        }
        return new_arr;
    }
    deal(){
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
        if(x >= this.#hand.length){
            throw new Error('hand out of bounds');
        }
        if(this.#library.length === 0){
            while(this.#discard_pile.length != 0){
                this.#library.push(this.#discard_pile.pop());
            }
            this.#library = this.#shuffle(this.#library);
        }
        this.#discard_pile.push(this.#hand[x]);
        this.#hand[x] = this.#library.pop();
    }
    add(card){
        this.#list.push(card);
    }
    add_temp(card){
        this.#library.push(card);
        this.#library = this.#shuffle(this.#library);
    }
    display_hand(table){
        while(table.rows.length > 0){
            table.deleteRow(0);
        }
        var row = document.createElement('tr');
        row.id = "hand";
        for(var i = 0; i < this.#hand.length; ++i){
            var cell = document.createElement('td');
			cell.id = "card " + i;
            var image = document.createElement('img');
            image.src = "images/cards/" + this.#hand[i].pic;
            image.height = HAND_SCALE;
            image.width = HAND_SCALE;
            var prep = function(move, hand_pos){return function(){prep_move(move, hand_pos)}};
            image.onclick = prep(this.#hand[i], i);
			cell.append(image);
			row.append(cell);
        }
        table.append(row);
    }
}
class PageSelector{
    #on_update
    #max
    #current

    constructor(on_update, max, initial = 0){
        this.#on_update = on_update;
        this.#max = max - 1;
        this.#current = initial;
        this.#on_update(this.#current);
    }
    current(){
        return this.#current;
    }
    move(difference){
        this.set(this.#current + difference);
    }
    set_max(){
        this.set(this.#max);
    }
    set(num){
        const initial = this.#current;
        var current = num;
        current = Math.min(current, this.#max);
        current = Math.max(current, 0);
        this.#current = current;
        if(initial !== this.#current){
            this.#on_update(this.#current);
        }
    }
    at_min(){
        return this.#current === 0;
    }
    at_max(){
        return this.#current === this.#max;
    }
    valid_move(n){
        var updated = this.#current+ n;
        return 0 <= updated && updated <= this.#max;
    }
}
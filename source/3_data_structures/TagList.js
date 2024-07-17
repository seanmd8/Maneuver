

class TagList{
    #tags;
    constructor(list=[]){
        this.#tags = [...list];
    }
    add(tag){
        if(!this.has(tag)){
            this.#tags.push(tag)
        }
    }
    remove(tag){
        var start_len = this.#tags.length;
        this.#tags = this.#tags.filter(t => t !== tag);
        return start_len === this.#tags,length;
    }
    has(tag){
        return this.#tags.indexOf(tag) !== -1;
    }

}
// ----------------TagList.js----------------
// Class to contain a list of tags for true or false questions about a tile.
class TagList{
    #tags;
    constructor(list=[]){
        for(var element of list){
            if(typeof element !== `string`){
                throw new Error(ERRORS.invalid_type);
            }
        }
        this.#tags = [...list];
    }
    add(tag){
        if(!this.has(tag)){
            this.#tags.push(tag);
        }
    }
    remove(tag){
        if(typeof tag !== `string`){
            throw new Error(ERRORS.invalid_type);
        }
        var start_len = this.#tags.length;
        this.#tags = this.#tags.filter(t => t !== tag);
        return start_len > this.#tags.length;
    }
    has(tag){
        if(typeof tag !== `string`){
            throw new Error(ERRORS.invalid_type);
        }
        return this.#tags.indexOf(tag) !== -1;
    }
}
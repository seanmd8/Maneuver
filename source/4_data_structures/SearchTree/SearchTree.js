class SearchTree{
    // Singleton BST that can convert to and from a sorted list.
    #root
    #node
    constructor(list = [], node = SearchTreeNode){
        this.#root = undefined;
        this.#node = node;
        this.add_all(list);
    }
    add(str){
        var to_add = new this.#node(str);
        if(this.#root === undefined){
            this.#root = to_add;
            return true;
        }
        var current = this.#root;
        while(current !== undefined){
            switch(current.compare(to_add)){
                case -1:
                    if(current.left === undefined){
                        current.left = to_add;
                        current = undefined;
                    }
                    else{
                        current = current.left;
                    }
                    break;
                case 0:
                    return false;
                case 1:
                    if(current.right === undefined){
                        current.right = to_add;
                        current = undefined;
                    }
                    else{
                        current = current.right;
                    }
                    break;
            }
        }
        return true;
    }
    has(str){
        var current = this.#root;
        while(current !== undefined){
            switch(current.compare(str)){
                case -1:
                    current = current.left;
                    break;
                case 0:
                    return true;
                case 1:
                    current = current.right;
                    break;
            }
        }
        return false;
    }
    to_list(){
        return this.#recursive_to_list(this.#root);
    }
    #recursive_to_list(current){
        if(current === undefined){
            return [];
        }
        return [
            ...this.#recursive_to_list(current.left), 
            current.data, 
            ...this.#recursive_to_list(current.right)
        ];
    }
    remove_all(){
        this.#root = undefined;
    }
    add_all(list){
        if(list.length > 0){
            var half = Math.floor(list.length / 2);
            this.add(list[half]);
            this.add_all(list.slice(0, half));
            this.add_all(list.slice(half + 1, list.length));
        }
    }
    get_node(str){
        var current = this.#root;
        while(current !== undefined){
            switch(current.compare(str)){
                case -1:
                    current = current.left;
                    break;
                case 0:
                    return current;
                case 1:
                    current = current.right;
                    break;
            }
        }
        return undefined;
    }
}
class AreaTreeNode{
    data;
    left;
    right;
    constructor(data){
        switch(typeof data){
            case `string`:
                this.data = {
                    name: data,
                    visited: 0,
                    cleared: 0,
                }
                break;
            case `object`:
                if(data.name === undefined){
                    throw Error(ERRORS.missing_property);
                }
                data.visited = data.visited ? data.visited : 0;
                data.cleared = data.cleared ? data.cleared : 0;
                this.data = data;
                break;
            default:
                throw Error(ERRORS.invalid_type);
        }
    }
    compare(node){
        var other = node instanceof AreaTreeNode ? node.data : node;
        other = typeof other === `object` ? other.name : other;
        if(this.data.name < other){
            return -1;
        }
        if(this.data.name > other){
            return 1;
        }
        return 0;
    }
    visit(){
        ++this.data.visited;
    }
    clear(){
        ++this.data.cleared;
    }
}
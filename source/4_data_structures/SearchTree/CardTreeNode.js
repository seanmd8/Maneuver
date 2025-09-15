class CardTreeNode{
    data;
    left;
    right;
    constructor(data){
        switch(typeof data){
            case `string`:
                this.data = {
                    name: data,
                    picked: 0,
                    removed: 0,
                }
                break;
            case `object`:
                if(data.name === undefined){
                    throw Error(ERRORS.missing_property);
                }
                data.picked = data.picked ? data.picked : 0;
                data.removed = data.removed ? data.removed : 0;
                this.data = data;
                break;
            default:
                throw Error(ERRORS.invalid_type);
        }
    }
    compare(node){
        var other = node instanceof CardTreeNode ? node.data : node;
        other = typeof other === `object` ? other.name : other;
        if(this.data.name < other){
            return -1;
        }
        if(this.data.name > other){
            return 1;
        }
        return 0;
    }
    pick(){
        ++this.data.picked;
    }
    remove(){
        ++this.data.removed;
    }
}
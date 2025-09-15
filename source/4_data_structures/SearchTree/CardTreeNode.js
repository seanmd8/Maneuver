class CardTreeNode{
    data;
    left;
    right;
    constructor(data){
        switch(typeof data){
            case `string`:
                this.data = {
                    name: data,
                    added: 0,
                    killed_by: 0,
                }
                break;
            case `object`:
                if(data.name === undefined){
                    throw Error(ERRORS.missing_property);
                }
                data.added = data.added ? data.added : 0;
                data.killed_by = data.killed_by ? data.killed_by : 0;
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
    add(){
        ++this.data.added;
    }
    remove(){
        ++this.data.killed_by;
    }
}
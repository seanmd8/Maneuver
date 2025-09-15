class TileTreeNode{
    data;
    left;
    right;
    constructor(data){
        switch(typeof data){
            case `string`:
                this.data = {
                    name: data,
                    killed: 0,
                    killed_by: 0,
                }
                break;
            case `object`:
                if(data.name === undefined){
                    throw Error(ERRORS.missing_property);
                }
                data.killed = data.killed ? data.killed : 0;
                data.killed_by = data.killed_by ? data.killed_by : 0;
                this.data = data;
                break;
            default:
                throw Error(ERRORS.invalid_type);
        }
    }
    compare(node){
        var other = node instanceof SearchTreeNode ? node.data : node;
        other = typeof other === `object` ? other.name : other;
        if(this.data.name < other){
            return -1;
        }
        if(this.data.name > other){
            return 1;
        }
        return 0;
    }
    kill(){
        ++this.data.killed;
    }
    die_to(){
        ++this.data.killed_by;
    }
}
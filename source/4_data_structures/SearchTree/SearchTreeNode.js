
class SearchTreeNode{
    data;
    left;
    right;
    constructor(data){
        this.data = data;
    }
    compare(node){
        var other = node instanceof SearchTreeNode ? node.data : node;
        if(this.data < other){
            return -1;
        }
        if(this.data > other){
            return 1;
        }
        return 0;
    }
}
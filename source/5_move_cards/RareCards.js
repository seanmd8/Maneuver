/** @type {CardGenerator}*/
function teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pteleport(0, 0)]);
    return{
        name: `teleport`,
        pic: `${IMG_FOLDER.cards}teleport.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pstun(0, 0), pstun(0, 0), pteleport(0, 0), pinstant(0, 0)]);
    return{
        name: `reckless teleport`,
        pic: `${IMG_FOLDER.cards}reckless_teleport.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_w(){
    var options = new ButtonGrid();
    options.add_button(W, [pmove(-1, 0), pinstant(0, 0)]);
    return{
        name: `sidestep west`,
        pic: `${IMG_FOLDER.cards}sidestep_w.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_e(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pinstant(0, 0)]);
    return{
        name: `sidestep east`,
        pic: `${IMG_FOLDER.cards}sidestep_e.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_n(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pinstant(0, 0)]);
    return{
        name: `sidestep north`,
        pic: `${IMG_FOLDER.cards}sidestep_n.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_s(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1), pinstant(0, 0)]);
    return{
        name: `sidestep south`,
        pic: `${IMG_FOLDER.cards}sidestep_s.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-1, -1), pinstant(0, 0)]);
    return{
        name: `sidestep nw`,
        pic: `${IMG_FOLDER.cards}sidestep_nw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pinstant(0, 0)]);
    return{
        name: `sidestep ne`,
        pic: `${IMG_FOLDER.cards}sidestep_ne.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1), pinstant(0, 0)]);
    return{
        name: `sidestep se`,
        pic: `${IMG_FOLDER.cards}sidestep_se.png`,
        options
    }
}
/** @type {CardGenerator}*/
function sidestep_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1), pinstant(0, 0)]);
    return{
        name: `sidestep sw`,
        pic: `${IMG_FOLDER.cards}sidestep_sw.png`,
        options
    }
}
/** @type {CardGenerator}*/
function punch_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pinstant(0, 0)]);
    options.add_button(E, [pattack(1, 0), pinstant(0, 0)]);
    options.add_button(S, [pattack(0, 1), pinstant(0, 0)]);
    options.add_button(W, [pattack(-1, 0), pinstant(0, 0)]);
    return{
        name: `punch orthogonal`,
        pic: `${IMG_FOLDER.cards}punch_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function punch_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1), pinstant(0, 0)]);
    options.add_button(SE, [pattack(1, 1), pinstant(0, 0)]);
    options.add_button(SW, [pattack(-1, 1), pinstant(0, 0)]);
    options.add_button(NW, [pattack(-1, -1), pinstant(0, 0)]);
    return{
        name: `punch diagonal`,
        pic: `${IMG_FOLDER.cards}punch_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_attack_right(){
    var options = new ButtonGrid();
    options.add_button(E, [pstun(0, 0), pattack(0, 1), pattack(0, 1), pattack(0, -1), pattack(0, -1),
        pattack(1, 0), pattack(1, 0), pattack(1, 1), pattack(1, 1), pattack(1, -1), pattack(1, -1)]);
    return{
        name: `reckless attack right`,
        pic: `${IMG_FOLDER.cards}reckless_attack_right.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_attack_left(){
    var options = new ButtonGrid();
    options.add_button(W, [pstun(0, 0), pattack(0, 1), pattack(0, 1), pattack(0, -1), pattack(0, -1),
        pattack(-1, 0), pattack(-1, 0), pattack(-1, 1), pattack(-1, 1), pattack(-1, -1), pattack(-1, -1)]);
    return{
        name: `reckless attack left`,
        pic: `${IMG_FOLDER.cards}reckless_attack_left.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_sprint(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, 0), pstun(0, 0), pmove(0, -1), pmove(0, -1), pmove(0, -1)]);
    options.add_button(E, [pstun(0, 0), pstun(0, 0), pmove(1, 0), pmove(1, 0), pmove(1, 0)]);
    options.add_button(S, [pstun(0, 0), pstun(0, 0), pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    options.add_button(W, [pstun(0, 0), pstun(0, 0), pmove(-1, 0), pmove(-1, 0), pmove(-1, 0)]);
    return{
        name: `reckless sprint`,
        pic: `${IMG_FOLDER.cards}reckless_sprint.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, 0), pmove(0, -1), pinstant(0, 0)]);
    options.add_button(E, [pstun(0, 0), pmove(1, 0), pinstant(0, 0)]);
    options.add_button(S, [pstun(0, 0), pmove(0, 1), pinstant(0, 0)]);
    options.add_button(W, [pstun(0, 0), pmove(-1, 0), pinstant(0, 0)]);
    return{
        name: `reckless horizontal`,
        pic: `${IMG_FOLDER.cards}reckless_horizontal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function reckless_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pstun(0, 0), pmove(1, -1), pinstant(0, 0)]);
    options.add_button(SE, [pstun(0, 0), pmove(1, 1), pinstant(0, 0)]);
    options.add_button(SW, [pstun(0, 0), pmove(-1, 1), pinstant(0, 0)]);
    options.add_button(NW, [pstun(0, 0), pmove(-1, -1), pinstant(0, 0)]);
    return{
        name: `reckless diagonal`,
        pic: `${IMG_FOLDER.cards}reckless_diagonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_punch_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, -1), pstun(0, -1), pinstant(0, 0)]);
    options.add_button(E, [pstun(1, 0), pstun(1, 0), pinstant(0, 0)]);
    options.add_button(S, [pstun(0, 1), pstun(0, 1), pinstant(0, 0)]);
    options.add_button(W, [pstun(-1, 0), pstun(-1, 0), pinstant(0, 0)]);
    return{
        name: `stunning punch orthogonal`,
        pic: `${IMG_FOLDER.cards}stunning_punch_orthogonal.png`,
        options
    }
}
/** @type {CardGenerator}*/
function stunning_punch_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pstun(1, -1), pstun(1, -1), pinstant(0, 0)]);
    options.add_button(SE, [pstun(1, 1), pstun(1, 1), pinstant(0, 0)]);
    options.add_button(SW, [pstun(-1, 1), pstun(-1, 1), pinstant(0, 0)]);
    options.add_button(NW, [pstun(-1, -1), pstun(-1, -1), pinstant(0, 0)]);
    return{
        name: `stunning punch diagonal`,
        pic: `${IMG_FOLDER.cards}stunning_punch_diagonal.png`,
        options
    }
}
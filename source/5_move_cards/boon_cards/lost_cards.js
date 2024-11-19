/** @type {CardGenerator}*/
function lost_technique(){
    var options = new ButtonGrid();
    options.add_button(C, [], 5);
    return{
        name: `lost technique`,
        pic: `${IMG_FOLDER.cards}lost_technique.png`,
        options,
        evolutions: [chipped_split_second, chipped_execution, chipped_superweapon]
    }
}

/** @type {CardGenerator}*/
function lost_maneuver(){
    var options = new ButtonGrid();
    options.add_button(C, [], 5);
    return{
        name: `lost maneuver`,
        pic: `${IMG_FOLDER.cards}lost_maneuver.png`,
        options,
        evolutions: [simple_maneuver]
    }
}


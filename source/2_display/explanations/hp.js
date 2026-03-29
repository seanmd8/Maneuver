function hp_description(tile){
    var hp = hp_ratio(tile);
    if(hp !== ``){
        hp = `(${hp} ${gameplay_labels.hp}) `;
    }
    var stunned = ``;
    if(tile.stun !== undefined && tile.stun > 0){
        stunned = `*${gameplay_text.stunned}${tile.stun}* `;
    }
    return `${hp}${stunned}`;
}
function hp_ratio(tile){
    if(tile.max_health !== undefined){
        return `${get_tile_health(tile)}/${tile.max_health}`;
    }
    if(get_tile_health(tile) !== undefined){
        return `${get_tile_health(tile)}`;
    }
    return ``;
}
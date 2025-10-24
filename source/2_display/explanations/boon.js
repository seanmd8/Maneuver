function explain_boon(boon){
    var cost = boon.cost_description ? `\n${boon.cost_description}` : ``;
    return `${boon.name}: ${boon.description}${cost}`;
}
function explain_boon_with_picked(boon){
    var description = explain_boon(boon);
    var prepayed = GS.boons.has(boon_names.soul_voucher) && boon.cost_description !== undefined ? 
        `\n${boon_messages.soul_voucher}` : ``;
    var node = GS.data.boons.get_node(boon.name);
    var picked = node !== undefined ? 
        `\n\n${boon_messages.number_picked}: ${node.data.picked}.` : ``;
    return `${description}${prepayed}${picked}`;
}
function explain_boon_with_stats(boon){
    var description = explain_boon(boon);
    var prereq = boon.prereq_description;
    var max = `${boon_messages.max}: ${boon.max ? boon.max : boon_messages.no_max}.`;
    var picked = ``;
    var node = GS.data.boons.get_node(boon.name);
    if(node !== undefined){
        picked = `${boon_messages.number_picked}: ${node.data.picked}.`
    }
    return `${description}\n\n${max}\n\n${prereq}\n\n${picked}`;
}
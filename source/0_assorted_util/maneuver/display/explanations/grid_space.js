/**
 * Function to create the combined description of everything happening on a space of the game map.
 * @param {GridSpace} space The space to get a description of.
 * @returns {string} The properly formatted description.
 */
function grid_space_description(space){
    var tile = space.tile.look === undefined ? space.tile : space.tile.look;
    tile = tile_description(tile);
    var foreground = space.foreground.filter((fg) => fg.description !== undefined);
    foreground = foreground.map((fg) => `${gameplay_text.divider}${fg.description}`);
    var background = space.background.filter((bg) => bg.description !== undefined);
    background = background.map((bg) => `${gameplay_text.divider}${bg.description}`);
    var descriptions = [tile, ...foreground, ...background];
    return descriptions.reduce((res, str) => `${res}${str}`);
}

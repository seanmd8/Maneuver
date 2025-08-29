/**
 * Function to display the player's current and max health.
 * @param {Tile} player The player to get health from.
 * @param {number} scale The size of the display images.
 */
function display_health(player, scale){
    if(player.health === undefined){
        throw new Error(ERRORS.missing_property);
    }
    var health = [];
    for(var i = 0; i < player.health; ++i){
        health.push({
            pic: `${IMG_FOLDER.other}heart.png`, 
            name: `heart`
        });
    }
    if(player.max_health !== undefined){
        for(var i = 0; i < (player.max_health - player.health); ++i){
            health.push({
                pic: `${IMG_FOLDER.other}heart_broken.png`, 
                name: `broken heart`
            });
        }
    }
    display.add_tb_row(UIIDS.health_display, health, scale);
}
